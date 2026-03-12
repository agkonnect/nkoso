'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ListingCard from '@/components/ListingCard';
import { MapPin, CheckCircle, Calendar, TrendingUp, Users, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const MOCK_PROFILE = {
  id: 'u1', username: 'kofi_agri', full_name: 'Kofi Asante',
  bio: 'Agricultural engineer with 8 years experience in supply chain optimization. Former COCOBOD analyst. Passionate about using technology to improve livelihoods of Ghanaian farmers.',
  role: 'founder', location: 'Accra, Ghana', is_verified: true, ghana_card_verified: true,
  created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
  stats: { listings: 1, total_raised: 32000, investors: 18, volunteer_score: 0 },
};

export default function ProfilePage() {
  const [tab, setTab] = useState<'listings' | 'activity'>('listings');

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Profile Header */}
          <div className="card p-8 mt-8 mb-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shrink-0">
                {MOCK_PROFILE.full_name[0]}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="font-display text-2xl font-bold text-white">{MOCK_PROFILE.full_name}</h1>
                  {MOCK_PROFILE.is_verified && (
                    <span className="badge badge-gold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  )}
                  {MOCK_PROFILE.ghana_card_verified && (
                    <span className="badge badge-green">🇬🇭 ID Verified</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-1">@{MOCK_PROFILE.username}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{MOCK_PROFILE.location}</span>
                  <span className="flex items-center gap-1 capitalize"><Star className="w-3 h-3" />{MOCK_PROFILE.role}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {new Date(MOCK_PROFILE.created_at).toLocaleDateString('en-GH', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{MOCK_PROFILE.bio}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-dark-700">
              {[
                { label: 'Businesses', value: MOCK_PROFILE.stats.listings, icon: '🚀' },
                { label: 'Total Raised', value: formatCurrency(MOCK_PROFILE.stats.total_raised), icon: '💰' },
                { label: 'Investors', value: MOCK_PROFILE.stats.investors, icon: '👥' },
                { label: 'Volunteer Score', value: MOCK_PROFILE.stats.volunteer_score || '—', icon: '🤝' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="font-display text-lg font-bold text-white">{s.value}</div>
                  <div className="text-gray-500 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-dark-800 border border-dark-600 rounded-xl p-1 mb-6">
            {[
              { id: 'listings' as const, label: 'Businesses', icon: TrendingUp },
              { id: 'activity' as const, label: 'Activity', icon: Users },
            ].map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === id ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {tab === 'listings' && (
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="text-center py-12 col-span-full">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Business listings load from Supabase</h3>
                <p className="text-gray-400 text-sm">Connect your Supabase instance to see real listings here.</p>
              </div>
            </div>
          )}

          {tab === 'activity' && (
            <div className="card p-8 text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="font-display text-xl font-bold text-white mb-2">Activity feed coming soon</h3>
              <p className="text-gray-400 text-sm">Recent investments, volunteer work, and reactions will appear here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
