import { useIntake } from '@/contexts/IntakeContext';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { lawSchools } from '@/data/lawSchools';

export function StepSchoolSelection() {
  const { data, updateData } = useIntake();

  const toggleSchool = (id: string) => {
    const current = data.selectedSchools;
    if (current.includes(id)) {
      updateData({ selectedSchools: current.filter(s => s !== id) });
    } else {
      updateData({ selectedSchools: [...current, id] });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-heading text-foreground mb-1">School Selection</h2>
        <p className="text-muted-foreground">Select the law schools you're considering. We'll assess each one against your profile.</p>
      </div>

      <p className="text-sm text-muted-foreground">
        Selected: {data.selectedSchools.length} school{data.selectedSchools.length !== 1 ? 's' : ''}
      </p>

      <div className="grid grid-cols-1 gap-2">
        {lawSchools.map(school => (
          <div
            key={school.id}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              data.selectedSchools.includes(school.id)
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/30 hover:bg-muted/30'
            }`}
            onClick={() => toggleSchool(school.id)}
          >
            <Checkbox
              checked={data.selectedSchools.includes(school.id)}
              onCheckedChange={() => toggleSchool(school.id)}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-foreground">{school.name}</span>
                {school.acceptsJDNext && (
                  <span className="tag-jd-next text-[10px]">JD-Next Accepted</span>
                )}
              </div>
              <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                <span>GPA Median: {school.gpa50}</span>
                <span>LSAT Median: {school.lsat50}</span>
                <span>{school.primaryPlacementRegion}</span>
                <span className="capitalize">{school.regionalPortability}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
