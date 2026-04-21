import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Building2, BarChart3, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import jdnLogo from '@/assets/jdn-logo.png';
import { SilhouetteAvatar } from '@/components/advisor/SilhouetteAvatar';
import { useAdvisorDemo } from '@/contexts/AdvisorDemoContext';

export default function AdvisorPublicProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { advisor: ownAdvisor } = useAdvisorDemo();

  // For prototype: only the demo advisor's own profile resolves; otherwise show a generic placeholder using the slug.
  const matched = ownAdvisor && ownAdvisor.slug === slug;
  const advisor = matched ? ownAdvisor : null;
  const displayName = advisor ? `${advisor.firstName} ${advisor.lastName}` : 'Pre-Law Advisor';
  const institution = advisor?.institution || 'Your Institution';
  const title = advisor?.title || 'Pre-Law Advisor';
  const years = advisor?.yearsAdvising || '';
  const bio = advisor?.biography || 'Your pre-law advisor has set up this free tool to help you build a smarter, more informed law school application strategy.';
  const studentsHelped = 0;
  const firstName = advisor?.firstName || 'Your advisor';

  const start = () => {
    const adv = advisor?.id || slug || '';
    navigate(`/auth?advisor=${encodeURIComponent(adv)}&institution=${encodeURIComponent(institution)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-[#1A365D] w-full">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src={jdnLogo} alt="JD-Next" style={{ height: 56, width: 'auto' }} />
          <span className="text-base text-gray-300">Pre-Law Advisory Engine</span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-2 flex justify-center">
            <SilhouetteAvatar size={160} bordered />
          </div>
          <div className="md:col-span-3 space-y-3">
            <h1 className="text-[24px] font-bold text-[#1A365D] font-heading">{displayName}</h1>
            <p className="text-[16px] text-muted-foreground">{title}</p>
            <p className="text-[16px] text-[#1A365D] flex items-center gap-2">
              <Building2 className="w-4 h-4" /> {institution}
            </p>
            {years && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: '#C9A84C' }}>
                {years} Advising
              </span>
            )}
            <p className="text-sm text-muted-foreground">
              {studentsHelped > 0
                ? `${studentsHelped} students have used this tool`
                : `Be the first from ${institution}`}
            </p>
            <p className="text-[15px] text-muted-foreground leading-relaxed pt-1">{bio}</p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-muted/40 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-heading font-bold text-[#1A365D]">
            Your Law School Plan, Built Around You.
          </motion.h2>
          <p className="text-base md:text-lg text-muted-foreground">
            {firstName} has set up this free tool to help you build a smarter, more informed law school application strategy.
          </p>
          <div className="pt-2">
            <button
              onClick={start}
              className="inline-flex items-center gap-2 bg-[#1A365D] text-white px-8 py-3 rounded-md text-base font-medium hover:bg-[#1A365D]/90"
            >
              Start My Assessment <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-muted-foreground mt-3">Takes about 10 minutes. Free for all law school applicants.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: BarChart3, title: 'Know Where You Stand', body: 'See where you stand academically and get a clear picture of whether now is the right time to apply — or what you need to do first.' },
            { icon: Shield, title: 'Are Your Target Schools Realistic?', body: "Find out whether the schools you're considering are realistic targets based on your GPA, and whether they place graduates where you want to work." },
            { icon: Users, title: 'Your Advisor, Fully Briefed', body: 'Your advisor receives a summary of your profile before you meet, so your conversation starts with strategy — not background questions.' },
          ].map(f => (
            <div key={f.title} className="border rounded-xl p-6 bg-card">
              <f.icon className="w-10 h-10 mb-4" style={{ color: '#C9A84C' }} />
              <h3 className="font-heading text-lg text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Navy band */}
      <section className="bg-[#1A365D] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-heading">Designed for You. Built for Your Advisor.</h2>
          <p className="text-base md:text-lg opacity-90">
            When you complete your intake, you and your pre-law advisor will receive a full profile, school analysis, and a suggested meeting agenda — so your time together focuses on strategy, not background questions.
          </p>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#1A365D] flex items-center justify-center">
              <span className="text-white font-bold text-xs">JD</span>
            </div>
            <span className="text-sm text-muted-foreground">JD-Next</span>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} JD-Next. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}