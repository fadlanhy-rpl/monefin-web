import { fetchAPI } from "../lib/api";

let cachedNotifs = null;
let cachedNotifsTime = 0;
let pendingNotifsPromise = null;

export function invalidateNotificationsCache() {
    cachedNotifs = null;
    cachedNotifsTime = 0;
}

export const getNotifications = async (page = 1, force = false) => {
    if (page === 1) {
        const now = Date.now();
        if (!force && cachedNotifs && now - cachedNotifsTime < 15000) {
            return cachedNotifs;
        }
        if (pendingNotifsPromise) {
            return pendingNotifsPromise;
        }
        pendingNotifsPromise = fetchAPI(`/notifications?page=${page}`)
            .then((res) => {
                cachedNotifs = res;
                cachedNotifsTime = Date.now();
                pendingNotifsPromise = null;
                return res;
            })
            .catch((err) => {
                pendingNotifsPromise = null;
                throw err;
            });
        return pendingNotifsPromise;
    }
    return await fetchAPI(`/notifications?page=${page}`);
};

export const markAsRead = async (id) => {
    invalidateNotificationsCache();
    return await fetchAPI(`/notifications/${id}/read`, {
        method: "PATCH",
    });
};

export const markAllAsRead = async () => {
    invalidateNotificationsCache();
    return await fetchAPI('/notifications/read-all', {
        method: "PATCH",
    });
};
