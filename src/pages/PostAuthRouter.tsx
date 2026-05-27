import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function PostAuthRouter() {
  const { user, loading } = useAuth();
  const [params] = useSearchParams();
  const { toast } = useToast();
  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;

    let pendingAdvisor = '';
    let pendingInstitution = '';
    let pendingFirstName = '';
    try {
      pendingAdvisor = params.get('advisor_id') || params.get('advisor') || sessionStorage.getItem('pending_advisor_id') || '';
      pendingInstitution = sessionStorage.getItem('pending_advisor_institution') || '';
      pendingFirstName = sessionStorage.getItem('pending_advisor_first_name') || '';
    } catch {}

    // No real session: keep the dummy bypass behavior — go to intake, preserving advisor in URL.
    if (!user) {
      const qs = new URLSearchParams();
      if (pendingAdvisor) qs.set('advisor', pendingAdvisor);
      if (pendingInstitution) qs.set('institution', pendingInstitution);
      setRedirect(`/intake${qs.toString() ? `?${qs}` : ''}`);
      return;
    }

    (async () => {
      const { data: sub } = await supabase
        .from('intake_submissions')
        .select('id, advisor_id')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (pendingAdvisor) {
        const alreadyLinked = sub?.advisor_id === pendingAdvisor;
        if (!alreadyLinked) {
          await supabase.from('profiles').update({ advisor_id: pendingAdvisor }).eq('id', user.id);
          if (sub?.id) {
            await supabase.from('intake_submissions').update({ advisor_id: pendingAdvisor } as never).eq('id', sub.id);
          }
          if (sub) {
            toast({
              title: 'Report shared',
              description: `Your report has been shared with ${pendingFirstName || 'your advisor'}${pendingInstitution ? ` at ${pendingInstitution}` : ''}.`,
            });
          }
        }
        try {
          sessionStorage.removeItem('pending_advisor_id');
          sessionStorage.removeItem('pending_advisor_institution');
          sessionStorage.removeItem('pending_advisor_first_name');
        } catch {}
      }

      if (sub) {
        setRedirect('/report');
      } else {
        const qs = new URLSearchParams();
        if (pendingAdvisor) qs.set('advisor', pendingAdvisor);
        if (pendingInstitution) qs.set('institution', pendingInstitution);
        setRedirect(`/intake${qs.toString() ? `?${qs}` : ''}`);
      }
    })();
  }, [user, loading, params, toast]);

  if (redirect) return <Navigate to={redirect} replace />;
  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Signing you in…
    </div>
  );
}