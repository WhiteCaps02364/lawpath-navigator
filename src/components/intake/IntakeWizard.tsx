import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { StepReview } from '@/components/intake/StepReview';
import { ResultsView } from '@/components/results/ResultsView';
import { calculateScores } from '@/lib/scoringEngine';
import { ScoringResult } from '@/types/intake';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import jdnLogoAsset from '@/assets/jdnext-logo.png.asset.json';
const jdnLogo = jdnLogoAsset.url;

const stepLabels = [
  'Personal Information',
  'Academic Profile',
  'Testing',
  'Goals & Preferences',
  'Application Strength',
  'School Selection',
  'Review',
];
const REVIEW_STEP = 6;

function IntakeWizardInner() {
  const { data, setData, currentStep, setCurrentStep, totalSteps } = useIntake();
  const { user } = useAuth();
  const [params] = useSearchParams();
  const advisorIdParam = params.get('advisor');
  const institutionParam = params.get('institution');
  const isDemo = params.get('demo') === '1';
  const [results, setResults] = useState<ScoringResult | null>(null);
  const [scoringError, setScoringError] = useState<string | null>(null);
  const submissionId = useRef<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [appliedAdvisor, setAppliedAdvisor] = useState(false);
  const [maxReached, setMaxReached] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMaxReached(m => Math.max(m, currentStep));
    setShowErrors(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Apply institution / demo prefill once on mount
  useEffect(() => {
    if (appliedAdvisor) return;
    if (isDemo) {
      setData({
        ...data,
        firstName: 'Alex', lastName: 'Johnson',
        personalEmail: 'alex.johnson@example.com',
        undergraduateInstitution: 'Duke University',
        cumulativeGPA: 3.6, majorGPA: 3.7, majors: 'Political Science',
        currentYear: 'Junior',
        testStatus: 'None',
        practiceAreaInterest: ['Litigation'],
        intendedStartYear: 2027,
        firstChoiceState: 'NY',
        whyLawSchool: 'I want to use legal training to advocate in the courtroom and work on cases that have meaningful real-world impact.',
        selectedSchools: ['nyu','georgetown','duke','unc','wake-forest'],
      } as typeof data);
    } else if (institutionParam) {
      setData({ ...data, undergraduateInstitution: institutionParam } as typeof data);
    }
    setAppliedAdvisor(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (!user || !hydrated || isDemo) return;
    const t = setTimeout(async () => {
      if (submissionId.current) {
        await supabase.from('intake_submissions').update({ student_data: data as never, advisor_id: advisorIdParam || undefined } as never).eq('id', submissionId.current);
      } else {
        const { data: ins } = await supabase
          .from('intake_submissions')
          .insert({ user_id: user.id, student_data: data as never, completed: false, advisor_id: advisorIdParam || undefined } as never)
          .select('id')
          .single();
        if (ins) submissionId.current = ins.id;
      }
    }, 800);
    return () => clearTimeout(t);
  }, [data, user, hydrated, isDemo, advisorIdParam]);

  if (results && !submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-lg w-full border rounded-xl bg-card p-8 text-center shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-serif text-foreground mb-2">Your intake form has been submitted</h1>
          <p className="text-sm text-muted-foreground mb-6">Thank you, {data.firstName || 'there'}. Here’s what happens next:</p>
          <ol className="text-left text-sm space-y-3 mb-8 list-decimal pl-5 text-foreground">
            {advisorIdParam && <li>Your advisor will receive your profile on their dashboard.</li>}
            <li>Review your personalized advising report, based on ABA-reported data.</li>
            <li>Download it as a PDF to keep for your records.</li>
            <li>Schedule a meeting with your pre-law advisor to review your results together.</li>
          </ol>
          <Button onClick={() => setSubmitted(true)} className="gap-2">
            View My Report <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <ResultsView
        results={results}
        studentData={data}
        onStartOver={() => {
          setResults(null);
          setSubmitted(false);
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
    <StepReview key={6} onEdit={(step) => setCurrentStep(step)} />,
  ];

  const missingFor = (step: number): string[] => {
    const m: string[] = [];
    switch (step) {
      case 0: {
        const isCurrentOrFuture = data.graduationYear >= new Date().getFullYear();
        if (!data.firstName) m.push('First name');
        if (!data.lastName) m.push('Last name');
        if (isCurrentOrFuture && !data.schoolEmail) m.push('School email');
        if (!data.personalEmail) m.push('Personal email');
        if (!data.undergraduateInstitution) m.push('Undergraduate institution');
        if (!data.applicationTimingIntent) m.push('Application timing');
        break;
      }
      case 1:
        if (!(data.cumulativeGPA > 0)) m.push('Cumulative GPA');
        if (!data.majors) m.push('Major(s)');
        break;
      case 2:
        if (data.testStatus === 'Taken' && (isFutureDateValue(data.lsatDate) || isFutureDateValue(data.greDate) || isFutureDateValue(data.jdNextDate)))
          m.push('Test dates cannot be in the future');
        break;
      case 3: {
        const sel = [data.firstChoiceState, data.secondChoiceState, data.thirdChoiceState].filter(s => s && s !== '' && s !== 'No preference');
        if (!data.whyLawSchool || data.whyLawSchool.length < 50) m.push('Why law school (at least 50 characters)');
        if (data.practiceAreaInterest.length === 0) m.push('Practice area interest');
        if (!data.firstChoiceState) m.push('First-choice state');
        if (new Set(sel).size !== sel.length) m.push('State choices must be different');
        break;
      }
      case 5:
        if (data.selectedSchools.length === 0) m.push('Select at least one school');
        break;
    }
    return m;
  };
  const missing = missingFor(currentStep);

  const handleNext = () => {
    if (currentStep < REVIEW_STEP && missing.length) {
      setShowErrors(true);
      return;
    }
    if (currentStep === REVIEW_STEP) {
      const firstBad = [0, 1, 2, 3, 4, 5].find(i => missingFor(i).length > 0);
      if (firstBad !== undefined) { setCurrentStep(firstBad); return; }
      let scored: ScoringResult;
      try {
        scored = calculateScores(data);
      } catch (err) {
        setScoringError("We couldn't generate your report — please go back and make sure your GPA is entered correctly.");
        return;
      }
      setScoringError(null);
      setResults(scored);
      // Persist completion
      if (isDemo) return;
      (async () => {
        if (!user) return;
        if (submissionId.current) {
          await supabase
            .from('intake_submissions')
            .update({ student_data: data as never, results: scored as never, completed: true, advisor_id: advisorIdParam || undefined } as never)
            .eq('id', submissionId.current);
        } else {
          await supabase
            .from('intake_submissions')
            .insert({ user_id: user.id, student_data: data as never, results: scored as never, completed: true, advisor_id: advisorIdParam || undefined } as never);
        }
        await supabase.from('profiles').update({ intake_completed: true }).eq('id', user.id);
      })();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {isDemo && (
        <div className="px-4 py-3 text-sm flex items-center justify-between" style={{ background: '#F8E9C2', color: '#5C4A1A' }}>
          <span>You are previewing the student experience. This is what your advisees will see.</span>
          <button onClick={() => window.close()} className="bg-[#026062] text-white px-3 py-1.5 rounded text-xs font-medium">Exit Preview</button>
        </div>
      )}
      {/* Header */}
      <header className="bg-[#026062] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <img src={jdnLogo} alt="JD-Next" className="h-14" />
            <span className="text-base text-gray-300">Pre-Law Advising Intake Form</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <IntakeProgressBar current={currentStep} total={stepLabels.length} labels={stepLabels} maxReached={maxReached} onStepClick={(i) => setCurrentStep(i)} />
        
        <div className="min-h-[400px]">
          {steps[currentStep]}
        </div>

        {showErrors && missing.length > 0 && (
          <div role="alert" className="mt-4 p-4 border border-destructive/40 bg-destructive/10 text-destructive rounded text-sm">
            <p className="font-medium mb-1">Please complete the following before continuing:</p>
            <ul className="list-disc pl-5">{missing.map(x => <li key={x}>{x}</li>)}</ul>
          </div>
        )}

        {scoringError && (
          <div className="mt-4 p-4 border border-destructive/40 bg-destructive/10 text-destructive rounded text-sm">
            {scoringError}
          </div>
        )}

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
            className="gap-2 bg-[#026062] text-white hover:bg-[#026062]/90"
          >
            {currentStep === REVIEW_STEP ? 'Submit' : 'Continue'}
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
