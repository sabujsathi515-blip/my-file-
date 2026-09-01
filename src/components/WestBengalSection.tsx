import React, { useState } from 'react';
import { Landmark, Filter, CheckCircle2, ShieldCheck, ExternalLink, Receipt, FileText, Download, Sparkles, Building2 } from 'lucide-react';
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
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);

  const subcategories = [
    { id: 'all', labelEn: 'All WB Services', labelBn: 'সমস্ত পশ্চিমবঙ্গ সেবা' },
    { id: 'Panchayat & Tax', labelEn: 'Panchayat & Tax (পঞ্চায়েত কর)', labelBn: 'গ্রাম পঞ্চায়েত ও ট্যাক্স' },
    { id: 'Land Records', labelEn: 'Land & Property (বাংলারভূমি)', labelBn: 'জমির রেকর্ড ও বাংলারভূমি' },
    { id: 'Food & Annapurna', labelEn: 'Food & Annapurna (অন্নপূর্ণা/রেশন)', labelBn: 'খাদ্য সাথী ও অন্নপূর্ণা' },
    { id: 'Smart & Camps', labelEn: 'SmarSathi & Camps (স্মার্টসাথী/শিবির)', labelBn: 'স্মার্টসাথী ও জনকল্যাণ শিবির' },
    { id: 'Schemes', labelEn: 'State Schemes (লক্ষ্মী/কৃষক/পেনশন)', labelBn: 'রাজ্য প্রকল্প (লক্ষ্মী/কৃষক/পেনশন)' },
    { id: 'Certificates', labelEn: 'Certificates & e-District', labelBn: 'সার্টিফিকেট ও ই-ডিস্ট্রিক্ট' },
    { id: 'Education & Youth', labelEn: 'Education & Loans (স্টুডেন্ট কার্ড/স্কলারশিপ)', labelBn: 'শিক্ষা, লোন ও স্কলারশিপ' },
    { id: 'Women & Child', labelEn: 'Women & Marriage (কন্যাশ্রী/রূপশ্রী)', labelBn: 'কন্যাশ্রী ও রূপশ্রী' },
    { id: 'Jobs & Recruitment', labelEn: 'Jobs & Police (নিয়োগ বোর্ড)', labelBn: 'চাকরি ও নিয়োগ বোর্ড' },
    { id: 'Police & Utilities', labelEn: 'Police & Electricity', labelBn: 'পুলিশ ও বিদ্যুৎ বিল' }
  ];

  const filteredServices = wbServices.filter((s) => {
    if (selectedSubcat === 'all') return true;
    if (selectedSubcat === 'Panchayat & Tax') return s.id === 'wb-panchayat-tax' || s.subcategory?.includes('Panchayat') || s.tags.includes('panchayat tax') || s.subcategory?.includes('Municipality');
    if (selectedSubcat === 'Food & Annapurna') return s.id === 'wb-annapurna' || s.id === 'wb-rationcard' || s.subcategory?.includes('Food') || s.tags.includes('annapurna') || s.tags.includes('ration');
    if (selectedSubcat === 'Smart & Camps') return s.id === 'wb-smartsathi' || s.id === 'wb-janakalyan-shibir' || s.id === 'wb-duaresarkar' || s.subcategory?.includes('Welfare') || s.subcategory?.includes('Citizen Digital');
    if (selectedSubcat === 'Land Records') return s.subcategory?.includes('Land') || s.subcategory?.includes('Property') || s.tags.includes('land');
    if (selectedSubcat === 'Certificates') return s.subcategory?.includes('Certificate') || s.subcategory?.includes('e-District') || s.subcategory?.includes('Revenue') || s.subcategory?.includes('Backward');
    if (selectedSubcat === 'Schemes') return s.subcategory?.includes('Scheme') || s.subcategory?.includes('Social') || s.subcategory?.includes('Pension') || s.subcategory?.includes('Agriculture') || s.tags.includes('scheme');
    if (selectedSubcat === 'Women & Child') return s.subcategory?.includes('Women') || s.subcategory?.includes('Girls') || s.subcategory?.includes('Marriage');
    if (selectedSubcat === 'Education & Youth') return s.subcategory?.includes('Education') || s.subcategory?.includes('Scholarship') || s.subcategory?.includes('Youth') || s.subcategory?.includes('Loan') || s.tags.includes('student');
    if (selectedSubcat === 'Jobs & Recruitment') return s.category === 'jobs' || s.subcategory?.includes('Recruitment') || s.subcategory?.includes('Public Service') || s.tags.includes('wb jobs');
    if (selectedSubcat === 'Police & Utilities') return s.subcategory?.includes('Police') || s.subcategory?.includes('Utilities') || s.subcategory?.includes('Transport');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-700/50 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/80 border border-emerald-500/40 text-xs font-semibold text-emerald-100">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Government of West Bengal Portals 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'bn' ? 'পশ্চিমবঙ্গ সরকার সেবা ও পোর্টাল ড্যাশবোর্ড' : 'West Bengal Government Services'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl">
              {language === 'bn'
                ? 'বাংলারভূমি, অন্নপূর্ণা পোর্টাল, স্মার্টসাথী, জনকল্যাণ শিবির, পঞ্চায়েত ট্যাক্স সার্টিফিকেট, স্বাস্থ্য সাথী ও লক্ষ্মীর ভাণ্ডার।'
                : 'Direct access to official Banglarbhumi land records, Annapurna Portal, SmarSathi, Janakalyan Shibir, Panchayat Tax, and State Schemes.'}
            </p>
          </div>

          {/* Quick Action Button for Panchayat Tax */}
          <button
            onClick={() => setIsTaxModalOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-xs sm:text-sm shadow-md transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-emerald-700" />
            <span>{language === 'bn' ? 'পঞ্চায়েত ট্যাক্স সার্টিফিকেট (ফর্ম ৪)' : 'Panchayat Tax & Form 4 Certificate'}</span>
          </button>
        </div>

        {/* Featured Micro-Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-emerald-700/50">
          <button
            onClick={() => setIsTaxModalOpen(true)}
            className="text-left p-3 rounded-xl bg-emerald-800/60 hover:bg-emerald-700/70 border border-emerald-600/40 transition cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-200">
              <Receipt className="w-3.5 h-3.5 text-emerald-300" />
              {language === 'bn' ? 'ট্যাক্স সার্টিফিকেট' : 'Panchayat Tax'}
            </div>
            <div className="text-[11px] text-emerald-100/80 mt-0.5">
              {language === 'bn' ? 'ফর্ম ৪ জেনারেট ও ডাউনলোড' : 'Apply & Download Form 4'}
            </div>
          </button>

          <button
            onClick={() => setSelectedSubcat('Food & Annapurna')}
            className="text-left p-3 rounded-xl bg-emerald-800/60 hover:bg-emerald-700/70 border border-emerald-600/40 transition cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {language === 'bn' ? 'অন্নপূর্ণা পোর্টাল' : 'Annapurna Portal'}
            </div>
            <div className="text-[11px] text-emerald-100/80 mt-0.5">
              {language === 'bn' ? 'খাদ্যশস্য সুবিধা ও অন্ত্যোদয়' : 'Food Grains Entitlement'}
            </div>
          </button>

          <button
            onClick={() => setSelectedSubcat('Smart & Camps')}
            className="text-left p-3 rounded-xl bg-emerald-800/60 hover:bg-emerald-700/70 border border-emerald-600/40 transition cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              {language === 'bn' ? 'স্মার্টসাথী (SmarSathi)' : 'SmarSathi WB'}
            </div>
            <div className="text-[11px] text-emerald-100/80 mt-0.5">
              {language === 'bn' ? 'ডিজিটাল সিটিজেন সেবা' : 'Digital Citizen Portal'}
            </div>
          </button>

          <button
            onClick={() => setSelectedSubcat('Smart & Camps')}
            className="text-left p-3 rounded-xl bg-emerald-800/60 hover:bg-emerald-700/70 border border-emerald-600/40 transition cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-200">
              <Building2 className="w-3.5 h-3.5 text-teal-300" />
              {language === 'bn' ? 'জনকল্যাণ শিবির' : 'Janakalyan Shibir'}
            </div>
            <div className="text-[11px] text-emerald-100/80 mt-0.5">
              {language === 'bn' ? 'ক্যাম্প ও অন-স্পট পরিষেবা' : 'Welfare Camp Schedules'}
            </div>
          </button>
        </div>
      </div>

      {/* Subcategory Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {subcategories.map((subcat) => {
          const isActive = selectedSubcat === subcat.id;
          return (
            <button
              key={subcat.id}
              type="button"
              onClick={() => setSelectedSubcat(subcat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500'
              }`}
            >
              {language === 'bn' ? subcat.labelBn : subcat.labelEn}
            </button>
          );
        })}
      </div>

      {/* Grid */}
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

