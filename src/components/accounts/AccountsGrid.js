import { 
  CheckCircle2 
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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

export default function AccountsGrid({
  accounts,
  openEditModal,
  handleDelete,
  onReorder
}) {
  const { t, language } = useLanguage();
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      }
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

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = accounts.findIndex((acc) => acc.id === active.id);
      const newIndex = accounts.findIndex((acc) => acc.id === over.id);
      
      const newAccounts = arrayMove(accounts, oldIndex, newIndex);
      if (onReorder) {
        onReorder(newAccounts);
      }
    }
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-5 duration-300 z-50 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Grid container with DnD context */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
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
