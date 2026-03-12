'use client';

import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { label: 'Tech', emoji: '💻', value: 'tech' },
  { label: 'Agriculture', emoji: '🌾', value: 'agriculture' },
  { label: 'Fashion', emoji: '👗', value: 'fashion' },
  { label: 'Health', emoji: '🏥', value: 'health' },
  { label: 'Education', emoji: '📚', value: 'education' },
  { label: 'Finance', emoji: '💰', value: 'finance' },
  { label: 'Food & Bev', emoji: '🍔', value: 'food' },
  { label: 'Retail', emoji: '🛍️', value: 'retail' },
  { label: 'Other', emoji: '🚀', value: 'other' },
];

export default function MarqueeCategories() {
  const router = useRouter();

  const handleClick = (value: string) => {
    router.push(`/feed?category=${value}`);
  };

  // Triple the array for seamless infinite loop
  const items = [...CATEGORIES, ...CATEGORIES, ...CATEGORIES];

  return (
    <div className="relative overflow-hidden py-6 group">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-dark-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-dark-900 to-transparent z-10 pointer-events-none" />

      {/* Marquee track */}
      <div
        className="flex gap-3 w-max animate-marquee group-hover:pause"
        style={{ animation: 'marquee 30s linear infinite' }}
      >
        {items.map((cat, i) => (
          <button
            key={`${cat.value}-${i}`}
            onClick={() => handleClick(cat.value)}
            className="
              inline-flex items-center gap-2 shrink-0
              bg-dark-800 border border-dark-600
              hover:border-brand-500/60 hover:bg-brand-500/10
              hover:text-brand-400 hover:scale-105
              active:scale-95
              text-gray-400 text-sm font-medium
              rounded-full px-5 py-2.5
              transition-all duration-200 cursor-pointer
              select-none
            "
          >
            <span className="text-base">{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
