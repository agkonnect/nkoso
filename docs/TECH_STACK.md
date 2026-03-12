# 🛠️ Nkoso Technical Stack

## Frontend (Web)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + custom Pan-African theme
- **Language**: TypeScript
- **State**: Zustand (global), React Query (server state)
- **Video**: Cloudflare Stream / Mux
- **Icons**: Lucide React

## Frontend (Mobile) — Phase 2
- **Framework**: React Native (Expo)
- **Navigation**: Expo Router

## Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes (MVP), separate Express/Fastify (Scale)
- **ORM**: Prisma
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth (email, phone/OTP, Google OAuth)
- **Storage**: Supabase Storage (images, docs) + Cloudflare Stream (video)
- **Queue**: Bull (for payment processing, notifications)

## Blockchain
- **Network**: Polygon (PoS Mainnet)
- **Dev/Test**: Polygon Mumbai Testnet
- **Smart Contracts**: Solidity (ERC-1155 for share certificates)
- **Wallet**: Custodial (Thirdweb or Fireblocks for wallet management)
- **Explorer**: Polygonscan

## Payments
- **Gateway**: Paystack (cards + Mobile Money)
- **Mobile Money**: MTN MoMo, Vodafone Cash, AirtelTigo (via Paystack)
- **Diaspora**: Paystack USD/GBP support
- **Escrow**: Custom escrow logic with Paystack split payments

## Infrastructure
- **Hosting**: Vercel (web app)
- **Database**: Supabase (managed PostgreSQL)
- **CDN/Video**: Cloudflare
- **Email**: Resend
- **SMS**: Twilio / Africa's Talking (Ghana)
- **Monitoring**: Sentry + Vercel Analytics

## Dev Tools
- **Version Control**: Git / GitHub
- **CI/CD**: GitHub Actions + Vercel auto-deploy
- **Testing**: Jest + Playwright (E2E)
- **Docs**: Mintlify
