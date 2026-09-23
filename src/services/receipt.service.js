import { fetchAPI } from "../lib/api";

/**
 * Scan receipt image using Vision LLM.
 * Accepts either a File/Blob (sent via FormData) or a base64 string.
 *
 * @param {File|Blob|string} imageFileOrBlob
 * @param {string} [mimeType='image/jpeg']
 * @returns {Promise<{success: boolean, data: object}>}
 */
export async function scanReceipt(imageFileOrBlob, mimeType = "image/jpeg") {
  if (typeof imageFileOrBlob === "string") {
    return fetchAPI("/receipts/scan", {
      method: "POST",
      body: {
        image_base64: imageFileOrBlob,
        mime_type: mimeType,
      },
    });
  }

  const formData = new FormData();
  formData.append("image", imageFileOrBlob, "receipt.jpg");

  return fetchAPI("/receipts/scan", {
    method: "POST",
    body: formData,
  });
}

/**
 * Confirm and save receipt transaction.
 * Supports both JSON payload and multipart/form-data (when saving receipt image).
 *
 * @param {object} payload
 * @param {File|Blob|null} [receiptImageFile=null]
 * @returns {Promise<{success: boolean, data: object, message: string}>}
 */
export async function confirmReceiptTransaction(payload, receiptImageFile = null) {
  if (receiptImageFile && payload.save_receipt_image) {
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      if (key === "items") {
        formData.append("items", JSON.stringify(payload.items));
      } else if (typeof payload[key] === "boolean") {
        formData.append(key, payload[key] ? "1" : "0");
      } else if (payload[key] !== null && payload[key] !== undefined) {
        formData.append(key, payload[key]);
      }
    });
    formData.append("receipt_image", receiptImageFile, "receipt_attachment.jpg");

    return fetchAPI("/receipts/confirm", {
      method: "POST",
      body: formData,
    });
  }

  return fetchAPI("/receipts/confirm", {
    method: "POST",
    body: payload,
  });
}
