import { useIntake } from '@/contexts/IntakeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function StepTesting() {
  const { data, updateData } = useIntake();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-heading text-foreground mb-1">Testing</h2>
        <p className="text-muted-foreground">Enter any test scores you have. All fields are optional.</p>
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
            <div className="space-y-2">
              <Label>LSAT Date</Label>
              <Input type="date" value={data.lsatDate || ''} onChange={e => updateData({ lsatDate: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>GRE Score (Highest)</Label>
              <Input type="number" min="260" max="340" value={data.greScore || ''} onChange={e => updateData({ greScore: parseInt(e.target.value) || undefined })} placeholder="260–340" />
            </div>
            <div className="space-y-2">
              <Label>GRE Date</Label>
              <Input type="date" value={data.greDate || ''} onChange={e => updateData({ greDate: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>JD-Next Score</Label>
              <Input type="number" value={data.jdNextScore || ''} onChange={e => updateData({ jdNextScore: parseInt(e.target.value) || undefined })} placeholder="Score" />
            </div>
            <div className="space-y-2">
              <Label>JD-Next Date</Label>
              <Input type="date" value={data.jdNextDate || ''} onChange={e => updateData({ jdNextDate: e.target.value })} />
            </div>
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
