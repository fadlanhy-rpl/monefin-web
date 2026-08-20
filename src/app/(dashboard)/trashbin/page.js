"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { getTrash, restoreTrash, forceDeleteTrash } from "../../../services/trash.service";
import { useLanguage } from "../../../context/LanguageContext";
import { formatCurrency, formatDate } from "../../../lib/utils";
import toast from "react-hot-toast";
import { Trash2, RotateCcw, AlertTriangle, X } from "lucide-react";
import ConfirmModal from "../../../components/ui/ConfirmModal";

export default function TrashbinPage() {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  
  // Data states
  const [trashData, setTrashData] = useState({
    accounts: [],
    transactions: [],
    categories: [],
    goals: [],
    budgets: [],
  });

  // Modal states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'restore' | 'force_delete', itemType: string, id: number }
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetchTrashData();
  }, []);

  const fetchTrashData = async () => {
    setIsLoading(true);
    try {
      const res = await getTrash();
      if (res && res.data) {
        setTrashData(res.data);
      }
    } catch (error) {
      toast.error(language === 'en' ? "Failed to load trash data" : "Gagal memuat data tempat sampah");
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (type, itemType, id) => {
    setConfirmAction({ type, itemType, id });
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    const { type, itemType, id } = confirmAction;
    setIsProcessing(true);

    try {
      if (type === 'restore') {
        await restoreTrash(itemType, id);
        toast.success(language === 'en' ? "Item successfully restored" : "Item berhasil dipulihkan");
      } else if (type === 'force_delete') {
        await forceDeleteTrash(itemType, id);
        toast.success(language === 'en' ? "Item permanently deleted" : "Item berhasil dihapus permanen");
      }
      // Refresh data
      fetchTrashData();
    } catch (error) {
      toast.error(error.message || (language === 'en' ? "An error occurred" : "Terjadi kesalahan"));
    } finally {
      setIsProcessing(false);
      setIsConfirmOpen(false);
      setConfirmAction(null);
    }
  };

  const tabs = [
    { id: "all", label: language === 'en' ? "All Items" : "Semua" },
    { id: "transactions", label: language === 'en' ? "Transactions" : "Transaksi" },
    { id: "accounts", label: language === 'en' ? "Accounts" : "Rekening" },
    { id: "goals", label: language === 'en' ? "Goals" : "Target" },
    { id: "budgets", label: language === 'en' ? "Budgets" : "Anggaran" },
    { id: "categories", label: language === 'en' ? "Categories" : "Kategori" },
  ];

  // Helper to flatten and filter items based on activeTab
  const getFilteredItems = () => {
    let items = [];
    
    const mapItem = (type, item) => ({
      ...item,
      _type: type,
      _title: getTitleForItem(type, item),
      _subtitle: getSubtitleForItem(type, item),
      _amount: getAmountForItem(type, item),
      _date: item.deleted_at,
    });

    if (activeTab === "all" || activeTab === "transactions") items.push(...trashData.transactions.map(i => mapItem('transaction', i)));
    if (activeTab === "all" || activeTab === "accounts") items.push(...trashData.accounts.map(i => mapItem('account', i)));
    if (activeTab === "all" || activeTab === "goals") items.push(...trashData.goals.map(i => mapItem('goal', i)));
    if (activeTab === "all" || activeTab === "budgets") items.push(...trashData.budgets.map(i => mapItem('budget', i)));
    if (activeTab === "all" || activeTab === "categories") items.push(...trashData.categories.map(i => mapItem('category', i)));

    // Sort by deleted_at descending
    return items.sort((a, b) => new Date(b._date) - new Date(a._date));
  };

  const getTitleForItem = (type, item) => {
    switch (type) {
      case 'transaction': return item.description || (language === 'en' ? 'No Note' : 'Tanpa Catatan');
      case 'account': return item.name;
      case 'goal': return item.name;
      case 'budget': return item.category?.name || 'Budget';
      case 'category': return item.name;
      default: return 'Item';
    }
  };

  const getSubtitleForItem = (type, item) => {
    switch (type) {
      case 'transaction': return item.category?.name || 'Transaction';
      case 'account': return item.account_type || 'Account';
      case 'goal': return 'Goal';
      case 'budget': return 'Budget';
      case 'category': return item.type || 'Category';
      default: return '';
    }
  };

  const getAmountForItem = (type, item) => {
    switch (type) {
      case 'transaction': return { amount: item.amount, isExpense: item.type === 'expense' };
      case 'account': return { amount: item.balance, isExpense: false };
      case 'goal': return { amount: item.current_amount, isExpense: false };
      case 'budget': return { amount: item.limit_amount, isExpense: false };
      case 'category': return null;
      default: return null;
    }
  };

  const filteredItems = getFilteredItems();

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 min-w-0 pb-10">
        
        {/* Header Section */}
        <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3`}>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {language === 'en' ? 'Trashbin' : 'Tempat Sampah'}
              </h1>
              <Trash2 className="w-5 h-5 text-red-500 hidden sm:block" />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
              {language === 'en' ? 'Restore or permanently delete your items' : 'Pulihkan atau hapus permanen data Anda'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className={`transition-all duration-700 delay-75 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex overflow-x-auto hide-scrollbar gap-2 pb-2`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/20"
                  : "bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-slate-200/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List Section */}
        <div className={`transition-all duration-700 delay-150 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400">Loading...</div>
            ) : filteredItems.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">
                  {language === 'en' ? 'Trash is empty' : 'Tempat sampah kosong'}
                </h3>
                <p className="text-sm text-slate-400">
                  {language === 'en' ? 'Deleted items will appear here.' : 'Item yang dihapus akan muncul di sini.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredItems.map((item, index) => (
                  <div key={`${item._type}-${item.id}`} className="p-4 sm:p-5 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex w-10 h-10 rounded-xl bg-slate-100 items-center justify-center text-slate-400">
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            {item._type}
                          </span>
                          <h4 className="font-bold text-slate-800 line-clamp-1">{item._title}</h4>
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {item._subtitle} • Deleted: {formatDate(item._date.split('T')[0])}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                      {item._amount !== null && (
                        <div className={`font-bold text-sm sm:text-base ${item._amount.isExpense ? 'text-red-500' : 'text-slate-800'}`}>
                          {item._amount.isExpense ? '-' : ''}{formatCurrency(item._amount.amount)}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleActionClick('restore', item._type, item.id)}
                          className="p-2 text-[#00685F] hover:bg-[#00685F]/10 rounded-lg transition"
                          title="Restore"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleActionClick('force_delete', item._type, item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete Permanently"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title={confirmAction?.type === 'restore' ? (language === 'en' ? 'Restore Item?' : 'Pulihkan Item?') : (language === 'en' ? 'Delete Permanently?' : 'Hapus Permanen?')}
        message={confirmAction?.type === 'restore' 
          ? (language === 'en' ? 'This item will be restored and visible in the app again.' : 'Item ini akan dikembalikan dan muncul lagi di aplikasi.') 
          : (language === 'en' ? 'This item will be permanently deleted and cannot be recovered. Are you sure?' : 'Item ini akan dihapus secara permanen dan tidak bisa dikembalikan. Anda yakin?')}
        onConfirm={handleConfirm}
        onCancel={() => setIsConfirmOpen(false)}
        confirmText={confirmAction?.type === 'restore' ? 'Restore' : 'Delete'}
        isDestructive={confirmAction?.type === 'force_delete'}
        isLoading={isProcessing}
      />
    </DashboardLayout>
  );
}
