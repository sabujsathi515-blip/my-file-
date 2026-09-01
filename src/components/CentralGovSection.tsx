import React, { useState } from 'react';
import { Building, ShieldCheck, Filter } from 'lucide-react';
import { ServiceItem, Language } from '../types';
import { ServiceCard } from './ServiceCard';

interface CentralGovSectionProps {
  services: ServiceItem[];
  favoriteIds: string[];
  language: Language;
  onToggleFavorite: (id: string) => void;
  onOpenService: (service: ServiceItem) => void;
}

export const CentralGovSection: React.FC<CentralGovSectionProps> = ({
  services,
  favoriteIds,
  language,
  onToggleFavorite,
  onOpenService
}) => {
  const centralServices = services.filter((s) => s.isCentralGov);
  const [selectedSubcat, setSelectedSubcat] = useState<string>('all');

  const subcategories = [
    { id: 'all', labelEn: 'All Central Services', labelBn: 'সমস্ত কেন্দ্রীয় সেবা' },
    { id: 'Aadhaar', labelEn: 'Aadhaar (UIDAI)', labelBn: 'আধার সেবা (UIDAI)' },
    { id: 'PAN & Tax', labelEn: 'PAN & Income Tax', labelBn: 'প্যান কার্ড ও আয়কর' },
    { id: 'Voter & Election', labelEn: 'Voter & ECI', labelBn: 'ভোটার পোর্টাল ও নির্বাচন' },
    { id: 'Passport', labelEn: 'Passport Seva', labelBn: 'পাসপোর্ট সেবা' },
    { id: 'Transport', labelEn: 'Transport & DL (Parivahan)', labelBn: 'পরিবহন ও ড্রাইভিং লাইসেন্স' },
    { id: 'Railway', labelEn: 'IRCTC & Railway', labelBn: 'রেলওয়ে ও টিকিট বুকিং' },
    { id: 'Digital & Pension', labelEn: 'DigiLocker & EPFO', labelBn: 'ডিজিলকার ও ইপিএফও পেনশন' }
  ];

  const filteredServices = centralServices.filter((s) => {
    if (selectedSubcat === 'all') return true;
    if (selectedSubcat === 'Aadhaar') return s.subcategory?.includes('Aadhaar') || s.tags.includes('aadhaar');
    if (selectedSubcat === 'PAN & Tax') return s.subcategory?.includes('PAN') || s.subcategory?.includes('Tax');
    if (selectedSubcat === 'Voter & Election') return s.subcategory?.includes('Election') || s.tags.includes('voter');
    if (selectedSubcat === 'Passport') return s.subcategory?.includes('Passport');
    if (selectedSubcat === 'Transport') return s.subcategory?.includes('Transport') || s.tags.includes('dl');
    if (selectedSubcat === 'Railway') return s.subcategory?.includes('Railway') || s.tags.includes('irctc');
    if (selectedSubcat === 'Digital & Pension') return s.subcategory?.includes('Digital') || s.subcategory?.includes('Pension') || s.subcategory?.includes('Labour');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-700/50 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-800/80 border border-indigo-500/40 text-xs font-semibold text-indigo-100">
              <ShieldCheck className="w-4 h-4 text-indigo-300" />
              <span>Government of India Official Portals</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'bn' ? 'কেন্দ্রীয় সরকার সেবা ড্যাশবোর্ড' : 'Central Government Services'}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/90 max-w-2xl">
              {language === 'bn'
                ? 'আধার কার্ড ডাউনলোড ও পিভিসি অর্ডার, প্যান কার্ড এনএসডিএল/ইউটিআইআইটিএসএল, পাসপোর্ট সেবা, ভোটার সার্ভিস পোর্টাল ও আয়কর ই-ফাইলিং।'
                : 'Direct verified access to UIDAI Aadhaar, NSDL/UTIITSL PAN, Passport Seva, Election Commission Voter Portal, and Income Tax e-Filing.'}
            </p>
          </div>
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-500'
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
    </div>
  );
};
