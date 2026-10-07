import React, { useState } from 'react';
import { Briefcase, Calendar, Award, ExternalLink, Search, Sparkles, CheckCircle2, Globe } from 'lucide-react';
import { JobItem, Language } from '../types';

interface JobsSectionProps {
  jobs: JobItem[];
  language: Language;
}

export const JobsSection: React.FC<JobsSectionProps> = ({ jobs, language }) => {
  const [filterQual, setFilterQual] = useState<string>('all');

  const filteredJobs = jobs.filter((j) => {
    if (filterQual === 'all') return true;
    if (j.id === 'job-search') return true; // Keep Job Search visible across filters
    const qual = ((j.qualification || j.qualificationEn || j.qualificationBn) || '').toLowerCase();
    if (filterQual === '10th') return qual.includes('10th') || qual.includes('madhyamik') || qual.includes('দশম') || qual.includes('মাধ্যমিক');
    if (filterQual === '12th') return qual.includes('12th') || qual.includes('hs') || qual.includes('উচ্চ মাধ্যমিক');
    if (filterQual === 'Graduation') return qual.includes('graduate') || qual.includes('degree') || qual.includes('স্নাতক');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-amber-900 via-orange-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-amber-700/50 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-800/80 border border-amber-500/40 text-xs font-semibold text-amber-200">
            <Award className="w-4 h-4 text-amber-300" />
            <span>Latest Government Recruitment & Job Portal 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'bn' ? 'সরকারি চাকরি ও নিয়োগ বিজ্ঞপ্তি' : 'Government Jobs & Recruitment Alerts'}
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-2xl">
            {language === 'bn'
              ? 'পশ্চিমবঙ্গ পুলিশ, স্টাফ সিলেকশন কমিশন (SSC), রেলওয়ে রিক্রুটমেন্ট বোর্ড (RRB), পিএসসি ও অল ইন্ডিয়া চাকরির অফিশিয়াল নোটিফিকেশন ও সরাসরি আবেদন লিঙ্ক।'
              : 'Direct official application links for WB Police, SSC CGL/CHSL/MTS, Railway RRB, and State Public Service recruitments.'}
          </p>
        </div>
      </div>

      {/* Featured "Job Search" Option - FreeJobAlert Direct Connect */}
      <div className="relative overflow-hidden bg-linear-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-400/40">
        {/* Background glow & subtle motif */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shrink-0 shadow-inner">
              <Search className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-300/40 text-[11px] font-bold text-emerald-100 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'bn' ? 'অল ইন্ডিয়া ও পশ্চিমবঙ্গ চাকরি সন্ধান পোর্টাল' : 'All India & WB Job Gateway'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex flex-wrap items-center gap-2.5">
                <span>Job Search</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                  FreeJobAlert
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Direct Connect
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-emerald-50/90 mt-1 max-w-2xl leading-relaxed">
                {language === 'bn'
                  ? 'সরাসরি FreeJobAlert পোর্টালে যুক্ত হয়ে পশ্চিমবঙ্গ পুলিশ, ডিফেন্স, রেলওয়ে, ব্যাংক, এসএসসি ও সকল সরকারি চাকরির ভ্যাকান্সি, অ্যাডমিট কার্ড এবং রেজাল্ট সন্ধান করুন।'
                  : 'Search all latest Central & West Bengal government recruitments, syllabus, admit cards, and application forms directly on FreeJobAlert.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href="https://www.freejobalert.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 active:scale-95 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition transform hover:scale-105 cursor-pointer"
              title="https://www.freejobalert.com/"
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>{language === 'bn' ? 'Job Search সরাসরি যুক্ত হন' : 'Connect to Job Search'}</span>
              <ExternalLink className="w-4 h-4 text-emerald-600" />
            </a>
          </div>
        </div>

        {/* Quick Direct Category Links from FreeJobAlert */}
        <div className="mt-5 pt-4 border-t border-white/20 flex flex-wrap items-center gap-2 text-xs relative z-10">
          <span className="text-emerald-100 font-bold mr-1 flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সরাসরি লিঙ্ক:' : 'Quick Direct Links:'}</span>
          </span>
          <a
            href="https://www.freejobalert.com/west-bengal-government-jobs/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium transition flex items-center gap-1 border border-white/10"
          >
            <span>{language === 'bn' ? 'পশ্চিমবঙ্গ চাকরি (WB Jobs)' : 'WB Govt Jobs'}</span>
            <ExternalLink className="w-3 h-3 opacity-75" />
          </a>
          <a
            href="https://www.freejobalert.com/police-defence-jobs/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium transition flex items-center gap-1 border border-white/10"
          >
            <span>{language === 'bn' ? 'পুলিশ ও ডিফেন্স (Police)' : 'Police & Defence'}</span>
            <ExternalLink className="w-3 h-3 opacity-75" />
          </a>
          <a
            href="https://www.freejobalert.com/railway-jobs/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium transition flex items-center gap-1 border border-white/10"
          >
            <span>{language === 'bn' ? 'রেলওয়ে চাকরি (Railways)' : 'Railway Jobs'}</span>
            <ExternalLink className="w-3 h-3 opacity-75" />
          </a>
          <a
            href="https://www.freejobalert.com/bank-jobs/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium transition flex items-center gap-1 border border-white/10"
          >
            <span>{language === 'bn' ? 'ব্যাংক চাকরি (Banking)' : 'Bank Jobs'}</span>
            <ExternalLink className="w-3 h-3 opacity-75" />
          </a>
          <a
            href="https://www.freejobalert.com/ssc-jobs/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium transition flex items-center gap-1 border border-white/10"
          >
            <span>{language === 'bn' ? 'এসএসসি (SSC Jobs)' : 'SSC Jobs'}</span>
            <ExternalLink className="w-3 h-3 opacity-75" />
          </a>
        </div>
      </div>

      {/* Qualification Filter & Direct Job Search Action */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', labelEn: 'All Qualifications', labelBn: 'সমস্ত চাকরি' },
            { id: '10th', labelEn: '10th / Madhyamik Pass', labelBn: 'মাধ্যমিক পাস চাকরি' },
            { id: '12th', labelEn: '12th / HS Pass', labelBn: 'উচ্চ মাধ্যমিক পাস' },
            { id: 'Graduation', labelEn: 'Graduate / Degree', labelBn: 'স্নাতক / গ্র্যাজুয়েট' }
          ].map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setFilterQual(q.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterQual === q.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-500'
              }`}
            >
              {language === 'bn' ? q.labelBn : q.labelEn}
            </button>
          ))}
        </div>

        {/* Quick Job Search Button in toolbar */}
        <a
          href="https://www.freejobalert.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 ml-auto cursor-pointer"
          title="Direct connect to Job Search on FreeJobAlert"
        >
          <Search className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'Job Search (সরাসরি খুলুন)' : 'Job Search (Direct)'}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJobs.map((job) => {
          const isJobSearch = job.id === 'job-search' || job.id === 'job-search-freejobalert';
          const notificationUrl = job.officialNotificationUrl || job.notificationUrl || 'https://www.freejobalert.com/';
          const applyUrl = job.applyUrl || 'https://www.freejobalert.com/';
          const displayTitle = language === 'bn' ? (job.titleBn || job.titleEn) : (job.titleEn || job.titleBn);
          const displayOrg = (job as any).organization || (language === 'bn' ? (job.departmentBn || job.departmentEn) : (job.departmentEn || job.departmentBn));
          const displayQual = (job as any).qualification || (language === 'bn' ? (job.qualificationBn || job.qualificationEn) : (job.qualificationEn || job.qualificationBn));

          return (
            <div
              key={job.id}
              className={`rounded-2xl p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between ${
                isJobSearch
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-2 border-emerald-500 dark:border-emerald-600 ring-2 ring-emerald-500/10'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2.5">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                      isJobSearch
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {displayOrg}
                  </span>
                  <span
                    className={`text-[11px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-md ${
                      isJobSearch
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    {language === 'bn' ? `শেষ: ${job.lastDate}` : `Last: ${job.lastDate}`}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  {isJobSearch && (
                    <span className="p-1 rounded-lg bg-emerald-600 text-white shrink-0">
                      <Search className="w-4 h-4" />
                    </span>
                  )}
                  <h3
                    className={`font-bold text-base leading-snug ${
                      isJobSearch ? 'text-emerald-950 dark:text-emerald-100' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {displayTitle}
                  </h3>
                </div>

                {/* Badges / Specs */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{language === 'bn' ? 'মোট শূন্যপদ:' : 'Vacancies:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {job.totalPosts || (language === 'bn' ? 'বিজ্ঞপ্তি দেখুন' : 'Check Notification')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{language === 'bn' ? 'শিক্ষাগত যোগ্যতা:' : 'Qualification:'}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate max-w-[190px]">
                      {displayQual}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{language === 'bn' ? 'বয়সসীমা:' : 'Age Limit:'}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {job.ageLimit || (language === 'bn' ? '১৮ - ৪০ বছর' : '18 - 40 Years')}
                    </span>
                  </div>
                  {(job.salary || isJobSearch) && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700">
                      <span className="text-slate-400">{language === 'bn' ? 'বেতনক্রম / আপডেট:' : 'Pay / Status:'}</span>
                      <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {job.salary || (isJobSearch ? 'Live Updates 2026' : 'Govt Matrix')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                <a
                  href={notificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-center transition"
                >
                  {language === 'bn' ? 'নোটিফিকেশন' : 'Notification'}
                </a>
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`py-2 px-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition ${
                    isJobSearch ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <span>
                    {isJobSearch
                      ? language === 'bn'
                        ? 'সরাসরি যুক্ত হন'
                        : 'Direct Connect'
                      : language === 'bn'
                      ? 'আবেদন করুন'
                      : 'Apply Online'}
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
