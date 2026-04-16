import { useIntake } from '@/contexts/IntakeContext';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PracticeArea } from '@/types/intake';

const practiceAreas: PracticeArea[] = ['Litigation', 'Corporate', 'Public Interest', 'Criminal', 'IP', 'Unsure'];

const practiceAreaLabels: Record<PracticeArea, string> = {
  'Litigation': 'Litigation',
  'Corporate': 'Corporate',
  'Public Interest': 'Public Interest',
  'Criminal': 'Criminal',
  'IP': 'Intellectual Property',
  'Unsure': 'Unsure',
};

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
];

const NONE_VALUE = '__none__';

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

  const selections = [data.firstChoiceState, data.secondChoiceState, data.thirdChoiceState].filter(
    s => s && s !== '' && s !== 'No preference'
  );
  const hasDuplicates = new Set(selections).size !== selections.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-heading text-foreground mb-1">Goals & Preferences</h2>
        <p className="text-muted-foreground">Help us understand your goals so we can build a strategy that fits where you want to go.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="whyLaw">What draws you to law school and a legal career? *</Label>
        <Textarea
          id="whyLaw"
          value={data.whyLawSchool}
          onChange={e => updateData({ whyLawSchool: e.target.value })}
          placeholder="Describe what motivates your interest in law school..."
          className="min-h-[100px]"
        />
        <div className="flex justify-between">
          <p className={`text-xs ${data.whyLawSchool.length < 50 && data.whyLawSchool.length > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {data.whyLawSchool.length < 50 && data.whyLawSchool.length > 0
              ? "Please tell us a bit more — this helps us personalize your recommendations."
              : "Be specific — this helps personalize your recommendations."}
          </p>
          <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">{data.whyLawSchool.length} characters (50 minimum)</p>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Practice Area Interest *</Label>
        <p className="text-xs text-muted-foreground -mt-2">Select all that apply.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {practiceAreas.map(area => (
            <div key={area} className="flex items-center gap-2">
              <Checkbox
                id={`area-${area}`}
                checked={data.practiceAreaInterest.includes(area)}
                onCheckedChange={() => togglePracticeArea(area)}
              />
              <Label htmlFor={`area-${area}`} className="text-sm font-normal cursor-pointer">{practiceAreaLabels[area]}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Where Do You Want to Practice?</Label>
        <p className="text-xs text-muted-foreground -mt-2">
          We'll compare your selections against ABA employment data showing where each school's graduates actually end up working. Select up to three states.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-normal">First Choice State *</Label>
            <Select
              value={data.firstChoiceState || 'No preference'}
              onValueChange={v => updateData({ firstChoiceState: v })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="No preference">No preference</SelectItem>
                {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-normal">2nd Choice State (optional)</Label>
            <Select
              value={data.secondChoiceState && data.secondChoiceState !== '' ? data.secondChoiceState : NONE_VALUE}
              onValueChange={v => updateData({ secondChoiceState: v === NONE_VALUE ? '' : v })}
            >
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_VALUE}>—</SelectItem>
                {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-normal">3rd Choice State (optional)</Label>
            <Select
              value={data.thirdChoiceState && data.thirdChoiceState !== '' ? data.thirdChoiceState : NONE_VALUE}
              onValueChange={v => updateData({ thirdChoiceState: v === NONE_VALUE ? '' : v })}
            >
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_VALUE}>—</SelectItem>
                {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        {hasDuplicates && (
          <p className="text-sm text-destructive">
            You've selected this state more than once. Please choose three different states.
          </p>
        )}
      </div>

    </div>
  );
}
