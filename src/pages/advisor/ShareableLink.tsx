import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useAdvisorDemo } from '@/contexts/AdvisorDemoContext';
import { buildAdvisorUrl } from '@/lib/advisorSlug';

export default function ShareableLink() {
  const { advisor } = useAdvisorDemo();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!advisor) return null;
  const url = buildAdvisorUrl(advisor.slug, advisor.institution);
  const fullUrl = `https://${url}`;

  const emailBody = `Subject: Complete This Before Our Next Meeting — Free Pre-Law Advising Tool

Hi [Student Name],

Before our next advising meeting, I'd like you to complete a short pre-law assessment that will help us make the most of our time together.

Click the link below to get started:
${fullUrl}

It takes about 10 minutes and will generate a personalized report covering your readiness level, school list analysis, testing strategy, and recommended next steps. Once you complete it, your report will come directly to me so I can review it before we meet.

This tool is free and was built specifically to support pre-law advising. There's nothing to prepare — just answer the questions as honestly as you can.

See you soon,
${advisor.firstName} ${advisor.lastName}`;

  const textMessage = `Hi [Name] — before we meet, please complete this free 10-minute pre-law assessment: ${fullUrl}. Your report will come straight to me. Let me know if you have questions!`;

  const copy = (val: string, setter: (b: boolean) => void) => {
    navigator.clipboard.writeText(val);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-bold text-[#1A365D]">Your Custom Advisor Link</h1>
        <p className="text-base text-muted-foreground">
          Share this link with your advisees. When they click it, they'll see your personal advisor profile page and their completed report will be sent directly to your dashboard.
        </p>
      </div>

      <div className="bg-white border rounded-xl p-5 space-y-4">
        <code className="block text-base font-mono bg-muted rounded px-4 py-3 break-all">{url}</code>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => copy(fullUrl, setCopiedLink)} className="inline-flex items-center gap-2 bg-[#1A365D] text-white px-4 py-2 rounded font-medium text-sm">
            {copiedLink ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
          </button>
          <a
            href={`/advisor/${advisor.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-[#1A365D] text-[#1A365D] px-4 py-2 rounded font-medium text-sm hover:bg-muted"
          >
            Open My Profile Page
          </a>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-heading font-bold text-[#1A365D]">Ready-to-Send Email for Your Advisees</h2>
        <pre className="bg-muted text-sm rounded-lg p-4 whitespace-pre-wrap font-sans">{emailBody}</pre>
        <button onClick={() => copy(emailBody, setCopiedEmail)} className="inline-flex items-center gap-2 bg-[#1A365D] text-white px-4 py-2 rounded font-medium text-sm">
          {copiedEmail ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Email</>}
        </button>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-heading font-bold text-[#1A365D]">Suggested Text Message</h2>
        <pre className="bg-muted text-sm rounded-lg p-4 whitespace-pre-wrap font-sans">{textMessage}</pre>
        <button onClick={() => copy(textMessage, setCopiedText)} className="inline-flex items-center gap-2 bg-[#1A365D] text-white px-4 py-2 rounded font-medium text-sm">
          {copiedText ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Text</>}
        </button>
      </div>
    </div>
  );
}