"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../hooks/useAuth";
import { useAiStream } from "../../hooks/useAiStream";
import { AlertTriangle, Settings, ExternalLink, Maximize2, Minimize2, RotateCcw } from "lucide-react";

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
  // Safe non-backtracking regex for markdown tokens: **bold**, *italic*, and `code`
  const regex = /(\*\*[^\n*]+?\*\*|\*[^\n*]+?\*|`[^\n`]+?`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
      parts.push(
        <strong
          key={match.index}
          className={isUser ? "font-black" : "font-extrabold text-slate-900"}
        >
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*") && token.length >= 2) {
      parts.push(
        <em key={match.index} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("`") && token.endsWith("`") && token.length >= 2) {
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
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

function parseMarkdownBlocks(rawText) {
  if (!rawText) return [];

  // Strip any reasoning / think tokens completely
  const sanitized = rawText
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<think>[\s\S]*/gi, "");

  if (!sanitized.trim()) return [];

  const normalized = sanitized.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const blocks = [];

  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Spacers (empty line)
    if (trimmed === "") {
      if (blocks.length > 0 && blocks[blocks.length - 1].type !== "spacer") {
        blocks.push({ type: "spacer" });
      }
      i++;
      continue;
    }

    // 2. Headings (#, ##, ###, ####)
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
      i++;
      continue;
    }

    // 3. Markdown Tables (| Col 1 | Col 2 |)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines = [];
      while (i < lines.length) {
        const tLine = lines[i].trim();
        if (tLine.startsWith("|") && tLine.endsWith("|")) {
          tableLines.push(tLine);
          i++;
        } else if (tLine === "") {
          let lookAhead = i + 1;
          while (lookAhead < lines.length && lines[lookAhead].trim() === "") {
            lookAhead++;
          }
          if (
            lookAhead < lines.length &&
            lines[lookAhead].trim().startsWith("|") &&
            lines[lookAhead].trim().endsWith("|")
          ) {
            i = lookAhead;
          } else {
            break;
          }
        } else {
          break;
        }
      }

      const cleanRows = tableLines.map((line) =>
        line
          .split("|")
          .slice(1, -1)
          .map((cell) => cell.trim())
      );

      if (cleanRows.length > 0) {
        const headers = cleanRows[0];
        let dataRows = cleanRows.slice(1);
        // Filter out divider line like |---|---|
        if (dataRows.length > 0 && dataRows[0].every((c) => /^:?-+:?$/.test(c))) {
          dataRows = dataRows.slice(1);
        }
        blocks.push({
          type: "table",
          headers,
          rows: dataRows,
        });
      }
      continue;
    }

    // 4. Numbered list items (e.g. "1. Item" or "1.\nItem")
    const numberMatch = trimmed.match(/^(\d+)[\.\)]\s*(.*)$/);
    if (numberMatch) {
      const num = numberMatch[1];
      let itemText = numberMatch[2].trim();

      if (!itemText && i + 1 < lines.length) {
        let nextIndex = i + 1;
        while (nextIndex < lines.length && lines[nextIndex].trim() === "") {
          nextIndex++;
        }
        if (nextIndex < lines.length && !lines[nextIndex].trim().match(/^(\d+)[\.\)]/)) {
          itemText = lines[nextIndex].trim();
          i = nextIndex;
        }
      }

      const items = [{ num, text: itemText }];
      i++;

      while (i < lines.length) {
        const nextTrimmed = lines[i].trim();
        if (nextTrimmed === "") {
          let lookAhead = i + 1;
          while (lookAhead < lines.length && lines[lookAhead].trim() === "") {
            lookAhead++;
          }
          if (lookAhead < lines.length && lines[lookAhead].trim().match(/^(\d+)[\.\)]/)) {
            i = lookAhead;
            continue;
          } else {
            break;
          }
        }

        const nextNumMatch = nextTrimmed.match(/^(\d+)[\.\)]\s*(.*)$/);
        if (nextNumMatch) {
          const nextNum = nextNumMatch[1];
          let nextText = nextNumMatch[2].trim();
          if (!nextText && i + 1 < lines.length) {
            let nextIndex = i + 1;
            while (nextIndex < lines.length && lines[nextIndex].trim() === "") {
              nextIndex++;
            }
            if (nextIndex < lines.length && !lines[nextIndex].trim().match(/^(\d+)[\.\)]/)) {
              nextText = lines[nextIndex].trim();
              i = nextIndex;
            }
          }
          items.push({ num: nextNum, text: nextText });
          i++;
        } else {
          break;
        }
      }

      blocks.push({ type: "number_list", items });
      continue;
    }

    // 5. Standard bullet items (* Item or - Item or • Item)
    const bulletMatch = trimmed.match(/^[\*\-•]\s+(.*)$/);
    if (bulletMatch) {
      const items = [bulletMatch[1].trim()];
      i++;
      while (i < lines.length) {
        const nextTrimmed = lines[i].trim();
        const nextBullet = nextTrimmed.match(/^[\*\-•]\s+(.*)$/);
        if (nextBullet) {
          items.push(nextBullet[1].trim());
          i++;
        } else {
          break;
        }
      }
      blocks.push({ type: "bullet_list", items });
      continue;
    }

    // 6. Callouts / Notes (Note:, Catatan:, Tips:, Tip:, Penting:, Warning:)
    const calloutMatch = trimmed.match(/^(Note|Catatan|Tips?|Penting|Warning|Perhatian):\s*(.*)$/i);
    if (calloutMatch) {
      blocks.push({
        type: "callout",
        tag: calloutMatch[1],
        text: calloutMatch[2],
      });
      i++;
      continue;
    }

    // 7. Key: Value lines (e.g. "Total balance: Rp 112.5 M across all accounts")
    const kvMatch = trimmed.match(/^([A-Za-z0-9\s\/&]{2,35}):\s+(.+)$/);
    if (kvMatch && !trimmed.startsWith("http:") && !trimmed.startsWith("https:")) {
      blocks.push({
        type: "key_value",
        key: kvMatch[1].trim(),
        value: kvMatch[2].trim(),
      });
      i++;
      continue;
    }

    // 8. Normal paragraph
    blocks.push({
      type: "paragraph",
      text: rawLine,
    });
    i++;
  }

  return blocks;
}

function FormattedContent({ content, isUser }) {
  if (!content) return null;

  const blocks = parseMarkdownBlocks(content);

  return (
    <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed min-w-0 break-words overflow-hidden">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <div
              key={i}
              className={`pt-2 pb-0.5 mt-2 border-t first:mt-0 first:border-0 first:pt-0 ${
                isUser ? "border-white/20" : "border-slate-100"
              }`}
            >
              <h4
                className={`font-bold tracking-tight text-xs sm:text-[13.5px] ${
                  isUser ? "text-white" : "text-slate-900"
                }`}
              >
                {parseInline(block.text, isUser)}
              </h4>
            </div>
          );
        }

        if (block.type === "table") {
          return (
            <div
              key={i}
              className={`overflow-x-auto my-2 rounded-xl border shadow-xs ${
                isUser
                  ? "border-white/30 bg-white/10"
                  : "border-slate-200/90 bg-white"
              }`}
            >
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr
                    className={`border-b ${
                      isUser
                        ? "bg-white/20 border-white/20 text-white"
                        : "bg-slate-50 border-slate-200/80 text-slate-800"
                    }`}
                  >
                    {block.headers.map((h, idx) => (
                      <th
                        key={idx}
                        className="px-3 py-2 font-bold whitespace-nowrap"
                      >
                        {parseInline(h, isUser)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isUser ? "divide-white/10" : "divide-slate-100"
                  }`}
                >
                  {block.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={
                        rIdx % 2 === 1
                          ? isUser
                            ? "bg-white/5"
                            : "bg-slate-50/60"
                          : ""
                      }
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`px-3 py-2 whitespace-nowrap ${
                            isUser ? "text-white/90" : "text-slate-700"
                          }`}
                        >
                          {parseInline(cell, isUser)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "number_list") {
          return (
            <div key={i} className="space-y-2 my-2">
              {block.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-xs ${
                      isUser
                        ? "bg-white/30 text-white"
                        : "bg-[#00685F] text-white"
                    }`}
                  >
                    {item.num}
                  </span>
                  <div
                    className={`flex-1 leading-relaxed ${
                      isUser ? "text-white" : "text-slate-700"
                    }`}
                  >
                    {parseInline(item.text, isUser)}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        if (block.type === "bullet_list") {
          return (
            <ul key={i} className="space-y-1.5 my-1.5 pl-0.5">
              {block.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                      isUser ? "bg-white" : "bg-[#00685F]"
                    }`}
                  />
                  <span
                    className={`flex-1 leading-relaxed ${
                      isUser ? "text-white" : "text-slate-700"
                    }`}
                  >
                    {parseInline(item, isUser)}
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "callout") {
          return (
            <div
              key={i}
              className={`my-2 p-3 rounded-xl border leading-relaxed flex items-start gap-2.5 ${
                isUser
                  ? "bg-white/15 border-white/30 text-white"
                  : "bg-amber-50/90 border-amber-200/90 text-amber-950 shadow-xs"
              }`}
            >
              <span className="text-sm shrink-0">💡</span>
              <div className="flex-1">
                <strong
                  className={`font-bold mr-1 ${
                    isUser ? "text-white" : "text-amber-900"
                  }`}
                >
                  {block.tag}:
                </strong>
                <span className={isUser ? "text-white/95" : "text-slate-700"}>
                  {parseInline(block.text, isUser)}
                </span>
              </div>
            </div>
          );
        }

        if (block.type === "key_value") {
          return (
            <div
              key={i}
              className={`flex items-start gap-2 py-0.5 leading-relaxed ${
                isUser ? "text-white" : "text-slate-700"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                  isUser ? "bg-white/70" : "bg-[#00685F]/60"
                }`}
              />
              <div className="flex-1">
                <strong
                  className={`font-semibold mr-1.5 ${
                    isUser ? "text-white" : "text-slate-900"
                  }`}
                >
                  {parseInline(block.key, isUser)}:
                </strong>
                <span className={isUser ? "text-white/90" : "text-slate-700"}>
                  {parseInline(block.value, isUser)}
                </span>
              </div>
            </div>
          );
        }

        if (block.type === "spacer") {
          return <div key={i} className="h-1.5" />;
        }

        return (
          <p key={i} className="leading-relaxed">
            {parseInline(block.text, isUser)}
          </p>
        );
      })}
    </div>
  );
}

