import { useEffect, useMemo, useState } from 'react';
import { Send, Download, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SilhouetteAvatar } from '@/components/advisor/SilhouetteAvatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface AdvisorRow {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  institution: string;
  slug: string;
}

interface Props {
  studentInstitution: string;
  onDownloadPdf: () => void;
  onShared?: () => void;
}

export function ShareWithAdvisor({ studentInstitution, onDownloadPdf, onShared }: Props) {
  const [institutions, setInstitutions] = useState<string[]>([]);
  const [advisors, setAdvisors] = useState<AdvisorRow[]>([]);
  const [selected, setSelected] = useState<string>(studentInstitution || '');
  const [sentTo, setSentTo] = useState<string | null>(null);

  // Load list of institutions that have at least one advisor
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('advisors').select('institution');
      const unique = Array.from(new Set((data ?? []).map((a: any) => a.institution))).sort();
      setInstitutions(unique);
    })();
  }, []);

  // Load advisors for the chosen institution
  useEffect(() => {
    if (!selected) { setAdvisors([]); return; }
    (async () => {
      const { data } = await supabase
        .from('advisors')
        .select('id, first_name, last_name, title, institution, slug')
        .eq('institution', selected);
      setAdvisors((data as AdvisorRow[]) ?? []);
    })();
  }, [selected]);

  const sendTo = async (a: AdvisorRow) => {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;
    if (userId) {
      const { data: sub } = await supabase
        .from('intake_submissions')
        .select('id')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (sub?.id) {
        await supabase.from('intake_submissions').update({ advisor_id: a.id }).eq('id', sub.id);
      }
    }
    setSentTo(`${a.first_name} ${a.last_name}`);
    onShared?.();
  };

  if (sentTo) {
    return (
      <div className="border rounded-xl p-5 bg-white space-y-2">
        <div className="flex items-center gap-2 text-emerald-700 font-medium">
          <Check className="w-4 h-4" /> Sent
        </div>
        <p className="text-sm">
          Your report has been sent to <strong>{sentTo}</strong>. They will be in touch to schedule your advising meeting.
        </p>
      </div>
    );
  }

  const noAdvisors = selected && advisors.length === 0;

  return (
    <div className="space-y-5">
      <div className="border rounded-xl p-5 bg-white space-y-3">
        <h3 className="font-heading text-lg font-bold text-[#1A365D]">Share with Your Pre-Law Advisor</h3>
        <p className="text-sm text-muted-foreground">
          If your undergraduate institution has a pre-law advisor registered with this system, you can send your report directly to their dashboard.
        </p>
        <div>
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger><SelectValue placeholder="Select your institution" /></SelectTrigger>
            <SelectContent>
              {institutions.length === 0 ? (
                <SelectItem value="__none" disabled>No institutions registered yet</SelectItem>
              ) : institutions.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {noAdvisors && (
          <p className="text-sm text-muted-foreground">
            No pre-law advisors from {selected} have registered yet. You can download your report as a PDF to share directly.
          </p>
        )}

        {advisors.length === 1 && (
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <SilhouetteAvatar size={56} />
            <div className="flex-1">
              <p className="font-medium text-sm">{advisors[0].first_name} {advisors[0].last_name}</p>
              <p className="text-xs text-muted-foreground">{advisors[0].title}</p>
            </div>
            <Button onClick={() => sendTo(advisors[0])} className="bg-[#1A365D] text-white gap-1.5">
              <Send className="w-4 h-4" /> Send to {advisors[0].first_name}
            </Button>
          </div>
        )}

        {advisors.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {advisors.map(a => (
              <button key={a.id} onClick={() => sendTo(a)} className="flex items-center gap-3 p-3 border rounded-lg text-left hover:border-[#1A365D] transition-colors">
                <SilhouetteAvatar size={48} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{a.first_name} {a.last_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.title}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t pt-5">
        <button onClick={onDownloadPdf} className="inline-flex items-center gap-2 border border-[#1A365D] text-[#1A365D] bg-white px-4 py-2 rounded-md font-medium hover:bg-muted">
          <Download className="w-4 h-4" /> Download to Share with My Pre-Law Advisor
        </button>
      </div>
    </div>
  );
}