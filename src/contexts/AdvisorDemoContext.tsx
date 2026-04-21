import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { buildAdvisorSlug } from '@/lib/advisorSlug';

export interface AdvisorProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string;
  institution: string;
  phone?: string;
  yearsAdvising: string;
  biography?: string;
  slug: string;
}

interface Ctx {
  advisor: AdvisorProfile | null;
  setAdvisor: (a: AdvisorProfile | null) => void;
  updateAdvisor: (patch: Partial<AdvisorProfile>) => void;
  signOut: () => void;
}

const AdvisorDemoContext = createContext<Ctx | null>(null);
const KEY = 'jdn_advisor_demo';

export function AdvisorDemoProvider({ children }: { children: ReactNode }) {
  const [advisor, setAdvisorState] = useState<AdvisorProfile | null>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (advisor) localStorage.setItem(KEY, JSON.stringify(advisor));
    else localStorage.removeItem(KEY);
  }, [advisor]);

  const setAdvisor = (a: AdvisorProfile | null) => setAdvisorState(a);
  const updateAdvisor = (patch: Partial<AdvisorProfile>) => {
    setAdvisorState(prev => prev ? { ...prev, ...patch, slug: prev.slug } : prev);
  };
  const signOut = () => setAdvisorState(null);

  return (
    <AdvisorDemoContext.Provider value={{ advisor, setAdvisor, updateAdvisor, signOut }}>
      {children}
    </AdvisorDemoContext.Provider>
  );
}

export function useAdvisorDemo() {
  const ctx = useContext(AdvisorDemoContext);
  if (!ctx) throw new Error('useAdvisorDemo must be used within AdvisorDemoProvider');
  return ctx;
}

export function buildDemoAdvisor(input: Omit<AdvisorProfile, 'id' | 'slug'>): AdvisorProfile {
  return {
    ...input,
    id: `demo-${Date.now()}`,
    slug: buildAdvisorSlug(input.firstName, input.lastName, input.institution),
  };
}