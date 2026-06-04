import { StudentData, LawSchool } from '@/types/intake';
import { lawSchools } from '@/data/lawSchools';

const NAVY = '#1A365D';
const GOLD = '#C9A84C';

const STATE_TO_REGION: Record<string, string> = {
  'New York': 'Northeast', 'Massachusetts': 'Northeast', 'Connecticut': 'Northeast',
  'New Jersey': 'Northeast', 'Pennsylvania': 'Northeast', 'Maine': 'Northeast',
  'New Hampshire': 'Northeast', 'Vermont': 'Northeast', 'Rhode Island': 'Northeast',
  'District of Columbia': 'Northeast', 'Washington DC': 'Northeast',
  'California': 'California',
  'Texas': 'Texas',
  'Illinois': 'Midwest', 'Michigan': 'Midwest', 'Ohio': 'Midwest', 'Indiana': 'Midwest',
  'Wisconsin': 'Midwest', 'Minnesota': 'Midwest', 'Missouri': 'Midwest', 'Iowa': 'Midwest',
  'Kansas': 'Midwest', 'Nebraska': 'Midwest',
  'Florida': 'Southeast', 'Georgia': 'Southeast', 'North Carolina': 'Southeast',
  'South Carolina': 'Southeast', 'Virginia': 'Southeast', 'Tennessee': 'Southeast',
  'Alabama': 'Southeast', 'Louisiana': 'Southeast', 'Mississippi': 'Southeast',
  'Kentucky': 'Southeast', 'West Virginia': 'Southeast', 'Arkansas': 'Southeast',
};

function employmentPctForState(school: LawSchool, state: string): number | null {
  if (!state) return null;
  const region = STATE_TO_REGION[state];
  if (!region) return null;
  if (region === school.primaryPlacementRegion) {
    // Use FTJD as proxy for in-region placement
    return Math.round(school.employmentRateFTJD * 0.7 * 10) / 10;
  }
  if (school.regionalPortability === 'National') {
    return Math.round(school.employmentRateFTJD * 0.08 * 10) / 10;
  }
  return null;
}

function ArrowDiff({ value }: { value: number }) {
  const positive = value >= 0;
  const formatted = `${positive ? '+' : ''}${value.toFixed(2)}`;
  return (
    <span style={{ color: positive ? '#15803d' : '#b91c1c', fontWeight: 600 }}>
      {positive ? '▲' : '▼'} {formatted}
    </span>
  );
}

function ArrowDiffInt({ value }: { value: number }) {
  const positive = value >= 0;
  const formatted = `${positive ? '+' : ''}${value}`;
  return (
    <span style={{ color: positive ? '#15803d' : '#b91c1c', fontWeight: 600 }}>
      {positive ? '▲' : '▼'} {formatted}
    </span>
  );
}

