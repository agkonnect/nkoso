'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, TrendingUp, Users, Clock, Flame, Handshake, DollarSign, Heart } from 'lucide-react';
import { formatCurrency, formatNumber, fundingProgress, timeAgo } from '@/lib/utils';
import type { Listing } from '@/lib/types';
import AuthPromptModal from '@/components/AuthPromptModal';

const sectorEmoji: Record<string, string> = {
  tech: '💻', food: '🍔', fashion: '👗', agriculture: '🌾',
  health: '🏥', education: '📚', finance: '💰', retail: '🛍️', other: '🚀'
};

const stageColor: Record<string, string> = {
  idea: 'badge-red',
  mvp: 'badge-gold',
  growing: 'badge-green',
  established: 'badge-gray',
};

interface ListingCardProps {
  listing: Listing;
  onReact?: (id: string, type: string) => void;
  isAuthenticated?: boolean;
}

export default function ListingCard({ listing, onReact, isAuthenticated = false }: ListingCardProps) {
  const progress = fundingProgress(listing.funding_raised, listing.funding_goal);
  const [authModal, setAuthModal] = useState<{ open: boolean; action: 'invest' | 'volunteer' | 'react' }>(
    { open: false, action: 'invest' }
  );

  const handleProtectedAction = (action: 'invest' | 'volunteer' | 'react') => {
    if (!isAuthenticated) {
      setAuthModal({ open: true, action });
      return false;
    }
    return true;
  };

  const handleReact = (type: string) => {
    if (!handleProtectedAction('react')) return;
    onReact?.(listing.id, type);
  };

  return (
    <>
      <AuthPromptModal
        isOpen={authModal.open}
        onClose={() => setAuthModal({ ...authModal, open: false })}
        action={authModal.action}
        businessName={listing.title}
      />

      <div className="listing-card card flex flex-col">
        {/* Cover Image */}
        <Link href={`/listing/${listing.id}`} className="relative h-48 bg-dark-700 overflow-hidden">
          {listing.cover_image_url ? (
            <Image src={listing.cover_image_url} alt={listing.title}
              fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl">{sectorEmoji[listing.sector] ?? '🚀'}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={stageColor[listing.stage] + ' badge capitalize'}>{listing.stage}</span>
            {listing.is_verified && (
              <span className="badge badge-green">✓ Verified</span>
            )}
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="badge badge-gray capitalize">
              {sectorEmoji[listing.sector]} {listing.sector}
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Founder */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-brand-500/20 rounded-full flex items-center justify-center text-xs font-bold text-brand-400">
              {listing.founder?.full_name?.[0] ?? 'F'}
            </div>
            <span className="text-gray-400 text-sm">{listing.founder?.full_name ?? 'Founder'}</span>
            <div className="flex items-center gap-1 text-gray-600 text-xs ml-auto">
              <MapPin className="w-3 h-3" />
              {listing.location}
            </div>
          </div>

          {/* Title & Tagline */}
          <Link href={`/listing/${listing.id}`} className="group">
            <h3 className="font-display font-bold text-white text-lg leading-tight mb-1 group-hover:text-brand-400 transition-colors">
              {listing.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2 mb-4">{listing.tagline}</p>
          </Link>

          {/* Funding Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-gray-500 text-xs">Funding Progress</span>
              <span className="text-brand-400 text-xs font-bold">{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-white text-sm font-semibold">{formatCurrency(listing.funding_raised)}</span>
              <span className="text-gray-500 text-xs">of {formatCurrency(listing.funding_goal)}</span>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-dark-700 rounded-xl p-2 text-center">
              <div className="text-white text-sm font-bold">{listing.equity_offered}%</div>
              <div className="text-gray-500 text-xs">Equity</div>
            </div>
            <div className="bg-dark-700 rounded-xl p-2 text-center">
              <div className="text-white text-sm font-bold">{formatCurrency(listing.share_price)}</div>
              <div className="text-gray-500 text-xs">/share</div>
            </div>
            <div className="bg-dark-700 rounded-xl p-2 text-center">
              <div className="text-white text-sm font-bold">{formatNumber(listing.total_shares - listing.shares_sold)}</div>
              <div className="text-gray-500 text-xs">Left</div>
            </div>
          </div>

          {/* Skills Needed */}
          {listing.skills_needed?.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                <Users className="w-3 h-3" /> Skills needed:
              </div>
              <div className="flex flex-wrap gap-1">
                {listing.skills_needed.slice(0, 3).map((skill) => (
                  <span key={skill} className="badge badge-gray text-xs">{skill}</span>
                ))}
                {listing.skills_needed.length > 3 && (
                  <span className="badge badge-gray text-xs">+{listing.skills_needed.length - 3}</span>
                )}
              </div>
            </div>
          )}

          <div className="flex-1" />

          {/* Reactions */}
          <div className="flex items-center justify-between pt-3 border-t border-dark-700">
            <div className="flex items-center gap-1">
              <button onClick={() => handleReact('hype')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-dark-700 text-gray-400 hover:text-brand-400 transition-all text-xs">
                <Flame className="w-4 h-4" />
                <span>{formatNumber(listing.reactions_count?.hype ?? 0)}</span>
              </button>
              <button onClick={() => handleReact('can_help')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-dark-700 text-gray-400 hover:text-forest-400 transition-all text-xs">
                <Handshake className="w-4 h-4" />
                <span>{formatNumber(listing.reactions_count?.can_help ?? 0)}</span>
              </button>
              <button onClick={() => handleReact('would_invest')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-dark-700 text-gray-400 hover:text-brand-400 transition-all text-xs">
                <DollarSign className="w-4 h-4" />
                <span>{formatNumber(listing.reactions_count?.would_invest ?? 0)}</span>
              </button>
              <button onClick={() => handleReact('support')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-dark-700 text-gray-400 hover:text-earth-400 transition-all text-xs">
                <Heart className="w-4 h-4" />
                <span>{formatNumber(listing.reactions_count?.support ?? 0)}</span>
              </button>
            </div>
            <div className="flex items-center gap-1 text-gray-600 text-xs">
              <Clock className="w-3 h-3" />
              {timeAgo(listing.created_at)}
            </div>
          </div>

          {/* CTA Buttons — auth-aware */}
          <div className="flex gap-2 mt-3">
            {isAuthenticated ? (
              <>
                <Link href={`/listing/${listing.id}?action=invest`}
                  className="flex-1 btn-primary text-xs py-2 text-center flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Invest
                </Link>
                <Link href={`/listing/${listing.id}?action=volunteer`}
                  className="flex-1 btn-secondary text-xs py-2 text-center flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" /> Volunteer
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleProtectedAction('invest')}
                  className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Invest
                </button>
                <button
                  onClick={() => handleProtectedAction('volunteer')}
                  className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" /> Volunteer
                </button>
              </>
            )}
          </div>

          {/* Guest hint */}
          {!isAuthenticated && (
            <p className="text-center text-gray-600 text-xs mt-2">
              🔒 <Link href="/auth?mode=signup" className="text-brand-400 hover:underline">Sign up free</Link> to invest or volunteer
            </p>
          )}
        </div>
      </div>
    </>
  );
}
