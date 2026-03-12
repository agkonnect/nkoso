# 🌍 Nkoso — Grow Together

> A social investment & collaboration platform for African startups

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com)

## What is Nkoso?

Nkoso (*"growth"* in Twi/Akan) is a social-first platform where Ghanaian entrepreneurs
list their businesses or ideas, and a community of supporters can:

- 🙌 **Volunteer** their skills (design, code, marketing, legal, etc.)
- 💰 **Invest** money for equity via Mobile Money
- 📊 **Buy micro-shares** (fractional equity from GHS 10)
- 🔥 **React, comment, follow** — the social layer that makes it sticky

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/nkoso.git
cd nkoso/web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase URL and anon key

# Set up database
# Run supabase/schema.sql in your Supabase SQL Editor

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
nkoso/web/
├── app/                     # Next.js App Router pages
│   ├── page.tsx             # Landing page
│   ├── auth/page.tsx        # Sign up / Sign in
│   ├── feed/page.tsx        # Pitch Wall (main feed)
│   ├── listing/create/      # Create listing (multi-step form)
│   ├── listing/[id]/        # Listing detail page
│   ├── dashboard/page.tsx   # User dashboard
│   └── profile/[id]/        # User profile
├── components/              # Reusable React components
│   ├── Navbar.tsx           # Navigation bar
│   ├── ListingCard.tsx      # Business listing card
│   ├── InvestModal.tsx      # Investment flow modal
│   └── VolunteerModal.tsx   # Volunteer application modal
├── lib/                     # Utilities and config
│   ├── types.ts             # TypeScript type definitions
│   ├── utils.ts             # Helper functions
│   ├── supabase-client.ts   # Browser Supabase client
│   └── supabase-server.ts   # Server Supabase client
└── supabase/
    └── schema.sql           # Complete database schema
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS (Pan-African theme) |
| Auth | Supabase Auth (email + Google OAuth) |
| Database | PostgreSQL via Supabase |
| Payments | Paystack (Mobile Money + Card) |
| State | React useState + Zustand (Phase 2) |
| Hosting | Vercel |

## 🗺️ MVP Features

- [x] Landing page with Pan-African design
- [x] Email + Google authentication
- [x] Role selection (Founder / Supporter)
- [x] Business listing creation (4-step form)
- [x] Pitch Wall feed with search & filters
- [x] Business detail page with full pitch
- [x] Investment modal (MoMo + Card flow)
- [x] Volunteer application modal
- [x] User dashboard (listings, investments, volunteer apps)
- [x] User profile page
- [x] Reaction system (Hype, Can Help, Would Invest, Support)
- [x] Comments system
- [ ] Real Paystack payment integration
- [ ] Blockchain share certificates (Phase 2)
- [ ] Video pitch upload (Phase 2)
- [ ] Mobile app — React Native (Phase 2)

## 🔧 Environment Variables

See `.env.example` for all required variables.

Minimum required to run:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 📊 Database Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Run the contents of `supabase/schema.sql`
4. Copy your project URL and anon key to `.env.local`

## 🚢 Deployment

### Vercel (Recommended)
```bash
npx vercel --prod
```
Set environment variables in Vercel dashboard.

## 📄 Documentation

See the `/docs` folder for:
- `PLATFORM_CONCEPT.md` — Full platform vision
- `TECH_STACK.md` — Technical architecture
- `MVP_PLAN.md` — MVP scope and roadmap
- `DATABASE_SCHEMA.md` — Database design

## 📜 License

MIT License — Built with ❤️ in Ghana 🇬🇭
