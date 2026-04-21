import { useNavigate } from 'react-router-dom';
import { GoogleIcon, AppleIcon } from './AuthCard';

export function SocialButtons({ advisorId: _advisorId }: { advisorId?: string | null }) {
  const navigate = useNavigate();

  // Dummy bypass: skip OAuth and route straight to intake.
  const handleOAuth = (_provider: 'google' | 'apple') => {
    navigate('/intake', { replace: true });
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => handleOAuth('google')}
        className="w-full flex items-center justify-center gap-3 bg-white border border-input rounded-2xl h-11 text-[15px] font-medium text-foreground/80 hover:bg-muted/50 transition-colors"
      >
        <GoogleIcon />
        Continue with Google
      </button>
      <button
        type="button"
        onClick={() => handleOAuth('apple')}
        className="w-full flex items-center justify-center gap-3 bg-black hover:bg-[#1a1a1a] text-white rounded-2xl h-11 text-[15px] font-medium transition-colors"
      >
        <AppleIcon />
        Continue with Apple
      </button>
    </div>
  );
}

export function EmailDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[13px] text-muted-foreground">or continue with email</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}