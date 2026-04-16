import { useIntake } from '@/contexts/IntakeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sampleInstitutions } from '@/data/lawSchools';

export function StepAcademics() {
  const { data, updateData } = useIntake();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-heading text-foreground mb-1">Academic Profile</h2>
        <p className="text-muted-foreground">This helps us understand your academic profile and build a realistic application strategy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cumulativeGPA">Cumulative GPA *</Label>
          <Input id="cumulativeGPA" type="number" step="0.01" min="0" max="4.0" value={data.cumulativeGPA || ''} onChange={e => updateData({ cumulativeGPA: parseFloat(e.target.value) || 0 })} placeholder="e.g. 3.65" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="majorGPA">Major GPA</Label>
          <Input id="majorGPA" type="number" step="0.01" min="0" max="4.0" value={data.majorGPA || ''} onChange={e => updateData({ majorGPA: parseFloat(e.target.value) || 0 })} placeholder="e.g. 3.80" />
          <p className="text-xs text-muted-foreground">Optional — but helpful if your major GPA differs significantly from your cumulative GPA.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="majors">Major(s) *</Label>
          <Input id="majors" value={data.majors} onChange={e => updateData({ majors: e.target.value })} placeholder="e.g. Political Science, Philosophy" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minors">Minor(s)</Label>
          <Input id="minors" value={data.minors} onChange={e => updateData({ minors: e.target.value })} placeholder="Optional" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Year in School *</Label>
        <Select value={data.currentYear} onValueChange={v => updateData({ currentYear: v as any })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate Student', 'Alumni / Recent Graduate', 'Other'].map(y => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Graduate Education</p>
            <p className="text-xs text-muted-foreground">Do you have or are you pursuing a graduate degree?</p>
          </div>
          <Switch checked={data.hasGraduateDegree} onCheckedChange={c => updateData({ hasGraduateDegree: c })} />
        </div>

        {data.hasGraduateDegree && (
          <div className="space-y-4 pt-2 border-t">
            <div className="space-y-2">
              <Label>Graduate Institution</Label>
              <Select value={data.graduateInstitution || ''} onValueChange={v => updateData({ graduateInstitution: v })}>
                <SelectTrigger><SelectValue placeholder="Select institution" /></SelectTrigger>
                <SelectContent>
                  {sampleInstitutions.map(i => (
                    <SelectItem key={i} value={i}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Degree Type</Label>
                <Select value={data.graduateDegreeType || ''} onValueChange={v => updateData({ graduateDegreeType: v as any })}>
                  <SelectTrigger><SelectValue placeholder="Select degree" /></SelectTrigger>
                  <SelectContent>
                    {['MA', 'MS', 'MBA', 'PhD', 'Other'].map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Graduate GPA</Label>
                <Input type="number" step="0.01" min="0" max="4.0" value={data.graduateGPA || ''} onChange={e => updateData({ graduateGPA: parseFloat(e.target.value) || undefined })} placeholder="e.g. 3.75" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Field / Concentration</Label>
              <Input value={data.graduateField || ''} onChange={e => updateData({ graduateField: e.target.value })} placeholder="e.g. Public Policy" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
