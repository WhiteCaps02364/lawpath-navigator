import { useEffect, useRef, useState } from 'react';
import { IntakeProvider, useIntake } from '@/contexts/IntakeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { IntakeProgressBar } from '@/components/intake/IntakeProgressBar';
import { StepPersonalInfo } from '@/components/intake/StepPersonalInfo';
import { StepAcademics } from '@/components/intake/StepAcademics';
import { StepTesting, isFutureDateValue } from '@/components/intake/StepTesting';
import { StepPreferences } from '@/components/intake/StepPreferences';
import { StepApplicationStrength } from '@/components/intake/StepApplicationStrength';
import { StepSchoolSelection } from '@/components/intake/StepSchoolSelection';
import { ResultsView } from '@/components/results/ResultsView';
import { calculateScores } from '@/lib/scoringEngine';
import { ScoringResult } from '@/types/intake';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import jdnLogo from '@/assets/jdn-logo.png';

const stepLabels = [
  'Personal Information',
  'Academic Profile',
  'Testing',
  'Goals & Preferences',
  'Application Strength',
  'School Selection',
];

function IntakeWizardInner() {
  const { data, setData, currentStep, setCurrentStep, totalSteps } = useIntake();
  const { user } = useAuth();
  const [results, setResults] = useState<ScoringResult | null>(null);
  const submissionId = useRef<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load existing in-progress submission
  useEffect(() => {
    if (!user || hydrated) return;
    (async () => {
      const { data: sub } = await supabase
        .from('intake_submissions')
        .select('id, student_data, completed')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (sub) {
        submissionId.current = sub.id;
        if (sub.student_data && Object.keys(sub.student_data as object).length) {
          setData({ ...data, ...(sub.student_data as object) } as typeof data);
        }
      }
      setHydrated(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Autosave on data/step change (debounced via timeout)
  useEffect(() => {
    if (!user || !hydrated) return;
    const t = setTimeout(async () => {
      if (submissionId.current) {
        await supabase.from('intake_submissions').update({ student_data: data as never }).eq('id', submissionId.current);
      } else {
        const { data: ins } = await supabase
          .from('intake_submissions')
          .insert({ user_id: user.id, student_data: data as never, completed: false })
          .select('id')
          .single();
        if (ins) submissionId.current = ins.id;
      }
    }, 800);
    return () => clearTimeout(t);
  }, [data, user, hydrated]);

  if (results) {
    return (
      <ResultsView
        results={results}
        studentData={data}
        onStartOver={() => {
          setResults(null);
          setCurrentStep(0);
        }}
      />
    );
  }

  const steps = [
    <StepPersonalInfo key={0} />,
    <StepAcademics key={1} />,
    <StepTesting key={2} />,
    <StepPreferences key={3} />,
    <StepApplicationStrength key={4} />,
    <StepSchoolSelection key={5} />,
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 0: {
        const currentYear = new Date().getFullYear();
        const isCurrentOrFuture = data.graduationYear >= currentYear;
        const schoolEmailOk = isCurrentOrFuture ? !!data.schoolEmail : true;
        return data.firstName && data.lastName && schoolEmailOk && data.personalEmail && data.undergraduateInstitution && data.applicationTimingIntent;
      }
      case 1: return data.cumulativeGPA > 0 && data.majors;
      case 2: {
        const hasFutureDate = data.testStatus === 'Taken' && (
          isFutureDateValue(data.lsatDate) || isFutureDateValue(data.greDate) || isFutureDateValue(data.jdNextDate)
        );
        return !hasFutureDate;
      }
      case 3: {
        const sel = [data.firstChoiceState, data.secondChoiceState, data.thirdChoiceState].filter(s => s && s !== '' && s !== 'No preference');
        const noDup = new Set(sel).size === sel.length;
        return !!data.whyLawSchool && data.whyLawSchool.length >= 50 && data.practiceAreaInterest.length > 0 && !!data.firstChoiceState && noDup;
      }
      case 4: return true;
      case 5: return data.selectedSchools.length > 0;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep === totalSteps - 1) {
      const scored = calculateScores(data);
      setResults(scored);
      // Persist completion
      (async () => {
        if (!user) return;
        if (submissionId.current) {
          await supabase
            .from('intake_submissions')
            .update({ student_data: data as never, results: scored as never, completed: true })
            .eq('id', submissionId.current);
        } else {
          await supabase
            .from('intake_submissions')
            .insert({ user_id: user.id, student_data: data as never, results: scored as never, completed: true });
        }
        await supabase.from('profiles').update({ intake_completed: true }).eq('id', user.id);
      })();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#1A365D] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <img src={jdnLogo} alt="JD-Next" className="h-14" />
            <span className="text-base text-gray-300">Pre-Law Advisory Engine</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <IntakeProgressBar current={currentStep} total={totalSteps} labels={stepLabels} />
        
        <div className="min-h-[400px]">
          {steps[currentStep]}
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2 bg-[#1A365D] text-white hover:bg-[#1A365D]/90"
          >
            {currentStep === totalSteps - 1 ? 'Get My Results' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function IntakeWizard() {
  return (
    <IntakeProvider>
      <IntakeWizardInner />
    </IntakeProvider>
  );
}
