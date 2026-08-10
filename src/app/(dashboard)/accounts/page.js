"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import AccountsHeader from "../../../components/accounts/AccountsHeader";
import AccountsGrid from "../../../components/accounts/AccountsGrid";
import AccountsStats from "../../../components/accounts/AccountsStats";
import AccountModal from "../../../components/accounts/AccountModal";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { getAccounts, createAccount, updateAccount, deleteAccount, reorderAccounts } from "../../../services/account.service";
import toast from "react-hot-toast";

export default function AccountsPage() {
  const [isVisible, setIsVisible] = useState(false);

  // Accounts state-based data store
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      console.error("Failed to fetch accounts:", error);
      toast.error("Gagal mengambil data akun");
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
      toast.success("Akun berhasil dihapus");
      fetchAccounts();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Gagal menghapus akun");
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
      toast.error("Saldo harus berupa angka positif!");
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
        toast.success("Akun berhasil ditambahkan");
      } else {
        await updateAccount(editingAccount.id, payload);
        toast.success("Akun berhasil diperbarui");
      }
      setIsModalOpen(false);
      fetchAccounts();
    } catch (error) {
      console.error("Error saving account:", error);
      toast.error("Gagal menyimpan akun");
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
      toast.error("Gagal menyimpan urutan kartu");
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

        {/* Grid Cards Section */}
        <div className={`transition-all duration-700 delay-300 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00685F]"></div>
            </div>
          ) : (
            <AccountsGrid 
              accounts={accounts}
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
        title="Hapus Akun ini?"
        message="Apakah Anda yakin ingin menghapus akun ini? Semua transaksi terkait akun ini tetap tersimpan tetapi sumber dana tidak dapat dipulihkan."
        confirmText="Ya, Hapus"
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}
