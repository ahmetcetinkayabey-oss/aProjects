/**
 * Sistem rolleri ve izin kodları. Üretimde migration (001-foundation) ekler; geliştirmede (SQLite)
 * IdentityService açılışta bu tanımdan ekler. İki kaynağın aynı olduğu rbac-seed.spec.ts ile doğrulanır.
 */
export const PERMISSION_CODES = [
  ['user:manage', 'Kullanıcı ve rol yönetimi'],
  ['organization:manage', 'Kurum kayıtlarını yönetme'],
  ['organization:own', 'Kendi kurumunu yönetme'],
  ['customer:manage', 'Müşteri kayıtlarını yönetme'],
  ['service:manage', 'Hizmet ve kaynak yönetimi'],
  ['pricing:manage', 'Fiyat ve paket yönetimi'],
  ['booking:create', 'Rezervasyon/talep oluşturma'],
  ['booking:view_all', 'Tüm rezervasyonları görme'],
  ['booking:view_own', 'Yalnızca kendi/kurum rezervasyonlarını görme'],
  ['booking:approve', 'Rezervasyon onay/ret'],
  ['quotation:manage', 'Teklif yönetimi'],
  ['team:manage', 'Takım ve sporcu yönetimi'],
  ['finance:view', 'Finans kayıtlarını görme'],
  ['finance:record', 'Tahsilat ve iade kaydetme'],
  ['report:view', 'Raporları görme'],
  ['audit:view', 'Audit log görme'],
] as const;

export type PermissionCode = (typeof PERMISSION_CODES)[number][0];

export const ROLE_DEFS: {
  code: string;
  name: string;
  scope: 'PERSONNEL' | 'B2B' | 'B2C';
  permissions: PermissionCode[] | 'ALL';
}[] = [
  { code: 'SYSTEM_ADMIN', name: 'Sistem yöneticisi', scope: 'PERSONNEL', permissions: 'ALL' },
  {
    code: 'FACILITY_MANAGER',
    name: 'Tesis yöneticisi',
    scope: 'PERSONNEL',
    permissions: [
      'organization:manage', 'customer:manage', 'service:manage', 'pricing:manage', 'booking:create',
      'booking:view_all', 'booking:approve', 'quotation:manage', 'team:manage', 'finance:view',
      'report:view', 'audit:view',
    ],
  },
  {
    code: 'RESERVATION_OFFICER',
    name: 'Rezervasyon sorumlusu',
    scope: 'PERSONNEL',
    permissions: [
      'organization:manage', 'customer:manage', 'booking:create', 'booking:view_all',
      'booking:approve', 'quotation:manage', 'team:manage', 'report:view',
    ],
  },
  { code: 'OPERATIONS_STAFF', name: 'Operasyon personeli', scope: 'PERSONNEL', permissions: ['booking:view_all', 'service:manage'] },
  {
    code: 'FINANCE_OFFICER',
    name: 'Finans sorumlusu',
    scope: 'PERSONNEL',
    permissions: ['booking:view_all', 'finance:view', 'finance:record', 'report:view'],
  },
  {
    code: 'B2B_ORG_ADMIN',
    name: 'B2B kurum yöneticisi',
    scope: 'B2B',
    permissions: ['organization:own', 'booking:create', 'booking:view_own', 'team:manage', 'finance:view'],
  },
  { code: 'B2B_BOOKING_OFFICER', name: 'B2B rezervasyon yetkilisi', scope: 'B2B', permissions: ['booking:create', 'booking:view_own'] },
  { code: 'B2B_TEAM_MANAGER', name: 'B2B takım yöneticisi', scope: 'B2B', permissions: ['booking:view_own', 'team:manage'] },
  { code: 'B2B_ACCOUNTANT', name: 'B2B muhasebe yetkilisi', scope: 'B2B', permissions: ['booking:view_own', 'finance:view'] },
  { code: 'INDIVIDUAL_CUSTOMER', name: 'Bireysel müşteri', scope: 'B2C', permissions: ['booking:create', 'booking:view_own'] },
];
