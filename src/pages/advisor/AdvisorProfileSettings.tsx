import { useState } from 'react';
import { useAdvisorDemo } from '@/contexts/AdvisorDemoContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SilhouetteAvatar } from '@/components/advisor/SilhouetteAvatar';
import { buildAdvisorUrl } from '@/lib/advisorSlug';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const yearOptions = ['Less than 1 year', '1–3 years', '4–7 years', '8+ years'];

export default function AdvisorProfileSettings() {
  const { advisor, updateAdvisor } = useAdvisorDemo();
  const { toast } = useToast();
  const [bio, setBio] = useState(advisor?.biography || '');
  const [title, setTitle] = useState(advisor?.title || '');
  const [phone, setPhone] = useState(advisor?.phone || '');
  const [years, setYears] = useState(advisor?.yearsAdvising || '');
  const [copied, setCopied] = useState(false);

  if (!advisor) return null;
  const url = buildAdvisorUrl(advisor.slug, advisor.institution);

  const save = () => {
    updateAdvisor({ biography: bio, title, phone, yearsAdvising: years });
    toast({ title: 'Profile updated' });
  };

  const copy = () => {
    navigator.clipboard.writeText(`https://${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-3xl font-heading font-bold text-[#1A365D]">My Profile</h1>

      <div className="bg-white border rounded-xl p-6 space-y-5">
        <div className="flex flex-col items-center gap-2">
          <SilhouetteAvatar size={120} bordered />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-sm text-muted-foreground cursor-default" tabIndex={-1}>
                  Edit Photo
                </button>
              </TooltipTrigger>
              <TooltipContent>Photo upload coming soon</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div>
          <Label>Title</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label>Years Advising</Label>
          <Select value={years} onValueChange={setYears}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{yearOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Short Biography</Label>
          <Textarea value={bio} onChange={e => setBio(e.target.value.slice(0, 300))} rows={4} className="mt-1.5" />
          <p className="text-[12px] text-muted-foreground mt-1">{bio.length}/300</p>
        </div>

        <div className="border-t pt-5 space-y-4">
          <div>
            <Label>Institution</Label>
            <Input value={advisor.institution} readOnly className="mt-1.5 bg-muted" />
            <p className="text-[12px] text-muted-foreground mt-1">To change your institution, please contact JD-Next support.</p>
          </div>
          <div>
            <Label>Verified Email</Label>
            <div className="flex items-center gap-2 mt-1.5">
              <Input value={advisor.email} readOnly className="bg-muted flex-1" />
              <button className="text-sm text-[#1A365D] underline whitespace-nowrap" onClick={() => toast({ title: 'Email change link sent' })}>Change Email</button>
            </div>
          </div>
          <div>
            <Label>Custom Link</Label>
            <div className="flex items-center gap-2 mt-1.5">
              <Input value={url} readOnly className="bg-muted flex-1 font-mono text-sm" />
              <button onClick={copy} className="inline-flex items-center gap-1 bg-[#1A365D] text-white px-3 py-2 rounded text-sm">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[12px] text-muted-foreground mt-1">Your custom link is permanent and tied to your profile.</p>
          </div>
        </div>

        <button onClick={save} className="w-full bg-[#1A365D] text-white h-11 rounded-md font-medium hover:bg-[#1A365D]/90">
          Save Changes
        </button>
      </div>
    </div>
  );
}