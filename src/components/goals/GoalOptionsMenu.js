"use client";

import { MoreHorizontal, Pin, Pencil, Trash2 } from "lucide-react";

/**
 * Modern floating options popover for goal cards
 */
export default function GoalOptionsMenu({
  goal,
  isOpen,
  onToggle,
  onEdit,
  onDelete,
  onTogglePin,
  language,
  t
}) {
  return (
    <div className="relative z-30">
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(goal.id);
        }}
        className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-all duration-200 cursor-pointer flex items-center justify-center"
        aria-label="Options"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop for click away */}
          <div 
            className="fixed inset-0 z-40 cursor-default" 
            onClick={(e) => {
              e.stopPropagation();
              onToggle(goal.id);
            }} 
          />
          
          {/* Modern Popover */}
          <div className="absolute right-0 mt-2 w-40 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/15 border border-slate-100/90 p-1.5 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5 select-none">
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(goal);
                onToggle(goal.id);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-amber-50 text-slate-700 hover:text-amber-700 flex items-center gap-2.5 transition-all duration-150 cursor-pointer group/btn"
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${goal.is_pinned ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500 group-hover/btn:bg-amber-100 group-hover/btn:text-amber-600"}`}>
                <Pin className={`w-3 h-3 rotate-45 ${goal.is_pinned ? "fill-amber-600" : ""}`} />
              </div>
              <span className="truncate">{language === 'en' ? (goal.is_pinned ? "Unpin Goal" : "Pin Goal") : (goal.is_pinned ? "Lepas Semat" : "Sematkan")}</span>
            </button>

            <div className="h-px bg-slate-100 my-1 mx-1" />

            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(goal);
                onToggle(goal.id);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50 text-slate-700 hover:text-[#00685F] flex items-center gap-2.5 transition-all duration-150 cursor-pointer group/btn"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover/btn:bg-emerald-100 flex items-center justify-center text-slate-500 group-hover/btn:text-[#00685F] transition-colors shrink-0">
                <Pencil className="w-3 h-3" />
              </div>
              <span className="truncate">{t("common.edit") || (language === 'en' ? "Edit" : "Ubah")}</span>
            </button>

            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(goal.id);
                onToggle(goal.id);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-rose-50 text-slate-700 hover:text-rose-600 flex items-center gap-2.5 transition-all duration-150 cursor-pointer group/btn"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover/btn:bg-rose-100 flex items-center justify-center text-slate-500 group-hover/btn:text-rose-600 transition-colors shrink-0">
                <Trash2 className="w-3 h-3" />
              </div>
              <span className="truncate">{t("common.delete") || (language === 'en' ? "Delete" : "Hapus")}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