function ChatBubble({ role, content }) {
  if (!content || !content.trim()) return null;
  const isUser = role === "user";

  let displayContent = content;
  if (!isUser) {
    // Remove fully-closed <think>...</think> blocks
    const withoutClosedThink = content
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .trim();
    // Remove still-open <think> block (model still reasoning)
    const withoutAnyThink = withoutClosedThink
      .replace(/<think>[\s\S]*/gi, "")
      .trim();
    // If nothing visible yet (model is still in thinking phase), don't render this bubble
    if (!withoutAnyThink) return null;
    displayContent = withoutAnyThink;
  }
  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""} w-full`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-xs">
          AI
        </div>
      )}
      {/* overflow-hidden + min-w-0 prevent bubble from ever overflowing the card edge */}
      <div
        className={`rounded-2xl px-3.5 py-2.5 shadow-xs min-w-0 overflow-hidden ${
          isUser
            ? "max-w-[82%] bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-br-sm font-medium"
            : "max-w-[90%] bg-white border border-slate-100 text-slate-700 rounded-bl-sm"
        }`}
      >
        <FormattedContent content={displayContent} isUser={isUser} />
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

  // Resizing state
  const DEFAULT_SIZE = { width: 380, height: 560 };
  const [size, setSize] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("monefin_ai_chat_size");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.width && parsed.height) {
            const clampedW = Math.max(340, Math.min(parsed.width, window.innerWidth - 24));
            const clampedH = Math.max(420, Math.min(parsed.height, window.innerHeight - 110));
            return { width: clampedW, height: clampedH };
          }
        }
      } catch {
        // ignore
      }
    }
    return DEFAULT_SIZE;
  });

  const [isMaximized, setIsMaximized] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("monefin_ai_chat_size");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.isMaximized === "boolean") {
            return parsed.isMaximized;
          }
        }
      } catch {
        // ignore
      }
    }
    return false;
  });

  const [isDragging, setIsDragging] = useState(false);
  const prevSizeRef = useRef(size);

  const saveSize = (newSize, maximized = false) => {
    try {
      localStorage.setItem(
        "monefin_ai_chat_size",
        JSON.stringify({ ...newSize, isMaximized: maximized })
      );
    } catch {
      // ignore
    }
  };

  const toggleMaximize = () => {
    if (isMaximized) {
      const restored = prevSizeRef.current || DEFAULT_SIZE;
      setSize(restored);
      setIsMaximized(false);
      saveSize(restored, false);
    } else {
      prevSizeRef.current = size;
      const maxW = Math.min(760, window.innerWidth - 24);
      const maxH = Math.min(760, window.innerHeight - 110);
      const newSize = { width: maxW, height: maxH };
      setSize(newSize);
      setIsMaximized(true);
      saveSize(newSize, true);
    }
  };

  const resetSize = () => {
    setSize(DEFAULT_SIZE);
    prevSizeRef.current = DEFAULT_SIZE;
    setIsMaximized(false);
    saveSize(DEFAULT_SIZE, false);
  };

  // Freeform pointer drag resizing (anchored at bottom-right)
  const handlePointerDown = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    setIsMaximized(false);

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = size.width;
    const startH = size.height;

    const onPointerMove = (moveEvent) => {
      const deltaX = startX - moveEvent.clientX; // Drag left -> expand width
      const deltaY = startY - moveEvent.clientY; // Drag up -> expand height

      // right: 24px is the card offset, so card occupies [right-side - width, right-side]
      // max width = viewport - 24px (right gap) - 16px (safe left gap) = viewport - 40px
      const maxW = Math.min(880, window.innerWidth - 40);
      // min width: never less than 280px, but also never wider than available space
      const minW = Math.min(280, window.innerWidth - 40);
      const maxH = Math.min(860, window.innerHeight - 110);
      const minH = 380;

      let newW = startW;
      let newH = startH;

      if (direction === "both" || direction === "width") {
        newW = Math.max(minW, Math.min(maxW, startW + deltaX));
      }
      if (direction === "both" || direction === "height") {
        newH = Math.max(minH, Math.min(maxH, startH + deltaY));
      }

      setSize({ width: newW, height: newH });
    };

    const onPointerUp = () => {
      setIsDragging(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      setSize((curr) => {
        saveSize(curr, false);
        prevSizeRef.current = curr;
        return curr;
      });
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  // Derive from user preferences
  const aiEnabled  = user?.preferences?.ai_enabled ?? false;
  const aiConfig   = user?.preferences?.ai_config ?? {};
  const providerLabel = aiConfig.model
    ? `${aiConfig.model}`
    : (aiConfig.provider ?? null);

  const quickQs = language === "id" ? QUICK_QUESTIONS : QUICK_QUESTIONS_EN;

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
    const history = messages
      .filter((m) => m.content && m.content.trim() !== "")
      .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content }));

    // Add user message only; the typing indicator will display below while waiting for AI
    setMessages((prev) => [
      ...prev.filter((m) => m.content && m.content.trim() !== ""),
      userMsg
    ]);

    try {
      await streamChat({
        message: trimmed,
        history,
        onChunk: (_token, accumulated) => {
          // Strip any <think>...</think> blocks from the accumulated text before storing
          const cleanAccumulated = accumulated
            .replace(/<think>[\s\S]*?<\/think>/gi, "")
            .replace(/<think>[\s\S]*/gi, "")
            .trim();
          // Only dismiss loading indicator once we have visible content
          if (cleanAccumulated) setIsLoading(false);
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.role === "assistant") {
              const updated = [...prev];
              updated[updated.length - 1] = { role: "assistant", content: cleanAccumulated || accumulated };
              return updated;
            }
            return [...prev, { role: "assistant", content: cleanAccumulated || accumulated }];
          });
        },
        onDone: (finalText) => {
          setIsLoading(false);
          if (finalText) {
            const cleanFinal = finalText
              .replace(/<think>[\s\S]*?<\/think>/gi, "")
              .replace(/<think>[\s\S]*/gi, "")
              .trim();
            const content = cleanFinal || finalText;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === "assistant") {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content };
                return updated;
              }
              return [...prev, { role: "assistant", content }];
            });
          }
        },
        onError: (errText) => {
          setIsLoading(false);
          if (errText?.toLowerCase().includes("quota") || errText?.toLowerCase().includes("saldo")) {
            setQuotaError(errText);
          } else {
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              // If the assistant has already produced a response, preserve it!
              if (last && last.role === "assistant" && last.content && last.content.trim()) {
                return prev;
              }
              const text = errText || (language === "id" ? "Gagal memproses jawaban." : "Failed to process response.");
              if (last && last.role === "assistant") {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: text };
                return updated;
              }
              return [...prev, { role: "assistant", content: text }];
            });
          }
        }
      });
    } catch (err) {
      setIsLoading(false);
      const errMsg = err?.message || "Terjadi kesalahan koneksi.";
      if (errMsg.toLowerCase().includes("quota") || errMsg.toLowerCase().includes("saldo")) {
        setQuotaError(errMsg);
      } else {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          // If the assistant has already produced a response, preserve it!
          if (last && last.role === "assistant" && last.content && last.content.trim()) {
            return prev;
          }
          if (last && last.role === "assistant") {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: errMsg };
            return updated;
          }
          return [...prev, { role: "assistant", content: errMsg }];
        });
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

  if (!aiEnabled) return null;

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

      {/* Adjustable Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col origin-bottom-right overflow-hidden ${
          isDragging ? "select-none" : "transition-all duration-300"
        } ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 translate-y-4 pointer-events-none"
        }`}
        style={{
          // right: 24px (1.5rem) is the card's right offset.
          // Width is capped to (viewport - right offset - 16px safe left gap) so the card can NEVER overflow the left viewport edge.
          width: `min(${size.width}px, calc(100vw - 2.5rem))`,
          height: `min(${size.height}px, calc(100vh - 7rem))`,
          maxWidth: "calc(100vw - 2.5rem)",
          maxHeight: "calc(100vh - 6.5rem)",
          minHeight: "380px",
          // Min width: 280px, but respect viewport if smaller
          minWidth: "min(280px, calc(100vw - 2.5rem))",
        }}
      >
        {/* Resize Handles (interactive when panel is open) */}
        {isOpen && (
          <>
            {/* Top-Left Corner Drag Handle (resizes width & height) */}
            <div
              onPointerDown={(e) => handlePointerDown(e, "both")}
              className="absolute top-0 left-0 w-6 h-6 cursor-nwse-resize z-20 flex items-start justify-start p-1.5 group touch-none"
              title={language === "id" ? "Tarik untuk ubah ukuran (lebar & tinggi)" : "Drag to resize (width & height)"}
            >
              <div className="w-2 h-2 border-t-2 border-l-2 border-white/60 group-hover:border-white rounded-tl-xs transition-colors" />
            </div>

            {/* Left Edge Handle (resizes width) */}
            <div
              onPointerDown={(e) => handlePointerDown(e, "width")}
              className="absolute top-6 bottom-0 left-0 w-2 cursor-ew-resize hover:bg-brand-500/20 z-20 touch-none transition-colors"
              title={language === "id" ? "Tarik untuk ubah lebar" : "Drag to resize width"}
            />

            {/* Top Edge Handle (resizes height) */}
            <div
              onPointerDown={(e) => handlePointerDown(e, "height")}
              className="absolute top-0 left-6 right-24 h-2 cursor-ns-resize hover:bg-brand-500/20 z-20 touch-none transition-colors"
              title={language === "id" ? "Tarik untuk ubah tinggi" : "Drag to resize height"}
            />
          </>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-3.5 flex items-center justify-between shrink-0 select-none relative">
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

          <div className="flex items-center gap-1">
            {/* Reset size button if modified */}
            {(size.width !== DEFAULT_SIZE.width || size.height !== DEFAULT_SIZE.height || isMaximized) && (
              <button
                onClick={resetSize}
                title={language === "id" ? "Kembalikan ke ukuran standar" : "Reset default size"}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Maximize / Restore Toggle */}
            <button
              onClick={toggleMaximize}
              title={
                isMaximized
                  ? (language === "id" ? "Kecilkan tampilan" : "Restore size")
                  : (language === "id" ? "Perbesar tampilan" : "Maximize panel")
              }
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isMaximized ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Clear history */}
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-white/70 hover:text-white hover:bg-white/10 px-2 py-1 rounded-lg transition-colors text-xs ml-1"
              >
                {language === "id" ? "Hapus" : "Clear"}
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        {/* min-w-0 is critical: prevents the flex child from growing beyond the card width */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 min-h-0 min-w-0">
          {/* Intro / Welcome */}
          {showIntro && (
            <div className="space-y-4">
              <div className="flex items-end gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-xs">
                  AI
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-xs text-xs sm:text-[13px] text-slate-700 leading-relaxed max-w-[94%]">
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
