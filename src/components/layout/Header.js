"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Plus, User, Settings, LogOut, CheckCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Header({ setMobileOpen }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Avatar fallback: inisial nama user atau placeholder
  const userPhoto = user?.photo
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${user.photo}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=00685F&color=fff&size=64`;
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const isExpanded = isFocused || searchQuery.length > 0;

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("header-search", { detail: val }));
    }
  };

  // Notification items in state for dynamic updates
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Pengeluaran makanan naik 15%", time: "2 jam lalu", unread: true },
    { id: 2, text: "Gaji bulan Oktober telah masuk", time: "1 hari lalu", unread: true },
    { id: 3, text: "Target tabungan bulan ini tercapai", time: "3 hari lalu", unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

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

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const toggleNotifRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-35 bg-[#f4f7f6]/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 pt-5 pb-3 flex items-center justify-between gap-3">
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
            ? 'w-[150px] min-[380px]:w-[190px] min-[480px]:w-[250px] sm:w-[320px] md:w-[380px] lg:w-[420px]' 
            : 'w-10 sm:w-[320px] md:w-[380px] lg:w-[420px]'
        }`}>
          <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10 ${
            isExpanded ? 'left-3.5 text-slate-400' : 'left-3.5 text-slate-600 hidden sm:block'
          }`} />
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search analytics, transactions..." 
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => { handleSearchChange(e.target.value); setSearchOpen(true); }}
            onFocus={() => { setIsFocused(true); setSearchOpen(true); setNotifOpen(false); setProfileOpen(false); }}
            onBlur={() => {
              setTimeout(() => {
                setIsFocused(false);
                setSearchOpen(false);
              }, 200);
            }}
            className={`w-full h-full bg-white border border-slate-200/80 rounded-full py-2 text-sm placeholder:text-slate-400 text-slate-700 focus:border-brand-600 focus:outline-none transition-all shadow-sm shadow-slate-100/50 ${
              isExpanded 
                ? 'pl-10 pr-8 opacity-100 cursor-text' 
                : 'pl-0 pr-0 opacity-0 sm:opacity-100 sm:pl-10 sm:pr-8 cursor-pointer sm:cursor-text'
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

          {/* Shortcut key "/" */}
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none font-mono hidden sm:inline">/</span>

          {/* Clear button inside input */}
          {isExpanded && searchQuery && (
            <button 
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 z-10"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          )}

          {/* Suggestions Dropdown */}
          {searchOpen && isExpanded && (
            <div className="dropdown-pop absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden z-40 max-h-48 overflow-y-auto w-full">
              {['Food & Beverage', 'Gaji Bulanan', 'Transportasi', 'Food & Drink', 'Salary', 'Transport', 'Shopping', 'Investment'].map((suggestion, idx) => (
                <button 
                  key={suggestion}
                  type="button"
                  onClick={() => { handleSearchChange(suggestion); setSearchOpen(false); }}
                  className={`suggestion-item w-full flex items-center gap-3 px-3 py-2 text-left text-xs text-slate-600 hover:bg-brand-50 hover:text-brand-700 transition-colors ${idx !== 0 ? 'border-t border-slate-50' : ''}`}
                >
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT GROUP: notification + profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        
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
                {notifications.map((n) => (
                  <div 
                    key={n.id}
                    onClick={() => toggleNotifRead(n.id)}
                    className="flex gap-3 px-4 py-3.5 hover:bg-brand-50/40 transition-colors cursor-pointer"
                  >
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${n.unread ? 'bg-brand-600' : 'bg-transparent'}`}></span>
                    <div className="flex-1">
                      <p className={`text-xs sm:text-sm text-slate-700 ${n.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-500'}`}>{n.text}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full text-center text-xs font-bold text-brand-700 px-4 py-3 bg-slate-50/50 hover:bg-brand-50 border-t border-slate-100 transition-colors">Lihat Semua Notifikasi</button>
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
            <img src={userPhoto} alt={`Foto profil ${userName}`} className="w-8 h-8 rounded-full object-cover" />
            <span className="text-xs font-bold text-slate-700">{userName}</span>
            <svg className={`w-3 h-3 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); setSearchOpen(false); }} className="md:hidden flex items-center pl-1" aria-label="Profil">
            <img src={userPhoto} alt={`Foto profil ${userName}`} className="w-8 h-8 rounded-full object-cover" />
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
                Profil Saya
              </button>
              <button 
                onClick={() => { router.push("/settings"); setProfileOpen(false); }}
                className="profile-action w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-slate-600 hover:bg-brand-50 hover:text-brand-700 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Pengaturan Akun
              </button>
              <button
                onClick={() => { setProfileOpen(false); logout(); }}
                className="profile-action w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors border-t border-slate-50"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
