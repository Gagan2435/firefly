"use client";
import Navbar from '@/components/Navbar';
import { Users, UserPlus, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const TEAM_MEMBERS = [
  { name: 'GAGANDEEP', email: 'gagandeep@fireflies.ai', role: 'Workspace Owner' },
  { name: 'Maya Chen', email: 'maya.chen@fireflies.ai', role: 'Admin' },
  { name: 'Liam Smith', email: 'liam.smith@fireflies.ai', role: 'Member' },
  { name: 'Jordan Bell', email: 'jordan.bell@fireflies.ai', role: 'Member' },
  { name: 'Sarah Jenkins', email: 'sarah.jenkins@fireflies.ai', role: 'Member' },
];

export default function TeamPage() {
  const handleInvite = () => {
    toast.success('Invite link copied to clipboard!');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0E0E12] text-gray-100 select-none">
      <Navbar />

      <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1E28] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Team Members
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Manage workspace access, user roles, and shared meeting notebook permissions.
            </p>
          </div>

          <button
            onClick={handleInvite}
            className="inline-flex items-center gap-1.5 bg-[#5B45E0] hover:bg-[#6850EB] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-purple-900/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Invite Colleague
          </button>
        </div>

        <div className="bg-[#15151D] rounded-2xl border border-[#22222E] shadow-sm divide-y divide-[#20202C]">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.email} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#262638] text-purple-300 border border-purple-500/20 flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">
                    {member.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <Mail className="w-3 h-3" />
                    <span>{member.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    member.role === 'Workspace Owner'
                      ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                      : member.role === 'Admin'
                      ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/40'
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  {member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
