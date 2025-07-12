import { GetServerSideProps } from 'next';
import { generateSitemapUrls } from '@/utils/seo';

// 이 함수는 빌드 시 호출됩니다
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://philippines-rental.com';
  
  // 정적 페이지 URL들
  const staticUrls = generateSitemapUrls();
  
  // 추가로 동적 매물 페이지들을 여기에 추가할 수 있습니다
  // 예: 데이터베이스에서 매물 ID 목록을 가져와서 URL 생성
  const dynamicUrls: string[] = [];
  
  // 모든 URL 합치기
  const allUrls = staticUrls;
  
  // XML 생성
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls.map(({ url, lastmod, changefreq, priority }) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('')}
</urlset>`;

  // 응답 헤더 설정
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=1200, stale-while-revalidate=600');
  res.write(sitemap);
  res.end();

  return {
    props: {}
  };
};

// 이 컴포넌트는 실제로 렌더링되지 않습니다
const Sitemap = () => {
  return null;
};

export default Sitemap;