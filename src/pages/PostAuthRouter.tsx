import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function PostAuthRouter() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/auth', { replace: true });
      return;
    }
    (async () => {
      // Attach advisor_id if present in URL
      const advisorId = params.get('advisor');
      if (advisorId) {
        await supabase.from('profiles').update({ advisor_id: advisorId }).eq('id', user.id);
      }
      const { data: sub } = await supabase
        .from('intake_submissions')
        .select('id, completed')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (sub?.completed) navigate('/report', { replace: true });
      else navigate('/intake', { replace: true });
    })();
  }, [user, loading, navigate, params]);

  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>
  );
}