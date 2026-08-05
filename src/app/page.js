"use client";

import { useState, useEffect } from "react";
import { getAuthToken } from "../lib/api";

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { StatsOverview } from "@/components/landing/StatsOverview";
import { Features } from "@/components/landing/Features";
import { WealthSimulator } from "@/components/landing/WealthSimulator";
import { Comparison } from "@/components/landing/Comparison";
import { Testimonials } from "@/components/landing/Testimonials";
import { Faq } from "@/components/landing/Faq";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-brand-600 selection:text-white overflow-x-hidden relative max-w-[100vw]">
      <Navbar isLoggedIn={isLoggedIn} />
      <Hero isLoggedIn={isLoggedIn} />
      <StatsOverview />
      <Features />
      <WealthSimulator isLoggedIn={isLoggedIn} />
      <Comparison />
      <Testimonials />
      <Faq />
      <CtaBanner isLoggedIn={isLoggedIn} />
      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}
