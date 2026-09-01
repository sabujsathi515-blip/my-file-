import React, { useState, useEffect } from 'react';
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
  ShieldAlert, 
  Key, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  Search,
  Briefcase,
  FileText,
  Save,
  AlertTriangle,
  ExternalLink,
  Tag,
  LogOut,
  User,
  UserCheck
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
  onUpdateNotice?: (n: NoticeItem) => void;
  onDeleteNotice: (id: string) => void;
  onAddJob?: (j: Omit<JobItem, 'id'>) => void;
  onUpdateJob?: (j: JobItem) => void;
  onDeleteJob?: (id: string) => void;
  onAddForm?: (f: Omit<FormItem, 'id'>) => void;
  onUpdateForm?: (f: FormItem) => void;
  onDeleteForm?: (id: string) => void;
  onAddPrice?: (p: Omit<PriceSetting, 'id'>) => void;
  onUpdatePrice: (id: string, rate: number) => void;
  onUpdatePriceFull?: (p: PriceSetting) => void;
  onDeletePrice?: (id: string) => void;
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
  onUpdateNotice,
  onDeleteNotice,
  onAddJob,
  onUpdateJob,
  onDeleteJob,
  onAddForm,
  onUpdateForm,
  onDeleteForm,
  onAddPrice,
  onUpdatePrice,
  onUpdatePriceFull,
  onDeletePrice,
  onResetToDefault,
  onExportBackup,
  onImportBackup
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userIdInput, setUserIdInput] = useState<string>('');
  const [pinInput, setPinInput] = useState<string>('');
  const [showPinText, setShowPinText] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'services' | 'prices' | 'notices' | 'jobs' | 'forms' | 'security' | 'backup'>('services');

  // Stored Admin Credentials (Default: User ID: Milton12, Password: 909311)
  const [currentAdminUserId, setCurrentAdminUserId] = useState<string>('Milton12');
  const [currentAdminPassword, setCurrentAdminPassword] = useState<string>('909311');
  const [newUserIdInput, setNewUserIdInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string>('');

  // Search filter inside admin tabs
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Editing state for Service
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [showAddServiceForm, setShowAddServiceForm] = useState<boolean>(false);

  // New Service Form State
  const [serviceNameEn, setServiceNameEn] = useState<string>('');
  const [serviceNameBn, setServiceNameBn] = useState<string>('');
  const [serviceUrl, setServiceUrl] = useState<string>('');
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>('wb_gov');
  const [serviceSubcat, setServiceSubcat] = useState<string>('');
  const [serviceDescEn, setServiceDescEn] = useState<string>('');
  const [serviceDescBn, setServiceDescBn] = useState<string>('');
  const [isWbGov, setIsWbGov] = useState<boolean>(true);
  const [isCentralGov, setIsCentralGov] = useState<boolean>(false);
  const [isPopular, setIsPopular] = useState<boolean>(false);

  // Editing state for Notice
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [showAddNoticeForm, setShowAddNoticeForm] = useState<boolean>(false);
  const [noticeTitleEn, setNoticeTitleEn] = useState<string>('');
  const [noticeTitleBn, setNoticeTitleBn] = useState<string>('');
  const [noticeType, setNoticeType] = useState<'last_date' | 'exam' | 'scheme' | 'notice' | 'alert'>('alert');
  const [noticeLastDate, setNoticeLastDate] = useState<string>('');
  const [noticeIsUrgent, setNoticeIsUrgent] = useState<boolean>(true);

  // Editing state for Price Rate
  const [editingPrice, setEditingPrice] = useState<PriceSetting | null>(null);
  const [showAddPriceForm, setShowAddPriceForm] = useState<boolean>(false);
  const [newPriceNameEn, setNewPriceNameEn] = useState<string>('');
  const [newPriceNameBn, setNewPriceNameBn] = useState<string>('');
  const [newPriceRate, setNewPriceRate] = useState<number>(10);
  const [newPriceUnit, setNewPriceUnit] = useState<string>('per page');

  // Editing state for Job
  const [editingJob, setEditingJob] = useState<JobItem | null>(null);
  const [showAddJobForm, setShowAddJobForm] = useState<boolean>(false);
  const [jobTitleEn, setJobTitleEn] = useState<string>('');
  const [jobTitleBn, setJobTitleBn] = useState<string>('');
  const [jobDeptEn, setJobDeptEn] = useState<string>('');
  const [jobDeptBn, setJobDeptBn] = useState<string>('');
  const [jobPosts, setJobPosts] = useState<string>('');
  const [jobQualEn, setJobQualEn] = useState<string>('');
  const [jobQualBn, setJobQualBn] = useState<string>('');
  const [jobLastDate, setJobLastDate] = useState<string>('');
  const [jobCategory, setJobCategory] = useState<'wb' | 'central' | 'ssc' | 'upsc' | 'railway' | 'banking' | 'police' | 'defence' | 'teaching'>('wb');
  const [jobApplyUrl, setJobApplyUrl] = useState<string>('');
  const [jobNotifUrl, setJobNotifUrl] = useState<string>('');

  // Editing state for Form
  const [editingForm, setEditingForm] = useState<FormItem | null>(null);
  const [showAddFormForm, setShowAddFormForm] = useState<boolean>(false);
  const [formTitleEn, setFormTitleEn] = useState<string>('');
  const [formTitleBn, setFormTitleBn] = useState<string>('');
  const [formCategory, setFormCategory] = useState<'aadhaar' | 'pan' | 'voter' | 'passport' | 'scholarship' | 'pension' | 'caste' | 'income' | 'land' | 'railway' | 'general'>('general');
  const [formDescEn, setFormDescEn] = useState<string>('');
  const [formDescBn, setFormDescBn] = useState<string>('');
  const [formFileSize, setFormFileSize] = useState<string>('250 KB');
  const [formPages, setFormPages] = useState<number>(1);
  const [formUrl, setFormUrl] = useState<string>('');

  // Delete Confirmation Dialog State
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'service' | 'notice' | 'price' | 'job' | 'form';
    id: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    const savedUserId = localStorage.getItem('cyber_cafe_admin_userid') || 'Milton12';
    const savedPin = localStorage.getItem('cyber_cafe_admin_pin') || '909311';
    setCurrentAdminUserId(savedUserId);
    setCurrentAdminPassword(savedPin);
  }, []);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveUserId = (currentAdminUserId || 'Milton12').trim().toLowerCase();
    const effectivePin = (currentAdminPassword || '909311').trim();
    
    const inputUser = userIdInput.trim().toLowerCase();
    const inputPin = pinInput.trim();

    // Support both the active credentials and default failsafe (Milton12 / 909311)
    const isUserValid = inputUser === effectiveUserId || inputUser === 'milton12';
    const isPassValid = inputPin === effectivePin || inputPin === '909311';

    if (isUserValid && isPassValid) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError(
        language === 'bn' 
          ? 'ভুল ইউজার আইডি বা পাসওয়ার্ড!' 
          : 'Invalid User ID or Password!'
      );
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserIdInput('');
    setPinInput('');
    setPinError('');
  };

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUserId = newUserIdInput.trim() || currentAdminUserId || 'Milton12';
    const targetPassword = newPasswordInput.trim() || currentAdminPassword || '909311';

    localStorage.setItem('cyber_cafe_admin_userid', targetUserId);
    localStorage.setItem('cyber_cafe_admin_pin', targetPassword);
    setCurrentAdminUserId(targetUserId);
    setCurrentAdminPassword(targetPassword);
    setNewUserIdInput('');
    setNewPasswordInput('');
    setPasswordSuccessMsg(
      language === 'bn' 
        ? 'অ্যাডমিন ইউজার আইডি ও পাসওয়ার্ড সফলভাবে সংরক্ষিত হয়েছে!' 
        : 'Admin User ID and Password updated successfully!'
    );
    setTimeout(() => setPasswordSuccessMsg(''), 4000);
  };

  const handleResetPassword = () => {
    localStorage.setItem('cyber_cafe_admin_userid', 'Milton12');
    localStorage.setItem('cyber_cafe_admin_pin', '909311');
    setCurrentAdminUserId('Milton12');
    setCurrentAdminPassword('909311');
    setPasswordSuccessMsg(
      language === 'bn' 
        ? 'ইউজার আইডি Milton12 এবং পাসওয়ার্ড 909311 রিসেট হয়েছে।' 
        : 'Credentials reset to default (User ID: Milton12, Password: 909311).'
    );
    setTimeout(() => setPasswordSuccessMsg(''), 4000);
  };

  // --- SERVICE HANDLERS ---
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
      isPopular,
      safetyBadge: isWbGov || isCentralGov ? 'verified_gov' : 'official_portal',
      tags: ['custom', serviceCategory, serviceSubcat.trim()].filter(Boolean)
    });

    setServiceNameEn('');
    setServiceNameBn('');
    setServiceUrl('');
    setServiceDescEn('');
    setServiceDescBn('');
    setShowAddServiceForm(false);
  };

  const handleSaveEditService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    onUpdateService(editingService);
    setEditingService(null);
  };

  // --- NOTICE HANDLERS ---
  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitleEn.trim()) return;

    onAddNotice({
      titleEn: noticeTitleEn.trim(),
      titleBn: noticeTitleBn.trim() || noticeTitleEn.trim(),
      date: new Date().toISOString().slice(0, 10),
      type: noticeType,
      badgeEn: noticeIsUrgent ? 'URGENT' : 'NOTICE',
      badgeBn: noticeIsUrgent ? 'জরুরি' : 'নোটিশ',
      isUrgent: noticeIsUrgent,
      link: noticeLastDate.trim() ? `#last-date-${noticeLastDate}` : undefined
    });

    setNoticeTitleEn('');
    setNoticeTitleBn('');
    setNoticeLastDate('');
    setShowAddNoticeForm(false);
  };

  const handleSaveEditNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;
    if (onUpdateNotice) {
      onUpdateNotice(editingNotice);
    }
    setEditingNotice(null);
  };

  // --- PRICE HANDLERS ---
  const handleCreatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPriceNameEn.trim() || newPriceRate <= 0) return;
    if (onAddPrice) {
      onAddPrice({
        serviceNameEn: newPriceNameEn.trim(),
        serviceNameBn: newPriceNameBn.trim() || newPriceNameEn.trim(),
        rate: Number(newPriceRate),
        unit: newPriceUnit.trim() || 'per page'
      });
    }
    setNewPriceNameEn('');
    setNewPriceNameBn('');
    setNewPriceRate(10);
    setShowAddPriceForm(false);
  };

  const handleSaveEditPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrice) return;
    if (onUpdatePriceFull) {
      onUpdatePriceFull(editingPrice);
    } else {
      onUpdatePrice(editingPrice.id, editingPrice.rate);
    }
    setEditingPrice(null);
  };

  // --- JOB HANDLERS ---
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitleEn.trim() || !jobApplyUrl.trim()) return;
    if (onAddJob) {
      onAddJob({
        titleEn: jobTitleEn.trim(),
        titleBn: jobTitleBn.trim() || jobTitleEn.trim(),
        departmentEn: jobDeptEn.trim() || 'Government Department',
        departmentBn: jobDeptBn.trim() || 'সরকারি দপ্তর',
        totalPosts: jobPosts.trim() || undefined,
        qualificationEn: jobQualEn.trim() || 'Graduate / 10th / 12th',
        qualificationBn: jobQualBn.trim() || 'মাধ্যমিক / উচ্চমাধ্যমিক / স্নাতক',
        lastDate: jobLastDate.trim() || new Date().toISOString().slice(0, 10),
        category: jobCategory,
        officialNotificationUrl: jobNotifUrl.trim() || jobApplyUrl.trim(),
        applyUrl: jobApplyUrl.trim(),
        status: 'active'
      });
    }
    setJobTitleEn('');
    setJobTitleBn('');
    setJobDeptEn('');
    setJobDeptBn('');
    setJobPosts('');
    setJobQualEn('');
    setJobQualBn('');
    setJobLastDate('');
    setJobApplyUrl('');
    setJobNotifUrl('');
    setShowAddJobForm(false);
  };

  const handleSaveEditJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob || !onUpdateJob) return;
    onUpdateJob(editingJob);
    setEditingJob(null);
  };

  // --- FORM HANDLERS ---
  const handleCreateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleEn.trim()) return;
    if (onAddForm) {
      onAddForm({
        titleEn: formTitleEn.trim(),
        titleBn: formTitleBn.trim() || formTitleEn.trim(),
        category: formCategory,
        descriptionEn: formDescEn.trim() || 'Official application form',
        descriptionBn: formDescBn.trim() || 'অফিসিয়াল আবেদন পত্র',
        fileSize: formFileSize.trim() || '200 KB',
        pages: Number(formPages) || 1,
        officialFormUrl: formUrl.trim() || undefined
      });
    }
    setFormTitleEn('');
    setFormTitleBn('');
    setFormDescEn('');
    setFormDescBn('');
    setFormFileSize('250 KB');
    setFormPages(1);
    setFormUrl('');
    setShowAddFormForm(false);
  };

  const handleSaveEditForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingForm || !onUpdateForm) return;
    onUpdateForm(editingForm);
    setEditingForm(null);
  };

  // --- DELETE CONFIRMATION EXECUTOR ---
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const { type, id } = itemToDelete;
    if (type === 'service') {
      onDeleteService(id);
    } else if (type === 'notice') {
      onDeleteNotice(id);
    } else if (type === 'price') {
      if (onDeletePrice) onDeletePrice(id);
    } else if (type === 'job') {
      if (onDeleteJob) onDeleteJob(id);
    } else if (type === 'form') {
      if (onDeleteForm) onDeleteForm(id);
    }
    setItemToDelete(null);
  };

  const handleBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportBackup(content);
      }
    };
    reader.readAsText(file);
  };

  // Filtered collections based on admin search
  const filteredServices = services.filter(s => 
    s.nameEn.toLowerCase().includes(searchFilter.toLowerCase()) || 
    s.nameBn.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.officialUrl.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredNotices = notices.filter(n => 
    n.titleEn.toLowerCase().includes(searchFilter.toLowerCase()) ||
    n.titleBn.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredPrices = prices.filter(p => 
    p.serviceNameEn.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.serviceNameBn.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredJobs = jobs.filter(j => 
    j.titleEn.toLowerCase().includes(searchFilter.toLowerCase()) ||
    j.titleBn.toLowerCase().includes(searchFilter.toLowerCase()) ||
    j.departmentEn.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredForms = forms.filter(f => 
    f.titleEn.toLowerCase().includes(searchFilter.toLowerCase()) ||
    f.titleBn.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-tight">
                  {language === 'bn' ? 'অ্যাডমিন কন্ট্রোল প্যানেল' : 'Admin Control Panel'}
                </h3>
                {isAuthenticated && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <UserCheck className="w-3 h-3" />
                    <span>{currentAdminUserId || 'Milton12'}</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                {language === 'bn' ? 'সার্ভিস, নোটিশ, রেট ও পোর্টাল পরিচালনা' : 'Portal management & configurations'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                title={language === 'bn' ? 'অ্যাডমিন থেকে লগআউট করুন' : 'Log out from admin'}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Authentication / Login Gate */}
        {!isAuthenticated ? (
          <div className="py-10 px-4 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === 'bn' ? 'অ্যাডমিন লগইন (Admin Login)' : 'Admin Portal Login'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'bn' 
                  ? 'অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করতে ইউজার আইডি ও পাসওয়ার্ড দিন।' 
                  : 'Enter your Admin User ID & Password to manage services.'}
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-3 text-left">
              {/* User ID Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'ইউজার আইডি (User ID) *' : 'User ID *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={userIdInput}
                    onChange={(e) => setUserIdInput(e.target.value)}
                    placeholder={language === 'bn' ? 'ইউজার আইডি লিখুন' : 'Enter User ID'}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'পাসওয়ার্ড (Password) *' : 'Password *'}
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPinText ? 'text' : 'password'}
                    required
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder={language === 'bn' ? 'পাসওয়ার্ড দিন' : 'Enter Password'}
                    className="w-full pl-9 pr-10 py-2.5 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPinText(!showPinText)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                    title={showPinText ? 'Hide' : 'Show'}
                  >
                    {showPinText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {pinError && (
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
              >
                <Unlock className="w-4 h-4" />
                <span>{language === 'bn' ? 'লগইন করুন (Admin Login)' : 'Log In to Admin Dashboard'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Views */
          <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-5">
            {/* Nav Tabs & Logout */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 gap-2">
              <div className="flex gap-2 overflow-x-auto scrollbar-none flex-1">
                {[
                  { id: 'services', label: language === 'bn' ? 'সার্ভিস ম্যানেজার' : 'Services Manager', icon: Layers, count: services.length },
                  { id: 'prices', label: language === 'bn' ? 'রেট ও মূল্য তালিকা' : 'Price & Billing Rates', icon: DollarSign, count: prices.length },
                  { id: 'notices', label: language === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board', icon: Bell, count: notices.length },
                  { id: 'jobs', label: language === 'bn' ? 'চাকরির বিজ্ঞপ্তি' : 'Jobs Manager', icon: Briefcase, count: jobs.length },
                  { id: 'forms', label: language === 'bn' ? 'ফর্ম ডাউনলোড' : 'Forms Manager', icon: FileText, count: forms.length },
                  { id: 'security', label: language === 'bn' ? 'লগইন ও নিরাপত্তা' : 'Security & Login', icon: Key },
                  { id: 'backup', label: language === 'bn' ? 'ব্যাকআপ ও রিসেট' : 'Backup & Reset', icon: RotateCcw }
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(t.id as any);
                        setSearchFilter('');
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                        activeTab === t.id
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                      {t.count !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === t.id ? 'bg-blue-500/80 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                          {t.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Logout button on tab bar */}
              <button
                type="button"
                onClick={handleLogout}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800 text-xs font-bold transition cursor-pointer"
                title={language === 'bn' ? 'লগআউট করুন' : 'Log out'}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
              </button>
            </div>

            {/* Quick Search bar for list views */}
            {['services', 'prices', 'notices', 'jobs', 'forms'].includes(activeTab) && (
              <div className="mb-3 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder={
                      language === 'bn'
                        ? 'খুঁজুন (নাম, ক্যাটাগরি, কি-ওয়ার্ড)...'
                        : 'Search items by name, category, keyword...'
                    }
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
                {searchFilter && (
                  <button
                    type="button"
                    onClick={() => setSearchFilter('')}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded-lg"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            {/* Content Area with scroll */}
            <div className="flex-1 overflow-y-auto pr-1 text-xs space-y-6">
              
              {/* ================= TAB 1: SERVICES MANAGER ================= */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  {/* Action Bar */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-blue-600" />
                        {language === 'bn' ? 'পোর্টাল সার্ভিস তালিকা' : 'Active Portal Services'} ({filteredServices.length})
                      </h4>
                      <p className="text-slate-500 text-[11px]">
                        {language === 'bn' 
                          ? 'যেকোনো সার্ভিস এডিট (Edit ✏️) বা ডিলিট (Delete 🗑️) করতে নিচের বাটন ব্যবহার করুন।' 
                          : 'Edit or Delete any existing cyber cafe / govt portal service item.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddServiceForm(!showAddServiceForm)}
                      className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showAddServiceForm ? (language === 'bn' ? 'ফর্ম বন্ধ করুন' : 'Close Form') : (language === 'bn' ? '+ নতুন সার্ভিস যোগ করুন' : '+ Add New Service')}</span>
                    </button>
                  </div>

                  {/* Add New Service Form */}
                  {showAddServiceForm && (
                    <form onSubmit={handleCreateService} className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-800/60 space-y-3 animate-in fade-in">
                      <h5 className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                        <Plus className="w-4 h-4 text-blue-600" />
                        {language === 'bn' ? 'নতুন সরকারি বা সাইবার সার্ভিস যোগ করুন' : 'Add New Portal / Cyber Service'}
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Service Name (English) *</label>
                          <input
                            type="text"
                            required
                            value={serviceNameEn}
                            onChange={(e) => setServiceNameEn(e.target.value)}
                            placeholder="e.g. WB Health Portal"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Service Name (Bengali)</label>
                          <input
                            type="text"
                            value={serviceNameBn}
                            onChange={(e) => setServiceNameBn(e.target.value)}
                            placeholder="e.g. স্বাস্থ্য সাথী পোর্টাল"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Official URL (.gov.in / portal) *</label>
                          <input
                            type="url"
                            required
                            value={serviceUrl}
                            onChange={(e) => setServiceUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 font-mono outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Category & Subcategory</label>
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={serviceCategory}
                              onChange={(e) => setServiceCategory(e.target.value as ServiceCategory)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 outline-none font-semibold"
                            >
                              <option value="wb_gov">WB Govt</option>
                              <option value="central_gov">Central Govt</option>
                              <option value="aadhaar">Aadhaar</option>
                              <option value="voter">Voter Card</option>
                              <option value="pan">PAN Card</option>
                              <option value="transport">Transport / DL</option>
                              <option value="banking">Banking / Finance</option>
                              <option value="scholarship">Scholarship</option>
                              <option value="health">Health</option>
                              <option value="land">Land & Property</option>
                              <option value="jobs">Jobs</option>
                              <option value="pension">Pension</option>
                              <option value="cyber_tools">Cyber Tools</option>
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
                          <label className="block text-slate-600 dark:text-slate-300 mb-1">Description (English)</label>
                          <input
                            type="text"
                            value={serviceDescEn}
                            onChange={(e) => setServiceDescEn(e.target.value)}
                            placeholder="Brief description"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1">Description (Bengali)</label>
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
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isPopular}
                            onChange={(e) => setIsPopular(e.target.checked)}
                            className="rounded text-blue-600"
                          />
                          <span>Popular Tag</span>
                        </label>
                        <div className="flex-1" />
                        <button
                          type="submit"
                          className="py-1.5 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition cursor-pointer shadow-xs"
                        >
                          + {language === 'bn' ? 'সার্ভিস সেভ করুন' : 'Save Service'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of services with Edit & Delete */}
                  <div className="space-y-2">
                    <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                      {filteredServices.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition shadow-2xs"
                        >
                          <div className="truncate max-w-[60%]">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-bold text-slate-900 dark:text-slate-100">{s.nameEn}</span>
                              <span className="text-slate-400">({s.nameBn})</span>
                            </div>
                            <div className="text-[10px] text-blue-600 dark:text-blue-400 truncate font-mono mt-0.5">
                              {s.officialUrl}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                                {s.category}
                              </span>
                              {s.isWbGov && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                                  WB Govt
                                </span>
                              )}
                              {s.isCentralGov && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold">
                                  Central Govt
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons: EDIT & DELETE */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingService({ ...s })}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 transition font-bold flex items-center gap-1 cursor-pointer"
                              title="Edit service details"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                              <span className="text-[11px]">{language === 'bn' ? 'এডিট' : 'Edit'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setItemToDelete({ type: 'service', id: s.id, title: s.nameEn })}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition font-bold flex items-center gap-1 cursor-pointer"
                              title="Delete service"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span className="text-[11px]">{language === 'bn' ? 'ডিলিট' : 'Delete'}</span>
                            </button>
                          </div>
                        </div>
                      ))}

                      {filteredServices.length === 0 && (
                        <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                          {language === 'bn' ? 'কোনো সার্ভিস পাওয়া যায়নি।' : 'No services found matching your search.'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 2: PRICING RATE EDITOR ================= */}
              {activeTab === 'prices' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        {language === 'bn' ? 'সাইবার ক্যাফে রেট ও বিলিং তালিকা' : 'Fast Billing Price Rates'} ({filteredPrices.length})
                      </h4>
                      <p className="text-slate-500 text-[11px]">
                        {language === 'bn' 
                          ? 'রেট এডিট (Edit ✏️), নতুন রেট যোগ অথবা ডিলিট (Delete 🗑️) করুন।' 
                          : 'Modify per-unit price rates used for billing and invoice calculations.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddPriceForm(!showAddPriceForm)}
                      className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showAddPriceForm ? (language === 'bn' ? 'ফর্ম বন্ধ করুন' : 'Close Form') : (language === 'bn' ? '+ নতুন রেট যোগ করুন' : '+ Add New Rate')}</span>
                    </button>
                  </div>

                  {/* Add New Price Form */}
                  {showAddPriceForm && (
                    <form onSubmit={handleCreatePrice} className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-3 animate-in fade-in">
                      <h5 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                        <Plus className="w-4 h-4 text-emerald-600" />
                        {language === 'bn' ? 'নতুন সার্ভিস রেট যুক্ত করুন' : 'Add New Pricing Service'}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Service Name (English) *</label>
                          <input
                            type="text"
                            required
                            value={newPriceNameEn}
                            onChange={(e) => setNewPriceNameEn(e.target.value)}
                            placeholder="e.g. PVC Smart Card Print"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Service Name (Bengali)</label>
                          <input
                            type="text"
                            value={newPriceNameBn}
                            onChange={(e) => setNewPriceNameBn(e.target.value)}
                            placeholder="e.g. পিভিসি কার্ড প্রিন্ট"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Rate in Rupees (₹) *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={newPriceRate}
                            onChange={(e) => setNewPriceRate(Number(e.target.value))}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 font-bold font-mono outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Unit (e.g. per page, per card, per app)</label>
                          <input
                            type="text"
                            value={newPriceUnit}
                            onChange={(e) => setNewPriceUnit(e.target.value)}
                            placeholder="per page / per card"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs cursor-pointer"
                        >
                          + {language === 'bn' ? 'রেট সেভ করুন' : 'Save Rate'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Price items with Edit & Delete */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                    {filteredPrices.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-emerald-300 dark:hover:border-emerald-800 transition"
                      >
                        <div className="truncate max-w-[55%]">
                          <div className="font-bold text-slate-900 dark:text-slate-100 truncate">{p.serviceNameEn}</div>
                          <div className="text-[11px] text-slate-400 truncate">{p.serviceNameBn}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.unit || 'per unit'}</div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <span className="font-bold text-emerald-600">₹</span>
                            <input
                              type="number"
                              value={p.rate}
                              onChange={(e) => onUpdatePrice(p.id, Number(e.target.value))}
                              className="w-12 text-center font-bold font-mono bg-transparent outline-none text-xs"
                              title="Quick edit rate"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => setEditingPrice({ ...p })}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                            title="Edit full rate details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setItemToDelete({ type: 'price', id: p.id, title: p.serviceNameEn })}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                            title="Delete rate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 3: NOTICES MANAGER ================= */}
              {activeTab === 'notices' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-amber-500" />
                        {language === 'bn' ? 'জরুরি নোটিশ ও নোটিফিকেশন' : 'Breaking & Ticker Notices'} ({filteredNotices.length})
                      </h4>
                      <p className="text-slate-500 text-[11px]">
                        {language === 'bn' 
                          ? 'নোটিশ এডিট (Edit ✏️) বা মুছে ফেলতে (Delete 🗑️) পারেন।' 
                          : 'Publish or update top ticker alerts and breaking notices.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddNoticeForm(!showAddNoticeForm)}
                      className="py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showAddNoticeForm ? (language === 'bn' ? 'ফর্ম বন্ধ করুন' : 'Close Form') : (language === 'bn' ? '+ নতুন নোটিশ দিন' : '+ Add Notice')}</span>
                    </button>
                  </div>

                  {showAddNoticeForm && (
                    <form onSubmit={handleCreateNotice} className="bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-3 animate-in fade-in">
                      <h5 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-amber-500" />
                        {language === 'bn' ? 'নতুন জরুরি নোটিশ প্রকাশ করুন' : 'Publish Alert / Notice'}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Notice Title (English) *</label>
                          <input
                            type="text"
                            required
                            value={noticeTitleEn}
                            onChange={(e) => setNoticeTitleEn(e.target.value)}
                            placeholder="e.g. WB Police Constable Apply Open"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Notice Title (Bengali)</label>
                          <input
                            type="text"
                            value={noticeTitleBn}
                            onChange={(e) => setNoticeTitleBn(e.target.value)}
                            placeholder="বাংলা শিরোনাম"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Type</label>
                          <select
                            value={noticeType}
                            onChange={(e) => setNoticeType(e.target.value as any)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none"
                          >
                            <option value="alert">Alert / জরুরি</option>
                            <option value="last_date">Last Date / শেষ তারিখ</option>
                            <option value="exam">Exam / পরীক্ষা</option>
                            <option value="scheme">Scheme / প্রকল্প</option>
                            <option value="notice">Notice / সাধারণ</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Last Date (Optional)</label>
                          <input
                            type="date"
                            value={noticeLastDate}
                            onChange={(e) => setNoticeLastDate(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none"
                          />
                        </div>
                        <div className="flex items-center pt-5">
                          <label className="flex items-center gap-2 cursor-pointer font-bold">
                            <input
                              type="checkbox"
                              checked={noticeIsUrgent}
                              onChange={(e) => setNoticeIsUrgent(e.target.checked)}
                              className="rounded text-amber-600"
                            />
                            <span>Urgent Alert Tag</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="py-1.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-xs cursor-pointer"
                        >
                          + {language === 'bn' ? 'নোটিশ প্রকাশ করুন' : 'Publish Notice'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Notices list with Edit & Delete */}
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {filteredNotices.map((n) => (
                      <div
                        key={n.id}
                        className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-800 transition"
                      >
                        <div className="truncate max-w-[65%]">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100">{n.titleEn}</span>
                            {n.isUrgent && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold">
                                URGENT
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{n.titleBn}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Date: {n.date}</div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingNotice({ ...n })}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/50 border border-slate-200 dark:border-slate-700 transition font-bold flex items-center gap-1 cursor-pointer"
                            title="Edit notice"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                            <span className="text-[11px]">{language === 'bn' ? 'এডিট' : 'Edit'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setItemToDelete({ type: 'notice', id: n.id, title: n.titleEn })}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition font-bold flex items-center gap-1 cursor-pointer"
                            title="Delete notice"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span className="text-[11px]">{language === 'bn' ? 'ডিলিট' : 'Delete'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 4: JOBS MANAGER ================= */}
              {activeTab === 'jobs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-purple-600" />
                        {language === 'bn' ? 'চাকরি ও নিয়োগ বিজ্ঞপ্তি ম্যানেজার' : 'Jobs & Recruitment Circulars'} ({filteredJobs.length})
                      </h4>
                      <p className="text-slate-500 text-[11px]">
                        {language === 'bn' 
                          ? 'চাকরির বিজ্ঞপ্তি এডিট (Edit ✏️) বা মুছে ফেলুন (Delete 🗑️)।' 
                          : 'Manage job postings, application deadlines, and direct apply URLs.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddJobForm(!showAddJobForm)}
                      className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showAddJobForm ? (language === 'bn' ? 'ফর্ম বন্ধ করুন' : 'Close Form') : (language === 'bn' ? '+ নতুন চাকরি যোগ করুন' : '+ Add Job Post')}</span>
                    </button>
                  </div>

                  {showAddJobForm && (
                    <form onSubmit={handleCreateJob} className="bg-purple-50/50 dark:bg-purple-950/20 p-4 rounded-2xl border border-purple-200 dark:border-purple-800/60 space-y-3 animate-in fade-in">
                      <h5 className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-purple-600" />
                        {language === 'bn' ? 'নতুন চাকরির বিজ্ঞপ্তি যোগ করুন' : 'Add New Job Recruitment'}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Job Title (English) *</label>
                          <input
                            type="text"
                            required
                            value={jobTitleEn}
                            onChange={(e) => setJobTitleEn(e.target.value)}
                            placeholder="e.g. WBPSC Clerkship Recruitment"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Job Title (Bengali)</label>
                          <input
                            type="text"
                            value={jobTitleBn}
                            onChange={(e) => setJobTitleBn(e.target.value)}
                            placeholder="e.g. ক্লার্কশিপ নিয়োগ"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Department</label>
                          <input
                            type="text"
                            value={jobDeptEn}
                            onChange={(e) => setJobDeptEn(e.target.value)}
                            placeholder="e.g. West Bengal PSC"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Category</label>
                          <select
                            value={jobCategory}
                            onChange={(e) => setJobCategory(e.target.value as any)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none"
                          >
                            <option value="wb">West Bengal Govt</option>
                            <option value="central">Central Govt</option>
                            <option value="police">Police & Defence</option>
                            <option value="railway">Railway</option>
                            <option value="ssc">SSC</option>
                            <option value="banking">Banking</option>
                            <option value="teaching">Teaching</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Last Date *</label>
                          <input
                            type="date"
                            required
                            value={jobLastDate}
                            onChange={(e) => setJobLastDate(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Apply Online URL *</label>
                          <input
                            type="url"
                            required
                            value={jobApplyUrl}
                            onChange={(e) => setJobApplyUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 font-mono outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Notification PDF Link</label>
                          <input
                            type="url"
                            value={jobNotifUrl}
                            onChange={(e) => setJobNotifUrl(e.target.value)}
                            placeholder="https://... (PDF link)"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 font-mono outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="py-1.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition shadow-xs cursor-pointer"
                        >
                          + {language === 'bn' ? 'চাকরি সেভ করুন' : 'Save Job Circular'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Jobs list */}
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {filteredJobs.map((j) => (
                      <div
                        key={j.id}
                        className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 transition"
                      >
                        <div className="truncate max-w-[65%]">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{j.titleEn}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{j.departmentEn} • Last Date: {j.lastDate}</div>
                          <div className="text-[10px] text-purple-600 dark:text-purple-400 font-mono truncate">{j.applyUrl}</div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingJob({ ...j })}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950/50 border border-slate-200 dark:border-slate-700 transition font-bold flex items-center gap-1 cursor-pointer"
                            title="Edit job"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-purple-600" />
                            <span className="text-[11px]">{language === 'bn' ? 'এডিট' : 'Edit'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setItemToDelete({ type: 'job', id: j.id, title: j.titleEn })}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition font-bold flex items-center gap-1 cursor-pointer"
                            title="Delete job"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span className="text-[11px]">{language === 'bn' ? 'ডিলিট' : 'Delete'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 5: FORMS MANAGER ================= */}
              {activeTab === 'forms' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        {language === 'bn' ? 'অফলাইন ফর্ম ও ডাউনলোড ম্যানেজার' : 'Offline Forms & Downloads'} ({filteredForms.length})
                      </h4>
                      <p className="text-slate-500 text-[11px]">
                        {language === 'bn' 
                          ? 'ফর্মের বিবরণ বা ডাউনলোড লিঙ্ক এডিট (Edit ✏️) ও ডিলিট (Delete 🗑️) করুন।' 
                          : 'Edit form links, instructions, and download configurations.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddFormForm(!showAddFormForm)}
                      className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showAddFormForm ? (language === 'bn' ? 'ফর্ম বন্ধ করুন' : 'Close Form') : (language === 'bn' ? '+ নতুন ফর্ম যোগ করুন' : '+ Add Form')}</span>
                    </button>
                  </div>

                  {showAddFormForm && (
                    <form onSubmit={handleCreateForm} className="bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 space-y-3 animate-in fade-in">
                      <h5 className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        {language === 'bn' ? 'নতুন ফর্ম যুক্ত করুন' : 'Add New Offline Form'}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Form Title (English) *</label>
                          <input
                            type="text"
                            required
                            value={formTitleEn}
                            onChange={(e) => setFormTitleEn(e.target.value)}
                            placeholder="e.g. Aadhaar Enrolment / Correction Form"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Form Title (Bengali)</label>
                          <input
                            type="text"
                            value={formTitleBn}
                            onChange={(e) => setFormTitleBn(e.target.value)}
                            placeholder="বাংলা নাম"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Category</label>
                          <select
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value as any)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none"
                          >
                            <option value="aadhaar">Aadhaar</option>
                            <option value="pan">PAN</option>
                            <option value="voter">Voter</option>
                            <option value="land">Land</option>
                            <option value="scholarship">Scholarship</option>
                            <option value="pension">Pension</option>
                            <option value="caste">Caste Certificate</option>
                            <option value="general">General</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">File Size</label>
                          <input
                            type="text"
                            value={formFileSize}
                            onChange={(e) => setFormFileSize(e.target.value)}
                            placeholder="e.g. 250 KB"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Pages</label>
                          <input
                            type="number"
                            min="1"
                            value={formPages}
                            onChange={(e) => setFormPages(Number(e.target.value))}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Official Download PDF Link</label>
                        <input
                          type="url"
                          value={formUrl}
                          onChange={(e) => setFormUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 font-mono outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="py-1.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-xs cursor-pointer"
                        >
                          + {language === 'bn' ? 'ফর্ম সেভ করুন' : 'Save Form'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Forms list */}
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {filteredForms.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition"
                      >
                        <div className="truncate max-w-[65%]">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{f.titleEn}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{f.titleBn} • {f.fileSize} ({f.pages} pages)</div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingForm({ ...f })}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 transition font-bold flex items-center gap-1 cursor-pointer"
                            title="Edit form"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="text-[11px]">{language === 'bn' ? 'এডিট' : 'Edit'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setItemToDelete({ type: 'form', id: f.id, title: f.titleEn })}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition font-bold flex items-center gap-1 cursor-pointer"
                            title="Delete form"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span className="text-[11px]">{language === 'bn' ? 'ডিলিট' : 'Delete'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 6: SECURITY & CREDENTIALS MANAGEMENT ================= */}
              {activeTab === 'security' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          {language === 'bn' ? 'অ্যাডমিন ইউজার আইডি ও পাসওয়ার্ড' : 'Admin User ID & Password'}
                        </h4>
                        <p className="text-slate-500 text-xs mt-0.5">
                          {language === 'bn' 
                            ? 'অ্যাডমিন প্যানেলে লগইন করার জন্য বর্তমান সক্রিয় ক্রেডেনশিয়াল।' 
                            : 'Active credentials used to log into the Admin Control Panel.'}
                        </p>
                      </div>

                      {/* Current Active Credentials Display */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-xl text-xs">
                          <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span className="text-slate-500">ID:</span>
                          <span className="font-mono font-bold text-blue-800 dark:text-blue-300">
                            {currentAdminUserId || 'Milton12'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-3 py-1.5 rounded-xl text-xs">
                          <Key className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-slate-500">Pass:</span>
                          <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300">
                            {currentAdminPassword || '909311'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {passwordSuccessMsg && (
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{passwordSuccessMsg}</span>
                      </div>
                    )}

                    {/* Change Credentials Form */}
                    <form onSubmit={handleUpdateCredentials} className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                      <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                        {language === 'bn' ? 'ইউজার আইডি ও পাসওয়ার্ড পরিবর্তন করুন' : 'Update Admin Credentials'}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            {language === 'bn' ? 'নতুন ইউজার আইডি (New User ID)' : 'New User ID'}
                          </label>
                          <input
                            type="text"
                            value={newUserIdInput}
                            onChange={(e) => setNewUserIdInput(e.target.value)}
                            placeholder={language === 'bn' ? 'নতুন ইউজার আইডি লিখুন' : 'Enter new user ID'}
                            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-medium text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            {language === 'bn' ? 'নতুন পাসওয়ার্ড (New Password)' : 'New Password'}
                          </label>
                          <input
                            type="text"
                            value={newPasswordInput}
                            onChange={(e) => setNewPasswordInput(e.target.value)}
                            placeholder={language === 'bn' ? 'নতুন পাসওয়ার্ড লিখুন' : 'Enter new password'}
                            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-mono text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <button
                          type="submit"
                          disabled={!newUserIdInput.trim() && !newPasswordInput.trim()}
                          className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'ক্রেডেনশিয়াল সেভ করুন' : 'Save Credentials'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleResetPassword}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'ডিফল্ট ক্রেডেনশিয়াল রিসেট করুন' : 'Reset to default credentials'}</span>
                        </button>
                      </div>
                    </form>

                    {/* Quick Logout button inside Security Tab */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        {language === 'bn' ? 'অ্যাডমিন সেশন শেষ করতে লগআউট করুন' : 'Terminate active admin session safely'}
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="py-1.5 px-3 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'লগআউট করুন' : 'Log Out Now'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 7: BACKUP & RESET ================= */}
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
                        className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
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
                      className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                    >
                      Reset All Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= EDIT SERVICE MODAL ================= */}
        {editingService && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  {language === 'bn' ? 'সার্ভিস সম্পাদনা (Edit Service)' : 'Edit Service Details'}
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditService} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Service Name (English) *</label>
                    <input
                      type="text"
                      required
                      value={editingService.nameEn}
                      onChange={(e) => setEditingService({ ...editingService, nameEn: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Service Name (Bengali)</label>
                    <input
                      type="text"
                      value={editingService.nameBn}
                      onChange={(e) => setEditingService({ ...editingService, nameBn: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Official URL *</label>
                    <input
                      type="url"
                      required
                      value={editingService.officialUrl}
                      onChange={(e) => setEditingService({ ...editingService, officialUrl: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono outline-none focus:border-blue-500 text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Category & Subcategory</label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={editingService.category}
                        onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-2 outline-none font-semibold"
                      >
                        <option value="wb_gov">WB Govt</option>
                        <option value="central_gov">Central Govt</option>
                        <option value="aadhaar">Aadhaar</option>
                        <option value="voter">Voter Card</option>
                        <option value="pan">PAN Card</option>
                        <option value="transport">Transport / DL</option>
                        <option value="banking">Banking</option>
                        <option value="scholarship">Scholarship</option>
                        <option value="health">Health</option>
                        <option value="land">Land & Property</option>
                        <option value="jobs">Jobs</option>
                        <option value="pension">Pension</option>
                        <option value="cyber_tools">Cyber Tools</option>
                      </select>
                      <input
                        type="text"
                        value={editingService.subcategory || ''}
                        onChange={(e) => setEditingService({ ...editingService, subcategory: e.target.value })}
                        placeholder="Subcategory"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-2 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1">Description (English)</label>
                    <input
                      type="text"
                      value={editingService.descriptionEn}
                      onChange={(e) => setEditingService({ ...editingService, descriptionEn: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1">Description (Bengali)</label>
                    <input
                      type="text"
                      value={editingService.descriptionBn}
                      onChange={(e) => setEditingService({ ...editingService, descriptionBn: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={editingService.isWbGov || false}
                      onChange={(e) => setEditingService({ ...editingService, isWbGov: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>WB Govt Tag</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={editingService.isCentralGov || false}
                      onChange={(e) => setEditingService({ ...editingService, isCentralGov: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Central Govt Tag</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={editingService.isPopular || false}
                      onChange={(e) => setEditingService({ ...editingService, isPopular: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Popular Tag</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                  >
                    {language === 'bn' ? 'বাতিল করুন' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= EDIT PRICE MODAL ================= */}
        {editingPrice && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  {language === 'bn' ? 'রেট সম্পাদনা (Edit Rate)' : 'Edit Price Setting'}
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingPrice(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditPrice} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Service Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingPrice.serviceNameEn}
                    onChange={(e) => setEditingPrice({ ...editingPrice, serviceNameEn: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Service Name (Bengali)</label>
                  <input
                    type="text"
                    value={editingPrice.serviceNameBn}
                    onChange={(e) => setEditingPrice({ ...editingPrice, serviceNameBn: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Rate (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editingPrice.rate}
                      onChange={(e) => setEditingPrice({ ...editingPrice, rate: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold font-mono outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Unit</label>
                    <input
                      type="text"
                      value={editingPrice.unit}
                      onChange={(e) => setEditingPrice({ ...editingPrice, unit: e.target.value })}
                      placeholder="per page / per card"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingPrice(null)}
                    className="py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Rate'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= EDIT NOTICE MODAL ================= */}
        {editingNotice && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" />
                  {language === 'bn' ? 'নোটিশ সম্পাদনা (Edit Notice)' : 'Edit Notice Details'}
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingNotice(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditNotice} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingNotice.titleEn}
                    onChange={(e) => setEditingNotice({ ...editingNotice, titleEn: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-amber-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Title (Bengali)</label>
                  <input
                    type="text"
                    value={editingNotice.titleBn}
                    onChange={(e) => setEditingNotice({ ...editingNotice, titleBn: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-amber-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Type</label>
                    <select
                      value={editingNotice.type}
                      onChange={(e) => setEditingNotice({ ...editingNotice, type: e.target.value as any })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                    >
                      <option value="alert">Alert / জরুরি</option>
                      <option value="last_date">Last Date / শেষ তারিখ</option>
                      <option value="exam">Exam / পরীক্ষা</option>
                      <option value="scheme">Scheme / প্রকল্প</option>
                      <option value="notice">Notice / সাধারণ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Date</label>
                    <input
                      type="date"
                      value={editingNotice.date}
                      onChange={(e) => setEditingNotice({ ...editingNotice, date: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={editingNotice.isUrgent || false}
                      onChange={(e) => setEditingNotice({ ...editingNotice, isUrgent: e.target.checked })}
                      className="rounded text-amber-600"
                    />
                    <span>Urgent Alert Tag</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingNotice(null)}
                    className="py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Notice'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= EDIT JOB MODAL ================= */}
        {editingJob && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  {language === 'bn' ? 'চাকরি বিজ্ঞপ্তি সম্পাদনা' : 'Edit Job Circular'}
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditJob} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Title (English) *</label>
                    <input
                      type="text"
                      required
                      value={editingJob.titleEn}
                      onChange={(e) => setEditingJob({ ...editingJob, titleEn: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-purple-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Department (English)</label>
                    <input
                      type="text"
                      value={editingJob.departmentEn}
                      onChange={(e) => setEditingJob({ ...editingJob, departmentEn: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Apply Online URL *</label>
                    <input
                      type="url"
                      required
                      value={editingJob.applyUrl}
                      onChange={(e) => setEditingJob({ ...editingJob, applyUrl: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Last Date *</label>
                    <input
                      type="date"
                      required
                      value={editingJob.lastDate}
                      onChange={(e) => setEditingJob({ ...editingJob, lastDate: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-semibold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingJob(null)}
                    className="py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Job'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= EDIT FORM MODAL ================= */}
        {editingForm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  {language === 'bn' ? 'ফর্ম সম্পাদনা (Edit Form)' : 'Edit Offline Form'}
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingForm(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditForm} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingForm.titleEn}
                    onChange={(e) => setEditingForm({ ...editingForm, titleEn: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Title (Bengali)</label>
                  <input
                    type="text"
                    value={editingForm.titleBn}
                    onChange={(e) => setEditingForm({ ...editingForm, titleBn: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">File Size</label>
                    <input
                      type="text"
                      value={editingForm.fileSize}
                      onChange={(e) => setEditingForm({ ...editingForm, fileSize: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Pages</label>
                    <input
                      type="number"
                      min="1"
                      value={editingForm.pages}
                      onChange={(e) => setEditingForm({ ...editingForm, pages: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">Download URL</label>
                  <input
                    type="url"
                    value={editingForm.officialFormUrl || ''}
                    onChange={(e) => setEditingForm({ ...editingForm, officialFormUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingForm(null)}
                    className="py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Form'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= DELETE CONFIRMATION MODAL ================= */}
        {itemToDelete && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-rose-200 dark:border-rose-900/60 p-5 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-800">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  {language === 'bn' ? 'মুছে ফেলার নিশ্চিতকরণ' : 'Confirm Delete'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {language === 'bn' ? (
                    <>
                      আপনি কি নিশ্চিতভাবে <span className="font-bold text-slate-800 dark:text-slate-200">"{itemToDelete.title}"</span> মুছে ফেলতে চান? এটি পোর্টাল থেকে বাদ যাবে।
                    </>
                  ) : (
                    <>
                      Are you sure you want to permanently delete <span className="font-bold text-slate-800 dark:text-slate-200">"{itemToDelete.title}"</span>?
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'হ্যাঁ, ডিলিট করুন' : 'Yes, Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
