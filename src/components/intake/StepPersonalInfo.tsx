import { useIntake } from '@/contexts/IntakeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sampleInstitutions } from '@/data/lawSchools';

export function StepPersonalInfo() {
  const { data, updateData } = useIntake();
  const currentYear = new Date().getFullYear();
  const isCurrentOrFuture = data.graduationYear >= currentYear;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-heading text-foreground mb-1">Let's get started</h2>
        <p className="text-muted-foreground">The entire process takes about 10 minutes. Let's start with the basics.</p>
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
              {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map(y => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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

      <div className="space-y-2">
        <Label htmlFor="personalEmail">Personal Email *</Label>
        <Input id="personalEmail" type="email" value={data.personalEmail} onChange={e => updateData({ personalEmail: e.target.value })} placeholder="you@gmail.com" />
        {isCurrentOrFuture && (
          <p className="text-xs text-muted-foreground">We'll use this to stay in touch after you graduate.</p>
        )}
      </div>

      {isCurrentOrFuture && (
        <div className="space-y-2">
          <Label htmlFor="schoolEmail">School Email *</Label>
          <Input id="schoolEmail" type="email" value={data.schoolEmail} onChange={e => updateData({ schoolEmail: e.target.value })} placeholder="you@university.edu" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Intended Law School Start Year *</Label>
          <Select
            value={data.intendedStartYear !== null ? String(data.intendedStartYear) : 'Not sure'}
            onValueChange={v => updateData({ intendedStartYear: v === 'Not sure' ? null : Number(v) })}
          >
            <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 6 }, (_, i) => currentYear + i).map(y => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
              <SelectItem value="Not sure">Not sure</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Application Timing Intent *</Label>
          <Select value={data.applicationTimingIntent} onValueChange={v => updateData({ applicationTimingIntent: v as any })}>
            <SelectTrigger><SelectValue placeholder="Select timing" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="This cycle">I plan to apply this cycle</SelectItem>
              <SelectItem value="Next cycle">I plan to apply next cycle</SelectItem>
              <SelectItem value="Not sure">I'm not sure yet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
        <p className="text-sm font-medium text-foreground">Law School Outreach (Optional)</p>
        <div className="flex items-start gap-2">
          <Checkbox
            id="lawSchoolOptIn"
            checked={data.lawSchoolOptIn}
            onCheckedChange={c => updateData({ lawSchoolOptIn: !!c })}
            className="mt-0.5"
          />
          <div className="space-y-1">
            <Label htmlFor="lawSchoolOptIn" className="text-sm font-normal cursor-pointer">
              I'd like to hear from law schools that may be a strong fit for my profile
            </Label>
            <p className="text-muted-foreground" style={{ fontSize: '13px' }}>
              If you opt in, we may share your contact information with law schools that may want to connect with prospective applicants. Your information will never be sold or shared without your explicit consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
