import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ScoringResult, StudentData } from '@/types/intake';
import { ResultsView } from '@/components/results/ResultsView';
import { Textarea } from '@/components/ui/textarea';

function buildAgenda(sd: StudentData, r: ScoringResult): string[] {
  const items: string[] = [];
  if (!sd.whyLawSchool || sd.whyLawSchool.trim().length < 80) {
    items.push('Discuss career goals and clarity of motivation');
  }
  const hasAcademicRec = (sd.recommenders ?? []).some(rec => rec.relationship === 'Professor' && rec.name.trim());
  if (!hasAcademicRec) {
    items.push('Review recommender strategy — student has not identified a professor as a potential recommender');
  }
  if (sd.testStatus === 'None') {
    items.push('Determine testing path — JD-Next vs. LSAT based on school list variance check');
  }
  if (r.listComposition === 'Overreaching') {
    items.push('Rebalance school list — current list is weighted toward reach schools');
  }
  if (sd.addendumNeeded === 'Yes') {
    items.push('Discuss addendum strategy');
  }
  if (r.readinessLevel === 'Needs Preparation') {
    items.push('Review application strengthening plan — legal work experience and test preparation timeline');
  }
  return items.slice(0, 5);
}

export default function AdvisorStudentReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sd, setSd] = useState<StudentData | null>(null);
  const [r, setR] = useState<ScoringResult | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from('intake_submissions')
        .select('student_data, results')
        .eq('id', id)
        .maybeSingle();
      if (data) {
        setSd(data.student_data as unknown as StudentData);
        setR(data.results as unknown as ScoringResult);
      }
    })();
  }, [id]);

  if (!sd || !r) return <div className="p-8 text-muted-foreground">Loading report…</div>;
  const agenda = buildAgenda(sd, r);

  return (
    <div>
      <button onClick={() => navigate('/advisor-dashboard')} className="inline-flex items-center gap-1 text-sm text-[#1A365D] mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to students
      </button>
      <ResultsView results={r} studentData={sd} onStartOver={() => navigate('/advisor-dashboard')} />
      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
        <div className="border rounded-xl bg-white p-6">
          <h3 className="text-xl font-heading font-bold text-[#1A365D] mb-3">Suggested Meeting Agenda</h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm">
            {agenda.length === 0 ? (
              <li className="list-none text-muted-foreground">No specific agenda flags from this student's profile — use the meeting to explore goals and timing.</li>
            ) : agenda.map((a, i) => <li key={i}>{a}</li>)}
          </ol>
        </div>
        <div className="border rounded-xl bg-white p-6">
          <h3 className="text-xl font-heading font-bold text-[#1A365D] mb-3">Advisor Notes</h3>
          <p className="text-xs text-muted-foreground mb-2">Private — never visible to the student.</p>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={6} placeholder="Add private notes for this advising relationship…" />
        </div>
      </div>
    </div>
  );
}