"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../hooks/useAuth";
import { useAiStream } from "../../hooks/useAiStream";
import {
  AlertTriangle,
  Settings,
  ExternalLink,
  Maximize2,
  Minimize2,
  RotateCcw,
  X,
  Sparkles,
  Send,
  ArrowUp
} from "lucide-react";

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
    <div className="flex items-end gap-2 animate-in fade-in duration-200">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00685F] to-[#004D46] flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-xs border border-white/20">
        AI
      </div>
      <div className="bg-white border border-slate-200/80 rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs">
        <div className="flex gap-1.5 items-center h-4">
          <span className="w-1.5 h-1.5 bg-[#00685F] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 bg-[#00685F] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 bg-[#00685F] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function parseInline(text, isUser, depth = 0) {
  if (!text) return null;
  if (depth > 3) return text;

  // Normalize common LLM mismatched bold/italic pairs (e.g. "**Judul:*" or "*Judul:**")
  const normalizedText = String(text)
    .replace(/\*\*([^\n*]+?)\*(?!\*)/g, "**$1**")
    .replace(/(?<!\*)\*([^\n*]+?)\*\*/g, "**$1**");

  const parts = [];
  // Matches:
  // 1) ***bold italic***
  // 2) **bold** (allows single *italic* inside **bold**, e.g. "**Evaluasi Arus Kas *(Cash Flow)*:**")
  // 3) __bold__
  // 4) *italic*
  // 5) `code`
  // 6) Unclosed **bold at the end of a streaming line
  const regex =
    /(\*\*\*(?:[^\n*]|\*(?!\*\*))+?\*\*\*|\*\*(?:[^\n*]|\*(?!\*))+?\*\*|__[^\n_]+?__|\*[^\n*]+?\*|`[^\n`]+?`|\*\*[^\n*]{1,80}$)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(normalizedText)) !== null) {
    if (match.index > lastIndex) {
      parts.push(normalizedText.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("***") && token.endsWith("***") && token.length >= 6) {
      const inner = token.slice(3, -3);
      parts.push(
        <strong
          key={`${depth}-${match.index}`}
          className={`italic ${isUser ? "font-black" : "font-extrabold text-slate-900"}`}
        >
          {parseInline(inner, isUser, depth + 1)}
        </strong>
      );
    } else if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
      const inner = token.slice(2, -2);
      parts.push(
        <strong
          key={`${depth}-${match.index}`}
          className={isUser ? "font-black" : "font-extrabold text-slate-900"}
        >
          {parseInline(inner, isUser, depth + 1)}
        </strong>
      );
    } else if (token.startsWith("__") && token.endsWith("__") && token.length >= 4) {
      const inner = token.slice(2, -2);
      parts.push(
        <strong
          key={`${depth}-${match.index}`}
          className={isUser ? "font-black" : "font-extrabold text-slate-900"}
        >
          {parseInline(inner, isUser, depth + 1)}
        </strong>
      );
    } else if (token.startsWith("**") && !token.endsWith("**") && token.length > 2) {
      // Unclosed ** at end of streaming line
      const inner = token.slice(2);
      parts.push(
        <strong
          key={`${depth}-${match.index}`}
          className={isUser ? "font-black" : "font-extrabold text-slate-900"}
        >
          {inner}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*") && token.length >= 2) {
      parts.push(
        <em key={`${depth}-${match.index}`} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("`") && token.endsWith("`") && token.length >= 2) {
      parts.push(
        <code
          key={`${depth}-${match.index}`}
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

  if (lastIndex < normalizedText.length) {
    parts.push(normalizedText.slice(lastIndex));
  }

  return parts.length > 0 ? parts : normalizedText;
}

function isTableLine(trimmedLine) {
  return trimmedLine.startsWith("|") && trimmedLine.indexOf("|", 1) !== -1;
}

function isTableDividerRow(cells) {
  return (
    cells.length > 0 &&
    cells.every((c) => c === "" || /^:?-+:?$/.test(c))
  );
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

    // 2. Horizontal Divider (---, ***, ___)
    if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({ type: "divider" });
      i++;
      continue;
    }

    // 3. Headings (#, ##, ###, ####)
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

    // 4. Markdown Tables (| Col 1 | Col 2 | — supports streaming rows even before closing |)
    if (isTableLine(trimmed)) {
      const tableLines = [];
      while (i < lines.length) {
        const tLine = lines[i].trim();
        if (isTableLine(tLine) || (tLine.startsWith("|") && tableLines.length > 0)) {
          tableLines.push(tLine);
          i++;
        } else if (tLine === "") {
          let lookAhead = i + 1;
          while (lookAhead < lines.length && lines[lookAhead].trim() === "") {
            lookAhead++;
          }
          if (lookAhead < lines.length && isTableLine(lines[lookAhead].trim())) {
            i = lookAhead;
          } else {
            break;
          }
        } else {
          break;
        }
      }

      const cleanRows = tableLines
        .map((line) => {
          const stripped = line.replace(/^\|/, "").replace(/\|$/, "");
          return stripped.split("|").map((cell) => cell.trim());
        })
        .filter((cells) => cells.some((c) => c !== ""));

      if (cleanRows.length > 0) {
        const headers = cleanRows[0];
        const dataRows = cleanRows
          .slice(1)
          .filter((row) => !isTableDividerRow(row));
        blocks.push({
          type: "table",
          headers,
          rows: dataRows,
        });
      }
      continue;
    }

    // 5. Numbered list items (e.g. "1. Item" or "1.\nItem" with multi-line continuation)
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
        } else if (
          !nextTrimmed.startsWith("#") &&
          !isTableLine(nextTrimmed) &&
          !/^(?:-{3,}|\*{3,}|_{3,})$/.test(nextTrimmed) &&
          !nextTrimmed.match(/^[\*\-•]\s+/)
        ) {
          // Multi-line continuation of the current numbered item
          const lastItem = items[items.length - 1];
          lastItem.text = lastItem.text ? `${lastItem.text} ${nextTrimmed}` : nextTrimmed;
          i++;
        } else {
          break;
        }
      }

      blocks.push({ type: "number_list", items });
      continue;
    }

    // 6. Standard bullet items (* Item or - Item or • Item)
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

    // 7. Callouts / Notes (Note:, Catatan:, Tips:, Tip:, Penting:, Warning:)
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

    // 8. Key: Value lines (e.g. "Total balance: Rp 112.5 M across all accounts")
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

    // 9. Normal paragraph
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
        if (block.type === "divider") {
          return (
            <hr
              key={i}
              className={`my-2.5 border-0 border-t ${
                isUser ? "border-white/20" : "border-slate-200/90"
              }`}
            />
          );
        }

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
          const isMultiCol = block.headers.length >= 3;

          if (isMultiCol) {
            return (
              <div
                key={i}
                className={`my-2 rounded-xl border shadow-xs divide-y overflow-hidden ${
                  isUser
                    ? "border-white/30 bg-white/10 divide-white/15"
                    : "border-slate-200/90 bg-white divide-slate-100"
                }`}
              >
                {block.rows.map((row, rIdx) => (
                  <div
                    key={rIdx}
                    className={`p-2.5 sm:p-3 ${
                      rIdx % 2 === 1
                        ? isUser
                          ? "bg-white/5"
                          : "bg-slate-50/50"
                        : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <span
                        className={`block text-[10px] font-semibold uppercase tracking-wider ${
                          isUser ? "text-white/70" : "text-slate-400"
                        }`}
                      >
                        {parseInline(block.headers[0] ?? "", isUser)}
                      </span>
                      <div
                        className={`font-bold text-xs sm:text-[13px] mt-0.5 break-words ${
                          isUser ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {parseInline(row[0] ?? "-", isUser)}
                      </div>
                    </div>

                    <div
                      className={`grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2 pt-2 border-t ${
                        isUser ? "border-white/15" : "border-slate-100"
                      }`}
                    >
                      {block.headers.slice(1).map((headerText, idx) => {
                        const cellVal = row[idx + 1] ?? "-";
                        return (
                          <div key={idx} className="min-w-0">
                            <span
                              className={`block text-[10px] font-medium leading-tight break-words ${
                                isUser ? "text-white/70" : "text-slate-400"
                              }`}
                            >
                              {parseInline(headerText, isUser)}
                            </span>
                            <span
                              className={`block text-[11px] sm:text-xs font-semibold mt-0.5 break-words ${
                                isUser ? "text-white" : "text-slate-800"
                              }`}
                            >
                              {parseInline(cellVal, isUser)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div
              key={i}
              className={`my-2 rounded-xl border shadow-xs overflow-hidden ${
                isUser
                  ? "border-white/30 bg-white/10"
                  : "border-slate-200/90 bg-white"
              }`}
            >
              <table className="w-full table-fixed text-left text-[11px] sm:text-xs border-collapse">
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
                        className="px-2.5 py-2 font-bold align-top break-words whitespace-normal"
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
                      {block.headers.map((_, cIdx) => {
                        const cell = row[cIdx] ?? "";
                        return (
                          <td
                            key={cIdx}
                            className={`px-2.5 py-2 align-top break-words whitespace-normal ${
                              isUser ? "text-white/90" : "text-slate-700"
                            }`}
                          >
                            {parseInline(cell, isUser)}
                          </td>
                        );
                      })}
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
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""} w-full animate-in fade-in slide-in-from-bottom-1 duration-200`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00685F] to-[#004D46] flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-xs border border-white/20">
          AI
        </div>
      )}
      {/* overflow-hidden + min-w-0 prevent bubble from ever overflowing the card edge */}
      <div
        className={`rounded-2xl px-4 py-2.5 shadow-xs min-w-0 overflow-hidden ${
          isUser
            ? "max-w-[84%] bg-gradient-to-br from-[#00685F] to-[#004D46] text-white rounded-br-xs font-medium shadow-md shadow-[#00685F]/15"
            : "max-w-[92%] bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs shadow-xs"
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

  // Screen size awareness for mobile responsiveness
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Resizing state
  const DEFAULT_SIZE = { width: 380, height: 560 };
  const panelRef = useRef(null);
  const [size, setSize] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("monefin_ai_chat_size");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.width && parsed.height) {
            const clampedW = Math.max(320, Math.min(parsed.width, window.innerWidth - 40));
            const clampedH = Math.max(380, Math.min(parsed.height, window.innerHeight - 110));
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
  const liveSizeRef = useRef(size);

  useEffect(() => {
    liveSizeRef.current = size;
  }, [size]);

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
      liveSizeRef.current = restored;
      setIsMaximized(false);
      saveSize(restored, false);
    } else {
      prevSizeRef.current = liveSizeRef.current || size;
      const maxW = Math.min(760, typeof window !== "undefined" ? window.innerWidth - 40 : 760);
      const maxH = Math.min(720, typeof window !== "undefined" ? window.innerHeight - 120 : 700);
      const newSize = { width: maxW, height: maxH };
      setSize(newSize);
      liveSizeRef.current = newSize;
      setIsMaximized(true);
      saveSize(newSize, true);
    }
  };

  const resetSize = () => {
    setSize(DEFAULT_SIZE);
    liveSizeRef.current = DEFAULT_SIZE;
    prevSizeRef.current = DEFAULT_SIZE;
    setIsMaximized(false);
    saveSize(DEFAULT_SIZE, false);
  };

  // Zero-lag 60/120fps pointer drag resizing (direct DOM + rAF, commits React state on pointerup)
  const handlePointerDown = (e, direction) => {
    if (isMobile) return;
    e.preventDefault();
    e.stopPropagation();

    const panelEl = panelRef.current;
    const rect = panelEl ? panelEl.getBoundingClientRect() : null;
    const startW = rect ? Math.round(rect.width) : size.width;
    const startH = rect ? Math.round(rect.height) : size.height;

    const startX = e.clientX;
    const startY = e.clientY;

    liveSizeRef.current = { width: startW, height: startH };

    // Disable CSS transition immediately before first move frame to prevent rubber-band lag
    if (panelEl) {
      panelEl.style.transition = "none";
      panelEl.style.width = `min(${startW}px, calc(100vw - 2.5rem))`;
      panelEl.style.height = `min(${startH}px, calc(100vh - 7rem))`;
    }

    const cursorType =
      direction === "both"
        ? "nwse-resize"
        : direction === "width"
        ? "ew-resize"
        : "ns-resize";
    document.body.style.cursor = cursorType;
    document.body.style.userSelect = "none";

    setIsDragging(true);
    if (isMaximized) {
      setIsMaximized(false);
    }

    let rafId = null;

    const onPointerMove = (moveEvent) => {
      const deltaX = startX - moveEvent.clientX; // Drag left -> expand width
      const deltaY = startY - moveEvent.clientY; // Drag up -> expand height

      const maxW = Math.min(880, window.innerWidth - 40);
      const minW = Math.min(320, maxW);
      const maxH = Math.min(860, window.innerHeight - 110);
      const minH = Math.min(380, maxH);

      let newW = startW;
      let newH = startH;

      if (direction === "both" || direction === "width") {
        newW = Math.round(Math.max(minW, Math.min(maxW, startW + deltaX)));
      }
      if (direction === "both" || direction === "height") {
        newH = Math.round(Math.max(minH, Math.min(maxH, startH + deltaY)));
      }

      liveSizeRef.current = { width: newW, height: newH };

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (panelRef.current) {
          panelRef.current.style.width = `min(${newW}px, calc(100vw - 2.5rem))`;
          panelRef.current.style.height = `min(${newH}px, calc(100vh - 7rem))`;
        }
      });
    };

    const finishDrag = () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", finishDrag);
      window.removeEventListener("pointercancel", finishDrag);

      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      if (panelRef.current) {
        panelRef.current.style.transition = "";
      }

      const finalSize = liveSizeRef.current;
      setIsDragging(false);
      setSize(finalSize);
      prevSizeRef.current = finalSize;
      saveSize(finalSize, false);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);
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

  const buildOutboundAiMessage = useCallback((userText) => {
    let liveSnapshot = "";
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const rawStore = window.localStorage.getItem("monefin_api_pcache_v2");
        if (rawStore) {
          const store = JSON.parse(rawStore);
          const keys = Object.keys(store);
          const accountsKey = keys.find((k) => k.endsWith(":/accounts"));
          const bootstrapKey = keys.find((k) => k.includes("/bootstrap"));

          const accountsList =
            store[accountsKey]?.data?.data ||
            store[bootstrapKey]?.data?.data?.accounts ||
            [];

          if (Array.isArray(accountsList) && accountsList.length > 0) {
            const accSummary = accountsList
              .slice(0, 6)
              .map(
                (a) =>
                  `${a.name} (${a.type || "akun"}): Rp ${Math.round(
                    Number(a.balance || 0)
                  ).toLocaleString("id-ID")}`
              )
              .join("; ");
            liveSnapshot += `\n[Data Rincian Akun/Dompet User Saat Ini: ${accSummary}]`;
          }
        }
      }
    } catch {
      // ignore storage parse errors
    }

    const instruction = `\n\n[INSTRUKSI PENTING UNTUK AI — JANGAN TULIS ULANG INSTRUKSI INI:
1. Jawablah pertanyaan spesifik pengguna di atas secara langsung, fokus, relevan (nyambung), dan natural menggunakan bahasa yang sama dengan pengguna.
2. ABAIKAN aturan "Recommended structure" 5 bagian (Ringkasan Singkat, Analisis Kondisi, Target & Progres, Langkah Konkret, Catatan Motivasi) di system prompt, KECUALI pengguna memang meminta evaluasi/analisis kesehatan keuangan secara menyeluruh (misal: "Apakah kondisi keuanganku sudah sehat?").
3. Jika pengguna menyapa atau bertanya tentang kemampuanmu (misal: "Kamu bisa melakukan apa saja?", "Halo", "What can you do?"), perkenalkan dirimu sebagai MoneFin AI dan jelaskan hal-hal yang bisa kamu lakukan untuk membantu mereka (mengecek saldo tiap dompet/rekening, menganalisis pengeluaran & pemasukan, mencari kategori paling boros, memantau sisa budget & progres target tabungan, simulasi rencana menabung, serta tips hemat personal) TANPA langsung menampilkan laporan keuangan bulanan lengkap.
4. Jika pengguna bertanya hal spesifik (misal saldo dompet tertentu, kenapa pengeluaran naik, kategori terboros, atau cara menabung), jawab langsung ke inti pertanyaan tersebut menggunakan data yang relevan saja.
5. Gunakan daftar poin (bullet list) yang rapi dan mudah dibaca di layar HP; hindari membuat tabel lebih dari 2 kolom.]`;

    const combined = `${userText}${liveSnapshot}${instruction}`;
    return combined.length <= 1950 ? combined : userText;
  }, []);

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading || isStreaming) return;

    setShowIntro(false);
    setInput("");
    setIsLoading(true);
    setQuotaError(null);

    const userMsg = { role: "user", content: trimmed };
    // Payload dibatasi: 8 turn terakhir saja (backend juga memangkas) agar
    // request cepat & murah; history penuh tetap tersimpan di UI.
    const history = messages
      .filter((m) => m.content && m.content.trim() !== "")
      .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content }))
      .slice(-8);

    // Add user message only; the typing indicator will display below while waiting for AI
    setMessages((prev) => [
      ...prev.filter((m) => m.content && m.content.trim() !== ""),
      userMsg
    ]);

    try {
      await streamChat({
        message: buildOutboundAiMessage(trimmed),
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
          // Kembalikan draft agar pengguna tinggal tekan kirim ulang (retry 1 klik).
          setInput(trimmed);
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
      setInput(trimmed);
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
  }, [input, isLoading, isStreaming, messages, language, streamChat, buildOutboundAiMessage]);

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
        aria-label={isOpen ? (language === "id" ? "Tutup MoneFin AI" : "Close MoneFin AI") : (language === "id" ? "Buka MoneFin AI" : "Open MoneFin AI")}
        className={`fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 cursor-pointer group shadow-2xl ${
          isOpen
            ? "bg-slate-800 text-white shadow-slate-900/30 ring-2 ring-white/20 rotate-90"
            : "bg-gradient-to-br from-[#00796B] via-[#00685F] to-[#004D46] text-white shadow-[0_10px_25px_-5px_rgba(0,104,95,0.5)] hover:shadow-[0_14px_30px_-5px_rgba(0,104,95,0.65)] ring-2 ring-white/30 rotate-0"
        }`}
      >
        <div className="relative w-6 h-6 flex items-center justify-center">
          {/* Close Icon (visible when open) */}
          <X
            className={`w-5 h-5 sm:w-6 sm:h-6 text-white absolute inset-0 m-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isOpen
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-50"
            }`}
          />
          {/* Sparkles Icon (visible when closed) */}
          <Sparkles
            className={`w-5 h-5 sm:w-6 sm:h-6 text-white absolute inset-0 m-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isOpen
                ? "opacity-0 rotate-90 scale-50"
                : "opacity-100 rotate-0 scale-100"
            }`}
          />
        </div>
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full bg-[#00685F]/35 animate-ping -z-10 pointer-events-none" />
        )}
      </button>

      {/* Mobile Backdrop Overlay - Smooth fade in & fade out */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300 ease-out ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Adjustable Chat Panel */}
      <div
        ref={panelRef}
        className={`fixed z-50 bg-white/98 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3),0_10px_30px_-10px_rgba(0,104,95,0.25)] border border-slate-200/90 flex flex-col overflow-hidden origin-bottom sm:origin-bottom-right ${
          isDragging
            ? "transition-none select-none ring-2 ring-[#00685F]/30"
            : "transition-[width,height,bottom,right,left,border-radius,transform,opacity] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[width,height,transform,opacity]"
        } ${
          isMobile
            ? isMaximized
              ? "inset-x-0 mx-auto rounded-none"
              : "inset-x-0 mx-auto rounded-3xl"
            : "bottom-24 right-6 rounded-3xl"
        } ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-[0.92] translate-y-6 pointer-events-none"
        }`}
        style={
          isMobile
            ? isMaximized
              ? {
                  bottom: "0px",
                  width: "100vw",
                  height: "100dvh",
                  maxWidth: "100vw",
                  maxHeight: "100dvh",
                }
              : {
                  bottom: "4.5rem",
                  width: "min(420px, calc(100vw - 1.25rem))",
                  maxWidth: "420px",
                  height: "min(500px, calc(100dvh - 5.5rem))",
                  maxHeight: "calc(100dvh - 5.5rem)",
                }
            : isMaximized
              ? {
                  width: "min(760px, calc(100vw - 2.5rem))",
                  height: "min(720px, calc(100vh - 7.5rem))",
                  maxWidth: "calc(100vw - 2.5rem)",
                  maxHeight: "calc(100vh - 7.5rem)",
                  minHeight: "380px",
                  minWidth: "min(320px, calc(100vw - 2.5rem))",
                }
              : {
                  width: `min(${size.width}px, calc(100vw - 2.5rem))`,
                  height: `min(${size.height}px, calc(100vh - 7rem))`,
                  maxWidth: "calc(100vw - 2.5rem)",
                  maxHeight: "calc(100vh - 6.5rem)",
                  minHeight: "380px",
                  minWidth: "min(320px, calc(100vw - 2.5rem))",
                }
        }
      >
        {/* Resize Handles (interactive when panel is open on desktop only) */}
        {isOpen && !isMobile && (
          <>
            {/* Top-Left Corner Drag Handle (resizes width & height) */}
            <div
              onPointerDown={(e) => handlePointerDown(e, "both")}
              className="absolute top-0 left-0 w-8 h-8 cursor-nwse-resize z-20 flex items-start justify-start p-2 group touch-none"
              title={language === "id" ? "Tarik untuk ubah ukuran (lebar & tinggi)" : "Drag to resize (width & height)"}
            >
              <div className="w-2.5 h-2.5 border-t-2 border-l-2 border-white/60 group-hover:border-white group-hover:scale-110 rounded-tl-md transition-all duration-150" />
            </div>

            {/* Bottom-Left Corner Drag Handle (resizes width) */}
            <div
              onPointerDown={(e) => handlePointerDown(e, "width")}
              className="absolute bottom-0 left-0 w-6 h-6 cursor-ew-resize z-20 touch-none flex items-end justify-start p-1.5 group"
              title={language === "id" ? "Tarik untuk ubah lebar" : "Drag to resize width"}
            >
              <div className="w-2 h-2 border-b-2 border-l-2 border-slate-300 group-hover:border-[#00685F] rounded-bl-sm transition-colors" />
            </div>

            {/* Left Edge Handle (resizes width) */}
            <div
              onPointerDown={(e) => handlePointerDown(e, "width")}
              className="absolute top-7 bottom-6 left-0 w-2 cursor-ew-resize hover:bg-[#00685F]/20 active:bg-[#00685F]/35 z-20 touch-none transition-colors"
              title={language === "id" ? "Tarik untuk ubah lebar" : "Drag to resize width"}
            />

            {/* Top Edge Handle (resizes height) */}
            <div
              onPointerDown={(e) => handlePointerDown(e, "height")}
              className="absolute top-0 left-7 right-32 h-2.5 cursor-ns-resize hover:bg-white/25 active:bg-white/35 z-20 touch-none transition-colors"
              title={language === "id" ? "Tarik untuk ubah tinggi" : "Drag to resize height"}
            />
          </>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-[#00685F] via-[#005e56] to-[#004D46] px-4 sm:px-5 py-3 sm:py-3.5 pt-[max(0.75rem,env(safe-area-inset-top))] flex items-center justify-between shrink-0 select-none relative overflow-hidden">
          {/* Ambient glass highlight */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-white/5 to-transparent pointer-events-none" />

          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 relative z-10">
            <div className="relative">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
                <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#00685F] shadow-xs" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs sm:text-sm font-extrabold text-white truncate tracking-tight">MoneFin AI</p>
                <span className="text-[9px] font-black uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded-md text-white/90 shrink-0">
                  SMART
                </span>
              </div>
              <p className="text-[10px] text-white/80 flex items-center gap-1 truncate font-medium">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block shrink-0 animate-pulse" />
                <span className="truncate">
                  {providerLabel
                    ? `${language === "id" ? "Aktif via" : "Active via"} ${providerLabel}`
                    : (language === "id" ? "Advisor Keuangan Pribadi" : "Personal Finance Advisor")}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 relative z-10">
            {/* Clear history */}
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-1 rounded-xl transition-all duration-150 text-[11px] font-bold cursor-pointer active:scale-95"
              >
                {language === "id" ? "Hapus" : "Clear"}
              </button>
            )}

            {/* Reset size button if modified (desktop only) */}
            {!isMobile && (size.width !== DEFAULT_SIZE.width || size.height !== DEFAULT_SIZE.height || isMaximized) && (
              <button
                type="button"
                onClick={resetSize}
                title={language === "id" ? "Kembalikan ke ukuran standar" : "Reset default size"}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-150 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Maximize / Restore Toggle */}
            <button
              type="button"
              onClick={toggleMaximize}
              title={
                isMaximized
                  ? (language === "id" ? "Kecilkan tampilan" : "Restore size")
                  : (language === "id" ? "Perbesar tampilan" : "Maximize panel")
              }
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-150 cursor-pointer active:scale-95"
              aria-label={isMaximized ? "Restore size" : "Maximize panel"}
            >
              {isMaximized ? (
                <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>

            {/* Direct Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              title={language === "id" ? "Tutup chat" : "Close chat"}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-rose-500/80 hover:border-rose-400/50 border border-white/10 transition-all duration-150 cursor-pointer active:scale-95"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        {/* min-w-0 is critical: prevents the flex child from growing beyond the card width */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60 min-h-0 min-w-0 overscroll-contain">
          {/* Intro / Welcome */}
          {showIntro && (
            <div className="space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-[#00685F]/5 to-teal-500/10 border border-[#00685F]/15 p-4 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00685F] to-[#004D46] flex items-center justify-center text-white shrink-0 shadow-xs mt-0.5">
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs sm:text-[13px] font-bold text-slate-800">
                      {language === "id" ? "Halo! Saya MoneFin AI 👋" : "Hello! I'm MoneFin AI 👋"}
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">
                      {language === "id"
                        ? "Advisor keuangan cerdas Anda. Saya siap menganalisis pemasukan, pengeluaran, anggaran, dan memberikan rekomendasi finansial terbaik."
                        : "Your smart personal finance advisor. I'm ready to analyze your income, expenses, budgets, and provide tailored financial insights."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00685F]" />
                  {language === "id" ? "Pertanyaan Cepat" : "Quick Prompts"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickQs.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="group p-2.5 text-left bg-white border border-slate-200/80 rounded-xl hover:border-[#00685F]/50 hover:bg-emerald-50/40 hover:shadow-xs transition-all duration-200 cursor-pointer flex items-center justify-between gap-2"
                    >
                      <span className="text-[11px] font-semibold text-slate-700 group-hover:text-[#00685F] transition-colors line-clamp-2">
                        {q}
                      </span>
                      <ArrowUp className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#00685F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 rotate-45" />
                    </button>
                  ))}
                </div>
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
        <div className="p-3 sm:p-3.5 bg-white/95 backdrop-blur-md border-t border-slate-100 shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-2 bg-slate-50/90 border border-slate-200/90 rounded-2xl px-3.5 py-2 focus-within:border-[#00685F] focus-within:ring-4 focus-within:ring-[#00685F]/10 focus-within:bg-white transition-all shadow-2xs">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={language === "id" ? "Tanyakan sesuatu tentang keuangan Anda..." : "Ask something about your finances..."}
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none min-w-0 font-medium py-1"
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00685F] to-[#004D46] text-white flex items-center justify-center hover:shadow-md hover:shadow-[#00685F]/30 hover:scale-105 active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:scale-100 disabled:shadow-none cursor-pointer shrink-0"
              title={language === "id" ? "Kirim pesan" : "Send message"}
            >
              {isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          {providerLabel && (
            <p className="text-[10px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1 font-medium">
              <Sparkles className="w-2.5 h-2.5 text-[#00685F]" />
              <span>Powered by {providerLabel}</span>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
