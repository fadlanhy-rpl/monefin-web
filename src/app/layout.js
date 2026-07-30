import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "MoneFin",
  description: "Personal Finance & Wealth Management Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} font-sans bg-[#f4f7f6] text-slate-800 min-h-screen antialiased`}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "500",
              },
              success: {
                style: {
                  background: "#f0faf9",
                  color: "#00685F",
                  border: "1px solid #00685F20",
                },
                iconTheme: { primary: "#00685F", secondary: "#fff" },
              },
              error: {
                style: {
                  background: "#fff5f5",
                  color: "#dc2626",
                  border: "1px solid #dc262620",
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
