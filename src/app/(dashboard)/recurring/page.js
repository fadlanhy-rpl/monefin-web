"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { Plus, Edit2, Trash2, Calendar, RefreshCcw, Search, MoreVertical } from "lucide-react";
import RecurringModal from "../../../components/recurring/RecurringModal";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { 
  getRecurringSettings, 
  createRecurringSetting, 
  updateRecurringSetting, 
  deleteRecurringSetting 
} from "../../../services/recurring.service";
import { getAccounts } from "../../../services/account.service";
import { getCategories } from "../../../services/category.service";
import { notifySuccess, notifyError } from "../../../lib/notify";
import { useCurrency } from "../../../hooks/useCurrency";
import { useLanguage } from "../../../context/LanguageContext";

export default function RecurringPage() {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [settings, setSettings] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  
  const initialFormState = {
    title: "",
    type: "expense",
    amount: "",
    period_type: "monthly",
    account_id: "",
    category_id: "",
  };
  
  const [formState, setFormState] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [settingsRes, accountsRes, categoriesRes] = await Promise.all([
        getRecurringSettings(),
        getAccounts(),
        getCategories() // Fetches all categories
      ]);
      setSettings(settingsRes.data || []);
      setAccounts(accountsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      if (error?.status !== 401) {
        notifyError("Gagal memuat data transaksi rutin.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setFormState({
      ...initialFormState,
      account_id: accounts.length > 0 ? accounts[0].id : "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode("edit");
    setEditingId(item.id);
    setFormState({
      title: item.title || "",
      type: item.type || "expense",
      amount: String(Math.floor(item.amount || 0)),
      period_type: item.period_type || "monthly",
      account_id: item.account_id || "",
      category_id: item.category_id || "",
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formState.account_id || !formState.category_id || !formState.amount || !formState.title) {
        notifyError("Semua field wajib diisi!");
        return;
      }

      if (modalMode === "add") {
        await createRecurringSetting(formState);
        notifySuccess("Transaksi rutin berhasil ditambahkan.");
      } else {
        await updateRecurringSetting(editingId, formState);
        notifySuccess("Transaksi rutin berhasil diperbarui.");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      notifyError(error.message || "Gagal menyimpan transaksi rutin.");
    }
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteRecurringSetting(deletingId);
      notifySuccess("Transaksi rutin berhasil dihapus.");
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      notifyError("Gagal menghapus transaksi rutin.");
    } finally {
      setIsDeleting(false);
    }
  };

  const periodLabels = {
    'daily': 'Harian',
    'weekly': 'Mingguan',
    'monthly': 'Bulanan',
    'yearly': 'Tahunan'
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 min-w-0 pb-10 max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Transaksi Rutin</h1>
              <RefreshCcw className="w-6 h-6 text-brand-600 hidden sm:block" />
            </div>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Catat pemasukan dan pengeluaran secara otomatis sesuai jadwal.
            </p>
          </div>
          
          <button
            onClick={openAddModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/30 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Baru</span>
          </button>
        </div>

        {/* Content Section */}
        <div className={`transition-all duration-700 delay-100 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 space-y-4">
              <RefreshCcw className="w-8 h-8 animate-spin text-brand-500" />
              <p className="text-sm font-medium">Memuat data...</p>
            </div>
          ) : settings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center text-brand-500 mb-2">
                <RefreshCcw className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Belum Ada Transaksi Rutin</h3>
                <p className="text-slate-500 mt-1 max-w-sm text-sm">
                  Tambahkan jadwal transaksi rutin agar sistem dapat mencatatnya secara otomatis untuk Anda.
                </p>
              </div>
              <button
                onClick={openAddModal}
                className="mt-4 px-6 py-2.5 bg-slate-100 text-brand-700 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
              >
                Buat Jadwal Pertama
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {settings.map((item) => {
                const category = categories.find(c => String(c.id) === String(item.category_id));
                const account = accounts.find(a => String(a.id) === String(item.account_id));
                const isIncome = item.type === 'income';

                return (
                  <div key={item.id} className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button 
                        onClick={() => openEditModal(item)}
                        className="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center hover:bg-brand-50 hover:text-brand-600 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(item.id)}
                        className="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {isIncome ? <Plus className="w-6 h-6" /> : <RefreshCcw className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0 pr-16">
                        <h3 className="font-bold text-slate-800 text-base truncate" title={item.title}>
                          {item.title}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 truncate mt-0.5">
                          {category?.name || "Tanpa Kategori"} • {account?.name || "Tanpa Akun"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Jadwal</p>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg w-max">
                          <Calendar className="w-3.5 h-3.5" />
                          {periodLabels[item.period_type] || item.period_type}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Nominal</p>
                        <p className={`font-black text-base ${isIncome ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {isIncome ? '+' : ''}{formatCurrency(item.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <RecurringModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalMode={modalMode}
        handleFormSubmit={handleFormSubmit}
        formState={formState}
        setFormState={setFormState}
        categories={categories}
        accounts={accounts}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingId(null);
        }}
        onConfirm={confirmDelete}
        title="Hapus Transaksi Rutin?"
        message="Transaksi ini tidak akan dicatat secara otomatis lagi. Apakah Anda yakin?"
        confirmText="Ya, Hapus"
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}
