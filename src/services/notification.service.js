import { fetchAPI } from "../lib/api";

export const getNotifications = async (page = 1) => {
    return await fetchAPI(`/notifications?page=${page}`);
};

export const markAsRead = async (id) => {
    return await fetchAPI(`/notifications/${id}/read`, {
        method: "PATCH",
    });
};

export const markAllAsRead = async () => {
    return await fetchAPI('/notifications/read-all', {
        method: "PATCH",
    });
};
