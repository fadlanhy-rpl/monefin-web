import { fetchAPI } from "../lib/api";

export const getGoals = async () => {
  const data = await fetchAPI("/goals");
  return data;
};

export const createGoal = async (goalData) => {
  return await fetchAPI("/goals", {
    method: "POST",
    body: goalData,
  });
};

export const updateGoal = async (id, goalData) => {
  return await fetchAPI(`/goals/${id}`, {
    method: "PUT",
    body: goalData,
  });
};

export const deleteGoal = async (id) => {
  return await fetchAPI(`/goals/${id}`, {
    method: "DELETE",
  });
};

export const depositGoal = async (id, payload) => {
  return await fetchAPI(`/goals/${id}/deposit`, {
    method: "POST",
    body: payload,
  });
};

export const withdrawGoal = async (id, payload) => {
  return await fetchAPI(`/goals/${id}/withdraw`, {
    method: "POST",
    body: payload,
  });
};
