import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import FloatingContactButton from '@/components/common/FloatingContactButton';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';
import { BreadcrumbSchema, OrganizationSchema } from '@/components/seo/JsonLd';
import { defaultSEO, getLocalizedSEO } from '@/utils/seo';
import { 
  Phone, Mail, MessageCircle, MapPin, Clock, Send, 
  User, Building, Globe, Calendar, CheckCircle 
} from 'lucide-react';

export default function ContactPage() {
  const router = useRouter();
  const currentLanguage = 'ko';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    propertyType: '',
    location: '',
    budget: '',
    moveInDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // SEO 설정
  const seoConfig = useMemo(() => {
    const baseSEO = defaultSEO.contact;
    return getLocalizedSEO(baseSEO, currentLanguage);
  }, [currentLanguage]);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' }
  ];


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 실제 구현에서는 API 호출
      console.log('Contact form submitted:', formData);
      
      // 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        propertyType: '',
        location: '',
        budget: '',
        moveInDate: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Phone',
      description: 'Call us directly for immediate assistance',
      contact: '+63 912 345 6789',
      action: 'tel:+639123456789',
      available: '24/7 Available',
      color: 'bg-blue-500'
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'WhatsApp',
      description: 'Chat with us on WhatsApp for quick responses',
      contact: '+63 912 345 6789',
      action: 'https://wa.me/639123456789',
      available: 'Usually replies within 1 hour',
      color: 'bg-green-500'
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email',
      description: 'Send us detailed inquiries via email',
      contact: 'info@philippines-rental.com',
      action: 'mailto:info@philippines-rental.com',
      available: 'Response within 24 hours',
      color: 'bg-purple-500'
    }
  ];

  const officeLocations = [
    {
      city: 'Manila',
      address: '123 Ayala Avenue, Makati City, Metro Manila',
      phone: '+63 912 345 6789',
      email: 'manila@philippines-rental.com',
      hours: 'Mon-Sat: 9:00 AM - 7:00 PM'
    },
    {
      city: 'Cebu',
      address: '456 IT Park, Lahug, Cebu City',
      phone: '+63 912 345 6790',
      email: 'cebu@philippines-rental.com',
      hours: 'Mon-Sat: 9:00 AM - 6:00 PM'
    }
  ];

  const faqItems = [
    {
      question: 'How quickly can you help me find a property?',
      answer: 'We typically provide property options within 24-48 hours based on your requirements.'
    },
    {
      question: 'Do you charge tenants any fees?',
      answer: 'No, our service is completely free for tenants. We are paid by property owners.'
    },
    {
      question: 'Can you help with property viewings?',
      answer: 'Yes, we arrange both in-person and virtual property viewings at your convenience.'
    },
    {
      question: 'Do you provide support in multiple languages?',
      answer: 'Yes, we provide support in English, Korean, Chinese, and Japanese.'
    }
  ];

  if (isSubmitted) {
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
        
        <FacebookLayout section="contact">
            <div className="min-h-screen flex items-center justify-center py-12">
              <div className="max-w-md mx-auto text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h1>
                <p className="text-gray-600 mb-6">
                  Thank you for contacting us. We'll get back to you within 24 hours.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
        </FacebookLayout>
      </>
    );
  }

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

      <FacebookLayout section="contact">
          <main className="py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                📞 Contact Us
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                {(currentLanguage as string) === 'ko' && '전문 팀이 완벽한 필리핀 렌탈을 찾도록 도와드립니다. 다국어 지원으로 편리하게 문의하세요.'}
                {(currentLanguage as string) === 'zh' && '我们的专业团队将帮助您找到完美的菲律宾租房。多语言支持，方便咨询。'}
                {(currentLanguage as string) === 'ja' && '専門チームが完璧なフィリピン賃貸物件探しをお手伝いします。多言語サポートでお気軽にお問い合わせください。'}
                {(currentLanguage as string) === 'en' && 'Our expert team is here to help you find the perfect rental in the Philippines. Multilingual support available.'}
              </p>
            </div>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.action}
                  target={method.action.startsWith('http') ? '_blank' : undefined}
                  rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center text-white mb-4`}>
                    {method.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-600 mb-3">{method.description}</p>
                  <div className="text-blue-600 font-medium mb-2">{method.contact}</div>
                  <div className="text-sm text-gray-500">{method.available}</div>
                </a>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Location
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Location</option>
                        <option value="manila">Manila</option>
                        <option value="cebu">Cebu</option>
                        <option value="davao">Davao</option>
                        <option value="boracay">Boracay</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Type
                      </label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => handleInputChange('propertyType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Type</option>
                        <option value="condo">Condominium</option>
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="monthly-stay">Monthly Stay</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range (PHP)
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Budget</option>
                        <option value="under-20k">Under ₱20,000</option>
                        <option value="20k-40k">₱20,000 - ₱40,000</option>
                        <option value="40k-60k">₱40,000 - ₱60,000</option>
                        <option value="60k-100k">₱60,000 - ₱100,000</option>
                        <option value="over-100k">Over ₱100,000</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="e.g., Looking for 2BR condo in Makati"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={5}
                      placeholder="Tell us about your rental requirements..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Office Locations & FAQ */}
              <div className="space-y-8">
                {/* Office Locations */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Building className="h-6 w-6 mr-2 text-blue-600" />
                    Our Offices
                  </h2>
                  
                  <div className="space-y-6">
                    {officeLocations.map((office, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{office.city}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                            <span>{office.address}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{office.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{office.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{office.hours}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick FAQ */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Questions</h2>
                  
                  <div className="space-y-4">
                    {faqItems.map((item, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <h4 className="font-medium text-gray-900 mb-2">{item.question}</h4>
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => router.push('/faq')}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View All FAQ →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        <FloatingContactButton />
      </FacebookLayout>
    </>
  );
}