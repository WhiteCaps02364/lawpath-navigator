import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GoogleIcon, AppleIcon } from './AuthCard';

export function SocialButtons({ advisorId }: { advisorId?: string | null }) {
  const { toast } = useToast();

  const handleOAuth = async (provider: 'google' | 'apple') => {
    const redirectTo = `${window.location.origin}/auth/callback${advisorId ? `?advisor=${advisorId}` : ''}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
    if (error) {
      toast({
        title: `${provider === 'google' ? 'Google' : 'Apple'} sign-in unavailable`,
        description: error.message.includes('provider is not enabled')
          ? 'This provider hasn\'t been configured yet. Please use email or try the other option.'
          : error.message,
        variant: 'destructive',
      });
    }
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