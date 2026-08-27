"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  X, 
  Receipt, 
  Users, 
  Calculator, 
  CreditCard, 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Percent,
  DollarSign,
  Utensils,
  Layers,
  ArrowRight,
  Shield,
  Clock,
  Wallet,
  Tag,
  AlertCircle,
  Calendar as CalendarIcon
} from "lucide-react";
import { createSplitBill, calculateSplitPreview } from "../../services/split-bill.service";
import { getAccounts } from "../../services/account.service";
import { getCategories } from "../../services/category.service";
import { useLanguage } from "../../context/LanguageContext";
import DatePicker from "../ui/DatePicker";
import CustomSelect from "../ui/CustomSelect";
import toast from "react-hot-toast";

export default function SplitBillWizardModal({ isOpen, onClose, onSuccess }) {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [billDate, setBillDate] = useState(new Date().toISOString().split("T")[0]);
  const [subtotal, setSubtotal] = useState("");
  const [taxPercent, setTaxPercent] = useState("");
  const [taxAmount, setTaxAmount] = useState("");
  const [servicePercent, setServicePercent] = useState("");
  const [serviceAmount, setServiceAmount] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [splitMode, setSplitMode] = useState("equal"); // equal, itemized, exact, percentage
  const [roundingMode, setRoundingMode] = useState("none"); // none, up_100, up_1000, down_100

  // Participants State
  const [participants, setParticipants] = useState([
    { temp_id: "me", name: "", phone_number: "", is_creator: true, amount_owed: 0, percentage: 50 },
    { temp_id: "p1", name: "", phone_number: "", is_creator: false, amount_owed: 0, percentage: 50 },
  ]);

  // Set default creator name based on language if empty
  useEffect(() => {
    if (participants.length > 0 && participants[0].is_creator && !participants[0].name) {
      setParticipants(prev => [
        { ...prev[0], name: language === "en" ? "Me" : "Saya" },
        ...prev.slice(1)
      ]);
    }
  }, [language]);

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
      // Fetch accounts and categories
      getAccounts().then((res) => {
        const accs = res.data || res || [];
        setAccounts(accs);
        if (accs.length > 0) setSelectedAccountId(String(accs[0].id));
      }).catch(console.error);

      getCategories().then((res) => {
        const cats = res.data || res || [];
        setCategories(cats);
        if (cats.length > 0) setSelectedCategoryId(String(cats[0].id));
      }).catch(console.error);
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
      .catch(console.error);
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
  const roundingOptions = [
    { value: "none", label: t("split_bill.opt_no_rounding", "Tanpa Pembulatan") },
    { value: "up_100", label: t("split_bill.opt_round_up_100", "Bulatkan ke Atas (+100)") },
    { value: "up_1000", label: t("split_bill.opt_round_up_1000", "Bulatkan ke Atas (+1.000)") },
    { value: "down_100", label: t("split_bill.opt_round_down_100", "Bulatkan ke Bawah (-100)") },
  ];

  const accountOptions = accounts.map(acc => ({
    value: String(acc.id),
    label: acc.name,
    sublabel: `Rp ${Math.round(acc.balance).toLocaleString()}`,
    icon: Wallet
  }));

  const categoryOptions = categories.map(cat => ({
    value: String(cat.id),
    label: cat.name,
    icon: Tag
  }));

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
        ? `Total exact amounts (Rp ${exactAllocated.toLocaleString()}) does not match Total Bill (Rp ${computedTotal.toLocaleString()}).` 
        : `Total nominal pasti (Rp ${exactAllocated.toLocaleString()}) belum sesuai dengan Total Tagihan (Rp ${computedTotal.toLocaleString()}).`);
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
      toast.success(language === "en" ? "Split bill created successfully! 🎉" : "Pembagian tagihan berhasil dibuat! 🎉");
      if (onSuccess) onSuccess(res.data);
      onClose();
    } catch (err) {
      toast.error(err?.message || (language === "en" ? "Failed to create split bill." : "Gagal membuat pembagian tagihan."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const stepTitles = {
    1: t("split_bill.step1_title", "Info Acara & Total"),
    2: t("split_bill.step2_title", "Daftar Teman"),
    3: t("split_bill.step3_title", "Mode Pembagian"),
    4: t("split_bill.step4_title", "Pembayaran & Konfirmasi"),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden animate-badge-in">
        
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 to-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00685F] to-[#00A896] text-white flex items-center justify-center shadow-md shadow-emerald-800/20">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {t("split_bill.modal_create_title", "Buat Pembagian Tagihan")}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {t("split_bill.modal_step_prefix", "Langkah {step} dari 4: {title}")
                  .replace("{step}", step)
                  .replace("{title}", stepTitles[step])}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* STEP PROGRESS INDICATOR */}
        <div className="grid grid-cols-4 border-b border-slate-100 text-center text-xs font-black">
          {[
            { num: 1, label: t("split_bill.step_info", "Info Tagihan") },
            { num: 2, label: t("split_bill.step_participants", "Partisipan") },
            { num: 3, label: t("split_bill.step_calculation", "Kalkulasi") },
            { num: 4, label: t("split_bill.step_confirmation", "Konfirmasi") },
          ].map(s => (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num)}
              className={`py-2.5 transition-all border-b-2 cursor-pointer ${
                step === s.num
                  ? "border-[#00685F] text-[#00685F] bg-emerald-50/50"
                  : step > s.num
                  ? "border-emerald-400 text-emerald-700 bg-white"
                  : "border-transparent text-slate-400"
              }`}
            >
              {s.num}. {s.label}
            </button>
          ))}
        </div>

        {/* MODAL BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* STEP 1: INFO & TOTAL */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  {t("split_bill.field_title", "Nama Acara / Tagihan *")}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={t("split_bill.placeholder_title", "Misal: Makan Malam Seafood, Liburan Puncak, Kado Ultah")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold focus:bg-white focus:border-[#00685F] outline-none transition-all shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Modern Custom Date Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    {t("split_bill.field_date", "Tanggal Tagihan")}
                  </label>
                  <DatePicker
                    value={billDate}
                    onChange={setBillDate}
                    placeholder={t("split_bill.field_date", "Tanggal Tagihan")}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    {t("split_bill.field_subtotal", "Subtotal Tagihan (Rp)")}
                  </label>
                  <input
                    type="number"
                    value={subtotal}
                    onChange={e => setSubtotal(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold focus:bg-white focus:border-[#00685F] outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Tax & Service & Discount Controls */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-[#00685F]" />
                  <span>{t("split_bill.section_tax_service", "Pajak (PPN/PB1), Service & Diskon")}</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">
                      {t("split_bill.field_tax_pct", "Pajak / PB1 (%)")}
                    </label>
                    <input
                      type="number"
                      value={taxPercent}
                      onChange={e => setTaxPercent(e.target.value)}
                      placeholder="10"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:border-[#00685F] outline-none shadow-2xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">
                      {t("split_bill.field_service_pct", "Service Charge (%)")}
                    </label>
                    <input
                      type="number"
                      value={servicePercent}
                      onChange={e => setServicePercent(e.target.value)}
                      placeholder="5"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:border-[#00685F] outline-none shadow-2xs"
                    />
                  </div>

                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-bold text-slate-500">
                      {t("split_bill.field_discount", "Diskon Potongan (Rp)")}
                    </label>
                    <input
                      type="number"
                      value={discountAmount}
                      onChange={e => setDiscountAmount(e.target.value)}
                      placeholder="0"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:border-[#00685F] outline-none shadow-2xs"
                    />
                  </div>
                </div>

                {/* Rounding Mode Custom Dropdown */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-200/60">
                  <span className="text-xs font-bold text-slate-700">
                    {t("split_bill.field_rounding", "Opsi Pembulatan:")}
                  </span>
                  <div className="w-full sm:w-60">
                    <CustomSelect
                      value={roundingMode}
                      onChange={setRoundingMode}
                      options={roundingOptions}
                    />
                  </div>
                </div>
              </div>

              {/* Total Summary Box */}
              <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-[11px] font-extrabold uppercase text-slate-500">
                    {t("split_bill.final_total_bill", "Total Akhir Tagihan:")}
                  </span>
                  <h3 className="text-xl font-black text-[#00685F]">
                    Rp {computedTotal.toLocaleString()}
                  </h3>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1.5 rounded-xl border border-emerald-200">
                  {t("split_bill.count_participants", "{count} Partisipan").replace("{count}", participants.length)}
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: PARTICIPANTS */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {t("split_bill.step_participants", "Daftar Teman / Partisipan")}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {t("split_bill.participants_subtitle", "Siapa saja yang ikut patungan pada tagihan ini?")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addParticipant}
                  className="px-3.5 py-1.5 bg-[#00685F] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#00554E] transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t("split_bill.add_friend", "Tambah Teman")}</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {participants.map((p, idx) => (
                  <div 
                    key={p.temp_id || idx}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                      p.is_creator ? "bg-emerald-50/70 border-emerald-200" : "bg-slate-50/70 border-slate-200"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-xs text-[#00685F] shrink-0">
                      {idx + 1}
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={p.name}
                        onChange={e => {
                          const val = e.target.value;
                          setParticipants(participants.map((item, i) => i === idx ? { ...item, name: val } : item));
                        }}
                        placeholder={
                          p.is_creator 
                            ? t("split_bill.placeholder_creator_name", "Nama Anda (Penanggung / Talangi)")
                            : t("split_bill.placeholder_friend_name", "Nama Teman {idx}").replace("{idx}", idx + 1)
                        }
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:border-[#00685F] outline-none"
                      />

                      <input
                        type="text"
                        value={p.phone_number}
                        onChange={e => {
                          const val = e.target.value;
                          setParticipants(participants.map((item, i) => i === idx ? { ...item, phone_number: val } : item));
                        }}
                        placeholder={t("split_bill.placeholder_wa", "No WhatsApp (0812...)")}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:border-[#00685F] outline-none"
                      />
                    </div>

                    {!p.is_creator && (
                      <button
                        type="button"
                        onClick={() => removeParticipant(idx)}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer shrink-0"
                        title={t("split_bill.delete_confirm", "Hapus")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: SPLIT MODE & INTERACTIVE CALCULATION */}
          {step === 3 && (
            <div className="space-y-5">
              
              {/* Split Mode Selector */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  {t("split_bill.choose_split_mode", "Pilih Metode Pembagian")}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: "equal", label: t("split_bill.equal_split", "Bagi Rata"), icon: Users, desc: t("split_bill.equal_desc", "Rata semua orang") },
                    { key: "itemized", label: t("split_bill.itemized_split", "Per Menu"), icon: Utensils, desc: t("split_bill.itemized_desc", "Pajak proporsional") },
                    { key: "percentage", label: t("split_bill.percentage_split", "Persentase"), icon: Percent, desc: t("split_bill.percentage_desc", "Beban % per orang") },
                    { key: "exact", label: t("split_bill.exact_split", "Nominal Pasti"), icon: DollarSign, desc: t("split_bill.exact_desc", "Input manual pas") },
                  ].map(m => {
                    const IconComp = m.icon;
                    const isSel = splitMode === m.key;

                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setSplitMode(m.key)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSel
                            ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20 shadow-xs"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <IconComp className={`w-4 h-4 mb-1.5 ${isSel ? "text-[#00685F]" : "text-slate-500"}`} />
                        <h4 className="text-xs font-black text-slate-800">{m.label}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{m.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1. EXACT AMOUNT INPUT MODE */}
              {splitMode === "exact" && (
                <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        {t("split_bill.exact_input_title", "Tentukan Nominal Pasti Tiap Orang")}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {t("split_bill.exact_helper_allocated", "Teralokasi: {allocated} / {total}")
                          .replace("{allocated}", `Rp ${exactAllocated.toLocaleString()}`)
                          .replace("{total}", `Rp ${computedTotal.toLocaleString()}`)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSplitEqualExact}
                        className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs"
                      >
                        {t("split_bill.btn_split_equal_amount", "Bagi Rata")}
                      </button>
                      <button
                        type="button"
                        onClick={handleAssignRestToMe}
                        className="px-2.5 py-1 bg-emerald-100 border border-emerald-200 rounded-lg text-[11px] font-bold text-emerald-800 hover:bg-emerald-200 cursor-pointer shadow-2xs"
                      >
                        {t("split_bill.btn_assign_rest_to_me", "Alokasikan sisa ke saya")}
                      </button>
                    </div>
                  </div>

                  {/* Allocation Status Alert */}
                  <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
                    Math.abs(exactRemaining) < 1 
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-amber-100 text-amber-900 border border-amber-200"
                  }`}>
                    <div className="flex items-center gap-1.5">
                      {Math.abs(exactRemaining) < 1 ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                      )}
                      <span>
                        {Math.abs(exactRemaining) < 1 
                          ? (language === "en" ? "✓ 100% Fully Allocated" : "✓ Alokasi Pas 100%") 
                          : t("split_bill.exact_helper_remaining", "Sisa: {remaining}").replace("{remaining}", `Rp ${exactRemaining.toLocaleString()}`)}
                      </span>
                    </div>
                    <span className="font-mono">
                      Rp {exactAllocated.toLocaleString()} / Rp {computedTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Participant Inputs */}
                  <div className="space-y-2 pt-1">
                    {participants.map((p, idx) => (
                      <div 
                        key={p.temp_id || idx}
                        className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-800 truncate">
                            {p.name || `${language === "en" ? "Friend" : "Teman"} ${idx + 1}`}
                            {p.is_creator && <span className="text-[10px] text-[#00685F] ml-1">({t("split_bill.my_share_tag", "Saya")})</span>}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 w-40 sm:w-48">
                          <span className="text-xs font-bold text-slate-400">Rp</span>
                          <input
                            type="number"
                            value={p.amount_owed || ""}
                            onChange={e => {
                              const val = parseFloat(e.target.value) || 0;
                              setParticipants(participants.map((item, i) => i === idx ? { ...item, amount_owed: val } : item));
                            }}
                            placeholder="0"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-black text-right text-slate-900 focus:bg-white focus:border-[#00685F] outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. PERCENTAGE INPUT MODE */}
              {splitMode === "percentage" && (
                <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        {t("split_bill.percentage_input_title", "Tentukan Persentase Beban Tiap Orang")}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {t("split_bill.total_percentage", "Total Persentase: {pct}%").replace("{pct}", totalPercentageSum)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSplitEqualPercentage}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs self-start sm:self-auto"
                    >
                      {t("split_bill.btn_split_equal_pct", "Bagi Rata %")}
                    </button>
                  </div>

                  {/* Percentage Status Alert */}
                  <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
                    Math.abs(totalPercentageSum - 100) < 0.1 
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-amber-100 text-amber-900 border border-amber-200"
                  }`}>
                    <div className="flex items-center gap-1.5">
                      {Math.abs(totalPercentageSum - 100) < 0.1 ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                      )}
                      <span>
                        {Math.abs(totalPercentageSum - 100) < 0.1 
                          ? (language === "en" ? "✓ 100% Exactly" : "✓ 100% Pas") 
                          : t("split_bill.percentage_warning", "Total persentase harus 100%")}
                      </span>
                    </div>
                    <span className="font-mono">{totalPercentageSum}% / 100%</span>
                  </div>

                  {/* Participant Percentage Inputs */}
                  <div className="space-y-2 pt-1">
                    {participants.map((p, idx) => {
                      const shareRp = Math.round(computedTotal * ((parseFloat(p.percentage) || 0) / 100));

                      return (
                        <div 
                          key={p.temp_id || idx}
                          className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-black text-slate-800 truncate">
                              {p.name || `${language === "en" ? "Friend" : "Teman"} ${idx + 1}`}
                              {p.is_creator && <span className="text-[10px] text-[#00685F] ml-1">({t("split_bill.my_share_tag", "Saya")})</span>}
                            </p>
                            <p className="text-[11px] font-extrabold text-[#00685F]">
                              ≈ Rp {shareRp.toLocaleString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 w-24 sm:w-28">
                            <input
                              type="number"
                              value={p.percentage || ""}
                              onChange={e => {
                                const val = parseFloat(e.target.value) || 0;
                                setParticipants(participants.map((item, i) => i === idx ? { ...item, percentage: val } : item));
                              }}
                              placeholder="0"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-black text-right text-slate-900 focus:bg-white focus:border-[#00685F] outline-none"
                            />
                            <span className="text-xs font-bold text-slate-500">%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. ITEMIZED MENU INPUT MODE */}
              {splitMode === "itemized" && (
                <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {t("split_bill.menu_items_title", "Daftar Menu / Pesanan")}
                    </h4>
                    <button
                      type="button"
                      onClick={addItem}
                      className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#00685F] hover:bg-emerald-50 flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t("split_bill.add_menu_item", "Tambah Menu")}</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {items.map((item) => (
                      <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={e => setItems(items.map(it => it.id === item.id ? { ...it, name: e.target.value } : it))}
                            placeholder={t("split_bill.placeholder_menu_name", "Nama Menu (misal: Nasi Goreng)")}
                            className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none"
                          />
                          <input
                            type="number"
                            value={item.price}
                            onChange={e => setItems(items.map(it => it.id === item.id ? { ...it, price: e.target.value } : it))}
                            placeholder="Price"
                            className="w-24 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none"
                          />
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={e => setItems(items.map(it => it.id === item.id ? { ...it, quantity: e.target.value } : it))}
                            placeholder="Qty"
                            className="w-12 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-center outline-none"
                          />
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-slate-300 hover:text-red-500 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Assign Participants Checkbox Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-bold text-slate-400 mr-1">
                            {t("split_bill.ordered_by", "Dipesan oleh:")}
                          </span>
                          {participants.map(p => {
                            const pId = p.temp_id || p.name;
                            const isChecked = item.participant_ids.includes(pId);

                            return (
                              <button
                                key={pId}
                                type="button"
                                onClick={() => toggleItemParticipant(item.id, pId)}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                                  isChecked
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300 shadow-2xs"
                                    : "bg-slate-100 text-slate-500 border-transparent hover:bg-slate-200"
                                }`}
                              >
                                {isChecked ? "✓ " : "+ "}{p.name || (language === "en" ? "Friend" : "Teman")}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. CALCULATION PREVIEW CARDS (For Equal / Itemized) */}
              {(splitMode === "equal" || splitMode === "itemized") && calcPreview && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {t("split_bill.auto_split_result", "Hasil Pembagian Otomatis:")}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {calcPreview.participants.map((p, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-2xl border flex items-center justify-between ${
                          p.is_creator ? "bg-emerald-50/80 border-emerald-200" : "bg-white border-slate-200"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-black text-slate-800">
                            {p.name} {p.is_creator && <span className="text-[10px] text-[#00685F]">({language === "en" ? "Me" : "Saya"})</span>}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {p.phone_number || (language === "en" ? "No phone" : "Tanpa nomor")}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-[#00685F]">
                            Rp {p.amount_owed.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* STEP 4: PAYMENT INFO & CONFIRMATION WITH MODERN CUSTOM SELECTS */}
          {step === 4 && (
            <div className="space-y-4">
              
              {/* Payment Details for Friends */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#00685F]" />
                  <span>{t("split_bill.payment_account_title", "Rekening / E-Wallet Tujuan Transfer")}</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  {t("split_bill.payment_account_subtitle", "Info ini akan otomatis disertakan pada teks WhatsApp untuk ditransfer teman.")}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    placeholder={t("split_bill.placeholder_bank", "Bank / E-Wallet (BCA/GoPay)")}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none shadow-2xs"
                  />
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                    placeholder={t("split_bill.placeholder_acc_no", "Nomor Rekening / HP")}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none shadow-2xs"
                  />
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={e => setAccountHolder(e.target.value)}
                    placeholder={t("split_bill.placeholder_holder", "Atas Nama (a.n)")}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none shadow-2xs"
                  />
                </div>
              </div>

              {/* Auto Record Expense Checkbox with Custom Selects */}
              <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/50 p-4 sm:p-5 rounded-2xl border border-emerald-200/90 space-y-3.5 shadow-2xs">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recordMyExpense}
                    onChange={e => setRecordMyExpense(e.target.checked)}
                    className="w-4 h-4 rounded text-[#00685F] accent-[#00685F] cursor-pointer"
                  />
                  <span className="text-xs font-black text-slate-800">
                    {t("split_bill.auto_record_checkbox", "Otomatis catat bagian saya ke Dompet MoneFin")}
                  </span>
                </label>

                {recordMyExpense && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Modern Custom Account Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-600 flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5 text-[#00685F]" />
                        <span>{t("split_bill.choose_wallet", "Pilih Dompet / Rekening:")}</span>
                      </label>
                      <CustomSelect
                        value={selectedAccountId}
                        onChange={setSelectedAccountId}
                        options={accountOptions}
                        placeholder={t("split_bill.select_account_placeholder", "Pilih dompet / rekening...")}
                      />
                    </div>

                    {/* Modern Custom Category Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-600 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#00685F]" />
                        <span>{t("split_bill.choose_category", "Kategori Pengeluaran:")}</span>
                      </label>
                      <CustomSelect
                        value={selectedCategoryId}
                        onChange={setSelectedCategoryId}
                        options={categoryOptions}
                        searchable
                        placeholder={t("split_bill.select_category_placeholder", "Pilih kategori pengeluaran...")}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Final Summary Card */}
              <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl space-y-2 shadow-lg">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>{t("split_bill.event_label", "Acara:")} <strong className="text-white">{title || (language === "en" ? "Untitled" : "Tanpa Judul")}</strong></span>
                  <span>{billDate}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold">{t("split_bill.final_total_bill", "Total Pembagian:")}</span>
                  <span className="text-lg font-black text-emerald-400">
                    Rp {computedTotal.toLocaleString()}
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t("split_bill.btn_previous", "Sebelumnya")}</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !title.trim()) {
                  toast.error(language === "en" ? "Please enter bill or event name." : "Mohon isi nama acara tagihan.");
                  return;
                }
                setStep(step + 1);
              }}
              className="px-5 py-2.5 bg-[#00685F] hover:bg-[#00554E] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-800/20 cursor-pointer"
            >
              <span>{t("split_bill.btn_next", "Lanjut")}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-[#00A896] hover:from-emerald-700 hover:to-[#008f80] text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-700/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300" />
              )}
              <span>{t("split_bill.btn_finish", "Selesaikan & Simpan")}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
