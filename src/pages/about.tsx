import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import FloatingContactButton from '@/components/common/FloatingContactButton';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';
import { BreadcrumbSchema, OrganizationSchema } from '@/components/seo/JsonLd';
import { defaultSEO, getLocalizedSEO } from '@/utils/seo';
import { 
  Users, Globe, Shield, Award, Heart, Target, 
  Zap, CheckCircle, Star, MessageCircle, Home, Building 
} from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();
  const currentLanguage = 'ko';

  // SEO 설정
  const seoConfig = useMemo(() => {
    const baseSEO = defaultSEO.about;
    return getLocalizedSEO(baseSEO, currentLanguage);
  }, [currentLanguage]);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' }
  ];


  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Expat Specialized',
      description: 'Dedicated to serving foreign tenants with specialized knowledge of expat needs and requirements.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Multilingual Support',
      description: 'Professional support in English, Korean, Chinese, and Japanese for seamless communication.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Verified Properties',
      description: 'All properties are thoroughly inspected and verified to ensure quality and authenticity.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Fast Service',
      description: 'Quick response times with property matches within 24-48 hours of your inquiry.',
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  const stats = [
    { number: '2000+', label: 'Happy Tenants', icon: <Users className="h-6 w-6" /> },
    { number: '500+', label: 'Properties Listed', icon: <Building className="h-6 w-6" /> },
    { number: '5', label: 'Cities Covered', icon: <Globe className="h-6 w-6" /> },
    { number: '98%', label: 'Satisfaction Rate', icon: <Star className="h-6 w-6" /> }
  ];

  const team = [
    {
      id: '1',
      name: 'Sarah Kim',
      position: 'Founder & CEO',
      image: '/images/team/sarah.jpg',
      avatar: '/images/team/sarah.jpg',
      bio: 'Former expat with 10+ years experience in Philippines real estate market.',
      languages: ['English', 'Korean'],
      expertise: 'Market Strategy, Business Development',
      verified: true
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      position: 'Head of Operations',
      image: '/images/team/mike.jpg',
      avatar: '/images/team/mike.jpg',
      bio: 'Real estate professional specializing in property management and tenant relations.',
      languages: ['English', 'Spanish'],
      expertise: 'Operations, Property Management',
      verified: true
    },
    {
      id: '3',
      name: 'Chen Wei',
      position: 'Regional Manager - Manila',
      image: '/images/team/chen.jpg',
      avatar: '/images/team/chen.jpg',
      bio: 'Local expert with deep knowledge of Manila real estate and expat community.',
      languages: ['English', 'Chinese', 'Filipino'],
      expertise: 'Manila Market, Property Sourcing',
      verified: true
    },
    {
      id: '4',
      name: 'Yuki Tanaka',
      position: 'Customer Success Manager',
      image: '/images/team/yuki.jpg',
      avatar: '/images/team/yuki.jpg',
      bio: 'Dedicated to ensuring exceptional customer experience for all tenants.',
      languages: ['English', 'Japanese'],
      expertise: 'Customer Relations, Quality Assurance',
      verified: true
    }
  ];

  const values = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Customer First',
      description: 'Every decision we make prioritizes our customers\' needs and satisfaction.',
      color: 'text-red-600'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Trust & Transparency',
      description: 'Honest communication and transparent processes in every interaction.',
      color: 'text-blue-600'
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Excellence',
      description: 'Continuous improvement and commitment to delivering exceptional service.',
      color: 'text-green-600'
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Cultural Understanding',
      description: 'Respecting and understanding diverse cultural backgrounds and needs.',
      color: 'text-purple-600'
    }
  ];

  const milestones = [
    {
      year: '2019',
      title: 'Company Founded',
      description: 'Started with a vision to help foreign tenants find quality rentals in Philippines.'
    },
    {
      year: '2020',
      title: 'Manila Expansion',
      description: 'Established strong presence in Manila with over 100 verified properties.'
    },
    {
      year: '2021',
      title: 'Multi-City Growth',
      description: 'Expanded to Cebu, Davao, and other major cities across Philippines.'
    },
    {
      year: '2022',
      title: 'Digital Platform Launch',
      description: 'Launched comprehensive online platform with multilingual support.'
    },
    {
      year: '2023',
      title: 'Monthly Stay Program',
      description: 'Introduced specialized monthly stay program for digital nomads and short-term residents.'
    },
    {
      year: '2024',
      title: 'Premium Service Tier',
      description: 'Launched premium concierge services for high-end property seekers.'
    }
  ];

  const testimonials = [
    {
      name: 'John Park',
      nationality: 'Korean',
      occupation: 'Digital Nomad',
      text: 'Philippines Rental made my move to Manila so easy. The team understood exactly what I needed as a Korean expat.',
      rating: 5,
      image: '/images/testimonials/john.jpg'
    },
    {
      name: 'Liu Wei',
      nationality: 'Chinese',
      occupation: 'Business Executive',
      text: 'Excellent service with Chinese language support. They found me the perfect condo in BGC within 2 days.',
      rating: 5,
      image: '/images/testimonials/liu.jpg'
    },
    {
      name: 'Emma Johnson',
      nationality: 'American',
      occupation: 'Teacher',
      text: 'Professional, reliable, and honest. They helped me understand the rental process in Philippines completely.',
      rating: 5,
      image: '/images/testimonials/emma.jpg'
    }
  ];

  return (
    <>
      <SEOHead
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        image={seoConfig.image}
        type="website"
        locale={currentLanguage}
        alternateLocales={['en', 'ko', 'zh', 'ja']}
      />
      
      <BreadcrumbSchema items={breadcrumbs} />
      
      <OrganizationSchema
        name="Philippines Rental"
        url={process.env.NEXT_PUBLIC_SITE_URL || 'https://philippines-rental.com'}
        logo={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://philippines-rental.com'}/images/logo.png`}
        description="Premium rental apartments in Philippines for foreigners"
        contactPoint={{
          telephone: "+63-912-345-6789",
          contactType: "customer service",
          areaServed: "Philippines",
          availableLanguage: ["English", "Korean", "Chinese", "Japanese"]
        }}
        address={{
          streetAddress: "123 Ayala Avenue",
          addressLocality: "Makati City",
          addressRegion: "Metro Manila",
          postalCode: "1200",
          addressCountry: "Philippines"
        }}
        sameAs={[
          "https://www.facebook.com/philippinesrental",
          "https://www.instagram.com/philippinesrental"
        ]}
      />

      <FacebookLayout section="about">
          <main className="py-8">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                💡 About Philippines Rental
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                {(currentLanguage as string) === 'ko' && '외국인을 위한 필리핀 최고의 렌탈 서비스. 전문적이고 신뢰할 수 있는 팀이 완벽한 집을 찾아드립니다.'}
                {(currentLanguage as string) === 'zh' && '菲律宾外国人专业租房服务。专业可靠的团队帮您找到完美的家。'}
                {(currentLanguage as string) === 'ja' && 'フィリピンの外国人向け賃貸サービス。専門的で信頼できるチームが完璧な住まいを見つけます。'}
                {(currentLanguage as string) === 'en' && 'Philippines premier rental service for foreigners. Our professional and trusted team helps you find the perfect home.'}
              </p>
            </div>

            {/* Mission Statement */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 md:p-12 mb-16">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-xl opacity-90 leading-relaxed">
                  To bridge the gap between foreign tenants and quality rental properties in the Philippines, 
                  providing exceptional service with cultural understanding, professional integrity, and 
                  multilingual support that makes finding your perfect home effortless and enjoyable.
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center">
                    <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Values */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className={`w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 ${value.color}`}>
                      {value.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Story */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200 md:left-1/2 md:transform md:-translate-x-0.5"></div>
                  
                  {milestones.map((milestone, index) => (
                    <div key={index} className={`relative flex items-center mb-8 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}>
                      {/* Timeline dot */}
                      <div className="absolute left-2 w-4 h-4 bg-blue-600 rounded-full md:left-1/2 md:transform md:-translate-x-2"></div>
                      
                      {/* Content */}
                      <div className={`ml-12 md:ml-0 md:w-1/2 ${
                        index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                      }`}>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                          <div className="text-blue-600 font-bold text-lg mb-2">{milestone.year}</div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.map((member, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                    <div className="text-blue-600 font-medium mb-3">{member.position}</div>
                    <p className="text-sm text-gray-600 mb-3">{member.bio}</p>
                    <div className="text-xs text-gray-500 mb-2">
                      <strong>Languages:</strong> {member.languages.join(', ')}
                    </div>
                    <div className="text-xs text-gray-500">
                      <strong>Expertise:</strong> {member.expertise}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <Users className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.nationality} {testimonial.occupation}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-blue-50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Find Your Perfect Home?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join thousands of satisfied tenants who found their ideal rental through our professional service. 
                Let us help you find your perfect home in the Philippines.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/contact')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Contact Us Today
                </button>
                <button
                  onClick={() => router.push('/properties')}
                  className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Browse Properties
                </button>
              </div>
            </div>
          </main>
        <FloatingContactButton />
      </FacebookLayout>
    </>
  );
}