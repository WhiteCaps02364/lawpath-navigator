import { Check } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  total: number;
  labels: string[];
  maxReached?: number;
  onStepClick?: (step: number) => void;
}

export function IntakeProgressBar({ current, total, labels, maxReached = current, onStepClick }: ProgressBarProps) {
  return (
    <nav aria-label="Form progress" className="w-full max-w-2xl mx-auto mb-8">
      <div className="text-sm font-medium text-foreground mb-3">
        Step {current + 1} of {total}: <span className="text-muted-foreground">{labels[current]}</span>
      </div>
      <ol className="flex items-start">
        {labels.map((label, i) => {
          const done = i < current || (i <= maxReached && i !== current);
          const active = i === current;
          const clickable = !active && i <= maxReached && !!onStepClick;
          return (
            <li key={label} className="flex-1 flex flex-col items-center relative">
              {i > 0 && (
                <span
                  className={`absolute top-4 right-1/2 w-full h-0.5 -z-0 ${i <= maxReached ? 'bg-primary' : 'bg-border'}`}
                  aria-hidden
                />
              )}
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick!(i)}
                aria-current={active ? 'step' : undefined}
                aria-label={`${label}${done ? ' (completed)' : ''}`}
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors
                  ${active ? 'bg-primary border-primary text-primary-foreground ring-4 ring-primary/20' : done ? 'bg-primary/15 border-primary text-primary hover:bg-primary/25' : 'bg-background border-border text-muted-foreground'}
                  ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {done ? <Check className="w-4 h-4" /> : i + 1}
              </button>
              <span className={`mt-2 text-[11px] leading-tight text-center px-1 hidden sm:block ${active ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
