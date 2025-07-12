import { useState, useEffect } from 'react';
import { MenuItem } from '@/types/menu';

const MENU_STORAGE_KEY = 'menuItems';

export const useMenuManager = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 기본 메뉴 항목들
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
        en: { title: 'Home' }
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
        ko: { title: '매물' },
        zh: { title: '房源' },
        ja: { title: '物件' },
        en: { title: 'Properties' }
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      title: 'Manila',
      url: '/location/manila',
      icon: '🏙️',
      order: 3,
      isVisible: true,
      isExternal: false,
      translations: {
        ko: { title: '마닐라' },
        zh: { title: '马尼拉' },
        ja: { title: 'マニラ' },
        en: { title: 'Manila' }
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      title: 'Cebu',
      url: '/location/cebu',
      icon: '🏝️',
      order: 4,
      isVisible: true,
      isExternal: false,
      translations: {
        ko: { title: '세부' },
        zh: { title: '宿务' },
        ja: { title: 'セブ' },
        en: { title: 'Cebu' }
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '5',
      title: 'Angeles',
      url: '/location/angeles',
      icon: '🏢',
      order: 5,
      isVisible: true,
      isExternal: false,
      translations: {
        ko: { title: '앙헬레스' },
        zh: { title: '安吉利斯' },
        ja: { title: 'アンヘレス' },
        en: { title: 'Angeles' }
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '6',
      title: 'Monthly Stay',
      url: '/?category=monthly_stay',
      icon: '📅',
      order: 6,
      isVisible: true,
      isExternal: false,
      translations: {
        ko: { title: '한달살기' },
        zh: { title: '月租' },
        ja: { title: '月滞在' },
        en: { title: 'Monthly Stay' }
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '7',
      title: 'Blog',
      url: '/blog',
      icon: '📖',
      order: 7,
      isVisible: true,
      isExternal: false,
      translations: {
        ko: { title: '블로그' },
        zh: { title: '博客' },
        ja: { title: 'ブログ' },
        en: { title: 'Blog' }
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '8',
      title: 'FAQ',
      url: '/faq',
      icon: '❓',
      order: 8,
      isVisible: true,
      isExternal: false,
      translations: {
        ko: { title: '자주묻는질문' },
        zh: { title: '常见问题' },
        ja: { title: 'よくある質問' },
        en: { title: 'FAQ' }
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '9',
      title: 'Contact',
      url: '/contact',
      icon: '📞',
      order: 9,
      isVisible: true,
      isExternal: false,
      translations: {
        ko: { title: '문의' },
        zh: { title: '联系' },
        ja: { title: '連絡' },
        en: { title: 'Contact' }
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '10',
      title: 'About',
      url: '/about',
      icon: '💡',
      order: 10,
      isVisible: true,
      isExternal: false,
      translations: {
        ko: { title: '소개' },
        zh: { title: '关于' },
        ja: { title: '紹介' },
        en: { title: 'About' }
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  // 메뉴 항목 로드
  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = () => {
    try {
      // 클라이언트 사이드에서만 localStorage 접근
      if (typeof window !== 'undefined') {
        const savedMenuItems = localStorage.getItem(MENU_STORAGE_KEY);
        if (savedMenuItems) {
          setMenuItems(JSON.parse(savedMenuItems));
        } else {
          setMenuItems(defaultMenuItems);
          localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(defaultMenuItems));
        }
      } else {
        // 서버 사이드에서는 기본값 사용
        setMenuItems(defaultMenuItems);
      }
    } catch (error) {
      console.error('Error loading menu items:', error);
      setMenuItems(defaultMenuItems);
    } finally {
      setLoading(false);
    }
  };

  // 메뉴 항목 저장
  const saveMenuItems = (items: MenuItem[]) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
      }
      setMenuItems(items);
    } catch (error) {
      console.error('Error saving menu items:', error);
    }
  };

  // 메뉴 항목 추가
  const addMenuItem = (item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedItems = [...menuItems, newItem];
    saveMenuItems(updatedItems);
    return newItem;
  };

  // 메뉴 항목 수정
  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    const updatedItems = menuItems.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: new Date().toISOString() }
        : item
    );
    saveMenuItems(updatedItems);
  };

  // 메뉴 항목 삭제
  const deleteMenuItem = (id: string) => {
    const updatedItems = menuItems.filter(item => item.id !== id);
    saveMenuItems(updatedItems);
  };

  // 메뉴 항목 순서 변경
  const reorderMenuItems = (items: MenuItem[]) => {
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
      updatedAt: new Date().toISOString()
    }));
    saveMenuItems(reorderedItems);
  };

  // 메뉴 항목 가시성 토글
  const toggleMenuItemVisibility = (id: string) => {
    const updatedItems = menuItems.map(item => 
      item.id === id 
        ? { ...item, isVisible: !item.isVisible, updatedAt: new Date().toISOString() }
        : item
    );
    saveMenuItems(updatedItems);
  };

  // 가시적인 메뉴 항목들 가져오기
  const getVisibleMenuItems = () => {
    return menuItems
      .filter(item => item.isVisible)
      .sort((a, b) => a.order - b.order);
  };

  // 메뉴 초기화
  const resetMenuItems = () => {
    saveMenuItems(defaultMenuItems);
  };

  return {
    menuItems,
    loading,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    reorderMenuItems,
    toggleMenuItemVisibility,
    getVisibleMenuItems,
    resetMenuItems,
    refreshMenuItems: loadMenuItems
  };
};