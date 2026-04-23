import {
  StudentData, ScoringResult, ReadinessLevel, SchoolAssessment,
  SchoolClassification, GeographicAlignment, ListComposition, LawSchool, GeographicRegion,
} from '@/types/intake';
import { lawSchools } from '@/data/lawSchools';

const currentYear = new Date().getFullYear();

function hasGraduated(data: StudentData): boolean {
  return data.graduationYear < currentYear || data.currentYear === 'Alumni / Recent Graduate';
}

const STATE_TO_REGION: Record<string, string> = {
  // Northeast
  CT: 'Northeast', ME: 'Northeast', MA: 'Northeast', NH: 'Northeast',
  NJ: 'Northeast', NY: 'Northeast', PA: 'Northeast', RI: 'Northeast',
  VT: 'Northeast', DC: 'Northeast', MD: 'Northeast', DE: 'Northeast',
  // Southeast
  AL: 'Southeast', AR: 'Southeast', FL: 'Southeast', GA: 'Southeast',
  KY: 'Southeast', LA: 'Southeast', MS: 'Southeast', NC: 'Southeast',
  SC: 'Southeast', TN: 'Southeast', VA: 'Southeast', WV: 'Southeast',
  // Midwest
  IL: 'Midwest', IN: 'Midwest', IA: 'Midwest', KS: 'Midwest',
  MI: 'Midwest', MN: 'Midwest', MO: 'Midwest', NE: 'Midwest',
  ND: 'Midwest', OH: 'Midwest', SD: 'Midwest', WI: 'Midwest',
  // Texas
  TX: 'Texas',
  // California
  CA: 'California',
  // Southwest
  AZ: 'Southwest', CO: 'Southwest', NM: 'Southwest', NV: 'Southwest', UT: 'Southwest',
  // Pacific Northwest
  AK: 'Pacific Northwest', HI: 'Pacific Northwest', ID: 'Pacific Northwest',
  MT: 'Pacific Northwest', OR: 'Pacific Northwest', WA: 'Pacific Northwest',
  WY: 'Pacific Northwest',
};

function getRegionForState(state: string | undefined | null): string | null {
  if (!state) return null;
  const key = state.trim().toUpperCase();
  return STATE_TO_REGION[key] ?? null;
}

function getRegionForPreference(pref: GeographicRegion): string[] {
  const map: Record<string, string[]> = {
    'Northeast': ['Northeast'],
    'California': ['California'],
    'Texas': ['Texas'],
    'Midwest': ['Midwest'],
    'Southeast': ['Southeast'],
    'No preference': [],
  };
  return map[pref] || [];
}

function classifySchool(gpa: number, school: LawSchool): SchoolClassification {
  if (gpa < school.gpa25) return 'Reach';
  if (Math.abs(gpa - school.gpa50) <= 0.1) return 'Target';
  if (gpa > school.gpa75) return 'Safety';
  if (gpa >= school.gpa25 && gpa < school.gpa50 - 0.1) return 'Reach';
  return 'Target';
}

function getGeoAlignment(
  school: LawSchool,
  preference: GeographicRegion,
  strength: string,
  firstChoiceState?: string,
  secondChoiceState?: string,
  thirdChoiceState?: string
): { alignment: GeographicAlignment; note: string } {
  if (preference === 'No preference' || strength === 'Open to anywhere') {
    return { alignment: 'Aligned', note: `${school.name} places graduates primarily in ${school.primaryPlacementRegion}.` };
  }

  const firstRegion = getRegionForState(firstChoiceState);
  const secondRegion = getRegionForState(secondChoiceState);
  const thirdRegion = getRegionForState(thirdChoiceState);
  const placement = school.primaryPlacementRegion;

  if (firstRegion && firstRegion === placement) {
    return {
      alignment: 'Aligned',
      note: `${school.name} aligns well with your first-choice state (${firstChoiceState}) — most graduates practice in the ${placement} region.`,
    };
  }

  if ((secondRegion && secondRegion === placement) || (thirdRegion && thirdRegion === placement)) {
    const matchedState = secondRegion === placement ? secondChoiceState : thirdChoiceState;
    return {
      alignment: 'Partially Misaligned',
      note: `${school.name} primarily places graduates in ${placement}, which matches your secondary preference (${matchedState}) but not your first-choice state (${firstChoiceState}).`,
    };
  }

  const preferredRegions = getRegionForPreference(preference);
  if (preferredRegions.includes(placement)) {
    return { alignment: 'Aligned', note: `${school.name} aligns well with your ${preference} preference — most graduates practice in this region.` };
  }

  if (strength === 'Very strong') {
    return {
      alignment: 'Misaligned',
      note: `${school.name} primarily places graduates in ${placement}, which does not align with your strong preference for ${preference}. Regional law schools often have concentrated local placement networks.`,
    };
  }

  return {
    alignment: 'Partially Misaligned',
    note: `${school.name} primarily places in ${placement}. Since your ${preference} preference is flexible, this may still work depending on your networking strategy.`,
  };
}

