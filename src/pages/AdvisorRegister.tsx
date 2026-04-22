import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, ClipboardCheck, Mail, ShieldCheck } from 'lucide-react';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function AdvisorRegister() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);

  // Manual verification fields
  const [mvName, setMvName] = useState('');
  const [mvInstitution, setMvInstitution] = useState('');
  const [mvTitle, setMvTitle] = useState('');
  const [mvNote, setMvNote] = useState('');
  const [mvSent, setMvSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!trimmed.endsWith('.edu')) {
      setError('not_edu');
      return;
    }
    setSent(true);
  };

  const proceedToStep2 = () => {
    navigate(`/advisor-register/details?email=${encodeURIComponent(email.trim().toLowerCase())}`);
  };

  const submitManual = () => {
    if (!mvName || !mvInstitution || !mvTitle) {
      toast({ title: 'Please complete required fields', variant: 'destructive' });
      return;
    }
    setMvSent(true);
  };

  const advisorIntro = (
    <>
      <section className="w-screen bg-white py-14 px-4 text-center">
        <h1 className="mx-auto max-w-4xl text-[32px] font-bold leading-tight text-[#1A365D]">
          Spend Less Time Gathering Information. More Time Changing Outcomes.
        </h1>
        <p className="mx-auto mt-4 max-w-[560px] text-[16px] leading-7 text-gray-600">
          The Pre-Law Advisory Engine gives pre-law advisors a structured, data-driven advisee profile before they walk into your office — so your meetings start with strategy, not background questions.
        </p>
        <div className="h-10" />
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: ClipboardCheck,
              title: 'Students Arrive Briefed, Not Blank',
              description: 'Every advisee completes a structured 10-minute intake before your meeting. You receive a pre-analyzed profile, risk flags, and a suggested meeting agenda — before the conversation begins.',
            },
            {
              icon: BarChart3,
              title: 'Your Dashboard, Ready to Go',
              description: 'As students complete their intake form, their advising report is added to your dashboard. One click to see readiness level, target school list analysis, UGPA, testing status, application timeline, and more.',
            },
            {
              icon: ShieldCheck,
              title: 'Built on Real ABA Data',
              description: 'Every school assessment is grounded in ABA Required Disclosures data — the most reliable source for admissions percentiles, employment outcomes, and graduate placement patterns.',
            },
          ].map((card) => (
            <div key={card.title} className="border rounded-xl p-6 bg-card hover:shadow-md transition-shadow text-left">
              <card.icon className="w-10 h-10 text-secondary mb-4" />
              <h2 className="text-lg font-bold text-[#1A365D]">{card.title}</h2>
              <p className="mt-3 text-[14px] leading-6 text-muted-foreground">{card.description}</p>
            </div>
          ))}
        </div>
        <div className="h-10" />
        <div className="flex h-12 w-screen items-center justify-center bg-[#F2F4F7] px-4 text-center text-[14px] text-gray-600">
          Free for advisors and students. Verified institutional accounts only. Built by JD-Next in partnership with pre-law advisors nationwide.
        </div>
      </section>
    </>
  );

  if (sent) {
    return (
      <AuthCard>
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#1A365D]/10 flex items-center justify-center">
            <Mail className="w-6 h-6 text-[#1A365D]" />
          </div>
          <h1 className="text-[24px] font-bold text-[#1A365D]">Check your inbox</h1>
          <p className="text-[14px] text-muted-foreground">
            We've sent a verification link to <span className="font-medium text-foreground">{email}</span>. Click the link to continue setting up your account.
          </p>
          <button
            type="button"
            onClick={() => toast({ title: 'Verification email resent' })}
            className="text-[13px] text-muted-foreground underline"
          >
            Resend Email
          </button>
          <div className="pt-4 border-t">
            <button
              type="button"
              onClick={proceedToStep2}
              className="text-[12px] text-muted-foreground underline"
            >
              [Demo: Skip verification]
            </button>
            <p className="text-[11px] text-muted-foreground mt-1">Prototype shortcut — will be removed before launch.</p>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard beforeCard={advisorIntro}>
      <h1 className="text-[24px] font-bold text-center text-[#1A365D]">Create Your Advisor Account</h1>
      <p className="text-[14px] text-muted-foreground text-center mt-2">
        We verify all advisor accounts using your institutional .edu email — so students know they're connecting with a real, verified advisor at their school.
      </p>
      <div style={{ height: 24 }} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="mb-4 text-[14px] leading-6 text-muted-foreground">
            Create your free advisor account to access your personal dashboard, generate a custom student link, and start receiving pre-analyzed student profiles before your advising meetings.
          </p>
          <Label htmlFor="email">Institutional Email Address (.edu required)</Label>
          <Input
            id="email"
            type="email"
            placeholder="yourname@university.edu"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(null); }}
            className="mt-1.5"
          />
          {error === 'not_edu' && (
            <p className="text-xs text-destructive mt-1.5">
              Please use your institutional .edu email address. If your institution does not issue .edu addresses,{' '}
              <button type="button" onClick={() => setManualOpen(true)} className="underline font-medium">
                click here to request manual verification
              </button>.
            </p>
          )}
          {error && error !== 'not_edu' && <p className="text-xs text-destructive mt-1.5">{error}</p>}
        </div>
        <button
          type="submit"
          className="w-full h-11 rounded-2xl bg-[#1A365D] text-white font-medium hover:bg-[#1A365D]/90 transition-colors flex items-center justify-center gap-2"
        >
          Send Verification Link <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <Dialog open={manualOpen} onOpenChange={(o) => { setManualOpen(o); if (!o) setMvSent(false); }}>
        <DialogContent>
          {!mvSent ? (
            <>
              <DialogHeader>
                <DialogTitle>Request Manual Verification</DialogTitle>
                <DialogDescription>
                  Provide a few details and the JD-Next team will verify your role.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div>
                  <Label>Full Name</Label>
                  <Input value={mvName} onChange={e => setMvName(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Institution</Label>
                  <Input value={mvInstitution} onChange={e => setMvInstitution(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input value={mvTitle} onChange={e => setMvTitle(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Note (optional)</Label>
                  <Textarea value={mvNote} onChange={e => setMvNote(e.target.value)} className="mt-1" rows={3} />
                </div>
              </div>
              <DialogFooter>
                <button onClick={submitManual} className="w-full h-10 rounded-md bg-[#1A365D] text-white font-medium">
                  Submit Request
                </button>
              </DialogFooter>
            </>
          ) : (
            <div className="py-6 text-center space-y-2">
              <h3 className="text-lg font-bold text-[#1A365D]">Request submitted</h3>
              <p className="text-sm text-muted-foreground">
                Your verification request has been submitted. A member of the JD-Next team will be in touch within 2 business days.
              </p>
              <button onClick={() => setManualOpen(false)} className="mt-3 px-4 py-2 rounded-md bg-[#1A365D] text-white text-sm">Close</button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AuthCard>
  );
}