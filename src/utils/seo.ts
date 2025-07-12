import { NextRouter } from 'next/router';

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  price?: string;
  currency?: string;
  availability?: string;
}

export interface PropertySEO {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  amenities: string[];
  type: 'house' | 'condo' | 'apartment';
  availability: 'available' | 'rented' | 'pending';
  publishedTime: string;
  modifiedTime: string;
}

// 기본 SEO 설정
export const defaultSEO: Record<string, SEOConfig> = {
  home: {
    title: 'Philippines Rental - Premium Apartments for Foreigners',
    description: 'Find premium rental apartments in Philippines perfect for foreigners. Monthly stays, furnished apartments in Manila, Cebu, Davao. Professional service, multilingual support.',
    keywords: 'Philippines rental, apartments for foreigners, monthly stay Philippines, furnished rental Manila, Cebu apartment, Davao rental, long term rental Philippines',
    image: '/images/og-home.jpg',
    type: 'website'
  },
  properties: {
    title: 'Properties - Philippines Rental',
    description: 'Browse premium rental properties in Philippines. Find your perfect apartment in Manila, Cebu, Davao, Boracay. Monthly stays, furnished apartments for foreigners.',
    keywords: 'Philippines properties, rental apartments, Manila apartments, Cebu rental, Davao properties, monthly stay apartments',
    image: '/images/og-properties.jpg',
    type: 'website'
  },
  contact: {
    title: 'Contact Us - Philippines Rental',
    description: 'Contact Philippines Rental for premium apartment rentals. Professional service, multilingual support. Get in touch for your perfect rental solution.',
    keywords: 'contact Philippines rental, apartment rental inquiry, property rental service, Manila rental contact',
    image: '/images/og-contact.jpg',
    type: 'website'
  },
  about: {
    title: 'About Us - Philippines Rental',
    description: 'Learn about Philippines Rental - your trusted partner for premium apartment rentals. Professional service, multilingual support, specialized for foreigners.',
    keywords: 'about Philippines rental, rental service, apartment rental company, property management Philippines',
    image: '/images/og-about.jpg',
    type: 'website'
  }
};

// 지역별 SEO 설정
export const locationSEO: Record<string, SEOConfig> = {
  manila: {
    title: 'Manila Apartments for Rent - Philippines Rental',
    description: 'Premium Manila apartments for rent. Find furnished apartments in Makati, BGC, Ortigas. Monthly stays, professional service for foreigners.',
    keywords: 'Manila apartment rental, Makati apartments, BGC rental, Ortigas apartments, Manila monthly stay, furnished Manila apartments',
    image: '/images/og-manila.jpg',
    type: 'website'
  },
  cebu: {
    title: 'Cebu Apartments for Rent - Philippines Rental',
    description: 'Premium Cebu apartments for rent. Find furnished apartments in Cebu City, IT Park, Lahug. Monthly stays, professional service for foreigners.',
    keywords: 'Cebu apartment rental, Cebu City apartments, IT Park rental, Lahug apartments, Cebu monthly stay, furnished Cebu apartments',
    image: '/images/og-cebu.jpg',
    type: 'website'
  },
  davao: {
    title: 'Davao Apartments for Rent - Philippines Rental',
    description: 'Premium Davao apartments for rent. Find furnished apartments in Davao City. Monthly stays, professional service for foreigners.',
    keywords: 'Davao apartment rental, Davao City apartments, Davao monthly stay, furnished Davao apartments',
    image: '/images/og-davao.jpg',
    type: 'website'
  },
  boracay: {
    title: 'Boracay Apartments for Rent - Philippines Rental',
    description: 'Premium Boracay apartments for rent. Find furnished apartments near the beach. Monthly stays, professional service for foreigners.',
    keywords: 'Boracay apartment rental, Boracay beach apartments, Boracay monthly stay, furnished Boracay apartments',
    image: '/images/og-boracay.jpg',
    type: 'website'
  }
};

// 다국어 SEO 설정
export const getLocalizedSEO = (baseConfig: SEOConfig, locale: string): SEOConfig => {
  const translations = {
    ko: {
      titleSuffix: ' | 필리핀 렌탈',
      descriptionPrefix: '외국인 전용 ',
      keywordsPrefix: '필리핀 렌탈, 외국인 아파트, '
    },
    zh: {
      titleSuffix: ' | 菲律宾租房',
      descriptionPrefix: '外国人专用 ',
      keywordsPrefix: '菲律宾租房, 外国人公寓, '
    },
    ja: {
      titleSuffix: ' | フィリピン賃貸',
      descriptionPrefix: '外国人向け ',
      keywordsPrefix: 'フィリピン賃貸, 外国人アパート, '
    },
    en: {
      titleSuffix: ' | Philippines Rental',
      descriptionPrefix: '',
      keywordsPrefix: ''
    }
  };

  const translation = translations[locale as keyof typeof translations] || translations.en;
  
  return {
    ...baseConfig,
    title: baseConfig.title + translation.titleSuffix,
    description: translation.descriptionPrefix + baseConfig.description,
    keywords: translation.keywordsPrefix + baseConfig.keywords
  };
};

