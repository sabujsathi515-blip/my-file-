import React from 'react';
import { ShieldCheck, PhoneCall, Heart, Globe, Sparkles } from 'lucide-react';
import { Language } from '../types';

export const Footer: React.FC<{ language: Language; onTabChange: (tab: string) => void }> = ({
  language,
  onTabChange
}) => {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      {/* Helpline Numbers Bar */}
      <div className="bg-slate-950 border-b border-slate-800/80 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'জরুরি হেল্পলাইন ডিরেক্টরি:' : 'National & State Emergency Helplines:'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-slate-300 font-mono text-[11px]">
            <div>Emergency: <strong className="text-white">112</strong></div>
            <div>Cyber Crime: <strong className="text-white">1930</strong></div>
            <div>WB CMO: <strong className="text-white">1076</strong></div>
            <div>Women Helpline: <strong className="text-white">181 / 1091</strong></div>
            <div>Childline: <strong className="text-white">1098</strong></div>
            <div>Kisan Call Center: <strong className="text-white">1800-180-1551</strong></div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Brand info */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center p-1 font-bold text-white">
              <img src="/icon.svg" alt="icon" className="w-full h-full" />
            </div>
            <span className="font-extrabold text-base tracking-tight">Digital Seva Portal</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs max-w-lg">
            {language === 'bn'
              ? 'পশ্চিমবঙ্গ সরকার ও কেন্দ্রীয় সরকারের সমস্ত অনলাইন পরিষেবা, অফিসিয়াল ফর্ম, নিয়োগ বিজ্ঞপ্তি এবং সাইবার ক্যাফে পরিচালনা সংক্রান্ত টুলস এখন একটি প্ল্যাটফর্মে।'
              : 'The comprehensive single-window dashboard for West Bengal & Central Government services, recruitment notices, downloadable forms, and cyber café productivity tools.'}
          </p>
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Government Verified Destination Links</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">
            {language === 'bn' ? 'প্রধান বিভাগ' : 'Portals & Sections'}
          </h4>
          <ul className="space-y-2">
            <li>
              <button type="button" onClick={() => onTabChange('wb_gov')} className="hover:text-white transition">
                {language === 'bn' ? 'পশ্চিমবঙ্গ সরকার সেবা' : 'WB Government Services'}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onTabChange('central_gov')} className="hover:text-white transition">
                {language === 'bn' ? 'কেন্দ্রীয় সরকার সেবা' : 'Central Govt Services'}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onTabChange('cyber_tools')} className="hover:text-white transition">
                {language === 'bn' ? 'ফটো ও সিগনেচার রিসাইজ' : 'Cyber Photo & Tools'}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onTabChange('forms')} className="hover:text-white transition">
                {language === 'bn' ? 'অনলাইন ফর্ম ডাউনলোড' : 'Downloadable Forms'}
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Productivity */}
        <div>
          <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">
            {language === 'bn' ? 'ক্যাফে টুলস' : 'Café Management'}
          </h4>
          <ul className="space-y-2">
            <li>
              <button type="button" onClick={() => onTabChange('cyber_tools')} className="hover:text-white transition">
                {language === 'bn' ? 'পাসপোর্ট ফটো শিট জেনারেটর' : 'Passport Photo Sheet'}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onTabChange('cyber_tools')} className="hover:text-white transition">
                {language === 'bn' ? 'ইনস্ট্যান্ট বিলিং ক্যালকুলেটর' : 'Billing Calculator'}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onTabChange('customer_khata')} className="hover:text-white transition">
                {language === 'bn' ? 'গ্রাহক খাতা রেজিস্টার' : 'Customer Ledger'}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onTabChange('income_expense')} className="hover:text-white transition">
                {language === 'bn' ? 'আয়-ব্যয় রিপোর্ট ও গ্রাফ' : 'Income & Expenses'}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Legal & Copyright */}
      <div className="border-t border-slate-800 py-4 px-4 sm:px-6 text-center text-slate-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} Digital Seva Portal. All Rights Reserved.
          </div>
          <div className="text-slate-400">
            Disclaimer: Facilitation directory connecting to official .gov.in and .nic.in portals.
          </div>
        </div>
      </div>
    </footer>
  );
};
