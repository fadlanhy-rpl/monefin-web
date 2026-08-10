import { fetchAPI } from "../lib/api";

export const getAccounts = async () => {
  const data = await fetchAPI("/accounts");
  return data;
};

export const createAccount = async (accountData) => {
  const data = await fetchAPI("/accounts", {
    method: "POST",
    body: accountData,
  });
  return data;
};

export const updateAccount = async (id, accountData) => {
  const data = await fetchAPI("/accounts/" + id, {
    method: "PUT",
    body: accountData,
  });
  return data;
};

export const deleteAccount = async (id) => {
  const data = await fetchAPI("/accounts/" + id, {
    method: "DELETE",
  });
  return data;
};
