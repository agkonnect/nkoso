'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ArrowLeft, ArrowRight, Check, Loader2, Upload, Plus, X } from 'lucide-react';
import type { ListingSector, ListingStage } from '@/lib/types';

const SECTORS: { value: ListingSector; label: string; emoji: string }[] = [
  { value: 'tech', label: 'Technology', emoji: '💻' },
  { value: 'agriculture', label: 'Agriculture', emoji: '🌾' },
  { value: 'fashion', label: 'Fashion', emoji: '👗' },
  { value: 'health', label: 'Health', emoji: '🏥' },
  { value: 'education', label: 'Education', emoji: '📚' },
  { value: 'finance', label: 'Finance', emoji: '💰' },
  { value: 'food', label: 'Food & Beverage', emoji: '🍔' },
  { value: 'retail', label: 'Retail', emoji: '🛍️' },
  { value: 'other', label: 'Other', emoji: '🚀' },
];

const STAGES: { value: ListingStage; label: string; desc: string }[] = [
  { value: 'idea', label: 'Idea Stage', desc: 'Just an idea, no product yet' },
  { value: 'mvp', label: 'MVP', desc: 'Working prototype or early product' },
  { value: 'growing', label: 'Growing', desc: 'Have customers and revenue' },
  { value: 'established', label: 'Established', desc: 'Proven business model' },
];

const SKILL_OPTIONS = [
  'Frontend Dev', 'Backend Dev', 'Mobile Dev', 'UI/UX Design', 'Graphic Design',
  'Digital Marketing', 'Social Media', 'Content Writing', 'Finance', 'Legal',
  'Business Dev', 'Sales', 'Data Analysis', 'AI/ML', 'Logistics', 'Photography'
];

const STEPS = [
  { id: 1, label: 'Basics' },
  { id: 2, label: 'Funding' },
  { id: 3, label: 'Skills' },
  { id: 4, label: 'Review' },
];

