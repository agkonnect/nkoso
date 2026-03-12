'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { formatCurrency, formatNumber, fundingProgress } from '@/lib/utils';
import {
  PlusCircle, TrendingUp, Users, BarChart3, Bell, CheckCircle,
  Clock, ArrowUpRight, Eye, Handshake, Flame
} from 'lucide-react';

// Mock data for MVP
const MOCK_MY_LISTINGS = [
  {
    id: '1', title: 'AgriConnect Ghana', sector: 'agriculture', stage: 'mvp',
    funding_goal: 50000, funding_raised: 32000, equity_offered: 15,
    share_price: 10, total_shares: 5000, shares_sold: 3200,
    is_verified: true, is_active: true,
    views: 1240, investors: 18, volunteers: 4,
    reactions: 303, comments: 23,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_MY_INVESTMENTS = [
  { id: 'i1', listing_title: 'EduBridge Ghana', sector: 'education', shares: 10, amount: 200, status: 'confirmed', equity: '0.06%', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'i2', listing_title: 'SolarKitchen', sector: 'other', shares: 5, amount: 250, status: 'confirmed', equity: '0.015%', created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
];

const MOCK_VOLUNTEER_APPS = [
  { id: 'v1', listing_title: 'MediReach', sector: 'health', skills: ['Backend Dev', 'USSD Dev'], status: 'pending', created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'v2', listing_title: 'QuickLawGH', sector: 'finance', skills: ['Web Dev'], status: 'accepted', created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
];

const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'investment', message: 'New investor: Kwame O. invested ₵500 in AgriConnect Ghana', time: '2h ago', read: false },
  { id: 'n2', type: 'volunteer', message: 'New volunteer application for AgriConnect Ghana from Abena F.', time: '5h ago', read: false },
  { id: 'n3', type: 'reaction', message: 'AgriConnect Ghana received 12 new reactions today', time: '1d ago', read: true },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'founder' | 'investor' | 'volunteer'>('founder');

  const totalRaised = MOCK_MY_LISTINGS.reduce((s, l) => s + l.funding_raised, 0);
  const totalInvested = MOCK_MY_INVESTMENTS.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-white mb-1">Dashboard</h1>
              <p className="text-gray-400">Welcome back! Here's your Nkoso activity.</p>
            </div>
            <Link href="/listing/create" className="btn-primary flex items-center gap-2 self-start">
              <PlusCircle className="w-4 h-4" /> List New Business
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Raised', value: formatCurrency(totalRaised), icon: TrendingUp, color: 'text-brand-400', bg: 'bg-brand-500/10' },
              { label: 'Total Invested', value: formatCurrency(totalInvested), icon: BarChart3, color: 'text-forest-400', bg: 'bg-forest-500/10' },
              { label: 'My Businesses', value: MOCK_MY_LISTINGS.length.toString(), icon: Flame, color: 'text-brand-400', bg: 'bg-brand-500/10' },
              { label: 'Volunteer Apps', value: MOCK_VOLUNTEER_APPS.length.toString(), icon: Handshake, color: 'text-forest-400', bg: 'bg-forest-500/10' },
            ].map(stat => (
              <div key={stat.label} className="card p-5">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="flex bg-dark-800 border border-dark-600 rounded-xl p-1">
                {[
                  { id: 'founder' as const, label: 'My Businesses', icon: Flame },
                  { id: 'investor' as const, label: 'Investments', icon: TrendingUp },
                  { id: 'volunteer' as const, label: 'Volunteering', icon: Handshake },
                ].map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setActiveTab(id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === id ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                ))}
              </div>

              {/* My Businesses */}
              {activeTab === 'founder' && (
                <div className="space-y-4">
                  {MOCK_MY_LISTINGS.length === 0 ? (
                    <div className="card p-12 text-center">
                      <div className="text-5xl mb-4">🚀</div>
                      <h3 className="font-display text-xl font-bold text-white mb-2">No listings yet</h3>
                      <p className="text-gray-400 mb-6">Share your business idea with the Nkoso community</p>
                      <Link href="/listing/create" className="btn-primary inline-flex items-center gap-2">
                        <PlusCircle className="w-4 h-4" /> List Your Business
                      </Link>
                    </div>
                  ) : MOCK_MY_LISTINGS.map(listing => (
                    <div key={listing.id} className="card p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-display font-bold text-white text-lg">{listing.title}</h3>
                            {listing.is_verified && <CheckCircle className="w-4 h-4 text-brand-400" />}
                          </div>
                          <div className="flex gap-2">
                            <span className="badge badge-gold capitalize">{listing.stage}</span>
                            <span className="badge badge-gray capitalize">{listing.sector}</span>
                          </div>
                        </div>
                        <Link href={`/listing/${listing.id}`} className="btn-ghost p-2">
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between mb-1.5 text-sm">
                          <span className="text-gray-400">Funding Progress</span>
                          <span className="text-brand-400 font-bold">{fundingProgress(listing.funding_raised, listing.funding_goal)}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${fundingProgress(listing.funding_raised, listing.funding_goal)}%` }} />
                        </div>
                        <div className="flex justify-between mt-1.5">
                          <span className="text-white text-sm font-semibold">{formatCurrency(listing.funding_raised)}</span>
                          <span className="text-gray-500 text-xs">of {formatCurrency(listing.funding_goal)}</span>
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { icon: Eye, label: 'Views', value: formatNumber(listing.views) },
                          { icon: TrendingUp, label: 'Investors', value: listing.investors },
                          { icon: Users, label: 'Volunteers', value: listing.volunteers },
                          { icon: Flame, label: 'Reactions', value: formatNumber(listing.reactions) },
                        ].map(stat => (
                          <div key={stat.label} className="bg-dark-700 rounded-xl p-2 text-center">
                            <stat.icon className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                            <div className="text-white text-sm font-bold">{stat.value}</div>
                            <div className="text-gray-600 text-xs">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* My Investments */}
              {activeTab === 'investor' && (
                <div className="space-y-3">
                  {MOCK_MY_INVESTMENTS.map(inv => (
                    <div key={inv.id} className="card p-5 flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center text-xl shrink-0">📈</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white font-semibold">{inv.listing_title}</h4>
                          <span className={`badge ${
                            inv.status === 'confirmed' ? 'badge-green' : 'badge-gold'}`}>
                            {inv.status}
                          </span>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-400">
                          <span>{inv.shares} shares · {inv.equity} equity</span>
                          <span className="text-brand-400 font-medium">{formatCurrency(inv.amount)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="card p-4 flex items-center justify-between">
                    <span className="text-gray-400">Total Portfolio Value</span>
                    <span className="font-display text-xl font-bold text-brand-400">{formatCurrency(totalInvested)}</span>
                  </div>
                </div>
              )}

              {/* Volunteer Applications */}
              {activeTab === 'volunteer' && (
                <div className="space-y-3">
                  {MOCK_VOLUNTEER_APPS.map(app => (
                    <div key={app.id} className="card p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">{app.listing_title}</h4>
                        <span className={`badge ${
                          app.status === 'accepted' ? 'badge-green'
                          : app.status === 'pending' ? 'badge-gold'
                          : 'badge-red'}`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {app.skills.map(s => <span key={s} className="badge badge-gray text-xs">{s}</span>)}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 text-xs">
                        <Clock className="w-3 h-3" />
                        Applied {new Date(app.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar: Notifications */}
            <div className="space-y-4">
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-brand-400" /> Notifications
                  </h3>
                  <span className="badge badge-gold">{MOCK_NOTIFICATIONS.filter(n => !n.read).length} new</span>
                </div>
                <div className="space-y-3">
                  {MOCK_NOTIFICATIONS.map(n => (
                    <div key={n.id} className={`p-3 rounded-xl text-sm transition-colors ${
                      n.read ? 'bg-dark-700' : 'bg-brand-500/10 border border-brand-500/20'}`}>
                      <p className={n.read ? 'text-gray-400' : 'text-white'}>{n.message}</p>
                      <p className="text-gray-600 text-xs mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card p-5">
                <h3 className="font-display font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/listing/create" className="btn-secondary w-full flex items-center gap-2 justify-center text-sm">
                    <PlusCircle className="w-4 h-4" /> New Listing
                  </Link>
                  <Link href="/feed" className="btn-ghost w-full flex items-center gap-2 justify-center text-sm border border-dark-600">
                    <Eye className="w-4 h-4" /> Browse Feed
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
