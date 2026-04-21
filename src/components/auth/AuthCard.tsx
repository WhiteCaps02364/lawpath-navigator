import { ReactNode } from 'react';
import jdnLogo from '@/assets/jdn-logo.png';

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-[#1A365D] w-full px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <img src={jdnLogo} alt="JD-Next" style={{ height: 56, width: 'auto' }} />
          <span className="text-base text-gray-300">Pre-Law Advisory Engine</span>
        </div>
      </div>
      <div className="px-4 py-12 flex justify-center">
        <div
          className="w-full bg-white rounded-2xl border shadow-sm"
          style={{ maxWidth: 480, padding: 40 }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.4 39.6 16.1 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C41.6 35.6 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  );
}

export function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.42 2.23-1.18 3.04-.81.86-2.13 1.52-3.27 1.43-.14-1.13.41-2.31 1.18-3.07.86-.86 2.31-1.52 3.27-1.4zM20.5 17.39c-.61 1.41-.91 2.04-1.7 3.29-1.1 1.74-2.65 3.91-4.57 3.93-1.7.02-2.14-1.11-4.45-1.1-2.31.01-2.79 1.13-4.5 1.11-1.92-.02-3.39-1.99-4.49-3.73C-2.06 16.78-2.4 12.42-.99 9.86 1.16 5.93 5.46 4.79 6.85 6.13c1.34 1.29 1.95 1.39 3.06 1.39 1.06 0 1.7-.34 3.31-1.32 1.61-.98 4.62-.81 6.49.95-5.69 3.12-4.78 11.27.79 10.24z"/>
    </svg>
  );
}