import { NextResponse } from "next/server";

// Rute yang boleh diakses tanpa login
const publicPaths = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Biarkan semua asset dan Next.js internal melewati
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isPublic = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "?")
  );

  const token = request.cookies.get("auth_token")?.value;

  // Jika halaman protected dan tidak ada token → redirect ke login
  if (!isPublic && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Jika sudah login dan mencoba akses halaman auth → redirect ke dashboard
  if (isPublic && token && pathname !== "/auth/callback") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