// 매물 SEO 생성
export const generatePropertySEO = (property: PropertySEO): SEOConfig => {
  const locationName = property.location.split(',')[0];
  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: property.currency || 'PHP'
  }).format(property.price);

  return {
    title: `${property.title} - ${locationName} | Philippines Rental`,
    description: `${property.description.substring(0, 150)}... Located in ${property.location}. ${property.bedrooms}BR/${property.bathrooms}BA, ${property.area}sqm. ${priceFormatted}/month. Available for monthly stay.`,
    keywords: `${property.title}, ${locationName} apartment, ${property.bedrooms} bedroom apartment, furnished apartment ${locationName}, monthly stay ${locationName}, ${property.type} rental Philippines`,
    image: property.images[0] || '/images/og-property.jpg',
    type: 'product',
    publishedTime: property.publishedTime,
    modifiedTime: property.modifiedTime,
    price: property.price.toString(),
    currency: property.currency,
    availability: property.availability === 'available' ? 'InStock' : 'OutOfStock'
  };
};

// URL 기반 SEO 생성
export const generateSEOFromRoute = (router: NextRouter): SEOConfig => {
  const { pathname, query } = router;
  
  // 홈페이지
  if (pathname === '/') {
    return defaultSEO.home;
  }
  
  // 매물 목록
  if (pathname === '/properties') {
    return defaultSEO.properties;
  }
  
  // 연락처
  if (pathname === '/contact') {
    return defaultSEO.contact;
  }
  
  // 소개
  if (pathname === '/about') {
    return defaultSEO.about;
  }
  
  // 지역별 페이지
  if (pathname.includes('/location/')) {
    const location = query.location as string;
    return locationSEO[location] || defaultSEO.properties;
  }
  
  // 기본값
  return defaultSEO.home;
};

// 빵 부스러기 생성
export const generateBreadcrumbs = (router: NextRouter) => {
  const { pathname, query } = router;
  const segments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs = [
    { name: 'Home', url: '/' }
  ];
  
  let currentPath = '';
  
  for (const segment of segments) {
    currentPath += `/${segment}`;
    
    if (segment === 'properties') {
      breadcrumbs.push({ name: 'Properties', url: currentPath });
    } else if (segment === 'location') {
      breadcrumbs.push({ name: 'Locations', url: currentPath });
    } else if (segment === 'contact') {
      breadcrumbs.push({ name: 'Contact', url: currentPath });
    } else if (segment === 'about') {
      breadcrumbs.push({ name: 'About', url: currentPath });
    } else if (query.location) {
      const locationName = (query.location as string).charAt(0).toUpperCase() + (query.location as string).slice(1);
      breadcrumbs.push({ name: locationName, url: currentPath });
    }
  }
  
  return breadcrumbs;
};

// 검색 키워드 추천
export const getSearchKeywords = (location?: string, type?: string) => {
  const baseKeywords = [
    'Philippines rental',
    'apartment rental Philippines',
    'monthly stay Philippines',
    'furnished apartment Philippines',
    'rental for foreigners Philippines'
  ];
  
  if (location) {
    baseKeywords.push(
      `${location} apartment rental`,
      `${location} monthly stay`,
      `furnished apartment ${location}`,
      `${location} rental for foreigners`
    );
  }
  
  if (type) {
    baseKeywords.push(
      `${type} rental Philippines`,
      `${type} for rent Philippines`
    );
  }
  
  return baseKeywords;
};

// 사이트맵 생성용 URL 목록
export const generateSitemapUrls = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://philippines-rental.com';
  const staticPages = [
    '',
    '/properties',
    '/contact',
    '/about'
  ];
  
  const locations = ['manila', 'cebu', 'davao', 'boracay'];
  const locales = ['en', 'ko', 'zh', 'ja'];
  
  const urls = [];
  
  // 정적 페이지
  for (const page of staticPages) {
    for (const locale of locales) {
      urls.push({
        url: `${baseUrl}${locale === 'en' ? '' : `/${locale}`}${page}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: page === '' ? 1.0 : 0.8
      });
    }
  }
  
  // 지역별 페이지
  for (const location of locations) {
    for (const locale of locales) {
      urls.push({
        url: `${baseUrl}${locale === 'en' ? '' : `/${locale}`}/location/${location}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7
      });
    }
  }
  
  return urls;
};