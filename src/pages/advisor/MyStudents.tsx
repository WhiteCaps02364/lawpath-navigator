import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAdvisorDemo } from '@/contexts/AdvisorDemoContext';
import { buildAdvisorUrl } from '@/lib/advisorSlug';
import { supabase } from '@/integrations/supabase/client';

interface Submission {
  id: string;
  created_at: string;
  student_data: any;
  results: any;
}

export default function MyStudents() {
  const { advisor } = useAdvisorDemo();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!advisor) return;
    (async () => {
      const { data } = await supabase
        .from('intake_submissions')
        .select('id, created_at, student_data, results')
        .eq('advisor_id', advisor.id)
        .eq('completed', true);
      setSubmissions((data as any[]) ?? []);
    })();
  }, [advisor]);

  if (!advisor) return null;
  const url = buildAdvisorUrl(advisor.slug);

  const copy = () => {
    navigator.clipboard.writeText(`https://${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = submissions.filter(s => {
    const q = search.toLowerCase();
    if (!q) return true;
    const sd = s.student_data || {};
    return `${sd.firstName ?? ''} ${sd.lastName ?? ''}`.toLowerCase().includes(q)
      || (sd.undergraduateInstitution ?? '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold text-[#1A365D]">Your Pre-Law Advising Dashboard</h1>

      <div className="bg-muted rounded-lg p-4 space-y-2">
        <p className="text-xs text-muted-foreground">Your custom advisor link</p>
        <div className="flex items-center gap-2 flex-wrap">
          <code className="flex-1 min-w-[240px] text-sm font-mono bg-white border rounded px-3 py-2">{url}</code>
          <button onClick={copy} className="inline-flex items-center gap-1.5 bg-[#1A365D] text-white px-3 py-2 rounded text-sm font-medium">
            {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Share this link with your advisees. Their completed reports will appear here automatically.</p>
      </div>

      <p className="text-sm font-semibold" style={{ color: '#C9A84C' }}>
        {submissions.length} {submissions.length === 1 ? 'student has' : 'students have'} completed their assessment
      </p>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by student name or institution"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-10 text-center space-y-3">
          <p className="text-muted-foreground">No students have completed their assessment yet. Share your link to get started.</p>
          <div className="flex items-center justify-center gap-2 max-w-xl mx-auto">
            <code className="flex-1 text-sm font-mono bg-muted rounded px-3 py-2">{url}</code>
            <button onClick={copy} className="inline-flex items-center gap-1.5 bg-[#1A365D] text-white px-3 py-2 rounded text-sm font-medium">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg bg-white">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Student Name</th>
                <th className="px-4 py-3 font-medium">Undergraduate Institution</th>
                <th className="px-4 py-3 font-medium">Date Completed</th>
                <th className="px-4 py-3 font-medium">Readiness</th>
                <th className="px-4 py-3 font-medium">GPA</th>
                <th className="px-4 py-3 font-medium">Test Status</th>
                <th className="px-4 py-3 font-medium">Résumé</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const sd = s.student_data || {};
                const r = s.results || {};
                return (
                  <tr key={s.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <button onClick={() => navigate(`/advisor-dashboard/student/${s.id}`)} className="text-[#1A365D] underline font-medium">
                        {sd.firstName} {sd.lastName}
                      </button>
                    </td>
                    <td className="px-4 py-3">{sd.undergraduateInstitution}</td>
                    <td className="px-4 py-3">{new Date(s.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><ReadinessBadge level={r.readinessLevel} /></td>
                    <td className="px-4 py-3">{sd.cumulativeGPA}</td>
                    <td className="px-4 py-3">{sd.testStatus}</td>
                    <td className="px-4 py-3 text-muted-foreground">Not uploaded</td>
                    <td className="px-4 py-3">
                      <button onClick={() => navigate(`/advisor-dashboard/student/${s.id}`)} className="bg-[#1A365D] text-white px-3 py-1.5 rounded text-xs font-medium">View Report</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function ReadinessBadge({ level }: { level?: string }) {
  if (!level) return <span className="text-muted-foreground text-xs">—</span>;
  const map: Record<string, { bg: string; color: string }> = {
    'High': { bg: '#DCFCE7', color: '#15803D' },
    'Developing': { bg: '#FEF3C7', color: '#92400E' },
    'Needs Preparation': { bg: '#FEE2E2', color: '#B91C1C' },
  };
  const s = map[level] || { bg: '#F3F4F6', color: '#374151' };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: s.bg, color: s.color }}>
      {level}
    </span>
  );
}