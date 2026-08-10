import toast from "react-hot-toast";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export const notifySuccess = (message) => {
  toast.custom((t) => (
    <div
      className="bg-white/95 backdrop-blur-md border border-emerald-500/20 text-slate-900 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm min-w-[280px]"
    >
      <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <span>{message}</span>
    </div>
  ));
};

export const notifyError = (message) => {
  toast.custom((t) => (
    <div
      className="bg-white/95 backdrop-blur-md border border-rose-500/20 text-slate-900 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm min-w-[280px]"
    >
      <div className="w-9 h-9 rounded-xl bg-rose-100/80 text-rose-600 flex items-center justify-center flex-shrink-0">
        <AlertCircle className="w-5 h-5" />
      </div>
      <span>{message}</span>
    </div>
  ));
};

export const notifyInfo = (message) => {
  toast.custom((t) => (
    <div
      className="bg-white/95 backdrop-blur-md border border-sky-500/20 text-slate-900 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm min-w-[280px]"
    >
      <div className="w-9 h-9 rounded-xl bg-sky-100/80 text-sky-600 flex items-center justify-center flex-shrink-0">
        <Info className="w-5 h-5" />
      </div>
      <span>{message}</span>
    </div>
  ));
};
