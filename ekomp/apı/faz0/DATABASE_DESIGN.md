# DATABASE_DESIGN — taslak (uygulanmadı)

Ad kuralı: mevcut tablolar gibi `snake_case`, çoğul; PK `uuid`; her tabloda `created_at`, `updated_at`, gereken yerde `created_by`, `updated_by`, `deleted_at` (soft delete yalnızca müşteri/kurum/hizmet/kaynak/belge için). Para `numeric(12,2)`.

## 0. Mevcut tablolarla ilişki
- `reservations` (mevcut talep formu) **değişmeden kalır** (public form çalışmaya devam eder). Yeni motor `bookings` adlı tabloyu kullanır; böylece ad çakışması ve veri kaybı olmaz. Eski talepler panelden "rezervasyona dönüştür" ile `bookings`'e aktarılabilir (Faz 3).
- `admin_users`, `forum_*`, `facilities`, `news`, `feedback`, `site_content`, `app_settings` aynen korunur.

## 1. Identity
`users`(id, email unique, password_hash, full_name, phone, user_type[PERSONNEL|B2C|B2B], status, last_login_at) · `roles`(id, code unique, name) · `permissions`(id, code unique) · `role_permissions` · `user_roles`(user_id, role_id, organization_id null).

## 2. Organization / Customer
`organizations`(id, code unique, name, type_id, tax_no, tax_office, country, city, address, phone, email, reservation_mode, can_* bayrakları (bkz. B2B_WORKFLOW), requires_admin_approval, payment_terms, credit_limit null, active) · `organization_types`(dinamik) · `organization_users`(organization_id, user_id, org_role, permissions jsonb) · `customers`(id, kind[INDIVIDUAL|ORGANIZATION], user_id null, organization_id null) · `customer_contacts` · `customer_addresses`.

## 3. Sports
`teams`(organization_id, name, branch, age_category, gender_category, manager_user_id, active) · `athletes`(first_name, last_name, birth_date null, nationality null, license_no null, branch) · `team_athletes` · `coaches`(user/contact bağlantısı).

## 4. Catalog
`service_categories`(dinamik) · `services`(code unique, name, category_id, description, unit, booking_model[DURATION|TIME_SLOT|CAPACITY|QUANTITY], min/max_duration, slot_minutes, capacity, advance_days, cancellation_policy_id, requires_approval, requires_resource, pricing_model, tax_rate, active) · `service_variants` · `service_resource_requirements`(service_id, resource_type_id|resource_id, mandatory, alternative_group, quantity, capacity_needed, usage_minutes, prep_minutes, allocation_rule) · `packages`, `package_services`.

## 5. Facility & Resource
`facilities`'e dokunmamak için yeni: `locations`(id, name, parent_id) · `resource_types`(dinamik, capacity_unit) · `resources`(code unique, name, type_id, location_id, capacity, quantity, maintenance_status, active) · `resource_schedules`(resource_id, weekday, opens, closes) · `resource_blocks`(resource_id, range tstzrange, reason, kind[MAINTENANCE|CLOSED|HOLD]) · `resource_allocations`(id, resource_id, booking_item_id, range tstzrange, quantity, status[HELD|CONFIRMED|RELEASED], hold_expires_at) **+ EXCLUDE (resource_id WITH =, range WITH &&) WHERE exclusive** · `resource_maintenance`.

## 6. Booking
`bookings`(id, number unique "HIC-YYYY-NNNNNN", year, type_id, source[B2C_WEBSITE|B2B_PORTAL|ADMIN_PANEL|MANUAL_ENTRY], customer_id, organization_id null, status, payment_status, start_date, end_date, participant_count, notes, quotation_id null, totals) · `booking_types`(dinamik) · `booking_items`(booking_id, service_id, qty, participant_count, start_at, end_at, unit_price, discount, tax, total, allocation_status, price_snapshot jsonb) · `booking_participants` · `booking_teams` · `booking_status_history`(booking_id, from, to, user_id, at, note) · `booking_notes`(internal bool) · `booking_numbers`(year, last_value) — numara `UPDATE … RETURNING` ile çakışmasız üretilir.

## 7. Pricing & Offers
`price_lists` · `price_list_items`(service_id, price_type, season_id, min_pax, price, valid_from/to) · `seasons` · `pricing_rules`(koşul jsonb, indirim) · `organization_pricing_rules`/`contracts` · `quotations`(number, booking_id null, customer_id, status, valid_until) · `quotation_versions`(version, totals, pdf_document_id) · `quotation_items` (fiyat kopyalı).

## 8. Finance
`financial_transactions`(booking_id, type[CHARGE|DISCOUNT|PAYMENT|REFUND|REVERSAL], method[CASH|BANK_TRANSFER|OTHER], amount, occurred_at, recorded_by, reverses_id null, note, document_id) — **silinmez, ters kayıt ile düzeltilir** · `payment_records`, `refund_records` ayrı tablo yerine bu tablonun türleri olarak başlanması önerilir (gereksiz tablo yok). Ödeme durumu türetilir/önbelleğe alınır, rezervasyon durumundan bağımsız.

## 9. Documents / System
`document_types`(dinamik) · `documents`(owner_type, owner_id, organization_id, type_id, storage_key, mime, size, sha256) · `contracts` · `notifications`(user_id, kind, payload, read_at) · `messages`(booking_id, organization_id, sender_user_id, body) · `audit_logs`(user_id, action, entity, entity_id, before jsonb, after jsonb, ip, at) · `system_settings` (mevcut `app_settings` yeniden kullanılabilir).

## Önemli kısıtlar
- Unique: `bookings.number`, `services.code`, `resources.code`, `organizations.code`, `users.email`.
- Index: `bookings(organization_id,status)`, `bookings(start_date)`, `resource_allocations(resource_id, range)` (GiST), `audit_logs(entity, entity_id)`.
- Kurum izolasyonu: tüm kurum kapsamlı tablolarda `organization_id`; Supabase RLS ile ikinci katman (mevcut `supabase-rls.sql` yaklaşımı genişletilir).

## Uyarı
Çakışma kısıtı PostgreSQL'e özgüdür; SQLite geliştirme ortamında aynı garanti yok. Öneri: yeni modüllerin testleri PostgreSQL (yerel Docker veya Supabase) üzerinde koşsun (Q9).
