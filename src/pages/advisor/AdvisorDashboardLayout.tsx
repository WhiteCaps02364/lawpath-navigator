import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Users, Eye, LayoutDashboard, BookOpen, Link2, X } from 'lucide-react';
import { AdvisorFooter } from '@/components/advisor/AdvisorFooter';
import { AdvisorHeader } from '@/components/advisor/AdvisorHeader';
import { useAdvisorDemo } from '@/contexts/AdvisorDemoContext';

const items = [
  { to: '/advisor-dashboard', label: 'My Students', icon: Users, end: true },
  { to: '/advisor-dashboard/preview', label: 'Preview Student Experience', icon: Eye },
  { to: '/advisor-dashboard/demo', label: 'Demo Dashboard', icon: LayoutDashboard },
  { to: '/advisor-dashboard/tutorial', label: 'Understanding the Report', icon: BookOpen },
  { to: '/advisor-dashboard/link', label: 'My Shareable Link', icon: Link2 },
];

export default function AdvisorDashboardLayout() {
  const { advisor } = useAdvisorDemo();
  const navigate = useNavigate();
  const [bannerOpen, setBannerOpen] = useState(true);

  useEffect(() => {
    if (!advisor) navigate('/advisor-register', { replace: true });
  }, [advisor, navigate]);

  if (!advisor) return null;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <AdvisorHeader />

      {bannerOpen && (
        <div className="text-[#5C4A1A] flex items-center justify-between px-4 py-3 text-sm" style={{ background: '#F8E9C2', borderBottom: '1px solid #E8D49A' }}>
          <span>
            You are viewing a demo advisor account. Full account creation and authentication will be enabled in the next build.
          </span>
          <button onClick={() => setBannerOpen(false)} className="ml-4 text-[#5C4A1A] hover:opacity-70" aria-label="Dismiss">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex-1 flex">
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-72px)] py-6 px-3 hidden md:block">
          <nav className="space-y-1">
            {items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#1A365D] text-white' : 'text-foreground hover:bg-muted'
                  }`
                }
              >
                <item.icon className="w-4 h-4" /> {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
      <AdvisorFooter />
    </div>
  );
}