"use client";

import { useSyncExternalStore } from "react";
import { getAuthToken } from "../../lib/api";

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HeroPerspectiveDeck } from "@/components/landing/HeroPerspectiveDeck";
import { StatsOverview } from "@/components/landing/StatsOverview";
import { Features } from "@/components/landing/Features";
import { WealthSimulator } from "@/components/landing/WealthSimulator";
import { Comparison } from "@/components/landing/Comparison";
import { Testimonials } from "@/components/landing/Testimonials";
import { Faq } from "@/components/landing/Faq";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";

function subscribeAuthStore(callback) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getAuthSnapshot() {
  if (typeof window === "undefined") return false;
  return !!getAuthToken();
}

function getServerAuthSnapshot() {
  return false;
}

export function LandingClient() {
  const isLoggedIn = useSyncExternalStore(
    subscribeAuthStore,
    getAuthSnapshot,
    getServerAuthSnapshot
  );

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-brand-600 selection:text-white overflow-x-hidden relative max-w-[100vw]">
      <Navbar isLoggedIn={isLoggedIn} />
      <main id="main-content">
        <Hero isLoggedIn={isLoggedIn} />
        <HeroPerspectiveDeck />
        <StatsOverview />
        <Features />
        <WealthSimulator isLoggedIn={isLoggedIn} />
        <Comparison />
        <Testimonials />
        <Faq />
        <CtaBanner isLoggedIn={isLoggedIn} />
      </main>
      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}
