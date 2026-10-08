"use client";
import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface Message {
  role: 'user' | 'ai';
  content: string;
  sources?: string[];
}

const SUGGESTED_PROMPTS = [
  "What are the action items?",
  "Who attended this meeting?",
  "Give me a 3-bullet summary",
  "What decisions were made?",
];

export default function AskFredPanel({
  meetingId,
  meetingTitle,
  onClose,
}: {
  meetingId: number;
  meetingTitle?: string;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: `Hi! I'm Fred, your AI meeting copilot. Ask me anything about **${meetingTitle || 'this meeting'}**, like action items, key decisions, or what a specific attendee said!`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendQuestion = async (questionText: string) => {
    if (!questionText.trim() || loading) return;
    
    const userMsg = questionText.trim();
    setQuery('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await api.askQuestion(meetingId, userMsg);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: res.answer, sources: res.sources },
      ]);
    } catch {
      toast.error('Failed to get answer from Fred');
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: "Sorry, I had trouble retrieving that from the meeting transcript. Please try asking again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuestion(query);
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'ai',
        content: `Conversation reset. What else would you like to know about **${meetingTitle || 'this meeting'}**?`,
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700/80 flex flex-col h-[520px] z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Ask Fred</h3>
            <p className="text-[10px] text-white/80">AI Meeting Copilot</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested prompts strip */}
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => sendQuestion(prompt)}
            className="whitespace-nowrap text-[11px] px-2.5 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-full hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs shadow-xs ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
              }`}
            >
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed space-y-2 shadow-xs ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-tr-none'
                  : 'bg-gray-100 dark:bg-gray-700/80 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-200/50 dark:border-gray-600/50'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-1.5 border-t border-gray-200/50 dark:border-gray-600/50 flex flex-wrap gap-1">
                  {msg.sources.map((src, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] bg-white/70 dark:bg-gray-800/80 text-primary-700 dark:text-primary-300 px-1.5 py-0.5 rounded font-mono"
                    >
                      {src}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span>Fred is thinking...</span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleFormSubmit}
        className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0 flex items-center gap-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask Fred a question..."
          className="flex-1 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="w-8 h-8 rounded-full bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 shadow-sm"
        >
          <Send className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </form>
    </div>
  );
}
