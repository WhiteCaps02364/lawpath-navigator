import { useIntake } from '@/contexts/IntakeContext';
import { lawSchools } from '@/data/lawSchools';
import { Pencil } from 'lucide-react';

type Row = [string, React.ReactNode];

function val(v: unknown): string {
  if (v === undefined || v === null || v === '' || (typeof v === 'number' && v === 0)) return '—';
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (Array.isArray(v)) return v.length ? v.join(', ') : '—';
  return String(v);
}

function Section({ title, step, rows, onEdit }: { title: string; step: number; rows: Row[]; onEdit: (s: number) => void }) {
  return (
    <section className="border rounded-lg bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <button type="button" onClick={() => onEdit(step)} className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:underline">
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
      </div>
      <dl className="divide-y">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-3 gap-3 px-4 py-2 text-sm">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="col-span-2 text-foreground whitespace-pre-wrap break-words">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function StepReview({ onEdit }: { onEdit: (step: number) => void }) {
  const { data: d } = useIntake();
  const schoolNames = d.selectedSchools.map(id => lawSchools.find(s => s.id === id)?.name ?? id);
  const recs = d.recommenders.filter(r => r.name);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-serif text-foreground">Review Your Answers</h2>
        <p className="text-sm text-muted-foreground mt-1">Check everything below. Use “Edit” to change any section — your other answers will stay as they are.</p>
      </div>
      <Section title="Personal Information" step={0} onEdit={onEdit} rows={[
        ['Name', `${d.firstName} ${d.lastName}`.trim() || '—'],
        ['School email', val(d.schoolEmail)],
        ['Personal email', val(d.personalEmail)],
        ['Undergraduate institution', val(d.undergraduateInstitution)],
        ['Graduation year', val(d.graduationYear)],
        ['Application timing', val(d.applicationTimingIntent)],
        ['Law school outreach', d.lawSchoolOptIn ? 'Opted in' : 'Not opted in'],
      ]} />
      <Section title="Academic Profile" step={1} onEdit={onEdit} rows={[
        ['Cumulative GPA', val(d.cumulativeGPA)],
        ['Major GPA', val(d.majorGPA)],
        ['Major(s)', val(d.majors)],
        ['Minor(s)', val(d.minors)],
        ['Current year', val(d.currentYear)],
        ['Graduate degree', d.hasGraduateDegree ? [d.graduateDegreeType, d.graduateField, d.graduateInstitution].filter(Boolean).join(' · ') || 'Yes' : 'No'],
      ]} />
      <Section title="Testing" step={2} onEdit={onEdit} rows={[
        ['Test status', val(d.testStatus)],
        ...(d.testStatus === 'Taken' ? [
          ['LSAT', d.lsatScore ? `${d.lsatScore}${d.lsatDate ? ` (${d.lsatDate})` : ''}` : '—'],
          ['GRE', d.greScore ? `${d.greScore}${d.greDate ? ` (${d.greDate})` : ''}` : '—'],
          ['JD-Next', d.jdNextScore ? `${d.jdNextScore}${d.jdNextDate ? ` (${d.jdNextDate})` : ''}` : '—'],
        ] as Row[] : []),
        ...(d.testStatus === 'Planned' ? [['Planned timing', val(d.plannedTestTiming)]] as Row[] : []),
        ['Testing comfort', val(d.testComfortLevel)],
      ]} />
      <Section title="Goals & Preferences" step={3} onEdit={onEdit} rows={[
        ['Why law school', val(d.whyLawSchool)],
        ['Practice areas', val(d.practiceAreaInterest)],
        ['State preferences', [d.firstChoiceState, d.secondChoiceState, d.thirdChoiceState].filter(s => s && s !== 'No preference').join(', ') || 'No preference'],
        ['Intended start year', val(d.intendedStartYear)],
      ]} />
      <Section title="Application Strength" step={4} onEdit={onEdit} rows={[
        ['Recommenders', recs.length ? recs.map(r => `${r.name} (${r.relationship}, ${r.strength})`).join('\n') : '—'],
        ['Relevant experiences', val(d.relevantExperiences)],
        ['Personal statement themes', val(d.personalStatementThemes)],
        ['Academic history notes', val(d.riskFlags)],
        ['Addendum needed', val(d.addendumNeeded)],
      ]} />
      <Section title="School Selection" step={5} onEdit={onEdit} rows={[
        ['Selected schools', schoolNames.length ? schoolNames.join('\n') : '—'],
      ]} />
    </div>
  );
}
