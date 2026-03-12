'use client';

import { useState } from 'react';
import { X, Users, Loader2, CheckCircle } from 'lucide-react';
import type { Listing } from '@/lib/types';

interface VolunteerModalProps {
  listing: Listing;
  onClose: () => void;
}

const ALL_SKILLS = [
  'Frontend Dev', 'Backend Dev', 'Mobile Dev', 'UI/UX Design', 'Graphic Design',
  'Digital Marketing', 'Social Media', 'Content Writing', 'SEO', 'Video Editing',
  'Finance & Accounting', 'Legal', 'Business Dev', 'Sales', 'Project Management',
  'Data Analysis', 'AI/ML', 'DevOps', 'Photography', 'Logistics', 'Research'
];

export default function VolunteerModal({ listing, onClose }: VolunteerModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [hours, setHours] = useState('5');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async () => {
    if (selectedSkills.length === 0) { setError('Please select at least one skill'); return; }
    if (!message.trim()) { setError('Please write a short introduction'); return; }
    setLoading(true);
    setError('');
    // In production: call Supabase API
    await new Promise(resolve => setTimeout(resolve, 1800));
    setLoading(false);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-dark-800 border border-dark-600 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <div>
            <h2 className="font-display font-bold text-white text-xl">Volunteer for {listing.title}</h2>
            <p className="text-gray-400 text-sm mt-0.5">Offer your skills and help this business grow</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-2"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6">
          {step === 'form' && (
            <div className="space-y-5">
              {/* Skills Needed */}
              {listing.skills_needed?.length > 0 && (
                <div className="bg-forest-500/10 border border-forest-500/30 rounded-xl p-3">
                  <p className="text-forest-400 text-sm font-medium mb-2">🎯 This business needs:</p>
                  <div className="flex flex-wrap gap-1">
                    {listing.skills_needed.map(s => (
                      <span key={s} className="badge badge-green text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skill Selection */}
              <div>
                <label className="label">Your Skills <span className="text-gray-600 font-normal">(select all that apply)</span></label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SKILLS.map(skill => (
                    <button key={skill} onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedSkills.includes(skill)
                          ? 'border-forest-500 bg-forest-500/20 text-forest-400'
                          : 'border-dark-500 text-gray-400 hover:border-dark-400'}`}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div>
                <label className="label">Hours per week you can commit</label>
                <div className="grid grid-cols-4 gap-2">
                  {['2', '5', '10', '20'].map(h => (
                    <button key={h} onClick={() => setHours(h)}
                      className={`py-2 rounded-xl text-sm font-medium border transition-all ${
                        hours === h ? 'border-brand-500 bg-brand-500/10 text-brand-400' : 'border-dark-500 text-gray-400'}`}>
                      {h}h/wk
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="label">Your Introduction</label>
                <textarea
                  placeholder="Tell the founder about yourself, your experience, and why you want to help..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  className="input resize-none"
                />
                <p className="text-gray-600 text-xs mt-1">{message.length}/500 characters</p>
              </div>

              {error && <div className="bg-earth-500/10 border border-earth-500/30 rounded-xl p-3 text-earth-400 text-sm">{error}</div>}

              <button onClick={handleSubmit} disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
                {loading ? 'Sending Application...' : 'Apply to Volunteer'}
              </button>

              <p className="text-gray-600 text-xs text-center">
                The founder will review your application and reach out if there's a match.
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-forest-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-forest-400" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">Application Sent!</h3>
              <p className="text-gray-400 mb-4">
                Your volunteer application for <span className="text-white font-semibold">{listing.title}</span> has been submitted.
              </p>
              <div className="bg-dark-700 rounded-xl p-4 mb-6 text-left space-y-2">
                <div className="text-xs text-gray-500 mb-2">Application Summary</div>
                <div className="flex flex-wrap gap-1">
                  {selectedSkills.map(s => <span key={s} className="badge badge-green text-xs">{s}</span>)}
                </div>
                <div className="text-gray-400 text-sm">Availability: {hours} hrs/week</div>
              </div>
              <p className="text-gray-500 text-sm mb-6">
                You'll receive a notification when the founder reviews your application. Keep an eye on your dashboard!
              </p>
              <button onClick={onClose} className="btn-primary w-full">Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
