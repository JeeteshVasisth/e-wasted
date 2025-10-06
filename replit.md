# E-Wasted: E-Waste Recycling Application

## Overview
E-Wasted is a comprehensive e-waste recycling web application that helps users responsibly dispose of electronic waste. The application features AI-powered tools using Google's Gemini API to identify e-waste, find recycling centers, analyze device impact, provide data security advice, and includes an AI chatbot assistant.

## Project Architecture
- **Frontend**: Vite + TypeScript + Vanilla JavaScript
- **Styling**: TailwindCSS (via CDN)
- **AI Integration**: Google Gemini API (@google/genai)
- **Port**: 5000 (configured for Replit environment)
- **Email Service**: EmailJS for contact form

## Recent Changes (October 6, 2025)
- Configured Vite to run on port 5000 with proper host settings for Replit proxy
- Fixed vite.config.ts to use ES modules (fileURLToPath, dirname) instead of CommonJS __dirname
- Created .gitignore with Node.js patterns
- Set up workflow to run `npm run dev` on port 5000
- Configured deployment to build with Vite and serve with preview mode
- Created empty index.css to prevent 404 errors
- Verified GEMINI_API_KEY is properly configured as environment secret

## Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key (required for AI features)
  - Get from: https://aistudio.google.com/apikey
  - Used for: E-waste identification, recycling center locator, device impact analysis, data security advisor, chatbot

## Key Features
1. **E-Waste Identifier**: Upload images to identify electronic waste items
2. **Smart Recycling Locator**: Find nearby recycling centers based on device type and location
3. **Device Impact & Reuse Analyzer**: Get environmental impact estimates and recommendations
4. **Data Security Advisor**: Step-by-step guides for secure data wiping
5. **AI Chatbot Assistant**: Interactive help for recycling questions
6. **Contact Form**: Schedule pickups and inquiries

## Running Locally
```bash
npm install
npm run dev
```
Application will be available at http://localhost:5000

## Deployment
The application is configured for Replit autoscale deployment:
- Build: `npm run build`
- Run: `npx vite preview --host 0.0.0.0 --port 5000`

## Project Structure
```
/
├── index.html              # Main HTML file
├── index.js                # Main JavaScript logic
├── index.tsx               # (Empty TypeScript entry)
├── index.css               # Custom styles
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
├── services/
│   ├── geminiService.js    # Gemini API integration
│   └── geminiService.ts    # (Empty TypeScript version)
└── .gitignore              # Git ignore patterns
```

## Notes
- The application uses TailwindCSS via CDN (should be migrated to PostCSS for production)
- Mock responses are provided when GEMINI_API_KEY is not set
- EmailJS configuration requires user to set up their own service ID and template ID in index.js
