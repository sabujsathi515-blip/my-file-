import { useState, useEffect } from 'react';
import { 
  ServiceItem, 
  NoticeItem, 
  JobItem, 
  FormItem, 
  CustomerRecord, 
  IncomeExpenseRecord, 
  PriceSetting, 
  Language, 
  ThemeMode 
} from '../types';
import { 
  INITIAL_SERVICES, 
  INITIAL_NOTICES, 
  INITIAL_JOBS, 
  INITIAL_FORMS, 
  INITIAL_CUSTOMERS, 
  INITIAL_INCOME_EXPENSES, 
  INITIAL_PRICES 
} from '../data/defaultData';

const DATA_VERSION = '2026.2';

export function useStorage() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('dsp_lang') as Language) || 'bn';
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('dsp_theme') as ThemeMode;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const savedVersion = localStorage.getItem('dsp_data_version');
    const saved = localStorage.getItem('dsp_services');
    if (saved && savedVersion === DATA_VERSION) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Update to 2026 fresh dataset
    localStorage.setItem('dsp_data_version', DATA_VERSION);
    return INITIAL_SERVICES;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('dsp_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ['wb-banglarbhumi', 'wb-edistrict', 'central-uidai-myaadhaar', 'central-voter-eci', 'wb-swasthyasathi', 'wb-lakshmirbhandar', 'wb-panchayat-tax'];
  });

  const [recentServiceIds, setRecentServiceIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('dsp_recents');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ['wb-banglarbhumi', 'wb-panchayat-tax', 'wb-annapurna', 'wb-edistrict'];
  });

  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    const saved = localStorage.getItem('dsp_notices');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_NOTICES;
  });

  const [jobs, setJobs] = useState<JobItem[]>(() => {
    const saved = localStorage.getItem('dsp_jobs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_JOBS;
  });

  const [forms, setForms] = useState<FormItem[]>(() => {
    const savedVersion = localStorage.getItem('dsp_forms_version');
    const saved = localStorage.getItem('dsp_forms');
    if (saved && savedVersion === DATA_VERSION) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    localStorage.setItem('dsp_forms_version', DATA_VERSION);
    return INITIAL_FORMS;
  });

  const [customers, setCustomers] = useState<CustomerRecord[]>(() => {
    const saved = localStorage.getItem('dsp_customers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_CUSTOMERS;
  });

  const [incomeExpenses, setIncomeExpenses] = useState<IncomeExpenseRecord[]>(() => {
    const saved = localStorage.getItem('dsp_income_expenses');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_INCOME_EXPENSES;
  });

  const [prices, setPrices] = useState<PriceSetting[]>(() => {
    const saved = localStorage.getItem('dsp_prices');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PRICES;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('dsp_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('dsp_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('dsp_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('dsp_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('dsp_recents', JSON.stringify(recentServiceIds));
  }, [recentServiceIds]);

  useEffect(() => {
    localStorage.setItem('dsp_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('dsp_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('dsp_forms', JSON.stringify(forms));
  }, [forms]);

  useEffect(() => {
    localStorage.setItem('dsp_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('dsp_income_expenses', JSON.stringify(incomeExpenses));
  }, [incomeExpenses]);

  useEffect(() => {
    localStorage.setItem('dsp_prices', JSON.stringify(prices));
  }, [prices]);

  // Actions
  const toggleFavorite = (serviceId: string) => {
    setFavorites(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [serviceId, ...prev];
      }
    });
  };

  const trackRecent = (serviceId: string) => {
    setRecentServiceIds(prev => {
      const filtered = prev.filter(id => id !== serviceId);
      return [serviceId, ...filtered].slice(0, 12);
    });
  };

  const addService = (newService: Omit<ServiceItem, 'id'>) => {
    const item: ServiceItem = {
      ...newService,
      id: 'custom-' + Date.now()
    };
    setServices(prev => [item, ...prev]);
  };

  const updateService = (updated: ServiceItem) => {
    setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    setFavorites(prev => prev.filter(favId => favId !== id));
  };

  const addNotice = (notice: Omit<NoticeItem, 'id'>) => {
    const item: NoticeItem = {
      ...notice,
      id: 'notice-' + Date.now()
    };
    setNotices(prev => [item, ...prev]);
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  const addJob = (job: Omit<JobItem, 'id'>) => {
    const item: JobItem = {
      ...job,
      id: 'job-' + Date.now()
    };
    setJobs(prev => [item, ...prev]);
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const addForm = (form: Omit<FormItem, 'id'>) => {
    const item: FormItem = {
      ...form,
      id: 'form-' + Date.now()
    };
    setForms(prev => [item, ...prev]);
  };

  const deleteForm = (id: string) => {
    setForms(prev => prev.filter(f => f.id !== id));
  };

  const addCustomer = (cust: Omit<CustomerRecord, 'id' | 'createdAt'>) => {
    const item: CustomerRecord = {
      ...cust,
      id: 'cust-' + Date.now(),
      createdAt: Date.now()
    };
    setCustomers(prev => [item, ...prev]);

    // Also optionally record as income
    if (cust.amount > 0 && cust.paymentStatus === 'Paid') {
      addIncomeExpense({
        type: 'income',
        category: cust.serviceTaken.slice(0, 24),
        amount: cust.amount,
        description: `Service for ${cust.customerName} (${cust.mobile})`,
        date: cust.date,
        paymentMode: 'Cash'
      });
    }
  };

  const updateCustomerStatus = (id: string, newStatus: 'Paid' | 'Due') => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, paymentStatus: newStatus } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const addIncomeExpense = (rec: Omit<IncomeExpenseRecord, 'id' | 'createdAt'>) => {
    const item: IncomeExpenseRecord = {
      ...rec,
      id: (rec.type === 'income' ? 'inc-' : 'exp-') + Date.now(),
      createdAt: Date.now()
    };
    setIncomeExpenses(prev => [item, ...prev]);
  };

  const deleteIncomeExpense = (id: string) => {
    setIncomeExpenses(prev => prev.filter(r => r.id !== id));
  };

  const updatePrice = (id: string, newRate: number) => {
    setPrices(prev => prev.map(p => p.id === id ? { ...p, rate: newRate } : p));
  };

  const resetToDefault = () => {
    if (window.confirm('Reset all portal services, notices, and prices to official default datasets?')) {
      setServices(INITIAL_SERVICES);
      setNotices(INITIAL_NOTICES);
      setJobs(INITIAL_JOBS);
      setForms(INITIAL_FORMS);
      setPrices(INITIAL_PRICES);
      setFavorites(['wb-banglarbhumi', 'wb-edistrict', 'central-uidai-myaadhaar', 'central-voter-eci', 'wb-swasthyasathi', 'central-parivahan-vahan', 'central-incometax-efiling']);
    }
  };

  const exportBackupJson = () => {
    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      services,
      favorites,
      notices,
      jobs,
      forms,
      customers,
      incomeExpenses,
      prices
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digital-seva-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackupJson = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.services) setServices(data.services);
      if (data.favorites) setFavorites(data.favorites);
      if (data.notices) setNotices(data.notices);
      if (data.jobs) setJobs(data.jobs);
      if (data.forms) setForms(data.forms);
      if (data.customers) setCustomers(data.customers);
      if (data.incomeExpenses) setIncomeExpenses(data.incomeExpenses);
      if (data.prices) setPrices(data.prices);
      alert('Data restored successfully!');
    } catch (e) {
      alert('Invalid backup JSON file.');
    }
  };

  return {
    language,
    setLanguage,
    theme,
    setTheme,
    services,
    favorites,
    recentServiceIds,
    notices,
    jobs,
    forms,
    customers,
    incomeExpenses,
    prices,
    toggleFavorite,
    trackRecent,
    addService,
    updateService,
    deleteService,
    addNotice,
    deleteNotice,
    addJob,
    deleteJob,
    addForm,
    deleteForm,
    addCustomer,
    updateCustomerStatus,
    deleteCustomer,
    addIncomeExpense,
    deleteIncomeExpense,
    updatePrice,
    resetToDefault,
    exportBackupJson,
    importBackupJson
  };
}
