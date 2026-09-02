import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Printer, 
  CheckCircle2, 
  Plus, 
  Minus, 
  UserCheck, 
  MessageSquare, 
  Receipt, 
  Sparkles, 
  Tag, 
  AlertCircle,
  Check,
  Briefcase,
  FileCheck,
  Zap,
  RotateCcw,
  IndianRupee,
  Clock
} from 'lucide-react';
import { CustomerRecord, Language, PriceSetting } from '../../types';

interface BillingItem {
  id: string;
  nameEn: string;
  nameBn: string;
  rate: number;
  unit?: string;
  qty: number;
}

export const PrintBillingCalculator: React.FC<{
  language: Language;
  prices: PriceSetting[];
  onSaveToRegister: (customer: Omit<CustomerRecord, 'id' | 'createdAt'>) => void;
}> = ({ language, prices, onSaveToRegister }) => {
  // Ensure default job and scheme form prices are included even if older local prices lack them
  const initializeItems = (): BillingItem[] => {
    const list: BillingItem[] = prices.map((p) => ({
      id: p.id,
      nameEn: p.serviceNameEn,
      nameBn: p.serviceNameBn,
      rate: p.rate,
      unit: p.unit,
      qty: 0
    }));

    // Ensure Job Form Fill-up (₹30) is present
    if (!list.some(i => i.id === 'pr-job')) {
      list.splice(1, 0, {
        id: 'pr-job',
        nameEn: 'Job Form Fill-up',
        nameBn: 'চাকরির ফর্ম ফিলাপ (Job Form)',
        rate: 30,
        unit: 'per form',
        qty: 0
      });
    }

    // Ensure Scheme Form Fill-up (₹30) is present
    if (!list.some(i => i.id === 'pr-scheme')) {
      list.splice(2, 0, {
        id: 'pr-scheme',
        nameEn: 'Govt Scheme Form Fill-up',
        nameBn: 'সরকারি স্কিম / প্রকল্প ফর্ম ফিলাপ',
        rate: 30,
        unit: 'per form',
        qty: 0
      });
    }

    return list;
  };

  const [items, setItems] = useState<BillingItem[]>(initializeItems);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerMobile, setCustomerMobile] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Advance' | 'Due'>('Paid');
  const [advanceAmount, setAdvanceAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [bulkTierEnabled, setBulkTierEnabled] = useState<boolean>(true);

  // Sync if external prices update
  useEffect(() => {
    setItems((prev) => {
      const fresh = initializeItems();
      return fresh.map(f => {
        const existing = prev.find(p => p.id === f.id);
        return existing ? { ...f, qty: existing.qty } : f;
      });
    });
  }, [prices]);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const handleQtyInput = (id: string, value: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: Math.max(0, value) } : item))
    );
  };

  const setItemDirectQty = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: Math.max(0, qty) } : item))
    );
  };

  // Calculation with Xerox 30+ pages bulk rate (₹1.75/page)
  const calculateItemTotal = (item: BillingItem): number => {
    // If B&W Xerox / Print (pr-1) and qty > 30, rate is ₹1.75
    if (bulkTierEnabled && item.id === 'pr-1' && item.qty > 30) {
      return item.qty * 1.75;
    }
    return item.rate * item.qty;
  };

  const getItemEffectiveRate = (item: BillingItem): number => {
    if (bulkTierEnabled && item.id === 'pr-1' && item.qty > 30) {
      return 1.75;
    }
    return item.rate;
  };

  const xeroxItem = items.find((i) => i.id === 'pr-1');
  const isXeroxBulkTierActive = Boolean(bulkTierEnabled && xeroxItem && xeroxItem.qty > 30);
  const xeroxSavings = isXeroxBulkTierActive && xeroxItem 
    ? (xeroxItem.rate * xeroxItem.qty) - (1.75 * xeroxItem.qty) 
    : 0;

  const subtotal = items.reduce((acc, curr) => acc + calculateItemTotal(curr), 0);
  const grandTotal = Math.max(0, subtotal - discount);
  const calculatedDue = paymentStatus === 'Due' 
    ? grandTotal 
    : (paymentStatus === 'Advance' ? Math.max(0, grandTotal - advanceAmount) : 0);
  const calculatedPaid = paymentStatus === 'Paid' 
    ? grandTotal 
    : (paymentStatus === 'Advance' ? Math.min(grandTotal, advanceAmount) : 0);
  const changeToReturn = Math.max(0, cashReceived - (paymentStatus === 'Paid' ? grandTotal : advanceAmount));
  const activeItems = items.filter((i) => i.qty > 0);

  // When grandTotal changes and paymentStatus is Paid, sync advance amount
  useEffect(() => {
    if (paymentStatus === 'Paid') {
      setAdvanceAmount(grandTotal);
    } else if (paymentStatus === 'Due') {
      setAdvanceAmount(0);
    }
  }, [grandTotal, paymentStatus]);

  const handleSaveToKhata = () => {
    if (grandTotal === 0 && !customerName.trim()) {
      alert(language === 'bn' ? 'দয়া করে সেবা আইটেম সিলেক্ট করুন অথবা গ্রাহকের নাম দিন।' : 'Please add at least one service item or customer name.');
      return;
    }

    const serviceSummary = activeItems
      .map((i) => {
        const effRate = getItemEffectiveRate(i);
        const name = language === 'bn' ? i.nameBn : i.nameEn;
        return `${name} (x${i.qty} @ ₹${effRate})`;
      })
      .join(', ') || (language === 'bn' ? 'সাইবার ক্যাফে সেবা' : 'Cyber Café Walk-in Service');

    const printCount = items.find((i) => i.id === 'pr-1')?.qty || 0;
    const scanCount = items.find((i) => i.id === 'pr-6')?.qty || 0;

    onSaveToRegister({
      customerName: customerName.trim() || (language === 'bn' ? 'কাস্টমার' : 'Walk-in Customer'),
      mobile: customerMobile.trim() || 'N/A',
      serviceTaken: serviceSummary,
      amount: grandTotal,
      paymentStatus,
      advanceAmount: paymentStatus === 'Advance' ? advanceAmount : (paymentStatus === 'Paid' ? grandTotal : 0),
      dueAmount: calculatedDue,
      printCount,
      scanCount,
      notes: notes.trim() + (isXeroxBulkTierActive ? ' [30+ Bulk Xerox @ ₹1.75]' : ''),
      date: new Date().toISOString().slice(0, 10)
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handlePrintSlip = () => {
    const printWin = window.open('', '_blank');
    if (!printWin) {
      alert('Please allow popups to print receipt.');
      return;
    }

    const itemsHtml = activeItems
      .map((i) => {
        const effRate = getItemEffectiveRate(i);
        const total = calculateItemTotal(i);
        const isBulk = bulkTierEnabled && i.id === 'pr-1' && i.qty > 30;
        return `
        <tr>
          <td style="padding: 5px 0; font-size: 11px;">
            ${i.nameEn}
            ${isBulk ? '<br><small style="color:#0284c7;">(Bulk 30+ Special Rate @ Rs 1.75)</small>' : ''}
          </td>
          <td style="text-align: center; font-size: 11px;">${i.qty}</td>
          <td style="text-align: center; font-size: 11px;">Rs ${effRate}</td>
          <td style="text-align: right; font-size: 11px; font-weight: bold;">Rs ${total.toFixed(2)}</td>
        </tr>
      `;
      })
      .join('');

    let statusHtml = '';
    if (paymentStatus === 'Paid') {
      statusHtml = `<div style="display:flex; justify-content:space-between; color: green; font-weight:bold; font-size:12px; margin-top:4px;"><span>Status:</span><span>PAID (Rs ${grandTotal.toFixed(2)})</span></div>`;
    } else if (paymentStatus === 'Advance') {
      statusHtml = `
        <div style="display:flex; justify-content:space-between; color: #b45309; font-weight:bold; font-size:11px; margin-top:4px;"><span>Advance Paid:</span><span>Rs ${advanceAmount.toFixed(2)}</span></div>
        <div style="display:flex; justify-content:space-between; color: #dc2626; font-weight:bold; font-size:12px; margin-top:2px;"><span>Remaining Due:</span><span>Rs ${calculatedDue.toFixed(2)}</span></div>
      `;
    } else {
      statusHtml = `<div style="display:flex; justify-content:space-between; color: #dc2626; font-weight:bold; font-size:12px; margin-top:4px;"><span>Status:</span><span>DUE / UNPAID (Rs ${grandTotal.toFixed(2)})</span></div>`;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cyber Café Bill Receipt</title>
          <style>
            body { font-family: monospace, sans-serif; font-size: 12px; margin: 0; padding: 16px; width: 280px; color: #111; }
            .header { text-align: center; border-bottom: 1px dashed #333; padding-bottom: 8px; margin-bottom: 8px; }
            .header h3 { margin: 0; font-size: 15px; font-weight: bold; }
            .header p { margin: 2px 0; font-size: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 6px; }
            th { border-bottom: 1px solid #333; text-align: left; font-size: 10px; padding: 3px 0; }
            .total-row { border-top: 1px dashed #333; border-bottom: 1px dashed #333; padding: 6px 0; margin-top: 6px; }
            .footer { text-align: center; font-size: 9px; margin-top: 12px; color: #666; border-top: 1px dotted #ccc; padding-top: 6px; }
          </style>
        </head>
        <body onload="window.print();">
          <div class="header">
            <h3>DIGITAL SEVA PORTAL</h3>
            <p>Cyber Café & Online Citizen Services</p>
            <p>Date: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            ${customerName ? `<p style="font-weight:bold; margin-top:4px;">Customer: ${customerName}</p>` : ''}
            ${customerMobile ? `<p>Mobile: ${customerMobile}</p>` : ''}
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 50%;">Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: center;">Rate</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="total-row">
            <div style="display:flex; justify-content:space-between; font-size: 11px;">
              <span>Subtotal:</span>
              <span>Rs ${subtotal.toFixed(2)}</span>
            </div>
            ${discount > 0 ? `<div style="display:flex; justify-content:space-between; font-size: 10px; color:#16a34a;"><span>Discount:</span><span>-Rs ${discount.toFixed(2)}</span></div>` : ''}
            <div style="display:flex; justify-content:space-between; font-size: 14px; font-weight:bold; margin-top: 4px; padding-top: 4px; border-top: 1px solid #ddd;">
              <span>TOTAL BILL:</span>
              <span>Rs ${grandTotal.toFixed(2)}</span>
            </div>
            ${statusHtml}
          </div>
          ${notes ? `<p style="font-size:10px; margin: 4px 0;">Note/ID: ${notes}</p>` : ''}
          <div class="footer">
            <p>Thank you for choosing our service! Please visit again.</p>
            <p>Digital Seva Cyber Café</p>
          </div>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  const handleShareWhatsApp = () => {
    if (!customerMobile.trim()) {
      alert(language === 'bn' ? 'দয়া করে আগে গ্রাহকের মোবাইল নম্বর লিখুন।' : 'Please enter customer mobile number first.');
      return;
    }
    const cleanMobile = customerMobile.replace(/\D/g, '');
    const mobileWithCode = cleanMobile.length === 10 ? '91' + cleanMobile : cleanMobile;
    
    let paymentText = '';
    if (paymentStatus === 'Paid') {
      paymentText = `*Payment Status:* PAID in full (₹${grandTotal})`;
    } else if (paymentStatus === 'Advance') {
      paymentText = `*Payment Status:* ADVANCE PAID\n*Advance Received:* ₹${advanceAmount}\n*Remaining Due:* ₹${calculatedDue}`;
    } else {
      paymentText = `*Payment Status:* DUE / PENDING (₹${grandTotal})`;
    }

    const itemsText = activeItems
      .map(i => {
        const isBulk = bulkTierEnabled && i.id === 'pr-1' && i.qty > 30;
        return `• ${i.nameEn} (Qty: ${i.qty} @ ₹${getItemEffectiveRate(i)}${isBulk ? ' [30+ Bulk Rate]' : ''}) = ₹${calculateItemTotal(i).toFixed(2)}`;
      })
      .join('\n');

    const text = encodeURIComponent(
      `*Digital Seva Cyber Café Bill Receipt*\n` +
      `--------------------------------\n` +
      `*Customer:* ${customerName || 'Customer'}\n` +
      `*Date:* ${new Date().toLocaleDateString('en-GB')}\n` +
      `--------------------------------\n` +
      `*Services:*\n${itemsText}\n` +
      `--------------------------------\n` +
      `*Total Amount:* ₹${grandTotal}\n` +
      `${paymentText}\n` +
      (notes ? `*Ref / App ID:* ${notes}\n` : '') +
      `--------------------------------\n` +
      `Thank you for visiting! 🙏`
    );
    window.open(`https://wa.me/${mobileWithCode}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 md:p-7 shadow-xs">
      
      {/* Header & Bulk Tier Info Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              {language === 'bn' ? 'সাইবার ক্যাফে বিলিং ও রেট ক্যালকুলেটর' : 'Cyber Café Instant Billing & Rate Calculator'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'bn'
                ? 'জেরক্স (৩০+ পেজ ₹১.৭৫), চাকরির ও স্কিম ফর্ম ফিলাপ (₹৩০) এবং অ্যাডভান্স/ডিউ/পেইড হিসাবসহ দ্রুত বিলিং।'
                : 'Bulk Xerox (>30 pgs @ ₹1.75), Job & Scheme form fees (₹30), and Advance/Due/Paid tracking.'}
            </p>
          </div>

          {/* Special Rates Quick Highlights */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-[11px] font-bold text-amber-800 dark:text-amber-300">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'bn' ? '৩০+ জেরক্স: ₹১.৭৫/পেজ' : '30+ Xerox: ₹1.75/pg'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-[11px] font-bold text-blue-800 dark:text-blue-300">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'bn' ? 'ফর্ম ফিলাপ: ₹৩০' : 'Form Fill-up: ₹30'}</span>
            </div>
          </div>
        </div>

        {/* Quick Bulk Presets Bar */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600 dark:text-slate-400 text-[11px]">
              {language === 'bn' ? '⚡ কুইক জেরক্স প্রি-সেট:' : '⚡ Quick Xerox Pre-set:'}
            </span>
            <div className="flex items-center gap-1">
              {[10, 20, 30, 40, 50, 100].map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setItemDirectQty('pr-1', qty)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold font-mono transition cursor-pointer ${
                    xeroxItem && xeroxItem.qty === qty
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  } ${qty >= 31 ? 'ring-1 ring-amber-400/60' : ''}`}
                >
                  {qty}P {qty > 30 ? '(@₹1.75)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Add Job & Scheme Forms */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => updateQty('pr-job', 1)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold hover:bg-emerald-100 transition cursor-pointer"
            >
              <Briefcase className="w-3 h-3" />
              <span>+ {language === 'bn' ? 'চাকরির ফর্ম (₹৩০)' : 'Job Form (₹30)'}</span>
            </button>
            <button
              type="button"
              onClick={() => updateQty('pr-scheme', 1)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[11px] font-bold hover:bg-purple-100 transition cursor-pointer"
            >
              <FileCheck className="w-3 h-3" />
              <span>+ {language === 'bn' ? 'স্কিম ফর্ম (₹৩০)' : 'Scheme Form (₹30)'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Service Items Grid */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              {language === 'bn' ? 'সার্ভিস আইটেম ও রেট তালিকা' : 'Service Items & Rates'}
            </span>
            <button
              type="button"
              onClick={() => setItems((prev) => prev.map((i) => ({ ...i, qty: 0 })))}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              {language === 'bn' ? 'সব খালি করুন' : 'Reset All'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[440px] overflow-y-auto pr-1 scrollbar-thin">
            {items.map((item) => {
              const effRate = getItemEffectiveRate(item);
              const itemTotal = calculateItemTotal(item);
              const isXeroxBulk = bulkTierEnabled && item.id === 'pr-1' && item.qty > 30;
              const isJobOrScheme = item.id === 'pr-job' || item.id === 'pr-scheme';

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    item.qty > 0
                      ? isXeroxBulk
                        ? 'border-amber-500/80 bg-amber-50/40 dark:bg-amber-950/30 ring-1 ring-amber-500/30'
                        : isJobOrScheme
                        ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/30'
                        : 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white block leading-tight">
                        {language === 'bn' ? item.nameBn : item.nameEn}
                      </span>
                      {item.unit && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {item.unit}
                        </span>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                        ₹{effRate}
                      </div>
                      {isXeroxBulk && (
                        <span className="text-[9px] text-slate-400 line-through">
                          ₹{item.rate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Xerox 30+ Alert Badge */}
                  {item.id === 'pr-1' && (
                    <div className="mt-1.5 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px]">
                      {isXeroxBulk ? (
                        <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 font-bold bg-amber-100/70 dark:bg-amber-950/80 px-2 py-0.5 rounded-md">
                          <span>🔥 {language === 'bn' ? '৩০+ পেজ রেট প্রযোজ্য' : '30+ Bulk Tier Active'}</span>
                          <span>{language === 'bn' ? `সাশ্রয়: ₹${xeroxSavings.toFixed(1)}` : `Save ₹${xeroxSavings.toFixed(1)}`}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px]">
                          {language === 'bn' ? '💡 ৩০ পেজের বেশি জেরক্সে ₹১.৭৫/পেজ' : '💡 >30 pages bulk rate: ₹1.75/pg'}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Qty Stepper */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 font-mono">
                      {item.qty > 0 ? `Total: ₹${itemTotal.toFixed(2)}` : 'Qty: 0'}
                    </span>
                    
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-0.5 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg font-bold cursor-pointer transition active:scale-95"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={item.qty}
                        onChange={(e) => handleQtyInput(item.id, Number(e.target.value))}
                        className="w-10 text-center text-xs font-bold bg-transparent outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg font-bold cursor-pointer transition active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Customer Info, Payment Status (Advance/Due/Paid) & Checkout */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-200 dark:border-slate-700 pb-2.5 mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-600" />
                {language === 'bn' ? 'বিল ও পেমেন্ট বিবরণ' : 'Billing & Payment Details'}
              </h3>
              <span className="text-[11px] font-bold text-slate-500">
                {activeItems.length} {language === 'bn' ? 'আইটেম' : 'Items'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Customer Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    {language === 'bn' ? 'গ্রাহকের নাম' : 'Customer Name'}
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={language === 'bn' ? 'গ্রাহকের নাম লিখুন' : 'Customer Name'}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
                  </label>
                  <input
                    type="text"
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    placeholder={language === 'bn' ? '১০ সংখ্যার মোবাইল' : 'Mobile Number'}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xs"
                  />
                </div>
              </div>

              {/* PAYMENT STATUS TOGGLE: Paid | Advance | Due */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1.5 font-bold flex items-center justify-between">
                  <span>{language === 'bn' ? 'পেমেন্ট স্ট্যাটাস (Payment Status) *' : 'Payment Status *'}</span>
                  <span className="text-[10px] font-normal text-slate-500">
                    {paymentStatus === 'Paid' ? 'Full Paid' : (paymentStatus === 'Advance' ? 'Partial Advance' : 'Full Due')}
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-200/80 dark:bg-slate-900/80 p-1 rounded-2xl border border-slate-300/80 dark:border-slate-700/80">
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('Paid')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      paymentStatus === 'Paid'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Paid</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentStatus('Advance');
                      if (advanceAmount === 0 && grandTotal > 0) {
                        setAdvanceAmount(Math.round(grandTotal / 2));
                      }
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      paymentStatus === 'Advance'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Advance</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentStatus('Due');
                      setAdvanceAmount(0);
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      paymentStatus === 'Due'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Due</span>
                  </button>
                </div>
              </div>

              {/* Conditional Advance Amount Input */}
              {paymentStatus === 'Advance' && (
                <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/60 rounded-2xl space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                      {language === 'bn' ? 'অগ্রিম জমা (Advance Received ₹)' : 'Advance Paid (₹)'}
                    </label>
                    <div className="flex gap-1">
                      {[20, 50, 100].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setAdvanceAmount(amt)}
                          className="px-1.5 py-0.5 rounded bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-[10px] font-bold"
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={grandTotal}
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-xl px-3 py-1.5 font-mono text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <div className="flex justify-between text-[11px] font-semibold text-amber-900 dark:text-amber-300 pt-1 border-t border-amber-200 dark:border-amber-800/60">
                    <span>{language === 'bn' ? 'বাকি পাওনা (Remaining Due):' : 'Remaining Due:'}</span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">₹{calculatedDue.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Discount & Notes */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    {language === 'bn' ? 'ডিসকাউন্ট (ছাড় ₹)' : 'Discount (₹)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 font-mono outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    {language === 'bn' ? 'নোট / রেজিস্ট্রেশন আইডি' : 'Notes / App ID'}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'bn' ? 'ঐচ্ছিক তথ্য' : 'Optional notes'}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 outline-none text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Grand Total & Summary Card */}
            <div className="mt-3.5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-4 space-y-1.5 shadow-md">
              <div className="flex justify-between text-xs text-blue-100">
                <span>Subtotal ({activeItems.reduce((a, b) => a + b.qty, 0)} items):</span>
                <span className="font-mono font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              {xeroxSavings > 0 && (
                <div className="flex justify-between text-[11px] text-amber-200 font-semibold">
                  <span>Bulk Xerox 30+ Savings:</span>
                  <span className="font-mono">-₹{xeroxSavings.toFixed(2)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-xs text-emerald-200 font-semibold">
                  <span>Discount:</span>
                  <span className="font-mono">-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-extrabold pt-2 border-t border-blue-400/40">
                <span>{language === 'bn' ? 'মোট বিল (Total):' : 'Total Amount:'}</span>
                <span className="font-mono text-2xl">₹{grandTotal.toFixed(2)}</span>
              </div>

              {/* Status breakdown indicator inside bill box */}
              <div className="pt-2 border-t border-blue-400/30 flex items-center justify-between text-xs font-semibold">
                {paymentStatus === 'Paid' && (
                  <span className="flex items-center gap-1 text-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'পরিশোধ: ₹' + grandTotal.toFixed(2) : 'Fully Paid: ₹' + grandTotal.toFixed(2)}</span>
                  </span>
                )}
                {paymentStatus === 'Advance' && (
                  <div className="w-full flex justify-between text-amber-100">
                    <span>{language === 'bn' ? `জমা: ₹${advanceAmount}` : `Paid: ₹${advanceAmount}`}</span>
                    <span className="text-rose-200 font-bold">{language === 'bn' ? `বাকি: ₹${calculatedDue}` : `Due: ₹${calculatedDue}`}</span>
                  </div>
                )}
                {paymentStatus === 'Due' && (
                  <span className="flex items-center gap-1 text-rose-200 font-bold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'সম্পূর্ণ বাকি: ₹' + grandTotal.toFixed(2) : 'Full Due: ₹' + grandTotal.toFixed(2)}</span>
                  </span>
                )}
              </div>
            </div>

            {savedSuccess && (
              <div className="mt-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs p-2.5 rounded-xl flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === 'bn' ? 'খাতা রেজিস্টারে সফলভাবে সংরক্ষিত হয়েছে!' : 'Saved to Khata Register successfully!'}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSaveToKhata}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>{language === 'bn' ? 'খাতায় এন্ট্রি করুন' : 'Save to Khata'}</span>
              </button>
              <button
                type="button"
                onClick={handlePrintSlip}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{language === 'bn' ? 'রসিদ প্রিন্ট' : 'Print Slip'}</span>
              </button>
            </div>

            {customerMobile && (
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full py-2.5 px-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer active:scale-98"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'bn' ? 'গ্রাহককে হোয়াটসঅ্যাপে রসিদ পাঠান' : 'Send Receipt to WhatsApp'}</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
