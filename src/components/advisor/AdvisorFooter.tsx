import jdnLogo from '@/assets/jdn-logo.png';

export function AdvisorFooter() {
  return (
    <footer className="w-full bg-[#1A365D] px-4 py-4">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 text-center sm:flex-row">
        <img src={jdnLogo} alt="JD-Next" style={{ height: 40, width: 'auto' }} />
        <p className="text-[13px] text-gray-300">Pre-Law Advisory Engine — Powered by JD-Next</p>
        <p className="text-[13px] text-gray-300">© JD-Next / Aspen Publishing</p>
      </div>
    </footer>
  );
}