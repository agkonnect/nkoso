'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import InvestModal from '@/components/InvestModal';
import VolunteerModal from '@/components/VolunteerModal';
import { formatCurrency, formatNumber, fundingProgress, timeAgo } from '@/lib/utils';
import {
  MapPin, Calendar, TrendingUp, Users, Flame, Heart, Handshake,
  DollarSign, Share2, BookmarkPlus, CheckCircle, ArrowLeft,
  MessageCircle, Video, ExternalLink
} from 'lucide-react';
import type { Listing } from '@/lib/types';

// Mock data  -  replace with Supabase fetch in production
const MOCK: Record<string, Listing> = {
  '1': {
    id: '1', founder_id: 'u1',
    title: 'AgriConnect Ghana',
    tagline: 'Connecting smallholder farmers directly to city markets via mobile app.',
    description: `AgriConnect Ghana is revolutionizing the agricultural supply chain by cutting out exploitative middlemen who have historically taken 40-60% of farmer revenue.

Our mobile app connects 50,000+ smallholder farmers across Greater Accra and Ashanti Region directly to restaurants, supermarkets, and individual buyers in the city. Farmers set their own prices, receive Mobile Money payments instantly, and get real-time demand forecasts.

We have already onboarded 1,200 farmers and 89 buyers in our pilot phase, processing GHS 340,000 in transactions over 4 months. Our unit economics are proven  -  we take a 5% commission on each transaction.

The next phase requires capital for: logistics infrastructure (cold storage hubs), expanding to 3 new regions (Western, Central, Volta), and building an iOS app alongside our existing Android app.`,
    sector: 'agriculture', stage: 'mvp', location: 'Accra, Ghana',
    funding_goal: 50000, funding_raised: 32000,
    equity_offered: 15, share_price: 10, total_shares: 5000, shares_sold: 3200,
    skills_needed: ['Mobile Dev', 'Marketing', 'Logistics', 'Cold Chain Expert'],
    is_verified: true, is_active: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    founder: { id: 'u1', username: 'kofi_agri', full_name: 'Kofi Asante',
      bio: 'Agricultural engineer with 8 years experience in supply chain optimization. Former COCOBOD analyst.',
      role: 'founder', location: 'Accra', is_verified: true, ghana_card_verified: true, created_at: '' },
    reactions_count: { hype: 124, can_help: 34, would_invest: 89, support: 56 },
    comments_count: 23,
  },
};

