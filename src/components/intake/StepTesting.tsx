import { useIntake } from '@/contexts/IntakeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const years = Array.from({ length: 8 }, (_, i) => 2020 + i);

function isFutureDate(monthStr: string, yearStr: string): boolean {
  if (!monthStr || !yearStr) return false;
  const now = new Date();
  const monthIndex = months.indexOf(monthStr);
  const year = parseInt(yearStr);
  if (monthIndex === -1 || isNaN(year)) return false;
  return year > now.getFullYear() || (year === now.getFullYear() && monthIndex > now.getMonth());
}

export function isFutureDateValue(value: string | undefined): boolean {
  if (!value) return false;
  const [month, year] = value.split(' ');
  return isFutureDate(month, year);
}

function MonthYearPicker({ label, value, onChange, isFuture }: { label: string; value: string; onChange: (v: string) => void; isFuture: boolean }) {
  const [month, year] = value ? value.split(' ') : ['', ''];
  const update = (m: string, y: string) => {
    if (m && y) onChange(`${m} ${y}`);
    else if (m) onChange(m);
    else if (y) onChange(y);
    else onChange('');
  };
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid grid-cols-2 gap-2">
        <Select value={months.includes(month) ? month : ''} onValueChange={m => update(m, year)}>
          <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
          <SelectContent>
            {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={years.map(String).includes(year) ? year : ''} onValueChange={y => update(month, y)}>
          <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
          <SelectContent>
            {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {isFuture && (
        <p className="text-sm text-destructive">This date is in the future. Please enter the month and year you actually took the test, or leave this blank if you haven't tested yet.</p>
      )}
    </div>
  );
}

export function StepTesting() {
  const { data, updateData } = useIntake();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-heading text-foreground mb-1">Testing</h2>
        <p className="text-muted-foreground">Tell us where you stand with standardized testing. If you haven't tested yet, that's fine — select your status below.</p>
      </div>

      <div className="space-y-2">
        <Label>Test Status *</Label>
        <Select value={data.testStatus} onValueChange={v => updateData({ testStatus: v as any })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Taken">I've taken a test</SelectItem>
            <SelectItem value="Planned">I plan to take a test</SelectItem>
            <SelectItem value="None">I haven't decided yet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(data.testStatus === 'Taken') && (
        <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
          <p className="text-sm font-medium text-foreground">Enter your scores</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>LSAT Score (Highest)</Label>
              <Input type="number" min="120" max="180" value={data.lsatScore || ''} onChange={e => updateData({ lsatScore: parseInt(e.target.value) || undefined })} placeholder="120–180" />
            </div>
            <MonthYearPicker label="LSAT Month / Year" value={data.lsatDate || ''} onChange={v => updateData({ lsatDate: v })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>GRE Score (Highest)</Label>
              <Input type="number" min="260" max="340" value={data.greScore || ''} onChange={e => updateData({ greScore: parseInt(e.target.value) || undefined })} placeholder="260–340" />
            </div>
            <MonthYearPicker label="GRE Month / Year" value={data.greDate || ''} onChange={v => updateData({ greDate: v })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>JD-Next Score</Label>
              <Input type="number" value={data.jdNextScore || ''} onChange={e => updateData({ jdNextScore: parseInt(e.target.value) || undefined })} placeholder="400–1000" />
            </div>
            <MonthYearPicker label="JD-Next Month / Year" value={data.jdNextDate || ''} onChange={v => updateData({ jdNextDate: v })} />
          </div>
        </div>
      )}

      {data.testStatus === 'Planned' && (
        <div className="space-y-2">
          <Label>When do you plan to test?</Label>
          <Select value={data.plannedTestTiming || ''} onValueChange={v => updateData({ plannedTestTiming: v as any })}>
            <SelectTrigger><SelectValue placeholder="Select timing" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Within 3 months">Within 3 months</SelectItem>
              <SelectItem value="6 months">Within 6 months</SelectItem>
              <SelectItem value="12+ months">12+ months</SelectItem>
              <SelectItem value="Unsure">Unsure</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {data.testStatus === 'None' && (
        <div className="space-y-2">
          <Label>When might you test?</Label>
          <Select value={data.plannedTestTiming || ''} onValueChange={v => updateData({ plannedTestTiming: v as any })}>
            <SelectTrigger><SelectValue placeholder="Select timing" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Within 3 months">Within 3 months</SelectItem>
              <SelectItem value="6 months">Within 6 months</SelectItem>
              <SelectItem value="12+ months">12+ months</SelectItem>
              <SelectItem value="Unsure">Unsure</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label>How comfortable are you with standardized testing? *</Label>
        <Select value={data.testComfortLevel} onValueChange={v => updateData({ testComfortLevel: v as any })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Confident">Confident — I test well</SelectItem>
            <SelectItem value="Neutral">Neutral</SelectItem>
            <SelectItem value="Prefer to avoid">Prefer to avoid standardized tests</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
