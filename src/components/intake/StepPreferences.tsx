import { useIntake } from '@/contexts/IntakeContext';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PracticeArea, GeographicRegion } from '@/types/intake';

const practiceAreas: PracticeArea[] = ['Litigation', 'Corporate', 'Public Interest', 'Criminal', 'IP', 'Unsure'];
const regions: GeographicRegion[] = ['Northeast', 'California', 'Texas', 'Midwest', 'Southeast', 'No preference'];

export function StepPreferences() {
  const { data, updateData } = useIntake();

  const togglePracticeArea = (area: PracticeArea) => {
    const current = data.practiceAreaInterest;
    if (current.includes(area)) {
      updateData({ practiceAreaInterest: current.filter(a => a !== area) });
    } else {
      updateData({ practiceAreaInterest: [...current, area] });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-heading text-foreground mb-1">Goals & Preferences</h2>
        <p className="text-muted-foreground">Help us understand what drives your interest in law school.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="whyLaw">Why do you want to go to law school? *</Label>
        <Textarea
          id="whyLaw"
          value={data.whyLawSchool}
          onChange={e => updateData({ whyLawSchool: e.target.value })}
          placeholder="Describe what motivates your interest in law school..."
          className="min-h-[100px]"
        />
        <p className="text-xs text-muted-foreground">Be specific — this helps personalize your recommendations.</p>
      </div>

      <div className="space-y-3">
        <Label>Practice Area Interest *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {practiceAreas.map(area => (
            <div key={area} className="flex items-center gap-2">
              <Checkbox
                id={`area-${area}`}
                checked={data.practiceAreaInterest.includes(area)}
                onCheckedChange={() => togglePracticeArea(area)}
              />
              <Label htmlFor={`area-${area}`} className="text-sm font-normal cursor-pointer">{area}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Geographic Preference *</Label>
          <Select value={data.geographicPreference} onValueChange={v => updateData({ geographicPreference: v as GeographicRegion })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {regions.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>How strong is this preference?</Label>
          <Select value={data.geographicStrength} onValueChange={v => updateData({ geographicStrength: v as any })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Very strong">Very strong — I need to be in this region</SelectItem>
              <SelectItem value="Preferred but flexible">Preferred but flexible</SelectItem>
              <SelectItem value="Open to anywhere">Open to anywhere</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Intended Law School Start Year *</Label>
          <Select value={String(data.intendedStartYear)} onValueChange={v => updateData({ intendedStartYear: Number(v) })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + 1 + i).map(y => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Application Timing Intent *</Label>
          <Select value={data.applicationTimingIntent} onValueChange={v => updateData({ applicationTimingIntent: v as any })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="This cycle">This cycle</SelectItem>
              <SelectItem value="Next cycle">Next cycle</SelectItem>
              <SelectItem value="Not sure">Not sure</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
