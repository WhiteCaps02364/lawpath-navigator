import { useNavigate } from 'react-router-dom';
import { demoStudents } from '@/data/demoStudents';
import { ReadinessBadge } from './MyStudents';

export default function DemoDashboard() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold text-[#1A365D]">See How Student Reports Appear in Your Dashboard</h1>
      <p className="text-base text-muted-foreground">
        This is a preview of what your dashboard looks like once students begin submitting reports.
      </p>

      <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-md text-sm" style={{ background: '#F8E9C2', color: '#5C4A1A' }}>
        <span>This is a demo dashboard. Your real student reports will appear in My Students once advisees complete the intake.</span>
        <button onClick={() => navigate('/advisor-dashboard')} className="bg-[#1A365D] text-white px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap">
          Go to My Students
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Student Name</th>
              <th className="px-4 py-3 font-medium">Institution</th>
              <th className="px-4 py-3 font-medium">Date Completed</th>
              <th className="px-4 py-3 font-medium">Readiness</th>
              <th className="px-4 py-3 font-medium">GPA</th>
              <th className="px-4 py-3 font-medium">Test Status</th>
              <th className="px-4 py-3 font-medium">Résumé</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {demoStudents.map(s => (
              <tr key={s.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3">
                  <button onClick={() => navigate(`/advisor-dashboard/demo-student/${s.id}`)} className="text-[#1A365D] underline font-medium">
                    {s.name}
                  </button>
                </td>
                <td className="px-4 py-3">{s.institution}</td>
                <td className="px-4 py-3">{s.completedLabel}</td>
                <td className="px-4 py-3"><ReadinessBadge level={s.readiness} /></td>
                <td className="px-4 py-3">{s.gpa}</td>
                <td className="px-4 py-3">{s.testStatus}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.resumeUploaded ? 'Résumé uploaded' : 'Not uploaded'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => navigate(`/advisor-dashboard/demo-student/${s.id}`)} className="bg-[#1A365D] text-white px-3 py-1.5 rounded text-xs font-medium">View Report</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}