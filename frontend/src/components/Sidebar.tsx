"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  CheckSquare, 
  Puzzle, 
  Users, 
  Settings, 
  Moon, 
  Sun, 
  Flame, 
  Bot, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import LiveBotModal from './LiveBotModal';

export default function Sidebar() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [liveBotOpen, setLiveBotOpen] = useState(false);
  const [reseedLoading, setReseedLoading] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
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

  const handleReseed = async () => {
    if (!confirm('Reseed database with fresh sample meetings and transcripts?')) return;
    setReseedLoading(true);
    try {
      await api.reseedDatabase();
      toast.success('Database reseeded with rich sample meetings!');
      window.location.reload();
    } catch {
      toast.error('Failed to reseed database');
    } finally {
      setReseedLoading(false);
    }
  };

  const navItems = [
    { name: 'Notebook', href: '/', icon: BookOpen },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Integrations', href: '/integrations', icon: Puzzle, badge: 'Soon' },
    { name: 'Team', href: '/team', icon: Users, badge: 'Soon' },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      <aside className="w-64 bg-sidebar text-white flex flex-col h-full shrink-0 border-r border-indigo-950/40 select-none shadow-xl">
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-500 to-violet-400 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
              <Flame className="text-white w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg tracking-tight text-white block leading-none">
                Fireflies<span className="text-primary-400">.ai</span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase mt-0.5 block">
                Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Live Bot Action Button */}
        <div className="px-4 pt-4">
          <button
            onClick={() => setLiveBotOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-primary-600/20 active:scale-98 transition-all"
          >
            <Bot className="w-4 h-4" />
            Add to Live Meeting
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/' || pathname.startsWith('/meetings')
                : pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-xs font-semibold ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 truncate">{item.name}</span>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold bg-white/15 text-gray-300 px-1.5 py-0.5 rounded-md">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {/* Reseed DB Shortcut for reviewers */}
          <button
            onClick={handleReseed}
            disabled={reseedLoading}
            className="flex items-center gap-2.5 px-3 py-2 w-full rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-xs font-medium"
            title="Reset database to 5 rich sample meetings"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${reseedLoading ? 'animate-spin' : ''}`} />
            <span>{reseedLoading ? 'Reseeding...' : 'Reseed Sample Data'}</span>
          </button>

          {/* Theme switch */}
          <button 
            onClick={toggleDarkMode}
            className="flex items-center gap-2.5 px-3 py-2 w-full rounded-xl text-gray-300 hover:bg-white/10 transition-colors text-xs font-medium"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
            <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
          </button>

          {/* User profile */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              BD
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">Deep B.</div>
              <div className="text-[10px] text-gray-400 truncate">SDE Fullstack Review</div>
            </div>
          </div>
        </div>
      </aside>

      <LiveBotModal isOpen={liveBotOpen} onClose={() => setLiveBotOpen(false)} />
    </>
  );
}
