"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import AccountsHeader from "../../../components/accounts/AccountsHeader";
import AccountsGrid from "../../../components/accounts/AccountsGrid";
import AccountsStats from "../../../components/accounts/AccountsStats";
import AccountModal from "../../../components/accounts/AccountModal";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { Search, X } from "lucide-react";
import { getAccounts, createAccount, updateAccount, deleteAccount, reorderAccounts } from "../../../services/account.service";
import toast from "react-hot-toast";
import { useLanguage } from "../../../context/LanguageContext";

function AccountsPageContent() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");

  // Accounts state-based data store
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync with searchParams
  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null && q !== undefined) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Filtered accounts based on search
  const filteredAccounts = !searchQuery.trim()
    ? accounts
    : accounts.filter(a => 
        a.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.account_holder?.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Modal & Confirm states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingAccount, setEditingAccount] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form states
  const [formName, setFormName] = useState("");
  const [formBalance, setFormBalance] = useState("");
  const [formNumber, setFormNumber] = useState("");
  const [formHolder, setFormHolder] = useState("");
  const [formType, setFormType] = useState("bank");
  const [formTheme, setFormTheme] = useState("bank-primary");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await getAccounts();
      setAccounts(response.data || []);
    } catch (error) {
      if (error?.status !== 401) {
        console.error("Failed to fetch accounts:", error.message || error);
        toast.error(language === 'en' ? "Failed to fetch accounts data" : "Gagal mengambil data akun");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsVisible(true);
    fetchAccounts();
  }, []);

  // Calculation summaries
  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  // Statistics calculation
  const bankBalance = accounts.reduce((sum, a) => a.type === "bank" ? sum + Number(a.balance) : sum, 0);
  const ewalletBalance = accounts.reduce((sum, a) => a.type === "ewallet" ? sum + Number(a.balance) : sum, 0);
  const cashBalance = accounts.reduce((sum, a) => a.type === "cash" ? sum + Number(a.balance) : sum, 0);

  const bankPercent = totalBalance > 0 ? ((bankBalance / totalBalance) * 100).toFixed(1) : "0.0";
  const ewalletPercent = totalBalance > 0 ? ((ewalletBalance / totalBalance) * 100).toFixed(1) : "0.0";
  const cashPercent = totalBalance > 0 ? ((cashBalance / totalBalance) * 100).toFixed(1) : "0.0";

  // Trigger add modal
  const openAddModal = () => {
    setModalMode("add");
    setEditingAccount(null);
    setFormName("");
    setFormBalance("");
    setFormNumber("");
    setFormHolder("");
    setFormType("bank");
    setFormTheme("bank-primary");
    setIsModalOpen(true);
  };

  // Trigger edit modal
  const openEditModal = (acc) => {
    setModalMode("edit");
    setEditingAccount(acc);
    setFormName(acc.name);
    setFormBalance(String(acc.balance));
    setFormNumber(acc.account_number || "");
    setFormHolder(acc.account_holder || "");
    setFormType(acc.type);
    setFormTheme(acc.color_theme || "bank-primary");
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await deleteAccount(deletingId);
      toast.success(language === 'en' ? "Account deleted successfully" : "Akun berhasil dihapus");
      fetchAccounts();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(language === 'en' ? "Failed to delete account" : "Gagal menghapus akun");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setDeletingId(null);
    }
  };

  // Handle Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const balanceVal = parseFloat(formBalance);

    if (isNaN(balanceVal) || balanceVal < 0) {
      toast.error(language === 'en' ? "Balance must be a positive number!" : "Saldo harus berupa angka positif!");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: formName,
      type: formType,
      balance: balanceVal,
      account_number: formNumber,
      account_holder: formHolder,
      color_theme: formTheme,
    };

    try {
      if (modalMode === "add") {
        await createAccount(payload);
        toast.success(language === 'en' ? "Account added successfully" : "Akun berhasil ditambahkan");
      } else {
        await updateAccount(editingAccount.id, payload);
        toast.success(language === 'en' ? "Account updated successfully" : "Akun berhasil diperbarui");
      }
      setIsModalOpen(false);
      fetchAccounts();
    } catch (error) {
      console.error("Error saving account:", error);
      toast.error(language === 'en' ? "Failed to save account" : "Gagal menyimpan akun");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Drag & Drop Reorder
  const handleReorder = async (newAccounts) => {
    // Optimistic update
    setAccounts(newAccounts);

    const payload = newAccounts.map((acc, index) => ({
      id: acc.id,
      sort_order: index,
    }));

    try {
      await reorderAccounts(payload);
    } catch (error) {
      console.error("Failed to reorder accounts:", error);
      toast.error(language === 'en' ? "Failed to save card order" : "Gagal menyimpan urutan kartu");
      fetchAccounts(); // Revert back
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header Section */}
        <AccountsHeader 
          isVisible={isVisible}
          totalBalance={totalBalance}
          openAddModal={openAddModal}
        />

        {/* Active Search Banner */}
        {searchQuery && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-brand-50/70 border border-brand-200/80 px-4 py-3 rounded-2xl text-xs text-brand-900 shadow-xs animate-fadeIn">
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="truncate">
                {language === 'en' ? 'Showing search result for:' : 'Menampilkan hasil pencarian untuk:'}{' '}
                <span className="font-bold text-slate-900">"{searchQuery}"</span>
              </span>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                router.replace("/accounts");
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-brand-100/60 text-brand-700 hover:text-brand-900 font-bold rounded-xl border border-brand-200 transition-all text-xs shrink-0 cursor-pointer shadow-xs active:scale-95"
            >
              <X className="w-3.5 h-3.5" />
              {language === 'en' ? 'Show All Accounts' : 'Tampilkan Semua Rekening'}
            </button>
          </div>
        )}

        {/* Grid Cards Section */}
        <div className={`transition-all duration-700 delay-300 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00685F]"></div>
            </div>
          ) : (
            <AccountsGrid 
              accounts={filteredAccounts}
              openEditModal={openEditModal}
              handleDelete={handleDeleteClick}
              onReorder={handleReorder}
            />
          )}
        </div>

        {/* Bottom Statistics and Saving Tip */}
        <div className={`transition-all duration-700 delay-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <AccountsStats 
            bankPercent={bankPercent}
            ewalletPercent={ewalletPercent}
            cashPercent={cashPercent}
          />
        </div>
      </div>

      {/* Account Modal (Add / Edit) */}
      <AccountModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalMode={modalMode}
        handleFormSubmit={handleFormSubmit}
        formName={formName}
        setFormName={setFormName}
        formBalance={formBalance}
        setFormBalance={setFormBalance}
        formNumber={formNumber}
        setFormNumber={setFormNumber}
        formHolder={formHolder}
        setFormHolder={setFormHolder}
        formType={formType}
        setFormType={setFormType}
        formTheme={formTheme}
        setFormTheme={setFormTheme}
        isSubmitting={isSubmitting}
      />

      {/* Modern Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t("accounts.delete_title") || "Hapus Akun ini?"}
        message={t("accounts.delete_desc") || "Apakah Anda yakin ingin menghapus akun ini? Semua transaksi terkait akun ini tetap tersimpan tetapi sumber dana tidak dapat dipulihkan."}
        confirmText={language === 'en' ? "Yes, Delete" : "Ya, Hapus"}
        cancelText={language === 'en' ? "Cancel" : "Batal"}
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}

export default function AccountsPage() {
  return (
    <Suspense fallback={null}>
      <AccountsPageContent />
    </Suspense>
  );
}
