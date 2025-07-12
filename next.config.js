/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // i18n 설정 비활성화 - 수동으로 언어 처리
  // i18n: {
  //   locales: ['en', 'ko', 'zh', 'ja', 'tl'],
  //   defaultLocale: 'en',
  // },
  // SEO 최적화
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // 성능 최적화
  experimental: {
    scrollRestoration: true,
  },
  // 압축 최적화
  compress: true,
  // 정적 파일 최적화
  trailingSlash: false,
  // 빌드 최적화
  swcMinify: true,
  // 환경 변수
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://philippines-rental.com',
  },
}

module.exports = nextConfig