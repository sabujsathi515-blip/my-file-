import React from 'react';
import { Search, X, Sparkles, Filter } from 'lucide-react';
import { Language, ServiceCategory } from '../types';

interface SearchAndHeroProps {
  language: Language;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  totalServicesCount: number;
}

export const SearchAndHero: React.FC<SearchAndHeroProps> = ({
  language,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  totalServicesCount
}) => {
  const quickTags = [
    { label: 'Aadhaar', query: 'aadhaar' },
    { label: 'PAN Card', query: 'pan' },
    { label: 'Voter ID', query: 'voter' },
    { label: 'Banglarbhumi', query: 'banglarbhumi' },
    { label: 'e-District', query: 'edistrict' },
    { label: 'Swasthya Sathi', query: 'swasthya' },
    { label: 'Kanyashree', query: 'kanyashree' },
    { label: 'Lakshmir Bhandar', query: 'lakshmir' },
    { label: 'DigiLocker', query: 'digilocker' },
    { label: 'Parivahan (DL)', query: 'parivahan' },
    { label: 'IRCTC Train', query: 'irctc' },
    { label: 'Caste Cert', query: 'caste' },
    { label: 'SVMCM Scholarship', query: 'svmcm' }
  ];

  return (
    <div className="relative overflow-hidden bg-linear-to-b from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 mb-8 shadow-md border border-slate-700/60 bento-bg-pattern">
      {/* Background Decorative patterns */}
      <div className="absolute -right-16 -top-16 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
        {/* Welcome Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/60 border border-blue-400/30 text-xs font-semibold text-blue-200 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>
            {language === 'bn' ? 'পশ্চিমবঙ্গ ও কেন্দ্রীয় সরকারের সমস্ত পরিষেবা' : 'Verified Central & West Bengal Portals'}
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          {language === 'bn' 
            ? 'আপনার প্রয়োজনীয় সরকারি পরিষেবা খুঁজুন' 
            : 'Find Any Government & Digital Service Instantly'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-normal">
          {language === 'bn'
            ? 'আধার, প্যান, ভোটার, জমির রেকর্ড, স্বাস্থ্য সাথী, স্কলারশিপ ও সাইবার ক্যাফে টুলস—সব এক ক্লিকের মধ্যে।'
            : 'Search over 40+ verified government portals, official application forms, recruitment links, and cyber café utilities.'}
        </p>

        {/* Global Instant Search Bar */}
        <div className="pt-2">
          <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-1.5 border border-slate-200/80 dark:border-slate-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <div className="pl-3.5 text-slate-400">
              <Search className="w-5 h-5 text-blue-600" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                language === 'bn' 
                  ? 'সার্চ করুন: Voter, Aadhaar, Ration, Banglarbhumi, Kanyashree, DL...' 
                  : 'Search by service name: Aadhaar, PAN, Voter, Banglarbhumi, SVMCM...'
              }
              className="w-full bg-transparent px-3 py-2.5 text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              className="hidden sm:inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition"
            >
              <span>{language === 'bn' ? 'অনুসন্ধান' : 'Search'}</span>
            </button>
          </div>
        </div>

        {/* Quick Search Suggestion Tags */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium text-[11px] mr-1">
            {language === 'bn' ? 'দ্রুত খুঁজুন:' : 'Popular:'}
          </span>
          {quickTags.map((tag) => (
            <button
              key={tag.query}
              type="button"
              onClick={() => onSearchChange(tag.query)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-white hover:text-slate-900 border border-slate-700/80 text-slate-200 text-[11px] font-medium transition-all"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
