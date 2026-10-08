"use client";
import Navbar from '@/components/Navbar';
import { Users, UserPlus, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const TEAM_MEMBERS = [
  { name: 'Alex Rivers', email: 'alex.rivers@fireflies-demo.com', role: 'Workspace Owner' },
  { name: 'Maya Chen', email: 'maya.chen@fireflies-demo.com', role: 'Admin' },
  { name: 'Liam Smith', email: 'liam.smith@fireflies-demo.com', role: 'Member' },
  { name: 'Jordan Bell', email: 'jordan.bell@fireflies-demo.com', role: 'Member' },
  { name: 'Sarah Jenkins', email: 'sarah.jenkins@fireflies-demo.com', role: 'Member' },
];

export default function TeamPage() {
  const handleInvite = () => {
    toast.success('Invite link copied to clipboard!');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 rounded-full text-xs font-semibold mb-2">
              <Users className="w-3.5 h-3.5" /> Workspace Collaboration
            </div>
            <h1 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
              Team Members
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage workspace access, user roles, and shared meeting notebook permissions.
            </p>
          </div>

          <button
            onClick={handleInvite}
            className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Invite Colleague
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs divide-y divide-gray-100 dark:divide-gray-700/50">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.email} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                    {member.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <Mail className="w-3 h-3" />
                    <span>{member.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-primary-500" />
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
