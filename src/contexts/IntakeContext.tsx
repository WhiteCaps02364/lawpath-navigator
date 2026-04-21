import { useState, createContext, useContext, ReactNode } from 'react';
import { StudentData, PracticeArea, GeographicRegion, RiskFlag, Recommender } from '@/types/intake';

const defaultRecommender: Recommender = {
  name: '', relationship: 'Professor', context: '', strength: 'Unsure',
};

const defaultStudent: StudentData = {
  firstName: '', lastName: '', schoolEmail: '', personalEmail: '',
  undergraduateInstitution: '', graduationYear: new Date().getFullYear() + 1,
  optInLawSchools: false, optInBigLaw: false, optInParalegal: false, optInPublicInterest: false,
  cumulativeGPA: 0, majorGPA: 0, majors: '', minors: '',
  currentYear: 'Junior', hasGraduateDegree: false,
  testStatus: 'None', testComfortLevel: 'Neutral',
  whyLawSchool: '', practiceAreaInterest: [], geographicPreference: 'No preference',
  geographicStrength: 'Open to anywhere',
  firstChoiceState: 'No preference', secondChoiceState: '', thirdChoiceState: '',
  intendedStartYear: null,
  applicationTimingIntent: 'Not sure',
  recommenders: [{ ...defaultRecommender }, { ...defaultRecommender }, { ...defaultRecommender }],
  relevantExperiences: '', personalStatementThemes: '', riskFlags: [],
  addendumNeeded: 'No', selectedSchools: [],
};

interface IntakeContextType {
  data: StudentData;
  updateData: (partial: Partial<StudentData>) => void;
  setData: (data: StudentData) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
}

const IntakeContext = createContext<IntakeContextType | null>(null);

export function IntakeProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StudentData>(defaultStudent);
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 6;

  const updateData = (partial: Partial<StudentData>) => {
    setData(prev => ({ ...prev, ...partial }));
  };

  return (
    <IntakeContext.Provider value={{ data, updateData, setData, currentStep, setCurrentStep, totalSteps }}>
      {children}
    </IntakeContext.Provider>
  );
}

export function useIntake() {
  const ctx = useContext(IntakeContext);
  if (!ctx) throw new Error('useIntake must be used within IntakeProvider');
  return ctx;
}
