import { useIntake } from '@/contexts/IntakeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Recommender, RiskFlag } from '@/types/intake';

const riskOptions: RiskFlag[] = ['Low early GPA', 'GPA improvement', 'Major change', 'Academic probation', 'None'];

export function StepApplicationStrength() {
  const { data, updateData } = useIntake();

  const updateRecommender = (index: number, partial: Partial<Recommender>) => {
    const updated = [...data.recommenders];
    updated[index] = { ...updated[index], ...partial };
    updateData({ recommenders: updated });
  };

  const toggleRisk = (flag: RiskFlag) => {
    if (flag === 'None') {
      updateData({ riskFlags: ['None'] });
      return;
    }
    const current = data.riskFlags.filter(f => f !== 'None');
    if (current.includes(flag)) {
      updateData({ riskFlags: current.filter(f => f !== flag) });
    } else {
      updateData({ riskFlags: [...current, flag] });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-heading text-foreground mb-1">Application Strength</h2>
        <p className="text-muted-foreground">Tell us about your recommenders, experiences, and any flags we should know about.</p>
      </div>

      {[0, 1, 2].map(i => (
        <div key={i} className="border rounded-lg p-4 space-y-3 bg-muted/30">
          <p className="text-sm font-medium text-foreground">Recommender {i + 1}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Full Name</Label>
              <Input value={data.recommenders[i].name} onChange={e => updateRecommender(i, { name: e.target.value })} placeholder="Dr. Jane Smith" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Relationship</Label>
              <Select value={data.recommenders[i].relationship} onValueChange={v => updateRecommender(i, { relationship: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Professor', 'Employer', 'Supervisor', 'Mentor', 'Other'].map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Context</Label>
              <Input value={data.recommenders[i].context} onChange={e => updateRecommender(i, { context: e.target.value })} placeholder="e.g. Constitutional Law professor, Fall 2024" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">How strong?</Label>
              <Select value={data.recommenders[i].strength} onValueChange={v => updateRecommender(i, { strength: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Very strong">Very strong</SelectItem>
                  <SelectItem value="Average">Average</SelectItem>
                  <SelectItem value="Unsure">Unsure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}

      <div className="space-y-2">
        <Label>Relevant Experiences</Label>
        <Textarea value={data.relevantExperiences} onChange={e => updateData({ relevantExperiences: e.target.value })} placeholder="Internships, leadership roles, research, volunteer work..." className="min-h-[80px]" />
      </div>

      <div className="space-y-2">
        <Label>Personal Statement Themes</Label>
        <Textarea value={data.personalStatementThemes} onChange={e => updateData({ personalStatementThemes: e.target.value })} placeholder="What themes do you plan to highlight? (Optional)" className="min-h-[60px]" />
      </div>

      <div className="space-y-3">
        <Label>Risk Flags</Label>
        <div className="grid grid-cols-2 gap-2">
          {riskOptions.map(flag => (
            <div key={flag} className="flex items-center gap-2">
              <Checkbox
                id={`risk-${flag}`}
                checked={data.riskFlags.includes(flag)}
                onCheckedChange={() => toggleRisk(flag)}
              />
              <Label htmlFor={`risk-${flag}`} className="text-sm font-normal cursor-pointer">{flag}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Do you need to write an addendum?</Label>
        <Select value={data.addendumNeeded} onValueChange={v => updateData({ addendumNeeded: v as any })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="Unsure">Unsure</SelectItem>
          </SelectContent>
        </Select>
        {data.addendumNeeded === 'Yes' && (
          <Textarea value={data.addendumText || ''} onChange={e => updateData({ addendumText: e.target.value })} placeholder="Briefly describe what the addendum would address..." className="mt-2" />
        )}
      </div>
    </div>
  );
}
