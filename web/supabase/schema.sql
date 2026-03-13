-- ============================================
-- NKOSO DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role AS ENUM ('founder', 'supporter', 'admin');
CREATE TYPE listing_stage AS ENUM ('idea', 'mvp', 'growing', 'established');
CREATE TYPE listing_sector AS ENUM ('tech', 'food', 'fashion', 'agriculture', 'health', 'education', 'finance', 'retail', 'other');
CREATE TYPE investment_status AS ENUM ('pending', 'confirmed', 'failed', 'refunded');
CREATE TYPE volunteer_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');
CREATE TYPE reaction_type AS ENUM ('hype', 'can_help', 'would_invest', 'support');
CREATE TYPE payment_method AS ENUM ('mobile_money', 'card', 'bank_transfer');
CREATE TYPE notification_type AS ENUM ('investment', 'volunteer', 'comment', 'reaction', 'follow', 'update');

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username            TEXT UNIQUE NOT NULL,
  full_name           TEXT NOT NULL,
  avatar_url          TEXT,
  bio                 TEXT,
  role                user_role NOT NULL DEFAULT 'supporter',
  location            TEXT,
  phone               TEXT,
  is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
  ghana_card_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- LISTINGS
-- ============================================
CREATE TABLE public.listings (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  founder_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  tagline           TEXT NOT NULL CHECK (char_length(tagline) <= 120),
  description       TEXT NOT NULL,
  sector            listing_sector NOT NULL,
  stage             listing_stage NOT NULL,
  location          TEXT NOT NULL,
  cover_image_url   TEXT,
  pitch_video_url   TEXT,
  funding_goal      NUMERIC(12,2) NOT NULL CHECK (funding_goal >= 1000),
  funding_raised    NUMERIC(12,2) NOT NULL DEFAULT 0,
  equity_offered    NUMERIC(5,2) NOT NULL CHECK (equity_offered > 0 AND equity_offered <= 49),
  share_price       NUMERIC(10,2) NOT NULL CHECK (share_price >= 10),
  total_shares      INTEGER NOT NULL CHECK (total_shares >= 100),
  shares_sold       INTEGER NOT NULL DEFAULT 0,
  skills_needed     TEXT[] NOT NULL DEFAULT '{}',
  is_verified       BOOLEAN NOT NULL DEFAULT FALSE,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INVESTMENTS
-- ============================================
CREATE TABLE public.investments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id            UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  investor_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount                NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  shares_bought         INTEGER NOT NULL CHECK (shares_bought > 0),
  payment_method        payment_method NOT NULL,
  payment_reference     TEXT,
  status                investment_status NOT NULL DEFAULT 'pending',
  certificate_token_id  TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- VOLUNTEER APPLICATIONS
-- ============================================
CREATE TABLE public.volunteer_applications (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id       UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  volunteer_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skills_offered   TEXT[] NOT NULL DEFAULT '{}',
  message          TEXT NOT NULL,
  status           volunteer_status NOT NULL DEFAULT 'pending',
  hours_committed  INTEGER NOT NULL DEFAULT 5,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(listing_id, volunteer_id)
);

-- ============================================
-- REACTIONS
-- ============================================
CREATE TABLE public.reactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id  UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        reaction_type NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(listing_id, user_id, type)
);

-- ============================================
-- COMMENTS
-- ============================================
CREATE TABLE public.comments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id  UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 2000),
  parent_id   UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- FOLLOWS
-- ============================================
CREATE TABLE public.follows (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id  UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(follower_id, listing_id)
);

-- ============================================
-- LISTING UPDATES (Founder Diaries)
-- ============================================
CREATE TABLE public.listing_updates (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id  UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  founder_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        notification_type NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  link        TEXT,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_listings_founder ON public.listings(founder_id);
CREATE INDEX idx_listings_sector ON public.listings(sector);
CREATE INDEX idx_listings_stage ON public.listings(stage);
CREATE INDEX idx_listings_active ON public.listings(is_active);
CREATE INDEX idx_listings_created ON public.listings(created_at DESC);
CREATE INDEX idx_investments_listing ON public.investments(listing_id);
CREATE INDEX idx_investments_investor ON public.investments(investor_id);
CREATE INDEX idx_reactions_listing ON public.reactions(listing_id);
CREATE INDEX idx_comments_listing ON public.comments(listing_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, owner write
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_owner_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_owner_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Listings: public read active, founder write own
CREATE POLICY "listings_public_read" ON public.listings FOR SELECT USING (is_active = TRUE);
CREATE POLICY "listings_founder_insert" ON public.listings FOR INSERT WITH CHECK (auth.uid() = founder_id);
CREATE POLICY "listings_founder_update" ON public.listings FOR UPDATE USING (auth.uid() = founder_id);
CREATE POLICY "listings_founder_delete" ON public.listings FOR DELETE USING (auth.uid() = founder_id);

-- Investments: owner read own
CREATE POLICY "investments_owner_read" ON public.investments FOR SELECT USING (auth.uid() = investor_id);
CREATE POLICY "investments_auth_insert" ON public.investments FOR INSERT WITH CHECK (auth.uid() = investor_id);

-- Volunteer apps: owner + listing founder read
CREATE POLICY "volunteer_owner_read" ON public.volunteer_applications FOR SELECT
  USING (auth.uid() = volunteer_id OR auth.uid() IN (SELECT founder_id FROM public.listings WHERE id = listing_id));
CREATE POLICY "volunteer_auth_insert" ON public.volunteer_applications FOR INSERT WITH CHECK (auth.uid() = volunteer_id);
CREATE POLICY "volunteer_founder_update" ON public.volunteer_applications FOR UPDATE
  USING (auth.uid() IN (SELECT founder_id FROM public.listings WHERE id = listing_id));

-- Reactions: public read, auth write own
CREATE POLICY "reactions_public_read" ON public.reactions FOR SELECT USING (TRUE);
CREATE POLICY "reactions_auth_insert" ON public.reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reactions_owner_delete" ON public.reactions FOR DELETE USING (auth.uid() = user_id);

-- Comments: public read, auth write
CREATE POLICY "comments_public_read" ON public.comments FOR SELECT USING (TRUE);
CREATE POLICY "comments_auth_insert" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_owner_delete" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Follows: auth read/write own
CREATE POLICY "follows_auth_all" ON public.follows FOR ALL USING (auth.uid() = follower_id);

-- Updates: public read, founder write
CREATE POLICY "updates_public_read" ON public.listing_updates FOR SELECT USING (TRUE);
CREATE POLICY "updates_founder_insert" ON public.listing_updates FOR INSERT
  WITH CHECK (auth.uid() = founder_id);

-- Notifications: owner only
CREATE POLICY "notifications_owner" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_updated_at BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'supporter')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update funding_raised when investment confirmed
CREATE OR REPLACE FUNCTION sync_funding_raised()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.listings
  SET funding_raised = (
    SELECT COALESCE(SUM(amount), 0)
    FROM public.investments
    WHERE listing_id = NEW.listing_id AND status = 'confirmed'
  ),
  shares_sold = (
    SELECT COALESCE(SUM(shares_bought), 0)
    FROM public.investments
    WHERE listing_id = NEW.listing_id AND status = 'confirmed'
  )
  WHERE id = NEW.listing_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_listing_funding
  AFTER INSERT OR UPDATE OF status ON public.investments
  FOR EACH ROW EXECUTE FUNCTION sync_funding_raised();
