import React from 'react';
import { Star, ExternalLink, ShieldCheck } from 'lucide-react';
import { ServiceItem, Language } from '../types';
import { getServiceTheme } from '../data/serviceThemes';
import { PortalLogo } from './PortalLogo';

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
  const theme = getServiceTheme(service.id);

  return (
    <div
      id={`card-service-${service.id}`}
      className={`overflow-hidden relative group flex flex-col justify-between rounded-2xl hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 border ${theme.cardBorder} ${theme.cardBg} ${theme.cardBgHover}`}
    >
      {/* Top signature gradient stripe */}
      <div className={`h-2 w-full bg-linear-to-r ${theme.topBarGradient}`} />

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-3">
              {/* Official Logo & Favicon Emblem */}
              <PortalLogo
                serviceId={service.id}
                officialUrl={service.officialUrl}
                nameEn={service.nameEn}
                nameBn={service.nameBn}
                iconBg={theme.iconBg}
                iconColor={theme.iconColor}
                accentHex={theme.accentHex}
                className="w-12 h-12"
              />

              <div className="min-w-0">
                {service.isWbGov && (
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-lg border tracking-wide mb-1 shadow-2xs ${theme.govBadge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${theme.statusDot} animate-pulse`} />
                    <span>{theme.brandTag || 'WB Govt'}</span>
                  </span>
                )}
                {service.isCentralGov && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60 mb-0.5 tracking-wide">
                    Central Govt
                  </span>
                )}
                {service.subcategory && (
                  <span
                    className={`text-[10px] font-semibold block truncate max-w-[150px] px-1.5 py-0.5 rounded-md border ${theme.subcatBadge}`}
                  >
                    {service.subcategory}
                  </span>
                )}
              </div>
            </div>

            {/* Star Favorite Button */}
            <button
              type="button"
              id={`btn-fav-${service.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(service.id);
              }}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
                isFavorite
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>

          {/* Title */}
          <h3
            className={`font-bold text-slate-900 dark:text-white text-base leading-snug ${theme.titleHover} transition-colors`}
          >
            {language === 'bn' ? service.nameBn : service.nameEn}
          </h3>

          {/* Subtitle in other language */}
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
            {language === 'bn' ? service.nameEn : service.nameBn}
          </p>

          {/* Description */}
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
            {language === 'bn' ? service.descriptionBn : service.descriptionEn}
          </p>

          {/* Tags Chips */}
          {service.tags && service.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3 pt-2">
              {service.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-black/30 px-2 py-0.5 rounded-md border border-black/5 dark:border-white/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card Bottom / Action Button */}
        <div className="pt-3.5 mt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="truncate">Official .gov.in</span>
          </div>

          <button
            type="button"
            id={`btn-open-${service.id}`}
            onClick={() => onOpenService(service)}
            className={`py-2 px-3.5 rounded-xl ${theme.button} text-xs font-bold flex items-center gap-1.5 transition transform active:scale-95 cursor-pointer shadow-sm`}
          >
            <span>{language === 'bn' ? 'ওয়েবসাইট খুলুন' : 'OPEN SERVICE'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

