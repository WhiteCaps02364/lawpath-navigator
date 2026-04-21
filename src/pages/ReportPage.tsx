import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ResultsView } from '@/components/results/ResultsView';
import { ScoringResult, StudentData } from '@/types/intake';

function ReportInner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<ScoringResult | null>(null);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: sub } = await supabase
        .from('intake_submissions')
        .select('student_data, results, completed')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (sub?.results && sub?.student_data) {
        setResults(sub.results as unknown as ScoringResult);
        setStudentData(sub.student_data as unknown as StudentData);
      }
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading your report…</div>;
  if (!results || !studentData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-muted-foreground">No completed report yet.</p>
        <button onClick={() => navigate('/intake')} className="px-4 py-2 rounded-md bg-[#1A365D] text-white">Start intake</button>
      </div>
    );
  }
  return <ResultsView results={results} studentData={studentData} onStartOver={() => navigate('/intake')} />;
}

export default function ReportPage() {
  return (
    <ProtectedRoute>
      <ReportInner />
    </ProtectedRoute>
  );
}