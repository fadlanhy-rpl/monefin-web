"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Tag, 
  CreditCard, 
  Target, 
  Trophy 
} from "lucide-react";
import { useCurrency } from "../../../hooks/useCurrency";
import { useLanguage } from "../../../context/LanguageContext";

function SearchResultGroup({ title, icon, items, renderItem, onItemClick }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-1.5 last:mb-0 w-full">
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest bg-slate-50/80 rounded-lg mx-1 w-full">
        {icon}
        <span>{title}</span>
      </div>

      <div className="mt-1 space-y-0.5 w-full">
        {items.map((item) => {
          const { href, label, meta, metaColor, sub, icon: itemIcon } = renderItem(item);
          return (
            <Link
              key={item.id}
              href={href}
              onMouseDown={(e) => {
                e.preventDefault();
                sessionStorage.setItem("global-search", label);
              }}
              onClick={onItemClick}
              className="group flex items-center justify-between gap-6 px-3 py-2.5 rounded-xl hover:bg-brand-50/80 active:bg-brand-100/70 transition-all mx-1 cursor-pointer w-full"
            >
              {/* Left group: Icon & Full Text */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-white flex items-center justify-center transition-all shadow-xs border border-slate-100 shrink-0">
                  {itemIcon}
                </div>

                <div className="shrink-0">
                  <p className="text-xs font-bold text-slate-800 whitespace-nowrap group-hover:text-brand-700 transition-colors">
                    {label}
                  </p>
                  {sub && (
                    <p className="text-[10px] text-slate-500 whitespace-nowrap mt-0.5">{sub}</p>
                  )}
                </div>
              </div>

              {/* Right group: Meta & Arrow */}
              <div className="flex items-center gap-2 shrink-0 ml-auto pl-4">
                {meta && (
                  <span className={`text-xs font-bold tabular-nums whitespace-nowrap ${metaColor}`}>
                    {meta}
                  </span>
                )}

                <svg
                  className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 transition-all -translate-x-0.5 group-hover:translate-x-0 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function HeaderGlobalSearch({
  searchQuery,
  handleSearchChange,
  searchOpen,
  setSearchOpen,
  setIsFocused,
  isExpanded,
  closeSearch,
  results,
  isLoading,
  error,
  totalResults,
  hasSearch,
  searchInputRef,
  onFocusInput,
}) {
  const router = useRouter();
  const { formatCurrency } = useCurrency();
  const { language } = useLanguage();

  return (
    <div className={`relative transition-all duration-300 ease-in-out h-10 ${
      isExpanded
        ? "flex-1 w-full max-w-[260px] min-[400px]:max-w-[300px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[480px]"
        : "w-10 sm:w-full sm:max-w-[300px] md:max-w-[360px] lg:max-w-[440px]"
    }`}>
      {/* Label sr-only (accessibility) */}
      <label htmlFor="header-search" className="sr-only">Cari transaksi, kategori, rekening, atau goal</label>

      <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10 ${
        isExpanded ? "left-3.5 text-slate-400" : "left-3.5 text-slate-600 hidden sm:block"
      }`} />

      <input
        ref={searchInputRef}
        id="header-search"
        name="monefin_site_search"
        type="search"
        placeholder={language === "en" ? "Search analytics, transactions..." : "Cari analitik, transaksi..."}
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore="true"
        data-bwignore="true"
        data-form-type="other"
        value={searchQuery}
        onChange={(e) => {
          handleSearchChange(e.target.value);
          setSearchOpen(true);
        }}
        onFocus={() => {
          setIsFocused(true);
          setSearchOpen(true);
          onFocusInput();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && searchQuery.trim()) {
            e.preventDefault();
            const q = searchQuery.trim();
            closeSearch();
            router.push(`/transactions?search=${encodeURIComponent(q)}`);
          }
        }}
        onBlur={() => {
          setTimeout(() => {
            setIsFocused(false);
            setSearchOpen(false);
          }, 200);
        }}
        className={`w-full h-full bg-white border border-slate-200/80 rounded-full py-2 text-sm placeholder:text-slate-400 text-slate-700 focus:border-brand-600 focus:outline-none transition-all shadow-sm shadow-slate-100/50 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden ${
          isExpanded
            ? "pl-10 pr-9 opacity-100 cursor-text"
            : "pl-0 pr-0 opacity-0 sm:opacity-100 sm:pl-10 sm:pr-9 cursor-pointer sm:cursor-text"
        }`}
      />

      {!isExpanded && (
        <button
          type="button"
          onClick={() => {
            setIsFocused(true);
            setTimeout(() => searchInputRef.current?.focus(), 50);
          }}
          className="absolute inset-0 w-full h-full rounded-full hover:bg-slate-100 transition-colors sm:hidden flex items-center justify-center border border-slate-200/80 bg-white cursor-pointer"
          aria-label="Fokus Cari"
        >
          <Search className="w-4 h-4 text-slate-600" />
        </button>
      )}

      {/* Shortcut hint */}
      {!searchQuery && (
        <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-black text-slate-600 shadow-sm pointer-events-none select-none font-mono">
          /
        </kbd>
      )}

      {/* Clear button */}
      {isExpanded && searchQuery && (
        <button
          type="button"
          onClick={() => handleSearchChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 z-10 cursor-pointer"
          aria-label={language === "en" ? "Clear search" : "Hapus pencarian"}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* ── SEARCH DROPDOWN ───────────────────────────────────────── */}
      {searchOpen && isExpanded && hasSearch && (
        <div
          id="search-dropdown"
          onMouseDown={(e) => e.preventDefault()}
          className="dropdown-pop absolute left-0 w-full min-w-[280px] sm:min-w-full max-w-[calc(100vw-2rem)] mt-2 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-50"
        >
          <div className="p-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-3 py-1.5">
              {language === "en" ? "Search Results" : "Hasil Pencarian"}
            </p>

            <div className="max-h-[65vh] overflow-y-auto overflow-x-auto overscroll-contain pb-1 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              <div className="min-w-full w-max flex flex-col space-y-1">
                {isLoading ? (
                  <div className="px-2 space-y-4 animate-pulse py-2 w-full">
                    {[1, 2].map((group) => (
                      <div key={group} className="space-y-2">
                        <div className="h-4 w-28 bg-slate-100 rounded-md ml-3"></div>
                        {[1, 2].map((item) => (
                          <div key={item} className="flex items-center gap-3 px-3 py-1">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 shrink-0"></div>
                            <div className="h-4 w-48 bg-slate-100 rounded-md"></div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="px-3 py-6 text-sm text-red-500 text-center w-full">
                    Gagal memuat hasil pencarian.
                  </div>
                ) : totalResults > 0 ? (
                  <>
                    <SearchResultGroup
                      title="Transaksi"
                      icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                      items={results.transactions}
                      onItemClick={closeSearch}
                      renderItem={(t) => ({
                        href: `/transactions?search=${encodeURIComponent(t.description || searchQuery.trim())}`,
                        label: t.description,
                        meta: `${t.type === "income" ? "+ " : "- "}${formatCurrency(Math.abs(t.amount))}`,
                        metaColor: t.type === "income" ? "text-emerald-600" : "text-red-500",
                        sub: t.category || "—",
                        icon: t.type === "income"
                          ? <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
                          : <ArrowUpRight className="w-4 h-4 text-red-400" />,
                      })}
                    />
                    <SearchResultGroup
                      title="Kategori"
                      icon={<Tag className="w-3.5 h-3.5" />}
                      items={results.categories}
                      onItemClick={closeSearch}
                      renderItem={(c) => ({
                        href: `/categories?search=${encodeURIComponent(c.name)}`,
                        label: c.name,
                        meta: c.type === "income" ? "Pemasukan" : "Pengeluaran",
                        metaColor: c.type === "income" ? "text-emerald-600" : "text-red-500",
                        sub: null,
                        icon: <Tag className="w-4 h-4 text-brand-500" />,
                      })}
                    />
                    <SearchResultGroup
                      title="Rekening"
                      icon={<CreditCard className="w-3.5 h-3.5" />}
                      items={results.accounts}
                      onItemClick={closeSearch}
                      renderItem={(a) => ({
                        href: `/accounts?search=${encodeURIComponent(a.name)}`,
                        label: a.name,
                        meta: formatCurrency(a.balance),
                        metaColor: "text-slate-700",
                        sub: a.type,
                        icon: <CreditCard className="w-4 h-4 text-indigo-400" />,
                      })}
                    />
                    <SearchResultGroup
                      title="Goals"
                      icon={<Target className="w-3.5 h-3.5" />}
                      items={results.goals}
                      onItemClick={closeSearch}
                      renderItem={(g) => ({
                        href: g.is_achieved
                          ? `/goals/achieved?search=${encodeURIComponent(g.title)}`
                          : `/goals?search=${encodeURIComponent(g.title)}`,
                        label: g.title,
                        meta: g.is_achieved ? (language === "en" ? "Achieved" : "Tercapai") : formatCurrency(g.current_amount),
                        metaColor: g.is_achieved ? "text-emerald-600 font-extrabold" : "text-brand-700",
                        sub: g.is_achieved
                          ? (language === "en" ? `Collected: ${formatCurrency(g.target_amount)}` : `Terkumpul: ${formatCurrency(g.target_amount)}`)
                          : (language === "en" ? `Target: ${formatCurrency(g.target_amount)}` : `Target: ${formatCurrency(g.target_amount)}`),
                        icon: g.is_achieved ? <Trophy className="w-4 h-4 text-amber-500" /> : <Target className="w-4 h-4 text-amber-500" />,
                      })}
                    />
                  </>
                ) : (
                  <div className="px-3 py-8 text-sm text-slate-400 text-center w-full">
                    <Search className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                    <p>Tidak ada hasil untuk</p>
                    <p className="font-bold text-slate-600 mt-0.5">&ldquo;{searchQuery}&rdquo;</p>
                  </div>
                )}
              </div>
            </div>

            {totalResults > 0 && !isLoading && (
              <div className="border-t border-slate-50 px-3 py-2 mt-1 flex items-center gap-3 text-[10px] text-slate-400">
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-mono font-bold">↵</kbd> untuk buka
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-mono font-bold">Esc</kbd> untuk tutup
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
