"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Bot, 
  Video, 
  CheckSquare, 
  Sparkles, 
  BarChart2, 
  Mic, 
  Zap, 
  Mail, 
  Grid, 
  Settings, 
  ChevronDown, 
  X,
  RotateCcw,
  Sun,
  Moon,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  Download
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [promoSlide, setPromoSlide] = useState<0 | 1>(0);
  const [showPromoCard, setShowPromoCard] = useState(true);
  const [reseedLoading, setReseedLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setWorkspaceMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReseed = async () => {
    if (!confirm('Reseed database with fresh sample meetings, transcripts, and summaries?')) return;
    setReseedLoading(true);
    try {
      await api.reseedDatabase();
      toast.success('Database reseeded with rich sample meetings!');
      window.location.reload();
    } catch {
      toast.error('Failed to reseed database');
    } finally {
      setReseedLoading(false);
      setWorkspaceMenuOpen(false);
    }
  };

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside 
      className={`${
        collapsed ? 'w-16' : 'w-56'
      } bg-[#111115] text-gray-300 flex flex-col h-full shrink-0 border-r border-[#1E1E24] select-none text-xs font-sans transition-all duration-200 relative`}
    >
      {/* Workspace / User Profile Header */}
      <div className="p-2.5 border-b border-[#1E1E24] relative flex items-center justify-between" ref={menuRef}>
        <button
          onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
          className={`flex items-center gap-2 p-1 rounded-lg hover:bg-white/[0.04] transition-colors text-left group min-w-0 ${
            collapsed ? 'justify-center w-full' : 'flex-1'
          }`}
          title="GAGANDEEP's Workspace"
        >
          <div className="w-6 h-6 rounded-md bg-[#24242C] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-inner ring-1 ring-white/10">
            G
          </div>
          {!collapsed && (
            <>
              <span className="font-semibold text-xs tracking-wider text-white uppercase truncate">
                GAGANDEEP
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-transform ml-auto ${workspaceMenuOpen ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>

        {/* Collapse toggle button */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 text-gray-400 hover:text-white hover:bg-white/[0.04] rounded transition-colors"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}

        {/* Workspace Dropdown */}
        {workspaceMenuOpen && (
          <div className={`absolute top-full ${collapsed ? 'left-14' : 'left-2 right-2'} mt-1.5 w-60 bg-[#191921] border border-[#2A2A36] rounded-xl shadow-2xl p-2 z-50 space-y-1 backdrop-blur-md`}>
            <div className="px-2.5 py-1.5 border-b border-white/5 text-[11px] text-gray-400 font-medium">
              Signed in as <span className="text-white font-semibold">gagandeep@fireflies.ai</span>
            </div>
            
            <button
              onClick={handleReseed}
              disabled={reseedLoading}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-xs font-medium text-left"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${reseedLoading ? 'animate-spin text-purple-400' : 'text-purple-400'}`} />
              <span>{reseedLoading ? 'Reseeding...' : 'Reseed Sample Data'}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-xs font-medium text-left"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-purple-400" />}
              <span>{darkMode ? 'Switch to Light' : 'Switch to Dark'}</span>
            </button>

            <div className="pt-1 border-t border-white/5">
              <Link
                href="/settings"
                onClick={() => setWorkspaceMenuOpen(false)}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-xs font-medium"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Workspace Settings</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <div className="p-2 flex justify-center border-b border-[#1E1E24]">
          <button
            onClick={() => setCollapsed(false)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto no-scrollbar">
        {/* Home */}
        <Link
          href="/"
          title={collapsed ? "Home" : undefined}
          className={`flex items-center gap-2.5 ${collapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg transition-colors font-medium text-xs ${
            isActive('/') && pathname === '/'
              ? 'bg-[#222228] text-white shadow-sm'
              : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Home className="w-4 h-4 shrink-0 text-gray-400" />
          {!collapsed && <span>Home</span>}
        </Link>

        {/* AskFred */}
        <Link
          href="/askfred"
          title={collapsed ? "AskFred" : undefined}
          className={`flex items-center gap-2.5 ${collapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg transition-colors font-medium text-xs ${
            isActive('/askfred')
              ? 'bg-[#222228] text-white shadow-sm'
              : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Bot className="w-4 h-4 shrink-0 text-purple-400" />
          {!collapsed && <span>AskFred</span>}
        </Link>

        {/* Divider */}
        <div className="my-2 border-t border-[#1C1C24]" />

        {/* Meetings */}
        <Link
          href="/meetings"
          title={collapsed ? "Meetings" : undefined}
          className={`flex items-center gap-2.5 ${collapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg transition-colors font-medium text-xs ${
            isActive('/meetings')
              ? 'bg-[#222228] text-white shadow-sm'
              : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Video className="w-4 h-4 shrink-0 text-gray-400" />
          {!collapsed && <span>Meetings</span>}
        </Link>

        {/* Tasks */}
        <Link
          href="/tasks"
          title={collapsed ? "Tasks" : undefined}
          className={`flex items-center gap-2.5 ${collapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg transition-colors font-medium text-xs ${
            isActive('/tasks')
              ? 'bg-[#222228] text-white shadow-sm'
              : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <CheckSquare className="w-4 h-4 shrink-0 text-gray-400" />
          {!collapsed && <span>Tasks</span>}
        </Link>

        {/* AI Skills */}
        <Link
          href="/ai-skills"
          title={collapsed ? "AI Skills" : undefined}
          className={`flex items-center gap-2.5 ${collapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg transition-colors font-medium text-xs ${
            isActive('/ai-skills')
              ? 'bg-[#222228] text-white shadow-sm'
              : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0 text-gray-400" />
          {!collapsed && <span>AI Skills</span>}
        </Link>

        {/* Divider */}
        <div className="my-2 border-t border-[#1C1C24]" />

        {/* Analytics */}
        <Link
          href="/analytics"
          title={collapsed ? "Analytics" : undefined}
          className={`flex items-center gap-2.5 ${collapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg transition-colors font-medium text-xs ${
            isActive('/analytics')
              ? 'bg-[#222228] text-white shadow-sm'
              : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <BarChart2 className="w-4 h-4 shrink-0 text-gray-400" />
          {!collapsed && <span>Analytics</span>}
        </Link>

        {/* Voice Agents */}
        <Link
          href="/voice-agents"
          title={collapsed ? "Voice Agents" : undefined}
          className={`flex items-center gap-2.5 ${collapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg transition-colors font-medium text-xs ${
            isActive('/voice-agents')
              ? 'bg-[#222228] text-white shadow-sm'
              : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Mic className="w-4 h-4 shrink-0 text-gray-400" />
          {!collapsed && <span>Voice Agents</span>}
        </Link>

        {/* Divider */}
        <div className="my-2 border-t border-[#1C1C24]" />

        {/* Upgrade with 40% OFF */}
        <Link
          href="/upgrade"
          title={collapsed ? "Upgrade (40% OFF)" : undefined}
          className={`flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-3'} py-2 rounded-lg transition-colors font-medium text-xs ${
            isActive('/upgrade')
              ? 'bg-[#222228] text-white shadow-sm'
              : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 shrink-0 text-amber-400" />
            {!collapsed && <span>Upgrade</span>}
          </div>
          {!collapsed && (
            <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide">
              40% OFF
            </span>
          )}
        </Link>

        {/* Try Email Assistant */}
        <Link
          href="/email-assistant"
          title={collapsed ? "Try Email Assistant" : undefined}
          className={`flex items-center gap-2.5 ${collapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg transition-colors font-medium text-xs ${
            isActive('/email-assistant')
              ? 'bg-[#222228] text-white shadow-sm'
              : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <div className="w-4 h-4 rounded-sm bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[10px] shrink-0">
            M
          </div>
          {!collapsed && <span className="truncate">Try Email Assistant</span>}
        </Link>

        {/* Integrations */}
        <Link
          href="/integrations"
          title={collapsed ? "Integrations" : undefined}
          className={`flex items-center gap-2.5 ${collapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg transition-colors font-medium text-xs ${
            isActive('/integrations')
              ? 'bg-[#222228] text-white shadow-sm'
              : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Grid className="w-4 h-4 shrink-0 text-gray-400" />
          {!collapsed && <span>Integrations</span>}
        </Link>

        {/* Settings */}
        <Link
          href="/settings"
          title={collapsed ? "Settings" : undefined}
          className={`flex items-center gap-2.5 ${collapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg transition-colors font-medium text-xs ${
            isActive('/settings')
              ? 'bg-[#222228] text-white shadow-sm'
              : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Settings className="w-4 h-4 shrink-0 text-gray-400" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </nav>

      {/* Bottom Promo / Invite Card (Matching PDF Page 1 & Page 5) */}
      {!collapsed && showPromoCard && (
        <div className="p-2.5 mx-2 mb-2 rounded-xl bg-[#17171F] border border-[#242430] text-xs relative transition-all">
          <button
            onClick={() => setShowPromoCard(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white p-0.5"
            title="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>

          {promoSlide === 0 ? (
            <div>
              <p className="text-gray-200 font-medium text-[11px] pr-4 leading-tight">
                Invite coworkers to your Fireflies team
              </p>
              <Link
                href="/team"
                className="mt-2.5 block w-full py-1.5 px-3 bg-[#5B45E0] hover:bg-[#6A52EA] text-white text-center text-[11px] font-semibold rounded-lg shadow-md shadow-purple-900/30 transition-all"
              >
                Create Team
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-gray-200 font-medium text-[11px] pr-4 leading-tight">
                Bot-less meetings with Desktop App
              </p>
              <button
                onClick={() => toast.success('Fireflies Desktop App installer downloaded')}
                className="mt-2.5 w-full py-1.5 px-3 bg-[#242432] hover:bg-[#2F2F40] text-gray-200 hover:text-white text-center text-[11px] font-semibold rounded-lg border border-white/10 transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3 h-3 text-purple-400" />
                <span>Download App</span>
              </button>
            </div>
          )}

          {/* Pagination dots to switch between Slide 0 and Slide 1 */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[10px]">
            <button
              onClick={() => setPromoSlide(0)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                promoSlide === 0 ? 'bg-white w-3' : 'bg-gray-600'
              }`}
            />
            <button
              onClick={() => setPromoSlide(1)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                promoSlide === 1 ? 'bg-white w-3' : 'bg-gray-600'
              }`}
            />
          </div>
        </div>
      )}
    </aside>
  );
}
