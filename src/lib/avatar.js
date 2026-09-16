/**
 * Resolves avatar URL reliably across development and production environments.
 * Points directly to SkipperHost static storage (400ms) without Vercel serverless proxy lag.
 *
 * @param {string|null} photo
 * @param {string} name
 * @returns {string}
 */
export function getAvatarUrl(photo, name = "User") {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=00685F&color=fff&size=256`;

  if (!photo || typeof photo !== "string" || !photo.trim()) {
    return fallback;
  }

  // Already a full HTTP/HTTPS URL (e.g. Google OAuth photo or CDN)
  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo;
  }

  // Clean relative path (e.g. "profiles/xyz.jpg")
  const cleanPath = photo.replace(/^\/+/, "");

  // In production or development, point directly to public storage
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://sk0010uoic.skipper.my.id/index.php/api";
  const domain = apiBase.replace(/(\/index\.php)?\/api\/?$/, "").replace(/\/+$/, "");

  return `${domain}/storage/${cleanPath}`;
}
