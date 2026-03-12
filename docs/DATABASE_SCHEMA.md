# 🗄️ Nkoso Database Schema

## Tables

### users
- id (uuid, PK) — from Supabase Auth
- username (text, unique)
- full_name (text)
- avatar_url (text)
- bio (text)
- role (enum: founder, supporter, admin)
- location (text)
- phone (text)
- is_verified (boolean)
- ghana_card_verified (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)

### listings
- id (uuid, PK)
- founder_id (uuid, FK → users)
- title (text)
- tagline (text)
- description (text)
- sector (enum: tech, food, fashion, agriculture, health, education, finance, retail, other)
- stage (enum: idea, mvp, growing, established)
- location (text)
- cover_image_url (text)
- pitch_video_url (text)
- funding_goal (numeric)
- funding_raised (numeric)
- equity_offered (numeric) -- percentage
- share_price (numeric)
- total_shares (integer)
- shares_sold (integer)
- skills_needed (text[])
- is_verified (boolean)
- is_active (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)

### investments
- id (uuid, PK)
- listing_id (uuid, FK → listings)
- investor_id (uuid, FK → users)
- amount (numeric)
- shares_bought (integer)
- payment_method (enum: mobile_money, card, bank_transfer)
- payment_reference (text)
- status (enum: pending, confirmed, failed, refunded)
- certificate_token_id (text) -- blockchain cert ID (Phase 2)
- created_at (timestamptz)

### volunteer_applications
- id (uuid, PK)
- listing_id (uuid, FK → listings)
- volunteer_id (uuid, FK → users)
- skills_offered (text[])
- message (text)
- status (enum: pending, accepted, rejected, completed)
- hours_committed (integer)
- created_at (timestamptz)

### reactions
- id (uuid, PK)
- listing_id (uuid, FK → listings)
- user_id (uuid, FK → users)
- type (enum: hype, can_help, would_invest, support)
- created_at (timestamptz)
- UNIQUE(listing_id, user_id, type)

### comments
- id (uuid, PK)
- listing_id (uuid, FK → listings)
- user_id (uuid, FK → users)
- content (text)
- parent_id (uuid, FK → comments) -- for replies
- created_at (timestamptz)

### follows
- id (uuid, PK)
- follower_id (uuid, FK → users)
- listing_id (uuid, FK → listings)
- created_at (timestamptz)
- UNIQUE(follower_id, listing_id)

### updates (Founder Diaries)
- id (uuid, PK)
- listing_id (uuid, FK → listings)
- founder_id (uuid, FK → users)
- title (text)
- content (text)
- image_url (text)
- created_at (timestamptz)

### notifications
- id (uuid, PK)
- user_id (uuid, FK → users)
- type (enum: investment, volunteer, comment, reaction, follow, update)
- title (text)
- message (text)
- link (text)
- is_read (boolean)
- created_at (timestamptz)
