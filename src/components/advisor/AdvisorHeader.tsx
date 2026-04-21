import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import jdnLogo from '@/assets/jdn-logo.png';
import { useAdvisorDemo } from '@/contexts/AdvisorDemoContext';

export function AdvisorHeader() {
  const navigate = useNavigate();
  const { advisor, signOut } = useAdvisorDemo();
  const firstName = advisor?.firstName || 'Advisor';

  return (
    <header className="bg-[#1A365D] w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <img src={jdnLogo} alt="JD-Next" style={{ height: 56, width: 'auto' }} />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 text-base text-gray-200 hover:text-white">
            {firstName} <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/advisor-dashboard')}>My Dashboard</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/advisor-dashboard/profile')}>My Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/advisor-dashboard/profile')}>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { signOut(); navigate('/'); }}>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}