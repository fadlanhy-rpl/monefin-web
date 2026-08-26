import { NextResponse } from "next/server";

// Rute yang boleh diakses tanpa login (termasuk Landing Page "/")
const publicPaths = [
  "/",
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

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Biarkan semua asset dan Next.js internal melewati
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isPublic = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "?")
  );

  const isAuthOnly = authOnlyPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "?")
  );

  const token = request.cookies.get("auth_token")?.value;

  // 1. Jika mencoba akses halaman protected (seperti /dashboard, /transactions) tanpa login → redirect ke /login
  if (!isPublic && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Jika sudah login dan mencoba akses halaman auth (seperti /login, /register) → redirect ke /dashboard
  if (isAuthOnly && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
