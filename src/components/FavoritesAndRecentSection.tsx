import React from 'react';
import { Star, Clock, Sparkles } from 'lucide-react';
import { ServiceItem, Language } from '../types';
import { ServiceCard } from './ServiceCard';

interface FavoritesAndRecentSectionProps {
  services: ServiceItem[];
  favoriteIds: string[];
  recentIds: string[];
  language: Language;
  onToggleFavorite: (id: string) => void;
  onOpenService: (service: ServiceItem) => void;
}

export const FavoritesAndRecentSection: React.FC<FavoritesAndRecentSectionProps> = ({
  services,
  favoriteIds,
  recentIds,
  language,
  onToggleFavorite,
  onOpenService
}) => {
  const favoriteServices = services.filter((s) => favoriteIds.includes(s.id));
  const recentServices = recentIds
    .map((id) => services.find((s) => s.id === id))
    .filter((s): s is ServiceItem => !!s);

  if (favoriteServices.length === 0 && recentServices.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8 mb-10">
      {/* Favorites */}
      {favoriteServices.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              {language === 'bn' ? 'আপনার পছন্দের সেবা (Favorites)' : 'Your Favorite Services'}
              <span className="text-xs font-normal text-slate-500">({favoriteServices.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoriteServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                language={language}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
                onOpenService={onOpenService}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recently Used */}
      {recentServices.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              {language === 'bn' ? 'সম্প্রতি ব্যবহৃত সেবা (Recently Used)' : 'Recently Used Services'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recentServices.slice(0, 4).map((service) => (
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
      )}
    </div>
  );
};
