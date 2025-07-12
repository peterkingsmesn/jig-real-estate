// 메뉴 캐시 초기화 함수
export const resetMenuCache = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('menuItems');
    console.log('Menu cache cleared. Please refresh the page to see new menu items.');
  }
};

// 개발 모드에서 콘솔에서 직접 호출할 수 있도록 global 객체에 추가
if (typeof window !== 'undefined') {
  (window as any).resetMenuCache = resetMenuCache;
}