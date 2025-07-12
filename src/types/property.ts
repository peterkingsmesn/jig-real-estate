// API 응답 타입 재내보내기
export type { ApiResponse, ApiErrorResponse, WeatherData, WeatherForecast, WeatherAlert } from './api';

export interface Property {
  id: string;
  title: string;
  titleKo?: string;
  titleZh?: string;
  titleJa?: string;
  description: string;
  descriptionKo?: string;
  descriptionZh?: string;
  descriptionJa?: string;
  type: 'house' | 'condo' | 'apartment' | 'studio' | 'villa' | 'townhouse' | 'village';
  region: string;
  city: string;
  district: string;
  address: string;
  price: number;
  currency: 'PHP';
  deposit?: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor?: number;
  furnished: boolean;
  amenities: string[];
  images: string[] | PropertyImage[];
  location?: Location;
  contact: ContactInfo;
  translations?: PropertyTranslations;
  status?: 'active' | 'inactive' | 'rented';
  viewCount?: number;
  views?: number;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  
  // 한달살기 전용 필드
  monthlyStay?: MonthlyStayInfo;
}

export interface PropertyImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  order: number;
  isMain: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  landmark?: string;
  district?: string;
  city: string;
  province: string;
}

export interface ContactInfo {
  whatsapp?: string;
  telegram?: string;
  email?: string;
  phone?: string;
  contactName?: string;
}

export interface PropertyTranslations {
  ko?: { title: string; description: string; };
  zh?: { title: string; description: string; };
  ja?: { title: string; description: string; };
  en?: { title: string; description: string; };
  tl?: { title: string; description: string; };
}

export interface PropertyFilters {
  region?: string;
  type?: 'house' | 'condo' | 'apartment' | 'studio' | 'villa' | 'townhouse' | 'village';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  amenities?: string[];
  sortBy?: 'price' | 'date' | 'popularity';
  order?: 'asc' | 'desc';
  
  // 한달살기 필터
  category?: 'long_term' | 'monthly_stay' | 'all';
  duration?: 'short' | 'medium' | 'long' | 'extended';
  travelerFriendly?: boolean;
  wifiSpeed?: 'basic' | 'fast' | 'ultra';
  nearTouristSpots?: boolean;
}

export interface MonthlyStayInfo {
  available: boolean;
  minStayDays: number;
  maxStayDays: number;
  weeklyDiscount: number; // percentage
  monthlyDiscount: number; // percentage
  checkInTime: string;
  checkOutTime: string;
  
  // 여행자 편의 시설
  travelerAmenities: TravelerAmenity[];
  
  // 관광지 접근성
  touristAttractions: NearbyAttraction[];
  
  // 생활 편의성
  livingConvenience: LivingConvenience;
  
  // 리뷰 점수
  scores: TravelerScores;
  
  // 패키지 옵션
  packages: MonthlyStayPackage[];
}

export interface TravelerAmenity {
  name: string;
  description: string;
  category: 'essential' | 'comfort' | 'work' | 'entertainment';
}

export interface NearbyAttraction {
  name: string;
  type: 'beach' | 'temple' | 'mall' | 'restaurant' | 'hospital' | 'airport';
  distance: number; // in meters
  walkingTime: number; // in minutes
  transportOption: string;
}

export interface LivingConvenience {
  convenience_store: number; // distance in meters
  supermarket: number;
  hospital: number;
  pharmacy: number;
  restaurant: number;
  bank: number;
  wifi_speed: 'basic' | 'fast' | 'ultra'; // Mbps category
  laundry: boolean;
  kitchen: 'none' | 'basic' | 'full';
}

export interface TravelerScores {
  tourism_convenience: number; // 1-5
  living_convenience: number; // 1-5
  safety: number; // 1-5
  value_for_money: number; // 1-5
  wifi_quality: number; // 1-5
  overall: number; // calculated average
}

export interface MonthlyStayPackage {
  id: string;
  name: string;
  description: string;
  inclusions: string[];
  price: number;
  duration: number; // days
  popular: boolean;
}