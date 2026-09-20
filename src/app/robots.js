export default function robots() {
  const baseUrl = "https://www.monefin.web.id";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/transactions",
          "/wallets",
          "/budgets",
          "/debts",
          "/savings",
          "/ai-advisor",
          "/settings",
          "/api/",
          "/(dashboard)/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/dashboard",
          "/transactions",
          "/wallets",
          "/budgets",
          "/debts",
          "/savings",
          "/ai-advisor",
          "/settings",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
