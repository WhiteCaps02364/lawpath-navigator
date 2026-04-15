import { ScoringResult, SchoolAssessment } from '@/types/intake';
import { StudentData } from '@/types/intake';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, MapPin, ExternalLink, BookOpen, Target, Shield, TrendingUp } from 'lucide-react';

interface ResultsViewProps {
  results: ScoringResult;
  studentData: StudentData;
  onStartOver: () => void;
}

function ReadinessIndicator({ level }: { level: string }) {
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
  const { school, classification, geoAlignment, geoNote } = assessment;
  const tagClass = classification === 'Reach' ? 'tag-reach' : classification === 'Target' ? 'tag-target' : 'tag-safety';

  return (
    <div className="school-card">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="font-heading text-lg text-foreground">{school.name}</h4>
        <div className="flex gap-1.5 flex-shrink-0">
          <span className={tagClass}>{classification}</span>
          {school.acceptsJDNext ? (
            <span className="tag-jd-next">JD-Next ✓</span>
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
      <div className="flex gap-3 text-xs">
        <a href="https://www.abarequireddisclosures.org/requiredDisclosure" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
          <ExternalLink className="w-3 h-3" /> ABA Disclosures
        </a>
        <a href="https://www.abarequireddisclosures.org/employmentOutcomes" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
          <ExternalLink className="w-3 h-3" /> Employment Data
        </a>
      </div>
    </div>
  );
}

export function ResultsView({ results, studentData, onStartOver }: ResultsViewProps) {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <motion.div {...fadeIn} className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-heading text-foreground">
          Your Pre-Law Advisory Report
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          {studentData.firstName}, here's your personalized assessment based on your profile.
        </p>
      </motion.div>

      {/* Readiness */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="border rounded-xl p-6 bg-card space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-xl font-heading text-foreground">Readiness Level</h3>
          <ReadinessIndicator level={results.readinessLevel} />
        </div>
        <p className="text-muted-foreground">{results.readinessExplanation}</p>
      </motion.div>

      {/* Strategy & Timeline */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-xl p-5 bg-card space-y-2">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-heading text-lg text-foreground">Strategy</h3>
          </div>
          <p className="font-semibold text-sm text-foreground">{results.strategyRecommendation}</p>
          <p className="text-sm text-muted-foreground">{results.strategyExplanation}</p>
        </div>
        <div className="border rounded-xl p-5 bg-card space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="font-heading text-lg text-foreground">Timeline</h3>
          </div>
          <p className="font-semibold text-sm text-foreground">{results.timelineRecommendation}</p>
          <p className="text-sm text-muted-foreground">{results.timelineRationale}</p>
        </div>
      </motion.div>

      {/* Test Plan */}
      <motion.div {...fadeIn} transition={{ delay: 0.25 }} className="border rounded-xl p-6 bg-card space-y-3">
        <h3 className="text-xl font-heading text-foreground">Test Strategy</h3>
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
      </motion.div>

      {/* School List */}
      <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-heading text-foreground">School Assessment</h3>
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
        <h3 className="text-xl font-heading text-foreground">Recommender Strategy</h3>
        <div className="prose prose-sm max-w-none text-muted-foreground">
          {results.recommenderGuidance.split('\n').map((p, i) => (
            <p key={i} className={p.includes('⚠️') ? 'text-destructive font-medium' : ''}>{p}</p>
          ))}
        </div>
      </motion.div>

      {/* Career Path (conditional) */}
      {results.careerPathNote && (
        <motion.div {...fadeIn} transition={{ delay: 0.45 }} className="border rounded-xl p-6 bg-gold-muted space-y-2">
          <h3 className="text-xl font-heading text-foreground">Career Pathway</h3>
          <p className="text-sm text-muted-foreground">{results.careerPathNote}</p>
        </motion.div>
      )}

      {/* Action Plan */}
      <motion.div {...fadeIn} transition={{ delay: 0.5 }} className="border rounded-xl p-6 bg-card space-y-4">
        <h3 className="text-xl font-heading text-foreground">Your Action Plan</h3>
        <ol className="space-y-3">
          {results.actionPlan.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <span className="text-sm text-foreground pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
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
  );
}
