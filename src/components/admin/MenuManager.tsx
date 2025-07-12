import { useState, useEffect } from 'react';
import { MenuItem, MenuFormData, MenuTranslations } from '@/types/menu';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  GripVertical, 
  ExternalLink,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  Info,
  Sparkles
} from 'lucide-react';

interface MenuManagerProps {
  language?: string;
}

export default function MenuManager({ language = 'en' }: MenuManagerProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<MenuFormData>({
    title: '',
    url: '',
    icon: '',
    isVisible: true,
    isExternal: false,
    parentId: '',
    translations: {
      ko: { title: '' },
      zh: { title: '' },
      ja: { title: '' },
      en: { title: '' }
    }
  });

  // 초기 메뉴 데이터 로드
  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = () => {
    // 실제로는 API에서 가져올 데이터
    const mockMenuItems: MenuItem[] = [
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
        title: 'Monthly Stay',
        url: '/monthly-stay',
        icon: '📅',
        order: 3,
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
        id: '4',
        title: 'Contact',
        url: '/contact',
        icon: '📞',
        order: 4,
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
      }
    ];
    setMenuItems(mockMenuItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      // 수정 모드
      const updatedItems = menuItems.map(item => 
        item.id === editingItem.id 
          ? {
              ...item,
              ...formData,
              updatedAt: new Date().toISOString()
            }
          : item
      );
      setMenuItems(updatedItems);
      setEditingItem(null);
    } else {
      // 추가 모드
      const newItem: MenuItem = {
        id: Date.now().toString(),
        ...formData,
        order: menuItems.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setMenuItems([...menuItems, newItem]);
      setIsAddingItem(false);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      icon: '',
      isVisible: true,
      isExternal: false,
      parentId: '',
      translations: {
        ko: { title: '' },
        zh: { title: '' },
        ja: { title: '' },
        en: { title: '' }
      }
    });
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      url: item.url,
      icon: item.icon || '',
      isVisible: item.isVisible,
      isExternal: item.isExternal,
      parentId: item.parentId || '',
      translations: item.translations
    });
  };

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const handleDelete = (id: string) => {
    const item = menuItems.find(m => m.id === id);
    if (!item) return;
    
    setDeleteConfirm(id);
    setShowDeleteWarning(true);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setMenuItems(menuItems.filter(item => item.id !== deleteConfirm));
      setDeleteConfirm(null);
      setShowDeleteWarning(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
    setShowDeleteWarning(false);
  };

  const toggleVisibility = (id: string) => {
    setMenuItems(menuItems.map(item => 
      item.id === id 
        ? { ...item, isVisible: !item.isVisible, updatedAt: new Date().toISOString() }
        : item
    ));
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const itemIndex = menuItems.findIndex(item => item.id === id);
    if (itemIndex === -1) return;

    const newItems = [...menuItems];
    const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < newItems.length) {
      // 순서 교환
      [newItems[itemIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[itemIndex]];
      
      // order 값 업데이트
      newItems.forEach((item, index) => {
        item.order = index + 1;
        item.updatedAt = new Date().toISOString();
      });
      
      setMenuItems(newItems);
    }
  };

  const getTranslatedTitle = (item: MenuItem) => {
    const translation = item.translations[language as keyof MenuTranslations];
    return translation?.title || item.title;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span>메뉴 관리</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            웹사이트 메뉴를 추가, 수정, 삭제하고 순서를 조정할 수 있습니다.
          </p>
        </div>
        <button
          onClick={() => setIsAddingItem(true)}
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">새 메뉴 추가</span>
        </button>
      </div>

      {/* 도움말 */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">메뉴 관리 도움말</p>
            <ul className="space-y-1 text-xs">
              <li>• 👁️ 눈 아이콘: 메뉴 표시/숨김 토글</li>
              <li>• ✏️ 편집 아이콘: 메뉴 내용 수정</li>
              <li>• 🗑️ 삭제 아이콘: 메뉴 삭제 (확인 필요)</li>
              <li>• ⬆️⬇️ 화살표: 메뉴 순서 조정</li>
              <li>• 🔗 외부 링크는 새 창에서 열립니다</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 메뉴 목록 */}
      <div className="space-y-3">
        {menuItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-lg font-medium mb-2">메뉴가 없습니다</p>
            <p className="text-sm">새 메뉴를 추가해보세요!</p>
          </div>
        ) : (
          menuItems.map((item, index) => (
            <div
              key={item.id}
              className={`border-2 rounded-xl p-5 transition-all duration-200 ${
                item.isVisible 
                  ? 'border-gray-200 bg-white shadow-sm hover:shadow-md' 
                  : 'border-gray-300 bg-gray-50 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* 순서 조정 버튼 */}
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => moveItem(item.id, 'up')}
                      disabled={index === 0}
                      className={`p-2 rounded-lg transition-colors ${
                        index === 0
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      title="위로 이동"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveItem(item.id, 'down')}
                      disabled={index === menuItems.length - 1}
                      className={`p-2 rounded-lg transition-colors ${
                        index === menuItems.length - 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      title="아래로 이동"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* 드래그 핸들 */}
                  <div className="text-gray-400 cursor-move" title="드래그하여 순서 변경">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  
                  {/* 메뉴 정보 */}
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl p-2 bg-gray-100 rounded-lg">
                      {item.icon || '📄'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">
                        {getTranslatedTitle(item)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">{item.url}</span>
                        {item.isExternal && (
                          <span className="flex items-center space-x-1 text-blue-600">
                            <ExternalLink className="h-3 w-3" />
                            <span className="text-xs">외부링크</span>
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        순서: {item.order} | 생성: {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleVisibility(item.id)}
                    className={`p-3 rounded-lg transition-colors font-medium ${
                      item.isVisible 
                        ? 'text-green-700 bg-green-50 hover:bg-green-100 border border-green-200' 
                        : 'text-gray-500 bg-gray-100 hover:bg-gray-200 border border-gray-300'
                    }`}
                    title={item.isVisible ? '메뉴 숨기기' : '메뉴 표시'}
                  >
                    {item.isVisible ? (
                      <>
                        <Eye className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-3 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                    title="메뉴 편집"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-3 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                    title="메뉴 삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteWarning && deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                메뉴 삭제 확인
              </h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                다음 메뉴를 삭제하시겠습니까?
              </p>
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
                <div className="font-medium text-gray-900">
                  {menuItems.find(item => item.id === deleteConfirm)?.title}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {menuItems.find(item => item.id === deleteConfirm)?.url}
                </div>
              </div>
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>주의:</strong> 삭제된 메뉴는 복구할 수 없습니다. 웹사이트에서 해당 메뉴가 즉시 사라집니다.
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                삭제하기
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 메뉴 추가/수정 폼 */}
      {(isAddingItem || editingItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                {editingItem ? (
                  <>
                    <Edit className="h-6 w-6 text-blue-600" />
                    <span>메뉴 수정</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-6 w-6 text-green-600" />
                    <span>새 메뉴 추가</span>
                  </>
                )}
              </h3>
              <button
                onClick={() => {
                  setIsAddingItem(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 기본 정보 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">기본 정보</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      메뉴 이름 (기본) *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="예: Home"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      아이콘 (이모지)
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="🏠"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL 주소 *
                </label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="내부: /about | 외부: https://example.com"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  내부 페이지는 "/"로 시작하고, 외부 사이트는 "https://"로 시작합니다
                </p>
              </div>

              {/* 다국어 번역 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">다국어 번역</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🇰🇷 한국어
                    </label>
                    <input
                      type="text"
                      value={formData.translations.ko?.title || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        translations: { 
                          ...formData.translations, 
                          ko: { title: e.target.value } 
                        } 
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="예: 홈"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🇨🇳 중국어
                    </label>
                    <input
                      type="text"
                      value={formData.translations.zh?.title || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        translations: { 
                          ...formData.translations, 
                          zh: { title: e.target.value } 
                        } 
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="예: 首页"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🇯🇵 일본어
                    </label>
                    <input
                      type="text"
                      value={formData.translations.ja?.title || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        translations: { 
                          ...formData.translations, 
                          ja: { title: e.target.value } 
                        } 
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="예: ホーム"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🇺🇸 영어
                    </label>
                    <input
                      type="text"
                      value={formData.translations.en?.title || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        translations: { 
                          ...formData.translations, 
                          en: { title: e.target.value } 
                        } 
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="예: Home"
                    />
                  </div>
                </div>
              </div>

              {/* 옵션 설정 */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">옵션 설정</h4>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isVisible}
                      onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-700">👁️ 메뉴 표시</span>
                      <p className="text-xs text-gray-500">체크하면 웹사이트에 메뉴가 표시됩니다</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isExternal}
                      onChange={(e) => setFormData({ ...formData, isExternal: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-700">🔗 외부 링크</span>
                      <p className="text-xs text-gray-500">체크하면 새 창에서 링크가 열립니다</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Save className="h-5 w-5" />
                  <span>{editingItem ? '수정 완료' : '추가 완료'}</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingItem(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}