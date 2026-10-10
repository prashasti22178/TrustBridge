import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Bot,
  X,
  Send,
  ShieldCheck,
  RotateCcw,
  Maximize2,
  Minimize2,
  Loader2,
  ChevronRight,
  Info
} from 'lucide-react';
import { askAssistantApi, type AssistantChatMessage, type AssistantChatContext } from '../../lib/api';
import type { Applicant } from '../../types/underwriter';

interface TrustBridgeAssistantProps {
  activeApplicant?: Applicant | null;
}

export default function TrustBridgeAssistant({ activeApplicant }: TrustBridgeAssistantProps) {
  const { user } = useAuth();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AssistantChatMessage[]>([]);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isBorrowerRoute = location.pathname.startsWith('/apply') || location.pathname === '/';

  // Determine current active context
  const currentContext: AssistantChatContext = activeApplicant
    ? {
        applicant_id: activeApplicant.id,
        applicant_name: activeApplicant.name,
        business_type: activeApplicant.businessType,
        trust_score: activeApplicant.trustScore,
        pillars: {
          ability: activeApplicant.pillars?.ability || 82,
          willingness: activeApplicant.pillars?.willingness || 85,
          stability: activeApplicant.pillars?.stability || 65
        },
        risk_tier: activeApplicant.confidenceTier,
        risk_trajectory: activeApplicant.riskTrajectory || 'STABLE',
        anomaly_flags: activeApplicant.riskAlerts?.map((a) => a.signal) || [],
        current_route: location.pathname,
        user_role: user?.role || 'underwriter'
      }
    : {
        current_route: location.pathname,
        user_role: user?.role || (isBorrowerRoute ? 'borrower' : 'underwriter')
      };

  // Initial welcome message based on context
  useEffect(() => {
    if (messages.length === 0) {
      if (activeApplicant) {
        setMessages([
          {
            role: 'assistant',
            content: `Hello! I am your TrustBridge Assistant. I have loaded authorized telemetry for **${activeApplicant.name}** (${activeApplicant.businessType}, Trust Score: **${activeApplicant.trustScore}/100**). You can ask me to explain score drivers, identify risk signals, or suggest verification checks.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setSuggestedActions([
          'Explain this score',
          'Show risk factors',
          'What should I verify?',
          'Summarize for underwriter'
        ]);
      } else {
        setMessages([
          {
            role: 'assistant',
            content: `Welcome to TrustBridge. I am your FinTech intelligence assistant. I can explain how alternative credit scoring works for credit-invisible micro-entrepreneurs, what signals are evaluated, and how our deterministic engine protects borrower data.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setSuggestedActions([
          'I have no CIBIL history. Can I still apply?',
          'What is supplier repayment?',
          'What does business tenure mean?',
          'Why are documents requested?'
        ]);
      }
    }
  }, [activeApplicant?.id]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (textToSend?: string, quickAction?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text && !quickAction) return;

    const userMsg: AssistantChatMessage = {
      role: 'user',
      content: text || quickAction || '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newThread = [...messages, userMsg];
    setMessages(newThread);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await askAssistantApi(newThread, currentContext, quickAction);
      const assistantMsg: AssistantChatMessage = {
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
      if (response.suggested_actions && response.suggested_actions.length > 0) {
        setSuggestedActions(response.suggested_actions);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'The assistant service encountered a connection issue. The underlying deterministic scoring engine remains 100% operational.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setSuggestedActions([]);
    if (activeApplicant) {
      setMessages([
        {
          role: 'assistant',
          content: `New session started for **${activeApplicant.name}** (Trust Score: ${activeApplicant.trustScore}/100). How can I assist with this credit evaluation?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setSuggestedActions([
        'Explain this score',
        'Show risk factors',
        'What should I verify?',
        'How could the score improve?'
      ]);
    } else {
      setMessages([
        {
          role: 'assistant',
          content: `New session initialized. How can I assist you with alternative credit scoring or borrower guidance today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setSuggestedActions([
        'I have no CIBIL history',
        'What is supplier repayment?',
        'How does consent work?'
      ]);
    }
  };

  return (
    <>
      {/* FLOATING LAUNCHER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 border border-indigo-400/30 flex items-center gap-2.5 transition-all duration-200 hover:scale-105 active:scale-95 group"
          aria-label="Open TrustBridge Contextual AI Assistant"
        >
          <div className="relative">
            <Bot className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#090d16] animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-tight pr-1">TrustBridge Assistant</span>
        </button>
      )}

      {/* EXPANDABLE SLIDE-OUT PANEL / DRAWER */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 z-50 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 backdrop-blur-xl ${
            isExpanded
              ? 'w-[94vw] sm:w-[620px] h-[85vh]'
              : 'w-[92vw] sm:w-[420px] h-[580px]'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 px-4 bg-slate-950 border-b border-slate-800/90 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white tracking-tight">TrustBridge Assistant</h3>
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono-numbers">
                    Guardrails v2.0
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  {activeApplicant ? (
                    <span className="truncate max-w-[200px]">
                      Context: <strong className="text-slate-200">{activeApplicant.name}</strong> ({activeApplicant.trustScore})
                    </span>
                  ) : (
                    <span>Borrower Guidance & Platform Knowledge</span>
                  )}
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Restart Session"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse' : 'Expand'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Context Banner */}
          {activeApplicant && (
            <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Pillars:</span>
                <span className="font-mono-numbers text-emerald-400">A:{activeApplicant.pillars?.ability}</span>
                <span className="font-mono-numbers text-indigo-400">W:{activeApplicant.pillars?.willingness}</span>
                <span className="font-mono-numbers text-amber-400">S:{activeApplicant.pillars?.stability}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono-numbers">
                {activeApplicant.riskTrajectory || 'STABLE'}
              </span>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={index}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1 animate-in fade-in duration-150`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 px-1 font-mono-numbers">
                    {isUser ? (
                      <>
                        <span>You</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-3 w-3 text-emerald-400" />
                        <span className="text-slate-400 font-semibold">TrustBridge Assistant</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-950 border border-slate-800/90 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs animate-in fade-in">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                <span>Consulting verified telemetry under FinTech guardrails...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          {suggestedActions.length > 0 && !loading && (
            <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800/60 overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
              <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 px-1">
                Suggested:
              </span>
              {suggestedActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(undefined, action)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500/40 text-[11px] text-slate-300 hover:text-indigo-200 shrink-0 transition-all flex items-center gap-1"
                >
                  <span>{action}</span>
                  <ChevronRight className="h-2.5 w-2.5 text-slate-500" />
                </button>
              ))}
            </div>
          )}

          {/* Strict FinTech Guardrail Disclaimer Pill */}
          <div className="px-4 py-1.5 bg-slate-950 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px] text-slate-500">
            <Info className="h-3 w-3 text-indigo-400 shrink-0" />
            <span className="truncate">
              AI provides explainable evidence only. Final lending sanction remains with human underwriter.
            </span>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  activeApplicant
                    ? `Ask about ${activeApplicant.name}'s score or risks...`
                    : 'Ask about alternative scoring, signals, or consent...'
                }
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-colors shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
