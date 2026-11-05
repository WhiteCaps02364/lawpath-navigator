import { useRef, useState } from 'react';
import { Building2 } from 'lucide-react';
import { SilhouetteAvatar } from '@/components/advisor/SilhouetteAvatar';

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = ['image/jpeg', 'image/png', 'image/webp'];

/** Center-crops the file to the given aspect ratio and downsizes it so it fits in local storage. */
function cropToDataUrl(file: File, aspect: number, maxW: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let sw = img.width, sh = img.height;
      if (sw / sh > aspect) sw = sh * aspect; else sh = sw / aspect;
      const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
      const w = Math.min(maxW, sw), h = w / aspect;
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d')!.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read image')); };
    img.src = url;
  });
}

export function ImageUploadBox({ variant, value, onChange }: {
  variant: 'photo' | 'logo';
  value?: string;
  onChange: (v: string | undefined) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const isPhoto = variant === 'photo';

  const pick = async (f?: File) => {
    if (!f) return;
    if (!ACCEPT.includes(f.type)) return setError('Please choose a JPG, PNG, or WEBP file.');
    if (f.size > MAX_BYTES) return setError('File must be 5MB or smaller.');
    setError(null);
    try { onChange(await cropToDataUrl(f, isPhoto ? 1 : 16 / 9, isPhoto ? 400 : 640)); }
    catch { setError('Could not read that image.'); }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`overflow-hidden border-2 border-[#1A365D]/30 bg-muted flex items-center justify-center hover:opacity-90 ${isPhoto ? 'rounded-full w-[120px] h-[120px]' : 'rounded-xl w-[213px] h-[120px]'}`}
        aria-label={isPhoto ? 'Upload profile photo' : 'Upload institution logo'}
      >
        {value ? (
          <img src={value} alt={isPhoto ? 'Profile photo' : 'Institution logo'} className={`w-full h-full ${isPhoto ? 'object-cover' : 'object-contain bg-white'}`} />
        ) : isPhoto ? (
          <SilhouetteAvatar size={120} />
        ) : (
          <Building2 className="w-12 h-12 text-muted-foreground" strokeWidth={1.5} />
        )}
      </button>
      <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden"
        onChange={e => { pick(e.target.files?.[0]); e.target.value = ''; }} />
      <span className="text-sm font-medium text-[#1A365D]">{isPhoto ? 'Profile Photo' : 'Institution Logo'}</span>
      {value && (
        <button type="button" onClick={() => onChange(undefined)} className="text-xs text-muted-foreground underline">Remove</button>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
