import React, { useState, useEffect } from 'react';
import { Bell, Flame, ChevronRight, AlertCircle, Calendar } from 'lucide-react';
import { NoticeItem, Language } from '../types';

interface NoticeTickerProps {
  notices: NoticeItem[];
  language: Language;
}

export const NoticeTicker: React.FC<NoticeTickerProps> = ({ notices, language }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (notices.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [notices.length]);

  if (notices.length === 0) return null;

  const currentNotice = notices[currentIndex] || notices[0];

  return (
    <div className="mb-8 bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 dark:border-amber-700/40 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-2xs">
      <div className="flex items-center gap-2.5 overflow-hidden">
        <div className="flex items-center gap-1 bg-amber-500 text-white px-2.5 py-1 rounded-xl text-xs font-black uppercase shrink-0 tracking-wider shadow-2xs">
          <Flame className="w-3.5 h-3.5 fill-white animate-pulse" />
          <span>{language === 'bn' ? 'জরুরি নোটিশ' : 'LATEST ALERT'}</span>
        </div>

        <div className="truncate text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="truncate">
            {language === 'bn' ? currentNotice.titleBn : currentNotice.titleEn}
          </span>
          {currentNotice.lastDate && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-amber-200/80 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 px-2.5 py-0.5 rounded-full shrink-0">
              <Calendar className="w-3 h-3" />
              {language === 'bn' ? `শেষ তারিখ: ${currentNotice.lastDate}` : `Last Date: ${currentNotice.lastDate}`}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <div className="flex space-x-1.5">
          {notices.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'w-5 bg-amber-600 dark:bg-amber-400' : 'w-2 bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label={`Notice ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
