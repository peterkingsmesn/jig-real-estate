import Head from 'next/head';

interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint?: {
    telephone: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string[];
  };
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  sameAs?: string[];
}

interface RealEstateSchemaProps {
  name: string;
  description: string;
  url: string;
  image: string[];
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  floorSize?: {
    value: number;
    unitCode: string;
  };
  numberOfRooms?: number;
  numberOfBathroomsTotal?: number;
  yearBuilt?: number;
  amenityFeature?: string[];
  offers: {
    price: string;
    priceCurrency: string;
    availability: string;
    validFrom: string;
    priceSpecification: {
      price: string;
      priceCurrency: string;
      unitCode: string;
    };
  };
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

interface ReviewSchemaProps {
  itemReviewed: {
    name: string;
    description: string;
    image: string;
  };
  author: string;
  reviewRating: {
    ratingValue: number;
    bestRating: number;
    worstRating: number;
  };
  reviewBody: string;
  datePublished: string;
}

interface FAQSchemaProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export function OrganizationSchema({
  name,
  url,
  logo,
  description,
  contactPoint,
  address,
  sameAs
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": logo,
    "description": description,
    ...(contactPoint && {
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": contactPoint.telephone,
        "contactType": contactPoint.contactType,
        "areaServed": contactPoint.areaServed,
        "availableLanguage": contactPoint.availableLanguage
      }
    }),
    ...(address && {
      "address": {
        "@type": "PostalAddress",
        "streetAddress": address.streetAddress,
        "addressLocality": address.addressLocality,
        "addressRegion": address.addressRegion,
        "postalCode": address.postalCode,
        "addressCountry": address.addressCountry
      }
    }),
    ...(sameAs && { "sameAs": sameAs })
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />
    </Head>
  );
}

export function RealEstateSchema({
  name,
  description,
  url,
  image,
  address,
  geo,
  floorSize,
  numberOfRooms,
  numberOfBathroomsTotal,
  yearBuilt,
  amenityFeature,
  offers
}: RealEstateSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Apartment",
    "name": name,
    "description": description,
    "url": url,
    "image": image,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.streetAddress,
      "addressLocality": address.addressLocality,
      "addressRegion": address.addressRegion,
      "postalCode": address.postalCode,
      "addressCountry": address.addressCountry
    },
    ...(geo && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": geo.latitude,
        "longitude": geo.longitude
      }
    }),
    ...(floorSize && {
      "floorSize": {
        "@type": "QuantitativeValue",
        "value": floorSize.value,
        "unitCode": floorSize.unitCode
      }
    }),
    ...(numberOfRooms && { "numberOfRooms": numberOfRooms }),
    ...(numberOfBathroomsTotal && { "numberOfBathroomsTotal": numberOfBathroomsTotal }),
    ...(yearBuilt && { "yearBuilt": yearBuilt }),
    ...(amenityFeature && { "amenityFeature": amenityFeature }),
    "offers": {
      "@type": "Offer",
      "price": offers.price,
      "priceCurrency": offers.priceCurrency,
      "availability": offers.availability,
      "validFrom": offers.validFrom,
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": offers.priceSpecification.price,
        "priceCurrency": offers.priceSpecification.priceCurrency,
        "unitCode": offers.priceSpecification.unitCode
      }
    }
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />
    </Head>
  );
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />
    </Head>
  );
}

export function ReviewSchema({
  itemReviewed,
  author,
  reviewRating,
  reviewBody,
  datePublished
}: ReviewSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Thing",
      "name": itemReviewed.name,
      "description": itemReviewed.description,
      "image": itemReviewed.image
    },
    "author": {
      "@type": "Person",
      "name": author
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": reviewRating.ratingValue,
      "bestRating": reviewRating.bestRating,
      "worstRating": reviewRating.worstRating
    },
    "reviewBody": reviewBody,
    "datePublished": datePublished
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />
    </Head>
  );
}

export function FAQSchema({ questions }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(qa => ({
      "@type": "Question",
      "name": qa.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": qa.answer
      }
    }))
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />
    </Head>
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Philippines Rental",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://philippines-rental.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "https://philippines-rental.com"}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />
    </Head>
  );
}