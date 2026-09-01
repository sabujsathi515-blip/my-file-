import React from 'react';
import { Star, ExternalLink, ShieldCheck, Check } from 'lucide-react';
import { ServiceItem, Language } from '../types';
import { DynamicIcon } from './DynamicIcon';

interface ServiceCardProps {
  service: ServiceItem;
  language: Language;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenService: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  language,
  isFavorite,
  onToggleFavorite,
  onOpenService
}) => {
  return (
    <div className="bento-card p-5 group flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200">
      {/* Card Top */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100/80 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
              <DynamicIcon name={service.iconName} className="w-5 h-5" />
            </div>
            <div>
              {service.isWbGov && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60 mb-0.5 tracking-wide">
                  WB Govt
                </span>
              )}
              {service.isCentralGov && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60 mb-0.5 tracking-wide">
                  Central Govt
                </span>
              )}
              {service.subcategory && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block truncate max-w-[130px]">
                  {service.subcategory}
                </span>
              )}
            </div>
          </div>

          {/* Star Favorite Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(service.id);
            }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-2 rounded-xl transition ${
              isFavorite
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {language === 'bn' ? service.nameBn : service.nameEn}
        </h3>

        {/* Subtitle in other language */}
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
          {language === 'bn' ? service.nameEn : service.nameBn}
        </p>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
          {language === 'bn' ? service.descriptionBn : service.descriptionEn}
        </p>
      </div>

      {/* Card Bottom / Action Button */}
      <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Official .gov.in</span>
        </div>

        <button
          type="button"
          onClick={() => onOpenService(service)}
          className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:shadow-xs transition transform active:scale-95 cursor-pointer"
        >
          <span>{language === 'bn' ? 'ওয়েবসাইট খুলুন' : 'OPEN SERVICE'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
