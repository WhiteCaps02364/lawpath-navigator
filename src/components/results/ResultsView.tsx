import { ScoringResult, SchoolAssessment, StudentData, PracticeArea } from '@/types/intake';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, MapPin, ExternalLink, BookOpen, Target, Shield, TrendingUp, Share2, Download } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import jdnLogo from '@/assets/jdn-logo.png';
import { ShareWithAdvisor } from '@/components/results/ShareWithAdvisor';
import { supabase } from '@/integrations/supabase/client';

const NAVY = '#1A365D';
const GOLD = '#C9A84C';

interface ResultsViewProps {
  results: ScoringResult;
  studentData: StudentData;
  onStartOver: () => void;
}

const JD_NEXT_URL = 'https://jdnext.org';
const LSAT_URL = 'https://www.lsac.org/lsat/lsat-dates-deadlines-score-release-dates';
const ABA_DISCLOSURES_URL = 'https://www.abarequireddisclosures.org/requiredDisclosure';
const ABA_EMPLOYMENT_URL = 'https://www.abarequireddisclosures.org/employmentOutcomes';

function TestRegistrationLinks() {
  return (
    <div className="flex flex-col gap-1 mt-3">
      <a
        href={JD_NEXT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-sm font-medium hover:opacity-80"
        style={{ color: GOLD }}
      >
        Register for JD-Next →
      </a>
      <a
        href={LSAT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-sm font-medium hover:opacity-80"
        style={{ color: GOLD }}
      >
        Register for the LSAT →
      </a>
    </div>
  );
}

function ReadinessIndicator({ level }: { level: string }) {
  if (level === 'High') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: GOLD }}>
        <CheckCircle className="w-5 h-5 text-white" />
        <span className="font-semibold text-white">{level}</span>
      </div>
    );
  }
  const config = {
    'High': { color: 'text-success', bg: 'bg-success/10', icon: CheckCircle },
    'Developing': { color: 'text-gold', bg: 'bg-gold/10', icon: TrendingUp },
    'Needs Preparation': { color: 'text-destructive', bg: 'bg-destructive/10', icon: AlertTriangle },
  }[level] || { color: 'text-muted-foreground', bg: 'bg-muted', icon: Target };

  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bg}`}>
      <Icon className={`w-5 h-5 ${config.color}`} />
      <span className={`font-semibold ${config.color}`}>{level}</span>
    </div>
  );
}

function SchoolCard({ assessment }: { assessment: SchoolAssessment }) {
  const { school, classification, geoNote } = assessment;
  const tagClass = classification === 'Reach' ? 'tag-reach' : classification === 'Target' ? 'tag-target' : 'tag-safety';

  const safetyOverride = classification === 'Safety'
    ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground'
    : tagClass;

  return (
    <div className="school-card">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="font-heading text-lg text-foreground">{school.name}</h4>
        <div className="flex gap-1.5 flex-shrink-0">
          <span className={safetyOverride}>{classification}</span>
          {school.acceptsJDNext ? (
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ background: GOLD }}
            >
              JD-Next ✓
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">LSAT Required</span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">GPA Median</p>
          <p className="font-semibold text-foreground">{school.gpa50}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Employment</p>
          <p className="font-semibold text-foreground">{school.employmentRateTotal}%</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Portability</p>
          <p className="font-semibold text-foreground">{school.regionalPortability}</p>
        </div>
      </div>
      <div className="flex items-start gap-1.5 text-xs text-muted-foreground mb-2">
        <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <span>{geoNote}</span>
      </div>
      <div className="space-y-1.5 text-xs">
        <div>
          <a
            href={ABA_DISCLOSURES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#1A365D] underline hover:opacity-80 font-medium"
          >
            <ExternalLink className="w-3 h-3" /> ABA Disclosures
          </a>
          <p className="text-muted-foreground text-[11px] mt-0.5 ml-4">Search for {school.name} once the page loads</p>
        </div>
        <div>
          <a
            href={ABA_EMPLOYMENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#1A365D] underline hover:opacity-80 font-medium"
          >
            <ExternalLink className="w-3 h-3" /> Employment Data
          </a>
          <p className="text-muted-foreground text-[11px] mt-0.5 ml-4">Search for {school.name} once the page loads</p>
        </div>
      </div>
    </div>
  );
}

// Map practice areas to relevant subject areas for recommender suggestions
const practiceAreaSubjects: Record<PracticeArea, string> = {
  'Litigation': 'political science, philosophy, rhetoric, or constitutional law courses',
  'Corporate': 'business, economics, finance, or accounting courses',
  'Public Interest': 'sociology, public policy, social work, or human rights courses',
  'Criminal': 'criminal justice, sociology, psychology, or constitutional law courses',
  'IP': 'STEM, engineering, computer science, or intellectual property courses',
  'Unsure': 'humanities, social sciences, or writing-intensive courses',
};

function formatList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function LsatAnalysisSection({ lsat, schools }: { lsat: number; schools: { id: string; name: string; lsat25: number; lsat50: number; lsat75: number }[] }) {
  if (schools.length === 0) return null;
  const total = schools.length;
  const aboveP75 = schools.filter(s => lsat >= s.lsat75).length;
  const inRange = schools.filter(s => lsat >= s.lsat25 && lsat < s.lsat75).length;
  const belowP25 = schools.filter(s => lsat < s.lsat25).length;

  let badgeLabel = '';
  let badgeStyle: React.CSSProperties = {};
  let overallMsg = '';
  if (aboveP75 > total / 2) {
    badgeLabel = 'Strong Score';
    badgeStyle = { background: '#16A34A', color: '#fff' };
    overallMsg = `Your LSAT score of ${lsat} is at or above the 75th percentile for most of your selected schools. Nice work — this is a meaningful asset in your application.`;
  } else if (belowP25 > total / 2) {
    badgeLabel = 'Score Gap Identified';
    badgeStyle = { background: '#DC2626', color: '#fff' };
    overallMsg = `Your LSAT score of ${lsat} falls below the typical admitted range for most of your selected schools. A retake is strongly recommended before applying to these programs.`;
  } else {
    badgeLabel = 'Competitive Score';
    badgeStyle = { background: GOLD, color: '#fff' };
    overallMsg = `Your LSAT score of ${lsat} is within the competitive range for several of your selected schools, though some of your targets may be a stretch. Consider whether a retake could strengthen your position.`;
  }

  const showCallout = schools.some(s => lsat < s.lsat25 || (lsat >= s.lsat25 && lsat < s.lsat75 && Math.abs(lsat - s.lsat50) <= 3));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.28 }}
      className="border rounded-xl p-6 bg-card space-y-4"
    >
      <h3 className="text-xl font-heading font-bold" style={{ color: NAVY }}>Your LSAT Score Analysis</h3>

      <div className="flex items-start gap-3 flex-wrap">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" style={badgeStyle}>
          {badgeLabel}
        </span>
        <p className="text-sm text-muted-foreground flex-1 min-w-[240px]">{overallMsg}</p>
      </div>

      <div className="space-y-3 pt-2">
        {schools.map(s => {
          let posLabel = '';
          let posStyle: React.CSSProperties = {};
          let rec = '';
          let showLinks = false;
          if (lsat >= s.lsat75) {
            posLabel = 'Above Median';
            posStyle = { background: '#DCFCE7', color: '#15803D' };
            rec = `Your LSAT is a strong asset for ${s.name}.`;
          } else if (lsat >= s.lsat50) {
            posLabel = 'Above Median';
            posStyle = { background: '#DCFCE7', color: '#15803D' };
            rec = `Your LSAT is competitive for ${s.name}. A strong application package can compensate for any gap.`;
          } else if (lsat >= s.lsat25) {
            posLabel = 'Near Median';
            posStyle = { background: '#FEF3C7', color: '#92400E' };
            rec = `Your LSAT is slightly below median for ${s.name}. Consider whether a retake or a JD-Next addendum could strengthen your file.`;
            showLinks = true;
          } else {
            posLabel = 'Below 25th';
            posStyle = { background: '#FEE2E2', color: '#B91C1C' };
            rec = `Your LSAT score falls below the typical range for ${s.name}. A retake is recommended. In the meantime, a strong JD-Next score submitted as an addendum could demonstrate readiness and partially offset the gap.`;
            showLinks = true;
          }
          return (
            <div key={s.id} className="border rounded-lg p-3 space-y-1.5">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <span className="font-semibold text-sm text-foreground">{s.name}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium" style={posStyle}>{posLabel}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Your score: {lsat} <span className="text-muted-foreground/60">|</span> 25th: {s.lsat25} <span className="text-muted-foreground/60">|</span> 50th: {s.lsat50} <span className="text-muted-foreground/60">|</span> 75th: {s.lsat75}
              </p>
              <p className="text-xs text-foreground">{rec}</p>
              {showLinks && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
                  <a href={LSAT_URL} target="_blank" rel="noopener noreferrer" className="underline text-xs font-medium hover:opacity-80" style={{ color: GOLD }}>
                    Register for the LSAT →
                  </a>
                  <a href={JD_NEXT_URL} target="_blank" rel="noopener noreferrer" className="underline text-xs font-medium hover:opacity-80" style={{ color: GOLD }}>
                    Learn about JD-Next →
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showCallout && (
        <div className="rounded-lg p-4 bg-gold-muted/40 space-y-2" style={{ borderLeft: `4px solid ${GOLD}` }}>
          <p className="text-sm text-foreground">
            Regardless of your LSAT outcome, submitting a strong JD-Next score as an application addendum is a proven way to demonstrate law school readiness beyond a single test score. Several of your selected schools accept JD-Next as a standalone alternative — for others, it serves as powerful supporting evidence.
          </p>
          <div className="flex flex-col gap-0.5">
            <a href={JD_NEXT_URL} target="_blank" rel="noopener noreferrer" className="underline text-sm font-medium hover:opacity-80" style={{ color: GOLD }}>
              Register for JD-Next →
            </a>
            <a href={LSAT_URL} target="_blank" rel="noopener noreferrer" className="underline text-sm font-medium hover:opacity-80" style={{ color: GOLD }}>
              Register for the LSAT →
            </a>
          </div>
        </div>
      )}
    </motion.div>
  );
}

const practiceAreaLegalWork: Record<PracticeArea, string> = {
  'Litigation': 'Given your interest in litigation, consider paralegal roles at litigation firms, public defender offices, or court clerk positions. These roles will expose you directly to the kind of work you want to do.',
  'Corporate': 'Given your interest in corporate law, structured paralegal programs at major law firms are worth pursuing. Firms like Cravath, Skadden, and Sullivan & Cromwell run programs specifically for college graduates planning to attend law school.',
  'Public Interest': 'Given your interest in public interest law, consider roles at legal aid organizations, the ACLU, NAACP Legal Defense Fund, public defender offices, or government legal departments. AmeriCorps Legal programs are also a strong pathway.',
  'Criminal': 'Given your interest in criminal law, public defender investigator or paralegal roles and district attorney office positions provide direct exposure to criminal procedure and case strategy.',
  'IP': 'Given your interest in intellectual property, patent agent assistant or IP paralegal roles — particularly for students with STEM backgrounds — are a strong fit.',
  'Unsure': 'Since you are still exploring practice areas, any structured paralegal or legal assistant role will provide meaningful exposure. The goal at this stage is direct contact with legal work — the specialization can come later.',
};

function StrengthenApplicationSection({ studentData }: { studentData: StudentData }) {
  const graduated = studentData.currentYear === 'Alumni / Recent Graduate' || studentData.currentYear === 'Graduate Student';
  const yearsToGrad = studentData.graduationYear - new Date().getFullYear();
  const enrolled = !graduated;

  // Practice area paragraph — pick first non-Unsure, fall back to Unsure
  const areas = studentData.practiceAreaInterest;
  const primary: PracticeArea = (areas.find(a => a !== 'Unsure') || areas[0] || 'Unsure') as PracticeArea;
  const practiceAreaText = practiceAreaLegalWork[primary];

  // Academic subsection
  let academic: { heading: string; body: string } | null = null;
  if (enrolled && yearsToGrad >= 2) {
    const semesters = Math.max(1, yearsToGrad * 2);
    const remainingLabel = yearsToGrad >= 2 ? `${semesters} semesters` : `${yearsToGrad} year${yearsToGrad === 1 ? '' : 's'}`;
    academic = {
      heading: 'Use the Time to Raise Your GPA',
      body: `With ${remainingLabel} remaining before graduation, you have a real opportunity to improve your academic record. Law schools look at GPA trends — a strong finish can meaningfully offset a weaker start. Focus on your most rigorous courses, seek academic support where needed, and let your upward trajectory tell part of your story.`,
    };
  } else if (enrolled && yearsToGrad < 2) {
    academic = {
      heading: 'Finish Strong',
      body: `You don't have enough time remaining to dramatically change your GPA, but a strong final year still matters. Law schools notice upward trends. Focus on performing well in your remaining courses, and let your personal statement address your academic trajectory directly.`,
    };
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.22 }}
      className="rounded-xl p-6 bg-card space-y-5 border"
      style={{ borderLeft: `4px solid ${GOLD}` }}
    >
      <h3 className="text-xl font-heading font-bold" style={{ color: NAVY }}>
        How to Strengthen Your Application Before You Apply
      </h3>

      {/* Subsection 1: Legal Work Experience */}
      <div className="space-y-2">
        <h4 className="font-heading font-bold text-base" style={{ color: NAVY }}>Get Legal Work Experience</h4>
        <p className="text-sm text-muted-foreground">
          Applicants with direct legal experience consistently produce stronger applications. A paralegal or legal assistant role does three things for you: it demonstrates genuine commitment to a legal career, it gives you specific, credible material for your personal statement, and it signals to admissions committees that you understand what you are getting into.
        </p>
        <p className="text-sm text-muted-foreground">{practiceAreaText}</p>
        {graduated && (
          <p className="text-sm text-muted-foreground">
            For applicants who have already graduated, legal work experience carries even more weight — it becomes the primary signal that you have used your time intentionally and are genuinely committed to a legal career.
          </p>
        )}
      </div>

      {/* Subsection 2: Academic Profile (hidden if graduated) */}
      {academic && (
        <div className="space-y-2">
          <h4 className="font-heading font-bold text-base" style={{ color: NAVY }}>{academic.heading}</h4>
          <p className="text-sm text-muted-foreground">{academic.body}</p>
        </div>
      )}

      {/* Subsection 3: Test Prep */}
      <div className="space-y-2">
        <h4 className="font-heading font-bold text-base" style={{ color: NAVY }}>Invest in Your Admissions Test Preparation</h4>
        <p className="text-sm text-muted-foreground">
          A strong test score can partially offset a lower GPA. Use your remaining time to prepare thoroughly. JD-Next is worth considering — it allows you to demonstrate law school readiness through structured coursework rather than a single timed exam, and a strong score can serve as a compelling addendum even at schools that require the LSAT.
        </p>
        <div className="flex flex-col gap-1 pt-1">
          <a href={JD_NEXT_URL} target="_blank" rel="noopener noreferrer" className="underline text-sm font-medium hover:opacity-80" style={{ color: GOLD }}>
            Register for JD-Next →
          </a>
          <a href={LSAT_URL} target="_blank" rel="noopener noreferrer" className="underline text-sm font-medium hover:opacity-80" style={{ color: GOLD }}>
            Register for the LSAT →
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// Render markdown bold (**text**) as <strong>
function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) return <strong key={i} className="font-semibold text-foreground">{m[1]}</strong>;
    return <span key={i}>{part}</span>;
  });
}

