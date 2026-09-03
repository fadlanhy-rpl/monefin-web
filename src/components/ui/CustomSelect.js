"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Pilih Opsi...",
  icon: LeadingIcon,
  className = "",
  searchable = false,
  searchPlaceholder = "Cari...",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = searchable && searchQuery.trim()
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : options;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-2xl px-3.5 py-2.5 sm:py-3 flex items-center justify-between gap-2.5 text-left transition-all duration-200 cursor-pointer shadow-2xs ${
          isOpen
            ? "border-[#00685F] ring-2 ring-[#00685F]/20 shadow-md"
            : "border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {LeadingIcon && (
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-[#00685F] flex items-center justify-center shrink-0">
              <LeadingIcon className="w-4 h-4" />
            </div>
          )}
          {selectedOption?.icon && (
            <selectedOption.icon className="w-4 h-4 text-[#00685F] shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <span className={`block truncate text-xs sm:text-sm font-extrabold ${
              selectedOption ? "text-slate-900" : "text-slate-400"
            }`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            {selectedOption?.sublabel && (
              <span className="block truncate text-[10px] sm:text-[11px] font-bold text-[#00685F]">
                {selectedOption.sublabel}
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-[#00685F]" : ""
          }`}
        />
      </button>

      {/* Dropdown Floating Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl p-1.5 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150 max-h-60 overflow-y-auto">
          {searchable && (
            <div className="p-1.5 border-b border-slate-100">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-8 pr-3 py-1.5 text-xs font-bold outline-none focus:border-[#00685F]"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          <div className="space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs font-bold text-slate-400">
                Tidak ada opsi yang cocok
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                const IconComp = opt.icon;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full px-3 py-2 sm:py-2.5 rounded-xl flex items-center justify-between gap-2.5 text-left transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50 text-[#00685F] font-black"
                        : "hover:bg-slate-50 text-slate-700 font-bold"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {IconComp && (
                        <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#00685F]" : "text-slate-400"}`} />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-xs sm:text-sm">
                          {opt.label}
                        </span>
                        {opt.sublabel && (
                          <span className={`block truncate text-[10px] ${
                            isSelected ? "text-[#00685F]/80" : "text-slate-400"
                          }`}>
                            {opt.sublabel}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-[#00685F] shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
