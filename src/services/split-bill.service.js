import api from "../lib/axios";

export const getSplitBills = async (params = {}) => {
  const res = await api.get("/split-bills", { params });
  return res.data;
};

export const createSplitBill = async (data) => {
  const res = await api.post("/split-bills", data);
  return res.data;
};

export const calculateSplitPreview = async (data) => {
  const res = await api.post("/split-bills/calculate-preview", data);
  return res.data;
};

export const getSplitBillDetail = async (id) => {
  const res = await api.get(`/split-bills/${id}`);
  return res.data;
};

export const deleteSplitBill = async (id) => {
  const res = await api.delete(`/split-bills/${id}`);
  return res.data;
};

export const markParticipantPayment = async (billId, participantId, data) => {
  const res = await api.post(`/split-bills/${billId}/participants/${participantId}/pay`, data);
  return res.data;
};

export const recordMyExpenseToAccount = async (billId, data) => {
  const res = await api.post(`/split-bills/${billId}/record-expense`, data);
  return res.data;
};

export const getWhatsAppShareText = async (billId, participantId = null) => {
  const params = participantId ? { participant_id: participantId } : {};
  const res = await api.get(`/split-bills/${billId}/whatsapp-text`, { params });
  return res.data;
};
