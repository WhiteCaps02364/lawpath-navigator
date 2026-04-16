import { useIntake } from '@/contexts/IntakeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sampleInstitutions } from '@/data/lawSchools';

export function StepPersonalInfo() {
  const { data, updateData } = useIntake();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-heading text-foreground mb-1">Let's get started</h2>
        <p className="text-muted-foreground">Tell us about yourself. This takes about 10 minutes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input id="firstName" value={data.firstName} onChange={e => updateData({ firstName: e.target.value })} placeholder="Your first name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input id="lastName" value={data.lastName} onChange={e => updateData({ lastName: e.target.value })} placeholder="Your last name" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="schoolEmail">School Email *</Label>
          <Input id="schoolEmail" type="email" value={data.schoolEmail} onChange={e => updateData({ schoolEmail: e.target.value })} placeholder="you@university.edu" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="personalEmail">Personal Email *</Label>
          <Input id="personalEmail" type="email" value={data.personalEmail} onChange={e => updateData({ personalEmail: e.target.value })} placeholder="you@gmail.com" />
          <p className="text-xs text-muted-foreground">We'll use this to stay in touch after you graduate.</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Undergraduate Institution *</Label>
        <Select value={data.undergraduateInstitution} onValueChange={v => updateData({ undergraduateInstitution: v })}>
          <SelectTrigger><SelectValue placeholder="Select your school" /></SelectTrigger>
          <SelectContent>
            {sampleInstitutions.map(i => (
              <SelectItem key={i} value={i}>{i}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Graduation Year *</Label>
          <Select value={String(data.graduationYear)} onValueChange={v => updateData({ graduationYear: Number(v) })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
        <p className="text-sm font-medium text-foreground">Outreach Preferences</p>
        <p className="text-xs text-muted-foreground">By checking these boxes, you agree to be contacted about opportunities that may match your profile. Your information will not be shared without your explicit consent.</p>
        <div className="space-y-2">
          {[
            { key: 'optInLawSchools' as const, label: "I'd like to hear from law schools that may be a strong fit for my profile" },
            { key: 'optInBigLaw' as const, label: "I'd like to hear from BigLaw firms about early-career and paralegal programs" },
            { key: 'optInParalegal' as const, label: "I'd like to hear about paralegal and legal training program opportunities" },
            { key: 'optInPublicInterest' as const, label: "I'd like to hear about public interest and government legal opportunities" },
          ].map(opt => (
            <div key={opt.key} className="flex items-center gap-2">
              <Checkbox
                id={opt.key}
                checked={data[opt.key]}
                onCheckedChange={c => updateData({ [opt.key]: !!c })}
              />
              <Label htmlFor={opt.key} className="text-sm font-normal cursor-pointer">{opt.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
