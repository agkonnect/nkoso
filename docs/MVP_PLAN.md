# 🚀 Nkoso MVP Plan

## MVP Goal
Validate core concept: Can we get founders to list businesses AND get community members
to volunteer/invest within a social feed experience?

## MVP Scope (Phase 1 Web App)

### Pages & Features

| Page                | Features                                                    | Priority |
|---------------------|-------------------------------------------------------------|----------|
| `/`                 | Landing page, hero, how it works, CTA                       | P0       |
| `/auth`             | Sign up / Login (email + Google)                            | P0       |
| `/feed`             | Scrollable pitch card feed, reactions, filter by sector     | P0       |
| `/listing/create`   | Create business listing form (details, images, goals)       | P0       |
| `/listing/[id]`     | Business detail page, pitch video, support options          | P0       |
| `/profile/[id]`     | User profile (founder/investor/volunteer view)              | P1       |
| `/dashboard`        | Founder dashboard (listings, investments received, stats)   | P1       |
| `/invest/[id]`      | Investment flow modal (amount, payment method, confirm)     | P1       |
| `/volunteer/[id]`   | Volunteer application form                                  | P1       |
| `/explore`          | Search + filter all listings by sector/stage/location       | P2       |
| `/notifications`    | Activity feed (new investors, volunteers, comments)         | P2       |

### User Roles (MVP)
- **Founder**: Can create listings, view who invested/volunteered, post updates
- **Supporter**: Can invest (mock payment), volunteer (apply), react/comment
- **Admin**: Can verify listings, manage users (internal dashboard)

### MVP Constraints
- Payments: Mock/demo flow (Paystack test mode)
- Blockchain certs: Simulated (Phase 2)
- Video: YouTube embed or direct upload (Cloudflare Stream Phase 2)
- Mobile: Web responsive only (React Native Phase 2)

## Success Metrics
- 50+ business listings in first month
- 200+ registered users in first month
- 30%+ of listings receive at least one volunteer application or investment
- Average session time > 3 minutes
