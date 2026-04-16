import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import jdnLogo from '@/assets/jdn-logo.png';
import { ArrowRight, Users, BarChart3, Shield } from 'lucide-react';
import IntakeWizard from '@/components/intake/IntakeWizard';

export default function Index() {
  const [started, setStarted] = useState(false);

  if (started) {
    return <IntakeWizard />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <img src={jdnLogo} alt="JD-Next" className="h-10" />
      </div>

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
            <p className="text-sm text-muted-foreground">
              Provided free by JD-Next in partnership with your pre-law advisor.
            </p>

            <h1 className="text-4xl md:text-6xl font-heading text-foreground leading-tight">
              Your Law School Plan,<br />
              <span className="text-secondary">Built Around You.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Answer a few questions and get a personalized readiness score, application strategy, and school analysis — tailored to your story and powered by the latest ABA data.
            </p>

            <div className="flex flex-col items-center gap-2 pt-4">
              <Button size="lg" onClick={() => setStarted(true)} className="gap-2 text-base px-8">
                Create My Advising Report <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-sm text-muted-foreground">
                Takes about 10 minutes. Free for all law school applicants.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Proof line */}
      <div className="max-w-3xl mx-auto px-4 pb-12 text-center">
        <p className="text-sm md:text-base text-muted-foreground/80 leading-relaxed">
          Every advising report starts with data law schools report to the ABA each year — so your admissions plan is built on facts, not guesswork.
        </p>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: BarChart3,
              title: 'Know Where You Stand',
              description: 'See where you stand academically and get a clear picture of whether now is the right time to apply — or what you need to do first.',
            },
            {
              icon: Shield,
              title: 'Are Your Target Schools Realistic?',
              description: 'Find out whether the schools you\'re considering are realistic targets based on your GPA, and whether they place graduates where you want to work.',
            },
            {
              icon: Users,
              title: 'Your Advisor, Fully Briefed',
              description: 'Your advisor receives a summary of your profile before you meet, so your conversation starts with strategy — not background questions.',
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

      {/* Advisor section */}
      <div className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-heading">Designed for You. Built for Your Advisor.</h2>
          <p className="text-base md:text-lg leading-relaxed opacity-90">
            When you complete your intake, your pre-law advisor receives a full profile, school analysis, and a suggested meeting agenda — so your time together focuses on strategy, not background questions.
          </p>
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