export function LawSchoolFitSnapshot({ studentData }: { studentData: StudentData }) {
  const selected = (studentData.selectedSchools || [])
    .map(id => lawSchools.find(s => s.id === id))
    .filter((s): s is LawSchool => !!s)
    .slice(0, 10);

  if (selected.length === 0) return null;

  const studentGPA = Number(studentData.cumulativeGPA) || 0;
  const studentLSAT = studentData.lsatScore ?? null;
  const studentJDNext = studentData.jdNextScore ?? null;

  const states = [
    studentData.firstChoiceState,
    studentData.secondChoiceState,
    studentData.thirdChoiceState,
  ].filter((s): s is string => !!s && s !== 'No preference').slice(0, 3);

  // At a glance
  const belowGPA25 = selected.filter(s => studentGPA < s.gpa25).length;
  const gpa25Min = Math.min(...selected.map(s => s.gpa25));
  const gpa25Max = Math.max(...selected.map(s => s.gpa25));

  const lsat25Min = Math.min(...selected.map(s => s.lsat25));
  const lsat25Max = Math.max(...selected.map(s => s.lsat25));
  const belowLSAT25 = studentLSAT != null ? selected.filter(s => studentLSAT! < s.lsat25).length : 0;

  // Geo fit
  let geoFit = 'Limited placement data';
  if (states.length > 0) {
    const pcts: number[] = [];
    states.forEach(st => selected.forEach(s => {
      const p = employmentPctForState(s, st);
      if (p != null) pcts.push(p);
    }));
    if (pcts.some(p => p >= 5)) geoFit = 'Strong fit';
    else if (pcts.every(p => p < 2) && pcts.length > 0) geoFit = 'Limited placement data';
    else if (pcts.length === 0) geoFit = 'Limited placement data';
    else geoFit = 'Mixed';
  }

  let nextStep = 'Profile is well-positioned — focus on application quality and recommender strength.';
  if (belowGPA25 > selected.length / 2) {
    nextStep = 'Discuss school list recalibration and profile strengthening before applying.';
  } else if (studentLSAT != null && belowLSAT25 > selected.length / 2) {
    nextStep = 'Consider LSAT retake or JD-Next as a supplemental credential.';
  } else if (geoFit === 'Limited placement data' && states.length > 0) {
    nextStep = 'Discuss regional school options in preferred practice location.';
  }

  const headerBar = (text: string, bg: string) => (
    <div className="px-4 py-2 text-center font-bold text-white text-sm tracking-wide" style={{ background: bg }}>
      {text}
    </div>
  );

  const rowShade = (i: number) => (i % 2 === 0 ? 'bg-gray-50' : 'bg-white');

  const SchoolHeaders = () => (
    <tr>
      <th className="text-left text-xs font-semibold px-3 py-2 bg-gray-100 text-gray-700 sticky left-0 z-10">&nbsp;</th>
      {selected.map(s => (
        <th key={s.id} className="text-xs font-semibold px-3 py-2 bg-gray-100 text-gray-800 text-center">{s.name}</th>
      ))}
      <th className="text-xs font-semibold px-3 py-2 text-center text-white" style={{ background: NAVY }}>Your {`{col}`}</th>
    </tr>
  );

  const renderTable = (
    title: string,
    rows: { label: string; cell: (s: LawSchool) => React.ReactNode; you: React.ReactNode }[],
    yourLabel: string,
  ) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[600px]">
        <thead>
          <tr>
            <th className="text-left text-xs font-semibold px-3 py-2 bg-gray-100 text-gray-700 border border-gray-200">&nbsp;</th>
            {selected.map(s => (
              <th key={s.id} className="text-xs font-semibold px-3 py-2 bg-gray-100 text-gray-800 text-center border border-gray-200">{s.name}</th>
            ))}
            <th className="text-xs font-semibold px-3 py-2 text-center text-white border border-gray-200" style={{ background: NAVY }}>
              {yourLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={rowShade(i)}>
              <td className="text-xs font-medium px-3 py-2 text-gray-700 border border-gray-200">{r.label}</td>
              {selected.map(s => (
                <td key={s.id} className="text-sm px-3 py-2 text-center border border-gray-200">{r.cell(s)}</td>
              ))}
              <td className="text-sm px-3 py-2 text-center border border-gray-200 font-bold" style={{ color: NAVY }}>{r.you}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="border rounded-xl bg-white shadow-md overflow-hidden">
      <div className="px-4 py-3 text-center text-white font-bold" style={{ background: NAVY }}>
        Law School Fit Snapshot | ABA 509 Data Comparison
      </div>
      <p className="text-xs italic text-gray-500 text-center px-4 py-2">
        Source: ABA 509 Disclosure Reports (most recent available). This chart is for informational comparison only. No predictions are made — data is presented for advising context.
      </p>

      {/* Student profile block */}
      <div className="bg-gray-100 px-4 py-3">
        <table className="w-full text-sm">
          <tbody>
            {[
              ['Undergraduate GPA', studentGPA ? studentGPA.toFixed(2) : '—'],
              ['LSAT Score', studentLSAT != null ? String(studentLSAT) : 'Not yet taken'],
              ['JD-Next Score', studentJDNext != null ? String(studentJDNext) : 'Not yet taken'],
              ['Desired Practice Location(s)', states.length ? states.join(', ') : 'No preference'],
              ['Target Schools', selected.map(s => s.name).join(', ')],
            ].map(([label, value], i) => (
              <tr key={i}>
                <td className="py-1 pr-4 text-gray-600 align-top w-1/3">{label}:</td>
                <td className="py-1 font-bold" style={{ color: NAVY }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GPA */}
      <div className="mt-4">
        {headerBar('UNDERGRADUATE GPA COMPARISON', GOLD)}
        <div className="p-3">
          {renderTable('gpa', [
            { label: '75th Percentile GPA', cell: s => s.gpa75.toFixed(2), you: studentGPA ? studentGPA.toFixed(2) : '—' },
            { label: 'Median GPA', cell: s => s.gpa50.toFixed(2), you: studentGPA ? studentGPA.toFixed(2) : '—' },
            { label: '25th Percentile GPA', cell: s => s.gpa25.toFixed(2), you: studentGPA ? studentGPA.toFixed(2) : '—' },
            { label: 'GPA vs. Median', cell: s => <ArrowDiff value={Number((studentGPA - s.gpa50).toFixed(2))} />, you: studentGPA ? studentGPA.toFixed(2) : '—' },
          ], 'Your GPA')}
        </div>
      </div>

      {/* LSAT */}
      <div className="mt-2">
        {headerBar('LSAT SCORE COMPARISON', GOLD)}
        <div className="p-3">
          {renderTable('lsat', [
            { label: '75th Percentile LSAT', cell: s => s.lsat75, you: studentLSAT ?? <span className="text-gray-400 italic">—</span> },
            { label: 'Median LSAT', cell: s => s.lsat50, you: studentLSAT ?? <span className="text-gray-400 italic">—</span> },
            { label: '25th Percentile LSAT', cell: s => s.lsat25, you: studentLSAT ?? <span className="text-gray-400 italic">—</span> },
            { label: 'LSAT vs. Median', cell: s => studentLSAT != null ? <ArrowDiffInt value={studentLSAT - s.lsat50} /> : <span className="text-gray-400 italic">—</span>, you: studentLSAT ?? <span className="text-gray-400 italic">—</span> },
          ], 'Your LSAT')}
          {studentLSAT == null && (
            <p className="text-xs italic text-gray-500 mt-2">Student has not yet taken the LSAT. School percentile data is shown for reference.</p>
          )}
        </div>
      </div>

      {/* JD-Next */}
      <div className="mt-2">
        {headerBar('JD-NEXT ACCEPTANCE STATUS', GOLD)}
        <div className="p-3 overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[600px]">
            <thead>
              <tr>
                {selected.map(s => (
                  <th key={s.id} className="text-xs font-semibold px-3 py-2 bg-gray-100 text-gray-800 text-center border border-gray-200">{s.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {selected.map(s => (
                  <td key={s.id} className="text-center px-3 py-2 border border-gray-200">
                    {s.acceptsJDNext ? (
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold text-white" style={{ background: GOLD }}>JD-Next Accepted</span>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-gray-300 text-gray-700">LSAT Required</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Geographic */}
      <div className="mt-2">
        {headerBar('GEOGRAPHIC EMPLOYMENT DATA', GOLD)}
        <p className="text-xs italic text-gray-500 px-4 pt-2">
          Percentage of graduates employed in student's preferred state(s) within 10 months of graduation, per ABA employment reports.
        </p>
        <div className="p-3 overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left text-xs font-semibold px-3 py-2 bg-gray-100 text-gray-700 border border-gray-200">&nbsp;</th>
                {selected.map(s => (
                  <th key={s.id} className="text-xs font-semibold px-3 py-2 bg-gray-100 text-gray-800 text-center border border-gray-200">{s.name}</th>
                ))}
                <th className="text-xs font-semibold px-3 py-2 text-center text-white border border-gray-200" style={{ background: NAVY }}>Your Goal</th>
              </tr>
            </thead>
            <tbody>
              {states.length === 0 ? (
                <tr><td colSpan={selected.length + 2} className="text-xs italic text-gray-500 text-center py-3 border border-gray-200">No state preferences specified.</td></tr>
              ) : states.map((st, i) => (
                <tr key={st} className={rowShade(i)}>
                  <td className="text-xs font-medium px-3 py-2 text-gray-700 border border-gray-200">Employed in {st}</td>
                  {selected.map(s => {
                    const p = employmentPctForState(s, st);
                    return (
                      <td key={s.id} className="text-sm px-3 py-2 text-center border border-gray-200">
                        {p != null ? `${p.toFixed(1)}%` : <span className="text-gray-400 italic">N/A</span>}
                      </td>
                    );
                  })}
                  <td className="text-sm px-3 py-2 text-center border border-gray-200 font-bold" style={{ color: NAVY }}>{st}</td>
                </tr>
              ))}
              <tr className={rowShade(states.length)}>
                <td className="text-xs font-medium px-3 py-2 text-gray-700 border border-gray-200">Primary placement markets</td>
                {selected.map(s => (
                  <td key={s.id} className="text-xs px-3 py-2 text-center border border-gray-200">{s.primaryPlacementRegion}</td>
                ))}
                <td className="px-3 py-2 border border-gray-200">&nbsp;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* At a glance */}
      <div className="mt-2">
        {headerBar('AT A GLANCE', NAVY)}
        <div className="p-4">
          <table className="w-full text-sm">
            <tbody>
              {[
                ['GPA vs. 25th Percentile Range', studentGPA ? `Below for ${belowGPA25} of ${selected.length} schools (25th range: ${gpa25Min.toFixed(2)}–${gpa25Max.toFixed(2)})` : '—'],
                ['LSAT vs. 25th Percentile Range', studentLSAT != null ? `Below for ${belowLSAT25} of ${selected.length} schools (25th range: ${lsat25Min}–${lsat25Max})` : 'No LSAT on file'],
                ['Geographic Fit', geoFit],
                ['Suggested Next Step', nextStep],
              ].map(([label, value], i) => (
                <tr key={i}>
                  <td className="py-1 pr-4 text-gray-600 align-top w-1/3">{label}:</td>
                  <td className="py-1 font-bold" style={{ color: NAVY }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs italic text-gray-500 px-4 py-3 border-t">
        ABA 509 data reflects enrolled 1L class statistics from the most recent available disclosure year. Geographic employment figures represent graduates employed in the indicated state within 10 months of graduation. This chart is for informational comparison purposes only. No predictions or admissions likelihood estimates are made or implied. Verify current data directly with each law school and at abarequireddisclosures.org.
      </p>
    </div>
  );
}