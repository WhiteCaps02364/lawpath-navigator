import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthCard } from '@/components/auth/AuthCard';
import { SocialButtons, EmailDivider } from '@/components/auth/SocialButtons';

export default function SignUp() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const advisorId = params.get('advisor');
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const tooShort = password.length > 0 && password.length < 8;
  const mismatch = confirm.length > 0 && confirm !== password;
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = validEmail && password.length >= 8 && confirm === password && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    // Dummy bypass: skip Supabase signup and route straight to intake.
    const inst = params.get('institution');
    const qs = new URLSearchParams();
    if (advisorId) qs.set('advisor', advisorId);
    if (inst) qs.set('institution', inst);
    navigate(`/intake${qs.toString() ? `?${qs.toString()}` : ''}`, { replace: true });
  };

  return (
    <AuthCard>
      <h1 className="text-[24px] font-bold text-center text-[#1A365D]">Create Your JD-Next Account</h1>
      <p className="text-[14px] text-muted-foreground text-center mt-2">
        Save your report, return anytime, and share with your advisor.
      </p>
      <div style={{ height: 24 }} />
      <SocialButtons advisorId={advisorId} />
      <div style={{ height: 20 }} />
      <EmailDivider />
      <div style={{ height: 20 }} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1.5">
            <Input id="password" type={showPw ? 'text' : 'password'} placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} className="pr-10" />
            <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Toggle password visibility">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {tooShort && <p className="text-xs text-destructive mt-1">Password must be at least 8 characters</p>}
        </div>
        <div>
          <Label htmlFor="confirm">Confirm Password</Label>
          <Input id="confirm" type={showPw ? 'text' : 'password'} placeholder="Repeat your password" value={confirm} onChange={e => setConfirm(e.target.value)} className="mt-1.5" />
          {mismatch && <p className="text-xs text-destructive mt-1">Passwords do not match</p>}
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full h-11 rounded-2xl bg-[#1A365D] text-white font-medium hover:bg-[#1A365D]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Creating…' : 'Create Account & Start →'}
        </button>
        <p className="text-[13px] text-muted-foreground text-center">
          By creating an account you agree to our{' '}
          <a href="https://aspenpublishing.com/policies/terms-of-service" target="_blank" rel="noreferrer" className="underline">Terms of Service</a>{' '}
          and{' '}
          <a href="https://aspenpublishing.com/policies/privacy-policy" target="_blank" rel="noreferrer" className="underline">Privacy Policy</a>.
        </p>
      </form>
      <div style={{ height: 20 }} />
      <p className="text-[14px] text-center">
        Already have an account?{' '}
        <Link to={`/signin${advisorId ? `?advisor=${advisorId}` : ''}`} className="text-[#1A365D] underline font-medium">Sign In</Link>
      </p>
    </AuthCard>
  );
}