# Philippines Rental Website - Setup Instructions

## Quick Start

### Option 1: Using Batch Files (Windows)

1. **First Time Setup:**
   - Double-click `install-dependencies.bat`
   - Wait for installation to complete

2. **Start Development Server:**
   - Double-click `start-server.bat`
   - Open browser and go to: http://localhost:3005

3. **Build for Production:**
   - Double-click `build-production.bat`

### Option 2: Using Command Line

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   npm run start
   ```

## Available Scripts

- `npm run dev` - Start development server on port 3005
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Access URLs

- **Development:** http://localhost:3005
- **Production:** http://localhost:3005

## Requirements

- Node.js (version 18 or higher)
- npm (comes with Node.js)

## Project Structure

```
philippines-rental/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Next.js pages
│   ├── types/          # TypeScript types
│   ├── data/           # Mock data
│   └── styles/         # CSS styles
├── public/             # Static files
├── package.json        # Project dependencies
└── *.bat              # Windows batch files
```

## Features

- 🏠 Property listings with images
- 🔍 Search and filter functionality
- 🌍 Multi-language support (Korean, Chinese, Japanese, English)
- 📱 Responsive design (mobile-friendly)
- 💬 Contact integration (WhatsApp, Telegram)
- ⭐ Featured properties section

## Troubleshooting

1. **Port 3005 is already in use:**
   - Close any existing server
   - Or change port in package.json

2. **Dependencies not installing:**
   - Make sure Node.js is installed
   - Try running as administrator

3. **Website not loading:**
   - Check if server is running
   - Try refreshing the browser
   - Check console for errors