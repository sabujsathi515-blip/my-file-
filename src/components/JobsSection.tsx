import React, { useState } from 'react';
import { Briefcase, Calendar, Users, Award, ExternalLink, CheckCircle2, DollarSign, Filter } from 'lucide-react';
import { JobItem, Language } from '../types';

interface JobsSectionProps {
  jobs: JobItem[];
  language: Language;
}

export const JobsSection: React.FC<JobsSectionProps> = ({ jobs, language }) => {
  const [filterQual, setFilterQual] = useState<string>('all');

  const filteredJobs = jobs.filter((j) => {
    if (filterQual === 'all') return true;
    if (filterQual === '10th') return j.qualification.includes('10th') || j.qualification.includes('Madhyamik');
    if (filterQual === '12th') return j.qualification.includes('12th') || j.qualification.includes('HS');
    if (filterQual === 'Graduation') return j.qualification.includes('Graduate') || j.qualification.includes('Degree');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-amber-900 via-orange-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-amber-700/50 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-800/80 border border-amber-500/40 text-xs font-semibold text-amber-200">
            <Award className="w-4 h-4 text-amber-300" />
            <span>Latest Government Recruitment & Job Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'bn' ? 'সরকারি চাকরি ও নিয়োগ বিজ্ঞপ্তি' : 'Government Jobs & Recruitment Alerts'}
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-2xl">
            {language === 'bn'
              ? 'পশ্চিমবঙ্গ পুলিশ, স্টাফ সিলেকশন কমিশন (SSC), রেলওয়ে রিক্রুটমেন্ট বোর্ড (RRB) এবং পিএসসি চাকরির সঠিক তথ্য ও সরাসরি আবেদন লিঙ্ক।'
              : 'Direct official application links for WB Police, SSC CGL/CHSL/MTS, Railway RRB, and State Public Service recruitments.'}
          </p>
        </div>
      </div>

      {/* Qualification Filter */}
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

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2.5">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {job.organization}
                </span>
                <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md">
                  <Calendar className="w-3 h-3" />
                  {language === 'bn' ? `শেষ: ${job.lastDate}` : `Last: ${job.lastDate}`}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                {language === 'bn' ? job.titleBn : job.titleEn}
              </h3>

              {/* Badges / Specs */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{language === 'bn' ? 'মোট শূন্যপদ:' : 'Vacancies:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{job.totalPosts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{language === 'bn' ? 'শিক্ষাগত যোগ্যতা:' : 'Qualification:'}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{job.qualification}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{language === 'bn' ? 'বয়সসীমা:' : 'Age Limit:'}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{job.ageLimit}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-400">{language === 'bn' ? 'বেতনক্রম:' : 'Pay Scale:'}</span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{job.salary}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
              <a
                href={job.notificationUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-center transition"
              >
                {language === 'bn' ? 'নোটিফিকেশন' : 'Notification'}
              </a>
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition"
              >
                <span>{language === 'bn' ? 'আবেদন করুন' : 'Apply Online'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
