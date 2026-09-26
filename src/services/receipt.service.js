import { fetchAPI } from "../lib/api";

/**
 * Scan 1 to 8 receipt images using Vision LLM.
 * Accepts a single File/Blob, an array of File/Blob (1..8), or base64 string(s).
 *
 * @param {File|Blob|string|Array<File|Blob|string>} imageInput
 * @param {string} [mimeType='image/jpeg']
 * @returns {Promise<{success: boolean, data: object}>}
 */
export async function scanReceipt(imageInput, mimeType = "image/jpeg") {
  if (typeof imageInput === "string") {
    return fetchAPI("/receipts/scan", {
      method: "POST",
      body: {
        image_base64: imageInput,
        mime_type: mimeType,
      },
    });
  }

  const list = (Array.isArray(imageInput) ? imageInput : [imageInput])
    .filter(Boolean)
    .slice(0, 8);

  if (list.length > 0 && typeof list[0] === "string") {
    return fetchAPI("/receipts/scan", {
      method: "POST",
      body: {
        images_base64: list,
        image_base64: list[0],
        mime_type: mimeType,
      },
    });
  }

  const formData = new FormData();
  list.forEach((file, idx) => {
    formData.append("images[]", file, file.name || `receipt_part_${idx + 1}.jpg`);
  });
  // Backward-compatible single field for 1-photo scans
  if (list.length === 1) {
    formData.append("image", list[0], list[0].name || "receipt.jpg");
  }

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
