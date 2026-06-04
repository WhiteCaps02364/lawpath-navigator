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

export function stateOverlapsSchool(state: string | undefined, school: LawSchool): boolean {
  if (!state || state === 'No preference') return false;
  const region = STATE_TO_REGION[state];
  if (!region) return false;
  return region === school.primaryPlacementRegion;
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

  const firstChoice = studentData.firstChoiceState && studentData.firstChoiceState !== 'No preference' ? studentData.firstChoiceState : '';
  const secondChoice = studentData.secondChoiceState && studentData.secondChoiceState !== 'No preference' ? studentData.secondChoiceState : '';
  const thirdChoice = studentData.thirdChoiceState && studentData.thirdChoiceState !== 'No preference' ? studentData.thirdChoiceState : '';
  const states = [firstChoice, secondChoice, thirdChoice].filter(Boolean);

  // At a glance
  const belowGPA25 = selected.filter(s => studentGPA < s.gpa25).length;
  const gpa25Min = Math.min(...selected.map(s => s.gpa25));
  const gpa25Max = Math.max(...selected.map(s => s.gpa25));

  const lsat25Min = Math.min(...selected.map(s => s.lsat25));
  const lsat25Max = Math.max(...selected.map(s => s.lsat25));
  const belowLSAT25 = studentLSAT != null ? selected.filter(s => studentLSAT! < s.lsat25).length : 0;

  // Geographic overlap on first choice state
  const firstChoiceMatches = firstChoice ? selected.filter(s => stateOverlapsSchool(firstChoice, s)).length : 0;
  const anyPreferredMatches = states.some(st => selected.some(s => stateOverlapsSchool(st, s)));
  let geoFitLabel = 'No overlap detected';
  if (firstChoice) {
    if (firstChoiceMatches === selected.length && selected.length > 0) geoFitLabel = 'Strong overlap';
    else if (firstChoiceMatches >= 2) geoFitLabel = 'Partial overlap';
    else if (firstChoiceMatches >= 1) geoFitLabel = 'Limited overlap';
    else if (anyPreferredMatches) geoFitLabel = 'Limited overlap';
    else geoFitLabel = 'No overlap detected';
  } else if (!anyPreferredMatches) {
    geoFitLabel = 'No overlap detected';
  }
  const geoFit = `${geoFitLabel} — see Where Graduates Practice above for details`;

  const limitedGeo = geoFitLabel === 'No overlap detected' || geoFitLabel === 'Limited overlap';

  let nextStep = 'Your profile is well-positioned relative to your selected schools. Focus on application quality, recommender strength, and a compelling personal statement.';
  if (belowGPA25 > selected.length / 2) {
    nextStep = 'Your school list may benefit from rebalancing. Consider discussing reach, target, and safety options with your advisor or reviewing the school cards above.';
  } else if (studentLSAT != null && belowLSAT25 > selected.length / 2) {
    nextStep = 'A stronger test score would improve your competitiveness at most of your selected schools. Consider an LSAT retake or explore JD-Next as a supplemental credential.';
  } else if (limitedGeo && firstChoice) {
    nextStep = 'Most of your selected schools place graduates outside your preferred practice location. Consider researching regional schools closer to where you want to work, or plan for proactive networking in your target market.';
  }

  const headerBar = (text: string, bg: string) => (
    <div className="px-4 py-2 text-center font-bold text-white text-sm tracking-wide" style={{ background: bg }}>
      {text}
    </div>
  );

  const rowShade = (i: number) => (i % 2 === 0 ? 'bg-gray-50' : 'bg-white');

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
        Source: ABA 509 Disclosure Reports (most recent available). This chart compares your academic profile against published admissions data for your selected schools. It is for informational purposes only — no predictions or admissions likelihood estimates are made or implied.
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

      {/* Where Graduates Practice */}
      <div className="mt-2">
        {headerBar('WHERE GRADUATES PRACTICE', GOLD)}
        <div className="p-3 overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left text-xs font-semibold px-3 py-2 bg-gray-100 text-gray-700 border border-gray-200">&nbsp;</th>
                {selected.map(s => (
                  <th key={s.id} className="text-xs font-semibold px-3 py-2 bg-gray-100 text-gray-800 text-center border border-gray-200">{s.name}</th>
                ))}
                <th className="text-xs font-semibold px-3 py-2 text-center text-white border border-gray-200" style={{ background: NAVY }}>Your Preference</th>
              </tr>
            </thead>
            <tbody>
              <tr className={rowShade(0)}>
                <td className="text-xs font-medium px-3 py-2 text-gray-700 border border-gray-200">Where Majority of Graduates Practice</td>
                {selected.map(s => (
                  <td key={s.id} className="text-sm px-3 py-2 text-center border border-gray-200">{s.primaryPlacementRegion}</td>
                ))}
                <td className="px-3 py-2 border border-gray-200 text-center text-gray-400">—</td>
              </tr>
              {([
                ['Your First Choice State', firstChoice],
                ['Your Second Choice State', secondChoice],
                ['Your Third Choice State', thirdChoice],
              ] as const)
                .filter(([, st]) => !!st)
                .map(([label, st], idx) => (
                  <tr key={label} className={rowShade(idx + 1)}>
                    <td className="text-xs font-medium px-3 py-2 text-gray-700 border border-gray-200">{label}</td>
                    {selected.map(s => {
                      const overlap = stateOverlapsSchool(st, s);
                      return (
                        <td key={s.id} className="text-sm px-3 py-2 text-center border border-gray-200">
                          {overlap ? (
                            <span style={{ color: '#15803d', fontWeight: 600 }}>✓ Overlap</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="text-sm px-3 py-2 text-center border border-gray-200 font-bold" style={{ color: NAVY }}>{st}</td>
                  </tr>
                ))}
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
        ABA 509 data reflects enrolled 1L class statistics from the most recent available disclosure year. Primary placement region reflects where the majority of graduates practice based on ABA employment disclosure reports. This chart is for informational comparison purposes only — no predictions or admissions likelihood estimates are made or implied. Individual outcomes vary significantly. Verify current data directly with each law school and at abarequireddisclosures.org.
      </p>
    </div>
  );
}