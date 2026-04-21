import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AuthCard } from '@/components/auth/AuthCard';
import { SocialButtons, EmailDivider } from '@/components/auth/SocialButtons';

export default function SignIn() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const advisorId = params.get('advisor');
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSending, setForgotSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      toast({ title: 'Sign in failed', description: error.message, variant: 'destructive' });
      return;
    }
    // Routing decision happens in PostAuthRouter
    navigate('/post-auth', { replace: true });
  };

  const sendReset = async () => {
    if (!forgotEmail) return;
    setForgotSending(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setForgotSending(false);
    if (error) {
      toast({ title: 'Could not send reset link', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Check your inbox', description: 'We sent you a password reset link.' });
    setForgotOpen(false);
  };

  return (
    <AuthCard>
      <h1 className="text-[24px] font-bold text-center text-[#1A365D]">Welcome Back</h1>
      <p className="text-[14px] text-muted-foreground text-center mt-2">
        Sign in to view your report and advising profile.
      </p>
      <div style={{ height: 24 }} />
      <SocialButtons advisorId={advisorId} />
      <div style={{ height: 20 }} />
      <EmailDivider />
      <div style={{ height: 20 }} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1.5">
            <Input id="password" type={showPw ? 'text' : 'password'} placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} className="pr-10" required />
            <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-right mt-1.5">
            <button type="button" onClick={() => setForgotOpen(true)} className="text-[13px] text-[#1A365D] underline">Forgot password?</button>
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full h-11 rounded-2xl bg-[#1A365D] text-white font-medium hover:bg-[#1A365D]/90 disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Signing in…' : 'Sign In →'}
        </button>
      </form>
      <div style={{ height: 20 }} />
      <p className="text-[14px] text-center">
        Don't have an account?{' '}
        <Link to={`/auth${advisorId ? `?advisor=${advisorId}` : ''}`} className="text-[#1A365D] underline font-medium">Create Account</Link>
      </p>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>Enter your email and we'll send a reset link.</DialogDescription>
          </DialogHeader>
          <Input type="email" placeholder="you@email.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
          <DialogFooter>
            <button onClick={sendReset} disabled={forgotSending || !forgotEmail} className="w-full h-10 rounded-md bg-[#1A365D] text-white font-medium disabled:opacity-50">
              {forgotSending ? 'Sending…' : 'Send Reset Link'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthCard>
  );
}