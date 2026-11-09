/**
 * Faz 1/2 köprüsü — kaynak, tahsis ve rezervasyon çekirdeği.
 * Kapasite ve çakışma garantisi VERİTABANI düzeyindedir (trigger + kilit + exclusion):
 * uygulama hatası ya da eşzamanlı istek olsa bile aşım/çakışma kaydedilemez.
 * 001-foundation'a bağlıdır (users, customers, organizations).
 */
export const up: string[] = [
  `CREATE EXTENSION IF NOT EXISTS btree_gist`,

  `CREATE TABLE resource_types (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code varchar(40) NOT NULL UNIQUE,
    name varchar(100) NOT NULL,
    capacity_unit varchar(30) NOT NULL DEFAULT 'adet',
    active boolean NOT NULL DEFAULT true
  )`,
  `CREATE TABLE resources (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code varchar(40) NOT NULL UNIQUE,
    name varchar(150) NOT NULL,
    type_id uuid NOT NULL REFERENCES resource_types(id),
    capacity int NOT NULL DEFAULT 1 CHECK (capacity >= 0),
    quantity int NOT NULL DEFAULT 1 CHECK (quantity >= 0),
    -- true: aynı anda tek rezervasyon (saha, oda). false: toplam adet/kapasite aşılamaz (yemekhane, ekipman).
    exclusive boolean NOT NULL DEFAULT true,
    maintenance_status varchar(12) NOT NULL DEFAULT 'OK' CHECK (maintenance_status IN ('OK','MAINTENANCE','CLOSED')),
    is_demo boolean NOT NULL DEFAULT false,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz
  )`,
  `CREATE TABLE resource_blocks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    period tstzrange NOT NULL CHECK (NOT isempty(period)),
    kind varchar(12) NOT NULL CHECK (kind IN ('MAINTENANCE','CLOSED')),
    reason varchar(300) NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX resource_blocks_ix ON resource_blocks USING gist (resource_id, period)`,

  // --- Rezervasyon numarası: yıl başına sayaç; UPSERT ile çakışmasız ---
  `CREATE TABLE booking_numbers (
    year int PRIMARY KEY,
    last_value int NOT NULL DEFAULT 0
  )`,
  `CREATE FUNCTION next_booking_number(p_year int) RETURNS text LANGUAGE plpgsql AS $$
   DECLARE n int;
   BEGIN
     INSERT INTO booking_numbers (year, last_value) VALUES (p_year, 1)
       ON CONFLICT (year) DO UPDATE SET last_value = booking_numbers.last_value + 1
       RETURNING last_value INTO n;
     RETURN 'HIC-' || p_year::text || '-' || lpad(n::text, 6, '0');
   END $$`,

  `CREATE TABLE bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    number varchar(20) NOT NULL UNIQUE,
    source varchar(14) NOT NULL CHECK (source IN ('B2C_WEBSITE','B2B_PORTAL','ADMIN_PANEL','MANUAL_ENTRY')),
    customer_id uuid NOT NULL REFERENCES customers(id),
    organization_id uuid REFERENCES organizations(id),
    status varchar(28) NOT NULL DEFAULT 'DRAFT' CHECK (status IN (
      'DRAFT','SUBMITTED','UNDER_REVIEW','QUOTATION_PREPARED','AWAITING_CUSTOMER_APPROVAL',
      'AWAITING_ADMIN_APPROVAL','CONFIRMED','CHECKED_IN','IN_PROGRESS','COMPLETED',
      'CANCELLATION_REQUESTED','CANCELLED','REJECTED','EXPIRED')),
    payment_status varchar(20) NOT NULL DEFAULT 'UNPAID' CHECK (payment_status IN
      ('UNPAID','PARTIALLY_PAID','PAID','REFUNDED','PARTIALLY_REFUNDED')),
    start_date date,
    end_date date,
    participant_count int CHECK (participant_count IS NULL OR participant_count > 0),
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid REFERENCES users(id),
    CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
  )`,
  `CREATE INDEX bookings_org_status_ix ON bookings (organization_id, status)`,
  `CREATE INDEX bookings_start_ix ON bookings (start_date)`,

  `CREATE TABLE booking_status_history (
    id bigserial PRIMARY KEY,
    booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    from_status varchar(28),
    to_status varchar(28) NOT NULL,
    user_id uuid REFERENCES users(id),
    note varchar(500) NOT NULL DEFAULT '',
    at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX booking_status_history_ix ON booking_status_history (booking_id, at)`,

  `CREATE TABLE resource_allocations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id uuid NOT NULL REFERENCES resources(id),
    booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    period tstzrange NOT NULL CHECK (NOT isempty(period)),
    quantity int NOT NULL DEFAULT 1 CHECK (quantity > 0),
    status varchar(10) NOT NULL DEFAULT 'HELD' CHECK (status IN ('HELD','CONFIRMED','RELEASED')),
    hold_expires_at timestamptz,
    exclusive boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    CHECK (status <> 'HELD' OR hold_expires_at IS NOT NULL)
  )`,
  `CREATE INDEX resource_allocations_booking_ix ON resource_allocations (booking_id)`,
  // Savunma hattı: tek-kullanımlı kaynakta aktif tahsisler zaman olarak kesişemez.
  `ALTER TABLE resource_allocations ADD CONSTRAINT resource_allocations_no_overlap
     EXCLUDE USING gist (resource_id WITH =, period WITH &&) WHERE (exclusive AND status <> 'RELEASED')`,

  // Eklemeden önce: kaynak satırını kilitle (eşzamanlı istekler sıraya girer), süresi dolan blokajları bırak,
  // kaynak uygunluğunu, bakım/kapatma çakışmasını ve adet kapasitesini doğrula.
  `CREATE FUNCTION resource_allocations_guard() RETURNS trigger LANGUAGE plpgsql AS $$
   DECLARE r resources%ROWTYPE; used int;
   BEGIN
     IF NEW.status = 'RELEASED' THEN RETURN NEW; END IF;
     SELECT * INTO r FROM resources WHERE id = NEW.resource_id FOR UPDATE;
     IF NOT FOUND OR r.deleted_at IS NOT NULL OR NOT r.active THEN
       RAISE EXCEPTION 'RESOURCE_UNAVAILABLE' USING ERRCODE = 'P0001';
     END IF;
     IF r.maintenance_status <> 'OK' THEN
       RAISE EXCEPTION 'RESOURCE_IN_MAINTENANCE' USING ERRCODE = 'P0001';
     END IF;
     IF EXISTS (SELECT 1 FROM resource_blocks b WHERE b.resource_id = NEW.resource_id AND b.period && NEW.period) THEN
       RAISE EXCEPTION 'RESOURCE_BLOCKED' USING ERRCODE = 'P0001';
     END IF;
     UPDATE resource_allocations SET status = 'RELEASED'
       WHERE resource_id = NEW.resource_id AND status = 'HELD' AND hold_expires_at < now();
     NEW.exclusive := r.exclusive;
     IF NOT r.exclusive THEN
       SELECT COALESCE(SUM(quantity), 0) INTO used FROM resource_allocations
         WHERE resource_id = NEW.resource_id AND status <> 'RELEASED' AND period && NEW.period;
       IF used + NEW.quantity > r.quantity THEN
         RAISE EXCEPTION 'CAPACITY_EXCEEDED' USING ERRCODE = 'P0001';
       END IF;
     ELSIF NEW.quantity > 1 THEN
       RAISE EXCEPTION 'CAPACITY_EXCEEDED' USING ERRCODE = 'P0001';
     END IF;
     RETURN NEW;
   END $$`,
  `CREATE TRIGGER resource_allocations_guard_ins BEFORE INSERT ON resource_allocations
     FOR EACH ROW EXECUTE FUNCTION resource_allocations_guard()`,
  // HELD → CONFIRMED geçişinde süresi dolmuş blokaj onaylanamaz.
  `CREATE FUNCTION resource_allocations_confirm_guard() RETURNS trigger LANGUAGE plpgsql AS $$
   BEGIN
     IF OLD.status = 'RELEASED' AND NEW.status <> 'RELEASED' THEN
       RAISE EXCEPTION 'ALLOCATION_ALREADY_RELEASED' USING ERRCODE = 'P0001';
     END IF;
     IF OLD.status = 'HELD' AND NEW.status = 'CONFIRMED' AND OLD.hold_expires_at < now() THEN
       RAISE EXCEPTION 'HOLD_EXPIRED' USING ERRCODE = 'P0001';
     END IF;
     RETURN NEW;
   END $$`,
  `CREATE TRIGGER resource_allocations_confirm_upd BEFORE UPDATE OF status ON resource_allocations
     FOR EACH ROW EXECUTE FUNCTION resource_allocations_confirm_guard()`,
];

export const down: string[] = [
  `DROP TRIGGER IF EXISTS resource_allocations_confirm_upd ON resource_allocations`,
  `DROP FUNCTION IF EXISTS resource_allocations_confirm_guard()`,
  `DROP TRIGGER IF EXISTS resource_allocations_guard_ins ON resource_allocations`,
  `DROP FUNCTION IF EXISTS resource_allocations_guard()`,
  `DROP TABLE IF EXISTS resource_allocations`,
  `DROP TABLE IF EXISTS booking_status_history`,
  `DROP TABLE IF EXISTS bookings`,
  `DROP FUNCTION IF EXISTS next_booking_number(int)`,
  `DROP TABLE IF EXISTS booking_numbers`,
  `DROP TABLE IF EXISTS resource_blocks`,
  `DROP TABLE IF EXISTS resources`,
  `DROP TABLE IF EXISTS resource_types`,
];
