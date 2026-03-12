'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ListingCard from '@/components/ListingCard';
import { Search, SlidersHorizontal, Loader2, Sparkles } from 'lucide-react';
import type { Listing } from '@/lib/types';

// Mock data for MVP demo
const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    founder_id: 'u1',
    title: 'AgriConnect Ghana',
    tagline: 'Connecting smallholder farmers directly to city markets via mobile app. No more middlemen, better prices for everyone.',
    description: 'AgriConnect Ghana is revolutionizing the agricultural supply chain...',
    sector: 'agriculture',
    stage: 'mvp',
    location: 'Accra, Ghana',
    funding_goal: 50000,
    funding_raised: 32000,
    equity_offered: 15,
    share_price: 10,
    total_shares: 5000,
    shares_sold: 3200,
    skills_needed: ['Mobile Dev', 'Marketing', 'Logistics'],
    is_verified: true,
    is_active: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    founder: { id: 'u1', username: 'kofi_agri', full_name: 'Kofi Asante', role: 'founder', is_verified: true, ghana_card_verified: true, created_at: '' },
    reactions_count: { hype: 124, can_help: 34, would_invest: 89, support: 56 },
    comments_count: 23,
  },
  {
    id: '2',
    founder_id: 'u2',
    title: 'AfroThreads',
    tagline: 'Premium African print fashion brand going global. We make Kente, Ankara and Kente-fusion pieces for the diaspora.',
    description: 'AfroThreads is a fashion brand celebrating African heritage...',
    sector: 'fashion',
    stage: 'growing',
    location: 'Kumasi, Ghana',
    funding_goal: 80000,
    funding_raised: 61000,
    equity_offered: 20,
    share_price: 25,
    total_shares: 3200,
    shares_sold: 2440,
    skills_needed: ['E-commerce', 'Photography', 'Social Media'],
    is_verified: true,
    is_active: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    founder: { id: 'u2', username: 'ama_threads', full_name: 'Ama Owusu', role: 'founder', is_verified: true, ghana_card_verified: true, created_at: '' },
    reactions_count: { hype: 203, can_help: 12, would_invest: 145, support: 98 },
    comments_count: 41,
  },
  {
    id: '3',
    founder_id: 'u3',
    title: 'MediReach',
    tagline: 'Telemedicine platform connecting rural Ghanaians with licensed doctors via USSD and basic smartphones.',
    description: 'MediReach bridges the healthcare gap in rural Ghana...',
    sector: 'health',
    stage: 'idea',
    location: 'Tamale, Ghana',
    funding_goal: 120000,
    funding_raised: 18000,
    equity_offered: 25,
    share_price: 15,
    total_shares: 8000,
    shares_sold: 1200,
    skills_needed: ['Backend Dev', 'UI/UX', 'Medical Advisor', 'USSD Dev'],
    is_verified: false,
    is_active: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    founder: { id: 'u3', username: 'kweku_health', full_name: 'Kweku Boateng', role: 'founder', is_verified: false, ghana_card_verified: false, created_at: '' },
    reactions_count: { hype: 67, can_help: 45, would_invest: 33, support: 88 },
    comments_count: 12,
  },
  {
    id: '4',
    founder_id: 'u4',
    title: 'EduBridge Ghana',
    tagline: 'AI-powered tutoring app for JHS & SHS students preparing for WASSCE. Offline-capable, works on any phone.',
    description: 'EduBridge Ghana uses artificial intelligence...',
    sector: 'education',
    stage: 'mvp',
    location: 'Accra, Ghana',
    funding_goal: 60000,
    funding_raised: 45000,
    equity_offered: 18,
    share_price: 20,
    total_shares: 3000,
    shares_sold: 2250,
    skills_needed: ['AI/ML', 'Content Creation', 'Teachers'],
    is_verified: true,
    is_active: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    founder: { id: 'u4', username: 'adjoa_edu', full_name: 'Adjoa Mensah', role: 'founder', is_verified: true, ghana_card_verified: true, created_at: '' },
    reactions_count: { hype: 312, can_help: 67, would_invest: 201, support: 134 },
    comments_count: 58,
  },
  {
    id: '5',
    founder_id: 'u5',
    title: 'SolarKitchen',
    tagline: 'Clean energy cooking solutions for off-grid households. Solar-powered induction cookers at affordable lease prices.',
    description: 'SolarKitchen is tackling energy poverty one household at a time...',
    sector: 'other',
    stage: 'growing',
    location: 'Cape Coast, Ghana',
    funding_goal: 200000,
    funding_raised: 87000,
    equity_offered: 12,
    share_price: 50,
    total_shares: 4000,
    shares_sold: 1740,
    skills_needed: ['Hardware Eng', 'Sales', 'Finance'],
    is_verified: true,
    is_active: true,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    founder: { id: 'u5', username: 'yaw_solar', full_name: 'Yaw Darko', role: 'founder', is_verified: true, ghana_card_verified: true, created_at: '' },
    reactions_count: { hype: 445, can_help: 23, would_invest: 378, support: 167 },
    comments_count: 87,
  },
  {
    id: '6',
    founder_id: 'u6',
    title: 'QuickLawGH',
    tagline: 'Affordable legal services for SMEs in Ghana. Get contracts drafted, disputes resolved, and compliance sorted online.',
    description: 'QuickLawGH democratizes access to legal services...',
    sector: 'finance',
    stage: 'idea',
    location: 'Accra, Ghana',
    funding_goal: 40000,
    funding_raised: 9500,
    equity_offered: 30,
    share_price: 10,
    total_shares: 4000,
    shares_sold: 950,
    skills_needed: ['Lawyers', 'Web Dev', 'Business Dev'],
    is_verified: false,
    is_active: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    founder: { id: 'u6', username: 'abena_law', full_name: 'Abena Frimpong', role: 'founder', is_verified: false, ghana_card_verified: false, created_at: '' },
    reactions_count: { hype: 43, can_help: 38, would_invest: 27, support: 51 },
    comments_count: 9,
  },
];

