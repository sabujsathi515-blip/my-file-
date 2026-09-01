import React, { useState } from 'react';
import { 
  Globe, 
  Moon, 
  Sun, 
  Download, 
  ShieldCheck, 
  Menu, 
  X, 
  Settings, 
  UserCheck, 
  Wrench, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  HeartPulse, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { Language, ThemeMode } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: ThemeMode;
  onThemeToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  activeTab,
  onTabChange,
  onOpenAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState<boolean>(false);

  const navItems = [
    { id: 'home', labelEn: 'Home', labelBn: 'হোম' },
    { id: 'wb_gov', labelEn: 'WB Government', labelBn: 'পশ্চিমবঙ্গ সরকার' },
    { id: 'central_gov', labelEn: 'Central Government', labelBn: 'কেন্দ্রীয় সরকার' },
    { id: 'cyber_tools', labelEn: 'Cyber Café Tools', labelBn: 'সাইবার টুলস' },
    { id: 'forms', labelEn: 'Forms & Downloads', labelBn: 'অনলাইন ফর্ম' },
    { id: 'jobs', labelEn: 'Jobs & Recruitment', labelBn: 'চাকরি ও নিয়োগ' },
    { id: 'scholarship', labelEn: 'Scholarship', labelBn: 'স্কলারশিপ' },
    { id: 'health_social', labelEn: 'Health & Pension', labelBn: 'স্বাস্থ্য ও পেনশন' },
    { id: 'customer_khata', labelEn: 'Customer Register', labelBn: 'কাস্টমার খাতা' }
  ];

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Utility Bar */}
      <div className="bg-blue-900 dark:bg-slate-950 text-white text-[11px] py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              {language === 'bn' ? 'অফিশিয়াল সরকারি ডিজিটাল সেবা পোর্টাল' : 'Official Government Digital Seva Portal'}
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">
              {language === 'bn' ? 'হেল্পলাইন: ১১২ / ১৯৩০ (সাইবার ক্রাইম) / ১০৭৬' : 'Helpline: 112 / 1930 / 1076'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-blue-950/80 dark:bg-slate-900 rounded-lg p-0.5 border border-blue-800/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => onLanguageChange('bn')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  language === 'bn' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  language === 'en' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={onThemeToggle}
              className="p-1 rounded-lg hover:bg-blue-800 dark:hover:bg-slate-800 text-slate-200 transition"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Admin Panel button */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-slate-200 hover:text-white bg-blue-800/60 dark:bg-slate-800/80 hover:bg-blue-800 px-2 py-0.5 rounded transition text-[11px] font-medium"
            >
              <Settings className="w-3 h-3" />
              <span>{language === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-linear-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform p-1.5">
            <img src="/icon.svg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight leading-none">
                Digital Seva Portal
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-normal mt-0.5">
              {language === 'bn' 
                ? 'সমস্ত সরকারি ও সাইবার ক্যাফে পরিষেবা এক জায়গায়' 
                : 'All Government & Cyber Café Services in One Place'}
            </p>
          </div>
        </button>

        {/* Right Action buttons & PWA install */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          {!isInstalled && isInstallable && (
            <button
              type="button"
              onClick={install}
              className="hidden sm:flex items-center gap-1.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'অ্যাপ ইনস্টল' : 'Install App'}</span>
            </button>
          )}

          {!isInstalled && isIOS && (
            <button
              type="button"
              onClick={() => setShowIOSGuide(true)}
              className="hidden sm:flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Download className="w-3.5 h-3.5" />
              <span>iOS Install</span>
            </button>
          )}

          {/* Quick Register / Khata shortcut */}
          <button
            type="button"
            onClick={() => handleNavClick('customer_khata')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'দৈনিক খাতা' : 'Daily Khata'}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Navigation Tabs */}
      <div className="hidden lg:block border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center space-x-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {language === 'bn' ? item.labelBn : item.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {language === 'bn' ? item.labelBn : item.labelEn}
                </button>
              );
            })}
          </div>

          {/* Mobile Install button */}
          {!isInstalled && isInstallable && (
            <button
              type="button"
              onClick={install}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-2 mt-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              {language === 'bn' ? 'মোবাইলে অ্যাপ ইনস্টল করুন' : 'Install PWA on Phone'}
            </button>
          )}
        </div>
      )}

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'bn' ? 'iPhone / iPad-এ ইনস্টল করার নিয়ম' : 'Install on iPhone / iPad'}
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              ১. Safari ব্রাউজারের নিচের <strong>Share (শেয়ার)</strong> বাটনে ক্লিক করুন।<br />
              ২. তালিকাটি স্ক্রল করে <strong>Add to Home Screen (হোম স্ক্রিনে যোগ করুন)</strong> নির্বাচন করুন।
            </p>
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full rounded-xl bg-slate-100 dark:bg-slate-800 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition"
            >
              {language === 'bn' ? 'বুঝেছি / বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
