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
  sortOrder: number;
}

export interface BenchmarkCenter {
  id: string;
  name: string;
  countryCode: string;
  location: string;
  altitudeLabel: string;
  swimming: string;
  football: string;
  athletics: string;
  combatSports: string;
  iceAndCurling: string;
  indoorSports: string;
  sportsScienceLab: string;
  facilityScore: number;
  isHighlighted: boolean;
  sortOrder: number;
}

export interface DigitalScore {
  id: string;
  centerName: string;
  countryCode: string;
  description: string;
  totalScore: number;
  uxScore: number;
  reservationScore: number;
  thirdMetricLabel: string;
  thirdMetricScore: number;
  isVision: boolean;
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
