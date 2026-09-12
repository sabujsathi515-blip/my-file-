import React, { useState } from 'react';
import { ShieldCheck, Receipt, Sparkles, Building2, Search, Palette, Check } from 'lucide-react';
import { ServiceItem, Language } from '../types';
import { ServiceCard } from './ServiceCard';
import { PanchayatTaxModal } from './PanchayatTaxModal';

interface WestBengalSectionProps {
  services: ServiceItem[];
  favoriteIds: string[];
  language: Language;
  onToggleFavorite: (id: string) => void;
  onOpenService: (service: ServiceItem) => void;
}

export const WestBengalSection: React.FC<WestBengalSectionProps> = ({
  services,
  favoriteIds,
  language,
  onToggleFavorite,
  onOpenService
}) => {
  const wbServices = services.filter((s) => s.isWbGov);
  const [selectedSubcat, setSelectedSubcat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);

  const subcategories = [
    {
      id: 'all',
      labelEn: 'All WB Services',
      labelBn: 'সমস্ত পশ্চিমবঙ্গ সেবা',
      count: wbServices.length,
      activeColor: 'bg-emerald-700 text-white border-emerald-700 shadow-xs',
      badgeColor: 'text-emerald-700 dark:text-emerald-300'
    },
    {
      id: 'Panchayat & Tax',
      labelEn: 'Panchayat & Tax',
      labelBn: 'পঞ্চায়েত কর ও ফর্ম ৪',
      activeColor: 'bg-green-700 text-white border-green-700 shadow-xs',
      badgeColor: 'text-green-600 dark:text-green-400'
    },
    {
      id: 'Land Records',
      labelEn: 'Land & Deeds',
      labelBn: 'জমির রেকর্ড ও দলিল',
      activeColor: 'bg-teal-700 text-white border-teal-700 shadow-xs',
      badgeColor: 'text-teal-600 dark:text-teal-400'
    },
    {
      id: 'Food & Annapurna',
      labelEn: 'Food & Ration',
      labelBn: 'খাদ্য সাথী ও অন্নপূর্ণা',
      activeColor: 'bg-amber-600 text-white border-amber-600 shadow-xs',
      badgeColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      id: 'Smart & Camps',
      labelEn: 'Smart Sathi & Camps',
      labelBn: 'স্মার্টসাথী ও শিবির',
      activeColor: 'bg-cyan-700 text-white border-cyan-700 shadow-xs',
      badgeColor: 'text-cyan-600 dark:text-cyan-400'
    },
    {
      id: 'Schemes',
      labelEn: 'State Schemes',
      labelBn: 'লক্ষ্মী/কৃষক/পেনশন',
      activeColor: 'bg-violet-700 text-white border-violet-700 shadow-xs',
      badgeColor: 'text-violet-600 dark:text-violet-400'
    },
    {
      id: 'Certificates',
      labelEn: 'e-District & Caste',
      labelBn: 'সার্টিফিকেট ও কাস্ট',
      activeColor: 'bg-sky-600 text-white border-sky-600 shadow-xs',
      badgeColor: 'text-sky-600 dark:text-sky-400'
    },
    {
      id: 'Education & Youth',
      labelEn: 'Education & SVMCM',
      labelBn: 'শিক্ষা ও স্কলারশিপ',
      activeColor: 'bg-indigo-700 text-white border-indigo-700 shadow-xs',
      badgeColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      id: 'Women & Child',
      labelEn: 'Women Schemes',
      labelBn: 'কন্যাশ্রী ও রূপশ্রী',
      activeColor: 'bg-pink-600 text-white border-pink-600 shadow-xs',
      badgeColor: 'text-pink-600 dark:text-pink-400'
    },
    {
      id: 'Jobs & Recruitment',
      labelEn: 'Jobs & Recruitment',
      labelBn: 'চাকরি ও পুলিশ বোর্ড',
      activeColor: 'bg-rose-700 text-white border-rose-700 shadow-xs',
      badgeColor: 'text-rose-600 dark:text-rose-400'
    },
    {
      id: 'Police & Utilities',
      labelEn: 'Police & Utilities',
      labelBn: 'পুলিশ ও বিদ্যুৎ বিল',
      activeColor: 'bg-blue-800 text-white border-blue-800 shadow-xs',
      badgeColor: 'text-blue-600 dark:text-blue-400'
    }
  ];

  const filteredServices = wbServices.filter((s) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = s.nameEn.toLowerCase().includes(q) || s.nameBn.toLowerCase().includes(q);
      const matchDesc = s.descriptionEn.toLowerCase().includes(q) || s.descriptionBn.toLowerCase().includes(q);
      const matchTag = s.tags.some((t) => t.toLowerCase().includes(q));
      const matchSub = s.subcategory ? s.subcategory.toLowerCase().includes(q) : false;
      if (!matchName && !matchDesc && !matchTag && !matchSub) return false;
    }

    // Subcategory filter
    if (selectedSubcat === 'all') return true;
    if (selectedSubcat === 'Panchayat & Tax')
      return (
        s.id === 'wb-panchayat-tax' ||
        s.subcategory?.includes('Panchayat') ||
        s.tags.includes('panchayat tax') ||
        s.subcategory?.includes('Municipality')
      );
    if (selectedSubcat === 'Food & Annapurna')
      return (
        s.id === 'wb-annapurna' ||
        s.id === 'wb-rationcard' ||
        s.subcategory?.includes('Food') ||
        s.tags.includes('annapurna') ||
        s.tags.includes('ration')
      );
    if (selectedSubcat === 'Smart & Camps')
      return (
        s.id === 'wb-smartsathi' ||
        s.id === 'wb-janakalyan-shibir' ||
        s.id === 'wb-duaresarkar' ||
        s.subcategory?.includes('Welfare') ||
        s.subcategory?.includes('Citizen Digital')
      );
    if (selectedSubcat === 'Land Records')
      return (
        s.subcategory?.includes('Land') ||
        s.subcategory?.includes('Property') ||
        s.tags.includes('land') ||
        s.id === 'wb-registration-deeds'
      );
    if (selectedSubcat === 'Certificates')
      return (
        s.subcategory?.includes('Certificate') ||
        s.subcategory?.includes('e-District') ||
        s.subcategory?.includes('Revenue') ||
        s.subcategory?.includes('Backward')
      );
    if (selectedSubcat === 'Schemes')
      return (
        s.subcategory?.includes('Scheme') ||
        s.subcategory?.includes('Social') ||
        s.subcategory?.includes('Pension') ||
        s.subcategory?.includes('Agriculture') ||
        s.tags.includes('scheme')
      );
    if (selectedSubcat === 'Women & Child')
      return (
        s.subcategory?.includes('Women') ||
        s.subcategory?.includes('Girls') ||
        s.subcategory?.includes('Marriage')
      );
    if (selectedSubcat === 'Education & Youth')
      return (
        s.subcategory?.includes('Education') ||
        s.subcategory?.includes('Scholarship') ||
        s.subcategory?.includes('Youth') ||
        s.subcategory?.includes('Loan') ||
        s.tags.includes('student')
      );
    if (selectedSubcat === 'Jobs & Recruitment')
      return (
        s.category === 'jobs' ||
        s.subcategory?.includes('Recruitment') ||
        s.subcategory?.includes('Public Service') ||
        s.tags.includes('wb jobs')
      );
    if (selectedSubcat === 'Police & Utilities')
      return (
        s.subcategory?.includes('Police') ||
        s.subcategory?.includes('Utilities') ||
        s.subcategory?.includes('Transport')
      );
    return true;
  });

  return (
    <div className="space-y-6">
      {/* West Bengal Distinctive Banner */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-700/60 shadow-lg relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/40 text-xs font-semibold text-emerald-100 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{language === 'bn' ? 'পশ্চিমবঙ্গ সরকার অনুমোদিত ৩০টি পোর্টাল' : 'West Bengal Government 30 Official Portals'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
              <span>{language === 'bn' ? 'পশ্চিমবঙ্গ সরকারি পোর্টাল ও ডিজিটাল সেবা' : 'West Bengal Government Services'}</span>
              <Palette className="w-6 h-6 text-amber-300 hidden sm:inline" />
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              {language === 'bn'
                ? 'প্রতিটি সরকারি সাইটের জন্য নিজস্ব স্বতন্ত্র ব্যাকগ্রাউন্ড কালার, অফিসিয়াল লোগো ও সিগনেচার থিম। সরাসরি অ্যাক্সেস করুন বাংলারভূমি, ই-ডিস্ট্রিক্ট, দুয়ারে সরকার, অন্নপূর্ণা, স্মার্টসাথী, পঞ্চায়েত ট্যাক্স, লক্ষ্মীর ভাণ্ডার সহ সমস্ত রাজ্য প্রকল্প।'
                : 'Unique custom background color, official portal logo & distinct signature theme for every single West Bengal government website. Instant access to Land Records, e-District, Duare Sarkar, Annapurna, Smart Sathi, Panchayat Tax, and all welfare portals.'}
            </p>
          </div>

          {/* Quick Action Button for Panchayat Tax */}
          <button
            id="btn-wb-panchayat-tax-hero"
            onClick={() => setIsTaxModalOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-xs sm:text-sm shadow-md transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-emerald-700" />
            <span>{language === 'bn' ? 'পঞ্চায়েত ট্যাক্স সার্টিফিকেট (ফর্ম ৪)' : 'Panchayat Tax & Form 4 Certificate'}</span>
          </button>
        </div>

        {/* Featured Micro-Cards with Signature Colors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-emerald-700/50 relative z-10">
          <button
            type="button"
            onClick={() => setIsTaxModalOpen(true)}
            className="text-left p-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/40 transition cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 group-hover:text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {language === 'bn' ? 'ট্যাক্স সার্টিফিকেট' : 'Panchayat Tax'}
            </div>
            <div className="text-[11px] text-emerald-100/80 mt-0.5">
              {language === 'bn' ? 'ফর্ম ৪ জেনারেট ও ডাউনলোড' : 'Apply & Download Form 4'}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedSubcat('Food & Annapurna')}
            className="text-left p-3 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 transition cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 group-hover:text-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {language === 'bn' ? 'অন্নপূর্ণা পোর্টাল' : 'Annapurna Portal'}
            </div>
            <div className="text-[11px] text-amber-100/80 mt-0.5">
              {language === 'bn' ? 'খাদ্যশস্য সুবিধা ও অন্ত্যোদয়' : 'Food Grains Entitlement'}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedSubcat('Smart & Camps')}
            className="text-left p-3 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/40 transition cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 group-hover:text-cyan-200">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              {language === 'bn' ? 'স্মার্টসাথী WB' : 'SmarSathi WB'}
            </div>
            <div className="text-[11px] text-cyan-100/80 mt-0.5">
              {language === 'bn' ? 'ডিজিটাল সিটিজেন সেবা' : 'Digital Citizen Portal'}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedSubcat('Smart & Camps')}
            className="text-left p-3 rounded-xl bg-teal-950/50 hover:bg-teal-900/60 border border-teal-500/40 transition cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-300 group-hover:text-teal-200">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              {language === 'bn' ? 'জনকল্যাণ শিবির' : 'Janakalyan Shibir'}
            </div>
            <div className="text-[11px] text-teal-100/80 mt-0.5">
              {language === 'bn' ? 'ক্যাম্প ও অন-স্পট পরিষেবা' : 'Welfare Camp Schedules'}
            </div>
          </button>
        </div>
      </div>

      {/* Control Bar: Search in WB Services + Count */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* WB Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="wb-services-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'bn'
                ? 'পশ্চিমবঙ্গ সেবা খুঁজুন (যেমন: বাংলারভূমি, রেশন, পেনশন...)'
                : 'Search WB services (e.g., Banglarbhumi, Ration, Pension...)'
            }
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1.5 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Portals counter */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 self-end sm:self-center">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            {language === 'bn'
              ? `মোট ${filteredServices.length} টি সরকারি সাইট সক্রিয়`
              : `${filteredServices.length} Portals Available`}
          </span>
        </div>
      </div>

      {/* Color-Coded Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {subcategories.map((subcat) => {
          const isActive = selectedSubcat === subcat.id;
          return (
            <button
              key={subcat.id}
              type="button"
              id={`filter-wb-${subcat.id}`}
              onClick={() => setSelectedSubcat(subcat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                isActive
                  ? subcat.activeColor
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
              }`}
            >
              <span>{language === 'bn' ? subcat.labelBn : subcat.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Empty Search Result State */}
      {filteredServices.length === 0 && (
        <div className="bento-card p-12 text-center">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            {language === 'bn' ? 'কোন সরকারি সেবা পাওয়া যায়নি' : 'No government services matched your search'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSubcat('all');
              setSearchQuery('');
            }}
            className="mt-3 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
          >
            {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
          </button>
        </div>
      )}

      {/* Services Grid with Individual Signature Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            language={language}
            isFavorite={favoriteIds.includes(service.id)}
            onToggleFavorite={onToggleFavorite}
            onOpenService={onOpenService}
          />
        ))}
      </div>

      {/* Panchayat Tax Modal */}
      <PanchayatTaxModal
        isOpen={isTaxModalOpen}
        onClose={() => setIsTaxModalOpen(false)}
        language={language}
      />
    </div>
  );
};


