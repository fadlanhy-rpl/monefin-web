"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  FileText,
  Lock,
  Calendar,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  ChevronRight,
  ExternalLink,
  Mail,
  AlertTriangle,
  Info,
  Shield,
  Menu,
  X,
  Search,
  Clock,
  Scale,
  Receipt,
  KeyRound,
  Cpu,
  UserCheck,
  Server,
  ThumbsUp,
  ThumbsDown,
  Building2,
  Database,
  UserX,
  Award,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function LegalPageLayout({
  docKey,
  data,
  category = "Syarat & Ketentuan",
  categoryEn = "Terms of Service",
  badge = "Kepatuhan Hukum",
  badgeEn = "Legal Compliance",
  icon: IconComponent = FileText,
  relatedDocs = [],
}) {
  const { language, changeLanguage } = useLanguage();
  const isId = language === "id";
  const pathname = usePathname();

  // Resolve current localized document data
  const doc = useMemo(() => {
    const langData = isId ? data.id : data.en;
    return langData?.[docKey] || langData?.terms || { sections: [] };
  }, [isId, data, docKey]);

  const common = useMemo(() => {
    const langData = isId ? data.id : data.en;
    return langData?.common || {};
  }, [isId, data]);

  const [activeSection, setActiveSection] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [copiedSectionId, setCopiedSectionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackGiven, setFeedbackGiven] = useState(null); // 'yes' | 'no' | null

  // Resolve current active section smoothly without cascading effect renders
  const currentActiveSection = useMemo(() => {
    if (!doc.sections || doc.sections.length === 0) return "";
    const exists = doc.sections.some((s) => s.id === activeSection);
    return exists ? activeSection : doc.sections[0]?.id || "";
  }, [doc.sections, activeSection]);

  // Dynamic document title
  useEffect(() => {
    if (doc.title) {
      document.title = `${doc.title} | MoneFin Trust Center`;
    }
  }, [doc.title]);

  // Scroll spy to highlight active section in TOC
  useEffect(() => {
    const handleScroll = () => {
      if (!doc.sections) return;
      const sectionElements = doc.sections.map((s) =>
        document.getElementById(s.id)
      );

      const scrollPosition = window.scrollY + 200;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(doc.sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [doc.sections]);

  const scrollToSection = (id) => {
    setMobileTocOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
      window.history.replaceState(null, null, `#${id}`);
    }
  };

  const handleCopyPageLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopySectionLink = (id) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      navigator.clipboard.writeText(url);
      setCopiedSectionId(id);
      setTimeout(() => setCopiedSectionId(null), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Filter sections if search query is entered
  const filteredSections = useMemo(() => {
    if (!doc.sections) return [];
    if (!searchQuery.trim()) return doc.sections;
    const q = searchQuery.toLowerCase();
    return doc.sections.filter((s) => {
      const matchTitle = s.title?.toLowerCase().includes(q);
      const matchParagraphs = s.paragraphs?.some((p) => p.toLowerCase().includes(q));
      const matchCallout = s.callout?.text?.toLowerCase().includes(q);
      const matchBullets = s.bullets?.some((b) => b.toLowerCase().includes(q));
      return matchTitle || matchParagraphs || matchCallout || matchBullets;
    });
  }, [doc.sections, searchQuery]);

  // Tab navigation list
  const navLinks = [
    {
      href: "/terms",
      label: "Syarat & Ketentuan",
      labelEn: "Terms of Service",
      icon: FileText,
      active: pathname === "/terms",
    },
    {
      href: "/privacy",
      label: "Kebijakan Privasi",
      labelEn: "Privacy Policy",
      icon: Lock,
      active: pathname === "/privacy",
    },
    {
      href: "/security",
      label: "Standar Keamanan",
      labelEn: "Security Standards",
      icon: ShieldCheck,
      active: pathname === "/security",
    },
  ];

  // Specific contact email per docKey
  const contactEmail =
    docKey === "privacy"
      ? "privacy@monefin.com"
      : docKey === "security"
      ? "security@monefin.com"
      : "legal@monefin.com";

  // Dedicated takeaway icons based on docKey and index
  const getTakeawayIcon = (index) => {
    if (docKey === "terms") {
      if (index === 0) return Scale;
      if (index === 1) return Receipt;
      return KeyRound;
    }
    if (docKey === "privacy") {
      if (index === 0) return ShieldCheck;
      if (index === 1) return Cpu;
      return UserCheck;
    }
    if (docKey === "security") {
      if (index === 0) return Server;
      if (index === 1) return ShieldCheck;
      return KeyRound;
    }
    return Shield;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-brand-600/20 selection:text-brand-600">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-all print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center p-1 shadow-md shadow-brand-600/20 group-hover:scale-105 transition-transform duration-200">
                <Image src="/images/LogoMonefinWhite.svg" alt="MoneFin Logo" width={16} height={16} className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                    MoneFin
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 dark:bg-teal-950/60 dark:text-teal-300 border border-brand-200/60 dark:border-teal-800/40">
                    Trust Center
                  </span>
                </div>
              </div>
            </Link>

          {/* Center Tabs Switcher (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-800">
            {navLinks.map((item) => {
              const ItemIcon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    item.active
                      ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-teal-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50"
                  }`}
                >
                  <ItemIcon className="w-3.5 h-3.5" />
                  {isId ? item.label : item.labelEn}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Language & Tools */}
          <div className="flex items-center gap-2">
            {/* Language Switcher Pill */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => changeLanguage("id")}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isId
                    ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-teal-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                }`}
                title="Ganti ke Bahasa Indonesia"
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => changeLanguage("en")}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  !isId
                    ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-teal-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              title={isId ? "Cetak dokumen / Unduh PDF" : "Print document / Download PDF"}
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Mobile TOC Button */}
            <button
              type="button"
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl cursor-pointer"
              title={isId ? "Daftar Isi" : "Table of Contents"}
            >
              {mobileTocOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Sub-Navigation */}
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-50 dark:bg-slate-900">
          {navLinks.map((item) => {
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  item.active
                    ? "bg-brand-50 text-brand-700 dark:bg-teal-950/60 dark:text-teal-300 border border-brand-200/50"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                }`}
              >
                <ItemIcon className="w-3 h-3" />
                {isId ? item.label : item.labelEn}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative border-b border-slate-200/90 dark:border-slate-800 bg-gradient-to-b from-teal-50/50 via-white to-[#f8fafc] dark:from-teal-950/20 dark:via-slate-900 dark:to-slate-950 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-teal-950 dark:text-teal-300 border border-brand-200/60 dark:border-teal-800/50">
                <IconComponent className="w-3.5 h-3.5 text-brand-600" />
                {isId ? category : categoryEn}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {isId ? badge : badgeEn}
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
              {doc.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-normal">
              {doc.subtitle}
            </p>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-500 dark:text-slate-400 pt-5 border-t border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                <span>
                  {isId ? "Terakhir Diperbarui:" : "Last Updated:"}{" "}
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                    {doc.updatedDate || "6 September 2026"}
                  </strong>
                </span>
              </div>
              <span>•</span>
              <div>
                <span>
                  {isId ? "Versi:" : "Version:"}{" "}
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                    {doc.version || "Versi 2.4"}
                  </strong>
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{isId ? "Yurisdiksi: Republik Indonesia" : "Jurisdiction: Republic of Indonesia"}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-600" />
                <span>{isId ? "Waktu Baca: ~5 menit" : "Reading Time: ~5 min"}</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <button
                type="button"
                onClick={handleCopyPageLink}
                className="inline-flex items-center gap-1.5 text-brand-600 dark:text-teal-400 hover:underline font-semibold cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isId ? "Tautan Tersalin!" : "Link Copied!"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isId ? "Salin Tautan Halaman" : "Copy Page Link"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Highlights ("Poin Kunci Transparansi - Ringkasan 30 Detik") */}
      {doc.summaryPoints && doc.summaryPoints.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-8 print:hidden relative z-10">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-teal-950 flex items-center justify-center text-brand-600 dark:text-teal-400">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {isId ? "Poin Kunci Transparansi (Ringkasan 30 Detik)" : "Key Transparency Highlights (30-Second Summary)"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {doc.summaryPoints.map((point, idx) => {
                const TakeawayIcon = getTakeawayIcon(idx);
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3.5 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-brand-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700 shadow-2xs">
                      <TakeawayIcon className="w-4 h-4" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {point}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Main Body Grid: Sidebar TOC & Content Articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Desktop Sticky Table of Contents */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-6 print:hidden">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-600" />
                  {isId ? "Daftar Isi" : "Table of Contents"}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {filteredSections.length} {isId ? "Bagian" : "Sections"}
                </span>
              </div>

              {/* Quick Search Input */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isId ? "Cari pasal atau topik..." : "Search sections..."}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-600 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Section Buttons */}
              <nav className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-1 text-sm no-scrollbar">
                {filteredSections.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                    {isId ? "Tidak ada topik yang cocok dengan pencarian." : "No sections match your search."}
                  </div>
                ) : (
                  filteredSections.map((section, idx) => {
                    const isActive = currentActiveSection === section.id;
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                          isActive
                            ? "bg-brand-50 text-brand-700 dark:bg-teal-950/60 dark:text-teal-300 font-bold border-l-3 border-brand-600 pl-2.5 shadow-2xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium"
                        }`}
                      >
                        <span
                          className={`text-[11px] font-mono mt-0.5 font-bold ${
                            isActive
                              ? "text-brand-600 dark:text-teal-400"
                              : "text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          {section.number || String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 leading-snug">{section.title}</span>
                      </button>
                    );
                  })
                )}
              </nav>
            </div>

            {/* Contact / Inquiries Box */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-50/70 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-850 border border-teal-100/90 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-teal-500/20 flex items-center justify-center text-brand-600 dark:text-teal-400">
                  <Mail className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {common.contactTitle || (isId ? "Pertanyaan atau Bantuan?" : "Questions or Inquiries?")}
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                {common.contactDesc ||
                  (isId
                    ? "Tim kepatuhan dan keamanan MoneFin siap membantu klarifikasi klausul atau penanganan data pribadi."
                    : "MoneFin's legal & security team is ready to clarify any clause or data handling procedures.")}
              </p>
              <div className="space-y-1.5">
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-teal-400 hover:underline"
                >
                  <span>{contactEmail}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {common.responseTime || (isId ? "Respon: < 24 jam kerja" : "Response: < 24 business hours")}
                </p>
              </div>
            </div>
          </aside>

          {/* Right Column: Full Document Articles */}
          <main className="lg:col-span-8 space-y-8">
            {filteredSections.map((section, idx) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-28 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-all hover:border-slate-300 dark:hover:border-slate-700 group"
              >
                {/* Section Header */}
                <div className="flex items-start justify-between gap-4 mb-5 pb-3.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-teal-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700">
                      {section.number || String(idx + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {section.title}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopySectionLink(section.id)}
                    className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                    title={isId ? "Salin tautan bagian ini" : "Copy link to section"}
                  >
                    {copiedSectionId === section.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Section Content */}
                <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {section.paragraphs?.map((paragraph, pIdx) => {
                    // Check if paragraph is a bullet point starting with • or - or 1.
                    const isBullet =
                      paragraph.startsWith("• ") ||
                      paragraph.startsWith("- ") ||
                      /^[0-9]+\.\s/.test(paragraph);

                    if (isBullet) {
                      return (
                        <div key={pIdx} className="flex items-start gap-2.5 pl-1 my-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-2.5 shrink-0" />
                          <p className="flex-1 font-medium text-slate-800 dark:text-slate-200">
                            {paragraph.replace(/^[•\-]\s*/, "").replace(/^[0-9]+\.\s*/, "")}
                          </p>
                        </div>
                      );
                    }

                    return <p key={pIdx}>{paragraph}</p>;
                  })}

                  {/* Optional Explicit Bullets Array */}
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="space-y-2.5 my-4 pl-1">
                      {section.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-2.5 shrink-0" />
                          <span className="text-slate-800 dark:text-slate-200 font-medium">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Optional Callout Box */}
                  {section.callout && (
                    <div
                      className={`mt-5 p-4 sm:p-5 rounded-2xl text-xs sm:text-sm flex items-start gap-3.5 border ${
                        section.callout.type === "warning"
                          ? "bg-amber-50/90 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800/40"
                          : section.callout.type === "shield"
                          ? "bg-teal-50/90 dark:bg-teal-950/30 text-teal-950 dark:text-teal-200 border-teal-200/80 dark:border-teal-800/40"
                          : "bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {section.callout.type === "warning" ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      ) : section.callout.type === "shield" ? (
                        <ShieldCheck className="w-5 h-5 text-brand-600 dark:text-teal-400 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        {section.callout.title && (
                          <h4 className="font-bold text-slate-900 dark:text-white">
                            {section.callout.title}
                          </h4>
                        )}
                        <p className="leading-relaxed">{section.callout.text}</p>
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* SPECIAL ENHANCEMENTS FOR SECURITY PAGE */}
                  {/* ========================================================================= */}
                  {/* IDOR Protection Controller Grid */}
                  {section.id === "idor-protection" && (
                    <div className="mt-5 p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-brand-600" />
                        <span>
                          {isId
                            ? "Endpoint & Controller yang Divalidasi Kepemilikan Baris (Row-Level Scoping):"
                            : "Protected Controllers with Strict Row-Level Scoping:"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {[
                          { name: "TransactionController", scope: "User ID + Account Ownership Check" },
                          { name: "BudgetController", scope: "Category Tenant Scoping" },
                          { name: "SplitBillController", scope: "Owner & Participant Authorization" },
                          { name: "GoalController", scope: "User Scoped Savings Simulation" },
                          { name: "AccountController", scope: "Wallet & Bank Isolation" },
                          { name: "IncomeSettingController", scope: "Single User Recurring Scoping" },
                        ].map((item, cIdx) => (
                          <div
                            key={cIdx}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700"
                          >
                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              {item.scope}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Security Headers Table */}
                  {section.id === "security-headers" && (
                    <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                            <th className="p-3.5">{isId ? "HTTP Header" : "HTTP Header"}</th>
                            <th className="p-3.5">{isId ? "Nilai / Kebijakan" : "Value / Policy"}</th>
                            <th className="p-3.5">{isId ? "Status & Proteksi" : "Status & Purpose"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                          <tr>
                            <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">X-Frame-Options</td>
                            <td className="p-3.5 font-mono text-brand-600 font-bold">DENY</td>
                            <td className="p-3.5">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {isId ? "Cegah Clickjacking luar" : "Prevents Clickjacking"}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">X-Content-Type-Options</td>
                            <td className="p-3.5 font-mono text-brand-600 font-bold">nosniff</td>
                            <td className="p-3.5">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {isId ? "Cegah MIME-sniffing exploit" : "Blocks MIME-sniffing"}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">X-XSS-Protection</td>
                            <td className="p-3.5 font-mono text-brand-600 font-bold">1; mode=block</td>
                            <td className="p-3.5">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {isId ? "Filter XSS peramban bawaan" : "Browser-level XSS filter"}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">Referrer-Policy</td>
                            <td className="p-3.5 font-mono text-brand-600 font-bold">strict-origin-when-cross-origin</td>
                            <td className="p-3.5">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {isId ? "Isolasi URL rute internal" : "Strict referrer isolation"}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">Content-Security-Policy</td>
                            <td className="p-3.5 font-mono text-brand-600 font-bold">default-src &apos;self&apos; + SSE</td>
                            <td className="p-3.5">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {isId ? "Isolasi script & pass AI SSE" : "Script isolation & AI SSE pass"}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* SPECIAL ENHANCEMENTS FOR PRIVACY PAGE */}
                  {/* ========================================================================= */}
                  {/* Data Subject Rights Matrix */}
                  {section.id === "data-subject-rights" && (
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          title: isId ? "Hak Akses & Portabilitas" : "Access & Data Portability",
                          desc: isId
                            ? "Unduh riwayat transaksi dalam format CSV/Excel kapan pun."
                            : "Download transaction logs in CSV/Excel formats whenever required.",
                          icon: Database,
                        },
                        {
                          title: isId ? "Hak Koreksi & Rektifikasi" : "Rectification & Updates",
                          desc: isId
                            ? "Koreksi saldo, nama rekening, dan catatan pengeluaran langsung."
                            : "Edit wallet labels, amounts, and category mappings freely.",
                          icon: CheckCircle2,
                        },
                        {
                          title: isId ? "Hak Penghapusan (Right to Erasure)" : "Permanent Erasure",
                          desc: isId
                            ? "Hapus akun permanen dengan verifikasi kata sandi di Pengaturan Profil."
                            : "Irreversibly purge account and data via Profile Settings.",
                          icon: UserX,
                        },
                        {
                          title: isId ? "Hak Revokasi Sesi Perangkat" : "Device Session Revocation",
                          desc: isId
                            ? "Putus sesi login perangkat lain dari jarak jauh kapan saja."
                            : "Remotely terminate active logins across older devices.",
                          icon: KeyRound,
                        },
                      ].map((item, rIdx) => {
                        const ItemIcon = item.icon;
                        return (
                          <div
                            key={rIdx}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3"
                          >
                            <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 text-brand-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-slate-200/70 dark:border-slate-700">
                              <ItemIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* SPECIAL ENHANCEMENTS FOR TERMS PAGE */}
                  {/* ========================================================================= */}
                  {/* Gamification Non-Monetary Card */}
                  {section.id === "gamification" && (
                    <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-brand-50/60 dark:bg-teal-950/40 border border-brand-200/60 dark:border-teal-800/50 flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 text-brand-600 dark:text-teal-400 flex items-center justify-center shrink-0 shadow-2xs">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="text-xs leading-relaxed space-y-1">
                        <h4 className="font-bold text-brand-900 dark:text-teal-200">
                          {isId ? "Status Virtual XP & Lencana MoneFin" : "Virtual XP & Badge Status"}
                        </h4>
                        <p className="text-slate-700 dark:text-slate-300">
                          {isId
                            ? "Poin pengalaman (XP), target streaks, dan level profil dirancang murni untuk memotivasi kebiasaan keuangan sehat. Poin ini tidak memiliki padanan nilai mata uang fiat dan tidak dapat ditukarkan dengan uang tunai."
                            : "Experience points (XP), saving streaks, and profile badges are motivational mechanics for healthy money habits. They carry zero cash equivalent and cannot be cashed out."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}

            {/* Related Legal Documents Section */}
            {relatedDocs && relatedDocs.length > 0 && (
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800 print:hidden">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-600" />
                  {isId ? "Dokumen Kepatuhan Terkait Lainnya" : "Related Legal & Compliance Documents"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedDocs.map((item) => {
                    const DocIcon = item.icon || FileText;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-brand-600 dark:hover:border-brand-600 transition-all hover:shadow-sm group flex items-start gap-3.5"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-brand-50 group-hover:text-brand-600 dark:group-hover:bg-teal-950/60 dark:group-hover:text-teal-300 flex items-center justify-center shrink-0 transition-colors">
                          <DocIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-teal-400 transition-colors">
                              {isId ? item.title : item.titleEn}
                            </h4>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {isId ? item.desc : item.descEn}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Document Feedback Box */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-3 print:hidden">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {common.feedbackTitle || (isId ? "Apakah dokumen ini cukup jelas bagi Anda?" : "Was this document clear and helpful?")}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                {common.feedbackDesc ||
                  (isId
                    ? "Kami berkomitmen menyajikan ketentuan secara transparan tanpa klausul tersembunyi."
                    : "We are committed to presenting terms with complete transparency and zero hidden fine print.")}
              </p>
              {feedbackGiven ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>{isId ? "Terima kasih atas umpan balik Anda!" : "Thank you for your feedback!"}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setFeedbackGiven("yes")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-brand-50 hover:text-brand-600 transition-all cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{isId ? "Sangat Jelas" : "Very Clear"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackGiven("no")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>{isId ? "Perlu Diperjelas" : "Needs Clarification"}</span>
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Floating Mobile TOC Pill Button */}
      <div className="fixed bottom-5 right-5 lg:hidden z-30 print:hidden">
        <button
          type="button"
          onClick={() => setMobileTocOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-600/30 hover:bg-brand-700 transition-all cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span>{isId ? `Daftar Isi (${filteredSections.length})` : `Contents (${filteredSections.length})`}</span>
        </button>
      </div>

      {/* Mobile Table of Contents Bottom Sheet / Drawer */}
      {mobileTocOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 border-t border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {isId ? "Daftar Isi Dokumen" : "Table of Contents"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileTocOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              {filteredSections.map((sec, idx) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs flex items-start gap-3 cursor-pointer ${
                    currentActiveSection === sec.id
                      ? "bg-brand-50 text-brand-700 dark:bg-teal-950 font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 font-medium"
                  }`}
                >
                  <span className="font-mono text-[11px] text-slate-400 mt-0.5">
                    {sec.number || String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-snug">{sec.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Copyright */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-brand-600 flex items-center justify-center p-0.5">
              <Image src="/images/LogoMonefinWhite.svg" alt="MoneFin" width={10} height={10} className="w-2.5 h-2.5" />
            </div>
            <span>
              &copy; {new Date().getFullYear()} MoneFin Financial Services. {isId ? "Hak cipta dilindungi undang-undang." : "All rights reserved."}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <Link href="/terms" className="hover:text-brand-600">
              {isId ? "Syarat" : "Terms"}
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-brand-600">
              {isId ? "Privasi" : "Privacy"}
            </Link>
            <span>•</span>
            <Link href="/security" className="hover:text-brand-600">
              {isId ? "Keamanan" : "Security"}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

