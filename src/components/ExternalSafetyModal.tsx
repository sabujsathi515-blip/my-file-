import React from 'react';
import { ShieldCheck, ExternalLink, X, AlertCircle } from 'lucide-react';
import { ServiceItem, Language } from '../types';

interface ExternalSafetyModalProps {
  service: ServiceItem | null;
  language: Language;
  onClose: () => void;
  onProceed: () => void;
}

export const ExternalSafetyModal: React.FC<ExternalSafetyModalProps> = ({
  service,
  language,
  onClose,
  onProceed
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'bn' ? 'অফিশিয়াল ওয়েবসাইটে প্রবেশ করছেন' : 'Opening Official Government Portal'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'যাচাইকৃত সরকারি সংযোগ' : 'Verified Secure Government Destination'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
          <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            {language === 'bn' ? service.nameBn : service.nameEn}
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            {language === 'bn' 
              ? 'আপনি ডিজিটাল সেবা পোর্টাল থেকে সরাসরি সরকারের অফিসিয়াল পোর্টালে যাচ্ছেন। আপনার গোপনীয় তথ্য সুরক্ষিত রাখুন।' 
              : 'You are leaving Digital Seva Portal and opening the official external government website.'}
          </p>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-1.5 font-mono text-[11px] text-blue-600 dark:text-blue-400 truncate">
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{service.officialUrl}</span>
          </div>
        </div>

        {/* Security badge note */}
        <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>
            {language === 'bn' 
              ? 'নিরাপত্তা নিশ্চিত: এই সংযোগটি সরাসরি অফিশিয়াল পোর্টালের সাথে যুক্ত।' 
              : 'Security Verified: This link points directly to the genuine government domain.'}
          </span>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {language === 'bn' ? 'বাতিল করুন' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={onProceed}
            className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-98"
          >
            <span>{language === 'bn' ? 'ওয়েবসাইটে যান →' : 'Continue to Official Site →'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