const COMMENTS = [
  { id: 'c1', user: { full_name: 'Yaa Asantewaa', username: 'yaa_invest' }, content: 'This is exactly what Ghana needs! The middlemen problem is real  -  my uncle farms tomatoes in Ashanti and loses 50% of profit to traders. Investing this week.', created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: 'c2', user: { full_name: 'Kwabena Ofori', username: 'kwabena_tech' }, content: "I'm a mobile developer with 5 years React Native experience. Would love to volunteer on the iOS app. DM me!", created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
  { id: 'c3', user: { full_name: 'Akosua Darkoa', username: 'akosua_vc' }, content: "Great traction for early stage. What's your CAC vs LTV for the farmer side? Would love to see the full pitch deck.", created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
];

export default function ListingDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [showInvest, setShowInvest] = useState(searchParams.get('action') === 'invest');
  const [showVolunteer, setShowVolunteer] = useState(searchParams.get('action') === 'volunteer');
  const [comment, setComment] = useState('');
  const [reactions, setReactions] = useState({ hype: 124, can_help: 34, would_invest: 89, support: 56 });
  const [activeTab, setActiveTab] = useState<'about' | 'updates' | 'investors'>('about');

  useEffect(() => {
    // In production: fetch from Supabase
    setListing(MOCK[id] ?? MOCK['1']);
  }, [id]);

  if (!listing) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-gray-400">Loading...</div>
    </div>
  );

  const progress = fundingProgress(listing.funding_raised, listing.funding_goal);

  const handleReact = (type: keyof typeof reactions) => {
    setReactions(prev => ({ ...prev, [type]: prev[type] + 1 }));
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <Link href="/feed" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors my-6 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Feed
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cover / Video */}
              <div className="card overflow-hidden">
                <div className="relative h-64 bg-gradient-to-br from-dark-700 to-dark-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Video className="w-8 h-8 text-brand-400" />
                    </div>
                    <p className="text-gray-400 text-sm">Pitch video coming soon</p>
                    <p className="text-gray-600 text-xs mt-1">Cloudflare Stream integration in Phase 2</p>
                  </div>
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="badge badge-gold capitalize">{listing.stage}</span>
                    {listing.is_verified && <span className="badge badge-green"><CheckCircle className="w-3 h-3 mr-1 inline" />Verified</span>}
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="btn-ghost p-2 bg-dark-900/50"><Share2 className="w-4 h-4" /></button>
                    <button className="btn-ghost p-2 bg-dark-900/50"><BookmarkPlus className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              {/* Title & Founder */}
              <div className="card p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="font-display text-3xl font-bold text-white mb-2">{listing.title}</h1>
                    <p className="text-gray-400 text-lg">{listing.tagline}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{listing.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Listed {timeAgo(listing.created_at)}</span>
                  <span className="badge badge-gray capitalize">{listing.sector}</span>
                </div>
              </div>

              {/* Reactions */}
              <div className="card p-4">
                <div className="flex items-center justify-around">
                  {[
                    { type: 'hype' as const, icon: Flame, label: 'Hype', color: 'hover:text-brand-400', count: reactions.hype },
                    { type: 'can_help' as const, icon: Handshake, label: 'Can Help', color: 'hover:text-forest-400', count: reactions.can_help },
                    { type: 'would_invest' as const, icon: DollarSign, label: 'Would Invest', color: 'hover:text-brand-400', count: reactions.would_invest },
                    { type: 'support' as const, icon: Heart, label: 'Support', color: 'hover:text-earth-400', count: reactions.support },
                  ].map(({ type, icon: Icon, label, color, count }) => (
                    <button key={type} onClick={() => handleReact(type)}
                      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-dark-700 text-gray-400 ${color} transition-all`}>
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{formatNumber(count)}</span>
                      <span className="text-xs text-gray-600">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="card overflow-hidden">
                <div className="flex border-b border-dark-600">
                  {[['about', 'About'], ['updates', 'Updates'], ['investors', 'Investors']].map(([tab, label]) => (
                    <button key={tab} onClick={() => setActiveTab(tab as typeof activeTab)}
                      className={`flex-1 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab ? 'text-brand-400 border-b-2 border-brand-400' : 'text-gray-500 hover:text-white'}`}>
                      {label}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {activeTab === 'about' && (
                    <div className="space-y-6">
                      {/* Description */}
                      <div>
                        <h3 className="font-display font-semibold text-white mb-3">About This Business</h3>
                        <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{listing.description}</div>
                      </div>
                      {/* Skills Needed */}
                      <div>
                        <h3 className="font-display font-semibold text-white mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4 text-forest-400" /> Skills Needed
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {listing.skills_needed.map(skill => (
                            <span key={skill} className="badge badge-green text-sm py-1 px-3">{skill}</span>
                          ))}
                        </div>
                      </div>
                      {/* Founder */}
                      <div>
                        <h3 className="font-display font-semibold text-white mb-3">The Founder</h3>
                        <div className="flex items-start gap-4 bg-dark-700 rounded-xl p-4">
                          <div className="w-12 h-12 bg-brand-500/20 rounded-full flex items-center justify-center text-brand-400 font-bold text-lg shrink-0">
                            {listing.founder?.full_name?.[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-semibold">{listing.founder?.full_name}</span>
                              {listing.founder?.is_verified && <CheckCircle className="w-4 h-4 text-brand-400" />}
                            </div>
                            <div className="text-gray-500 text-sm">@{listing.founder?.username}</div>
                            <p className="text-gray-400 text-sm mt-2">{listing.founder?.bio}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'updates' && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">📰</div>
                      <h3 className="text-white font-semibold mb-2">No updates yet</h3>
                      <p className="text-gray-500 text-sm">The founder hasn't posted any updates yet. Follow to get notified.</p>
                    </div>
                  )}

                  {activeTab === 'investors' && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">💰</div>
                      <h3 className="text-white font-semibold mb-2">Early investors are anonymous</h3>
                      <p className="text-gray-500 text-sm">Investor details are shown after funding round closes.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments */}
              <div className="card p-6">
                <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-brand-400" />
                  Community ({listing.comments_count})
                </h3>
                <div className="space-y-4 mb-6">
                  {COMMENTS.map(c => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-8 h-8 bg-dark-600 rounded-full flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                        {c.user.full_name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white text-sm font-medium">{c.user.full_name}</span>
                          <span className="text-gray-600 text-xs">{timeAgo(c.created_at)}</span>
                        </div>
                        <p className="text-gray-400 text-sm">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand-500/20 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-brand-400 text-xs font-bold">Y</span>
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="input flex-1 text-sm"
                    />
                    <button className="btn-primary text-sm px-4">Post</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Investment Sidebar */}
            <div className="space-y-4">
              {/* Funding Card */}
              <div className="card p-6 sticky top-24">
                <h3 className="font-display font-bold text-white text-xl mb-4">Investment Details</h3>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400 text-sm">Raised</span>
                    <span className="text-brand-400 font-bold">{progress}%</span>
                  </div>
                  <div className="progress-bar mb-2">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <div className="font-display text-2xl font-bold text-white">{formatCurrency(listing.funding_raised)}</div>
                      <div className="text-gray-500 text-xs">raised of {formatCurrency(listing.funding_goal)} goal</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl font-bold text-white">{formatNumber(listing.total_shares - listing.shares_sold)}</div>
                      <div className="text-gray-500 text-xs">shares available</div>
                    </div>
                  </div>
                </div>

                {/* Key Numbers */}
                <div className="space-y-3 mb-6">
                  {[
                    { label: 'Equity Offered', value: `${listing.equity_offered}%`, icon: '📊' },
                    { label: 'Share Price', value: formatCurrency(listing.share_price), icon: '💵' },
                    { label: 'Min. Investment', value: formatCurrency(listing.share_price), icon: '📱' },
                    { label: 'Payment', value: 'MTN MoMo, Card', icon: '💳' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-dark-700 last:border-0">
                      <span className="text-gray-400 text-sm flex items-center gap-2"><span>{item.icon}</span>{item.label}</span>
                      <span className="text-white text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <button onClick={() => setShowInvest(true)}
                    className="btn-primary w-full flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Invest Now
                  </button>
                  <button onClick={() => setShowVolunteer(true)}
                    className="btn-secondary w-full flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" /> Volunteer Skills
                  </button>
                </div>

                <p className="text-gray-600 text-xs text-center mt-4">
                  🔒 Funds held in escrow until funding goal is reached
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showInvest && (
        <InvestModal listing={listing} onClose={() => setShowInvest(false)} />
      )}
      {showVolunteer && (
        <VolunteerModal listing={listing} onClose={() => setShowVolunteer(false)} />
      )}
    </div>
  );
}
