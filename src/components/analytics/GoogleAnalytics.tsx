import Script from 'next/script';

interface GoogleAnalyticsProps {
  gaId: string;
}

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  if (!gaId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  );
}

// 이벤트 추적을 위한 헬퍼 함수들
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// 페이지뷰 추적
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_title: title,
      page_location: url,
    });
  }
};

// 사용자 정의 이벤트들
export const trackPropertyView = (propertyId: string, propertyType: string, location: string) => {
  trackEvent('view_property', 'Property', `${propertyType}_${location}_${propertyId}`);
};

export const trackPropertyContact = (propertyId: string, contactMethod: 'whatsapp' | 'phone' | 'email') => {
  trackEvent('contact_property', 'Property', `${contactMethod}_${propertyId}`);
};

export const trackPropertyShare = (propertyId: string, shareMethod: string) => {
  trackEvent('share_property', 'Property', `${shareMethod}_${propertyId}`);
};

export const trackPropertyLike = (propertyId: string) => {
  trackEvent('like_property', 'Property', propertyId);
};

export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('search', 'Property Search', searchTerm, resultsCount);
};

export const trackFilterChange = (filterType: string, filterValue: string) => {
  trackEvent('filter_change', 'Property Search', `${filterType}_${filterValue}`);
};

export const trackLanguageChange = (fromLanguage: string, toLanguage: string) => {
  trackEvent('language_change', 'UI', `${fromLanguage}_to_${toLanguage}`);
};

export const trackMenuClick = (menuItem: string) => {
  trackEvent('menu_click', 'Navigation', menuItem);
};

export const trackFormSubmission = (formType: string, formId?: string) => {
  trackEvent('form_submit', 'Forms', `${formType}${formId ? `_${formId}` : ''}`);
};

export const trackDownload = (fileName: string, fileType: string) => {
  trackEvent('download', 'Files', `${fileType}_${fileName}`);
};

export const trackOutboundLink = (url: string, linkText?: string) => {
  trackEvent('click', 'Outbound Links', linkText || url);
};

export const trackVideoPlay = (videoTitle: string, videoId?: string) => {
  trackEvent('video_play', 'Media', `${videoTitle}${videoId ? `_${videoId}` : ''}`);
};

export const trackNewsletterSignup = (source: string) => {
  trackEvent('newsletter_signup', 'Newsletter', source);
};

// E-commerce 이벤트 (향후 결제 시스템 추가 시 사용)
export const trackPurchase = (transactionId: string, value: number, currency: string = 'PHP') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
    });
  }
};

export const trackBeginCheckout = (value: number, currency: string = 'PHP') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      value: value,
      currency: currency,
    });
  }
};

// 사용자 정의 차원 설정 (세그멘테이션용)
export const setUserProperty = (propertyName: string, propertyValue: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      custom_map: { [propertyName]: propertyValue }
    });
  }
};

// 사용자 언어 설정
export const setUserLanguage = (language: string) => {
  setUserProperty('user_language', language);
};

// 사용자 타입 설정 (tenant, property_owner, etc.)
export const setUserType = (userType: string) => {
  setUserProperty('user_type', userType);
};

// 전역 타입 선언
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}