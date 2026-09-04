"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export default function PrivacyPage() {
  const router = useRouter();
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = language === "en" ? "Privacy Policy | MoneFin" : "Kebijakan Privasi | MoneFin";
  }, [language]);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/login");
    }
  };

  const formattedDate = new Date().toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f4f7f6] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Top bar with Back and LanguageSwitcher */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={handleBack} 
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#00685F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("common.back")}
          </button>
          <LanguageSwitcher />
        </div>
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-12">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#00685F] shrink-0 border border-emerald-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{t("privacy_page.title")}</h1>
              <p className="text-slate-500 mt-1 font-medium">{t("privacy_page.updated")}: {formattedDate}</p>
            </div>
          </div>
          
          <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
            <p>
              {t("privacy_page.intro")}
            </p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">{t("privacy_page.s1_title")}</h2>
            <p>
              {t("privacy_page.s1_desc")}
            </p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">{t("privacy_page.s2_title")}</h2>
            <p>
              {t("privacy_page.s2_desc")}
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">{t("privacy_page.s3_title")}</h2>
            <p>
              {t("privacy_page.s3_desc")}
            </p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">{t("privacy_page.s4_title")}</h2>
            <p>
              {t("privacy_page.s4_desc")} <strong className="text-slate-800">support@monefin.com</strong>.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-8 text-sm text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} MoneFin Financial Services.
        </div>
      </div>
    </div>
  );
}
