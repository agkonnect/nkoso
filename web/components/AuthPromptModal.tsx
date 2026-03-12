'use client';

import { useRouter } from 'next/navigation';
import { X, TrendingUp, Users, Sparkles, Lock } from 'lucide-react';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'invest' | 'volunteer' | 'react';
  businessName?: string;
}

export default function AuthPromptModal({ isOpen, onClose, action, businessName }: AuthPromptModalProps) {
  const router = useRouter();
  if (!isOpen) return null;

  const config = {
    invest: {
      icon: '📈',
      title: 'Invest in this Business',
      description: `Join Nkoso to invest in ${businessName ?? 'this business'} and become a shareholder. Start from as little as GHS 10.`,
      accent: 'border-brand-500',
      btnColor: 'btn-primary',
    },
    volunteer: {
      icon: '🤝',
      title: 'Volunteer Your Skills',
      description: `Join Nkoso to offer your skills to ${businessName ?? 'this business'} and earn reputation points or equity.`,
      accent: 'border-forest-500',
      btnColor: 'btn-secondary',
    },
    react: {
      icon: '✨',
      title: 'Join the Community',
      description: 'Create a free account to react, comment, and follow businesses you love on Nkoso.',
      accent: 'border-gold-500',
      btnColor: 'btn-primary',
    },
  };

  const { icon, title, description, accent, btnColor } = config[action];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-md bg-dark-800 border-t-4 ${accent} border-x border-b border-dark-600 rounded-2xl shadow-2xl overflow-hidden`}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-dark-700 text-gray-500 hover:text-white transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-5xl mb-4">{icon}</div>

          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-gray-500 text-xs uppercase tracking-wider">Members Only</span>
          </div>

          <h2 className="font-display text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">{description}</p>

          <div className="bg-dark-700/50 rounded-xl p-4 mb-6 space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">What you get with Nkoso</p>
            {[
              '💰 Invest from GHS 10 in real businesses',
              '📊 Track your portfolio and returns',
              '🤝 Volunteer skills for equity',
              '🔔 Follow businesses you love',
              '🏆 Build your investor reputation',
            ].map((benefit) => (
              <div key={benefit} className="text-sm text-gray-300">{benefit}</div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={() => router.push('/auth?mode=signup')} className="btn-primary w-full py-3 text-sm font-semibold">
              🚀 Create Free Account
            </button>
            <button onClick={() => router.push('/auth')} className="btn-secondary w-full py-3 text-sm">
              Sign In to existing account
            </button>
          </div>

          <p className="text-center text-gray-600 text-xs mt-4">Free to join · No spam · Ghana-built 🇬🇭</p>
        </div>
      </div>
    </div>
  );
}
