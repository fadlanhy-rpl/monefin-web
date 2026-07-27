"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import CategoriesHeader from "../../../components/categories/CategoriesHeader";
import CategoriesTabs from "../../../components/categories/CategoriesTabs";
import CategoriesGrid from "../../../components/categories/CategoriesGrid";
import CategoriesStats from "../../../components/categories/CategoriesStats";
import CategoryModal from "../../../components/categories/CategoryModal";
import { CheckCircle2 } from "lucide-react";

export default function CategoriesPage() {
  const [isVisible, setIsVisible] = useState(false);

  // Categories list state (pre-populated with mock data from categories.html)
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Makanan & Minuman",
      description: "Restoran, kafe, dan bahan makanan bulanan.",
      transactions: 42,
      realization: 75,
      type: "expense",
      icon: "utensils",
      color: "orange"
    },
    {
      id: 2,
      name: "Transportasi",
      description: "Bahan bakar, parkir, dan transportasi umum.",
      transactions: 18,
      realization: 30,
      type: "expense",
      icon: "car",
      color: "blue"
    },
    {
      id: 3,
      name: "Belanja",
      description: "Pakaian, hobi, dan kebutuhan gaya hidup.",
      transactions: 24,
      realization: 92,
      type: "expense",
      icon: "shopping",
      color: "purple"
    },
    {
      id: 4,
      name: "Hiburan",
      description: "Film, konser, dan langganan digital.",
      transactions: 12,
      realization: 45,
      type: "expense",
      icon: "film",
      color: "pink"
    },
    {
      id: 5,
      name: "Kesehatan",
      description: "Obat-obatan, dokter, dan asuransi.",
      transactions: 5,
      realization: 15,
      type: "expense",
      icon: "medical",
      color: "emerald"
    },
    {
      id: 6,
      name: "Rumah Tangga",
      description: "Listrik, air, dan pemeliharaan rumah.",
      transactions: 31,
      realization: 62,
      type: "expense",
      icon: "home",
      color: "teal"
    },
    {
      id: 7,
      name: "Pendidikan",
      description: "Kursus online, buku, dan biaya sekolah.",
      transactions: 8,
      realization: 50,
      type: "expense",
      icon: "graduation",
      color: "amber"
    },
    // Income Categories
    {
      id: 101,
      name: "Gaji Utama",
      description: "Gaji bulanan dari pekerjaan tetap.",
      transactions: 1,
      realization: 100,
      type: "income",
      icon: "briefcase",
      color: "primary"
    },
    {
      id: 102,
      name: "Freelance",
      description: "Proyek sampingan dan pekerjaan lepas.",
      transactions: 3,
      realization: 60,
      type: "income",
      icon: "dollar",
      color: "emerald"
    },
    {
      id: 103,
      name: "Investasi",
      description: "Dividen saham, bunga reksa dana, dll.",
      transactions: 2,
      realization: 40,
      type: "income",
      icon: "trending",
      color: "orange"
    }
  ]);

  // Tab State: "expense" | "income"
  const [activeTab, setActiveTab] = useState("expense");

  // Filtered Categories based on current tab
  const filteredCategories = categories.filter((c) => c.type === activeTab);

  // Toast State
  const [toastMessage, setToastMessage] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingCategory, setEditingCategory] = useState(null);

  // Form States
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formRealization, setFormRealization] = useState(0);
  const [formTransactions, setFormTransactions] = useState(0);
  const [formType, setFormType] = useState("expense");
  const [formIcon, setFormIcon] = useState("utensils");
  const [formColor, setFormColor] = useState("primary");

  // Entrance animations
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  // Open modal in Create mode
  const openAddModal = () => {
    setModalMode("add");
    setEditingCategory(null);
    setFormName("");
    setFormDescription("");
    setFormRealization(0);
    setFormTransactions(0);
    setFormType(activeTab); // match current tab
    setFormIcon("utensils");
    setFormColor("primary");
    setIsModalOpen(true);
  };

  // Open modal in Edit mode
  const openEditModal = (cat) => {
    setModalMode("edit");
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormDescription(cat.description);
    setFormRealization(cat.realization);
    setFormTransactions(cat.transactions);
    setFormType(cat.type);
    setFormIcon(cat.icon);
    setFormColor(cat.color);
    setIsModalOpen(true);
  };

  // Delete Category
  const handleDelete = (id) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;
    if (confirm(`Apakah Anda yakin ingin menghapus kategori "${target.name}"?`)) {
      setCategories(categories.filter((c) => c.id !== id));
      showToast(`Kategori "${target.name}" berhasil dihapus.`);
    }
  };

  // Handle Form Submit (Add/Edit)
  const handleFormSubmit = () => {
    if (!formName.trim()) return;

    if (modalMode === "add") {
      const newCategory = {
        id: Date.now(),
        name: formName,
        description: formDescription,
        transactions: formTransactions,
        realization: formRealization,
        type: formType,
        icon: formIcon,
        color: formColor
      };
      setCategories([...categories, newCategory]);
      setActiveTab(formType); // Switch to the tab of the newly created category
      showToast(`Kategori "${formName}" berhasil ditambahkan.`);
    } else if (modalMode === "edit" && editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: formName,
                description: formDescription,
                transactions: formTransactions,
                realization: formRealization,
                type: formType,
                icon: formIcon,
                color: formColor
              }
            : c
        )
      );
      setActiveTab(formType);
      showToast(`Kategori "${formName}" berhasil diperbarui.`);
    }
    setIsModalOpen(false);
  };

  // Count active categories (categories that have at least 1 transaction)
  const activeCategoriesCount = categories.filter((c) => c.transactions > 0).length;

  return (
    <DashboardLayout>
      <div className="space-y-8 min-w-0">
        
        {/* Header Title Section */}
        <CategoriesHeader 
          isVisible={isVisible}
          openAddModal={openAddModal}
        />

        {/* Tab Switcher */}
        <div className={`transition-all duration-700 delay-100 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <CategoriesTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Grid Category Cards */}
        <div className={`transition-all duration-700 delay-200 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <CategoriesGrid 
            categories={filteredCategories}
            openEditModal={openEditModal}
            handleDelete={handleDelete}
            openAddModal={openAddModal}
          />
        </div>

        {/* Dynamic Analytics & Statistics Section */}
        <div className={`transition-all duration-700 delay-400 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <CategoriesStats 
            totalCategories={categories.length}
            activeCategoriesCount={activeCategoriesCount}
            onViewReportClick={() => showToast("Membuka laporan analisis mingguan...")}
          />
        </div>

      </div>

      {/* Dynamic Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-5 duration-300 z-50 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Category Modal (Add / Edit) */}
      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        modalMode={modalMode}
        formName={formName}
        setFormName={setFormName}
        formDescription={formDescription}
        setFormDescription={setFormDescription}
        formRealization={formRealization}
        setFormRealization={setFormRealization}
        formTransactions={formTransactions}
        setFormTransactions={setFormTransactions}
        formType={formType}
        setFormType={setFormType}
        formIcon={formIcon}
        setFormIcon={setFormIcon}
        formColor={formColor}
        setFormColor={setFormColor}
      />

    </DashboardLayout>
  );
}
