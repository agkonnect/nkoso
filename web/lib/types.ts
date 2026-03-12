export type UserRole = 'founder' | 'supporter' | 'admin';
export type ListingStage = 'idea' | 'mvp' | 'growing' | 'established';
export type ListingSector = 'tech' | 'food' | 'fashion' | 'agriculture' | 'health' | 'education' | 'finance' | 'retail' | 'other';
export type InvestmentStatus = 'pending' | 'confirmed' | 'failed' | 'refunded';
export type VolunteerStatus = 'pending' | 'accepted' | 'rejected' | 'completed';
export type ReactionType = 'hype' | 'can_help' | 'would_invest' | 'support';
export type PaymentMethod = 'mobile_money' | 'card' | 'bank_transfer';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  role: UserRole;
  location?: string;
  phone?: string;
  is_verified: boolean;
  ghana_card_verified: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  founder_id: string;
  title: string;
  tagline: string;
  description: string;
  sector: ListingSector;
  stage: ListingStage;
  location: string;
  cover_image_url?: string;
  pitch_video_url?: string;
  funding_goal: number;
  funding_raised: number;
  equity_offered: number;
  share_price: number;
  total_shares: number;
  shares_sold: number;
  skills_needed: string[];
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // joined
  founder?: Profile;
  reactions_count?: ReactionCounts;
  comments_count?: number;
  user_reaction?: ReactionType | null;
  is_following?: boolean;
}

export interface ReactionCounts {
  hype: number;
  can_help: number;
  would_invest: number;
  support: number;
}

export interface Investment {
  id: string;
  listing_id: string;
  investor_id: string;
  amount: number;
  shares_bought: number;
  payment_method: PaymentMethod;
  payment_reference?: string;
  status: InvestmentStatus;
  created_at: string;
  listing?: Listing;
  investor?: Profile;
}

export interface VolunteerApplication {
  id: string;
  listing_id: string;
  volunteer_id: string;
  skills_offered: string[];
  message: string;
  status: VolunteerStatus;
  hours_committed: number;
  created_at: string;
  listing?: Listing;
  volunteer?: Profile;
}

export interface Comment {
  id: string;
  listing_id: string;
  user_id: string;
  content: string;
  parent_id?: string;
  created_at: string;
  user?: Profile;
  replies?: Comment[];
}

export interface ListingUpdate {
  id: string;
  listing_id: string;
  founder_id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
}