const SECTORS = ['all', 'tech', 'agriculture', 'fashion', 'health', 'education', 'finance', 'food', 'retail', 'other'];
const STAGES = ['all', 'idea', 'mvp', 'growing', 'established'];

export default function FeedPage() {
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [filtered, setFiltered] = useState<Listing[]>(MOCK_LISTINGS);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('all');
  const [stage, setStage] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [loading] = useState(false);

  useEffect(() => {
    let result = [...listings];
    if (search) result = result.filter(l =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.tagline.toLowerCase().includes(search.toLowerCase())
    );
    if (sector !== 'all') result = result.filter(l => l.sector === sector);
    if (stage !== 'all') result = result.filter(l => l.stage === stage);
    if (sortBy === 'funded') result.sort((a, b) => (b.funding_raised / b.funding_goal) - (a.funding_raised / a.funding_goal));
    if (sortBy === 'popular') result.sort((a, b) => (Object.values(b.reactions_count ?? {}).reduce((s, v) => s + v, 0)) - (Object.values(a.reactions_count ?? {}).reduce((s, v) => s + v, 0)));
    if (sortBy === 'latest') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setFiltered(result);
  }, [search, sector, stage, sortBy, listings]);

  const handleReact = (id: string, type: string) => {
    setListings(prev => prev.map(l => {
      if (l.id !== id) return l;
      const counts = { ...l.reactions_count } as Record<string, number>;
      counts[type] = (counts[type] ?? 0) + 1;
      return { ...l, reactions_count: counts as unknown as typeof l.reactions_count };
    }));
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="py-8">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-brand-400" />
              <h1 className="font-display text-3xl font-bold text-white">Pitch Wall</h1>
            </div>
            <p className="text-gray-400">Discover Ghanaian businesses looking for your support, skills, or investment.</p>
          </div>

          {/* Search & Filters */}
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search businesses, ideas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-10"
                />
              </div>
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input md:w-40 bg-dark-700 cursor-pointer"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="funded">Most Funded</option>
              </select>
            </div>

            {/* Sector Filter */}
            <div className="mt-3 flex gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-gray-500 text-xs mr-1">
                <SlidersHorizontal className="w-3 h-3" /> Sector:
              </div>
              {SECTORS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                    sector === s
                      ? 'bg-brand-500 text-white'
                      : 'bg-dark-700 text-gray-400 hover:text-white border border-dark-600'}`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Stage Filter */}
            <div className="mt-2 flex gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-gray-500 text-xs mr-1">
                <SlidersHorizontal className="w-3 h-3" /> Stage:
              </div>
              {STAGES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStage(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                    stage === s
                      ? 'bg-forest-500 text-white'
                      : 'bg-dark-700 text-gray-400 hover:text-white border border-dark-600'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">
              Showing <span className="text-white font-medium">{filtered.length}</span> businesses
            </p>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-display text-xl font-bold text-white mb-2">No results found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((listing) => (
                <ListingCard key={listing.id} listing={listing} onReact={handleReact} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
