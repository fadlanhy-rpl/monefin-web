"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { getNotifications, markAsRead, markAllAsRead } from "../../../services/notification.service";
import { Bell, CheckCheck, Loader2, AlertTriangle, AlertCircle } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (!append) setIsLoading(true);
      else setIsLoadingMore(true);

      const res = await getNotifications(pageNum);
      
      if (res && res.data) {
        if (append) {
          setNotifications(prev => [...prev, ...res.data]);
        } else {
          setNotifications(res.data);
        }
        
        // Typical Laravel pagination includes current_page and last_page
        if (res.meta) {
            setHasMore(res.meta.current_page < res.meta.last_page);
        } else {
            // Fallback if meta is missing
            setHasMore(res.data.length === 20); // assuming per_page is 20
        }
      }
    } catch (error) {
      if (error?.status !== 401) {
        console.error("Failed to fetch notifications:", error.message || error);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(1, false);
  }, [fetchNotifications]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, true);
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    try {
      await markAllAsRead();
      
      // Dispatch an event so Header.js knows to update its unread count
      window.dispatchEvent(new Event('notificationsRead'));
    } catch (error) {
      console.error("Failed to mark all as read", error);
      fetchNotifications(1, false); // Revert on failure
    }
  };

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    try {
      await markAsRead(id);
      
      // Dispatch an event so Header.js knows to update its unread count
      window.dispatchEvent(new Event('notificationsRead'));
    } catch (error) {
      console.error("Failed to mark as read", error);
      // Revert if error
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: false } : n));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { 
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getAlertStyles = (notif) => {
    if (notif.message && notif.message.includes("Peringatan Kritis")) {
      return {
        bg: !notif.is_read ? "bg-red-50 hover:bg-red-50/80" : "hover:bg-slate-50",
        dot: !notif.is_read ? "bg-red-500 shadow-sm shadow-red-500/50" : "bg-transparent",
        text: !notif.is_read ? "font-bold text-red-700" : "font-medium text-slate-600",
        icon: <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
      };
    } else if (notif.message && notif.message.includes("Peringatan:")) {
      return {
        bg: !notif.is_read ? "bg-amber-50 hover:bg-amber-50/80" : "hover:bg-slate-50",
        dot: !notif.is_read ? "bg-amber-500 shadow-sm shadow-amber-500/50" : "bg-transparent",
        text: !notif.is_read ? "font-bold text-amber-700" : "font-medium text-slate-600",
        icon: <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
      };
    }
    return {
      bg: !notif.is_read ? "bg-brand-50/30 hover:bg-brand-50/60" : "hover:bg-slate-50",
      dot: !notif.is_read ? "bg-brand-500 shadow-sm shadow-brand-500/50" : "bg-transparent",
      text: !notif.is_read ? "font-bold text-slate-800" : "font-medium text-slate-600",
      icon: null
    };
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 shrink-0">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Semua Notifikasi</h1>
              <p className="text-sm text-slate-500 mt-1">
                Anda memiliki {unreadCount} notifikasi yang belum dibaca.
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-50 text-brand-700 font-semibold rounded-xl hover:bg-brand-100 transition-colors text-sm"
            >
              <CheckCheck className="w-4 h-4" />
              Tandai Semua Dibaca
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
              <p className="text-sm">Memuat notifikasi...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <Bell className="w-12 h-12 text-slate-200" />
              <p className="text-sm font-medium">Belum ada notifikasi saat ini.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notif) => {
                const styles = getAlertStyles(notif);
                return (
                  <div 
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id, notif.is_read)}
                    className={`p-5 sm:px-6 flex gap-4 transition-colors cursor-pointer ${styles.bg}`}
                  >
                    <div className="mt-2 shrink-0">
                      <span className={`block w-2.5 h-2.5 rounded-full ${styles.dot}`}></span>
                    </div>
                    {styles.icon && <div>{styles.icon}</div>}
                    <div className="flex-1">
                      <p className={`text-sm sm:text-base ${styles.text}`}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
                        <span>{formatDate(notif.created_at)}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && !isLoading && notifications.length > 0 && (
            <div className="p-4 border-t border-slate-100">
              <button 
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-600 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memuat...
                  </>
                ) : (
                  "Tampilkan Lebih Banyak"
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
