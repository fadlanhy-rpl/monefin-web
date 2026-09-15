"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";

export default function HeaderProfileDropdown({
  user,
  profileOpen,
  setProfileOpen,
  onCloseOthers,
  logout,
}) {
  const router = useRouter();

  const userPhoto = user?.photo
    ? `/api/avatar/${user.photo}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=00685F&color=fff&size=64`;

  const userName = user?.name || "User";
  const userEmail = user?.email || "";

  const toggleDropdown = () => {
    setProfileOpen(!profileOpen);
    onCloseOthers();
  };

  return (
    <div className="relative pl-1.5 sm:pl-2 border-l border-slate-200/80 shrink-0">
      {/* Desktop Trigger */}
      <button
        onClick={toggleDropdown}
        className="hidden md:flex items-center gap-1.5 sm:gap-2 hover:bg-white rounded-lg pr-1.5 sm:pr-2 py-1 transition-colors border border-transparent hover:border-slate-100/50 cursor-pointer"
        aria-expanded={profileOpen}
      >
        <Image
          src={userPhoto}
          alt={`Foto profil ${userName}`}
          width={32}
          height={32}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shrink-0"
        />
        <span className="text-xs font-bold text-slate-700 max-w-[90px] lg:max-w-[120px] truncate">{userName}</span>
        <svg className={`w-3 h-3 text-slate-400 transition-transform shrink-0 ${profileOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Mobile Trigger */}
      <button
        onClick={toggleDropdown}
        className="md:hidden flex items-center pl-1 cursor-pointer"
        aria-label="Profil"
      >
        <Image
          src={userPhoto}
          alt={`Foto profil ${userName}`}
          width={28}
          height={28}
          className="w-7 h-7 rounded-full object-cover"
        />
      </button>

      {profileOpen && (
        <div className="dropdown-pop absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-40">
          <div className="px-4 py-3.5 bg-slate-50/50 border-b border-slate-100">
            <p className="text-sm font-bold text-slate-800">{userName}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{userEmail}</p>
          </div>
          <button
            onClick={() => { router.push("/settings"); setProfileOpen(false); }}
            className="profile-action w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-slate-600 hover:bg-brand-50 hover:text-brand-700 transition-colors cursor-pointer"
          >
            <User className="w-4 h-4 text-slate-400" />
            My Profile
          </button>
          <button
            onClick={() => { setProfileOpen(false); logout(); }}
            className="profile-action w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors border-t border-slate-50 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
