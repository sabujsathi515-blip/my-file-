import React, { useState } from 'react';
import { Image, Grid, FileText, Calculator, Wrench, Sparkles } from 'lucide-react';
import { Language, PriceSetting } from '../types';
import { PhotoSignatureResizeTool } from './cyberTools/PhotoSignatureResizeTool';
import { PassportPhotoGridTool } from './cyberTools/PassportPhotoGridTool';
import { PdfToolsHub } from './cyberTools/PdfToolsHub';
import { PrintBillingCalculator } from './cyberTools/PrintBillingCalculator';

interface CyberToolsSectionProps {
  language: Language;
  prices: PriceSetting[];
  onSaveCustomerBill: (customer: {
    customerName: string;
    mobile: string;
    serviceTaken: string;
    amount: number;
    paymentStatus: 'Paid' | 'Due';
    printCount: number;
    scanCount: number;
    notes: string;
    date: string;
  }) => void;
}

export const CyberToolsSection: React.FC<CyberToolsSectionProps> = ({
  language,
  prices,
  onSaveCustomerBill
}) => {
  const [activeTool, setActiveTool] = useState<'resize' | 'passport_grid' | 'pdf' | 'billing'>('resize');

  const tools = [
    {
      id: 'resize',
      labelEn: 'Photo & Signature Resize',
      labelBn: 'ফটো ও সিগনেচার রিসাইজ',
      icon: Image,
      descEn: 'Resize to exact KB and pixels for WB Police, SSC, RRB',
      descBn: 'পুলিশ, এসএসসি পরীক্ষার জন্য নির্দিষ্ট সাইজ ও কেবি'
    },
    {
      id: 'passport_grid',
      labelEn: 'Passport Photo Sheet',
      labelBn: 'পাসপোর্ট ফটো শিট জেনারেটর',
      icon: Grid,
      descEn: 'Generate 4, 8, 12, 16 copies on 4x6 / A4 sheet',
      descBn: '৪x৬ বা A4 পেপারে সরাসরি প্রিন্ট রেডি শিট'
    },
    {
      id: 'pdf',
      labelEn: 'PDF Converter & Merger',
      labelBn: 'পিডিএফ টুলস ও কনভার্টার',
      icon: FileText,
      descEn: 'Combine scanned photos to single PDF document',
      descBn: 'স্ক্যান করা ছবি দিয়ে ১ ক্লিকে পিডিএফ তৈরি'
    },
    {
      id: 'billing',
      labelEn: 'Fast Billing Calculator',
      labelBn: 'ইনস্ট্যান্ট বিলিং ক্যালকুলেটর',
      icon: Calculator,
      descEn: 'Calculate walk-in fees and generate slip receipt',
      descBn: 'প্রিন্ট, জেরক্স ও ফর্মের খরচের হিসাব ও রসিদ'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-blue-700/50 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-500/40 text-xs font-semibold text-blue-200">
            <Wrench className="w-4 h-4 text-amber-300" />
            <span>Cyber Café Operator Daily Utilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'bn' ? 'সাইবার ক্যাফে বিশেষ কার্যকারী টুলস' : 'Cyber Café Productivity & Editing Tools'}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl">
            {language === 'bn'
              ? 'চাকরির ফর্ম ফিলাপের জন্য ফটো ও সিগনেচার রিসাইজার, পাসপোর্ট ছবি শিট জেনারেটর, JPG to PDF কনভার্টার ও বিলিং ক্যালকুলেটর।'
              : 'All-in-one suite for instant photo resizing, passport sheets, PDF bundling, and customer billing.'}
          </p>
        </div>
      </div>

      {/* Tool Selector Tabs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTool(t.id as any)}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 shadow-2xs group cursor-pointer ${
                isActive
                  ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 dark:border-blue-500 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 group-hover:text-blue-600'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <h3 className={`font-bold text-xs sm:text-sm ${isActive ? 'text-blue-900 dark:text-blue-200' : 'text-slate-900 dark:text-white'}`}>
                  {language === 'bn' ? t.labelBn : t.labelEn}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {language === 'bn' ? t.descBn : t.descEn}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Tool Render */}
      <div className="transition-all">
        {activeTool === 'resize' && <PhotoSignatureResizeTool language={language} />}
        {activeTool === 'passport_grid' && <PassportPhotoGridTool language={language} />}
        {activeTool === 'pdf' && <PdfToolsHub language={language} />}
        {activeTool === 'billing' && (
          <PrintBillingCalculator
            language={language}
            prices={prices}
            onSaveToRegister={onSaveCustomerBill}
          />
        )}
      </div>
    </div>
  );
};
