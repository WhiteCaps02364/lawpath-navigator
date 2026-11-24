import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import jdnLogoAsset from '@/assets/jdnext-logo.png.asset.json';
const jdnLogo = jdnLogoAsset.url;
import { ArrowRight, Users, BarChart3, Shield, ChevronDown } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Index() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const advisorId = params.get('advisor');
  const { user, signOut } = useAuth();
  const [firstName, setFirstName] = useState<string>('');

  useEffect(() => {
    if (!user) { setFirstName(''); return; }
    supabase.from('profiles').select('first_name').eq('id', user.id).maybeSingle().then(({ data }) => {
      setFirstName(data?.first_name ?? '');
    });
  }, [user]);

  const handleStart = () => {
    if (user) navigate('/post-auth');
    else navigate(`/auth${advisorId ? `?advisor=${advisorId}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-[#026062] w-full px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <img src={jdnLogo} alt="JD-Next" className="h-[56px] w-auto" />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-base text-gray-200 hover:text-white">
                {firstName || 'Account'} <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/report')}>My Report</DropdownMenuItem>
                <DropdownMenuItem onClick={async () => { await signOut(); navigate('/'); }}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="text-base text-gray-300">Pre-Law Advising Intake Form</span>
          )}
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold/5" />
        <div className="relative max-w-4xl mx-auto px-4 pt-4 pb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-heading text-foreground leading-tight">
              Your Law School Plan,<br />
              <span className="text-secondary">Built Around You.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Answer a few questions and receive a personalized summary of your profile and selected schools. Relying on ABA-reported data, the intake form will help guide your decisions and planning for your application process.
            </p>

            <div className="flex flex-col items-center gap-2 pt-4">
              <Button size="lg" onClick={handleStart} className="gap-2 text-base px-8 bg-[#026062] text-white hover:bg-[#026062]/90">
                Create My Custom Advising Report <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-sm text-muted-foreground">
                Takes about 10 minutes. Provided free by JD-Next for pre-law advisors and law school applicants.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Proof line */}
      <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
        <div className="h-px bg-[#D0D5DD]" />
        <p className="text-base text-[#344054] leading-relaxed">
          Every advising report starts with data law schools report to the ABA each year — so your admissions plan is built on facts, not guesswork.
        </p>
        <div className="h-px bg-[#D0D5DD]" />
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: BarChart3,
              title: 'Review Your Academic Profile',
              description: 'Relying on ABA-reported data, the intake form organizes your academic profile to help guide your decisions about application timing and next steps.',
            },
            {
              icon: Shield,
              title: 'Compare Your Schools to ABA Data',
              description: 'See how your GPA compares to ABA-reported data for the schools you\'re considering, along with where each school\'s graduates practice.',
            },
            {
              icon: Users,
              title: 'Share With Your Advisor — Or Keep It for Yourself',
              description: 'Your report is yours. If you\'re working with a pre-law advisor, you can send it directly to their dashboard. If not, download it as a PDF and use it to guide your own planning.',
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

        <div className="mt-10 w-full border-l-4 border-brand-navy bg-callout p-6 text-center">
          <h2 className="text-[15px] font-bold text-brand-navy">Working with a Pre-Law Advisor?</h2>
          <p className="mt-3 text-sm text-credibility leading-relaxed">
            If your advisor has set up an account, you can send your completed report to their dashboard before your meeting. Don't have an advisor? Your report is fully personalized — download it as a PDF and use it as a starting point for your application strategy.
          </p>
        </div>
      </div>

      {/* Advisor section */}
      <div className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-heading">Built for Every Path to Law School.</h2>
          <p className="text-base md:text-lg leading-relaxed opacity-90">
            When you complete your intake, you'll receive a full profile, school analysis, and personalized action plan. If you're working with a pre-law advisor, they'll receive a copy too — so your time together focuses on strategy, not background questions.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">JD</span>
            </div>
            <span className="text-sm text-muted-foreground">JD-Next</span>
          </div>
          <button
            onClick={() => navigate('/advisor-register')}
            className="text-sm text-[#026062] underline font-medium"
          >
            Are You a Pre-Law Advisor?
          </button>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} JD-Next. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
