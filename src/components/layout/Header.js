"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Bell, User, Settings, LogOut, CheckCheck, CreditCard, Tag, Target, ArrowUpRight, ArrowDownLeft, Trophy, Flame, Zap, Eye, EyeOff } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useGlobalSearch } from "../../hooks/useGlobalSearch";
import { getNotifications, markAsRead, markAllAsRead } from "../../services/notification.service";
import { getGamificationSummary } from "../../services/gamification.service";
import { useCurrency } from "../../hooks/useCurrency";
import { useBalancePrivacy } from "../../context/BalancePrivacyContext";
import { useLanguage } from "../../context/LanguageContext";

function getRelativeTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMins = Math.floor(diffInMs / 60000);
  
  if (diffInMins < 1) return "Baru saja";
  if (diffInMins < 60) return `${diffInMins} menit lalu`;
  const diffInHours = Math.floor(diffInMins / 60);
  if (diffInHours < 24) return `${diffInHours} jam lalu`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} hari lalu`;
  return date.toLocaleDateString('id-ID');
}

export default function Header({ setMobileOpen }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { formatCurrency } = useCurrency();
  const { isBalanceHidden, toggleBalancePrivacy } = useBalancePrivacy();
  const { t, language } = useLanguage();


  const userPhoto = user?.photo
    ? `/api/avatar/${user.photo}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=00685F&color=fff&size=64`;

  const userName = user?.name || "User";
  const userEmail = user?.email || "";

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const isExpanded = isFocused || searchQuery.length > 0;

  const { results, isLoading, error } = useGlobalSearch(searchQuery);

  const totalResults =
    (results?.transactions?.length || 0) +
    (results?.categories?.length || 0) +
    (results?.accounts?.length || 0) +
    (results?.goals?.length || 0);

  const hasSearch = searchQuery.trim().length > 0;

  const closeSearch = () => {
    setSearchOpen(false);
    setIsFocused(false);
    setSearchQuery("");
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
  };

  // Notification items in state for dynamic updates
  const [notifications, setNotifications] = useState([]);
  const [isNotifLoading, setIsNotifLoading] = useState(true);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const fetchNotifications = useCallback(async () => {
    try {
      setIsNotifLoading(true);
      const res = await getNotifications();
      if (res && res.data) {
        setNotifications(res.data);
      }
    } catch (error) {
      if (error.status !== 401) {
        console.error("Failed to fetch notifications:", error.message);
      }
    } finally {
      setIsNotifLoading(false);
    }
  }, []);

  // Gamification summary
  const [gamification, setGamification] = useState(null);

  const fetchGamification = useCallback(async () => {
    try {
      const data = await getGamificationSummary();
      if (data) setGamification(data);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchGamification();

    const handleNotificationsUpdate = () => fetchNotifications();
    window.addEventListener('notificationsRead', handleNotificationsUpdate);
    return () => window.removeEventListener('notificationsRead', handleNotificationsUpdate);
  }, [fetchNotifications, fetchGamification]);

  const headerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setNotifOpen(false);
        setProfileOpen(false);
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcuts (Escape to close, "/" to focus search)
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setProfileOpen(false);
        setSearchOpen(false);
        setIsFocused(false);
      }
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all as read", error);
      fetchNotifications();
    }
  };

  const toggleNotifRead = async (id, isRead) => {
    if (isRead) return;
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    try {
      await markAsRead(id);
    } catch (error) {
      console.error("Failed to mark as read", error);
      fetchNotifications();
    }
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-[35] bg-[#f4f7f6]/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 pt-5 pb-3 flex items-center justify-between gap-3">
      {/* LEFT GROUP: menu + search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button 
          onClick={() => setMobileOpen(true)} 
          className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all shrink-0 cursor-pointer" 
          aria-label="Buka menu"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>

        {/* Responsive Expandable Search Bar */}
        <div className={`relative transition-all duration-300 ease-in-out h-10 ${
          isExpanded 
            ? "w-[150px] min-[380px]:w-[190px] min-[480px]:w-[250px] sm:w-[320px] md:w-[380px] lg:w-[420px]" 
            : "w-10 sm:w-[320px] md:w-[380px] lg:w-[420px]"
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
              setNotifOpen(false); 
              setProfileOpen(false); 
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
              className="absolute inset-0 w-full h-full rounded-full hover:bg-slate-100 transition-colors sm:hidden flex items-center justify-center border border-slate-200/80 bg-white"
              aria-label="Fokus Cari"
            >
              <Search className="w-4 h-4 text-slate-600" />
            </button>
          )}

          {/* Shortcut hints */}
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
              className="dropdown-pop absolute left-0 right-0 w-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              <div className="p-2">

                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-600 px-3 py-1.5">
                  {language === "en" ? "Search Results" : "Hasil Pencarian"}
                </p>


                <div className="max-h-[65vh] overflow-y-auto overflow-x-auto space-y-0.5 overscroll-contain [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {isLoading ? (

                    /* Loading Skeleton */
                    <div className="px-2 space-y-4 animate-pulse py-2">
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
                    <div className="px-3 py-6 text-sm text-red-500 text-center">
                      Gagal memuat hasil pencarian.
                    </div>
                  ) : totalResults > 0 ? (
                    <>
                      {/* Transactions */}
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
                      {/* Categories */}
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
                      {/* Accounts */}
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
                      {/* Goals */}
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
                    <div className="px-3 py-8 text-sm text-slate-400 text-center">
                      <Search className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                      <p>Tidak ada hasil untuk</p>
                      <p className="font-bold text-slate-600 mt-0.5">&ldquo;{searchQuery}&rdquo;</p>
                    </div>
                  )}
                </div>

                {/* Footer hint */}
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
      </div>

      {/* RIGHT GROUP: notification + profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        
        {/* Gamification Pill */}
        {gamification && (
          <Link
            href="/rewards"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200/80 rounded-xl transition-all shadow-sm group cursor-pointer"
            title="Lihat Pencapaian & Hadiah"
          >
            <div className="flex items-center gap-1 text-xs font-black text-orange-500">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 group-hover:scale-110 transition-transform" />
              <span>{gamification.current_streak || 0}</span>
            </div>
            <span className="text-slate-300 text-xs">|</span>
            <div className="flex items-center gap-1 text-xs font-black text-[#00685F]">
              <Zap className="w-3.5 h-3.5 fill-[#00685F] group-hover:scale-110 transition-transform" />
              <span>Lv. {gamification.level || 1}</span>
            </div>
          </Link>
        )}

        {/* Balance Privacy Toggle */}
        <button
          type="button"
          onClick={toggleBalancePrivacy}
          className="p-2.5 text-slate-600 hover:text-[#00685F] hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-100 shadow-sm shadow-slate-100/50 cursor-pointer"
          aria-label={isBalanceHidden ? "Tampilkan Saldo" : "Sembunyikan Saldo"}
          title={isBalanceHidden ? "Tampilkan Saldo" : "Sembunyikan Saldo"}
        >
          {isBalanceHidden ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notification */}
        <div className="relative">
          <button 
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); setSearchOpen(false); }}
            className="bell-wiggle relative p-2.5 text-slate-600 hover:text-brand-600 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-100 shadow-sm shadow-slate-100/50" 
            aria-label="Notifikasi" 
            aria-expanded={notifOpen}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="pulse-dot absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            )}
          </button>

          {notifOpen && (
            <div className="dropdown-pop absolute right-0 mt-2 w-80 max-w-[85vw] bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-40">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
                <p className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  Notifikasi 
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-brand-600 text-white font-bold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </p>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead} 
                    className="text-[11px] font-bold text-brand-700 hover:text-brand-800 transition-colors flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Tandai semua dibaca
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {isNotifLoading ? (
                  <div className="px-4 py-6 text-center text-xs text-slate-400 animate-pulse">Memuat notifikasi...</div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-slate-400">Belum ada notifikasi</div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => toggleNotifRead(n.id, n.is_read)}
                      className="flex gap-3 px-4 py-3.5 hover:bg-brand-50/40 transition-colors cursor-pointer"
                    >
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${!n.is_read ? "bg-brand-600" : "bg-transparent"}`}></span>
                      <div className="flex-1">
                        <p className={`text-xs sm:text-sm text-slate-700 ${!n.is_read ? "font-bold text-slate-900" : "font-medium text-slate-500"}`}>{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{getRelativeTime(n.created_at)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link href="/notifications" onClick={() => setNotifOpen(false)} className="block w-full text-center text-xs font-bold text-brand-700 px-4 py-3 bg-slate-50/50 hover:bg-brand-50 border-t border-slate-100 transition-colors">Lihat Semua Notifikasi</Link>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative pl-2 border-l border-slate-200/80">
          <button 
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); setSearchOpen(false); }}
            className="hidden md:flex items-center gap-2 hover:bg-white rounded-lg pr-2 py-1 transition-colors border border-transparent hover:border-slate-100/50" 
            aria-expanded={profileOpen}
          >
            <Image 
              src={userPhoto} 
              alt={`Foto profil ${userName}`} 
              width={32} 
              height={32} 
              className="w-8 h-8 rounded-full object-cover" 
            />
            <span className="text-xs font-bold text-slate-700">{userName}</span>
            <svg className={`w-3 h-3 text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); setSearchOpen(false); }} className="md:hidden flex items-center pl-1" aria-label="Profil">
            <Image 
              src={userPhoto} 
              alt={`Foto profil ${userName}`} 
              width={32} 
              height={32} 
              className="w-8 h-8 rounded-full object-cover" 
            />
          </button>




          {profileOpen && (
            <div className="dropdown-pop absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-40">
              <div className="px-4 py-3.5 bg-slate-50/50 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-800">{userName}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{userEmail}</p>
              </div>
              <button 
                onClick={() => { router.push("/settings"); setProfileOpen(false); }}
                className="profile-action w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-slate-600 hover:bg-brand-50 hover:text-brand-700 transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                My Profile
              </button>
              <button
                onClick={() => { setProfileOpen(false); logout(); }}
                className="profile-action w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors border-t border-slate-50"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function SearchResultGroup({ title, icon, items, renderItem, onItemClick }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-1.5 last:mb-0 min-w-max sm:min-w-full">
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-extrabold text-slate-600 uppercase tracking-widest bg-slate-50/80 rounded-lg mx-1">
        {icon}
        <span>{title}</span>
      </div>

      <div className="mt-1 space-y-0.5">
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
              className="group flex items-center justify-between gap-4 px-3 py-2.5 rounded-xl hover:bg-brand-50/80 active:bg-brand-100/70 transition-all mx-1 cursor-pointer min-w-max sm:min-w-full"
            >
              {/* Left group: Icon & Text */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-white flex items-center justify-center transition-all shadow-xs border border-slate-100 shrink-0">
                  {itemIcon}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 whitespace-nowrap group-hover:text-brand-700 transition-colors">
                    {label}
                  </p>
                  {sub && (
                    <p className="text-[10px] text-slate-500 whitespace-nowrap mt-0.5">{sub}</p>
                  )}
                </div>
              </div>

              {/* Right group: Meta & Arrow */}
              <div className="flex items-center gap-2 shrink-0">
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


