import { useState, useEffect } from 'react';
import { Globe, Menu, X, ExternalLink } from 'lucide-react';
import { MenuItem, MenuTranslations } from '@/types/menu';

interface DynamicHeaderProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const languages = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'tl', name: 'Tagalog', flag: '🇵🇭' },
];

export default function DynamicHeader({ currentLanguage, onLanguageChange }: DynamicHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = () => {
    // localStorage 무시하고 항상 새로운 메뉴 로드
    // if (typeof window !== 'undefined') {
    //   const savedMenuItems = localStorage.getItem('menuItems');
    //   if (savedMenuItems) {
    //     setMenuItems(JSON.parse(savedMenuItems));
    //     return;
    //   }
    // }
    
    // 기본 메뉴 항목들 - 중복 제거하고 깔끔하게
    const defaultMenuItems: MenuItem[] = [
      {
        id: '1',
        title: 'Home',
        url: '/',
        icon: '🏠',
        order: 1,
        isVisible: true,
        isExternal: false,
        translations: {
          ko: { title: '홈' },
          zh: { title: '首页' },
          ja: { title: 'ホーム' },
          en: { title: 'Home' },
          tl: { title: 'Tahanan' }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        title: 'Properties',
        url: '/properties',
        icon: '🏢',
        order: 2,
        isVisible: true,
        isExternal: false,
        translations: {
          ko: { title: '렌탈매물' },
          zh: { title: '租赁房源' },
          ja: { title: 'レンタル物件' },
          en: { title: 'Properties' },
          tl: { title: 'Mga Ari-arian' }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '3',
        title: 'Marketplace',
        url: '/marketplace',
        icon: '🛒',
        order: 3,
        isVisible: true,
        isExternal: false,
        translations: {
          ko: { title: '중고거래' },
          zh: { title: '二手市场' },
          ja: { title: '中古市場' },
          en: { title: 'Marketplace' },
          tl: { title: 'Palengke' }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '4',
        title: 'Jobs',
        url: '/jobs',
        icon: '💼',
        order: 4,
        isVisible: true,
        isExternal: false,
        translations: {
          ko: { title: '구인구직' },
          zh: { title: '求职招聘' },
          ja: { title: '求人' },
          en: { title: 'Jobs' },
          tl: { title: 'Mga Trabaho' }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '5',
        title: 'Grab Drivers',
        url: '/grab-drivers',
        icon: '🚗',
        order: 5,
        isVisible: true,
        isExternal: false,
        translations: {
          ko: { title: '그랩 앤 앙카스' },
          zh: { title: 'Grab & Angkas' },
          ja: { title: 'Grab & Angkas' },
          en: { title: 'Grab & Angkas' },
          tl: { title: 'Grab at Angkas' }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '6',
        title: 'Community',
        url: '/community',
        icon: '👥',
        order: 6,
        isVisible: true,
        isExternal: false,
        translations: {
          ko: { title: '커뮤니티' },
          zh: { title: '社区' },
          ja: { title: 'コミュニティ' },
          en: { title: 'Community' },
          tl: { title: 'Komunidad' }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '7',
        title: 'Manila',
        url: '/location/manila',
        icon: '🏙️',
        order: 7,
        isVisible: true,
        isExternal: false,
        translations: {
          ko: { title: '마닐라' },
          zh: { title: '马尼拉' },
          ja: { title: 'マニラ' },
          en: { title: 'Manila' },
          tl: { title: 'Maynila' }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '8',
        title: 'Cebu',
        url: '/location/cebu',
        icon: '🏝️',
        order: 8,
        isVisible: true,
        isExternal: false,
        translations: {
          ko: { title: '세부' },
          zh: { title: '宿务' },
          ja: { title: 'セブ' },
          en: { title: 'Cebu' },
          tl: { title: 'Cebu' }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '10',
        title: 'Load/Prepaid',
        url: '/load',
        icon: '📱',
        order: 10,
        isVisible: true,
        isExternal: false,
        translations: {
          ko: { title: '선불충전' },
          zh: { title: '充值' },
          ja: { title: 'プリペイド' },
          en: { title: 'Load/Prepaid' },
          tl: { title: 'Load' }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '11',
        title: 'Weather/Typhoon',
        url: '/weather',
        icon: '🌪️',
        order: 11,
        isVisible: true,
        isExternal: false,
        translations: {
          ko: { title: '날씨/태풍' },
          zh: { title: '天气/台风' },
          ja: { title: '天気/台風' },
          en: { title: 'Weather/Typhoon' },
          tl: { title: 'Panahon/Bagyo' }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '14',
        title: 'Immigration',
        url: '/immigration',
        icon: '🏛️',
        order: 14,
        isVisible: true,
        isExternal: false,
        translations: {
          ko: { title: '이민국' },
          zh: { title: '移民局' },
          ja: { title: '入管' },
          en: { title: 'Immigration' },
          tl: { title: 'Immigration' }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '15',
        title: 'Police',
        url: '/police',
        icon: '🚔',
        order: 15,
        isVisible: true,
        isExternal: false,
        translations: {
          ko: { title: '경찰국' },
          zh: { title: '警察局' },
          ja: { title: '警察' },
          en: { title: 'Police' },
          tl: { title: 'Pulis' }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '16',
        title: 'Angeles',
        url: '/location/angeles',
        icon: '🌆',
        order: 16,
        isVisible: true,
        isExternal: false,
        translations: {
          ko: { title: '앙헬레스' },
          zh: { title: '安吉利斯' },
          ja: { title: 'アンヘレス' },
          en: { title: 'Angeles' },
          tl: { title: 'Angeles' }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];
    
    setMenuItems(defaultMenuItems);
    // localStorage 제거 - 항상 새로운 메뉴 사용
  };

  const getTranslatedTitle = (item: MenuItem) => {
    const translation = item.translations[currentLanguage as keyof MenuTranslations];
    return translation?.title || item.title;
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.isExternal) {
      window.open(item.url, '_blank');
    } else {
      window.location.href = item.url;
    }
    setIsMenuOpen(false);
  };

  const visibleMenuItems = menuItems
    .filter(item => item.isVisible)
    .sort((a, b) => a.order - b.order);

  const firstLineItems = visibleMenuItems.slice(0, 4); // 첫 번째 줄: 홈~구인구직
  const secondLineItems = visibleMenuItems.slice(4, 8); // 두 번째 줄: 그랩앤앙카스~커뮤니티  
  const thirdLineItems = visibleMenuItems.slice(8); // 세 번째 줄: 편의서비스들 + 지역들

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 첫 번째 줄: 로고 + 주요 메뉴 + 언어선택 */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary">
                필직 (Phil Jig)
              </h1>
            </div>
          </div>

          {/* Desktop Navigation - First Line */}
          <div className="hidden lg:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              {firstLineItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors font-medium"
                >
                  {item.icon && <span className="text-lg">{item.icon}</span>}
                  <span>{getTranslatedTitle(item)}</span>
                  {item.isExternal && <ExternalLink className="h-3 w-3" />}
                </button>
              ))}
            </nav>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm">{currentLang?.flag} {currentLang?.name}</span>
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                        currentLanguage === lang.code ? 'bg-blue-50 text-primary' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* 두 번째 줄: 서비스 메뉴들 */}
        <div className="hidden lg:flex items-center justify-center border-t border-gray-100 py-3">
          <nav className="flex items-center space-x-8">
            {secondLineItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors"
              >
                {item.icon && <span className="text-sm">{item.icon}</span>}
                <span className="text-sm">{getTranslatedTitle(item)}</span>
                {item.isExternal && <ExternalLink className="h-3 w-3" />}
              </button>
            ))}
          </nav>
        </div>

        {/* 세 번째 줄: 지역 메뉴들 */}
        <div className="hidden lg:flex items-center justify-center border-t border-gray-100 py-2">
          <nav className="flex items-center space-x-6">
            {thirdLineItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors"
              >
                {item.icon && <span className="text-xs">{item.icon}</span>}
                <span className="text-xs">{getTranslatedTitle(item)}</span>
                {item.isExternal && <ExternalLink className="h-2 w-2" />}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
            {/* 주요 메뉴들 */}
            {visibleMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{getTranslatedTitle(item)}</span>
                {item.isExternal && <ExternalLink className="h-3 w-3" />}
              </button>
            ))}
            
            {/* 언어 선택 */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="px-3 py-2 text-sm text-gray-500 font-medium">Language</div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-6 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors ${
                    currentLanguage === lang.code ? 'bg-blue-50 text-primary' : 'text-gray-700'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}