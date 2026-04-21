import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getDemoStudent } from '@/data/demoStudents';
import { ReadinessBadge } from './MyStudents';

export default function DemoStudentReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const s = id ? getDemoStudent(id) : undefined;
  if (!s) {
    return (
      <div>
        <button onClick={() => navigate('/advisor-dashboard/demo')} className="text-sm text-[#1A365D] underline">Back</button>
        <p className="mt-4 text-muted-foreground">Demo student not found.</p>
      </div>
    );
  }

  // A pre-generated, plausible report
  return (
    <div className="max-w-3xl space-y-6">
      <button onClick={() => navigate('/advisor-dashboard/demo')} className="inline-flex items-center gap-1 text-sm text-[#1A365D]">
        <ArrowLeft className="w-4 h-4" /> Back to demo dashboard
      </button>

      <div className="px-4 py-3 rounded-md text-sm" style={{ background: '#F8E9C2', color: '#5C4A1A' }}>
        Demo report for <strong>{s.name}</strong>. This data is illustrative and is not stored.
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-heading font-bold text-[#1A365D]">{s.name}</h2>
            <p className="text-sm text-muted-foreground">{s.institution} · GPA {s.gpa} · {s.testStatus}</p>
          </div>
          <ReadinessBadge level={s.readiness} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase">Strategy</p>
            <p className="mt-1 font-medium">
              {s.readiness === 'High' ? 'Apply this cycle with a balanced school list' :
               s.readiness === 'Developing' ? 'Apply next cycle after testing optimization' :
               'Strengthen application — consider gap year for legal employment'}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase">Timeline</p>
            <p className="mt-1 font-medium">
              {s.readiness === 'High' ? '~6 months to application — start drafting personal statement now' :
               s.readiness === 'Developing' ? '12+ months — focus on test prep and recommender outreach' :
               '18+ months — prioritize legal experience and academic improvement'}
            </p>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-xs text-muted-foreground uppercase mb-2">School Assessment (sample)</p>
          <ul className="text-sm space-y-1">
            <li>· Duke Law — <span className="text-amber-700">Reach</span></li>
            <li>· UNC Law — <span className="text-emerald-700">Target</span></li>
            <li>· Wake Forest Law — <span className="text-emerald-700">Target</span></li>
            <li>· Georgetown Law — <span className="text-amber-700">Reach</span></li>
          </ul>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-xs text-muted-foreground uppercase mb-2">Suggested Meeting Agenda</p>
          <ol className="list-decimal pl-5 text-sm space-y-1">
            <li>Review readiness frame and confirm timeline</li>
            <li>Discuss recommender strategy</li>
            {s.testStatus === 'No test' && <li>Determine testing path — JD-Next vs. LSAT</li>}
            {s.readiness === 'Needs Preparation' && <li>Review application strengthening plan</li>}
            <li>Plan personal statement themes</li>
          </ol>
        </div>
      </div>
    </div>
  );
}