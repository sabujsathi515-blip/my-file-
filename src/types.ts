export type Language = 'bn' | 'en';
export type ThemeMode = 'light' | 'dark';

export type ServiceCategory = 
  | 'wb_gov'
  | 'central_gov'
  | 'aadhaar'
  | 'pan'
  | 'voter'
  | 'passport'
  | 'transport'
  | 'railway'
  | 'banking'
  | 'scholarship'
  | 'health'
  | 'land'
  | 'pension'
  | 'jobs'
  | 'cyber_tools'
  | 'forms'
  | 'important_links';

export interface ServiceItem {
  id: string;
  nameEn: string;
  nameBn: string;
  category: ServiceCategory;
  subcategory?: string;
  descriptionEn: string;
  descriptionBn: string;
  officialUrl: string;
  iconName: string;
  isPopular?: boolean;
  isWbGov?: boolean;
  isCentralGov?: boolean;
  isFavorite?: boolean;
  tags: string[];
  safetyBadge?: 'verified_gov' | 'official_portal' | 'utility';
  lastUpdated?: string;
}

export interface NoticeItem {
  id: string;
  titleEn: string;
  titleBn: string;
  date: string;
  type: 'last_date' | 'exam' | 'scheme' | 'notice' | 'alert';
  link?: string;
  badgeEn: string;
  badgeBn: string;
  isUrgent?: boolean;
}

export interface JobItem {
  id: string;
  titleEn: string;
  titleBn: string;
  departmentEn: string;
  departmentBn: string;
  totalPosts?: string;
  qualificationEn: string;
  qualificationBn: string;
  lastDate: string;
  category: 'wb' | 'central' | 'ssc' | 'upsc' | 'railway' | 'banking' | 'police' | 'defence' | 'teaching';
  officialNotificationUrl: string;
  applyUrl: string;
  status: 'active' | 'expiring_soon' | 'closed';
}

export interface FormItem {
  id: string;
  titleEn: string;
  titleBn: string;
  category: 'aadhaar' | 'pan' | 'voter' | 'passport' | 'scholarship' | 'pension' | 'caste' | 'income' | 'land' | 'railway' | 'general';
  descriptionEn: string;
  descriptionBn: string;
  fileSize: string;
  pages: number;
  officialFormUrl?: string;
  instructionsEn?: string[];
  instructionsBn?: string[];
}

export interface CustomerRecord {
  id: string;
  customerName: string;
  mobile: string;
  serviceTaken: string;
  date: string;
  amount: number;
  paymentStatus: 'Paid' | 'Due' | 'Advance';
  advanceAmount?: number;
  dueAmount?: number;
  printCount: number;
  scanCount: number;
  notes?: string;
  createdAt: number;
}

export interface IncomeExpenseRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  paymentMode: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';
  createdAt: number;
}

export interface PriceSetting {
  id: string;
  serviceNameEn: string;
  serviceNameBn: string;
  rate: number;
  unit: string;
}
