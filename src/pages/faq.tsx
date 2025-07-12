import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import FloatingContactButton from '@/components/common/FloatingContactButton';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';
import { FAQSchema, BreadcrumbSchema } from '@/components/seo/JsonLd';
import { ChevronDown, ChevronUp, Search, MessageCircle, Phone, Mail } from 'lucide-react';

export default function FAQPage() {
  const router = useRouter();
  const currentLanguage = 'ko';
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);

  // FAQ 데이터
  const faqData = [
    {
      category: 'General',
      questions: [
        {
          question: 'How does Philippines Rental work?',
          answer: 'Philippines Rental connects foreign tenants with property owners across the Philippines. We provide a curated selection of rental properties specifically suitable for foreigners, with multilingual support and professional service to ensure a smooth rental experience.'
        },
        {
          question: 'What areas do you cover in the Philippines?',
          answer: 'We cover major cities and regions including Manila (NCR), Cebu, Davao, Boracay, Baguio, and other popular destinations for foreigners. Our network continues to expand to serve more locations.'
        },
        {
          question: 'Is the service free for tenants?',
          answer: 'Yes, our service is completely free for tenants. We are paid by property owners only when a successful rental is completed. There are no hidden fees or charges for tenants using our platform.'
        },
        {
          question: 'Do you verify all properties listed?',
          answer: 'Yes, all properties on our platform are verified by our team. We conduct physical inspections, verify ownership documents, and ensure all amenities and features are accurately represented.'
        }
      ]
    },
    {
      category: 'Rental Process',
      questions: [
        {
          question: 'What documents do I need to rent an apartment?',
          answer: 'Typically, you will need: Valid passport, Visa or work permit, Proof of income (employment certificate, bank statements), Government-issued ID, and References from previous landlords if available. Some properties may have additional requirements.'
        },
        {
          question: 'How long does the rental process take?',
          answer: 'The rental process usually takes 3-7 days once you have submitted all required documents. This includes application review, background verification, lease preparation, and move-in coordination.'
        },
        {
          question: 'What is the typical lease duration?',
          answer: 'Most properties offer flexible lease terms ranging from 1 month (for monthly stays) to 12 months or longer. We specialize in accommodating foreign tenants who may need shorter-term or more flexible arrangements.'
        },
        {
          question: 'What deposits are required?',
          answer: 'Typically, you will need to pay: 1-2 months advance rent, 1-2 months security deposit, and utility deposits if applicable. The exact amount varies by property and can be negotiated with the owner.'
        }
      ]
    },
    {
      category: 'Monthly Stay Program',
      questions: [
        {
          question: 'What is the Monthly Stay program?',
          answer: 'Our Monthly Stay program is designed for digital nomads, short-term workers, and travelers who need furnished accommodations for 1-6 months. These properties come fully furnished with utilities, WiFi, and housekeeping services.'
        },
        {
          question: 'What is included in Monthly Stay rentals?',
          answer: 'Monthly Stay rentals typically include: Fully furnished apartment, High-speed WiFi, Utilities (electricity, water), Weekly housekeeping, Linens and towels, Kitchen essentials, and 24/7 support.'
        },
        {
          question: 'Can I extend my Monthly Stay?',
          answer: 'Yes, most Monthly Stay bookings can be extended subject to availability. We recommend requesting extensions at least 2 weeks before your current booking ends to ensure continued availability.'
        },
        {
          question: 'Is there a minimum stay requirement?',
          answer: 'Most Monthly Stay properties have a minimum stay of 30 days. Some properties may accept shorter stays of 14 days, but this varies by location and season.'
        }
      ]
    },
    {
      category: 'Payments & Pricing',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept various payment methods including bank transfers, international wire transfers, PayPal, credit cards, and cryptocurrency for some properties. Payment options may vary by property owner.'
        },
        {
          question: 'Are utilities included in the rent?',
          answer: 'This varies by property. Some rentals include utilities in the monthly rent, while others require separate utility payments. All utility arrangements are clearly specified in the property listing and lease agreement.'
        },
        {
          question: 'Can I negotiate the rent price?',
          answer: 'Rent negotiation is possible, especially for longer lease terms or during off-peak seasons. Our team can help facilitate negotiations with property owners to find a mutually agreeable price.'
        },
        {
          question: 'What happens if I need to terminate my lease early?',
          answer: 'Early termination policies vary by property and lease agreement. Generally, 30-60 days notice is required, and you may forfeit part or all of your security deposit. We always recommend purchasing travel/rental insurance for protection.'
        }
      ]
    },
    {
      category: 'Support & Services',
      questions: [
        {
          question: 'Do you provide support in my language?',
          answer: 'Yes! We provide support in English, Korean, Chinese (Mandarin), and Japanese. Our multilingual team is available to assist you throughout your rental journey in your preferred language.'
        },
        {
          question: 'What if I have issues with my rental property?',
          answer: 'We provide ongoing support throughout your tenancy. If you experience any issues, contact our support team immediately. We will work with the property owner to resolve problems quickly and fairly.'
        },
        {
          question: 'Do you help with property viewings?',
          answer: 'Yes, we can arrange property viewings either in-person or via video call. For international clients, we offer virtual tours and detailed video walkthroughs to help you make informed decisions.'
        },
        {
          question: 'Can you help with moving and settling in?',
          answer: 'We offer additional services including airport pickup, utility setup assistance, local orientation, and connections to essential services like banks, healthcare, and schools. These services may have additional fees.'
        }
      ]
    }
  ];

  // 검색 필터링
  const filteredFAQs = useMemo(() => {
    if (!searchTerm) return faqData;
    
    return faqData.map(category => ({
      ...category,
      questions: category.questions.filter(
        item =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.questions.length > 0);
  }, [searchTerm]);

  // FAQ 스키마용 데이터 변환
  const faqSchemaData = useMemo(() => {
    return faqData.flatMap(category => 
      category.questions.map(item => ({
        question: item.question,
        answer: item.answer
      }))
    );
  }, []);


  const toggleItem = (categoryIndex: number, questionIndex: number) => {
    const itemId = categoryIndex * 1000 + questionIndex;
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isItemOpen = (categoryIndex: number, questionIndex: number) => {
    const itemId = categoryIndex * 1000 + questionIndex;
    return openItems.includes(itemId);
  };

  // SEO 설정
  const seoConfig = {
    title: 'FAQ - Philippines Rental',
    description: 'Frequently asked questions about renting apartments in Philippines. Get answers about our rental process, monthly stays, payments, and support services for foreigners.',
    keywords: 'Philippines rental FAQ, apartment rental questions, monthly stay FAQ, rental process Philippines, foreigner rental guide',
    image: '/images/og-faq.jpg'
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'FAQ', url: '/faq' }
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
      <FAQSchema questions={faqSchemaData} />

      <FacebookLayout section="faq">
          <main className="py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                ❓ Frequently Asked Questions
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                {(currentLanguage as string) === 'ko' && '필리핀 렌탈에 대한 자주 묻는 질문들을 확인하세요. 더 궁금한 점이 있으시면 언제든 문의해주세요.'}
                {(currentLanguage as string) === 'zh' && '查看有关菲律宾租房的常见问题。如有其他疑问，请随时联系我们。'}
                {(currentLanguage as string) === 'ja' && 'フィリピン賃貸に関するよくある質問をご確認ください。他にご質問がございましたら、お気軽にお問い合わせください。'}
                {(currentLanguage as string) === 'en' && 'Find answers to common questions about renting in the Philippines. Contact us if you have any other questions.'}
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search FAQ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* FAQ Content */}
            <div className="max-w-4xl mx-auto">
              {filteredFAQs.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {categoryIndex + 1}
                    </span>
                    {category.category}
                  </h2>
                  
                  <div className="space-y-4">
                    {category.questions.map((item, questionIndex) => {
                      const isOpen = isItemOpen(categoryIndex, questionIndex);
                      return (
                        <div
                          key={questionIndex}
                          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                          <button
                            onClick={() => toggleItem(categoryIndex, questionIndex)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                          >
                            <h3 className="text-lg font-medium text-gray-900 pr-4">
                              {item.question}
                            </h3>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            )}
                          </button>
                          
                          {isOpen && (
                            <div className="px-6 pb-4">
                              <div className="text-gray-600 leading-relaxed">
                                {item.answer}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  No FAQ items found matching your search.
                </div>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mt-16 text-center">
              <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
              <p className="text-lg mb-8 opacity-90">
                Our multilingual support team is here to help you 24/7
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-white/20 rounded-xl p-6">
                  <MessageCircle className="h-8 w-8 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Live Chat</h4>
                  <p className="text-sm opacity-80 mb-4">Get instant answers from our team</p>
                  <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Start Chat
                  </button>
                </div>
                
                <div className="bg-white/20 rounded-xl p-6">
                  <Phone className="h-8 w-8 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Phone Support</h4>
                  <p className="text-sm opacity-80 mb-4">Talk to our rental experts</p>
                  <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Call Now
                  </button>
                </div>
                
                <div className="bg-white/20 rounded-xl p-6">
                  <Mail className="h-8 w-8 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Email Support</h4>
                  <p className="text-sm opacity-80 mb-4">Detailed assistance via email</p>
                  <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          </main>
        <FloatingContactButton />
      </FacebookLayout>
    </>
  );
}