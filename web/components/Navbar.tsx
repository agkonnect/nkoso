'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { Home, Search, PlusCircle, LayoutDashboard, User, Bell, LogOut, Menu, X } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const navLinks = [
  { href: '/feed', label: 'Discover', icon: Home },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/listing/create', label: 'List Business', icon: PlusCircle },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-display font-bold text-xl text-white">Nkoso</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href} href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === href
                    ? 'bg-brand-500/10 text-brand-400'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700'}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link href="/notifications" className="btn-ghost p-2 relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full" />
                </Link>
                <Link href={`/profile/${user.id}`} className="btn-ghost p-2">
                  <div className="w-8 h-8 bg-brand-500/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-brand-400" />
                  </div>
                </Link>
                <button onClick={handleSignOut} className="btn-ghost p-2 text-gray-500 hover:text-earth-400">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth" className="btn-ghost text-sm hidden sm:block">Sign In</Link>
                <Link href="/auth?mode=signup" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden btn-ghost p-2">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-dark-700 bg-dark-900 px-4 py-3 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href} href={href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === href
                  ? 'bg-brand-500/10 text-brand-400'
                  : 'text-gray-400 hover:text-white hover:bg-dark-700'}`}
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
          {!user && (
            <Link href="/auth" onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 text-sm text-gray-400 hover:text-white">
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