export default function CreateListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    title: '',
    tagline: '',
    description: '',
    sector: '' as ListingSector | '',
    stage: '' as ListingStage | '',
    location: '',
    funding_goal: '',
    equity_offered: '',
    share_price: '',
    total_shares: '',
    skills_needed: [] as string[],
    pitch_video_url: '',
  });

  const update = (key: string, value: string | string[]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const toggleSkill = (skill: string) => {
    const skills = form.skills_needed.includes(skill)
      ? form.skills_needed.filter(s => s !== skill)
      : [...form.skills_needed, skill];
    update('skills_needed', skills);
  };

  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!form.title.trim()) errs.title = 'Business name is required';
      if (!form.tagline.trim()) errs.tagline = 'Tagline is required';
      if (form.tagline.length > 120) errs.tagline = 'Tagline must be 120 characters or less';
      if (!form.description.trim()) errs.description = 'Description is required';
      if (form.description.length < 100) errs.description = 'Please write at least 100 characters';
      if (!form.sector) errs.sector = 'Please select a sector';
      if (!form.stage) errs.stage = 'Please select a stage';
      if (!form.location.trim()) errs.location = 'Location is required';
    }
    if (s === 2) {
      if (!form.funding_goal || parseFloat(form.funding_goal) < 1000) errs.funding_goal = 'Minimum funding goal is GHS 1,000';
      if (!form.equity_offered || parseFloat(form.equity_offered) > 49) errs.equity_offered = 'Max equity is 49%';
      if (!form.share_price || parseFloat(form.share_price) < 10) errs.share_price = 'Minimum share price is GHS 10';
      if (!form.total_shares || parseInt(form.total_shares) < 100) errs.total_shares = 'Minimum 100 shares';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => { if (validateStep(step)) setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    // In production: insert to Supabase
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    router.push('/dashboard');
  };

  const calcShares = () => {
    const goal = parseFloat(form.funding_goal) || 0;
    const price = parseFloat(form.share_price) || 0;
    return price > 0 ? Math.floor(goal / price) : 0;
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="py-8">
            <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-4 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="font-display text-3xl font-bold text-white mb-2">List Your Business</h1>
            <p className="text-gray-400">Share your vision with the Nkoso community and start raising support.</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mb-8">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step > s.id ? 'bg-forest-500 text-white'
                    : step === s.id ? 'bg-brand-500 text-white'
                    : 'bg-dark-700 text-gray-500'}`}>
                    {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                  </div>
                  <span className={`text-xs mt-1 ${
                    step >= s.id ? 'text-white' : 'text-gray-600'}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 mb-4 transition-all ${
                    step > s.id ? 'bg-forest-500' : 'bg-dark-600'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="card p-6">
            {/* Step 1: Basics */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl font-bold text-white mb-4">Business Basics</h2>

                <div>
                  <label className="label">Business Name *</label>
                  <input value={form.title} onChange={e => update('title', e.target.value)}
                    placeholder="e.g. AgriConnect Ghana" className="input" />
                  {errors.title && <p className="text-earth-400 text-xs mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="label">Tagline * <span className="text-gray-600 font-normal">({form.tagline.length}/120)</span></label>
                  <input value={form.tagline} onChange={e => update('tagline', e.target.value)}
                    placeholder="One sentence that captures your business..." className="input" maxLength={120} />
                  {errors.tagline && <p className="text-earth-400 text-xs mt-1">{errors.tagline}</p>}
                </div>

                <div>
                  <label className="label">Description * <span className="text-gray-600 font-normal">({form.description.length} chars)</span></label>
                  <textarea value={form.description} onChange={e => update('description', e.target.value)}
                    placeholder="Describe your business, the problem it solves, your traction so far, and what you need funding for..."
                    rows={6} className="input resize-none" />
                  {errors.description && <p className="text-earth-400 text-xs mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="label">Sector *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {SECTORS.map(s => (
                      <button key={s.value} onClick={() => update('sector', s.value)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          form.sector === s.value ? 'border-brand-500 bg-brand-500/10' : 'border-dark-500 hover:border-dark-400'}`}>
                        <div className="text-xl mb-1">{s.emoji}</div>
                        <div className="text-white text-xs font-medium">{s.label}</div>
                      </button>
                    ))}
                  </div>
                  {errors.sector && <p className="text-earth-400 text-xs mt-1">{errors.sector}</p>}
                </div>

                <div>
                  <label className="label">Business Stage *</label>
                  <div className="space-y-2">
                    {STAGES.map(s => (
                      <button key={s.value} onClick={() => update('stage', s.value)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          form.stage === s.value ? 'border-brand-500 bg-brand-500/10' : 'border-dark-500 hover:border-dark-400'}`}>
                        <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                          form.stage === s.value ? 'border-brand-500 bg-brand-500' : 'border-dark-400'}`} />
                        <div>
                          <div className="text-white text-sm font-medium">{s.label}</div>
                          <div className="text-gray-500 text-xs">{s.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.stage && <p className="text-earth-400 text-xs mt-1">{errors.stage}</p>}
                </div>

                <div>
                  <label className="label">Location *</label>
                  <input value={form.location} onChange={e => update('location', e.target.value)}
                    placeholder="e.g. Accra, Ghana" className="input" />
                  {errors.location && <p className="text-earth-400 text-xs mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="label">Pitch Video URL <span className="text-gray-600 font-normal">(optional)</span></label>
                  <input value={form.pitch_video_url} onChange={e => update('pitch_video_url', e.target.value)}
                    placeholder="YouTube or Vimeo link to your pitch..." className="input" />
                </div>
              </div>
            )}

            {/* Step 2: Funding */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl font-bold text-white mb-4">Funding Details</h2>

                <div className="bg-brand-500/10 border border-brand-500/30 rounded-xl p-4 text-sm text-brand-300">
                  💡 Set your share price carefully — it determines minimum investment and who can participate.
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Funding Goal (GHS) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₵</span>
                      <input type="number" value={form.funding_goal} onChange={e => update('funding_goal', e.target.value)}
                        placeholder="50000" className="input pl-7" min={1000} />
                    </div>
                    {errors.funding_goal && <p className="text-earth-400 text-xs mt-1">{errors.funding_goal}</p>}
                  </div>
                  <div>
                    <label className="label">Equity Offered (%) *</label>
                    <div className="relative">
                      <input type="number" value={form.equity_offered} onChange={e => update('equity_offered', e.target.value)}
                        placeholder="15" className="input pr-7" min={1} max={49} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                    </div>
                    {errors.equity_offered && <p className="text-earth-400 text-xs mt-1">{errors.equity_offered}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Share Price (GHS) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₵</span>
                      <input type="number" value={form.share_price} onChange={e => update('share_price', e.target.value)}
                        placeholder="10" className="input pl-7" min={10} />
                    </div>
                    {errors.share_price && <p className="text-earth-400 text-xs mt-1">{errors.share_price}</p>}
                  </div>
                  <div>
                    <label className="label">Total Shares *</label>
                    <input type="number" value={form.total_shares} onChange={e => update('total_shares', e.target.value)}
                      placeholder="5000" className="input" min={100} />
                    {errors.total_shares && <p className="text-earth-400 text-xs mt-1">{errors.total_shares}</p>}
                  </div>
                </div>

                {/* Auto calc */}
                {form.funding_goal && form.share_price && (
                  <div className="bg-dark-700 rounded-xl p-4 space-y-2 text-sm">
                    <div className="text-gray-400 font-medium mb-2">📊 Auto Calculation</div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Implied shares from goal/price</span>
                      <span className="text-white font-medium">{calcShares().toLocaleString()} shares</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Min investment (1 share)</span>
                      <span className="text-white font-medium">₵{form.share_price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Platform fee on goal (3%)</span>
                      <span className="text-gray-400">{form.funding_goal ? `₵${(parseFloat(form.funding_goal) * 0.03).toLocaleString()}` : '—'}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Skills */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl font-bold text-white mb-4">Skills You Need</h2>
                <p className="text-gray-400 text-sm">Select skills you're looking for from volunteers. This helps the right people find you.</p>

                <div className="flex flex-wrap gap-2">
                  {SKILL_OPTIONS.map(skill => (
                    <button key={skill} onClick={() => toggleSkill(skill)}
                      className={`px-3 py-2 rounded-full text-sm font-medium border transition-all ${
                        form.skills_needed.includes(skill)
                          ? 'border-forest-500 bg-forest-500/20 text-forest-400'
                          : 'border-dark-500 text-gray-400 hover:border-dark-400'}`}>
                      {form.skills_needed.includes(skill) ? '✓ ' : '+ '}{skill}
                    </button>
                  ))}
                </div>

                {form.skills_needed.length > 0 && (
                  <div className="bg-dark-700 rounded-xl p-3">
                    <p className="text-gray-400 text-xs mb-2">Selected ({form.skills_needed.length}):</p>
                    <div className="flex flex-wrap gap-1">
                      {form.skills_needed.map(s => (
                        <span key={s} className="badge badge-green text-xs flex items-center gap-1">
                          {s}
                          <button onClick={() => toggleSkill(s)} className="hover:text-white"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-gray-600 text-xs">You can skip this step if you're only raising capital and don't need volunteers.</p>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl font-bold text-white mb-4">Review & Submit</h2>

                <div className="space-y-3">
                  {[
                    { label: 'Business Name', value: form.title },
                    { label: 'Tagline', value: form.tagline },
                    { label: 'Sector', value: SECTORS.find(s => s.value === form.sector)?.label ?? form.sector },
                    { label: 'Stage', value: STAGES.find(s => s.value === form.stage)?.label ?? form.stage },
                    { label: 'Location', value: form.location },
                    { label: 'Funding Goal', value: `₵${parseFloat(form.funding_goal).toLocaleString()}` },
                    { label: 'Equity Offered', value: `${form.equity_offered}%` },
                    { label: 'Share Price', value: `₵${form.share_price}` },
                    { label: 'Total Shares', value: parseInt(form.total_shares).toLocaleString() },
                    { label: 'Skills Needed', value: form.skills_needed.join(', ') || 'None' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-start py-2 border-b border-dark-700 last:border-0 gap-4">
                      <span className="text-gray-500 text-sm shrink-0">{item.label}</span>
                      <span className="text-white text-sm text-right">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-brand-500/10 border border-brand-500/30 rounded-xl p-4 text-sm text-brand-300">
                  📋 Your listing will be reviewed by our team within 24 hours. You'll receive a notification once it goes live.
                </div>

                <div className="bg-dark-700 rounded-xl p-3 text-xs text-gray-500">
                  By submitting, you confirm that all information is accurate and you are authorised to list this business on Nkoso. You agree to our Terms of Service and Listing Guidelines.
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-dark-700">
              {step > 1 && (
                <button onClick={prevStep} className="btn-secondary flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              {step < 4 ? (
                <button onClick={nextStep} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {loading ? 'Submitting...' : 'Submit Listing'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
