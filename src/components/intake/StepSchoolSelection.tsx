import { useState } from 'react';
import { useIntake } from '@/contexts/IntakeContext';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { lawSchools } from '@/data/lawSchools';

export function StepSchoolSelection() {
  const { data, updateData } = useIntake();
  const [search, setSearch] = useState('');

  const toggleSchool = (id: string) => {
    const current = data.selectedSchools;
    if (current.includes(id)) {
      updateData({ selectedSchools: current.filter(s => s !== id) });
    } else {
      updateData({ selectedSchools: [...current, id] });
    }
  };

  const filteredSchools = lawSchools.filter(s =>
    s.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-heading text-foreground mb-1">Which Law Schools Are You Considering?</h2>
        <p className="text-muted-foreground">Select up to five schools. We'll compare each one against your GPA, assess whether your list is realistic, and flag which schools accept JD-Next as a primary admissions test.</p>
      </div>

      <p className="text-sm text-muted-foreground">
        Selected: {data.selectedSchools.length} of 5 schools
      </p>

      <Input
        type="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by school name..."
      />

      <div className="grid grid-cols-1 gap-2">
        {filteredSchools.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No schools found. Try a different search term.</p>
        ) : (
          filteredSchools.map(school => (
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
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#C9A84C] text-white">JD-Next Accepted</span>
                )}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                <span>GPA Median: {school.gpa50}</span>
                <span className="mx-2 text-border">|</span>
                <span>LSAT Median: {school.lsat50}</span>
                <span className="mx-2 text-border">|</span>
                <span>{school.primaryPlacementRegion}</span>
                <span className="mx-2 text-border">|</span>
                <span className="capitalize">{school.regionalPortability}</span>
              </div>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}
