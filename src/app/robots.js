export default function robots() {
  const baseUrl = "https://www.monefin.web.id";

  const disallowedPaths = [
    "/dashboard",
    "/transactions",
    "/accounts",
    "/budgets",
    "/categories",
    "/goals",
    "/recurring",
    "/reports",
    "/rewards",
    "/split-bill",
    "/trashbin",
    "/notifications",
    "/settings",
    "/secure-account",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/verify-2fa",
    "/auth/",
    "/api/",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/download", "/login", "/register", "/privacy", "/terms", "/security"],
        disallow: disallowedPaths,
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/download", "/login", "/register", "/privacy", "/terms", "/security"],
        disallow: disallowedPaths,
      },
    ],
    host: baseUrl,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
