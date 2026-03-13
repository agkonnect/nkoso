'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-client';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'signin' | 'signup'>(searchParams.get('mode') === 'signup' ? 'signup' : 'signin');
  const [role, setRole] = useState<'founder' | 'supporter'>(searchParams.get('role') === 'founder' ? 'founder' : 'supporter');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ email: '', password: '', full_name: '', username: '' });

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: { full_name: form.full_name, username: form.username, role },
          },
        });
        if (signUpError) throw signUpError;
        // Profile is auto-created by database trigger (handle_new_user)
        // No client-side insert needed — trigger runs with SECURITY DEFINER
        setSuccess('Account created! Check your email to verify your account.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (signInError) throw signInError;
        router.push('/feed');
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            {mode === 'signin' ? 'Welcome back' : 'Join Nkoso'}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {mode === 'signin' ? 'Sign in to your account' : 'Start your growth journey today'}
          </p>
        </div>

        <div className="card p-6">
          {/* Mode Toggle */}
          <div className="flex bg-dark-700 rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'signin' ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'signup' ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Create Account
            </button>
          </div>

          {/* Role Selection (signup only) */}
          {mode === 'signup' && (
            <div className="mb-5">
              <label className="label">I am joining as a...</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('founder')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'founder'
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-dark-500 hover:border-dark-400'}`}
                >
                  <div className="text-xl mb-1">🧠</div>
                  <div className="text-white text-sm font-medium">Founder</div>
                  <div className="text-gray-500 text-xs">I have a business or idea</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('supporter')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'supporter'
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-dark-500 hover:border-dark-400'}`}
                >
                  <div className="text-xl mb-1">💰</div>
                  <div className="text-white text-sm font-medium">Supporter</div>
                  <div className="text-gray-500 text-xs">I want to invest or volunteer</div>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="label">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text" required
                      placeholder="Kwame Mensah"
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      className="input pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Username</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
                    <input
                      type="text" required
                      placeholder="kwame_builds"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, '_') })}
                      className="input pl-8"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email" required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'} required
                  placeholder="Min. 8 characters"
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-earth-500/10 border border-earth-500/30 rounded-xl p-3 text-earth-400 text-sm">{error}</div>
            )}
            {success && (
              <div className="bg-forest-500/10 border border-forest-500/30 rounded-xl p-3 text-forest-400 text-sm">{success}</div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-dark-600" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-dark-600" />
          </div>

          {/* Google */}
          <button onClick={handleGoogleAuth} disabled={loading}
            className="btn-secondary w-full flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-brand-400 hover:underline">Terms</Link>{' '}and{' '}
          <Link href="/privacy" className="text-brand-400 hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900 flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>}>
      <AuthForm />
    </Suspense>
  );
}
