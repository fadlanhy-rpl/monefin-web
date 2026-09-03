"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { aiChat } from "../../services/ai.service";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../hooks/useAuth";
import { useAiStream } from "../../hooks/useAiStream";
import { AlertTriangle, Settings, ExternalLink } from "lucide-react";

const QUICK_QUESTIONS = [
  "Kenapa pengeluaranku bulan ini naik?",
  "Kategori apa yang paling banyak menghabiskan uang?",
  "Bagaimana caraku bisa menabung lebih banyak?",
  "Apakah kondisi keuanganku sudah sehat?",
];

const QUICK_QUESTIONS_EN = [
  "Why did my spending increase this month?",
  "Which category is spending the most money?",
  "How can I save more money?",
  "Is my financial condition healthy?",
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
        AI
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function parseInline(text, isUser) {
  if (!text) return null;
  const parts = [];
  const regex = /(\*\*(?:[^*]+|\*(?!\*))+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong
          key={match.index}
          className={isUser ? "font-black" : "font-extrabold text-slate-900"}
        >
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={match.index} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className={`px-1.5 py-0.5 rounded text-xs font-mono ${
            isUser ? "bg-white/20" : "bg-slate-100 text-[#00685F]"
          }`}
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

function FormattedContent({ content, isUser }) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements = [];
  let currentList = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    const bulletMatch = trimmed.match(/^[\*\-]\s+(.*)$/);
    const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);

    if (bulletMatch) {
      if (!currentList || currentList.type !== "bullet") {
        currentList = { type: "bullet", items: [] };
        elements.push(currentList);
      }
      currentList.items.push(bulletMatch[1]);
    } else if (numberMatch) {
      if (!currentList || currentList.type !== "number") {
        currentList = { type: "number", items: [] };
        elements.push(currentList);
      }
      currentList.items.push({ num: numberMatch[1], text: numberMatch[2] });
    } else {
      currentList = null;
      if (trimmed === "") {
        elements.push({ type: "spacer" });
      } else {
        elements.push({ type: "p", text: line });
      }
    }
  });

  return (
    <div className="space-y-1.5">
      {elements.map((el, i) => {
        if (el.type === "bullet") {
          return (
            <ul key={i} className="space-y-1.5 my-1.5 pl-0.5">
              {el.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                      isUser ? "bg-white" : "bg-[#00685F]"
                    }`}
                  />
                  <span className="flex-1 leading-relaxed">
                    {parseInline(item, isUser)}
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        if (el.type === "number") {
          return (
            <ol key={i} className="space-y-1.5 my-1.5 pl-0.5">
              {el.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2">
                  <span
                    className={`text-xs font-bold shrink-0 mt-0.5 ${
                      isUser ? "text-white/80" : "text-[#00685F]"
                    }`}
                  >
                    {item.num}.
                  </span>
                  <span className="flex-1 leading-relaxed">
                    {parseInline(item.text, isUser)}
                  </span>
                </li>
              ))}
            </ol>
          );
        }

        if (el.type === "spacer") {
          return <div key={i} className="h-1.5" />;
        }

        return (
          <p key={i} className="leading-relaxed">
            {parseInline(el.text, isUser)}
          </p>
        );
      })}
    </div>
  );
}

function ChatBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
          AI
        </div>
      )}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-br-sm font-medium"
            : "bg-white border border-slate-100 text-slate-700 rounded-bl-sm"
        }`}
      >
        <FormattedContent content={content} isUser={isUser} />
      </div>
    </div>
  );
}

// Banner shown when token/quota is exhausted
function QuotaBanner({ message, onGoSettings, language }) {
  return (
    <div className="mx-3 mb-2 rounded-2xl bg-rose-50 border border-rose-200 p-3 flex flex-col gap-2">
      <div className="flex items-start gap-2 text-rose-700">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <p className="text-xs font-semibold leading-relaxed">{message}</p>
      </div>
      <button
        onClick={onGoSettings}
        className="flex items-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 px-3 py-1.5 rounded-xl self-start transition"
      >
        <Settings className="w-3 h-3" />
        {language === "id" ? "Buka Settings" : "Open Settings"}
        <ExternalLink className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function AiChatWidget() {
  const { user }    = useAuth();
  const { language } = useLanguage();
  const router      = useRouter();

  const [isOpen, setIsOpen]   = useState(false);
  const { stream: streamChat, isStreaming } = useAiStream();
  const [messages, setMessages] = useState([]);
  const [input, setInput]     = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [quotaError, setQuotaError] = useState(null); // string | null
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  // Derive from user preferences
  const aiEnabled  = user?.preferences?.ai_enabled ?? false;
  const aiConfig   = user?.preferences?.ai_config ?? {};
  const providerLabel = aiConfig.model
    ? `${aiConfig.model}`
    : (aiConfig.provider ?? null);

  const quickQs = language === "id" ? QUICK_QUESTIONS : QUICK_QUESTIONS_EN;

  // If AI is not enabled — don't render anything
  if (!aiEnabled) return null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isLoading, isStreaming]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOpenChat = (event) => {
      setIsOpen(true);
      if (event?.detail?.prompt) setInput(event.detail.prompt);
    };
    window.addEventListener("open-ai-chat", handleOpenChat);
    return () => window.removeEventListener("open-ai-chat", handleOpenChat);
  }, []);

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading || isStreaming) return;

    setShowIntro(false);
    setInput("");
    setIsLoading(true);
    setQuotaError(null);

    const userMsg = { role: "user", content: trimmed };
    const history = messages.map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content }));

    // Add user message and temporary assistant placeholder
    setMessages((prev) => [
      ...prev,
      userMsg,
      { role: "assistant", content: "" }
    ]);

    try {
      await streamChat({
        message: trimmed,
        history,
        onChunk: (_token, accumulated) => {
          setIsLoading(false);
          setMessages((prev) => {
            if (prev.length === 0) return prev;
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: accumulated };
            return updated;
          });
        },
        onDone: (finalText) => {
          setIsLoading(false);
          if (!finalText) {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: language === "id" ? "Jawaban selesai." : "Response completed."
              };
              return updated;
            });
          }
        },
        onError: (errText) => {
          setIsLoading(false);
          if (errText?.toLowerCase().includes("quota") || errText?.toLowerCase().includes("saldo")) {
            setQuotaError(errText);
          } else {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: errText || (language === "id" ? "Gagal memproses jawaban." : "Failed to process response.")
              };
              return updated;
            });
          }
        }
      });
    } catch (err) {
      setIsLoading(false);
      const errMsg = err?.message || "Terjadi kesalahan koneksi.";
      if (errMsg.toLowerCase().includes("quota") || errMsg.toLowerCase().includes("saldo")) {
        setQuotaError(errMsg);
      }
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isStreaming, messages, language, streamChat]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowIntro(true);
    setQuotaError(null);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="AI Financial Advisor"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen
            ? "bg-slate-700 rotate-45"
            : "bg-gradient-to-br from-brand-500 to-brand-700 hover:shadow-brand-500/40 hover:shadow-xl"
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 14H7v-2h4v2zm6 0h-4v-2h4v2zm0-4H7v-2h10v2z"/>
          </svg>
        )}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-brand-500 animate-ping opacity-30" />
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[350px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 origin-bottom-right overflow-hidden ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4 pointer-events-none"
        }`}
        style={{ maxHeight: "calc(100vh - 8rem)", minHeight: "420px" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-1-5h2v2h-2zm0-8h2v6h-2z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">MoneFin AI</p>
              <p className="text-[10px] text-white/70 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                {providerLabel
                  ? `${language === "id" ? "Aktif via" : "Active via"} ${providerLabel}`
                  : (language === "id" ? "Advisor Keuangan Pribadi" : "Personal Finance Advisor")}
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={clearChat} className="text-white/60 hover:text-white transition-colors text-xs">
              {language === "id" ? "Hapus" : "Clear"}
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 min-h-0">
          {/* Intro / Welcome */}
          {showIntro && (
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  AI
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm text-sm text-slate-700">
                  {language === "id"
                    ? "Halo! Saya MoneFin AI, advisor keuangan pribadi Anda. Saya memiliki akses ke data keuangan Anda dan siap membantu menganalisis kondisi finansial Anda secara komprehensif."
                    : "Hello! I'm MoneFin AI, your personal finance advisor. I have access to your financial data and I'm ready to help analyze your financial condition comprehensively."}
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                {language === "id" ? "Pertanyaan cepat" : "Quick questions"}
              </p>
              <div className="flex flex-wrap gap-2">
                {quickQs.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="text-[11px] bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50 transition-all text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat history */}
          {messages.map((msg, i) => (
            <ChatBubble key={i} role={msg.role} content={msg.content} />
          ))}

          {/* Typing indicator */}
          {isLoading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        {/* Quota Error Banner */}
        {quotaError && (
          <QuotaBanner
            message={quotaError}
            language={language}
            onGoSettings={() => router.push("/settings?tab=ai")}
          />
        )}

        {/* Input */}
        <div className="p-3 bg-white border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={language === "id" ? "Tanyakan sesuatu tentang keuangan Anda..." : "Ask something about your finances..."}
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none min-w-0"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
          {providerLabel && (
            <p className="text-[9px] text-slate-400 text-center mt-2">
              Powered by {providerLabel}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
