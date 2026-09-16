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

  if (
    photo.startsWith("http://") ||
    photo.startsWith("https://") ||
    photo.startsWith("data:") ||
    photo.startsWith("blob:")
  ) {
    return photo;
  }

  // Clean relative path
  const cleanPath = photo.replace(/^\/+/, "");

  // Point directly to backend domain
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://sk0010uoic.skipper.my.id/index.php/api";

  let domain = "https://sk0010uoic.skipper.my.id";
  try {
    const parsed = new URL(apiBase);
    domain = `${parsed.protocol}//${parsed.host}`;
  } catch {
    domain = apiBase
      .replace(/(\/index\.php)?\/api\/?$/, "")
      .replace(/\/+$/, "");
  }

  // New format: uploads/profiles/... → served via img.php proxy
  // Legacy format: profiles/... → served via img.php proxy (reads from storage/app/public)
  // img.php bekerja di nginx tanpa symlink
  const profilePath = cleanPath.startsWith("uploads/")
    ? cleanPath.replace("uploads/", "") // → profiles/filename.jpg
    : cleanPath;                         // → profiles/filename.jpg (legacy)

  return `${domain}/img.php?f=${encodeURIComponent(profilePath)}`;
}
