import React from 'react';
import { GraduationCap, ExternalLink, CheckCircle2, Award, FileCheck, HelpCircle } from 'lucide-react';
import { ServiceItem, Language } from '../types';

interface ScholarshipsSectionProps {
  services: ServiceItem[];
  language: Language;
  onOpenService: (service: ServiceItem) => void;
}

export const ScholarshipsSection: React.FC<ScholarshipsSectionProps> = ({
  services,
  language,
  onOpenService
}) => {
  const scholarshipServices = services.filter(
    (s) => s.category === 'scholarship' || s.tags.includes('scholarship') || s.tags.includes('student')
  );

  const documentChecklist = [
    { nameEn: 'Madhyamik / Last Exam Marksheet', nameBn: 'মাধ্যমিক বা শেষ পরীক্ষার মার্কশিট (উভয় পিঠ)' },
    { nameEn: 'Income Certificate from BDO / SDO / Gazetted Officer', nameBn: 'বিডিও / এসডিও প্রদত্ব বার্ষিক আয়ের প্রশংসাপত্র' },
    { nameEn: 'Bank Passbook (First page showing Account & IFSC)', nameBn: 'ব্যাংক পাসবইয়ের প্রথম পাতা (নাম ও IFSC কোড)' },
    { nameEn: 'Current Year Admission Receipt', nameBn: 'বর্তমান শিক্ষাবর্ষে ভর্তির রসিদ (Admission Receipt)' },
    { nameEn: 'Aadhaar Card copy', nameBn: 'আধার কার্ডের জেরক্স কপি' },
    { nameEn: 'Passport Size Photo & Signature', nameBn: 'পাসপোর্ট সাইজ ছবি ও প্রার্থীর স্বাক্ষর' }
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-blue-700/50 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-500/40 text-xs font-semibold text-blue-200">
            <GraduationCap className="w-4 h-4 text-blue-300" />
            <span>State & National Scholarship Schemes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'bn' ? 'স্কলারশিপ ও ছাত্রবৃত্তি সেবা কেন্দ্র' : 'Scholarships & Student Financial Assistance'}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl">
            {language === 'bn'
              ? 'স্বামী বিবেকানন্দ স্কলারশিপ (SVMCM), ওয়েসিস (OASIS), ঐক্যশ্রী (Aikyashree) এবং ন্যাশনাল স্কলারশিপ পোর্টাল (NSP)-এর সরাসরি পোর্টাল।'
              : 'Direct official access for Swami Vivekananda (SVMCM), OASIS, Aikyashree, and National Scholarship schemes.'}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {scholarshipServices.map((service) => (
          <div
            key={service.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {service.subcategory || 'Scholarship'}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                {language === 'bn' ? service.nameBn : service.nameEn}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                {language === 'bn' ? service.nameEn : service.nameBn}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {language === 'bn' ? service.descriptionBn : service.descriptionEn}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => onOpenService(service)}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition"
              >
                <span>{language === 'bn' ? 'স্কলারশিপ পোর্টালে যান' : 'Open Scholarship Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Checklist Helper Box */}
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'bn' ? 'স্কলারশিপ ফর্ম ফিলাপের জন্য প্রয়োজনীয় ডকুমেন্টস লিস্ট' : 'Documents Checklist for Scholarship Application'}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {documentChecklist.map((doc, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-slate-700 dark:text-slate-200 font-medium">
                {language === 'bn' ? doc.nameBn : doc.nameEn}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
