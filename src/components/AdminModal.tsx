import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  DollarSign, 
  Bell, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Layers,
  Settings,
  ShieldAlert
} from 'lucide-react';
import { 
  ServiceItem, 
  NoticeItem, 
  JobItem, 
  FormItem, 
  PriceSetting, 
  Language, 
  ServiceCategory 
} from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  services: ServiceItem[];
  notices: NoticeItem[];
  jobs: JobItem[];
  forms: FormItem[];
  prices: PriceSetting[];
  onAddService: (s: Omit<ServiceItem, 'id'>) => void;
  onUpdateService: (s: ServiceItem) => void;
  onDeleteService: (id: string) => void;
  onAddNotice: (n: Omit<NoticeItem, 'id'>) => void;
  onDeleteNotice: (id: string) => void;
  onUpdatePrice: (id: string, rate: number) => void;
  onResetToDefault: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonStr: string) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  language,
  services,
  notices,
  jobs,
  forms,
  prices,
  onAddService,
  onUpdateService,
  onDeleteService,
  onAddNotice,
  onDeleteNotice,
  onUpdatePrice,
  onResetToDefault,
  onExportBackup,
  onImportBackup
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'services' | 'prices' | 'notices' | 'backup'>('services');

  // New Service Form state
  const [serviceNameEn, setServiceNameEn] = useState<string>('');
  const [serviceNameBn, setServiceNameBn] = useState<string>('');
  const [serviceUrl, setServiceUrl] = useState<string>('');
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>('wb_govt');
  const [serviceSubcat, setServiceSubcat] = useState<string>('');
  const [serviceDescEn, setServiceDescEn] = useState<string>('');
  const [serviceDescBn, setServiceDescBn] = useState<string>('');
  const [isWbGov, setIsWbGov] = useState<boolean>(true);
  const [isCentralGov, setIsCentralGov] = useState<boolean>(false);

  // New Notice state
  const [noticeTitleEn, setNoticeTitleEn] = useState<string>('');
  const [noticeTitleBn, setNoticeTitleBn] = useState<string>('');
  const [noticeLastDate, setNoticeLastDate] = useState<string>('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'admin123' || pinInput === '1234') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN. (Default PIN: admin123 or 1234)');
    }
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceNameEn.trim() || !serviceUrl.trim()) return;

    onAddService({
      nameEn: serviceNameEn.trim(),
      nameBn: serviceNameBn.trim() || serviceNameEn.trim(),
      category: serviceCategory,
      subcategory: serviceSubcat.trim() || 'General',
      officialUrl: serviceUrl.trim(),
      descriptionEn: serviceDescEn.trim() || 'Official portal link',
      descriptionBn: serviceDescBn.trim() || 'অফিসিয়াল পোর্টাল লিঙ্ক',
      iconName: 'Globe',
      isWbGov,
      isCentralGov,
      tags: ['custom', serviceCategory]
    });

    setServiceNameEn('');
    setServiceNameBn('');
    setServiceUrl('');
    setServiceDescEn('');
    setServiceDescBn('');
    alert('Service added successfully!');
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitleEn.trim()) return;

    onAddNotice({
      titleEn: noticeTitleEn.trim(),
      titleBn: noticeTitleBn.trim() || noticeTitleEn.trim(),
      descriptionEn: '',
      descriptionBn: '',
      date: new Date().toISOString().slice(0, 10),
      isUrgent: true,
      lastDate: noticeLastDate.trim() || undefined
    });

    setNoticeTitleEn('');
    setNoticeTitleBn('');
    setNoticeLastDate('');
    alert('Notice published successfully!');
  };

  const handleBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      onImportBackup(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === 'bn' ? 'পোর্টাল অ্যাডমিন ও নিয়ন্ত্রণ প্যানেল' : 'Digital Seva Portal Admin Control'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'পরিষেবা লিংক, নোটিশ ও রেট তালিকা পরিচালনা করুন' : 'Manage service endpoints, alerts, and billing rates'}
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

        {/* PIN Authentication Gate */}
        {!isAuthenticated ? (
          <div className="py-12 flex flex-col items-center justify-center max-w-sm mx-auto text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Admin Security PIN</h3>
              <p className="text-xs text-slate-500 mt-1">Please enter your 4-digit PIN to access admin configuration.</p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-3">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (Default: admin123 or 1234)"
                className="w-full text-center tracking-widest text-lg font-mono py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500"
                autoFocus
              />
              {pinError && <p className="text-xs text-red-500 font-semibold">{pinError}</p>}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
              >
                Unlock Admin Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Views */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 overflow-x-auto scrollbar-none">
              {[
                { id: 'services', label: 'Services Manager', icon: Layers },
                { id: 'prices', label: 'Price & Billing Rates', icon: DollarSign },
                { id: 'notices', label: 'Notice Board', icon: Bell },
                { id: 'backup', label: 'Backup & Reset', icon: RotateCcw }
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      activeTab === t.id
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Area with scroll */}
            <div className="flex-1 overflow-y-auto pr-1 text-xs space-y-6">
              {/* Tab 1: Service Manager */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  {/* Add Service form */}
                  <form onSubmit={handleCreateService} className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-blue-600" />
                      Add New Government / Cyber Service
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-500 mb-1">Service Name (English) *</label>
                        <input
                          type="text"
                          required
                          value={serviceNameEn}
                          onChange={(e) => setServiceNameEn(e.target.value)}
                          placeholder="e.g. WB Health Portal"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1">Service Name (Bengali)</label>
                        <input
                          type="text"
                          value={serviceNameBn}
                          onChange={(e) => setServiceNameBn(e.target.value)}
                          placeholder="e.g. স্বাস্থ্য পোর্টাল"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-500 mb-1">Official URL (.gov.in / portal) *</label>
                        <input
                          type="url"
                          required
                          value={serviceUrl}
                          onChange={(e) => setServiceUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 font-mono outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1">Category & Subcategory</label>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={serviceCategory}
                            onChange={(e) => setServiceCategory(e.target.value as ServiceCategory)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 outline-none"
                          >
                            <option value="wb_govt">WB Govt</option>
                            <option value="central_govt">Central Govt</option>
                            <option value="jobs">Jobs</option>
                            <option value="scholarship">Scholarship</option>
                            <option value="health">Health</option>
                            <option value="social_security">Social Security</option>
                          </select>
                          <input
                            type="text"
                            value={serviceSubcat}
                            onChange={(e) => setServiceSubcat(e.target.value)}
                            placeholder="Subcategory"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-500 mb-1">Description (English)</label>
                        <input
                          type="text"
                          value={serviceDescEn}
                          onChange={(e) => setServiceDescEn(e.target.value)}
                          placeholder="Brief description"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1">Description (Bengali)</label>
                        <input
                          type="text"
                          value={serviceDescBn}
                          onChange={(e) => setServiceDescBn(e.target.value)}
                          placeholder="বাংলা বিবরণ"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-1">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isWbGov}
                          onChange={(e) => setIsWbGov(e.target.checked)}
                          className="rounded text-blue-600"
                        />
                        <span>WB Govt Tag</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isCentralGov}
                          onChange={(e) => setIsCentralGov(e.target.checked)}
                          className="rounded text-blue-600"
                        />
                        <span>Central Govt Tag</span>
                      </label>
                      <div className="flex-1" />
                      <button
                        type="submit"
                        className="py-1.5 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
                      >
                        + Add Service
                      </button>
                    </div>
                  </form>

                  {/* List of existing services */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">Active Portal Services ({services.length})</h4>
                    <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                      {services.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800"
                        >
                          <div className="truncate max-w-[65%]">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{s.nameEn}</span>
                            <span className="text-slate-400 ml-1.5">({s.nameBn})</span>
                            <div className="text-[10px] text-blue-500 truncate font-mono">{s.officialUrl}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                              {s.category}
                            </span>
                            <button
                              type="button"
                              onClick={() => onDeleteService(s.id)}
                              className="p-1 text-slate-400 hover:text-red-600"
                              title="Delete service"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Pricing Rate Editor */}
              {activeTab === 'prices' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Cyber Café Standard Service Price List (₹)
                  </h4>
                  <p className="text-slate-500">Edit the default unit rates used by the Fast Billing Calculator.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {prices.map((p) => (
                      <div
                        key={p.id}
                        className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{p.serviceNameEn}</div>
                          <div className="text-[11px] text-slate-400">{p.serviceNameBn}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-slate-400">₹</span>
                          <input
                            type="number"
                            value={p.rate}
                            onChange={(e) => onUpdatePrice(p.id, Number(e.target.value))}
                            className="w-16 text-center font-bold font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg py-1 px-2 outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Notices Manager */}
              {activeTab === 'notices' && (
                <div className="space-y-4">
                  <form onSubmit={handleCreateNotice} className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-amber-500" />
                      Publish Breaking / Urgent Alert
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-500 mb-1">Notice Title (English) *</label>
                        <input
                          type="text"
                          required
                          value={noticeTitleEn}
                          onChange={(e) => setNoticeTitleEn(e.target.value)}
                          placeholder="e.g. WB Police Constable Apply Open"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1">Notice Title (Bengali)</label>
                        <input
                          type="text"
                          value={noticeTitleBn}
                          onChange={(e) => setNoticeTitleBn(e.target.value)}
                          placeholder="বাংলা শিরোনাম"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Application Last Date (Optional)</label>
                      <input
                        type="date"
                        value={noticeLastDate}
                        onChange={(e) => setNoticeLastDate(e.target.value)}
                        className="w-48 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="py-1.5 px-4 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition"
                    >
                      Publish Alert
                    </button>
                  </form>

                  {/* Existing notices list */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">Active Ticker Notices</h4>
                    {notices.map((n) => (
                      <div
                        key={n.id}
                        className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800"
                      >
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{n.titleEn}</div>
                          <div className="text-[11px] text-slate-400">{n.titleBn}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onDeleteNotice(n.id)}
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Backup & Reset */}
              {activeTab === 'backup' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <h4 className="font-bold text-slate-900 dark:text-white">Backup & Data Migration</h4>
                    <p className="text-slate-500">
                      Download a complete JSON snapshot of all custom services, customer registers, and billing records to keep them safe or move between browsers.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={onExportBackup}
                        className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Export Backup JSON
                      </button>

                      <label className="py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Restore from JSON</span>
                        <input type="file" accept=".json" onChange={handleBackupFile} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="bg-rose-50 dark:bg-rose-950/30 p-5 rounded-2xl border border-rose-200 dark:border-rose-800 space-y-2">
                    <h4 className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      Reset to Official Defaults
                    </h4>
                    <p className="text-rose-700 dark:text-rose-400">
                      Reset all services, notices, and price rates to the verified original state.
                    </p>
                    <button
                      type="button"
                      onClick={onResetToDefault}
                      className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                    >
                      Reset All Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
