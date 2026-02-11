# JollofAI

React + Vite + TypeScript app with TailwindCSS for AI-powered recipe generation.

## Features

- ✅ React + Vite + TypeScript setup
- ✅ TailwindCSS with custom primary color (`#16A34A`)
- ✅ React Router with responsive navigation
- ✅ Complete Authentication System (JWT-based)
- ✅ Recipe Generator with AI assistance
- ✅ Recipe Discovery with 30+ African recipes
- ✅ Advanced Voice Input integration
- ✅ Vendor Marketplace with shopping cart
- ✅ Comprehensive Ingredient Database
- ✅ **NEW: AI Chat Assistant** 🤖
- ✅ **NEW: Cooking Progress Tracking** 👨‍🍳
- ✅ **NEW: Step-by-step Cooking Mode with Timers** ⏱️

### AI Chat Features

- Real-time cooking assistance
- Context-aware responses based on current recipe
- Voice input support
- Recipe modifications and substitutions
- Traditional African cooking techniques
- Fallback responses when API is unavailable

### Cooking Progress Features

- Step-by-step cooking guidance
- Interactive timers with audio alerts
- Progress tracking through recipe steps
- Equipment and temperature guidance
- Pro cooking tips for each step
- Hands-free cooking mode
- Recipe completion tracking

## Quick Start

```powershell
cd c:\Users\HP\Documents\joffofai-frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Navigation with all app routes
│   │   ├── Footer.tsx           # Simple footer
│   │   ├── AIChat.tsx           # 🤖 AI Chat Assistant component
│   │   ├── CookingProgress.tsx  # 👨‍🍳 Step-by-step cooking guide
│   │   ├── VoiceInput.tsx       # 🎤 Voice recognition input
│   │   └── Button.tsx           # Reusable button component
│   ├── pages/
│   │   ├── Home.tsx             # Hero + featured recipes
│   │   ├── Recipe.tsx           # Recipe generation UI
│   │   ├── RecipeDetail.tsx     # Recipe details + cooking mode
│   │   ├── RecipeDiscovery.tsx  # Browse 30+ African recipes
│   │   ├── AIChatPage.tsx       # 🤖 Dedicated AI chat interface
│   │   ├── VendorMarketplace.tsx# 🛒 Ingredient shopping
│   │   ├── Ingredients.tsx      # 🥬 Ingredient database
│   │   ├── Dashboard.tsx        # User dashboard
│   │   └── About.tsx            # About page
│   ├── contexts/
│   │   └── AuthContext.tsx      # JWT authentication
│   ├── config/
│   │   └── api.ts              # API configuration + endpoints
│   ├── App.tsx                 # Main app with routing
│   ├── main.tsx                # Entry point
│   └── index.css               # Tailwind directives
├── tailwind.config.cjs         # Primary color: #16A34A
└── package.json                # Dependencies + scripts
```

## API Integration

### Authentication

- `POST /auth/signup` - Create new user account
- `POST /auth/login` - User login with email/password
- `POST /auth/google` - Google OAuth authentication
- `POST /auth/reset-password` - Password reset functionality

### AI & Chat

- `POST /ai/chat` - Send message to AI cooking assistant
- `POST /ai/cooking-assistance` - Get cooking help and guidance
- `POST /ai/ingredient-suggestions` - Get ingredient recommendations
- `POST /ai/recipe-modifications` - Request recipe adjustments

### Recipes

- `POST /recipes/match-ingredients` - Generate recipes from ingredients (FormData with `ingredients` string and optional `image_*` files)
- `GET /recipes` - Get user's recipe history
- `GET /recipes/foryou` - Get personalized recommendations

### Vendors

- `GET /vendors` - Get all vendors
- `GET /vendors/nearby` - Get nearby vendors




- Clean, minimal UI with proper spacing and typography
```
