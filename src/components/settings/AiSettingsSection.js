"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Bot, Power, ChevronDown, Eye, EyeOff, Plug, Check,
  AlertTriangle, ShieldCheck, RefreshCw, Loader2, X,
  CheckCircle2, Sparkles, Info, Lock, Settings2
} from "lucide-react";
import { testAiConnection, getAiProviders, revealAiKey, saveAiConfig } from "../../services/ai.service";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";

// ─── Source badge used across this component ──────────────────────────────────
function SourceBadge({ source, language = "id" }) {
  if (source === "ai") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
        <Sparkles className="w-2.5 h-2.5" />
        {language === "id" ? "AI Aktif" : "AI Active"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
      <Settings2 className="w-2.5 h-2.5" />
      MoneFin Engine
    </span>
  );
}

// ─── Reveal Key Modal ─────────────────────────────────────────────────────────
function RevealKeyModal({ onClose, onRevealed, language = "id" }) {
  const [password, setPassword]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [remaining, setRemaining]   = useState(5);
  const [showPass, setShowPass]     = useState(false);
  const [mounted, setMounted]       = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");

    try {
      const res = await revealAiKey(password);
      if (res.success && res.api_key) {
        onRevealed(res.api_key);
        onClose();
      } else {
        setError(res.message || (language === "id" ? "Password salah." : "Incorrect password."));
        if (res.remaining_attempts !== undefined) setRemaining(res.remaining_attempts);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || (language === "id" ? "Gagal memverifikasi password." : "Failed to verify password.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen min-h-[100dvh] bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      {/* Click outside backdrop to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />

      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 my-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Lock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                {language === "id" ? "Verifikasi Password" : "Password Verification"}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === "id" ? "Masukkan password akun Anda" : "Enter your account password"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              name="verify_account_password"
              id="verify_account_password"
              autoComplete="current-password"
              data-lpignore="true"
              data-1p-ignore="true"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === "id" ? "Password akun Anda..." : "Your account password..."}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#00685F]/30 focus:border-[#00685F] transition"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{error} {remaining > 0 && `(${remaining} ${language === "id" ? "sisa percobaan" : "attempts remaining"})`}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#00685F] hover:bg-[#004D46] text-white font-bold text-sm py-3 rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>
              {loading
                ? (language === "id" ? "Memverifikasi..." : "Verifying...")
                : (language === "id" ? "Tampilkan API Key" : "Reveal API Key")}
            </span>
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-400 mt-3">
          {language === "id"
            ? "API key akan tampil selama 30 detik, lalu otomatis disembunyikan kembali."
            : "The API key will be displayed for 30 seconds, then automatically hidden."}
        </p>
      </div>
    </div>,
    document.body
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AiSettingsSection({ onShowToast }) {
  const { user, checkAuth }     = useAuth();
  const { language }            = useLanguage();

  // Data from API
  const [providers, setProviders]     = useState({});

  // Form state
  const [aiEnabled, setAiEnabled]     = useState(false);
  const [provider, setProvider]       = useState("");
  const [model, setModel]             = useState("");
  const [apiKey, setApiKey]           = useState("");
  const [showApiKey, setShowApiKey]   = useState(false);
  const [maskedKey, setMaskedKey]     = useState("");
  const [revealTimer, setRevealTimer] = useState(null);

  // UI state
  const [providerOpen, setProviderOpen] = useState(false);
  const [modelOpen, setModelOpen]       = useState(false);
  const [showRevealModal, setShowRevealModal] = useState(false);
  const [testStatus, setTestStatus]     = useState(null); // null | 'loading' | 'ok' | 'error'
  const [testMessage, setTestMessage]   = useState("");
  const [saving, setSaving]             = useState(false);
  const providerRef = useRef(null);
  const modelRef    = useRef(null);

  // Load providers from API and user preferences
  useEffect(() => {
    getAiProviders().then((res) => {
      const data = res?.data ?? res ?? {};
      setProviders(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (user?.preferences) {
      const prefs = user.preferences;
      setAiEnabled(prefs.ai_enabled ?? false);
      const cfg = prefs.ai_config ?? {};
      setProvider(cfg.provider ?? "");
      setModel(cfg.model ?? "");
      setMaskedKey(cfg.api_key_masked ?? "");
    }
  }, [user]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleOutside(e) {
      if (providerRef.current && !providerRef.current.contains(e.target)) setProviderOpen(false);
      if (modelRef.current    && !modelRef.current.contains(e.target))    setModelOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const currentModels = providers[provider]?.models ?? [];
  const currentProviderLabel = providers[provider]?.label ?? provider ?? (language === "id" ? "Pilih Provider" : "Select Provider");

  const handleProviderSelect = (slug) => {
    setProvider(slug);
    const firstModel = providers[slug]?.models?.[0] ?? "";
    setModel(firstModel);
    setProviderOpen(false);
    setTestStatus(null);
  };

  const handleRevealSuccess = (fullKey) => {
    setApiKey(fullKey);
    setShowApiKey(true);
    // Auto-hide after 30 seconds
    const t = setTimeout(() => {
      setApiKey("");
      setShowApiKey(false);
    }, 30000);
    setRevealTimer(t);
  };

  const handleHideKey = () => {
    setApiKey("");
    setShowApiKey(false);
    if (revealTimer) clearTimeout(revealTimer);
  };

  const handleTestConnection = async () => {
    if (!provider || (!apiKey && !maskedKey)) {
      onShowToast(language === "id" ? "Pilih provider dan masukkan API key terlebih dahulu." : "Please select a provider and enter an API key first.");
      return;
    }

    setTestStatus("loading");
    setTestMessage("");

    // If there's an unsaved new key, temporarily save it first
    if (apiKey) {
      try {
        await saveAiConfig({ ai_enabled: aiEnabled, provider, model, api_key: apiKey });
      } catch {}
    }

    try {
      const res  = await testAiConnection();
      const data = res?.data ?? res;
      if (data?.ok) {
        setTestStatus("ok");
        setTestMessage(language === "id" ? `Berhasil terhubung ke ${data.model ?? model}` : `Connected successfully to ${data.model ?? model}`);
      } else {
        setTestStatus("error");
        setTestMessage(data?.message ?? (language === "id" ? "Koneksi gagal." : "Connection failed."));
      }
    } catch (err) {
      setTestStatus("error");
      setTestMessage(err?.response?.data?.message ?? (language === "id" ? "Koneksi gagal. Periksa API key." : "Connection failed. Check your API key."));
    }
  };

  const handleSave = async () => {
    if (aiEnabled && (!provider || (!apiKey && !maskedKey))) {
      onShowToast(language === "id" ? "Pilih provider dan masukkan API key untuk mengaktifkan AI Chatbot." : "Please select a provider and enter an API key to enable AI Chatbot.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ai_enabled: aiEnabled,
        provider,
        model,
        ...(apiKey ? { api_key: apiKey } : {}),
      };

      const res  = await saveAiConfig(payload);
      const data = res?.data ?? res;

      // Update masked key display
      if (data?.ai_config?.api_key_masked) {
        setMaskedKey(data.ai_config.api_key_masked);
      }

      // Clear the raw key from state after saving
      setApiKey("");
      setShowApiKey(false);

      // Refresh global user state so AiChatWidget and smart insights react
      await checkAuth();

      onShowToast(language === "id" ? "Konfigurasi AI berhasil disimpan!" : "AI configuration saved successfully!");
    } catch (err) {
      onShowToast(err?.response?.data?.message ?? (language === "id" ? "Gagal menyimpan konfigurasi AI." : "Failed to save AI configuration."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="bg-white p-5 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 hover:shadow-md transition-all duration-300">

        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#00685F] shrink-0 border border-teal-100">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              {language === "id" ? "Konfigurasi AI Chatbot" : "AI Chatbot Configuration"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === "id"
                ? "Gunakan API key Anda sendiri untuk mengaktifkan fitur AI personal"
                : "Use your own API key to enable personalized AI features"}
            </p>
          </div>
          {aiEnabled && <SourceBadge source="ai" language={language} />}
        </div>

        {/* Master Toggle */}
        <div className="flex items-center justify-between gap-4 p-4 sm:p-5 bg-slate-50/70 rounded-2xl border border-slate-200/70">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${aiEnabled ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/20" : "bg-slate-200 text-slate-500"}`}>
              <Power className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900">
                {language === "id" ? "Aktifkan AI Chatbot" : "Enable AI Chatbot"}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {aiEnabled
                  ? (language === "id" ? "Aktif — Smart Insight menggunakan AI Anda" : "Active — Smart Insights use your AI")
                  : (language === "id" ? "Nonaktif — Smart Insight menggunakan MoneFin Engine" : "Disabled — Smart Insights use MoneFin Engine")}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => setAiEnabled(!aiEnabled)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0 cursor-pointer ${aiEnabled ? "bg-[#00685F]" : "bg-slate-300"}`}
            role="switch"
            aria-checked={aiEnabled}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${aiEnabled ? "translate-x-6" : "translate-x-0"}`}
            />
          </button>
        </div>

        {/* Info Banner — explains dual-mode */}
        <div className="flex items-start gap-3 p-4 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-700">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
          <span className="leading-relaxed font-medium">
            {language === "id"
              ? "Saat AI aktif, fitur Smart Insight di setiap halaman (Dashboard, Kategori, Budget, Akun, Goals) akan menggunakan AI Anda untuk insight yang lebih personal. Saat tidak aktif, MoneFin Engine memberikan insight berbasis logika analisis data."
              : "When AI is active, Smart Insight cards across all pages will use your AI for personalized insights. When disabled, MoneFin Engine provides rule-based data analysis insights."}
          </span>
        </div>

        {/* Provider & Model Configuration */}
        <div className="space-y-5">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {language === "id" ? "Provider & Model" : "Provider & Model"}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Provider Dropdown */}
            <div ref={providerRef} className="relative">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === "id" ? "Provider AI" : "AI Provider"}
              </label>
              <button
                onClick={() => setProviderOpen(!providerOpen)}
                className="w-full flex items-center justify-between gap-2 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white hover:border-[#00685F]/50 focus:outline-none focus:ring-2 focus:ring-[#00685F]/20 transition cursor-pointer"
              >
                <span className={provider ? "text-slate-900 font-semibold" : "text-slate-400"}>
                  {provider ? (providers[provider]?.label ?? provider) : (language === "id" ? "Pilih Provider..." : "Select Provider...")}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${providerOpen ? "rotate-180" : ""}`} />
              </button>

              {providerOpen && Object.keys(providers).length > 0 && (
                <div className="absolute z-30 mt-1.5 w-full bg-white border border-slate-100 rounded-2xl shadow-xl py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                  {Object.entries(providers).map(([slug, info]) => (
                    <button
                      key={slug}
                      onClick={() => handleProviderSelect(slug)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${provider === slug ? "text-[#00685F] bg-teal-50 font-bold" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                      <span>{info.label}</span>
                      {provider === slug && <Check className="w-3.5 h-3.5 text-[#00685F]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Model Dropdown */}
            <div ref={modelRef} className="relative">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Model</label>
              <button
                onClick={() => provider && setModelOpen(!modelOpen)}
                disabled={!provider}
                className="w-full flex items-center justify-between gap-2 border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white hover:border-[#00685F]/50 focus:outline-none focus:ring-2 focus:ring-[#00685F]/20 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className={model ? "text-slate-900 font-semibold" : "text-slate-400"}>
                  {model || (language === "id" ? "Pilih Model..." : "Select Model...")}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${modelOpen ? "rotate-180" : ""}`} />
              </button>

              {modelOpen && currentModels.length > 0 && (
                <div className="absolute z-30 mt-1.5 w-full bg-white border border-slate-100 rounded-2xl shadow-xl py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                  {currentModels.map((m) => (
                    <button
                      key={m}
                      onClick={() => { setModel(m); setModelOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${model === m ? "text-[#00685F] bg-teal-50 font-bold" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                      <span>{m}</span>
                      {model === m && <Check className="w-3.5 h-3.5 text-[#00685F]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* API Key Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">API Key</h4>
            {!maskedKey && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    if (text) setApiKey(text.trim());
                  } catch {}
                }}
                className="text-[11px] font-bold text-[#00685F] hover:underline cursor-pointer"
              >
                {language === "id" ? "Paste dari Clipboard" : "Paste from Clipboard"}
              </button>
            )}
          </div>

          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              name="custom_ai_api_key_field"
              id="custom_ai_api_key_field"
              autoComplete="new-password"
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
              data-form-type="other"
              value={apiKey !== "" ? apiKey : (maskedKey ? maskedKey : "")}
              onChange={(e) => {
                setApiKey(e.target.value);
              }}
              onFocus={() => {
                if (maskedKey && apiKey === "") {
                  // Keep as is, user can replace
                }
              }}
              placeholder={maskedKey ? maskedKey : (language === "id" ? "Paste atau ketik API key Anda di sini (sk-...)..." : "Paste or enter your API key here (sk-...)...")}
              readOnly={!showApiKey && !!maskedKey && apiKey === ""}
              className={`w-full border border-slate-200 rounded-xl px-4 py-3 text-sm pr-28 focus:outline-none focus:ring-2 focus:ring-[#00685F]/20 focus:border-[#00685F] transition font-mono ${!showApiKey && maskedKey && apiKey === "" ? "text-slate-400 bg-slate-50 cursor-pointer" : "bg-white text-slate-800"}`}
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {/* Toggle show/hide password visibility */}
              {(apiKey !== "" || showApiKey) && (
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  title={showApiKey ? (language === "id" ? "Sembunyikan" : "Hide") : (language === "id" ? "Tampilkan" : "Show")}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}

              {/* Reveal existing encrypted key */}
              {maskedKey && apiKey === "" && !showApiKey && (
                <button
                  type="button"
                  onClick={() => setShowRevealModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition cursor-pointer"
                  title={language === "id" ? "Tampilkan API key tersimpan (memerlukan password)" : "Reveal saved API key (requires password)"}
                >
                  <Lock className="w-3 h-3" />
                  Reveal
                </button>
              )}

              {/* Ganti key / Input key baru */}
              {maskedKey && apiKey === "" && (
                <button
                  type="button"
                  onClick={() => {
                    setApiKey("");
                    setShowApiKey(true);
                    setTimeout(() => {
                      document.getElementById("custom_ai_api_key_field")?.focus();
                    }, 50);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-extrabold text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                >
                  {language === "id" ? "Ganti" : "Change"}
                </button>
              )}

              {/* Reset back to masked key if user cancels edit */}
              {maskedKey && apiKey !== "" && (
                <button
                  type="button"
                  onClick={() => {
                    setApiKey("");
                    setShowApiKey(false);
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-[10px] font-extrabold text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  title={language === "id" ? "Batal ganti key" : "Cancel key change"}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-start gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#00685F]" />
            <span>
              {language === "id"
                ? "API key disimpan terenkripsi dan hanya digunakan untuk komunikasi langsung dengan provider AI pilihan Anda. Kami tidak pernah membaca atau menyimpan isi percakapan Anda."
                : "API keys are securely encrypted and only used for direct communication with your chosen AI provider. We never read or store your conversation data."}
            </span>
          </div>
        </div>

        {/* Test Connection */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            onClick={handleTestConnection}
            disabled={testStatus === "loading" || (!provider)}
            className="press-scale flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {testStatus === "loading"
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Plug className="w-3.5 h-3.5" />
            }
            <span>
              {testStatus === "loading"
                ? (language === "id" ? "Menghubungkan..." : "Connecting...")
                : (language === "id" ? "Test Koneksi" : "Test Connection")}
            </span>
          </button>

          {/* Status Badge */}
          {testStatus === "ok" && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              <span>{testMessage || (language === "id" ? "Koneksi berhasil!" : "Connected successfully!")}</span>
            </div>
          )}
          {testStatus === "error" && (
            <div className="flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl max-w-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="line-clamp-2">{testMessage || (language === "id" ? "Koneksi gagal." : "Connection failed.")}</span>
            </div>
          )}
          {testStatus === null && (
            <span className="text-xs text-slate-400 font-medium">
              ● {language === "id" ? "Belum diuji" : "Not tested"}
            </span>
          )}
        </div>

        {/* Save Button */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={handleSave}
            disabled={saving}
            className="press-scale w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#00685F] hover:bg-[#004D46] text-white font-bold text-sm rounded-2xl shadow-md shadow-[#00685F]/20 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Check className="w-4 h-4" />
            }
            <span>{saving ? (language === "id" ? "Menyimpan..." : "Saving...") : (language === "id" ? "Simpan Konfigurasi AI" : "Save AI Configuration")}</span>
          </button>
        </div>
      </div>

      {/* Reveal Key Modal */}
      {showRevealModal && (
        <RevealKeyModal
          onClose={() => setShowRevealModal(false)}
          onRevealed={handleRevealSuccess}
          language={language}
        />
      )}
    </>
  );
}
