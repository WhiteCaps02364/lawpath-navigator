import { useState } from 'react';
import { IntakeProvider, useIntake } from '@/contexts/IntakeContext';
import { IntakeProgressBar } from '@/components/intake/IntakeProgressBar';
import { StepPersonalInfo } from '@/components/intake/StepPersonalInfo';
import { StepAcademics } from '@/components/intake/StepAcademics';
import { StepTesting } from '@/components/intake/StepTesting';
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
  const { data, currentStep, setCurrentStep, totalSteps } = useIntake();
  const [results, setResults] = useState<ScoringResult | null>(null);

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
      case 0: return data.firstName && data.lastName && data.schoolEmail && data.personalEmail && data.undergraduateInstitution;
      case 1: return data.cumulativeGPA > 0 && data.majors;
      case 2: return true;
      case 3: return data.whyLawSchool && data.practiceAreaInterest.length > 0;
      case 4: return true;
      case 5: return data.selectedSchools.length > 0;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep === totalSteps - 1) {
      const scored = calculateScores(data);
      setResults(scored);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#1A365D] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={jdnLogo} alt="JD-Next" className="h-14" />
            <span className="text-sm text-gray-300">Pre-Law Advisory Engine</span>
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
