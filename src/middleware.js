import { NextResponse } from "next/server";

// Rute yang boleh diakses tanpa login (termasuk Landing Page "/")
const publicPaths = [
  "/",
  "/download",
  "/login",
  "/register",
  "/verify-email",
  "/verify-2fa",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
  "/privacy",
  "/terms",
  "/security",
];

// Rute khusus autentikasi (yang jika sudah login akan diahlihkan ke /dashboard)
const authOnlyPaths = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

// Regex untuk mendeteksi file statis secara ketat (mencegah bypass path traversal/extension)
const STATIC_ASSET_REGEX =
  /\.(?:ico|png|jpe?g|gif|webp|avif|svg|css|js|map|txt|xml|woff2?|ttf|eot)$/i;

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Lewati aset Next.js internal, folder image publik, dan file statis berekstensi valid
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.json" ||
    STATIC_ASSET_REGEX.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Lewati endpoint API avatar publik (proxy gambar)
  if (pathname.startsWith("/api/avatar/")) {
    return NextResponse.next();
  }

  const isPublic = publicPaths.some(
    (p) => pathname === p || (p !== "/" && pathname.startsWith(p + "/"))
  );

  const isAuthOnly = authOnlyPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  const token = request.cookies.get("auth_token")?.value;

  // 3. Jika mencoba akses halaman protected (seperti /dashboard, /transactions) tanpa login → redirect ke /login
  if (!isPublic && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    const response = NextResponse.redirect(loginUrl);
    // Hardening terhadap Cache Poisoning & RSC Prefetch Leaks (CVE-2026-45109 & CVE-2026-44573)
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    response.headers.set("x-middleware-cache", "no-cache");
    return response;
  }

  // 4. Jika sudah login dan mencoba akses halaman auth (seperti /login, /register) → redirect ke /dashboard
  if (isAuthOnly && token) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
