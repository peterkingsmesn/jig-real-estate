export interface MenuItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  order: number;
  isVisible: boolean;
  isExternal: boolean;
  parentId?: string;
  children?: MenuItem[];
  translations: MenuTranslations;
  createdAt: string;
  updatedAt: string;
}

export interface MenuTranslations {
  ko?: { title: string; };
  zh?: { title: string; };
  ja?: { title: string; };
  en?: { title: string; };
  tl?: { title: string; };
}

export interface MenuConfig {
  id: string;
  name: string;
  position: 'header' | 'footer' | 'sidebar';
  items: MenuItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuFormData {
  title: string;
  url: string;
  icon?: string;
  isVisible: boolean;
  isExternal: boolean;
  parentId?: string;
  translations: MenuTranslations;
}