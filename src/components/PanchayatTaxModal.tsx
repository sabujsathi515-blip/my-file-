import React, { useState, useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ExternalLink, 
  Building2, 
  FileCheck2, 
  ShieldCheck, 
  QrCode, 
  Landmark, 
  CheckCircle2, 
  Search,
  Receipt,
  FileText,
  Calendar,
  User,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { Language } from '../types';

interface PanchayatTaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const PanchayatTaxModal: React.FC<PanchayatTaxModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'apply' | 'download_form'>('generate');

  // Form State for Certificate
  const [district, setDistrict] = useState('Purba Medinipur');
  const [block, setBlock] = useState('Tamluk');
  const [gpName, setGpName] = useState('Sreerampur Gram Panchayat');
  const [mouza, setMouza] = useState('Sreerampur');
  const [jlNo, setJlNo] = useState('142');
  const [holdingNo, setHoldingNo] = useState('H/2026/0892');
  const [assessmentNo, setAssessmentNo] = useState('ASS-78412');
  const [taxpayerName, setTaxpayerName] = useState('Animesh Maity');
  const [guardianName, setGuardianName] = useState('Late Birendra Maity');
  const [mobile, setMobile] = useState('9832014567');
  const [financialYear, setFinancialYear] = useState('2026-2027');
  const [taxAmount, setTaxAmount] = useState('180');
  const [paymentDate, setPaymentDate] = useState('2026-09-01');
  const [receiptNo, setReceiptNo] = useState('GP-TAX-2026-9812');

  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const wbDistricts = [
    'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 
    'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 
    'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 
    'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur', 
    'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 
    'Uttar Dinajpur'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/20">
              <Landmark className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/30 text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                WB PRD • Gram Panchayat Tax Hub
              </div>
              <h2 className="text-lg sm:text-xl font-bold">
                {language === 'bn' ? 'গ্রাম পঞ্চায়েত ট্যাক্স সার্টিফিকেট ও অনলাইন আবেদন' : 'Panchayat Tax Assessment & Form 4 Certificate'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'generate'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <Receipt className="w-4 h-4" />
            {language === 'bn' ? 'ট্যাক্স সার্টিফিকেট (ফর্ম ৪) ডাউনলোড / প্রিন্ট' : 'Form 4 Tax Certificate Generator'}
          </button>

          <button
            onClick={() => setActiveTab('apply')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'apply'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            {language === 'bn' ? 'অনলাইন ট্যাক্স প্রদান ও স্টেট পোর্টাল' : 'Online Tax Payment (PRD Portal)'}
          </button>

          <button
            onClick={() => setActiveTab('download_form')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'download_form'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <Download className="w-4 h-4" />
            {language === 'bn' ? 'অফিসিয়াল ফর্ম ডাউনলোড' : 'Download Blank Forms'}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'generate' && (
            <div className="space-y-6">
              {/* Form Input Controls */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {language === 'bn' ? 'ট্যাক্স সার্টিফিকেটের বিবরণ লিখুন' : 'Enter Assessment & Taxpayer Details'}
                  </h3>
                  <button
                    onClick={() => {
                      setReceiptNo(`GP-TAX-${financialYear.split('-')[0]}-${Math.floor(1000 + Math.random() * 9000)}`);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {language === 'bn' ? 'রসিদ নম্বর রিফ্রেশ' : 'New Receipt No'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      {language === 'bn' ? 'জেলা (District)' : 'District'}
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500"
                    >
                      {wbDistricts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      {language === 'bn' ? 'ব্লক (Block)' : 'Block / Panchayat Samiti'}
                    </label>
                    <input
                      type="text"
                      value={block}
                      onChange={(e) => setBlock(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500"
                      placeholder="e.g. Tamluk / Barasat"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      {language === 'bn' ? 'গ্রাম পঞ্চায়েত (Gram Panchayat)' : 'Gram Panchayat Name'}
                    </label>
                    <input
                      type="text"
                      value={gpName}
                      onChange={(e) => setGpName(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500"
                      placeholder="e.g. Sreerampur GP"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      {language === 'bn' ? 'করদাতার নাম (Taxpayer Name)' : 'Taxpayer / Owner Name'}
                    </label>
                    <input
                      type="text"
                      value={taxpayerName}
                      onChange={(e) => setTaxpayerName(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      {language === 'bn' ? 'পিতা / স্বামীর নাম (Father/Husband)' : 'Father / Husband Name'}
                    </label>
                    <input
                      type="text"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      {language === 'bn' ? 'হোল্ডিং নম্বর (Holding No.)' : 'Holding Number'}
                    </label>
                    <input
                      type="text"
                      value={holdingNo}
                      onChange={(e) => setHoldingNo(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      {language === 'bn' ? 'মৌজা ও জে.এল নং (Mouza & JL)' : 'Mouza & JL No.'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={mouza}
                        onChange={(e) => setMouza(e.target.value)}
                        placeholder="Mouza"
                        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 outline-none"
                      />
                      <input
                        type="text"
                        value={jlNo}
                        onChange={(e) => setJlNo(e.target.value)}
                        placeholder="JL No"
                        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      {language === 'bn' ? 'অর্থবর্ষ (Financial Year)' : 'Financial Year'}
                    </label>
                    <select
                      value={financialYear}
                      onChange={(e) => setFinancialYear(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none"
                    >
                      <option value="2026-2027">2026-2027 (Current)</option>
                      <option value="2025-2026">2025-2026</option>
                      <option value="2024-2025">2024-2025</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      {language === 'bn' ? 'পরিশোধিত কর (Amount ₹)' : 'Tax Amount Paid (₹)'}
                    </label>
                    <input
                      type="number"
                      value={taxAmount}
                      onChange={(e) => setTaxAmount(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'bn' ? 'সার্টিফিকেট রেডি! নিচের প্রিভিউ দেখে প্রিন্ট বা সেভ করুন।' : 'Certificate ready! Review live preview below and print.'}</span>
                </div>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  {language === 'bn' ? 'সার্টিফিকেট প্রিন্ট / PDF ডাউনলোড' : 'Print / Download Certificate'}
                </button>
              </div>

              {/* Printable Certificate Preview */}
              <div 
                ref={certificateRef}
                className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl border-2 border-slate-300 shadow-lg relative overflow-hidden font-serif"
                style={{ minHeight: '480px' }}
              >
                {/* Certificate Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
                  <Landmark className="w-96 h-96 text-emerald-900" />
                </div>

                {/* Header Top */}
                <div className="text-center border-b-2 border-emerald-900 pb-4 mb-5">
                  <div className="text-xs font-sans uppercase font-bold tracking-widest text-emerald-800">
                    Government of West Bengal • Department of Panchayats & Rural Development
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase mt-1 tracking-wide">
                    {gpName.toUpperCase()}
                  </h1>
                  <p className="text-xs text-slate-600 font-sans mt-0.5">
                    Block: {block}, District: {district}, West Bengal
                  </p>
                  <div className="inline-block mt-2 px-4 py-1 bg-emerald-900 text-white text-xs font-sans font-bold uppercase tracking-wider rounded-md">
                    FORM 4 • PROPERTY / HOLDING TAX CLEARANCE RECEIPT & CERTIFICATE
                  </div>
                  <div className="text-[11px] font-sans text-slate-700 mt-1 font-semibold">
                    (পশ্চিমবঙ্গ পঞ্চায়েত আইন অনুচ্ছেদ অনুযায়ী কর আদায়ের শংসাপত্র ও রসিদ)
                  </div>
                </div>

                {/* Receipt Meta */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans bg-slate-100 p-3 rounded-lg border border-slate-300 mb-5">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Receipt No:</span>
                    <span className="font-mono font-bold text-slate-800">{receiptNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Assessment Year:</span>
                    <span className="font-bold text-slate-800">{financialYear}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Holding No:</span>
                    <span className="font-bold text-slate-800">{holdingNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Date of Issue:</span>
                    <span className="font-bold text-slate-800">{paymentDate}</span>
                  </div>
                </div>

                {/* Certificate Body */}
                <div className="text-xs sm:text-sm leading-relaxed space-y-3.5 text-slate-800 mb-6">
                  <p>
                    This is to certify that <strong>Sri / Smt. {taxpayerName}</strong>, 
                    son/daughter/wife of <strong>{guardianName}</strong>, 
                    holding assessment identification <strong>{holdingNo}</strong> (Assessment ID: {assessmentNo}), 
                    situated at Mouza: <strong>{mouza}</strong>, J.L. No: <strong>{jlNo}</strong> under 
                    <strong> {gpName}</strong>, has fully paid and cleared the assessed Gram Panchayat Property / Structure Tax 
                    for the Financial Year <strong>{financialYear}</strong>.
                  </p>
                  <p className="text-slate-700">
                    এদ্বারা প্রত্যয়ন করা যাইতেছে যে, <strong>{taxpayerName}</strong>, 
                    পিতা/স্বামী: <strong>{guardianName}</strong>, 
                    হোল্ডিং নং: <strong>{holdingNo}</strong>, মৌজা: <strong>{mouza}</strong>, জে.এল নং: <strong>{jlNo}</strong>, 
                    {financialYear} অর্থবর্ষের যাবতীয় পঞ্চায়েত কর বাবদ নির্ধারিত অর্থ সর্বমোট <strong>₹{taxAmount}/- (টাকা)</strong> সম্পূর্ণ পরিশোধ করিয়াছেন।
                  </p>
                </div>

                {/* Tax Breakdown Table */}
                <table className="w-full text-xs font-sans border-collapse border border-slate-300 mb-6">
                  <thead>
                    <tr className="bg-slate-200/80 text-slate-800">
                      <th className="border border-slate-300 p-2 text-left">Sl. Particulars / বিবরণ</th>
                      <th className="border border-slate-300 p-2 text-center">Period / অর্থবর্ষ</th>
                      <th className="border border-slate-300 p-2 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">Gram Panchayat Structure / Holding Tax</td>
                      <td className="border border-slate-300 p-2 text-center">{financialYear}</td>
                      <td className="border border-slate-300 p-2 text-right font-mono font-bold">₹{taxAmount}.00</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <td className="border border-slate-300 p-2 text-right" colSpan={2}>Total Amount Received (সর্বমোট প্রাপ্ত কর):</td>
                      <td className="border border-slate-300 p-2 text-right font-mono text-emerald-800">₹{taxAmount}.00</td>
                    </tr>
                  </tbody>
                </table>

                {/* Footer Stamp & Signatures */}
                <div className="flex items-end justify-between pt-4 border-t border-slate-300 text-xs font-sans">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded p-1 flex items-center justify-center">
                      <QrCode className="w-14 h-14 text-slate-800" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Digital QR Verification</div>
                      <div className="text-[10px] font-mono text-slate-600">ID: PRD-WB-{receiptNo}</div>
                      <div className="text-[9px] text-emerald-700 font-bold">✓ Digitally Validated Document</div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="h-10"></div>
                    <div className="font-bold text-slate-900 border-t border-slate-800 pt-1">
                      Authorized Signatory / Executive Assistant
                    </div>
                    <div className="text-[10px] text-slate-600">{gpName}, {district}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apply' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200 mb-2 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {language === 'bn' ? 'অনলাইন পঞ্চায়েত ট্যাক্স প্রদান পোর্টাল (PRD Online)' : 'WB PRD Online Panchayat Tax Portal'}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed mb-4">
                  {language === 'bn'
                    ? 'পশ্চিমবঙ্গ পঞ্চায়েত ও গ্রামোন্নয়ন দপ্তরের অফিশিয়াল পোর্টালের মাধ্যমে আপনার গ্রাম পঞ্চায়েতের হোল্ডিং কর সরাসরি অনলাইনে পেমেন্ট করুন এবং সরকারি ডিজিটাল রসিদ সংগ্রহ করুন।'
                    : 'Pay your Gram Panchayat holding tax online through the official West Bengal Panchayats & Rural Development portal and download instant QR-verified digital receipts.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="https://wbprd.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-xl hover:shadow-md transition text-slate-800 dark:text-slate-100 group"
                  >
                    <div>
                      <div className="font-bold text-xs">WB PRD Official Portal</div>
                      <div className="text-[11px] text-slate-500">wbprd.gov.in</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition" />
                  </a>

                  <a
                    href="https://prdonline.wb.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-xl hover:shadow-md transition text-slate-800 dark:text-slate-100 group"
                  >
                    <div>
                      <div className="font-bold text-xs">PRD Online Tax Assessment</div>
                      <div className="text-[11px] text-slate-500">prdonline.wb.gov.in</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition" />
                  </a>
                </div>
              </div>

              {/* Step-by-step Guide */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                  {language === 'bn' ? 'ট্যাক্স পেমেন্ট ও সার্টিফিকেট পাওয়ার নিয়মাবলী' : 'Step-by-Step Procedure'}
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <li>{language === 'bn' ? 'অফিশিয়াল পোর্টালে আপনার জেলা, ব্লক ও গ্রাম পঞ্চায়েত নির্বাচন করুন।' : 'Select District, Block and Gram Panchayat on the PRD Portal.'}</li>
                  <li>{language === 'bn' ? 'হোল্ডিং নম্বর বা এসেসমেন্ট নম্বর দিয়ে বকেয়া ট্যাক্সের পরিমাণ দেখুন।' : 'Enter Holding Number or Assessment ID to view current tax assessment.'}</li>
                  <li>{language === 'bn' ? 'UPI, ডেবিট কার্ড বা নেট ব্যাঙ্কিংয়ের মাধ্যমে ট্যাক্স জমা করুন।' : 'Make payment through UPI, Debit Card or Net Banking.'}</li>
                  <li>{language === 'bn' ? 'পেমেন্ট সফল হলে ফর্ম ৪ ট্যাক্স সার্টিফিকেট তাৎক্ষণিক ডাউনলোড করুন।' : 'Download Form 4 Tax Certificate with official QR code on successful payment.'}</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'download_form' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                        {language === 'bn' ? 'গ্রাম পঞ্চায়েত ফর্ম ৪ ট্যাক্স সার্টিফিকেট ফর্ম' : 'GP Form 4 Tax Clearance Proforma'}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Official proforma for Gram Panchayat tax collection receipt and tax clearance certificate.
                      </p>
                    </div>
                    <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                  </div>
                  <a
                    href="https://wbprd.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {language === 'bn' ? 'অফিশিয়াল ফরম্যাট ডাউনলোড' : 'Download PDF Form'}
                  </a>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                        {language === 'bn' ? 'নতুন হোল্ডিং ও ট্যাক্স এসেসমেন্ট আবেদন ফর্ম' : 'New Holding & Assessment Application'}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Application form for new building/property holding registration under Gram Panchayat.
                      </p>
                    </div>
                    <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                  </div>
                  <a
                    href="https://wbprd.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {language === 'bn' ? 'এসেসমেন্ট ফর্ম ডাউনলোড' : 'Download Assessment Form'}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3.5 flex items-center justify-between text-xs text-slate-500">
          <span>{language === 'bn' ? 'পশ্চিমবঙ্গ পঞ্চায়েত ও গ্রামোন্নয়ন দপ্তর (WB PRD)' : 'West Bengal Panchayats & Rural Development'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