export function ResultsView({ results, studentData, onStartOver }: ResultsViewProps) {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const reportRef = useRef<HTMLDivElement>(null);
  const [shareConfirmed, setShareConfirmed] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Detect advisor referral via URL param ?advisor=...
  const advisorParam = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('advisor');
  }, []);
  const arrivedViaAdvisor = !!advisorParam;

  // Look up the advisor's display name + institution for the share confirmation
  const [advisorMeta, setAdvisorMeta] = useState<{ firstName: string; institution: string } | null>(null);
  useEffect(() => {
    if (!advisorParam) return;
    (async () => {
      const { data } = await supabase
        .from('advisors')
        .select('first_name, institution')
        .eq('id', advisorParam)
        .maybeSingle();
      if (data) setAdvisorMeta({ firstName: data.first_name, institution: data.institution });
    })();
  }, [advisorParam]);

  // Auto-link the most recent completed submission to the advisor (one-time)
  useEffect(() => {
    if (!advisorParam) return;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth?.user?.id;
      if (!uid) return;
      const { data: sub } = await supabase
        .from('intake_submissions')
        .select('id, advisor_id')
        .eq('user_id', uid)
        .eq('completed', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (sub && !sub.advisor_id) {
        await supabase.from('intake_submissions').update({ advisor_id: advisorParam }).eq('id', sub.id);
      }
    })();
  }, [advisorParam]);

  // Months until intended start
  const monthsToStart = useMemo(() => {
    if (!studentData.intendedStartYear) return null;
    const now = new Date();
    // Application deadline is roughly Aug before start year (rolling); approximate using start year August
    const startDate = new Date(studentData.intendedStartYear, 7, 1);
    const months = Math.max(0, Math.round((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    return months;
  }, [studentData.intendedStartYear]);

  // Personalized readiness sentence
  const readinessPersonalized = useMemo(() => {
    const gpa = studentData.cumulativeGPA;
    const gpaStr = gpa.toFixed(2);
    const yearStr = studentData.intendedStartYear ?? 'an undecided year';
    const schools = results.schoolAssessments.map(a => a.school);
    const total = schools.length;
    const aboveP75 = schools.filter(s => gpa > s.gpa75).length;
    const inRange = schools.filter(s => gpa >= s.gpa25 && gpa <= s.gpa75).length;
    const belowP25 = schools.filter(s => gpa < s.gpa25).length;
    const mostBelow = total > 0 && belowP25 > total / 2;

    if (results.readinessLevel === 'Needs Preparation' && mostBelow) {
      return `Your current GPA of ${gpaStr} falls below the typical range for most of your selected schools. This is your starting point — not your ceiling — but your school list and preparation timeline will need careful planning.`;
    }
    if (aboveP75 >= 3) {
      return `With a ${gpaStr} GPA and a target start date of ${yearStr}, your academic profile is competitive for most of your selected schools.`;
    }
    if (inRange >= 3) {
      return `With a ${gpaStr} GPA and a target start date of ${yearStr}, your academic profile is within range for some of your selected schools, though several may be a stretch at your current GPA.`;
    }
    if (mostBelow) {
      return `With a ${gpaStr} GPA and a target start date of ${yearStr}, your current academic profile falls below the typical admitted range for most of your selected schools. Your school list may need rebalancing — your advisor can help.`;
    }
    return `With a ${gpaStr} GPA and a target start date of ${yearStr}, your academic profile is within range for some of your selected schools, though several may be a stretch at your current GPA.`;
  }, [studentData.cumulativeGPA, studentData.intendedStartYear, results.schoolAssessments, results.readinessLevel]);

  // Strategy explanation — replace generic refs with actual JD-Next school names
  const strategyExplanation = useMemo(() => {
    let exp = results.strategyExplanation;
    const jd = results.jdNextSchools;
    if (jd.length > 0 && /your target schools/i.test(exp)) {
      const named = jd.length <= 3 ? formatList(jd) : `${formatList(jd.slice(0, 2))}, and ${jd.length - 2} other schools on your list`;
      exp = exp.replace(/Several of your target schools/i, `${named}`);
      exp = exp.replace(/your target schools/gi, named);
    }
    return exp;
  }, [results.strategyExplanation, results.jdNextSchools]);

  // Determine if testing recommendations appear in various sections
  const strategyMentionsTest = /JD-Next|LSAT/i.test(strategyExplanation) || /JD-Next|LSAT/i.test(results.strategyRecommendation);
  const timelineMentionsTest = /JD-Next|LSAT|test/i.test(results.timelineRecommendation) || /JD-Next|LSAT|test/i.test(results.timelineRationale);

  // Personalized recommender guidance
  const personalizedGuidance = useMemo(() => {
    const uni = studentData.undergraduateInstitution?.trim() || 'your undergraduate institution';
    let opening = results.recommenderGuidance;
    // Replace the generic "You are currently enrolled" line with personalized version
    if (results.recommenderStudentType === 'current') {
      opening = opening.replace(
        /You are currently enrolled[^.]*\./,
        `You are currently enrolled at ${uni} — this is the best time to secure strong academic letters.`
      );
    }
    return opening;
  }, [results.recommenderGuidance, results.recommenderStudentType, studentData.undergraduateInstitution]);

  // Practice-area recommender paragraph
  const practiceAreaParagraph = useMemo(() => {
    const areas = studentData.practiceAreaInterest.filter(a => a !== 'Unsure');
    if (areas.length === 0) return null;
    const primary = areas[0];
    const subjects = practiceAreaSubjects[primary];
    return `Given your interest in ${formatList(areas)}, consider approaching professors in ${subjects} who can speak directly to your analytical and writing abilities.`;
  }, [studentData.practiceAreaInterest]);

  // Personalized action plan
  const personalizedActionPlan = useMemo(() => {
    return results.actionPlan.map((step, idx) => {
      // Item 1: Test registration
      if (idx === 0 && /Register for an admissions test/i.test(step)) {
        const window = monthsToStart !== null ? `${monthsToStart}-month` : 'current';
        const recommendsJDNext = results.jdNextSchools.length > 0;
        if (recommendsJDNext) {
          return {
            text: `Register for JD-Next or the LSAT — given your ${window} window, act within the next 30 days.`,
            links: true,
          };
        }
        return {
          text: `Register for the LSAT — given your ${window} window, act within the next 30 days.`,
          links: true,
        };
      }
      // Item 4 (index 3): advisor share
      if (/Schedule a meeting with your pre-law advisor/i.test(step) || /Review your school list with your advisor/i.test(step)) {
        return { text: step, links: false };
      }
      return { text: step, links: false };
    });
  }, [results.actionPlan, results.jdNextSchools, monthsToStart]);

  // Replace the final advisor item with the new wording
  const finalActionPlan = useMemo(() => {
    const plan = [...personalizedActionPlan];
    // Find the advisor-related item and replace with new wording
    const advisorIdx = plan.findIndex(p => /pre-law advisor/i.test(p.text));
    if (advisorIdx >= 0) {
      plan[advisorIdx] = {
        text: 'Share this report with your pre-law advisor and schedule a strategy meeting.',
        links: false,
      };
    } else {
      plan.push({ text: 'Share this report with your pre-law advisor and schedule a strategy meeting.', links: false });
    }
    return plan;
  }, [personalizedActionPlan]);

  const handleShareWithAdvisor = () => {
    // In a real implementation this would POST to a backend; for now show confirmation
    setShareConfirmed(true);
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setGeneratingPdf(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const pdf = new jsPDF('p', 'in', 'letter');
      const pageW = pdf.internal.pageSize.getWidth();   // 8.5
      const pageH = pdf.internal.pageSize.getHeight();  // 11
      const margin = 1;
      const headerH = 0.7;
      const footerH = 0.4;
      const contentTop = headerH + 0.2;
      const contentBottom = pageH - footerH - 0.2;
      const contentH = contentBottom - contentTop;
      const contentW = pageW - margin * 2;

      // Scale full canvas to content width
      const imgWidthIn = contentW;
      const imgHeightIn = (canvas.height * imgWidthIn) / canvas.width;
      const pxPerIn = canvas.width / imgWidthIn;
      const sliceHeightPx = contentH * pxPerIn;

      // Pre-load logo
      const logoImg = new Image();
      logoImg.src = jdnLogo;
      await new Promise<void>(res => { logoImg.onload = () => res(); logoImg.onerror = () => res(); });

      const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const studentLabel = `${studentData.firstName} ${studentData.lastName}`;

      const totalPages = Math.ceil(canvas.height / sliceHeightPx);
      for (let p = 0; p < totalPages; p++) {
        if (p > 0) pdf.addPage();

        // Slice canvas
        const sy = p * sliceHeightPx;
        const sh = Math.min(sliceHeightPx, canvas.height - sy);
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sh;
        const ctx = sliceCanvas.getContext('2d')!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, sliceCanvas.width, sh);
        ctx.drawImage(canvas, 0, sy, canvas.width, sh, 0, 0, canvas.width, sh);
        const sliceData = sliceCanvas.toDataURL('image/png');
        const sliceHeightIn = (sh * imgWidthIn) / canvas.width;

        // Header bar (navy)
        pdf.setFillColor(26, 54, 93);
        pdf.rect(0, 0, pageW, headerH, 'F');
        try {
          pdf.addImage(logoImg, 'PNG', margin, 0.1, 0.5, 0.5);
        } catch {}
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(13);
        pdf.text('Pre-Law Advisory Report', pageW / 2, headerH / 2 + 0.05, { align: 'center' });
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(220, 220, 220);
        pdf.text(studentLabel, pageW - margin, headerH / 2 - 0.05, { align: 'right' });
        pdf.text(today, pageW - margin, headerH / 2 + 0.15, { align: 'right' });

        // Body image
        pdf.addImage(sliceData, 'PNG', margin, contentTop, imgWidthIn, sliceHeightIn);

        // Footer
        pdf.setDrawColor(26, 54, 93);
        pdf.setLineWidth(0.01);
        pdf.line(margin, pageH - footerH, pageW - margin, pageH - footerH);
        pdf.setTextColor(120, 120, 120);
        pdf.setFontSize(9);
        pdf.text('Pre-Law Advisory Engine by JD-Next | jdnext.org', pageW / 2, pageH - footerH / 2, { align: 'center' });
        pdf.text(`Page ${p + 1} of ${totalPages}`, pageW - margin, pageH - footerH / 2, { align: 'right' });
      }

      pdf.save(`${studentData.firstName}_${studentData.lastName}_PreLaw_Report.pdf`);
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Branded Header Bar */}
      <header className="w-full" style={{ background: NAVY }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src={jdnLogo} alt="JD-Next" style={{ height: 56 }} />
          <span style={{ color: '#D1D5DB', fontSize: 16 }}>Pre-Law Advisory Engine</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div ref={reportRef} className="space-y-8">
      {/* Header */}
      <motion.div {...fadeIn} className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-heading font-bold" style={{ color: NAVY }}>
          Your Pre-Law Advisory Report
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          {studentData.firstName}, here's your personalized law school advising report — built around your academic profile, your target schools, and your goals.
        </p>
      </motion.div>

      {/* Readiness */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="border rounded-xl p-6 bg-card space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-xl font-heading font-bold" style={{ color: NAVY }}>Readiness Level</h3>
          <ReadinessIndicator level={results.readinessLevel} />
        </div>
        <p className="text-muted-foreground">{results.readinessExplanation}</p>
        <p className="text-muted-foreground">{readinessPersonalized}</p>
      </motion.div>

      {/* Strategy & Timeline */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-xl p-5 bg-card space-y-2">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-heading text-lg font-bold" style={{ color: NAVY }}>Strategy</h3>
          </div>
          <p className="font-semibold text-sm text-foreground">{results.strategyRecommendation}</p>
          <p className="text-sm text-muted-foreground">{strategyExplanation}</p>
          {strategyMentionsTest && <TestRegistrationLinks />}
        </div>
        <div className="border rounded-xl p-5 bg-card space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="font-heading text-lg font-bold" style={{ color: NAVY }}>Timeline</h3>
          </div>
          <p className="font-semibold text-sm text-foreground">{results.timelineRecommendation}</p>
          <p className="text-sm text-muted-foreground">{results.timelineRationale}</p>
          {timelineMentionsTest && <TestRegistrationLinks />}
        </div>
      </motion.div>

      {/* Strengthen Your Application — only for Needs Preparation */}
      {results.readinessLevel === 'Needs Preparation' && (
        <StrengthenApplicationSection studentData={studentData} />
      )}

      {/* Test Plan */}
      <motion.div {...fadeIn} transition={{ delay: 0.25 }} className="border rounded-xl p-6 bg-card space-y-3">
        <h3 className="text-xl font-heading font-bold" style={{ color: NAVY }}>Test Strategy</h3>
        <p className="text-muted-foreground">{results.testRecommendation}</p>
        {results.jdNextSchools.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium text-foreground mb-1">Schools accepting JD-Next:</p>
            <div className="flex flex-wrap gap-1.5">
              {results.jdNextSchools.map(s => (
                <span key={s} className="tag-jd-next">{s}</span>
              ))}
            </div>
          </div>
        )}
        <TestRegistrationLinks />
      </motion.div>

      {/* LSAT Score Analysis (only if student entered LSAT) */}
      {studentData.lsatScore && studentData.lsatScore > 0 && (
        <LsatAnalysisSection
          lsat={studentData.lsatScore}
          schools={results.schoolAssessments.map(a => a.school)}
        />
      )}

      {/* School List */}
      <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-heading font-bold" style={{ color: NAVY }}>School Assessment</h3>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
            results.listComposition === 'Healthy' ? 'bg-success/10 text-success' :
            results.listComposition === 'Overreaching' ? 'bg-destructive/10 text-destructive' :
            'bg-gold/10 text-gold'
          }`}>
            <Shield className="w-3.5 h-3.5" />
            {results.listComposition}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{results.listCompositionNote}</p>
        <div className="space-y-3">
          {results.schoolAssessments.map(assessment => (
            <SchoolCard key={assessment.school.id} assessment={assessment} />
          ))}
        </div>
      </motion.div>

      {/* Recommender Guidance */}
      <motion.div {...fadeIn} transition={{ delay: 0.4 }} className="border rounded-xl p-6 bg-card space-y-3">
        <h3 className="text-xl font-heading font-bold" style={{ color: NAVY }}>Recommender Strategy</h3>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
          {personalizedGuidance.split('\n').filter(Boolean).map((p, i) => (
            <p key={i} className={p.includes('⚠️') ? 'text-destructive font-medium' : ''}>
              {renderBold(p)}
            </p>
          ))}
          {practiceAreaParagraph && <p>{practiceAreaParagraph}</p>}
        </div>
      </motion.div>

      {/* Career Path (conditional) */}
      {results.careerPathNote && (
        <motion.div {...fadeIn} transition={{ delay: 0.45 }} className="border rounded-xl p-6 bg-gold-muted space-y-2">
          <h3 className="text-xl font-heading font-bold" style={{ color: NAVY }}>Career Pathway</h3>
          <p className="text-sm text-muted-foreground">{results.careerPathNote}</p>
        </motion.div>
      )}

      {/* Action Plan */}
      <motion.div {...fadeIn} transition={{ delay: 0.5 }} className="border rounded-xl p-6 bg-card space-y-4">
        <h3 className="text-xl font-heading font-bold" style={{ color: NAVY }}>Your Action Plan</h3>
        <ol className="space-y-3">
          {finalActionPlan.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: NAVY }}>
                {i + 1}
              </span>
              <div className="text-sm text-foreground pt-0.5 space-y-1">
                <p>{step.text}</p>
                {step.links && (
                  <div className="flex flex-col gap-0.5">
                    <a href={JD_NEXT_URL} target="_blank" rel="noopener noreferrer" className="underline text-xs font-medium hover:opacity-80" style={{ color: GOLD }}>
                      Register for JD-Next →
                    </a>
                    <a href={LSAT_URL} target="_blank" rel="noopener noreferrer" className="underline text-xs font-medium hover:opacity-80" style={{ color: GOLD }}>
                      Register for the LSAT →
                    </a>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </motion.div>
      </div>

      {/* Advisor Share / Download */}
      <motion.div {...fadeIn} transition={{ delay: 0.52 }} className="flex justify-center">
        {arrivedViaAdvisor ? (
          shareConfirmed ? (
            <div className="border rounded-xl p-5 bg-success/10 text-center max-w-md">
              <p className="text-sm text-foreground font-medium">
                Your report has been shared with your advisor. They will be in touch to schedule your advising meeting.
              </p>
            </div>
          ) : (
            <button
              onClick={handleShareWithAdvisor}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1A365D] text-white font-medium hover:bg-[#1A365D]/90 transition"
            >
              <Share2 className="w-4 h-4" />
              Share with My Pre-Law Advisor
            </button>
          )
        ) : (
          <button
            onClick={handleDownloadPdf}
            disabled={generatingPdf}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border-2 border-[#1A365D] text-[#1A365D] font-medium hover:bg-[#1A365D]/5 transition disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            {generatingPdf ? 'Generating PDF…' : 'Download to Share with My Pre-Law Advisor'}
          </button>
        )}
      </motion.div>

      {/* Résumé Upload Prompt */}
      <motion.div {...fadeIn} transition={{ delay: 0.55 }} className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center space-y-3">
        <h3 className="text-xl font-heading text-foreground">Add a Résumé to Your JD-Next Advising Profile</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Your résumé helps your advisor understand your full background before you meet. It may also be used to connect you with employers and programs if you have opted in to outreach opportunities.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm">
          Résumé upload will be available when connected to backend
        </div>
        <p className="text-xs text-muted-foreground">Optional — skipping does not affect your results</p>
      </motion.div>

      {/* Start Over */}
      <div className="text-center pt-4">
        <button
          onClick={onStartOver}
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          Start over with a new profile
        </button>
      </div>
      </div>

      {/* Branded Footer */}
      <footer className="w-full mt-12" style={{ background: NAVY }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <img src={jdnLogo} alt="JD-Next" style={{ height: 40 }} />
          <span style={{ color: '#D1D5DB', fontSize: 13 }}>Pre-Law Advisory Engine — Powered by JD-Next</span>
          <span style={{ color: '#D1D5DB', fontSize: 13 }}>© JD-Next / Aspen Publishing</span>
        </div>
      </footer>
    </div>
  );
}
