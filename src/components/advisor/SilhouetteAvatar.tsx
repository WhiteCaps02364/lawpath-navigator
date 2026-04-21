import { User } from 'lucide-react';

export function SilhouetteAvatar({ size = 64, bordered = false }: { size?: number; bordered?: boolean }) {
  return (
    <div
      className={`rounded-full bg-muted flex items-center justify-center overflow-hidden ${bordered ? 'border-2 border-[#1A365D]/30' : ''}`}
      style={{ width: size, height: size }}
      aria-label="Advisor avatar"
    >
      <User className="text-white" style={{ width: size * 0.55, height: size * 0.55 }} strokeWidth={1.5} />
    </div>
  );
}