function getReadiness(data: StudentData): { level: ReadinessLevel; explanation: string } {
  const graduated = hasGraduated(data);
  let base: ReadinessLevel;
  if (data.cumulativeGPA >= 3.7) base = 'High';
  else if (data.cumulativeGPA >= 3.3) base = 'Developing';
  else base = 'Needs Preparation';

  const levels: ReadinessLevel[] = ['Needs Preparation', 'Developing', 'High'];
  let idx = levels.indexOf(base);

  // Downgrade conditions
  const noTestApplyingSoon = data.testStatus === 'None' &&
    (data.plannedTestTiming === 'Within 3 months' || data.plannedTestTiming === '6 months');
  const multipleRiskFlags = data.riskFlags.filter(f => f !== 'None').length >= 2;
  const vagueMotivation = data.whyLawSchool.length < 30;

  if (noTestApplyingSoon || multipleRiskFlags || vagueMotivation) {
    idx = Math.max(0, idx - 1);
  }

  // Upgrade conditions
  const strongLSAT = data.lsatScore && data.lsatScore >= 165;
  const strongJDNext = data.jdNextScore && data.jdNextScore >= 300;
  const strongGradDegree = data.hasGraduateDegree && data.graduateGPA && data.graduateGPA >= 3.5;
  const clearMotivation = data.whyLawSchool.length >= 100 && data.practiceAreaInterest.length > 0 && !data.practiceAreaInterest.includes('Unsure');

  if (strongLSAT || strongJDNext || strongGradDegree || clearMotivation) {
    idx = Math.min(2, idx + 1);
  }

  const level = levels[idx];
  const explanations: Record<ReadinessLevel, string> = {
    'High': `With a ${data.cumulativeGPA.toFixed(2)} GPA${strongLSAT ? ` and a ${data.lsatScore} LSAT` : ''}, you are competitively positioned for your target schools.`,
    'Developing': graduated
      ? 'Your academic record is already established. Focus on test preparation, relevant work experience, and strong recommender strategy to strengthen your application significantly.'
      : `Your ${data.cumulativeGPA.toFixed(2)} GPA shows a solid academic foundation. Strategic preparation can strengthen your application significantly.`,
    'Needs Preparation': graduated
      ? 'Your academic record is already established, so test preparation and relevant legal work experience are the primary levers available to improve your outcomes.'
      : 'Your current academic profile suggests additional preparation will improve your outcomes. This is a starting point, not a ceiling.',
  };

  return { level, explanation: explanations[level] };
}

function getStrategy(data: StudentData, readiness: ReadinessLevel): { recommendation: string; explanation: string } {
  const needsPrep = readiness === 'Needs Preparation';
  const vagueMotivation = data.whyLawSchool.length < 30;
  const unsurePractice = data.practiceAreaInterest.includes('Unsure');
  const longTimeline = data.plannedTestTiming === '12+ months' && data.testStatus === 'None';

  if (needsPrep || (vagueMotivation && unsurePractice) || longTimeline) {
    const areas = data.practiceAreaInterest.filter(a => a !== 'Unsure');
    if (areas.includes('Litigation')) {
      return {
        recommendation: 'Consider Legal Employment Before Applying',
        explanation: 'Given your interest in litigation, working as a paralegal at a litigation firm or in a court clerk position would strengthen both your application and your conviction. Applicants with direct legal experience consistently produce stronger personal statements and more informed school selections.',
      };
    }
    if (areas.includes('Corporate')) {
      return {
        recommendation: 'Consider Legal Employment Before Applying',
        explanation: 'Your interest in corporate law pairs well with a pre-law business paralegal role or BigLaw early-talent program. This experience builds both credentials and clarity.',
      };
    }
    if (areas.includes('Public Interest') || areas.includes('Criminal')) {
      return {
        recommendation: 'Consider Legal Employment Before Applying',
        explanation: 'Public interest and criminal law benefit enormously from frontline experience. Legal aid organizations, government agencies, and nonprofit legal teams actively seek pre-law candidates.',
      };
    }
    return {
      recommendation: 'Gain Clarity Before Committing',
      explanation: 'Before investing in test prep and applications, consider informational interviews with practicing attorneys and general legal assistant roles. This will sharpen your motivation and help you choose the right schools.',
    };
  }

  if (data.testStatus === 'None' && data.testComfortLevel === 'Prefer to avoid') {
    return {
      recommendation: 'Explore JD-Next as Your Testing Path',
      explanation: 'Based on your preference to avoid traditional standardized testing, JD-Next may be an excellent alternative. Several of your target schools accept JD-Next as a standalone substitute for the LSAT.',
    };
  }

  if (readiness === 'High') {
    return {
      recommendation: 'Proceed with Confidence',
      explanation: 'Your academic profile and preparation level position you well. Focus on refining your school list, securing strong recommenders, and crafting a compelling personal statement.',
    };
  }

  return {
    recommendation: 'Strengthen and Apply',
    explanation: 'You have a solid foundation. Focus on test preparation, building your recommender relationships, and developing a personal statement that clearly articulates your motivation for law school.',
  };
}

