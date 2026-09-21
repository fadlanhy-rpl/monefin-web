"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useGlobalSearch } from "../../hooks/useGlobalSearch";
import { getNotifications, markAsRead, markAllAsRead } from "../../services/notification.service";
import { getGamificationSummary } from "../../services/gamification.service";
import { useBalancePrivacy } from "../../context/BalancePrivacyContext";

import HeaderGlobalSearch from "./header/HeaderGlobalSearch";
import HeaderNotificationsDropdown from "./header/HeaderNotificationsDropdown";
import HeaderProfileDropdown from "./header/HeaderProfileDropdown";
import HeaderGamificationPill from "./header/HeaderGamificationPill";

export default function Header({ setMobileOpen }) {
  const { user, logout } = useAuth();
  const { isBalanceHidden, toggleBalancePrivacy } = useBalancePrivacy();

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

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchNotifications = useCallback(async () => {
    try {
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

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const [notifRes, gamifRes] = await Promise.all([
          getNotifications(),
          getGamificationSummary().catch(() => null)
        ]);
        if (!ignore) {
          if (notifRes?.data) setNotifications(notifRes.data);
          if (gamifRes) setGamification(gamifRes);
        }
      } catch (err) {
        if (err?.status !== 401) {
          console.error("Failed to fetch header initial data:", err);
        }
      } finally {
        if (!ignore) {
          setIsNotifLoading(false);
        }
      }
    }

    init();

    const handleNotificationsUpdate = () => fetchNotifications();
    window.addEventListener("notificationsRead", handleNotificationsUpdate);
    return () => {
      ignore = true;
      window.removeEventListener("notificationsRead", handleNotificationsUpdate);
    };
  }, [fetchNotifications]);

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

  // Keyboard shortcuts (Escape to close, Shift + "/" to focus search)
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setProfileOpen(false);
        setSearchOpen(false);
        setIsFocused(false);
      }

      const isShiftSlash = e.shiftKey && (e.key === "/" || e.key === "?" || e.code === "Slash");
      const isInputActive =
        document.activeElement &&
        (document.activeElement.tagName === "INPUT" ||
          document.activeElement.tagName === "TEXTAREA" ||
          document.activeElement.tagName === "SELECT" ||
          document.activeElement.isContentEditable);

      if (isShiftSlash && !isInputActive) {
        e.preventDefault();
        setIsFocused(true);
        searchInputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all as read", error);
      fetchNotifications();
    }
  };

  const toggleNotifRead = async (id, isRead) => {
    if (isRead) return;
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
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
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-1.5 sm:p-2 -ml-1 sm:-ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all shrink-0 cursor-pointer"
          aria-label="Buka menu"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Responsive Expandable Search Bar */}
        <HeaderGlobalSearch
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          isExpanded={isExpanded}
          closeSearch={closeSearch}
          results={results}
          isLoading={isLoading}
          error={error}
          totalResults={totalResults}
          hasSearch={hasSearch}
          searchInputRef={searchInputRef}
          onFocusInput={() => {
            setNotifOpen(false);
            setProfileOpen(false);
          }}
        />
      </div>

      {/* RIGHT GROUP: notification + profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Gamification Pill */}
        <HeaderGamificationPill gamification={gamification} />

        {/* Balance Privacy Toggle */}
        <button
          type="button"
          onClick={toggleBalancePrivacy}
          className="p-2 sm:p-2.5 text-slate-600 hover:text-[#00685F] hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-100 shadow-sm shadow-slate-100/50 cursor-pointer shrink-0"
          aria-label={isBalanceHidden ? "Tampilkan Saldo" : "Sembunyikan Saldo"}
          title={isBalanceHidden ? "Tampilkan Saldo" : "Sembunyikan Saldo"}
        >
          {isBalanceHidden ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notification */}
        <HeaderNotificationsDropdown
          notifications={notifications}
          isNotifLoading={isNotifLoading}
          unreadCount={unreadCount}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
          onCloseOthers={() => {
            setProfileOpen(false);
            setSearchOpen(false);
          }}
          onMarkAllRead={markAllRead}
          onToggleRead={toggleNotifRead}
        />

        {/* Profile */}
        <HeaderProfileDropdown
          user={user}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          onCloseOthers={() => {
            setNotifOpen(false);
            setSearchOpen(false);
          }}
          logout={logout}
        />
      </div>
    </header>
  );
}
