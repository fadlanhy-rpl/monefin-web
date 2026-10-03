import { 
  CheckCircle2,
  GripHorizontal
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import SortableAccountCard from "./SortableAccountCard";
import AccountsEmptyState from "./AccountsEmptyState";

export default function AccountsGrid({
  accounts = [],
  openEditModal,
  handleDelete,
  onReorder,
  openAddModal,
  isFiltered = false,
  searchQuery = "",
  onResetSearch,
}) {
  const { t, language } = useLanguage();
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [activeDragId, setActiveDragId] = useState(null);

  // Mouse sensor for desktop and Touch sensor for mobile/touchscreens
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms press-and-hold to disambiguate drag from normal scroll
        tolerance: 6, // 6px movement tolerance during press-and-hold
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text.replace("xxxx", "1234")); // Mock full copy
    setCopiedId(id);
    setToastMessage(language === 'en' ? "Account number copied successfully!" : "Nomor rekening berhasil disalin!");
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleDragStart = (event) => {
    setActiveDragId(event.active.id);
    if (typeof window !== "undefined" && typeof navigator !== "undefined" && navigator?.vibrate) {
      try {
        navigator.vibrate(40); // Subtle 40ms haptic tick on pickup
      } catch (_) {}
    }
  };

  const handleDragEnd = (event) => {
    setActiveDragId(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = accounts.findIndex((acc) => acc.id === active.id);
      const newIndex = accounts.findIndex((acc) => acc.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newAccounts = arrayMove(accounts, oldIndex, newIndex);
        if (onReorder) {
          onReorder(newAccounts);
        }
      }
    }
  };

  const handleDragCancel = () => {
    setActiveDragId(null);
  };

  if (!accounts || accounts.length === 0) {
    return (
      <AccountsEmptyState
        isFiltered={isFiltered}
        searchQuery={searchQuery}
        onResetSearch={onResetSearch}
        onAddAccount={(type) => openAddModal(typeof type === "string" ? type : "bank")}
      />
    );
  }

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] md:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-5 duration-300 z-[60] border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Mobile Touch Reorder Hint (Signifier for direct manipulation) */}
      <div className="flex sm:hidden items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium mb-3 select-none">
        <GripHorizontal className="w-3.5 h-3.5 text-slate-400" />
        <span>{language === 'en' ? 'Tip: Press & hold grip handle to reorder cards' : 'Tip: Tekan & tahan ikon titik untuk menggeser kartu'}</span>
      </div>

      {/* Grid container with DnD context */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
          <SortableContext 
            items={accounts.map(a => a.id)}
            strategy={rectSortingStrategy}
          >
            {accounts.map((acc, index) => (
              <SortableAccountCard 
                key={acc.id}
                acc={acc}
                index={index}
                openEditModal={openEditModal}
                handleDelete={handleDelete}
                toggleMenu={toggleMenu}
                activeMenuId={activeMenuId}
                handleCopy={handleCopy}
                copiedId={copiedId}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}
