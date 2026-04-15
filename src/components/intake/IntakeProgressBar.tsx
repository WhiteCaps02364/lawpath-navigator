import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  labels: string[];
}

export function IntakeProgressBar({ current, total, labels }: ProgressBarProps) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          Step {current + 1} of {total}
        </span>
        <span className="text-sm text-muted-foreground">
          {labels[current]}
        </span>
      </div>
      <div className="intake-progress-bar">
        <motion.div
          className="intake-progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
