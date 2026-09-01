import React, { useState, useMemo } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  SearchAndHero 
} from './components/SearchAndHero';
import { 
  QuickAccessBar 
} from './components/QuickAccessBar';
import { 
  NoticeTicker 
} from './components/NoticeTicker';
import { 
  FavoritesAndRecentSection 
} from './components/FavoritesAndRecentSection';
import { 
  ServiceCard 
} from './components/ServiceCard';
import { 
  WestBengalSection 
} from './components/WestBengalSection';
import { 
  CentralGovSection 
} from './components/CentralGovSection';
import { 
  CyberToolsSection 
} from './components/CyberToolsSection';
import { 
  OnlineFormsSection 
} from './components/OnlineFormsSection';
import { 
  JobsSection 
} from './components/JobsSection';
import { 
  ScholarshipsSection 
} from './components/ScholarshipsSection';
import { 
  HealthSocialSection 
} from './components/HealthSocialSection';
import { 
  CustomerRegisterSection 
} from './components/CustomerRegisterSection';
import { 
  IncomeExpenseSection 
} from './components/IncomeExpenseSection';
import { 
  AdminModal 
} from './components/AdminModal';
import { 
  ExternalSafetyModal 
} from './components/ExternalSafetyModal';
import { 
  Footer 
} from './components/Footer';
import { useStorage } from './hooks/useStorage';
import { ServiceItem } from './types';
import { 
  Landmark, 
  Building, 
  Wrench, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export function App() {
  const {
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
  } = useStorage();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [safetyModalService, setSafetyModalService] = useState<ServiceItem | null>(null);

  // Search filtering logic across Bengali, English names, and tags
  const searchFilteredServices = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return services.filter((s) => {
      const matchNameEn = s.nameEn.toLowerCase().includes(q);
      const matchNameBn = s.nameBn.toLowerCase().includes(q);
      const matchDescEn = s.descriptionEn.toLowerCase().includes(q);
      const matchDescBn = s.descriptionBn.toLowerCase().includes(q);
      const matchTags = s.tags.some((t) => t.toLowerCase().includes(q));
      const matchSubcat = s.subcategory?.toLowerCase().includes(q);
      return matchNameEn || matchNameBn || matchDescEn || matchDescBn || matchTags || matchSubcat;
    });
  }, [services, searchQuery]);

  const handleOpenService = (service: ServiceItem) => {
    trackRecent(service.id);
    setSafetyModalService(service);
  };

  const handleOpenServiceById = (serviceId: string) => {
    const s = services.find((item) => item.id === serviceId);
    if (s) {
      handleOpenService(s);
    }
  };

  const handleProceedToOfficialUrl = () => {
    if (safetyModalService) {
      window.open(safetyModalService.officialUrl, '_blank', 'noopener,noreferrer');
      setSafetyModalService(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors flex flex-col justify-between">
      {/* Top Navbar */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        {/* If user is searching from any tab, show instant search results */}
        {searchQuery.trim() !== '' ? (
          <div className="space-y-6">
            <SearchAndHero
              language={language}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              totalServicesCount={services.length}
            />

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {language === 'bn' 
                    ? `অনুসন্ধানের ফলাফল: "${searchQuery}" (${searchFilteredServices.length}টি পাওয়া গেছে)` 
                    : `Search Results for "${searchQuery}" (${searchFilteredServices.length} found)`}
                </h2>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {language === 'bn' ? 'সার্চ ক্লিয়ার করুন' : 'Clear Search'}
                </button>
              </div>

              {searchFilteredServices.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-sm font-medium">
                    {language === 'bn' 
                      ? 'কোনো সেবা পাওয়া যায়নি। দয়া করে অন্য কোনো নাম দিয়ে চেষ্টা করুন।' 
                      : 'No services found matching your query.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {searchFilteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      language={language}
                      isFavorite={favorites.includes(service.id)}
                      onToggleFavorite={toggleFavorite}
                      onOpenService={handleOpenService}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Tab 1: Home Dashboard */}
            {activeTab === 'home' && (
              <div className="space-y-8">
                {/* Search & Welcome Banner */}
                <SearchAndHero
                  language={language}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  totalServicesCount={services.length}
                />

                {/* Quick Access Bar */}
                <QuickAccessBar
                  language={language}
                  onOpenServiceById={handleOpenServiceById}
                />

                {/* Urgent Alerts / Notice Ticker */}
                <NoticeTicker
                  notices={notices}
                  language={language}
                />

                {/* Favorites and Recently Used Grid */}
                <FavoritesAndRecentSection
                  services={services}
                  favoriteIds={favorites}
                  recentIds={recentServiceIds}
                  language={language}
                  onToggleFavorite={toggleFavorite}
                  onOpenService={handleOpenService}
                />

                {/* West Bengal Highlight Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      {language === 'bn' ? 'পশ্চিমবঙ্গ সরকার শীর্ষ সেবা (West Bengal Govt)' : 'Top West Bengal Government Services'}
                    </h2>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('wb_gov'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>{language === 'bn' ? 'সব দেখুন' : 'View All WB'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {services
                      .filter((s) => s.isWbGov)
                      .slice(0, 8)
                      .map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          language={language}
                          isFavorite={favorites.includes(service.id)}
                          onToggleFavorite={toggleFavorite}
                          onOpenService={handleOpenService}
                        />
                      ))}
                  </div>
                </div>

                {/* Central Government Highlight Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Building className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      {language === 'bn' ? 'কেন্দ্রীয় সরকার শীর্ষ সেবা (Central Government)' : 'Top Central Government Portals'}
                    </h2>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('central_gov'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>{language === 'bn' ? 'সব দেখুন' : 'View All Central'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {services
                      .filter((s) => s.isCentralGov)
                      .slice(0, 8)
                      .map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          language={language}
                          isFavorite={favorites.includes(service.id)}
                          onToggleFavorite={toggleFavorite}
                          onOpenService={handleOpenService}
                        />
                      ))}
                  </div>
                </div>

                {/* Latest Job Recruitment Callout Banner */}
                <div className="bg-linear-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
                  <div className="space-y-2 text-center md:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold">
                      <Award className="w-4 h-4" />
                      <span>{language === 'bn' ? 'সরাসরি সরকারি নিয়োগ লিঙ্ক' : 'Latest Recruitment Notices'}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                      {language === 'bn' ? 'চলমান সরকারি চাকরির পরীক্ষার আবেদন' : 'Active Government Job Applications'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                      {language === 'bn'
                        ? 'পশ্চিমবঙ্গ পুলিশ কনস্টেবল, এসএসসি সিএইচএসএল, ও রেলওয়ে রিক্রুটমেন্ট পরীক্ষার আবেদন ও বিজ্ঞপ্তি দেখুন।'
                        : 'Explore active job vacancies, eligibility criteria, and direct official application forms.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('jobs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="py-3 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition active:scale-95 shrink-0"
                  >
                    <span>{language === 'bn' ? 'চাকরির তালিকা দেখুন' : 'Explore All Jobs'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: West Bengal Govt */}
            {activeTab === 'wb_gov' && (
              <WestBengalSection
                services={services}
                favoriteIds={favorites}
                language={language}
                onToggleFavorite={toggleFavorite}
                onOpenService={handleOpenService}
              />
            )}

            {/* Tab 3: Central Govt */}
            {activeTab === 'central_gov' && (
              <CentralGovSection
                services={services}
                favoriteIds={favorites}
                language={language}
                onToggleFavorite={toggleFavorite}
                onOpenService={handleOpenService}
              />
            )}

            {/* Tab 4: Cyber Tools Hub */}
            {activeTab === 'cyber_tools' && (
              <CyberToolsSection
                language={language}
                prices={prices}
                onSaveCustomerBill={addCustomer}
              />
            )}

            {/* Tab 5: Forms & Downloads */}
            {activeTab === 'forms' && (
              <OnlineFormsSection
                forms={forms}
                language={language}
              />
            )}

            {/* Tab 6: Jobs */}
            {activeTab === 'jobs' && (
              <JobsSection
                jobs={jobs}
                language={language}
              />
            )}

            {/* Tab 7: Scholarship */}
            {activeTab === 'scholarship' && (
              <ScholarshipsSection
                services={services}
                language={language}
                onOpenService={handleOpenService}
              />
            )}

            {/* Tab 8: Health & Social Security */}
            {activeTab === 'health_social' && (
              <HealthSocialSection
                services={services}
                language={language}
                onOpenService={handleOpenService}
              />
            )}

            {/* Tab 9: Customer Register & Khata */}
            {activeTab === 'customer_khata' && (
              <CustomerRegisterSection
                customers={customers}
                language={language}
                onAddCustomer={addCustomer}
                onUpdateStatus={updateCustomerStatus}
                onDeleteCustomer={deleteCustomer}
              />
            )}

            {/* Tab 10: Income & Expense */}
            {activeTab === 'income_expense' && (
              <IncomeExpenseSection
                records={incomeExpenses}
                language={language}
                onAddRecord={addIncomeExpense}
                onDeleteRecord={deleteIncomeExpense}
              />
            )}
          </>
        )}
      </main>

      {/* Safety Modal when opening external official govt sites */}
      <ExternalSafetyModal
        service={safetyModalService}
        language={language}
        onClose={() => setSafetyModalService(null)}
        onProceed={handleProceedToOfficialUrl}
      />

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        language={language}
        services={services}
        notices={notices}
        jobs={jobs}
        forms={forms}
        prices={prices}
        onAddService={addService}
        onUpdateService={updateService}
        onDeleteService={deleteService}
        onAddNotice={addNotice}
        onDeleteNotice={deleteNotice}
        onUpdatePrice={updatePrice}
        onResetToDefault={resetToDefault}
        onExportBackup={exportBackupJson}
        onImportBackup={importBackupJson}
      />

      {/* Global Footer */}
      <Footer
        language={language}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
export default App;
