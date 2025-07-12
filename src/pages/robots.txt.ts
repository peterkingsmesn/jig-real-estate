import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://philippines-rental.com';
  
  // robots.txt 내용 생성
  const robotsTxt = `# robots.txt for Philippines Rental
User-agent: *
Allow: /

# Disallow admin pages
Disallow: /admin/
Disallow: /api/

# Disallow temporary or draft content
Disallow: /draft/
Disallow: /preview/

# Allow important pages
Allow: /properties/
Allow: /location/
Allow: /contact/
Allow: /about/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay for better server performance
Crawl-delay: 1

# Specific rules for different bots
User-agent: Googlebot
Crawl-delay: 1
Allow: /

User-agent: Bingbot
Crawl-delay: 1
Allow: /

User-agent: Slurp
Crawl-delay: 2
Allow: /

User-agent: DuckDuckBot
Crawl-delay: 1
Allow: /

User-agent: Baiduspider
Crawl-delay: 2
Allow: /

# Block aggressive bots
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /`;

  // 응답 헤더 설정
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
  res.write(robotsTxt);
  res.end();

  return {
    props: {}
  };
};

// 이 컴포넌트는 실제로 렌더링되지 않습니다
const RobotsTxt = () => {
  return null;
};

export default RobotsTxt;