"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import AccountsHeader from "../../../components/accounts/AccountsHeader";
import AccountsGrid from "../../../components/accounts/AccountsGrid";
import AccountsStats from "../../../components/accounts/AccountsStats";
import AccountModal from "../../../components/accounts/AccountModal";

export default function AccountsPage() {
  const [isVisible, setIsVisible] = useState(false);

  // Accounts state-based data store
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      name: "Bank BCA",
      number: "xxxx 2376",
      balance: 8500000,
      holder: "AKHMAD MAARIZ",
      type: "bank-primary"
    },
    {
      id: 2,
      name: "Bank Mandiri",
      number: "xxxx 8891",
      balance: 5200000,
      status: "Active",
      type: "bank-dark"
    },
    {
      id: 3,
      name: "Digital Wallet",
      balance: 1050000,
      label: "E-Wallet",
      type: "wallet",
      wallets: ["GP", "OV"]
    },
    {
      id: 4,
      name: "Uang Tunai",
      balance: 500000,
      label: "Cash",
      type: "cash",
      lastUpdated: "Hari ini, 08:45"
    }
  ]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingAccount, setEditingAccount] = useState(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formBalance, setFormBalance] = useState("");
  const [formNumber, setFormNumber] = useState("");
  const [formHolder, setFormHolder] = useState("");
  const [formType, setFormType] = useState("bank-primary");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Calculation summaries
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Statistics calculation
  const bcaBalance = accounts.reduce((sum, a) => a.name.toLowerCase().includes("bca") ? sum + a.balance : sum, 0);
  const mandiriBalance = accounts.reduce((sum, a) => a.name.toLowerCase().includes("mandiri") ? sum + a.balance : sum, 0);
  const otherBalance = accounts.reduce((sum, a) => {
    if (!a.name.toLowerCase().includes("bca") && !a.name.toLowerCase().includes("mandiri")) {
      return sum + a.balance;
    }
    return sum;
  }, 0);

  const bcaPercent = totalBalance > 0 ? ((bcaBalance / totalBalance) * 100).toFixed(1) : "0.0";
  const mandiriPercent = totalBalance > 0 ? ((mandiriBalance / totalBalance) * 100).toFixed(1) : "0.0";
  const otherPercent = totalBalance > 0 ? ((otherBalance / totalBalance) * 100).toFixed(1) : "0.0";

  // Trigger add modal
  const openAddModal = () => {
    setModalMode("add");
    setEditingAccount(null);
    setFormName("");
    setFormBalance("");
    setFormNumber("");
    setFormHolder("");
    setFormType("bank-primary");
    setIsModalOpen(true);
  };

  // Trigger edit modal
  const openEditModal = (acc) => {
    setModalMode("edit");
    setEditingAccount(acc);
    setFormName(acc.name);
    setFormBalance(String(acc.balance));
    setFormNumber(acc.number || "");
    setFormHolder(acc.holder || "");
    setFormType(acc.type);
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus akun ini?")) {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  // Handle Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const balanceVal = parseInt(formBalance, 10);

    if (isNaN(balanceVal) || balanceVal < 0) {
      alert("Saldo harus berupa angka positif!");
      return;
    }

    if (modalMode === "add") {
      const newAcc = {
        id: Date.now(),
        name: formName,
        balance: balanceVal,
        type: formType,
        number: formNumber || "**** " + Math.floor(1000 + Math.random() * 9000),
        holder: formHolder || "AKHMAD MAARIZ",
        status: "Active",
        label: formType === "wallet" ? "E-Wallet" : "Cash",
        wallets: ["GP", "OV"],
        lastUpdated: "Hari ini, " + new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })
      };
      setAccounts(prev => [...prev, newAcc]);
    } else {
      setAccounts(prev => prev.map(a => a.id === editingAccount.id ? {
        ...a,
        name: formName,
        balance: balanceVal,
        type: formType,
        number: formNumber || a.number,
        holder: formHolder || a.holder
      } : a));
    }

    setIsModalOpen(false);
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
          <AccountsGrid 
            accounts={accounts}
            openEditModal={openEditModal}
            handleDelete={handleDelete}
          />
        </div>

        {/* Bottom Statistics and Saving Tip */}
        <div className={`transition-all duration-700 delay-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <AccountsStats 
            bcaPercent={bcaPercent}
            mandiriPercent={mandiriPercent}
            otherPercent={otherPercent}
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
      />
    </DashboardLayout>
  );
}
