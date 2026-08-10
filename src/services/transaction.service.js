import { fetchAPI } from "../lib/api";

export const getTransactions = async (params = {}) => {
  const searchParams = new URLSearchParams();
  
  if (params.start_date) searchParams.append("start_date", params.start_date);
  if (params.end_date) searchParams.append("end_date", params.end_date);
  if (params.category_id && params.category_id !== "All") searchParams.append("category_id", params.category_id);
  if (params.account_id && params.account_id !== "All") searchParams.append("account_id", params.account_id);
  if (params.search) searchParams.append("search", params.search);
  if (params.page) searchParams.append("page", params.page);
  
  // Optionally support fetching a larger page size
  searchParams.append("per_page", 100); 

  const url = "/transactions?" + searchParams.toString();
  const data = await fetchAPI(url);
  return data; // contains success, data (array), meta (pagination)
};

export const createTransaction = async (transactionData) => {
  const data = await fetchAPI("/transactions", {
    method: "POST",
    body: transactionData,
  });
  return data;
};

export const updateTransaction = async (id, transactionData) => {
  const data = await fetchAPI("/transactions/" + id, {
    method: "PUT",
    body: transactionData,
  });
  return data;
};

export const deleteTransaction = async (id) => {
  const data = await fetchAPI("/transactions/" + id, {
    method: "DELETE",
  });
  return data;
};
