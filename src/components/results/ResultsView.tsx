import { ScoringResult, SchoolAssessment, StudentData, PracticeArea } from '@/types/intake';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, MapPin, ExternalLink, BookOpen, Target, Shield, TrendingUp, Share2, Download } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import jdnLogo from '@/assets/jdn-logo.png';

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
