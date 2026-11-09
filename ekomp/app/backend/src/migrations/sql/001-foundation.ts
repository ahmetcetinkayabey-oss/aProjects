/**
 * Faz 1 — Temel katman (kimlik, rol/izin, kurum, müşteri, audit log).
 * Düz SQL (PostgreSQL). Aynı metin hem TypeORM migration'ı hem PGlite testi tarafından kullanılır.
 * Mevcut tablolara (admin_users, forum_*, reservations …) DOKUNMAZ.
 */
export const up: string[] = [
  `CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email varchar(200) NOT NULL,
    password_hash varchar(300),
    full_name varchar(150) NOT NULL,
    phone varchar(30),
    user_type varchar(12) NOT NULL CHECK (user_type IN ('PERSONNEL','B2C','B2B')),
    status varchar(12) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','DISABLED','INVITED')),
    token_version int NOT NULL DEFAULT 0,
    last_login_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz
  )`,
  // E-posta büyük/küçük harfe duyarsız ve yalnızca silinmemiş kayıtlar arasında benzersiz.
  `CREATE UNIQUE INDEX users_email_uq ON users (lower(email)) WHERE deleted_at IS NULL`,

  `CREATE TABLE roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code varchar(50) NOT NULL UNIQUE,
    name varchar(100) NOT NULL,
    scope varchar(12) NOT NULL CHECK (scope IN ('PERSONNEL','B2B','B2C')),
    is_system boolean NOT NULL DEFAULT true
  )`,
  `CREATE TABLE permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code varchar(80) NOT NULL UNIQUE,
    description varchar(200) NOT NULL DEFAULT ''
  )`,
  `CREATE TABLE role_permissions (
    role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
  )`,

  `CREATE TABLE organization_types (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code varchar(40) NOT NULL UNIQUE,
    name varchar(100) NOT NULL,
    active boolean NOT NULL DEFAULT true
  )`,
  `CREATE TABLE organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code varchar(30) NOT NULL UNIQUE,
    name varchar(200) NOT NULL,
    type_id uuid REFERENCES organization_types(id),
    tax_no varchar(30),
    tax_office varchar(100),
    country varchar(80),
    city varchar(80),
    address text,
    phone varchar(30),
    email varchar(200),
    reservation_mode varchar(14) NOT NULL DEFAULT 'REQUEST_BASED'
      CHECK (reservation_mode IN ('DIRECT','REQUEST_BASED','HYBRID')),
    can_create_direct_booking boolean NOT NULL DEFAULT false,
    can_submit_request boolean NOT NULL DEFAULT true,
    requires_admin_approval boolean NOT NULL DEFAULT true,
    can_view_availability boolean NOT NULL DEFAULT false,
    can_view_prices boolean NOT NULL DEFAULT false,
    can_use_contract_prices boolean NOT NULL DEFAULT false,
    can_manage_teams boolean NOT NULL DEFAULT true,
    can_manage_athletes boolean NOT NULL DEFAULT true,
    can_view_invoices boolean NOT NULL DEFAULT false,
    can_view_financial_records boolean NOT NULL DEFAULT false,
    status varchar(10) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','ACTIVE','PASSIVE')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid REFERENCES users(id),
    deleted_at timestamptz
  )`,
  // Doğrudan rezervasyon yetkisi kipiyle çelişemez (DIRECT ⇒ direct açık, REQUEST_BASED ⇒ direct kapalı).
  `ALTER TABLE organizations ADD CONSTRAINT organizations_mode_flags_ck CHECK (
    (reservation_mode = 'DIRECT' AND can_create_direct_booking AND NOT can_submit_request)
    OR (reservation_mode = 'REQUEST_BASED' AND NOT can_create_direct_booking AND can_submit_request)
    OR (reservation_mode = 'HYBRID' AND can_create_direct_booking AND can_submit_request)
  )`,

  `CREATE TABLE organization_users (
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id uuid NOT NULL REFERENCES roles(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (organization_id, user_id)
  )`,
  `CREATE INDEX organization_users_user_ix ON organization_users (user_id)`,

  // Personel rolleri kurumsuz; B2B rolleri kurum kapsamı organization_users ile gelir.
  `CREATE TABLE user_roles (
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id uuid NOT NULL REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
  )`,

  `CREATE TABLE customers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    kind varchar(12) NOT NULL CHECK (kind IN ('INDIVIDUAL','ORGANIZATION')),
    user_id uuid REFERENCES users(id),
    organization_id uuid REFERENCES organizations(id),
    display_name varchar(200) NOT NULL,
    email varchar(200),
    phone varchar(30),
    notes text,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    CHECK ((kind = 'ORGANIZATION') = (organization_id IS NOT NULL))
  )`,
  `CREATE UNIQUE INDEX customers_org_uq ON customers (organization_id) WHERE organization_id IS NOT NULL`,
  `CREATE UNIQUE INDEX customers_user_uq ON customers (user_id) WHERE user_id IS NOT NULL AND kind = 'INDIVIDUAL'`,

  // Audit log yalnızca eklenir: güncelleme/silme trigger ile engellenir.
  `CREATE TABLE audit_logs (
    id bigserial PRIMARY KEY,
    user_id uuid,
    actor_label varchar(150),
    action varchar(80) NOT NULL,
    entity varchar(60) NOT NULL,
    entity_id varchar(64),
    before jsonb,
    after jsonb,
    ip varchar(64),
    at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX audit_logs_entity_ix ON audit_logs (entity, entity_id)`,
  `CREATE INDEX audit_logs_at_ix ON audit_logs (at)`,
  `CREATE FUNCTION audit_logs_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
   BEGIN
     RAISE EXCEPTION 'audit_logs kayitlari degistirilemez ve silinemez';
   END $$`,
  `CREATE TRIGGER audit_logs_no_change BEFORE UPDATE OR DELETE ON audit_logs
     FOR EACH ROW EXECUTE FUNCTION audit_logs_immutable()`,

  // --- Sistem rolleri ve izin kodları (veri değil, sabit tanım) ---
  `INSERT INTO roles (code, name, scope) VALUES
    ('SYSTEM_ADMIN','Sistem yöneticisi','PERSONNEL'),
    ('FACILITY_MANAGER','Tesis yöneticisi','PERSONNEL'),
    ('RESERVATION_OFFICER','Rezervasyon sorumlusu','PERSONNEL'),
    ('OPERATIONS_STAFF','Operasyon personeli','PERSONNEL'),
    ('FINANCE_OFFICER','Finans sorumlusu','PERSONNEL'),
    ('B2B_ORG_ADMIN','B2B kurum yöneticisi','B2B'),
    ('B2B_BOOKING_OFFICER','B2B rezervasyon yetkilisi','B2B'),
    ('B2B_TEAM_MANAGER','B2B takım yöneticisi','B2B'),
    ('B2B_ACCOUNTANT','B2B muhasebe yetkilisi','B2B'),
    ('INDIVIDUAL_CUSTOMER','Bireysel müşteri','B2C')`,
  `INSERT INTO permissions (code, description) VALUES
    ('user:manage','Kullanıcı ve rol yönetimi'),
    ('organization:manage','Kurum kayıtlarını yönetme'),
    ('organization:own','Kendi kurumunu yönetme'),
    ('customer:manage','Müşteri kayıtlarını yönetme'),
    ('service:manage','Hizmet ve kaynak yönetimi'),
    ('pricing:manage','Fiyat ve paket yönetimi'),
    ('booking:create','Rezervasyon/talep oluşturma'),
    ('booking:view_all','Tüm rezervasyonları görme'),
    ('booking:view_own','Yalnızca kendi/kurum rezervasyonlarını görme'),
    ('booking:approve','Rezervasyon onay/ret'),
    ('quotation:manage','Teklif yönetimi'),
    ('team:manage','Takım ve sporcu yönetimi'),
    ('finance:view','Finans kayıtlarını görme'),
    ('finance:record','Tahsilat ve iade kaydetme'),
    ('report:view','Raporları görme'),
    ('audit:view','Audit log görme')`,
  // Sistem yöneticisi: tüm izinler.
  `INSERT INTO role_permissions SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.code = 'SYSTEM_ADMIN'`,
  `INSERT INTO role_permissions SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN
    ('organization:manage','customer:manage','service:manage','pricing:manage','booking:create','booking:view_all',
     'booking:approve','quotation:manage','team:manage','finance:view','report:view','audit:view')
   WHERE r.code = 'FACILITY_MANAGER'`,
  `INSERT INTO role_permissions SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN
    ('organization:manage','customer:manage','booking:create','booking:view_all','booking:approve','quotation:manage','team:manage','report:view')
   WHERE r.code = 'RESERVATION_OFFICER'`,
  `INSERT INTO role_permissions SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN
    ('booking:view_all','service:manage')
   WHERE r.code = 'OPERATIONS_STAFF'`,
  `INSERT INTO role_permissions SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN
    ('booking:view_all','finance:view','finance:record','report:view')
   WHERE r.code = 'FINANCE_OFFICER'`,
  `INSERT INTO role_permissions SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN
    ('organization:own','booking:create','booking:view_own','team:manage','finance:view')
   WHERE r.code = 'B2B_ORG_ADMIN'`,
  `INSERT INTO role_permissions SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN
    ('booking:create','booking:view_own')
   WHERE r.code = 'B2B_BOOKING_OFFICER'`,
  `INSERT INTO role_permissions SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN
    ('booking:view_own','team:manage')
   WHERE r.code = 'B2B_TEAM_MANAGER'`,
  `INSERT INTO role_permissions SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN
    ('booking:view_own','finance:view')
   WHERE r.code = 'B2B_ACCOUNTANT'`,
  `INSERT INTO role_permissions SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN
    ('booking:create','booking:view_own')
   WHERE r.code = 'INDIVIDUAL_CUSTOMER'`,
  // Kurum türleri yönetimden değiştirilebilir; başlangıç listesi master prompt §4.2'den.
  `INSERT INTO organization_types (code, name) VALUES
    ('SPORTS_CLUB','Spor kulübü'),('FEDERATION','Federasyon'),('NATIONAL_TEAM','Milli takım'),
    ('ACADEMY','Spor akademisi'),('UNIVERSITY','Üniversite'),('SPORTS_AGENCY','Spor acentesi'),
    ('TOUR_OPERATOR','Tur operatörü'),('PUBLIC_BODY','Kamu kurumu'),('PRIVATE_COMPANY','Özel şirket'),('OTHER','Diğer')`,
];

export const down: string[] = [
  `DROP TRIGGER IF EXISTS audit_logs_no_change ON audit_logs`,
  `DROP FUNCTION IF EXISTS audit_logs_immutable()`,
  `DROP TABLE IF EXISTS audit_logs`,
  `DROP TABLE IF EXISTS customers`,
  `DROP TABLE IF EXISTS user_roles`,
  `DROP TABLE IF EXISTS organization_users`,
  `DROP TABLE IF EXISTS organizations`,
  `DROP TABLE IF EXISTS organization_types`,
  `DROP TABLE IF EXISTS role_permissions`,
  `DROP TABLE IF EXISTS permissions`,
  `DROP TABLE IF EXISTS roles`,
  `DROP TABLE IF EXISTS users`,
];
