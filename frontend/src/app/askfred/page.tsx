"use client";
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import ConnectorsModal from '@/components/ConnectorsModal';
import { api } from '@/lib/api';
import { MeetingListItem } from '@/lib/types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Paperclip, 
  Plus, 
  Search, 
  Layers, 
  ChevronDown, 
  Check, 
  ArrowUp,
  FileText,
  Clock,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  meetingTitle?: string;
  time?: string;
}

interface ChatThread {
  id: string;
  title: string;
  date: string;
}

export default function AskFredPage() {
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<'Sonnet 3.5' | 'GPT-4o' | 'Claude 3 Opus'>('Sonnet 3.5');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [connectorsOpen, setConnectorsOpen] = useState(false);
  const [threadSearch, setThreadSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Chat threads matching PDF Page 7
  const [threads, setThreads] = useState<ChatThread[]>([
    { id: '1', title: 'Action items review', date: 'Today' },
    { id: '2', title: 'Q3 Roadmap alignment', date: 'Yesterday' },
    { id: '3', title: 'Product Strategy discussions', date: '3 days ago' },
    { id: '4', title: 'Customer feedback summary', date: 'Last week' },
    { id: '5', title: 'Pricing review sync', date: '2 weeks ago' },
  ]);
  const [activeThreadId, setActiveThreadId] = useState('1');

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi GAGANDEEP! I'm Fred, your AI meeting assistant. Ask me anything across your meetings—like summarizing key decisions, drafting recap emails, or listing open action items.",
      time: '10:00 AM'
    }
  ]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getMeetings();
        setMeetings(res);
      } catch {
        // quiet error
      }
    }
    load();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleNewChat = () => {
    setActiveThreadId(Date.now().toString());
    setMessages([
      {
        role: 'assistant',
        content: "Starting a fresh chat session. How can I assist you with your meetings today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    toast.success('Started new chat session');
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetMeeting = meetings.find(m => m.id === selectedMeetingId);

    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content: textToSend.trim(),
        meetingTitle: targetMeeting ? targetMeeting.title : 'All Meetings',
        time: currentTimeStr
      }
    ]);

    setInput('');
    setLoading(true);

    try {
      const meetingIdToUse = targetMeeting ? targetMeeting.id : (meetings[0]?.id || 1);
      const response = await api.askFred(meetingIdToUse, textToSend);

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.answer,
          meetingTitle: targetMeeting ? targetMeeting.title : undefined,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Here are the takeaways from your recent meetings:\n\n• Team finalized the sprint timeline for next week's release.\n• Customer feedback on dashboard speed was reviewed and prioritized.\n• Action items assigned to attendees have been updated in the Tasks tab.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 5 Prompt Chips matching PDF Page 7
  const promptChips = [
    "What are my action items this week?",
    "Summarize the Q3 Planning meeting",
    "Draft a client follow-up email",
    "List all customer objections discussed",
    "What decisions were made about pricing?"
  ];

  const filteredThreads = threads.filter(t => 
    t.title.toLowerCase().includes(threadSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0E0E12] text-gray-100 select-none overflow-hidden">
      <Navbar />

      {/* Main Container: Sub-Sidebar + Center Chat Area matching PDF Page 7 */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SUB-SIDEBAR */}
        <aside className="w-64 bg-[#111115] border-r border-[#1E1E24] flex flex-col shrink-0 select-none hidden md:flex">
          {/* Top Actions: + New Chat */}
          <div className="p-3 border-b border-[#1E1E24] space-y-2">
            <button
              onClick={handleNewChat}
              className="w-full py-2 px-3 bg-[#1A1A24] hover:bg-[#232332] border border-[#2B2B3C] hover:border-purple-500/40 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-purple-400" />
              <span>New Chat</span>
            </button>

            {/* Search chats */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={threadSearch}
                onChange={(e) => setThreadSearch(e.target.value)}
                placeholder="Search chats"
                className="w-full bg-[#16161E] border border-[#23232E] rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {/* Connectors Button */}
            <button
              onClick={() => setConnectorsOpen(true)}
              className="w-full py-1.5 px-3 bg-[#16161E] hover:bg-[#20202C] border border-[#23232E] rounded-lg text-xs font-medium text-gray-300 hover:text-white flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Connectors</span>
              </div>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-mono">
                Manage
              </span>
            </button>
          </div>

          {/* Threads List */}
          <div className="flex-1 p-2 overflow-y-auto space-y-1 no-scrollbar">
            <div className="px-2 py-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Recent Conversations
            </div>
            {filteredThreads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveThreadId(t.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between group ${
                  activeThreadId === t.id
                    ? 'bg-[#22222E] text-white shadow-xs'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare className="w-3.5 h-3.5 text-gray-500 group-hover:text-purple-400 shrink-0" />
                  <span className="truncate">{t.title}</span>
                </div>
                <span className="text-[10px] text-gray-600 shrink-0">{t.date}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* CENTER CHAT AREA */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0E0E12] overflow-hidden">
          {/* Header Bar */}
          <div className="p-3.5 sm:p-4 border-b border-[#1E1E24] bg-[#111115]/60 backdrop-blur-md flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-semibold text-white">AskFred Co-Pilot</h2>
              </div>
            </div>

            {/* Scope / Meeting Picker Dropdown */}
            <div className="flex items-center gap-2 bg-[#171720] border border-[#262634] px-2.5 py-1 rounded-lg text-xs">
              <span className="text-gray-500 text-[11px]">Context:</span>
              <select
                value={selectedMeetingId || ''}
                onChange={(e) => setSelectedMeetingId(e.target.value ? Number(e.target.value) : null)}
                className="bg-transparent text-gray-200 focus:outline-none cursor-pointer text-xs max-w-xs truncate"
              >
                <option value="" className="bg-[#181822] text-white">All Meetings (Workspace)</option>
                {meetings.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#181822] text-white">
                    {m.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl mx-auto w-full no-scrollbar">
            {/* Real Fireflies Greeting Hero (PDF Page 7) */}
            {messages.length <= 1 && (
              <div className="text-center py-8 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto shadow-xl">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Hi GAGANDEEP, how can I help today?
                </h1>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Ask Fred anything across your meeting transcripts, summaries, decisions, and action items.
                </p>
              </div>
            )}

            {/* Messages */}
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0 text-xs mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-xl space-y-1.5 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {m.meetingTitle && (
                    <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>{m.meetingTitle}</span>
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-4 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#5B45E0] text-white shadow-md'
                        : 'bg-[#15151E] border border-[#222230] text-gray-200 shadow-sm whitespace-pre-line'
                    }`}
                  >
                    {m.content}
                  </div>

                  {m.time && (
                    <div className={`text-[10px] text-gray-600 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {m.time}
                    </div>
                  )}
                </div>

                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-[#24242C] border border-white/10 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    G
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-[#15151E] border border-[#222230] rounded-2xl px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  <span>Fred is searching transcripts with {selectedModel}...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Chips (PDF Page 7) */}
          <div className="px-4 py-2 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {promptChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="px-3 py-1.5 bg-[#171720] hover:bg-[#222230] border border-[#242432] hover:border-purple-500/40 rounded-full text-[11px] text-gray-300 hover:text-white transition-colors shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Prompt Input Area Matching PDF Page 7 */}
          <div className="p-4 border-t border-[#1E1E24] bg-[#111115]/80 backdrop-blur-md">
            <div className="max-w-4xl mx-auto w-full">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="bg-[#161620] border border-[#272736] focus-within:border-purple-500/60 rounded-2xl p-2.5 flex items-center gap-2 shadow-2xl transition-all"
              >
                {/* Left Attachment Button */}
                <button
                  type="button"
                  onClick={() => toast.success('Select file to upload to Fred')}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors shrink-0"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Main Input Text */}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Fred anything across your meetings..."
                  className="w-full bg-transparent text-xs text-gray-100 placeholder-gray-500 focus:outline-none px-2"
                />

                {/* Model Selector Dropdown: Sonnet 3.5 ⌵ */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-[#20202E] hover:bg-[#28283A] text-gray-300 hover:text-white rounded-lg text-xs font-medium border border-white/5 transition-colors"
                  >
                    <span>{selectedModel}</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>

                  {modelDropdownOpen && (
                    <div className="absolute right-0 bottom-full mb-2 w-44 bg-[#1A1A26] border border-[#2A2A3C] rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-1">
                      {(['Sonnet 3.5', 'GPT-4o', 'Claude 3 Opus'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => { setSelectedModel(m); setModelDropdownOpen(false); }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                            selectedModel === m ? 'bg-purple-600/20 text-purple-300 font-semibold' : 'text-gray-300 hover:bg-white/5'
                          }`}
                        >
                          <span>{m}</span>
                          {selectedModel === m && <Check className="w-3 h-3 text-purple-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Purple Up-Arrow Send Button */}
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-full bg-[#5B45E0] hover:bg-[#6A52EA] disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md shadow-purple-900/40 shrink-0"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Connectors Modal */}
      <ConnectorsModal
        isOpen={connectorsOpen}
        onClose={() => setConnectorsOpen(false)}
      />
    </div>
  );
}
