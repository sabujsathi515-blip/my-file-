import React, { useState } from 'react';
import { Calculator, Printer, CheckCircle2, DollarSign, Plus, Minus, UserCheck, MessageSquare, Receipt } from 'lucide-react';
import { Language, PriceSetting } from '../../types';

interface BillingItem {
  id: string;
  nameEn: string;
  nameBn: string;
  rate: number;
  qty: number;
}

export const PrintBillingCalculator: React.FC<{
  language: Language;
  prices: PriceSetting[];
  onSaveToRegister: (customer: { customerName: string; mobile: string; serviceTaken: string; amount: number; paymentStatus: 'Paid' | 'Due'; printCount: number; scanCount: number; notes: string; date: string }) => void;
}> = ({ language, prices, onSaveToRegister }) => {
  const [items, setItems] = useState<BillingItem[]>(() =>
    prices.map((p) => ({
      id: p.id,
      nameEn: p.serviceNameEn,
      nameBn: p.serviceNameBn,
      rate: p.rate,
      qty: 0
    }))
  );

  const [customerName, setCustomerName] = useState<string>('');
  const [customerMobile, setCustomerMobile] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Due'>('Paid');
  const [notes, setNotes] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

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

  const subtotal = items.reduce((acc, curr) => acc + curr.rate * curr.qty, 0);
  const grandTotal = Math.max(0, subtotal - discount);
  const changeToReturn = Math.max(0, cashReceived - grandTotal);
  const activeItems = items.filter((i) => i.qty > 0);

  const handleSaveToKhata = () => {
    if (grandTotal === 0 && !customerName.trim()) {
      alert('Please add at least one service item or customer name.');
      return;
    }

    const serviceSummary = activeItems.map((i) => `${language === 'bn' ? i.nameBn : i.nameEn} (x${i.qty})`).join(', ') || 'Cyber Café Walk-in Service';
    const printCount = items.find((i) => i.id === 'pr-1')?.qty || 0;
    const scanCount = items.find((i) => i.id === 'pr-6')?.qty || 0;

    onSaveToRegister({
      customerName: customerName.trim() || 'Walk-in Customer',
      mobile: customerMobile.trim() || 'N/A',
      serviceTaken: serviceSummary,
      amount: grandTotal,
      paymentStatus,
      printCount,
      scanCount,
      notes: notes.trim(),
      date: new Date().toISOString().slice(0, 10)
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePrintSlip = () => {
    const printWin = window.open('', '_blank');
    if (!printWin) {
      alert('Please allow popups to print receipt.');
      return;
    }

    const itemsHtml = activeItems
      .map(
        (i) => `
      <tr>
        <td style="padding: 4px 0; font-size: 12px;">${i.nameEn}</td>
        <td style="text-align: center; font-size: 12px;">${i.qty}</td>
        <td style="text-align: right; font-size: 12px;">₹${i.rate * i.qty}</td>
      </tr>
    `
      )
      .join('');

    printWin.document.write(`
      <html>
        <head>
          <title>Customer Receipt</title>
          <style>
            body { font-family: monospace; font-size: 12px; margin: 0; padding: 15px; width: 300px; }
            .header { text-align: center; border-bottom: 1px dashed #333; padding-bottom: 8px; margin-bottom: 8px; }
            .total-row { border-top: 1px dashed #333; border-bottom: 1px dashed #333; padding: 6px 0; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; }
            .footer { text-align: center; font-size: 10px; margin-top: 12px; color: #555; }
          </style>
        </head>
        <body onload="window.print();">
          <div class="header">
            <h3 style="margin:0; font-size: 16px;">DIGITAL SEVA PORTAL</h3>
            <p style="margin:2px 0;">Cyber Café & Digital Services</p>
            <p style="margin:2px 0; font-size: 11px;">Date: ${new Date().toLocaleDateString()}</p>
            ${customerName ? `<p style="margin:2px 0; font-size: 11px;">Customer: ${customerName}</p>` : ''}
          </div>
          <table>
            <thead>
              <tr style="border-bottom: 1px solid #ccc; font-size: 11px;">
                <th style="text-align: left;">Item</th>
                <th>Qty</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="total-row" style="margin-top: 8px;">
            <div style="display:flex; justify-content:space-between;">
              <span>Subtotal:</span>
              <span>₹${subtotal}</span>
            </div>
            ${discount > 0 ? `<div style="display:flex; justify-content:space-between; font-size: 11px;"><span>Discount:</span><span>-₹${discount}</span></div>` : ''}
            <div style="display:flex; justify-content:space-between; font-size: 14px; margin-top: 4px;">
              <span>TOTAL:</span>
              <span>₹${grandTotal}</span>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for visiting! Please come again.</p>
            <p>Generated via Digital Seva Portal</p>
          </div>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  const handleShareWhatsApp = () => {
    if (!customerMobile.trim()) {
      alert('Please enter customer mobile number first.');
      return;
    }
    const cleanMobile = customerMobile.replace(/\D/g, '');
    const mobileWithCode = cleanMobile.length === 10 ? '91' + cleanMobile : cleanMobile;
    const text = encodeURIComponent(
      `*Digital Seva Cyber Café Bill Receipt*\nCustomer: ${customerName || 'Customer'}\nDate: ${new Date().toLocaleDateString()}\nTotal Amount: ₹${grandTotal}\nStatus: ${paymentStatus}\nThank you!`
    );
    window.open(`https://wa.me/${mobileWithCode}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-7 shadow-sm">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          {language === 'bn' ? 'সাইবার ক্যাফে ইনস্ট্যান্ট বিলিং ও খরচ ক্যালকুলেটর' : 'Cyber Café Instant Billing & Cost Calculator'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {language === 'bn'
            ? 'প্রিন্ট, স্ক্যান, জেরক্স ও ফর্ম ফিলাপ খরচের দ্রুত হিসাব করুন এবং সরাসরি গ্রাহকের স্লিপ প্রিন্ট বা খাতা রেজিস্টারে সেভ করুন।'
            : 'Fast calculation for customer printing, scanning, and form fees with instant receipt generation and Khata register saving.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Items Grid */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {language === 'bn' ? 'পরিষেবা ও রেট তালিকা' : 'Service Rate List'}
            </span>
            <button
              type="button"
              onClick={() => setItems((prev) => prev.map((i) => ({ ...i, qty: 0 })))}
              className="text-xs text-blue-600 hover:underline"
            >
              {language === 'bn' ? 'রিসেট করুন' : 'Reset All'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all ${
                  item.qty > 0
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30'
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                    {language === 'bn' ? item.nameBn : item.nameEn}
                  </span>
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    ₹{item.rate}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-500">
                    {item.qty > 0 ? `Total: ₹${item.rate * item.qty}` : 'Qty'}
                  </span>
                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleQtyInput(item.id, Number(e.target.value))}
                      className="w-9 text-center text-xs font-bold bg-transparent outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Bill Summary & Register Save */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-600" />
              {language === 'bn' ? 'বিল ও গ্রাহকের তথ্য' : 'Customer & Billing Summary'}
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">
                {language === 'bn' ? 'গ্রাহকের নাম' : 'Customer Name'}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">
                {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
              </label>
              <input
                type="text"
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                placeholder="e.g. 9832100000"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'bn' ? 'ডিসকাউন্ট (ছাড় ₹)' : 'Discount (₹)'}
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 font-mono outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'bn' ? 'পেমেন্ট স্ট্যাটাস' : 'Payment Status'}
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as 'Paid' | 'Due')}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 font-semibold outline-none"
                >
                  <option value="Paid">Paid (পরিশোধ)</option>
                  <option value="Due">Due (বাকি)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">
                {language === 'bn' ? 'নোট / রেজিস্ট্রেশন নম্বর' : 'Notes / App ID'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes or form reg ID"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none"
              />
            </div>
          </div>

          {/* Grand Total Box */}
          <div className="bg-blue-600 text-white rounded-xl p-4 space-y-1 shadow-sm">
            <div className="flex justify-between text-xs text-blue-100">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs text-blue-200">
                <span>Discount:</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-lg font-extrabold pt-1 border-t border-blue-500">
              <span>{language === 'bn' ? 'মোট দেয় বিল:' : 'Total Amount:'}</span>
              <span className="font-mono text-xl">₹{grandTotal}</span>
            </div>
          </div>

          {savedSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs p-2.5 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {language === 'bn' ? 'খাতা রেজিস্টারে সেভ সম্পন্ন হয়েছে!' : 'Successfully saved to Customer Register!'}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleSaveToKhata}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <UserCheck className="w-3.5 h-3.5" />
              {language === 'bn' ? 'খাতায় সেভ করুন' : 'Save to Khata'}
            </button>
            <button
              type="button"
              onClick={handlePrintSlip}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              {language === 'bn' ? 'রসিদ প্রিন্ট' : 'Print Slip'}
            </button>
          </div>

          {customerMobile && (
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="w-full py-2 px-3 rounded-xl bg-green-600/10 hover:bg-green-600/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {language === 'bn' ? 'গ্রাহককে হোয়াটসঅ্যাপে রসিদ পাঠান' : 'Send Bill on WhatsApp'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
