import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthCard } from '@/components/auth/AuthCard';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const valid = pw.length >= 8 && pw === confirm;

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setSubmitting(false);
    if (error) {
      toast({ title: 'Could not update password', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Password updated' });
    navigate('/post-auth', { replace: true });
  };

  return (
    <AuthCard>
      <h1 className="text-[24px] font-bold text-center text-[#1A365D]">Set a new password</h1>
      <div style={{ height: 24 }} />
      <form onSubmit={handle} className="space-y-4">
        <div>
          <Label htmlFor="pw">New password</Label>
          <Input id="pw" type="password" value={pw} onChange={e => setPw(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="mt-1.5" />
        </div>
        <button type="submit" disabled={!valid || submitting} className="w-full h-11 rounded-2xl bg-[#1A365D] text-white font-medium disabled:opacity-50">
          {submitting ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </AuthCard>
  );
}