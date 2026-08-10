import { fetchAPI } from "../lib/api";

export const getBudgets = async (month, year) => {
  let url = "/budgets?";
  if (month) url += "month=" + month + "&";
  if (year) url += "year=" + year;
  const data = await fetchAPI(url);
  return data;
};

export const createBudget = async (budgetData) => {
  const data = await fetchAPI("/budgets", {
    method: "POST",
    body: budgetData,
  });
  return data;
};

export const updateBudget = async (id, budgetData) => {
  const data = await fetchAPI("/budgets/" + id, {
    method: "PUT",
    body: budgetData,
  });
  return data;
};

export const deleteBudget = async (id) => {
  const data = await fetchAPI("/budgets/" + id, {
    method: "DELETE",
  });
  return data;
};
