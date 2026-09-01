import React, { useState } from 'react';
import { FileText, Download, Printer, Search, ExternalLink, CheckCircle2, ShieldCheck, Receipt, Sparkles } from 'lucide-react';
import { FormItem, Language } from '../types';
import { PanchayatTaxModal } from './PanchayatTaxModal';

interface OnlineFormsSectionProps {
  forms: FormItem[];
  language: Language;
}

export const OnlineFormsSection: React.FC<OnlineFormsSectionProps> = ({ forms, language }) => {
  const [search, setSearch] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);

  const categories = [
    { id: 'all', labelEn: 'All Forms', labelBn: 'সমস্ত ফর্ম' },
    { id: 'land', labelEn: 'Land & Panchayat Tax', labelBn: 'জমি ও পঞ্চায়েত কর' },
    { id: 'aadhaar', labelEn: 'Aadhaar Forms', labelBn: 'আধার ফর্ম' },
    { id: 'pan', labelEn: 'PAN Card Forms', labelBn: 'প্যান ফর্ম' },
    { id: 'voter', labelEn: 'Voter Forms', labelBn: 'ভোটার ফর্ম' },
    { id: 'caste', labelEn: 'Caste & Income', labelBn: 'জাতিগত ও আয় প্রশংসাপত্র' },
    { id: 'railway', labelEn: 'Railway & Transport', labelBn: 'রেলওয়ে ফর্ম' }
  ];

  const filteredForms = forms.filter((f) => {
    const matchesSearch =
      f.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      f.titleBn.toLowerCase().includes(search.toLowerCase()) ||
      f.descriptionEn.toLowerCase().includes(search.toLowerCase()) ||
      f.descriptionBn.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCat === 'all') return true;
    return f.category.toLowerCase() === selectedCat.toLowerCase();
  });

  const handleDownload = (form: FormItem) => {
    if (form.id === 'form-9') {
      setIsTaxModalOpen(true);
      return;
    }
    if (form.officialFormUrl) {
      window.open(form.officialFormUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-blue-900 via-sky-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-blue-700/50 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-500/40 text-xs font-semibold text-blue-100">
              <FileText className="w-4 h-4 text-sky-300" />
              <span>Official Offline & Downloadable Government Forms</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'bn' ? 'অনলাইন ও অফলাইন সরকারি ফর্ম ডাউনলোড সেন্টার' : 'Government Forms & Application Download Center'}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl">
              {language === 'bn'
                ? 'পঞ্চায়েত ট্যাক্স সার্টিফিকেট ফর্ম ৪, আধার আপডেট, প্যান কার্ড 49A, ভোটার ফর্ম ৬/৮ ও কাস্ট সার্টিফিকেটের অরিজিনাল ব্ল্যাঙ্ক ফর্ম ডাউনলোড ও প্রিন্ট করুন।'
                : 'Download and print verified blank official PDF application forms for Panchayat Tax Form 4, Aadhaar, PAN, Voter, SC/ST/OBC, and e-District.'}
            </p>
          </div>

          {/* Quick Panchayat Tax Certificate Generator button */}
          <button
            onClick={() => setIsTaxModalOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-emerald-950" />
            <span>{language === 'bn' ? 'পঞ্চায়েত ট্যাক্স ফর্ম ৪ জেনারেটর' : 'Panchayat Form 4 Tax Tool'}</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'ফর্মের নাম দিয়ে খুঁজুন (যেমন: পঞ্চায়েত ট্যাক্স, Aadhaar, PAN, Form 6, SC/ST...)'
                  : 'Search forms by keyword (e.g., Panchayat Tax Form 4, Aadhaar update, PAN 49A...)'
              }
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-400 outline-none focus:border-sky-400"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCat(c.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCat === c.id
                    ? 'bg-sky-500 text-white font-bold shadow-xs'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 border border-slate-700/50'
                }`}
              >
                {language === 'bn' ? c.labelBn : c.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredForms.map((form) => (
          <div
            key={form.id}
            className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between ${
              form.id === 'form-9'
                ? 'border-emerald-300 dark:border-emerald-700 ring-1 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    form.id === 'form-9'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  }`}>
                    {form.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {form.fileSize} • {form.pages} {form.pages > 1 ? 'pages' : 'page'}
                  </span>
                </div>
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug mb-1">
                {language === 'bn' ? form.titleBn : form.titleEn}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                {language === 'bn' ? form.titleEn : form.titleBn}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {language === 'bn' ? form.descriptionBn : form.descriptionEn}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              {form.id === 'form-9' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsTaxModalOpen(true)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'সার্টিফিকেট বানান ও ডাউনলোড' : 'Generate & Download'}</span>
                  </button>
                  <a
                    href="https://wbprd.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 transition"
                    title={language === 'bn' ? 'অফিশিয়াল PRD পোর্টাল' : 'Official PRD Portal'}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => handleDownload(form)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'অফিশিয়াল পিডিএফ ডাউনলোড' : 'Download PDF Form'}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <PanchayatTaxModal
        isOpen={isTaxModalOpen}
        onClose={() => setIsTaxModalOpen(false)}
        language={language}
      />
    </div>
  );
};