function getTimeline(data: StudentData): { recommendation: string; rationale: string } {
  const yearsUntilStart = (data.intendedStartYear ?? currentYear + 2) - currentYear;
  const graduated = hasGraduated(data);

  if (yearsUntilStart >= 2) {
    return {
      recommendation: 'You have time — use it strategically',
      rationale: graduated
        ? `With ${yearsUntilStart} years until your intended start, focus on gaining relevant legal work experience, building strong professional recommender relationships, and preparing thoroughly for your admissions test.`
        : `With ${yearsUntilStart} years until your intended start, focus on raising your GPA, gaining relevant experience, and preparing thoroughly for your admissions test.`,
    };
  }

  return {
    recommendation: 'Begin preparation now',
    rationale: graduated
      ? 'Plan to take your admissions test at least 6–9 months before your application deadline. Focus on building your strongest possible application — test preparation and recommender strategy should be your immediate priorities.'
      : 'Focus on finishing strong academically, securing strong recommenders, and beginning your admissions test preparation. Early applicants statistically receive more favorable scholarship offers.',
  };
}

function getRecommenderGuidance(data: StudentData): {
  guidance: string;
  studentType: 'current' | 'recent' | 'non-traditional';
  hasAcademic: boolean;
} {
  const hasAcademic = data.recommenders.some(r => r.relationship === 'Professor');
  const yearsSinceGrad = currentYear - data.graduationYear;
  let studentType: 'current' | 'recent' | 'non-traditional';

  if (data.graduationYear >= currentYear) {
    studentType = 'current';
  } else if (yearsSinceGrad <= 2) {
    studentType = 'recent';
  } else {
    studentType = 'non-traditional';
  }

  const guidanceMap = {
    current: `You are currently enrolled — this is the best time to secure strong academic letters. Approach professors from rigorous courses where you contributed actively. Ask whether they can write you a **strong** letter (the word matters). Request they file a contemporaneous letter with your registrar now — it will remain credible even if you apply years later.`,
    recent: `As a recent graduate, academic recommenders remain your priority. Contact professors from your strongest courses before too much time passes. Employer recommenders can supplement but should not replace academic letters at this stage.`,
    'non-traditional': `Having been out of school for several years, your strongest recommenders are likely employers, supervisors, or mentors who can speak to your intellectual curiosity, analytical thinking, and work ethic with specific examples. If you have a former professor who remembers you well, they remain valuable — reach out.`,
  };

  let guidance = guidanceMap[studentType];
  if (!hasAcademic) {
    guidance += '\n\n⚠️ **You have not listed a professor as a recommender.** Most law schools expect at least one strong academic letter. This should be a priority discussion with your advisor.';
  }

  return { guidance, studentType, hasAcademic };
}

