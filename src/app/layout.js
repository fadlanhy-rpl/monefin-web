import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "MoneFin Wealth Pro",
  description: "Financial Overview Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} font-sans bg-[#f4f7f6] text-slate-800 min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
