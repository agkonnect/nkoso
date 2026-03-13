-- ============================================
-- MIGRATION FIX: handle_new_user trigger bug
-- Run this in Supabase SQL Editor to fix the
-- "Database error saving new user" issue
-- ============================================

-- Fix 1: Recreate handle_new_user with correct metadata key names (no spaces)
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

-- Fix 2: Add missing updated_at trigger for profiles table
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Verify the function is correct
SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user';
