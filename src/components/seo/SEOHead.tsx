import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
  type?: 'website' | 'article' | 'product';
  locale?: string;
  alternateLocales?: string[];
  schema?: object;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  price?: string;
  currency?: string;
  availability?: string;
}

const defaultSEO = {
  title: 'Philippines Rental - Premium Apartments for Foreigners',
  description: 'Find premium rental apartments in Philippines perfect for foreigners. Monthly stays, furnished apartments in Manila, Cebu, Davao. Professional service, multilingual support.',
  keywords: 'Philippines rental, apartments for foreigners, monthly stay Philippines, furnished rental Manila, Cebu apartment, Davao rental, long term rental Philippines',
  image: '/images/og-default.jpg',
  type: 'website' as const,
  locale: 'en'
};

export default function SEOHead({
  title,
  description,
  keywords,
  image,
  canonical,
  noindex = false,
  type = 'website',
  locale = 'en',
  alternateLocales = [],
  schema,
  author,
  publishedTime,
  modifiedTime,
  price,
  currency = 'PHP',
  availability
}: SEOHeadProps) {
  const router = useRouter();
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://philippines-rental.com';
  const currentUrl = canonical || `${siteUrl}${router.asPath}`;
  
  // 언어별 타이틀 포맷 - 이미 조합된 title이면 그대로 사용
  const getLocalizedTitle = () => {
    const baseTitle = title || defaultSEO.title;
    
    // 이미 사이트명이 포함되어 있으면 그대로 반환
    if (baseTitle.includes('Philippines Rental') || 
        baseTitle.includes('필리핀 렌탈') || 
        baseTitle.includes('菲律宾租房') || 
        baseTitle.includes('フィリピン賃貸')) {
      return baseTitle;
    }
    
    const siteName = locale === 'ko' ? '필리핀 렌탈' : 
                    locale === 'zh' ? '菲律宾租房' : 
                    locale === 'ja' ? 'フィリピン賃貸' : 
                    'Philippines Rental';
    
    return `${baseTitle} | ${siteName}`;
  };

  const getLocalizedDescription = () => {
    if (description) return description;
    
    const descriptions = {
      ko: '필리핀 외국인 전용 프리미엄 아파트 렌탈. 마닐라, 세부, 다바오 월세, 가구 완비 아파트. 전문 서비스, 한국어 지원.',
      zh: '菲律宾外国人专用高级公寓租赁。马尼拉、宿务、达沃月租，家具齐全公寓。专业服务，中文支持。',
      ja: 'フィリピン外国人向け高級アパート賃貸。マニラ、セブ、ダバオ月額賃貸、家具付きアパート。専門サービス、日本語対応。',
      en: defaultSEO.description
    };
    
    return descriptions[locale as keyof typeof descriptions] || defaultSEO.description;
  };

  const getLocalizedKeywords = () => {
    if (keywords) return keywords;
    
    const keywordsByLocale = {
      ko: '필리핀 렌탈, 외국인 아파트, 한달살기 필리핀, 마닐라 월세, 세부 아파트, 다바오 렌탈, 가구 완비 아파트',
      zh: '菲律宾租房, 外国人公寓, 菲律宾月租, 马尼拉租房, 宿务公寓, 达沃租赁, 家具齐全公寓',
      ja: 'フィリピン賃貸, 外国人アパート, フィリピン月額賃貸, マニラ賃貸, セブアパート, ダバオ賃貸, 家具付きアパート',
      en: defaultSEO.keywords
    };
    
    return keywordsByLocale[locale as keyof typeof keywordsByLocale] || defaultSEO.keywords;
  };

  // 안전한 문자열 변환
  const finalTitle = String(getLocalizedTitle() || defaultSEO.title);
  const finalDescription = String(getLocalizedDescription() || defaultSEO.description);
  const finalKeywords = String(getLocalizedKeywords() || defaultSEO.keywords);
  const finalImage = image || defaultSEO.image;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="googlebot" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content={locale} />
      <meta name="language" content={locale} />
      
      {/* Alternate Language URLs */}
      {alternateLocales.map(altLocale => (
        <link
          key={altLocale}
          rel="alternate"
          hrefLang={altLocale}
          href={`${siteUrl}/${altLocale}${router.asPath}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${router.asPath}`} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={finalImage.startsWith('http') ? finalImage : `${siteUrl}${finalImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Philippines Rental" />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage.startsWith('http') ? finalImage : `${siteUrl}${finalImage}`} />
      
      {/* Article specific */}
      {type === 'article' && author && (
        <meta name="author" content={author} />
      )}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      
      {/* Product specific */}
      {type === 'product' && price && (
        <>
          <meta property="product:price:amount" content={price} />
          <meta property="product:price:currency" content={currency} />
          {availability && (
            <meta property="product:availability" content={availability} />
          )}
        </>
      )}
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Mobile Web App */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Philippines Rental" />
      
      {/* Search Console Verification */}
      {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
      )}
      {process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION && (
        <meta name="msvalidate.01" content={process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION} />
      )}
      {process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION && (
        <meta name="yandex-verification" content={process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION} />
      )}
      
      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      
      {/* Structured Data */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      )}
    </Head>
  );
}