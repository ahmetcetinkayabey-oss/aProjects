export interface Facility {
  id: string;
  slug: string;
  category: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
  imageUrl?: string | null;
  footerLeft: string;
  footerRight: string;
  stats?: { label: string; value: string }[] | null;
  /** İngilizce metinler (yönetim panelinden, isteğe bağlı). */
  categoryEn?: string | null;
  titleEn?: string | null;
  descriptionEn?: string | null;
  badgeEn?: string | null;
  footerLeftEn?: string | null;
  footerRightEn?: string | null;
  statsEn?: { label: string; value: string }[] | null;
  sortOrder: number;
}

export interface CreateReservationInput {
  organizationName: string;
  contactName: string;
  email: string;
  phone: string;
  sportBranch: string;
  groupSize?: number;
  preferredStartDate?: string;
  preferredEndDate?: string;
  message?: string;
}
