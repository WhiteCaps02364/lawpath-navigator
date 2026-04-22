import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AdvisorFooter } from '@/components/advisor/AdvisorFooter';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sampleInstitutions } from '@/data/lawSchools';
import { useAdvisorDemo, buildDemoAdvisor } from '@/contexts/AdvisorDemoContext';
import { Eye, EyeOff } from 'lucide-react';

const yearOptions = ['Less than 1 year', '1–3 years', '4–7 years', '8+ years'];

export default function AdvisorRegisterDetails() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setAdvisor } = useAdvisorDemo();
  const email = params.get('email') || '';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [institution, setInstitution] = useState('');
  const [phone, setPhone] = useState('');
  const [years, setYears] = useState('');
  const [bio, setBio] = useState('');
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);

  const canSubmit = firstName && lastName && title && institution && years && pw.length >= 8 && pw === pwConfirm;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const advisor = buildDemoAdvisor({
      email, firstName, lastName, title, institution,
      phone: phone || undefined, yearsAdvising: years, biography: bio || undefined,
    });
    setAdvisor(advisor);
    navigate('/advisor-dashboard', { replace: true });
  };

  return (
    <>
      <AuthCard>
        <h1 className="text-[24px] font-bold text-center text-[#1A365D]">Complete Your Advisor Profile</h1>
        <p className="text-[14px] text-muted-foreground text-center mt-2">
          These details power your public profile page and shareable link.
        </p>
        <div style={{ height: 24 }} />
        <form onSubmit={submit} className="space-y-4">
        <div>
          <Label>Verified Institutional Email</Label>
          <Input value={email} readOnly className="mt-1.5 bg-muted text-muted-foreground" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>First Name</Label>
            <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="mt-1.5" required />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input value={lastName} onChange={e => setLastName(e.target.value)} className="mt-1.5" required />
          </div>
        </div>
        <div>
          <Label>Title</Label>
          <Input placeholder="e.g., Pre-Law Advisor" value={title} onChange={e => setTitle(e.target.value)} className="mt-1.5" required />
        </div>
        <div>
          <Label>Institution Name</Label>
          <Select value={institution} onValueChange={setInstitution}>
            <SelectTrigger className="mt-1.5"><SelectValue placeholder="Search institutions" /></SelectTrigger>
            <SelectContent>
              {sampleInstitutions.map(i => (
                <SelectItem key={i} value={i}>{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1.5" />
          <p className="text-[12px] text-muted-foreground mt-1">Optional — for JD-Next advisor outreach only</p>
        </div>
        <div>
          <Label>Years in Pre-Law Advising</Label>
          <Select value={years} onValueChange={setYears}>
            <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {yearOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Short Biography</Label>
          <Textarea
            value={bio}
            onChange={e => setBio(e.target.value.slice(0, 300))}
            placeholder="Tell students a little about yourself and your advising approach. This appears on your profile page."
            rows={4}
            className="mt-1.5"
          />
          <p className="text-[12px] text-muted-foreground mt-1">{bio.length}/300</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Password</Label>
            <div className="relative mt-1.5">
              <Input type={showPw ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} className="pr-10" />
              <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label>Confirm Password</Label>
            <Input type={showPw ? 'text' : 'password'} value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} className="mt-1.5" />
          </div>
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full h-11 rounded-2xl bg-[#1A365D] text-white font-medium hover:bg-[#1A365D]/90 disabled:opacity-50 transition-colors"
        >
          Complete Account Setup →
        </button>
        <p className="text-[12px] text-muted-foreground text-center">
          By creating an account you agree to our{' '}
          <a href="https://aspenpublishing.com/policies/terms-of-service" target="_blank" rel="noreferrer" className="underline">Terms of Service</a>{' '}
          and{' '}
          <a href="https://aspenpublishing.com/policies/privacy-policy" target="_blank" rel="noreferrer" className="underline">Privacy Policy</a>.
        </p>
        </form>
      </AuthCard>
      <AdvisorFooter />
    </>
  );
}