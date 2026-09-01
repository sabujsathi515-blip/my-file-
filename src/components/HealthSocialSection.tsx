import React from 'react';
import { HeartPulse, Shield, ExternalLink, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { ServiceItem, Language } from '../types';

interface HealthSocialSectionProps {
  services: ServiceItem[];
  language: Language;
  onOpenService: (service: ServiceItem) => void;
}

export const HealthSocialSection: React.FC<HealthSocialSectionProps> = ({
  services,
  language,
  onOpenService
}) => {
  const healthAndSocial = services.filter(
    (s) =>
      s.category === 'health' ||
      s.category === 'social_security' ||
      s.tags.includes('health') ||
      s.tags.includes('pension') ||
      s.tags.includes('scheme')
  );

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-linear-to-r from-rose-900 via-pink-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-rose-700/50 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-800/80 border border-rose-500/40 text-xs font-semibold text-rose-200">
            <HeartPulse className="w-4 h-4 text-rose-300" />
            <span>Healthcare & Social Security Portals</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'bn' ? 'স্বাস্থ্য ও সামাজিক সুরক্ষা পেনশন পোর্টাল' : 'Health Insurance & Social Security Pensions'}
          </h2>
          <p className="text-xs sm:text-sm text-rose-100/90 max-w-2xl">
            {language === 'bn'
              ? 'স্বাস্থ্য সাথী কার্ড, আয়ুষ্মান ভারত (ABHA), জয় বাংলা বার্ধক্য/বিধবা/প্রতিবন্ধী পেনশন, ও কিষাণ সম্মান নিধি।'
              : 'Direct official access for Swasthya Sathi, Ayushman Bharat, ABHA digital health cards, and Jai Bangla pension schemes.'}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {healthAndSocial.map((service) => (
          <div
            key={service.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  {service.subcategory || 'Health & Social'}
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
                <span>{language === 'bn' ? 'অফিশিয়াল পোর্টালে যান' : 'Open Official Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
