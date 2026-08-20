import { fetchAPI } from "../lib/api";

const ENDPOINT = "/trash";

/**
 * Mengambil semua data trashbin
 * @returns {Promise<Object>} Object berisi accounts, transactions, categories, goals, budgets
 */
export async function getTrash() {
  const { data, message } = await fetchAPI(ENDPOINT);
  return { data, message };
}

/**
 * Memulihkan (restore) data dari trashbin
 * @param {string} type - 'account', 'transaction', 'category', 'goal', 'budget'
 * @param {number} id - ID data
 * @returns {Promise<Object>} message sukses
 */
export async function restoreTrash(type, id) {
  const result = await fetchAPI(`${ENDPOINT}/${type}/${id}/restore`, {
    method: "POST",
  });
  return result; // return plain result to let component handle success/error based on result.message or throw
}

/**
 * Menghapus permanen (force delete) data dari trashbin
 * @param {string} type - 'account', 'transaction', 'category', 'goal', 'budget'
 * @param {number} id - ID data
 * @returns {Promise<Object>} message sukses
 */
export async function forceDeleteTrash(type, id) {
  const result = await fetchAPI(`${ENDPOINT}/${type}/${id}/force`, {
    method: "DELETE",
  });
  return result;
}
