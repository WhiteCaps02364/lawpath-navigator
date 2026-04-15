import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, BarChart3, Shield } from 'lucide-react';
import IntakeWizard from '@/components/intake/IntakeWizard';

export default function Index() {
  const [started, setStarted] = useState(false);

  if (started) {
    return <IntakeWizard />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold/5" />
        <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <BookOpen className="w-4 h-4" />
              Pre-Law Advisory Engine
            </div>

            <h1 className="text-4xl md:text-6xl font-heading text-foreground leading-tight">
              Advise With Purpose.<br />
              <span className="text-secondary">Support With Impact.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A decision engine for pre-law students and advisors. Complete the intake in under 10 minutes
              and receive a personalized strategy — from school selection to test planning.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button size="lg" onClick={() => setStarted(true)} className="gap-2 text-base px-8">
                Start Your Assessment <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: BarChart3,
              title: 'Readiness Scoring',
              description: 'GPA-anchored analysis with upgrade/downgrade logic based on test scores, experience, and motivation clarity.',
            },
            {
              icon: Shield,
              title: 'School List Reality Check',
              description: 'Every school classified as Reach, Target, or Safety against ABA 509 data. Geographic alignment flagged automatically.',
            },
            {
              icon: Users,
              title: 'Advisor-Ready Reports',
              description: 'Structured outputs with meeting agendas, risk flags, and recommender assessments your advisor can act on immediately.',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="border rounded-xl p-6 bg-card hover:shadow-md transition-shadow"
            >
              <feature.icon className="w-10 h-10 text-secondary mb-4" />
              <h3 className="font-heading text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">JD</span>
            </div>
            <span className="text-sm text-muted-foreground">JD-Next</span>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} JD-Next. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
