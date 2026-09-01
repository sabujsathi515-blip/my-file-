import React from 'react';
import { 
  Fingerprint, 
  CreditCard, 
  Vote, 
  Globe, 
  Receipt, 
  Landmark, 
  Building2, 
  HeartPulse, 
  FolderLock, 
  Car, 
  Train,
  Sprout,
  Coins,
  Wheat
} from 'lucide-react';
import { Language, ServiceItem } from '../types';

interface QuickAccessBarProps {
  language: Language;
  onOpenServiceById: (serviceId: string) => void;
}

export const QuickAccessBar: React.FC<QuickAccessBarProps> = ({
  language,
  onOpenServiceById
}) => {
  const quickItems = [
    { id: 'central-uidai-myaadhaar', labelEn: 'Aadhaar', labelBn: 'আধার সেবা', icon: Fingerprint, color: 'text-amber-600 dark:text-amber-400 bg-amber-50/90 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-900/60 hover:bg-amber-100/80' },
    { id: 'central-nsdl-pan', labelEn: 'PAN Card', labelBn: 'প্যান কার্ড', icon: CreditCard, color: 'text-blue-600 dark:text-blue-400 bg-blue-50/90 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/60 hover:bg-blue-100/80' },
    { id: 'central-voter-eci', labelEn: 'Voter Portal', labelBn: 'ভোটার পোর্টাল', icon: Vote, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/60 hover:bg-emerald-100/80' },
    { id: 'wb-panchayat-tax', labelEn: 'Panchayat Tax', labelBn: 'পঞ্চায়েত ট্যাক্স', icon: Receipt, color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300/80 dark:border-emerald-800/60 hover:bg-emerald-100/80' },
    { id: 'wb-banglarbhumi', labelEn: 'Banglarbhumi', labelBn: 'বাংলারভূমি', icon: Landmark, color: 'text-teal-600 dark:text-teal-400 bg-teal-50/90 dark:bg-teal-950/40 border-teal-200/80 dark:border-teal-900/60 hover:bg-teal-100/80' },
    { id: 'wb-annapurna', labelEn: 'Annapurna', labelBn: 'অন্নপূর্ণা পোর্টাল', icon: Wheat, color: 'text-amber-700 dark:text-amber-300 bg-amber-50/90 dark:bg-amber-950/40 border-amber-300/80 dark:border-amber-800/60 hover:bg-amber-100/80' },
    { id: 'wb-edistrict', labelEn: 'e-District WB', labelBn: 'ই-ডিস্ট্রিক্ট WB', icon: Building2, color: 'text-sky-600 dark:text-sky-400 bg-sky-50/90 dark:bg-sky-950/40 border-sky-200/80 dark:border-sky-900/60 hover:bg-sky-100/80' },
    { id: 'wb-swasthyasathi', labelEn: 'Swasthya Sathi', labelBn: 'স্বাস্থ্য সাথী', icon: HeartPulse, color: 'text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-900/60 hover:bg-rose-100/80' },
    { id: 'wb-lakshmirbhandar', labelEn: 'Lakshmir Bhandar', labelBn: 'লক্ষ্মীর ভাণ্ডার', icon: Coins, color: 'text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50/90 dark:bg-fuchsia-950/40 border-fuchsia-200/80 dark:border-fuchsia-900/60 hover:bg-fuchsia-100/80' },
    { id: 'wb-krishakbandhu', labelEn: 'Krishak Bandhu', labelBn: 'কৃষক বন্ধু', icon: Sprout, color: 'text-lime-600 dark:text-lime-400 bg-lime-50/90 dark:bg-lime-950/40 border-lime-200/80 dark:border-lime-900/60 hover:bg-lime-100/80' },
    { id: 'central-digilocker', labelEn: 'DigiLocker', labelBn: 'ডিজিলকার', icon: FolderLock, color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50/90 dark:bg-cyan-950/40 border-cyan-200/80 dark:border-cyan-900/60 hover:bg-cyan-100/80' },
    { id: 'central-parivahan-vahan', labelEn: 'Parivahan (DL)', labelBn: 'পরিবহন (DL)', icon: Car, color: 'text-orange-600 dark:text-orange-400 bg-orange-50/90 dark:bg-orange-950/40 border-orange-200/80 dark:border-orange-900/60 hover:bg-orange-100/80' },
    { id: 'central-irctc-railway', labelEn: 'IRCTC Train', labelBn: 'IRCTC ট্রেন', icon: Train, color: 'text-red-600 dark:text-red-400 bg-red-50/90 dark:bg-red-950/40 border-red-200/80 dark:border-red-900/60 hover:bg-red-100/80' }
  ];

  return (
    <div className="mb-8 bento-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3.5 px-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 inline-block"></span>
          {language === 'bn' ? 'কুইক এক্সেস বার (২০২৬ সক্রিয় সরকারি পোর্টাল)' : 'Quick Access Hub (Active 2026 Government Portals)'}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-13 gap-2.5">
        {quickItems.map((item) => {
          const IconComp = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpenServiceById(item.id)}
              className={`p-3 rounded-2xl border transition-all hover:-translate-y-0.5 active:scale-95 text-center flex flex-col items-center justify-center gap-1.5 shadow-2xs group cursor-pointer ${item.color}`}
            >
              <IconComp className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                {language === 'bn' ? item.labelBn : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
