/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 페이스북 메인 컬러로 변경
        primary: '#1877f2',
        secondary: '#42b72a',
        accent: '#166fe5',
        
        // 페이스북 컬러 팔레트
        facebook: {
          blue: '#1877f2',
          'blue-dark': '#166fe5',
          'blue-light': '#e7f3ff',
          green: '#42b72a',
          gray: '#f0f2f5',
          'gray-dark': '#4b4f56',
          'gray-light': '#e4e6ea',
          white: '#ffffff',
        },
        
        // 페이스북 스타일 그레이 팔레트
        gray: {
          50: '#f0f2f5',
          100: '#e4e6ea',
          200: '#d3d6db',
          300: '#b0b3b8',
          400: '#8a8d91',
          500: '#65676b',
          600: '#4b4f56',
          700: '#42454a',
          800: '#3a3b3c',
          900: '#242526',
        },
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        // 페이스북 스타일 그림자
        card: '0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 8px rgba(0, 0, 0, 0.12), 0 16px 32px rgba(0, 0, 0, 0.12)',
        facebook: '0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)',
        'facebook-hover': '0 4px 8px rgba(0, 0, 0, 0.12), 0 16px 32px rgba(0, 0, 0, 0.12)',
        'facebook-light': '0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        // 페이스북 스타일 보더 반지름
        'facebook': '6px',
        'facebook-sm': '4px',
        'facebook-lg': '8px',
        'facebook-xl': '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'facebook-pulse': 'facebookPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        facebookPulse: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.8',
          },
        },
      },
    },
  },
  plugins: [],
}