import Link from 'next/link';
import MarqueeCategories from '@/components/MarqueeCategories';
import { ArrowRight, TrendingUp, Users, Heart, Shield, Zap, Globe } from 'lucide-react';

const stats = [
  { label: 'Businesses Listed', value: '500+' },
  { label: 'Active Investors', value: '2,000+' },
  { label: 'Volunteers Matched', value: '800+' },
  { label: 'Total Raised (GHS)', value: '1.2M+' },
];

const howItWorks = [
  {
    icon: '🧠',
    title: 'Founders List',
    desc: 'Post your business or idea with a short video pitch, funding goals, and the skills you need.',
  },
  {
    icon: '🔍',
    title: 'Community Discovers',
    desc: 'Scroll through the Pitch Wall. React, comment, follow businesses you believe in.',
  },
  {
    icon: '🤝',
    title: 'Support in 3 Ways',
    desc: 'Volunteer your skills, invest money for equity, or buy micro-shares from GHS 10.',
  },
  {
    icon: '📈',
    title: 'Grow Together',
    desc: 'Track your investments, volunteer hours, and watch businesses you backed flourish.',
  },
];

const features = [
  { icon: <TrendingUp className="w-6 h-6" />, title: 'Micro-Investing', desc: 'Invest from GHS 50. Own real equity in Ghanaian businesses via Mobile Money.' },
  { icon: <Users className="w-6 h-6" />, title: 'Skill Volunteering', desc: 'Offer your expertise — design, code, marketing, finance. Earn reputation or equity.' },
  { icon: <Heart className="w-6 h-6" />, title: 'Social Feed', desc: 'TikTok-style pitch wall. React, comment, share, and follow your favourite startups.' },
  { icon: <Shield className="w-6 h-6" />, title: 'Secure & Verified', desc: 'Ghana Card verified founders, escrow-protected investments, blockchain certificates.' },
  { icon: <Zap className="w-6 h-6" />, title: 'Mobile Money Native', desc: 'MTN MoMo, Vodafone Cash, AirtelTigo. Pay the way Ghana already pays.' },
  { icon: <Globe className="w-6 h-6" />, title: 'Diaspora Ready', desc: 'Ghanaians abroad can invest back home in USD, GBP, or EUR — directly.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-display font-bold text-xl text-white">Nkoso</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/feed" className="text-gray-400 hover:text-white transition-colors text-sm">Discover</Link>
              <Link href="/listing/create" className="text-gray-400 hover:text-white transition-colors text-sm">List Business</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth" className="btn-ghost text-sm">Sign In</Link>
              <Link href="/auth?mode=signup" className="btn-primary text-sm py-2 px-4">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-forest-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-full px-4 py-1.5 text-brand-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
            Built for Ghana. Built for Africa.
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Grow Ideas Into
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600"> Businesses</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Nkoso connects African entrepreneurs with volunteers, investors, and community members
            who believe in their vision. List your business. Find your team. Raise your capital.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth?mode=signup" className="btn-primary flex items-center justify-center gap-2 text-base">
              Start Building <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/feed" className="btn-secondary flex items-center justify-center gap-2 text-base">
              Browse Startups
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-dark-800/50 border border-dark-600 rounded-2xl p-4">
                <div className="font-display text-2xl font-bold text-brand-400">{s.value}</div>
                <div className="text-gray-500 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors — Animated Marquee */}
      <section className="border-y border-dark-700">
        <MarqueeCategories />
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-white mb-4">How Nkoso Works</h2>
            <p className="text-gray-400 text-lg">Four simple steps from idea to funded business</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-brand-500/50 to-transparent z-10" />
                )}
                <div className="card p-6 text-center hover:border-brand-500/30 transition-colors">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto mb-3">
                    {i + 1}
                  </div>
                  <h3 className="font-display font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-dark-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-gray-400 text-lg">Built from the ground up for the African startup ecosystem</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card p-6 hover:border-brand-500/30 transition-colors group">
                <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center text-brand-400 mb-4 group-hover:bg-brand-500/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-forest-500/5" />
            <div className="relative">
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                Ready to Grow Together?
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Join thousands of Ghanaians building the next generation of African businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth?mode=signup&role=founder" className="btn-primary flex items-center justify-center gap-2">
                  🧠 I&apos;m a Founder
                </Link>
                <Link href="/auth?mode=signup&role=supporter" className="btn-secondary flex items-center justify-center gap-2">
                  💰 I Want to Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-700 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">N</span>
              </div>
              <span className="font-display font-bold text-white">Nkoso</span>
              <span className="text-gray-600 text-sm ml-2">— Grow Together</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/feed" className="hover:text-white transition-colors">Discover</Link>
              <Link href="/listing/create" className="hover:text-white transition-colors">List Business</Link>
              <Link href="/auth" className="hover:text-white transition-colors">Sign In</Link>
            </div>
            <p className="text-gray-600 text-sm">© 2024 Nkoso. Made with ❤️ in Ghana.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