export function calculateScores(data: StudentData): ScoringResult {
  const { level: readinessLevel, explanation: readinessExplanation } = getReadiness(data);
  const { recommendation: strategyRecommendation, explanation: strategyExplanation } = getStrategy(data, readinessLevel);
  const { recommendation: timelineRecommendation, rationale: timelineRationale } = getTimeline(data);
  const { guidance: recommenderGuidance, studentType: recommenderStudentType, hasAcademic: hasAcademicRecommender } = getRecommenderGuidance(data);

  // School assessments
  const selectedSchoolObjects = data.selectedSchools
    .map(id => lawSchools.find(s => s.id === id))
    .filter((s): s is LawSchool => !!s);

  const schoolAssessments: SchoolAssessment[] = selectedSchoolObjects.map(school => {
    const classification = classifySchool(data.cumulativeGPA, school);
    const { alignment, note } = getGeoAlignment(
      school,
      data.geographicPreference,
      data.geographicStrength,
      data.firstChoiceState,
      data.secondChoiceState,
      data.thirdChoiceState,
    );
    return { school, classification, geoAlignment: alignment, geoNote: note };
  });

  // List composition
  const reachCount = schoolAssessments.filter(a => a.classification === 'Reach').length;
  const safetyCount = schoolAssessments.filter(a => a.classification === 'Safety').length;
  const total = schoolAssessments.length || 1;

  let listComposition: ListComposition = 'Healthy';
  let listCompositionNote = 'Your school list has a balanced mix of reach, target, and safety schools. This is a healthy strategy.';

  if (reachCount / total >= 0.7) {
    listComposition = 'Overreaching';
    listCompositionNote = 'Your current list is weighted toward reach schools based on your academic profile. This does not eliminate admission, but suggests a more balanced strategy may improve your overall odds.';
  } else if (safetyCount / total >= 0.5) {
    listComposition = 'Underreaching';
    listCompositionNote = 'Your school list is weighted toward safety schools. You may want to consider adding some more competitive options where your profile could still be competitive.';
  }

  // JD-Next vs LSAT
  const jdNextSchools = selectedSchoolObjects.filter(s => s.acceptsJDNext).map(s => s.name);
  const lsatRequiredSchools = selectedSchoolObjects.filter(s => !s.acceptsJDNext).map(s => s.name);

  let testRecommendation = '';
  if (jdNextSchools.length > 0 && lsatRequiredSchools.length > 0) {
    testRecommendation = `Your school list includes both JD-Next-accepting schools (${jdNextSchools.length}) and LSAT-required schools (${lsatRequiredSchools.length}). If you pursue JD-Next only, you can apply to ${jdNextSchools.join(', ')}. To keep all options open, the LSAT covers every school on your list.`;
  } else if (jdNextSchools.length > 0 && lsatRequiredSchools.length === 0) {
    testRecommendation = 'All of your selected schools accept JD-Next as a standalone alternative to the LSAT. This gives you flexibility in choosing your testing path.';
  } else {
    testRecommendation = 'All of your selected schools require the LSAT (or GRE). Plan your test preparation accordingly.';
  }

  // Career path note (conditional)
  let careerPathNote: string | undefined;
  if (readinessLevel === 'Needs Preparation' || data.whyLawSchool.length < 30 ||
    (data.plannedTestTiming === '12+ months' && data.testStatus === 'None')) {
    const area = data.practiceAreaInterest.find(a => a !== 'Unsure') || 'general';
    const pathMap: Record<string, string> = {
      'Litigation': 'Consider paralegal roles at litigation firms or court clerk positions to build direct courtroom exposure.',
      'Corporate': 'Business paralegal roles and BigLaw early-talent programs are excellent entry points for corporate law aspirants.',
      'Public Interest': 'Legal aid organizations, government agencies, and nonprofit legal teams actively seek pre-law candidates.',
      'Criminal': 'District attorney offices, public defender offices, and criminal defense firms often hire pre-law assistants.',
      'IP': 'Patent firms and tech company legal departments value candidates with technical backgrounds.',
      'general': 'Informational interviews with practicing attorneys and general legal assistant roles can help clarify your path.',
    };
    careerPathNote = pathMap[area] || pathMap['general'];
  }

  // Action plan
  const actionPlan: string[] = [];
  if (data.testStatus === 'None') {
    actionPlan.push('Register for an admissions test (LSAT or JD-Next) within the next 3 months.');
  }
  if (!hasAcademicRecommender) {
    actionPlan.push('Identify and approach a professor who can write a strong academic recommendation letter.');
  }
  if (data.riskFlags.some(f => f !== 'None')) {
    actionPlan.push('Prepare an addendum addressing your academic history — frame it as growth, not excuse.');
  }
  actionPlan.push('Review your school list with your advisor and discuss reach/target/safety balance.');
  if (data.personalStatementThemes.length < 20) {
    actionPlan.push('Begin drafting your personal statement — start with the specific experience that drives your interest in law.');
  }
  actionPlan.push('Schedule a meeting with your pre-law advisor to review these results together.');

  return {
    readinessLevel, readinessExplanation,
    strategyRecommendation, strategyExplanation,
    timelineRecommendation, timelineRationale,
    schoolAssessments, listComposition, listCompositionNote,
    actionPlan, recommenderGuidance, recommenderStudentType, hasAcademicRecommender,
    careerPathNote, testRecommendation, jdNextSchools, lsatRequiredSchools,
  };
}
