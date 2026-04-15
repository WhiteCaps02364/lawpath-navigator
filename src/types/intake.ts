// Types for the Pre-Law Advisory Engine

export interface StudentData {
  // Personal Info
  firstName: string;
  lastName: string;
  schoolEmail: string;
  personalEmail: string;
  undergraduateInstitution: string;
  graduationYear: number;
  optInLawSchools: boolean;
  optInBigLaw: boolean;
  optInParalegal: boolean;
  optInPublicInterest: boolean;

  // Academic
  cumulativeGPA: number;
  majorGPA: number;
  majors: string;
  minors: string;
  currentYear: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate' | 'Other';
  hasGraduateDegree: boolean;
  graduateInstitution?: string;
  graduateDegreeType?: 'MA' | 'MS' | 'MBA' | 'PhD' | 'Other';
  graduateField?: string;
  graduateGPA?: number;
  graduateGradYear?: number;

  // Testing
  lsatScore?: number;
  lsatDate?: string;
  greScore?: number;
  greDate?: string;
  jdNextScore?: number;
  jdNextDate?: string;
  testStatus: 'Taken' | 'Planned' | 'None';
  plannedTestTiming?: 'Within 3 months' | '6 months' | '12+ months' | 'Unsure';
  testComfortLevel: 'Confident' | 'Neutral' | 'Prefer to avoid';

  // Preferences & Motivation
  whyLawSchool: string;
  practiceAreaInterest: PracticeArea[];
  geographicPreference: GeographicRegion;
  geographicStrength: 'Very strong' | 'Preferred but flexible' | 'Open to anywhere';
  intendedStartYear: number;
  applicationTimingIntent: 'This cycle' | 'Next cycle' | 'Not sure';

  // Application Strength
  recommenders: Recommender[];
  relevantExperiences: string;
  personalStatementThemes: string;
  riskFlags: RiskFlag[];
  addendumNeeded: 'Yes' | 'No' | 'Unsure';
  addendumText?: string;

  // School Selection
  selectedSchools: string[]; // school IDs
}

export type PracticeArea = 'Litigation' | 'Corporate' | 'Public Interest' | 'Criminal' | 'IP' | 'Unsure';
export type GeographicRegion = 'Northeast' | 'California' | 'Texas' | 'Midwest' | 'Southeast' | 'No preference';
export type RiskFlag = 'Low early GPA' | 'GPA improvement' | 'Major change' | 'Academic probation' | 'None';

export interface Recommender {
  name: string;
  relationship: 'Professor' | 'Employer' | 'Supervisor' | 'Mentor' | 'Other';
  context: string;
  strength: 'Very strong' | 'Average' | 'Unsure';
}

export interface LawSchool {
  id: string;
  name: string;
  gpa25: number;
  gpa50: number;
  gpa75: number;
  lsat25: number;
  lsat50: number;
  lsat75: number;
  employmentRateTotal: number;
  employmentRateFTJD: number;
  primaryPlacementRegion: string;
  regionalPortability: 'National' | 'Regional' | 'Primarily Local';
  acceptsJDNext: boolean;
}

export type ReadinessLevel = 'High' | 'Developing' | 'Needs Preparation';

export type SchoolClassification = 'Reach' | 'Target' | 'Safety';
export type ListComposition = 'Overreaching' | 'Healthy' | 'Underreaching';
export type GeographicAlignment = 'Aligned' | 'Partially Misaligned' | 'Misaligned';

export interface SchoolAssessment {
  school: LawSchool;
  classification: SchoolClassification;
  geoAlignment: GeographicAlignment;
  geoNote: string;
}

export interface ScoringResult {
  readinessLevel: ReadinessLevel;
  readinessExplanation: string;
  strategyRecommendation: string;
  strategyExplanation: string;
  timelineRecommendation: string;
  timelineRationale: string;
  schoolAssessments: SchoolAssessment[];
  listComposition: ListComposition;
  listCompositionNote: string;
  actionPlan: string[];
  recommenderGuidance: string;
  recommenderStudentType: 'current' | 'recent' | 'non-traditional';
  hasAcademicRecommender: boolean;
  careerPathNote?: string;
  testRecommendation: string;
  jdNextSchools: string[];
  lsatRequiredSchools: string[];
}
