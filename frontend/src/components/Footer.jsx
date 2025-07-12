const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">JIG</h3>
            <p className="text-gray-400">
              필리핀 부동산 검색 플랫폼
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">빠른 링크</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/properties" className="hover:text-white transition-colors">
                  매물 목록
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  회사 소개
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  문의하기
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">연락처</h4>
            <ul className="space-y-2 text-gray-400">
              <li>이메일: info@jig.com</li>
              <li>전화: +63 123-456-7890</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2024 JIG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;