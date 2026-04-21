import { ArrowRight } from 'lucide-react';

export default function PreviewStudentExperience() {
  const launch = () => {
    window.open('/intake?demo=1', '_blank');
  };
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-heading font-bold text-[#1A365D]">See What Your Students Experience</h1>
      <p className="text-base text-muted-foreground">
        Walk through the intake form and report exactly as your students will see it.
      </p>
      <button onClick={launch} className="inline-flex items-center gap-2 bg-[#1A365D] text-white px-6 py-3 rounded-md font-medium hover:bg-[#1A365D]/90">
        Launch Student Preview <ArrowRight className="w-4 h-4" />
      </button>
      <p className="text-xs text-muted-foreground">
        Opens in a new tab pre-filled with realistic sample data. Demo mode does not save any data.
      </p>
    </div>
  );
}