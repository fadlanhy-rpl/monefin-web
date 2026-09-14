"use client";

import { useState, useEffect, useMemo } from "react";
import { Wallet, Tag } from "lucide-react";
import { createSplitBill, calculateSplitPreview } from "../../../services/split-bill.service";
import { getAccounts } from "../../../services/account.service";
import { getCategories } from "../../../services/category.service";
import { useLanguage } from "../../../context/LanguageContext";
import { useCurrency } from "../../../hooks/useCurrency";
import toast from "react-hot-toast";

export function useSplitBillWizard({ isOpen, onClose, onSuccess }) {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Form State
  const [title, setTitle] = useState("");
  const [description] = useState("");
  const [billDate, setBillDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [subtotal, setSubtotal] = useState("");
  const [taxPercent, setTaxPercent] = useState("");
  const [taxAmount] = useState("");
  const [servicePercent, setServicePercent] = useState("");
  const [serviceAmount] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [splitMode, setSplitMode] = useState("equal"); // equal, itemized, exact, percentage
  const [roundingMode, setRoundingMode] = useState("none"); // none, up_100, up_1000, down_100

  // Participants State with safe initial creator name
  const [participants, setParticipants] = useState(() => [
    { temp_id: "me", name: language === "en" ? "Me" : "Saya", phone_number: "", is_creator: true, amount_owed: 0, percentage: 50 },
    { temp_id: "p1", name: "", phone_number: "", is_creator: false, amount_owed: 0, percentage: 50 },
  ]);

  // Items State (for Itemized mode)
  const [items, setItems] = useState([
    { id: 1, name: "", price: "", quantity: 1, participant_ids: ["me"] }
  ]);

  // Payment & Auto-record State
  const [bankName, setBankName] = useState("BCA");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [recordMyExpense, setRecordMyExpense] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // Live preview result from calculation
  const [calcPreview, setCalcPreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      getAccounts().then((res) => {
        const accs = res.data || res || [];
        setAccounts(accs);
      }).catch((err) => {
        console.warn("Could not load accounts:", err?.message || err);
      });

      getCategories().then((res) => {
        const cats = res.data || res || [];
        setCategories(cats);
        if (cats.length > 0) setSelectedCategoryId(String(cats[0].id));
      }).catch((err) => {
        console.warn("Could not load categories:", err?.message || err);
      });
    }
  }, [isOpen]);

  // Total bill calculation computed
  const computedTotal = useMemo(() => {
    if (calcPreview) return calcPreview.total_amount;
    const sub = parseFloat(subtotal) || 0;
    const tPct = parseFloat(taxPercent) || 0;
    const sPct = parseFloat(servicePercent) || 0;
    const disc = parseFloat(discountAmount) || 0;
    const tAmt = sub * (tPct / 100);
    const sAmt = sub * (sPct / 100);
    return Math.max(0, sub + tAmt + sAmt - disc);
  }, [calcPreview, subtotal, taxPercent, servicePercent, discountAmount]);

  // Add Participant
  const addParticipant = () => {
    const newId = `p${participants.length + 1}`;
    const newCount = participants.length + 1;
    const equalPct = Math.round(100 / newCount);

    const updated = [
      ...participants.map(p => ({ ...p, percentage: equalPct })),
      { 
        temp_id: newId, 
        name: "", 
        phone_number: "", 
        is_creator: false, 
        amount_owed: 0,
        percentage: equalPct 
      }
    ];
    setParticipants(updated);
  };

  // Remove Participant
  const removeParticipant = (idx) => {
    if (participants.length <= 1) return;
    const removedId = participants[idx].temp_id;
    const updated = participants.filter((_, i) => i !== idx);
    
    // Rebalance percentage
    const equalPct = Math.round(100 / updated.length);
    setParticipants(updated.map(p => ({ ...p, percentage: equalPct })));

    // Remove from item assignments
    setItems(items.map(item => ({
      ...item,
      participant_ids: item.participant_ids.filter(id => id !== removedId)
    })));
  };

  // Quick Action: Split % Equally
  const handleSplitEqualPercentage = () => {
    const count = participants.length;
    if (count === 0) return;
    const basePct = Math.floor(100 / count);
    const remainder = 100 - (basePct * count);

    setParticipants(participants.map((p, idx) => ({
      ...p,
      percentage: idx === 0 ? basePct + remainder : basePct
    })));
    toast.success(language === "en" ? "Percentages split equally!" : "Persentase dibagi rata!");
  };

  // Quick Action: Split Exact Amount Baseline
  const handleSplitEqualExact = () => {
    const count = participants.length;
    if (count === 0) return;
    const baseShare = Math.floor(computedTotal / count);
    const remainder = computedTotal - (baseShare * count);

    setParticipants(participants.map((p, idx) => ({
      ...p,
      amount_owed: idx === 0 ? baseShare + remainder : baseShare
    })));
    toast.success(language === "en" ? "Amounts split equally!" : "Nominal dibagi rata!");
  };

  // Quick Action: Assign Remaining to Creator
  const handleAssignRestToMe = () => {
    const otherSum = participants.filter(p => !p.is_creator).reduce((sum, p) => sum + (parseFloat(p.amount_owed) || 0), 0);
    const remainder = Math.max(0, computedTotal - otherSum);

    setParticipants(participants.map(p => p.is_creator ? { ...p, amount_owed: remainder } : p));
    toast.success(language === "en" ? "Remaining amount assigned to you!" : "Sisa tagihan dialokasikan ke Anda!");
  };

  // Add Menu Item
  const addItem = () => {
    setItems([...items, { 
      id: Date.now(), 
      name: "", 
      price: "", 
      quantity: 1, 
      participant_ids: ["me"] 
    }]);
  };

  // Remove Menu Item
  const removeItem = (id) => {
    if (items.length <= 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  // Toggle item assignment for participant
  const toggleItemParticipant = (itemId, pId) => {
    setItems(items.map(item => {
      if (item.id !== itemId) return item;
      const exists = item.participant_ids.includes(pId);
      return {
        ...item,
        participant_ids: exists 
          ? item.participant_ids.filter(id => id !== pId)
          : [...item.participant_ids, pId]
      };
    }));
  };

  // Trigger preview calculation
  useEffect(() => {
    if (!isOpen) return;

    const payload = {
      subtotal: parseFloat(subtotal) || 0,
      tax_percent: parseFloat(taxPercent) || 0,
      tax_amount: parseFloat(taxAmount) || 0,
      service_percent: parseFloat(servicePercent) || 0,
      service_amount: parseFloat(serviceAmount) || 0,
      discount_amount: parseFloat(discountAmount) || 0,
      split_mode: splitMode,
      rounding_mode: roundingMode,
      participants: participants.map((p, idx) => ({
        name: p.name || (p.is_creator ? (language === "en" ? "Me" : "Saya") : `${language === "en" ? "Friend" : "Teman"} ${idx + 1}`),
        phone_number: p.phone_number,
        is_creator: p.is_creator,
        amount_owed: parseFloat(p.amount_owed) || 0,
        percentage: parseFloat(p.percentage) || 0,
        temp_id: p.temp_id,
      })),
      items: splitMode === "itemized" ? items.map(item => ({
        name: item.name || "Item",
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1,
        participant_ids: item.participant_ids
      })) : []
    };

    calculateSplitPreview(payload)
      .then(res => {
        if (res.data) setCalcPreview(res.data);
      })
      .catch(() => {
        setCalcPreview(null);
      });
  }, [
    isOpen, subtotal, taxPercent, taxAmount, servicePercent, 
    serviceAmount, discountAmount, splitMode, roundingMode, 
    participants, items, language
  ]);

  // Exact Mode Allocations
  const exactAllocated = useMemo(() => {
    return participants.reduce((sum, p) => sum + (parseFloat(p.amount_owed) || 0), 0);
  }, [participants]);

  const exactRemaining = useMemo(() => {
    return computedTotal - exactAllocated;
  }, [computedTotal, exactAllocated]);

  // Percentage Mode Total
  const totalPercentageSum = useMemo(() => {
    return participants.reduce((sum, p) => sum + (parseFloat(p.percentage) || 0), 0);
  }, [participants]);

  // Dropdown Options
  const roundingOptions = useMemo(() => [
    { value: "none", label: t("split_bill.opt_no_rounding", "Tanpa Pembulatan") },
    { value: "up_100", label: t("split_bill.opt_round_up_100", "Bulatkan ke Atas (+100)") },
    { value: "up_1000", label: t("split_bill.opt_round_up_1000", "Bulatkan ke Atas (+1.000)") },
    { value: "down_100", label: t("split_bill.opt_round_down_100", "Bulatkan ke Bawah (-100)") },
  ], [t]);

  const accountOptions = useMemo(() => accounts.map(acc => ({
    value: String(acc.id),
    label: acc.name,
    sublabel: formatCurrency(Math.round(acc.balance)),
    icon: Wallet
  })), [accounts, formatCurrency]);

  const categoryOptions = useMemo(() => categories.map(cat => ({
    value: String(cat.id),
    label: cat.name,
    icon: Tag
  })), [categories]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error(language === "en" ? "Please enter bill or event name." : "Mohon isi nama acara / tagihan.");
      setStep(1);
      return;
    }

    const validParticipants = participants.filter(p => p.name.trim().length > 0);
    if (validParticipants.length === 0) {
      toast.error(language === "en" ? "At least 1 participant name is required." : "Minimal harus ada 1 nama partisipan.");
      setStep(2);
      return;
    }

    if (splitMode === "exact" && Math.abs(exactRemaining) > 10) {
      toast.error(language === "en" 
        ? `Total exact amounts (${formatCurrency(exactAllocated)}) does not match Total Bill (${formatCurrency(computedTotal)}).` 
        : `Total nominal pasti (${formatCurrency(exactAllocated)}) belum sesuai dengan Total Tagihan (${formatCurrency(computedTotal)}).`);
      return;
    }

    if (splitMode === "percentage" && Math.abs(totalPercentageSum - 100) > 0.5) {
      toast.error(language === "en" 
        ? `Total percentage is ${totalPercentageSum}%. It must be exactly 100%.` 
        : `Total persentase adalah ${totalPercentageSum}%. Total harus pas 100%.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        description,
        bill_date: billDate,
        account_id: recordMyExpense ? selectedAccountId : null,
        category_id: recordMyExpense ? selectedCategoryId : null,
        subtotal: calcPreview ? calcPreview.subtotal : (parseFloat(subtotal) || 0),
        tax_percent: parseFloat(taxPercent) || 0,
        tax_amount: calcPreview ? calcPreview.tax_amount : (parseFloat(taxAmount) || 0),
        service_percent: parseFloat(servicePercent) || 0,
        service_amount: calcPreview ? calcPreview.service_amount : (parseFloat(serviceAmount) || 0),
        discount_amount: parseFloat(discountAmount) || 0,
        total_amount: calcPreview ? calcPreview.total_amount : computedTotal,
        split_mode: splitMode,
        rounding_mode: roundingMode,
        record_my_expense: recordMyExpense,
        payment_info: {
          bank_name: bankName,
          account_number: accountNumber,
          account_holder: accountHolder,
        },
        participants: participants.map(p => ({
          name: p.name || (p.is_creator ? (language === "en" ? "Me" : "Saya") : (language === "en" ? "Friend" : "Teman")),
          phone_number: p.phone_number || "",
          is_creator: p.is_creator || false,
          amount_owed: splitMode === "exact" ? (parseFloat(p.amount_owed) || 0) : 
                       splitMode === "percentage" ? Math.round(computedTotal * ((parseFloat(p.percentage) || 0) / 100)) : 
                       (calcPreview?.participants?.find(cp => cp.temp_id === p.temp_id)?.amount_owed || 0),
          percentage: parseFloat(p.percentage) || 0,
          temp_id: p.temp_id,
        })),
        items: splitMode === "itemized" ? items.map(item => ({
          name: item.name || "Item",
          price: parseFloat(item.price) || 0,
          quantity: parseInt(item.quantity) || 1,
          participant_ids: item.participant_ids
        })) : []
      };

      const res = await createSplitBill(payload);
      toast.success(language === "en" ? "Split bill created successfully!" : "Pembagian tagihan berhasil dibuat!");
      if (onSuccess) onSuccess(res.data);
      onClose();
    } catch (err) {
      toast.error(err?.message || (language === "en" ? "Failed to create split bill." : "Gagal membuat pembagian tagihan."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    setStep,
    isSubmitting,
    title,
    setTitle,
    billDate,
    setBillDate,
    subtotal,
    setSubtotal,
    taxPercent,
    setTaxPercent,
    servicePercent,
    setServicePercent,
    discountAmount,
    setDiscountAmount,
    splitMode,
    setSplitMode,
    roundingMode,
    setRoundingMode,
    participants,
    setParticipants,
    items,
    setItems,
    bankName,
    setBankName,
    accountNumber,
    setAccountNumber,
    accountHolder,
    setAccountHolder,
    recordMyExpense,
    setRecordMyExpense,
    selectedAccountId,
    setSelectedAccountId,
    selectedCategoryId,
    setSelectedCategoryId,
    calcPreview,
    computedTotal,
    exactAllocated,
    exactRemaining,
    totalPercentageSum,
    roundingOptions,
    accountOptions,
    categoryOptions,
    addParticipant,
    removeParticipant,
    handleSplitEqualPercentage,
    handleSplitEqualExact,
    handleAssignRestToMe,
    addItem,
    removeItem,
    toggleItemParticipant,
    handleSubmit,
    t,
    language,
    formatCurrency,
  };
}
