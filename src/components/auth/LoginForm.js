"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function LoginForm() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await login(email, password, rememberMe);

    if (result.success) {
      toast.success("Login berhasil! Selamat datang kembali.");
      router.push("/dashboard");
    } else if (result.requireVerification) {
      toast("Email belum diverifikasi. Silakan cek email Anda.", { icon: "📧" });
      router.push(`/verify-email?email=${encodeURIComponent(result.email)}`);
    } else {
      toast.error(result.error || "Login gagal. Periksa email dan password Anda.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full lg:w-[45%] h-screen overflow-y-auto flex flex-col justify-between p-6 xl:p-8 bg-white">
      
      <div className="hidden lg:block h-2"></div>
      
      <div className="w-full max-w-[360px] mx-auto my-auto space-y-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#00685F] transition-colors group mb-2"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Beranda</span>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h1>
          <p className="text-gray-400 mt-2 text-sm">Manage your finances effortlessly</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
            <div className="relative mt-1.5 group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-300 group-focus-within:text-[#00685F] transition-colors">
                <Mail className="w-5 h-5" />
              </span>
              <input 
                type="email" 
                placeholder="name@company.com" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
            <div className="relative mt-1.5 group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-300 group-focus-within:text-[#00685F] transition-colors">
                <Lock className="w-5 h-5" />
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-gray-400 hover:text-[#00685F] hover:bg-gray-100/70 transition-all outline-none focus:outline-none focus:ring-0 border-none select-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-[#00685F]" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-200 text-[#00685F] focus:ring-[#00685F]"
              />
              <span className="text-xs font-semibold text-gray-500">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-xs font-bold text-[#00685F] hover:underline">Forgot Password?</Link>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#00685F] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#004D46] transition-all shadow-lg shadow-[#00685F]/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                Signing in...
              </>
            ) : (
              <>Sign In to MoneFin <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink mx-4 text-gray-300 text-[10px] font-black uppercase tracking-widest">or continue with</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        <a
          href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/auth/google`}
          className="w-full border border-gray-100 py-3.5 rounded-2xl font-bold text-gray-600 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          <span className="text-sm">Google</span>
        </a>

        <p className="text-center text-sm font-medium text-gray-400">
          Don&apos;t have an account? 
          <Link href="/register" className="text-[#00685F] font-bold hover:underline ml-1">Sign Up</Link>
        </p>
      </div>

      {/* Footer Links */}
      <div className="w-full flex flex-col sm:flex-row justify-center lg:justify-between items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-6 border-t border-gray-50 lg:border-t-0">
        <p>© 2024 MoneFin</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#00685F] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#00685F] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#00685F] transition-colors">Security</a>
        </div>
      </div>
    </div>
  );
}
