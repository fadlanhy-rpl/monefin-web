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
  Clock
} from "lucide-react";
import { createSplitBill, calculateSplitPreview } from "../../services/split-bill.service";
import { getAccounts } from "../../services/account.service";
import { getCategories } from "../../services/category.service";
import { useLanguage } from "../../context/LanguageContext";
import toast from "react-hot-toast";

export default function SplitBillWizardModal({ isOpen, onClose, onSuccess }) {
  const { t } = useLanguage();
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
    { temp_id: "me", name: "Saya", phone_number: "", is_creator: true, amount_owed: 0, percentage: 50 },
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
      // Fetch accounts and categories
      getAccounts().then((res) => {
        const accs = res.data || res || [];
        setAccounts(accs);
        if (accs.length > 0) setSelectedAccountId(accs[0].id);
      }).catch(console.error);

      getCategories().then((res) => {
        const cats = res.data || res || [];
        setCategories(cats);
        if (cats.length > 0) setSelectedCategoryId(cats[0].id);
      }).catch(console.error);
    }
  }, [isOpen]);

  // Add Participant
  const addParticipant = () => {
    const newId = `p${participants.length + 1}`;
    setParticipants([...participants, { 
      temp_id: newId, 
      name: "", 
      phone_number: "", 
      is_creator: false, 
      amount_owed: 0,
      percentage: 0 
    }]);
  };

  // Remove Participant
  const removeParticipant = (idx) => {
    if (participants.length <= 1) return;
    const removedId = participants[idx].temp_id;
    const updated = participants.filter((_, i) => i !== idx);
    setParticipants(updated);

    // Remove from item assignments
    setItems(items.map(item => ({
      ...item,
      participant_ids: item.participant_ids.filter(id => id !== removedId)
    })));
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
        name: p.name || `Teman ${idx + 1}`,
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
    participants, items
  ]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Mohon isi nama acara / tagihan.");
      setStep(1);
      return;
    }

    const validParticipants = participants.filter(p => p.name.trim().length > 0);
    if (validParticipants.length === 0) {
      toast.error("Minimal harus ada 1 nama partisipan.");
      setStep(2);
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
        total_amount: calcPreview ? calcPreview.total_amount : 0,
        split_mode: splitMode,
        rounding_mode: roundingMode,
        record_my_expense: recordMyExpense,
        payment_info: {
          bank_name: bankName,
          account_number: accountNumber,
          account_holder: accountHolder,
        },
        participants: (calcPreview?.participants || participants).map(p => ({
          name: p.name || "Teman",
          phone_number: p.phone_number || "",
          is_creator: p.is_creator || false,
          amount_owed: p.amount_owed || 0,
          percentage: p.percentage || 0,
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
      toast.success("Pembagian tagihan berhasil dibuat! 🎉");
      if (onSuccess) onSuccess(res.data);
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Gagal membuat pembagian tagihan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
              <h3 className="text-lg font-black text-slate-900">Buat Pembagian Tagihan</h3>
              <p className="text-xs text-slate-500 font-medium">Langkah {step} dari 4: {
                step === 1 ? "Info Acara & Total" :
                step === 2 ? "Daftar Teman" :
                step === 3 ? "Mode Pembagian" : "Pembayaran & Konfirmasi"
              }</p>
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
            { num: 1, label: "Info Tagihan" },
            { num: 2, label: "Partisipan" },
            { num: 3, label: "Kalkulasi" },
            { num: 4, label: "Konfirmasi" },
          ].map(s => (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num)}
              className={`py-2.5 transition-all border-b-2 ${
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
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Nama Acara / Tagihan *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Misal: Makan Malam Seafood, Liburan Puncak, Kado Ultah"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold focus:bg-white focus:border-[#00685F] outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Tanggal Tagihan</label>
                  <input
                    type="date"
                    value={billDate}
                    onChange={e => setBillDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold focus:bg-white focus:border-[#00685F] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Subtotal Tagihan (Rp)</label>
                  <input
                    type="number"
                    value={subtotal}
                    onChange={e => setSubtotal(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold focus:bg-white focus:border-[#00685F] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Tax & Service & Discount Controls */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-[#00685F]" />
                  <span>Pajak (PPN/PB1), Service & Diskon</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Pajak / PB1 (%)</label>
                    <input
                      type="number"
                      value={taxPercent}
                      onChange={e => setTaxPercent(e.target.value)}
                      placeholder="10"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:border-[#00685F] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Service Charge (%)</label>
                    <input
                      type="number"
                      value={servicePercent}
                      onChange={e => setServicePercent(e.target.value)}
                      placeholder="5"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:border-[#00685F] outline-none"
                    />
                  </div>

                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-bold text-slate-500">Diskon Potongan (Rp)</label>
                    <input
                      type="number"
                      value={discountAmount}
                      onChange={e => setDiscountAmount(e.target.value)}
                      placeholder="0"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:border-[#00685F] outline-none"
                    />
                  </div>
                </div>

                {/* Rounding Mode */}
                <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-600">Opsi Pembulatan:</span>
                  <select
                    value={roundingMode}
                    onChange={e => setRoundingMode(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="none">Tanpa Pembulatan</option>
                    <option value="up_100">Bulatkan ke Atas (+100)</option>
                    <option value="up_1000">Bulatkan ke Atas (+1.000)</option>
                    <option value="down_100">Bulatkan ke Bawah (-100)</option>
                  </select>
                </div>
              </div>

              {/* Total Summary Box */}
              {calcPreview && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase text-slate-500">Total Akhir Tagihan:</span>
                    <h3 className="text-xl font-black text-[#00685F]">
                      Rp {calcPreview.total_amount.toLocaleString()}
                    </h3>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1.5 rounded-xl">
                    {participants.length} Partisipan
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PARTICIPANTS */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Daftar Teman / Partisipan</h4>
                  <p className="text-xs text-slate-400">Siapa saja yang ikut patungan pada tagihan ini?</p>
                </div>
                <button
                  type="button"
                  onClick={addParticipant}
                  className="px-3.5 py-1.5 bg-[#00685F] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#00554E] transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Teman</span>
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
                        placeholder={p.is_creator ? "Nama Anda (Penanggung/Talangi)" : `Nama Teman ${idx + 1}`}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:border-[#00685F] outline-none"
                      />

                      <input
                        type="text"
                        value={p.phone_number}
                        onChange={e => {
                          const val = e.target.value;
                          setParticipants(participants.map((item, i) => i === idx ? { ...item, phone_number: val } : item));
                        }}
                        placeholder="No WhatsApp (0812...)"
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:border-[#00685F] outline-none"
                      />
                    </div>

                    {!p.is_creator && (
                      <button
                        type="button"
                        onClick={() => removeParticipant(idx)}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: SPLIT MODE & CALCULATION */}
          {step === 3 && (
            <div className="space-y-5">
              
              {/* Split Mode Selector */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Pilih Metode Pembagian</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: "equal", label: "Bagi Rata", icon: Users, desc: "Rata semua orang" },
                    { key: "itemized", label: "Per Menu", icon: Utensils, desc: "Pajak proporsional" },
                    { key: "percentage", label: "Persentase", icon: Percent, desc: "Beban % per orang" },
                    { key: "exact", label: "Nominal Pasti", icon: DollarSign, desc: "Input manual pas" },
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

              {/* ITEMIZED MENU INPUT (If mode itemized) */}
              {splitMode === "itemized" && (
                <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Daftar Menu / Pesanan</h4>
                    <button
                      type="button"
                      onClick={addItem}
                      className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#00685F] hover:bg-emerald-50 flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Menu</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {items.map((item) => (
                      <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={e => setItems(items.map(it => it.id === item.id ? { ...it, name: e.target.value } : it))}
                            placeholder="Nama Menu (misal: Nasi Goreng)"
                            className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none"
                          />
                          <input
                            type="number"
                            value={item.price}
                            onChange={e => setItems(items.map(it => it.id === item.id ? { ...it, price: e.target.value } : it))}
                            placeholder="Harga (Rp)"
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
                          <span className="text-[10px] font-bold text-slate-400 mr-1">Dipesan oleh:</span>
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
                                {isChecked ? "✓ " : "+ "}{p.name || "Teman"}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CALCULATION PREVIEW CARDS */}
              {calcPreview && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Hasil Pembagian Otomatis:</h4>
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
                            {p.name} {p.is_creator && <span className="text-[10px] text-[#00685F]">(Saya)</span>}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {p.phone_number || "Tanpa nomor"}
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

          {/* STEP 4: PAYMENT INFO & CONFIRMATION */}
          {step === 4 && (
            <div className="space-y-4">
              
              {/* Payment Details for Friends */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#00685F]" />
                  <span>Rekening / E-Wallet Tujuan Transfer</span>
                </h4>
                <p className="text-[11px] text-slate-500">Info ini akan otomatis disertakan pada teks WhatsApp untuk ditransfer teman.</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    placeholder="Bank / E-Wallet (BCA/GoPay)"
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                  />
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                    placeholder="Nomor Rekening / HP"
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                  />
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={e => setAccountHolder(e.target.value)}
                    placeholder="Atas Nama (a.n)"
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              {/* Auto Record Expense Checkbox */}
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recordMyExpense}
                    onChange={e => setRecordMyExpense(e.target.checked)}
                    className="w-4 h-4 rounded text-[#00685F] accent-[#00685F]"
                  />
                  <span className="text-xs font-black text-slate-800">
                    Otomatis catat bagian saya ke Dompet MoneFin
                  </span>
                </label>

                {recordMyExpense && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Pilih Dompet / Rekening:</label>
                      <select
                        value={selectedAccountId}
                        onChange={e => setSelectedAccountId(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                      >
                        {accounts.map(acc => (
                          <option key={acc.id} value={acc.id}>
                            {acc.name} (Rp {acc.balance.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Kategori Pengeluaran:</label>
                      <select
                        value={selectedCategoryId}
                        onChange={e => setSelectedCategoryId(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Final Summary Card */}
              {calcPreview && (
                <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Acara: <strong className="text-white">{title || "Tanpa Judul"}</strong></span>
                    <span>{billDate}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <span className="text-xs font-bold">Total Pembagian:</span>
                    <span className="text-lg font-black text-emerald-400">
                      Rp {calcPreview.total_amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !title.trim()) {
                  toast.error("Mohon isi nama acara tagihan.");
                  return;
                }
                setStep(step + 1);
              }}
              className="px-5 py-2.5 bg-[#00685F] hover:bg-[#00554E] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-800/20 cursor-pointer"
            >
              <span>Lanjut</span>
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
              <span>Selesaikan & Simpan</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
