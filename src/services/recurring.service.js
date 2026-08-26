import { fetchAPI } from "../lib/api";

export const getRecurringSettings = async () => {
  const data = await fetchAPI("/income-settings");
  return data;
};

export const createRecurringSetting = async (payload) => {
  const data = await fetchAPI("/income-settings", {
    method: "POST",
    body: payload,
  });
  return data;
};

export const updateRecurringSetting = async (id, payload) => {
  const data = await fetchAPI(`/income-settings/${id}`, {
    method: "PUT",
    body: payload,
  });
  return data;
};

export const deleteRecurringSetting = async (id) => {
  const data = await fetchAPI(`/income-settings/${id}`, {
    method: "DELETE",
  });
  return data;
};
