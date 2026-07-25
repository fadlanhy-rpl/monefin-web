"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("Anda harus menyetujui Syarat dan Ketentuan!");
      return;
    }
    router.push("/login");
  };

  return (
    <div className="w-full lg:w-1/2 h-screen overflow-y-auto flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white">
      
      {/* Spacer */}
      <div className="hidden lg:block h-6"></div>
      
      <div className="w-full max-w-md mx-auto my-auto space-y-6 py-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-[21px] sm:text-3xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap">Create Your Account</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Full Name</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-[#00685F] transition-colors">
                <User className="w-5 h-5" />
              </span>
              <input 
                type="text" 
                placeholder="John Doe" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Email Address</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-[#00685F] transition-colors">
                <Mail className="w-5 h-5" />
              </span>
              <input 
                type="email" 
                placeholder="john@example.com" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-[#00685F] transition-colors">
                <Lock className="w-5 h-5" />
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                id="passwordInput" 
                placeholder="••••••••" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#00685F]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 font-medium ml-1">Must be at least 8 characters with a symbol.</p>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 py-2">
            <div className="flex items-center h-5">
              <input 
                id="terms" 
                type="checkbox" 
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-5 h-5 rounded-lg border-gray-200 text-[#00685F] focus:ring-[#00685F] transition-all cursor-pointer"
              />
            </div>
            <label htmlFor="terms" className="text-xs text-gray-500 leading-normal">
              I agree to the <a href="#" className="text-[#00685F] font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-[#00685F] font-bold hover:underline">Privacy Policy</a>.
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-[#00685F] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#004D46] transition-all shadow-xl shadow-[#00685F]/20 active:scale-95"
          >
            Create Account <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink mx-6 text-gray-400 text-[10px] font-black uppercase tracking-widest">or sign up with</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        {/* Google Button */}
        <button className="w-full border border-gray-100 py-4 rounded-2xl font-bold text-gray-700 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google Logo" />
          Google
        </button>

        {/* Bottom Link */}
        <p className="text-center text-sm font-medium text-gray-500">
          Already have an account? 
          <Link href="/login" className="text-[#00685F] font-bold hover:underline ml-1">Sign In</Link>
        </p>
      </div>

      {/* Footer Links */}
      <div className="w-full flex flex-col sm:flex-row justify-center lg:justify-between items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-6 border-t border-gray-50 lg:border-t-0">
        <p>© 2024 MoneFin Financial Services</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#00685F] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#00685F] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#00685F] transition-colors">Security</a>
        </div>
      </div>
    </div>
  );
}
