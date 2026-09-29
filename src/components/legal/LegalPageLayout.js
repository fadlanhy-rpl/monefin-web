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
  History,
  Globe,
  RefreshCw,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { COMPLIANCE_FACTS } from "../../lib/compliance-facts";

const DOC_ICON_MAP = {
  terms: FileText,
  privacy: Lock,
  security: ShieldCheck,
  "/terms": FileText,
  "/privacy": Lock,
  "/security": ShieldCheck,
};

export default function LegalPageLayout({
  docKey,
  data,
  category = "Syarat & Ketentuan",
  categoryEn = "Terms of Service",
  badge = "Kepatuhan Hukum",
  badgeEn = "Legal Compliance",
  icon,
  relatedDocs = [],
}) {
  const IconComponent =
    typeof icon === "function" ? icon : DOC_ICON_MAP[docKey] || FileText;
  const { language, changeLanguage } = useLanguage();
  const isId = language === "id";
  const langKey = isId ? "id" : "en";
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
      const matchParagraphs = s.paragraphs?.some((p) =>
        p.toLowerCase().includes(q)
      );
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

  // Primary functional contact per document (Rule B8 & Finding #10)
  const primaryContact = useMemo(() => {
    if (docKey === "security") return COMPLIANCE_FACTS.contacts.security;
    if (docKey === "privacy") return COMPLIANCE_FACTS.contacts.privacy;
    return COMPLIANCE_FACTS.contacts.legal;
  }, [docKey]);

  const allContacts = useMemo(
    () => [
      { key: "security", ...COMPLIANCE_FACTS.contacts.security },
      { key: "privacy", ...COMPLIANCE_FACTS.contacts.privacy },
      { key: "legal", ...COMPLIANCE_FACTS.contacts.legal },
      { key: "support", ...COMPLIANCE_FACTS.contacts.support },
    ],
    []
  );

  // Dedicated takeaway icons based on docKey and index (supports up to 5 summary points per Rule B3)
  const getTakeawayIcon = (index) => {
    if (docKey === "terms") {
      if (index === 0) return Scale;
      if (index === 1) return UserCheck;
      if (index === 2) return Cpu;
      if (index === 3) return ShieldCheck;
      return Receipt;
    }
    if (docKey === "privacy") {
      if (index === 0) return ShieldCheck;
      if (index === 1) return Cpu;
      if (index === 2) return Server;
      if (index === 3) return UserCheck;
      return Clock;
    }
    if (docKey === "security") {
      if (index === 0) return ShieldCheck;
      if (index === 1) return KeyRound;
      if (index === 2) return Lock;
      if (index === 3) return Database;
      return Server;
    }
    return Shield;
  };

  const securityControls = COMPLIANCE_FACTS.securityControls[langKey] || [];
  const securityHeaders = COMPLIANCE_FACTS.securityHeaders || [];
  const dataCategories = COMPLIANCE_FACTS.dataCategoriesTable[langKey] || [];
  const subProcessors = COMPLIANCE_FACTS.subProcessorsTable[langKey] || [];
  const cookiesAndStorage =
    COMPLIANCE_FACTS.cookiesAndStorageTable[langKey] || [];
  const changelogList = COMPLIANCE_FACTS.changelog[langKey] || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-brand-600/20 selection:text-brand-600">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-all print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center p-1 shadow-md shadow-brand-600/20 group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/images/logo-monefin-white.svg"
                alt="MoneFin Logo"
                width={16}
                height={16}
                className="w-4 h-4"
              />
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
              title={
                isId
                  ? "Cetak dokumen / Unduh PDF"
                  : "Print document / Download PDF"
              }
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
              {mobileTocOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
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
          <div className="max-w-4xl">
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

            {/* Metadata Bar (Aturan B1 & B7) */}
            <div className="flex flex-wrap items-center gap-y-2.5 gap-x-4 text-xs text-slate-500 dark:text-slate-400 pt-5 border-t border-slate-200/80 dark:border-slate-800">
              <div>
                <span>
                  {isId ? "Versi:" : "Version:"}{" "}
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold font-mono">
                    {doc.version || COMPLIANCE_FACTS.versionLabel[langKey]}
                  </strong>
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                <span>
                  {isId ? "Tanggal Efektif:" : "Effective Date:"}{" "}
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                    {doc.effectiveDate ||
                      COMPLIANCE_FACTS.effectiveDate[langKey]}
                  </strong>
                </span>
              </div>
              <span>•</span>
              <div>
                <span>
                  {isId ? "Terakhir Diperbarui:" : "Last Updated:"}{" "}
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                    {doc.updatedDate || COMPLIANCE_FACTS.updatedDate[langKey]}
                  </strong>
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {isId ? "Penanggung Jawab:" : "Document Owner:"}{" "}
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                    {doc.documentOwner ||
                      COMPLIANCE_FACTS.documentOwner[langKey]}
                  </strong>
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-brand-600" />
                <span>
                  {doc.reviewCycle || COMPLIANCE_FACTS.reviewCycle[langKey]}
                </span>
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
                    <span>
                      {isId ? "Salin Tautan Halaman" : "Copy Page Link"}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Governing Language Banner (Aturan B3) */}
            <div className="mt-4 p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <Globe className="w-4 h-4 text-brand-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {doc.governingLanguageNotice ||
                  COMPLIANCE_FACTS.governingLanguageNotice[langKey]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Highlights ("Ringkasan 30 Detik" — Aturan B3, Maks. 5 Poin) */}
      {doc.summaryPoints && doc.summaryPoints.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-8 print:hidden relative z-10">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-teal-950 flex items-center justify-center text-brand-600 dark:text-teal-400">
                  <Clock className="w-4 h-4" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {isId
                    ? "Poin Kunci Transparansi (Ringkasan 30 Detik)"
                    : "Key Transparency Highlights (30-Second Summary)"}
                </h2>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                {isId
                  ? "Ringkasan ini membantu pemahaman cepat dan tidak menggantikan isi dokumen lengkap di bawah."
                  : "This summary aids quick understanding and does not replace the full legal text below."}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doc.summaryPoints.slice(0, 5).map((point, idx) => {
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
                  placeholder={
                    isId ? "Cari pasal atau topik..." : "Search sections..."
                  }
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
              <nav className="space-y-1 max-h-[calc(100vh-380px)] overflow-y-auto pr-1 text-sm no-scrollbar">
                {filteredSections.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                    {isId
                      ? "Tidak ada topik yang cocok dengan pencarian."
                      : "No sections match your search."}
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
                        <span className="flex-1 leading-snug">
                          {section.title}
                        </span>
                      </button>
                    );
                  })
                )}
              </nav>
            </div>

            {/* Official Functional Contacts Box (Aturan B8 & Temuan #10) */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-50/70 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-850 border border-teal-100/90 dark:border-slate-800 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-teal-500/20 flex items-center justify-center text-brand-600 dark:text-teal-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {common.contactTitle ||
                      (isId
                        ? "Kontak Resmi Sesuai Fungsi"
                        : "Official Functional Contacts")}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {primaryContact.role[langKey]}
                  </p>
                </div>
              </div>

              {/* Highlighted Primary Contact for Active Document */}
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-brand-200/70 dark:border-teal-800/60 space-y-1">
                <a
                  href={`mailto:${primaryContact.email}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-teal-400 hover:underline font-mono"
                >
                  <span>{primaryContact.email}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>SLA:</strong> {primaryContact.sla[langKey]}
                </p>
              </div>

              {/* All 4 Official Channels Summary */}
              <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {isId
                    ? "Saluran Resmi MoneFin (@monefin.web.id)"
                    : "Official Channels (@monefin.web.id)"}
                </p>
                {allContacts.map((c) => (
                  <div
                    key={c.key}
                    className="flex items-center justify-between text-[11px] gap-2"
                  >
                    <span className="text-slate-500 dark:text-slate-400 truncate">
                      {c.key === "security"
                        ? isId
                          ? "Keamanan / CSIRT"
                          : "Security / CSIRT"
                        : c.key === "privacy"
                        ? isId
                          ? "Privasi / DPO"
                          : "Privacy / DPO"
                        : c.key === "legal"
                        ? isId
                          ? "Hukum & Banding"
                          : "Legal & Appeals"
                        : isId
                        ? "Bantuan Umum"
                        : "General Support"}
                    </span>
                    <a
                      href={`mailto:${c.email}`}
                      className="font-mono font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-teal-400"
                    >
                      {c.email}
                    </a>
                  </div>
                ))}
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
                    title={
                      isId
                        ? "Salin tautan bagian ini"
                        : "Copy link to section"
                    }
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
                    const isBullet =
                      paragraph.startsWith("• ") ||
                      paragraph.startsWith("- ") ||
                      /^[0-9]+\.\s/.test(paragraph);

                    if (isBullet) {
                      return (
                        <div
                          key={pIdx}
                          className="flex items-start gap-2.5 pl-1 my-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-2.5 shrink-0" />
                          <p className="flex-1 font-medium text-slate-800 dark:text-slate-200">
                            {paragraph
                              .replace(/^[•\-]\s*/, "")
                              .replace(/^[0-9]+\.\s*/, "")}
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
                        <p className="leading-relaxed">
                          {section.callout.text}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* STRUCTURED TABLES FROM SINGLE SOURCE OF TRUTH (COMPLIANCE_FACTS)          */}
                  {/* ========================================================================= */}

                  {/* 1. Standar Keamanan #2: Tabel Kontrol Keamanan (Kontrol | Deskripsi | Standar | Status) */}
                  {section.id === "scope-principles" &&
                    securityControls.length > 0 && (
                      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                              <th className="p-3.5">
                                {isId ? "Kontrol Keamanan" : "Security Control"}
                              </th>
                              <th className="p-3.5">
                                {isId
                                  ? "Deskripsi Singkat"
                                  : "Brief Description"}
                              </th>
                              <th className="p-3.5">
                                {isId ? "Standar Acuan" : "Reference Standard"}
                              </th>
                              <th className="p-3.5">
                                {isId ? "Status" : "Status"}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                            {securityControls.map((row, rIdx) => {
                              const isRoadmap = row.status
                                .toLowerCase()
                                .includes("roadmap");
                              const isPartial =
                                row.status.toLowerCase().includes("sebagian") ||
                                row.status.toLowerCase().includes("partial");
                              return (
                                <tr key={rIdx}>
                                  <td className="p-3.5 font-bold text-slate-900 dark:text-white align-top">
                                    {row.control}
                                  </td>
                                  <td className="p-3.5 leading-relaxed align-top">
                                    {row.description}
                                  </td>
                                  <td className="p-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-400 align-top">
                                    {row.standard}
                                  </td>
                                  <td className="p-3.5 align-top whitespace-nowrap">
                                    <span
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold text-[11px] ${
                                        isPartial
                                          ? "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                          : isRoadmap
                                          ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                      }`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${
                                          isPartial
                                            ? "bg-amber-500"
                                            : isRoadmap
                                            ? "bg-slate-400"
                                            : "bg-emerald-500"
                                        }`}
                                      />
                                      {row.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                  {/* 2. Standar Keamanan #6: Tabel HTTP Security Headers (Tanpa X-XSS-Protection, Konsisten dengan Teks) */}
                  {section.id === "api-security-headers" &&
                    securityHeaders.length > 0 && (
                      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                              <th className="p-3.5">HTTP Header</th>
                              <th className="p-3.5">
                                {isId ? "Nilai Kebijakan" : "Policy Value"}
                              </th>
                              <th className="p-3.5">
                                {isId
                                  ? "Cakupan Penerapan"
                                  : "Enforcement Scope"}
                              </th>
                              <th className="p-3.5">
                                {isId
                                  ? "Tujuan Proteksi"
                                  : "Protection Purpose"}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                            {securityHeaders.map((item, hIdx) => (
                              <tr key={hIdx}>
                                <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white align-top whitespace-nowrap">
                                  {item.header}
                                </td>
                                <td className="p-3.5 font-mono text-brand-600 dark:text-teal-400 font-bold align-top">
                                  {item.value}
                                </td>
                                <td className="p-3.5 text-slate-600 dark:text-slate-400 align-top">
                                  {item.scope[langKey]}
                                </td>
                                <td className="p-3.5 align-top">
                                  {item.purpose[langKey]}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  {/* 3. Standar Keamanan #9 & Kebijakan Privasi #5: Tabel Sub-Prosesor Pihak Ketiga */}
                  {(section.id === "vendor-security" ||
                    section.id === "subprocessors") &&
                    subProcessors.length > 0 && (
                      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                              <th className="p-3.5">
                                {isId
                                  ? "Pemroses / Sub-Prosesor"
                                  : "Processor / Sub-Processor"}
                              </th>
                              <th className="p-3.5">
                                {isId ? "Peran & Tujuan" : "Role & Purpose"}
                              </th>
                              <th className="p-3.5">
                                {isId
                                  ? "Lokasi Pemrosesan"
                                  : "Processing Location"}
                              </th>
                              <th className="p-3.5">
                                {isId
                                  ? "Jaminan Pelindungan"
                                  : "Security & Privacy Safeguards"}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                            {subProcessors.map((sp, spIdx) => (
                              <tr key={spIdx}>
                                <td className="p-3.5 font-bold text-slate-900 dark:text-white align-top">
                                  {sp.name}
                                </td>
                                <td className="p-3.5 leading-relaxed align-top">
                                  {sp.role}
                                </td>
                                <td className="p-3.5 text-slate-600 dark:text-slate-400 align-top">
                                  {sp.location}
                                </td>
                                <td className="p-3.5 leading-relaxed align-top">
                                  {sp.safeguard}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  {/* 4. Standar Keamanan #11: Tautan RFC 9116 /.well-known/security.txt */}
                  {section.id === "vulnerability-disclosure" && (
                    <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-teal-400 shrink-0" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {isId
                            ? "Berkas Standar RFC 9116 (security.txt):"
                            : "RFC 9116 Standard File (security.txt):"}
                        </span>
                      </div>
                      <a
                        href="/.well-known/security.txt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono font-bold text-brand-600 dark:text-teal-400 hover:underline"
                      >
                        <span>/.well-known/security.txt</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {/* 5. Kebijakan Privasi #2: Tabel Kategori Data, Tujuan, Dasar Hukum, & Retensi */}
                  {section.id === "data-collected" &&
                    dataCategories.length > 0 && (
                      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                              <th className="p-3.5">
                                {isId ? "Kategori Data" : "Data Category"}
                              </th>
                              <th className="p-3.5">
                                {isId ? "Rincian Data" : "Data Elements"}
                              </th>
                              <th className="p-3.5">
                                {isId
                                  ? "Tujuan Pemrosesan"
                                  : "Processing Purpose"}
                              </th>
                              <th className="p-3.5">
                                {isId
                                  ? "Dasar Hukum (UU PDP)"
                                  : "Legal Basis (UU PDP / GDPR)"}
                              </th>
                              <th className="p-3.5">
                                {isId ? "Masa Retensi" : "Retention Period"}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                            {dataCategories.map((dc, dcIdx) => (
                              <tr key={dcIdx}>
                                <td className="p-3.5 font-bold text-slate-900 dark:text-white align-top">
                                  {dc.category}
                                </td>
                                <td className="p-3.5 leading-relaxed align-top">
                                  {dc.items}
                                </td>
                                <td className="p-3.5 leading-relaxed align-top">
                                  {dc.purpose}
                                </td>
                                <td className="p-3.5 leading-relaxed align-top text-slate-600 dark:text-slate-400">
                                  {dc.legalBasis}
                                </td>
                                <td className="p-3.5 leading-relaxed align-top">
                                  {dc.retention}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  {/* 6. Kebijakan Privasi #7: Matriks Hak Subjek Data (UU PDP Pasal 5–13) */}
                  {section.id === "data-subject-rights" && (
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          title: isId
                            ? "Hak Informasi, Akses & Portabilitas"
                            : "Right to Information, Access & Portability",
                          desc: isId
                            ? "Lihat seluruh data keuangan Anda dan unduh salinan riwayat transaksi dalam format CSV/Excel kapan pun."
                            : "Inspect your financial records and export transaction logs in machine-readable CSV/Excel formats.",
                          icon: Database,
                        },
                        {
                          title: isId
                            ? "Hak Koreksi & Pembaruan Data"
                            : "Right to Rectification & Updates",
                          desc: isId
                            ? "Perbaiki atau perbarui profil, saldo dompet, kategori, dan rincian transaksi secara langsung di aplikasi."
                            : "Edit profile details, wallet balances, categories, and transaction records directly in the app.",
                          icon: CheckCircle2,
                        },
                        {
                          title: isId
                            ? "Hak Penghapusan (Right to Erasure)"
                            : "Right to Permanent Erasure",
                          desc: isId
                            ? "Hapus akun beserta seluruh data di sistem aktif melalui Pengaturan Profil (cadangan dibersihkan maks. 30 hari)."
                            : "Delete your account and active records via Profile Settings (encrypted backups purged within 30 days).",
                          icon: UserX,
                        },
                        {
                          title: isId
                            ? "Hak Penarikan Persetujuan & Revokasi Sesi"
                            : "Right to Withdraw Consent & Revoke Sessions",
                          desc: isId
                            ? "Hapus kunci API BYOK, cabut sesi perangkat jarak jauh, atau ajukan keberatan/pembatasan ke privacy@monefin.web.id."
                            : "Remove BYOK API keys, remotely terminate active sessions, or submit requests to privacy@monefin.web.id.",
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

                  {/* 7. Kebijakan Privasi #12: Tabel Cookie, Token, & Penyimpanan Lokal */}
                  {section.id === "cookies-tokens" &&
                    cookiesAndStorage.length > 0 && (
                      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                              <th className="p-3.5">
                                {isId
                                  ? "Nama Cookie / Key"
                                  : "Cookie / Storage Key"}
                              </th>
                              <th className="p-3.5">
                                {isId ? "Jenis" : "Storage Type"}
                              </th>
                              <th className="p-3.5">
                                {isId ? "Tujuan Penggunaan" : "Purpose"}
                              </th>
                              <th className="p-3.5">
                                {isId ? "Durasi / Retensi" : "Duration / TTL"}
                              </th>
                              <th className="p-3.5">
                                {isId ? "Sifat" : "Necessity"}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                            {cookiesAndStorage.map((ck, ckIdx) => (
                              <tr key={ckIdx}>
                                <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white align-top">
                                  {ck.name}
                                </td>
                                <td className="p-3.5 font-mono text-[11px] text-brand-600 dark:text-teal-400 align-top">
                                  {ck.type}
                                </td>
                                <td className="p-3.5 leading-relaxed align-top">
                                  {ck.purpose}
                                </td>
                                <td className="p-3.5 text-slate-600 dark:text-slate-400 align-top">
                                  {ck.duration}
                                </td>
                                <td className="p-3.5 font-semibold align-top">
                                  {ck.required}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  {/* 8. Syarat & Ketentuan #7: Kartu Gamifikasi Non-Moneter */}
                  {section.id === "gamification" && (
                    <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-brand-50/60 dark:bg-teal-950/40 border border-brand-200/60 dark:border-teal-800/50 flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 text-brand-600 dark:text-teal-400 flex items-center justify-center shrink-0 shadow-2xs">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="text-xs leading-relaxed space-y-1">
                        <h4 className="font-bold text-brand-900 dark:text-teal-200">
                          {isId
                            ? "Status Non-Moneter Virtual XP & Lencana MoneFin"
                            : "Non-Monetary Status of Virtual XP & Badges"}
                        </h4>
                        <p className="text-slate-700 dark:text-slate-300">
                          {isId
                            ? "Poin pengalaman (XP), target streaks, dan level profil dirancang murni untuk memotivasi kebiasaan pencatatan keuangan sehat. Poin ini bukan uang elektronik, tidak memiliki nilai tukar mata uang fiat, tidak dapat ditransfer, dan tidak dapat diuangkan."
                            : "Experience points (XP), saving streaks, and profile badges are motivational mechanics for healthy financial tracking. They are not e-money, carry zero fiat currency value, are non-transferable, and cannot be cashed out."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}

            {/* Public Changelog Section (Aturan B1 & Temuan #12) */}
            {changelogList.length > 0 && (
              <section
                id="changelog"
                className="scroll-mt-28 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-5"
              >
                <div className="flex items-center justify-between gap-4 pb-3.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-teal-950 text-brand-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-brand-200/60 dark:border-teal-800/50">
                      <History className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {isId
                          ? "Riwayat Perubahan Dokumen (Changelog Publik)"
                          : "Document Revision History (Public Changelog)"}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isId
                          ? "Penomoran versi menggunakan Semantic Versioning (MAJOR.MINOR.PATCH)"
                          : "Version numbering follows Semantic Versioning (MAJOR.MINOR.PATCH)"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {changelogList.map((entry, cIdx) => (
                    <div
                      key={entry.version}
                      className={`p-4 sm:p-5 rounded-2xl border ${
                        cIdx === 0
                          ? "bg-teal-50/40 dark:bg-teal-950/20 border-brand-200/70 dark:border-teal-800/50"
                          : "bg-slate-50/70 dark:bg-slate-850/50 border-slate-200/70 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-brand-600 text-white">
                            v{entry.version}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {entry.type}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {entry.date}
                        </span>
                      </div>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-1">
                        {entry.changes.map((chg, chgIdx) => (
                          <li
                            key={chgIdx}
                            className="flex items-start gap-2.5 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-2 shrink-0" />
                            <span>{chg}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Legal Documents Section */}
            {relatedDocs && relatedDocs.length > 0 && (
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800 print:hidden">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-600" />
                  {isId
                    ? "Dokumen Kepatuhan Terkait Lainnya"
                    : "Related Legal & Compliance Documents"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedDocs.map((item) => {
                    const DocIcon =
                      typeof item.icon === "function"
                        ? item.icon
                        : DOC_ICON_MAP[item.href] || FileText;
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
                {common.feedbackTitle ||
                  (isId
                    ? "Apakah dokumen ini cukup jelas bagi Anda?"
                    : "Was this document clear and helpful?")}
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
                  <span>
                    {isId
                      ? "Terima kasih atas umpan balik Anda!"
                      : "Thank you for your feedback!"}
                  </span>
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
                    <span>
                      {isId ? "Perlu Diperjelas" : "Needs Clarification"}
                    </span>
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
          <span>
            {isId
              ? `Daftar Isi (${filteredSections.length})`
              : `Contents (${filteredSections.length})`}
          </span>
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
              <Image
                src="/images/logo-monefin-white.svg"
                alt="MoneFin"
                width={10}
                height={10}
                className="w-2.5 h-2.5"
              />
            </div>
            <span>
              &copy; {new Date().getFullYear()} MoneFin.{" "}
              {isId
                ? "Hak cipta dilindungi undang-undang."
                : "All rights reserved."}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <Link href="/terms" className="hover:text-brand-600">
              {isId ? "Syarat & Ketentuan" : "Terms"}
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-brand-600">
              {isId ? "Kebijakan Privasi" : "Privacy"}
            </Link>
            <span>•</span>
            <Link href="/security" className="hover:text-brand-600">
              {isId ? "Standar Keamanan" : "Security"}
            </Link>
            <span>•</span>
            <a
              href="/.well-known/security.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-600 font-mono"
            >
              security.txt
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
