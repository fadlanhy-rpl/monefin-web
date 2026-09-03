import { fetchAPI } from "../lib/api";

export const getSplitBills = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.status && params.status !== "all") query.append("status", params.status);
  if (params.search) query.append("search", params.search);
  const qs = query.toString() ? `?${query.toString()}` : "";
  return await fetchAPI(`/split-bills${qs}`);
};

export const createSplitBill = async (data) => {
  return await fetchAPI("/split-bills", {
    method: "POST",
    body: data,
  });
};

export const calculateSplitPreview = async (data) => {
  return await fetchAPI("/split-bills/calculate-preview", {
    method: "POST",
    body: data,
  });
};

export const getSplitBillDetail = async (id) => {
  return await fetchAPI(`/split-bills/${id}`);
};

export const deleteSplitBill = async (id) => {
  return await fetchAPI(`/split-bills/${id}`, {
    method: "DELETE",
  });
};

export const markParticipantPayment = async (billId, participantId, data) => {
  return await fetchAPI(`/split-bills/${billId}/participants/${participantId}/pay`, {
    method: "POST",
    body: data,
  });
};

export const recordMyExpenseToAccount = async (billId, data) => {
  return await fetchAPI(`/split-bills/${billId}/record-expense`, {
    method: "POST",
    body: data,
  });
};

export const getWhatsAppShareText = async (billId, participantId = null) => {
  const qs = participantId ? `?participant_id=${participantId}` : "";
  return await fetchAPI(`/split-bills/${billId}/whatsapp-text${qs}`);
};
