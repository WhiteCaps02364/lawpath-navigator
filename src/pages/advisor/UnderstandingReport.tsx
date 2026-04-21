import { useNavigate } from 'react-router-dom';

const cards = [
  {
    title: 'Readiness Level — Your Starting Point',
    body: 'This is the engine\'s overall assessment of where the student stands academically. High means their GPA is competitive for most of their selected schools. Developing means they are in range but have gaps to address. Needs Preparation means the school list, timeline, or academic profile needs significant work before applying.',
    tip: 'Use this as your opening frame in the meeting. Students with Needs Preparation scores often need encouragement as much as strategy — the report is designed to be honest without being discouraging.',
  },
  {
    title: 'Strategy & Timeline — What to Do and When',
    body: 'The Strategy card tells the student what path the engine recommends based on their full profile. The Timeline card calculates months until their application cycle and tells them whether to act immediately or prepare over time.',
    tip: "If the strategy says 'Consider Legal Employment Before Applying,' this is a good meeting topic. The report has already suggested specific practice-area-matched opportunities — you can build on those.",
  },
  {
    title: 'School Assessment — Are Their Targets Realistic?',
    body: 'Every school the student selected is classified as Reach, Target, or Safety based on their GPA vs. the school\'s ABA 509 admissions percentiles. The JD-Next Accepted tag shows which schools accept JD-Next as a standalone alternative to the LSAT. The geographic alignment note flags mismatches between the student\'s preferred work location and where each school actually places graduates.',
    tip: "The geographic misalignment flag is one of the most valuable insights in the report. Most students don't know that regional schools have concentrated local placement. This is often news to them and worth discussing directly.",
  },
  {
    title: 'LSAT Score Analysis — School-by-School Comparison',
    body: 'If the student entered an LSAT score, the engine compares it against the 25th, 50th, and 75th percentile for each of their selected schools. Each school gets a position tag and a specific recommendation.',
    tip: 'Students below the 25th percentile at most of their schools need an honest conversation about retaking. The report frames JD-Next as an addendum option — you can reinforce this and explain how admissions committees view supplemental materials.',
  },
  {
    title: 'Recommender Strategy — The Section Most Students Need Most',
    body: 'The engine routes recommender guidance based on whether the student is currently enrolled, recently graduated, or a non-traditional applicant. For enrolled students it surfaces the contemporaneous letter guidance. The red warning flag appears if no professor is listed as a recommender.',
    tip: 'If you see the red flag, make this agenda item one. The single most common and avoidable application weakness is weak recommenders. This is where your relationship with the student matters most.',
  },
  {
    title: 'Your Suggested Meeting Agenda — Auto-Generated for Every Student',
    body: 'The engine generates 4–5 meeting agenda items for every student based on their specific report flags. These appear only in your dashboard view, not in the student\'s copy of the report.',
    tip: "You don't have to follow the agenda exactly — but it's a useful starting point that ensures you address the highest-priority items first. Most advising meetings run short on time; the agenda helps you spend it well.",
  },
];

export default function UnderstandingReport() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-heading font-bold text-[#1A365D]">How to Read and Use Your Students' Advisory Reports</h1>
      <p className="text-base text-muted-foreground">
        A quick guide to every section of the Pre-Law Advisory Report and how to use it in your advising meetings.
      </p>

      <div className="space-y-5">
        {cards.map((c, i) => (
          <div key={i} className="bg-white border rounded-xl p-6 space-y-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Card {i + 1}</p>
            <h3 className="text-lg font-heading font-bold text-[#1A365D]">{c.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
            <div className="mt-3 p-4 rounded bg-muted/40" style={{ borderLeft: '4px solid #C9A84C' }}>
              <p className="text-xs font-bold mb-1" style={{ color: '#8A6D1A' }}>ADVISOR TIP</p>
              <p className="text-sm">{c.tip}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#1A365D] text-white rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-heading font-bold">Ready to see a real report in action?</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/advisor-dashboard/preview')} className="bg-white text-[#1A365D] px-4 py-2 rounded font-medium text-sm">Preview Student Experience →</button>
          <button onClick={() => navigate('/advisor-dashboard/demo')} className="border border-white/40 text-white px-4 py-2 rounded font-medium text-sm">View Demo Dashboard →</button>
        </div>
      </div>
    </div>
  );
}