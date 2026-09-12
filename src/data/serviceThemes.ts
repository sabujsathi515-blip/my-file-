export interface ServiceCardTheme {
  topBarGradient: string;
  cardBg: string; // Distinct custom background color for each website card
  cardBorder: string;
  cardBgHover: string;
  iconBg: string;
  iconColor: string;
  govBadge: string;
  subcatBadge: string;
  titleHover: string;
  button: string;
  statusDot: string;
  accentHex: string;
  brandTag?: string;
}

export const WB_SERVICE_THEMES: Record<string, ServiceCardTheme> = {
  // 1. Banglarbhumi (Land Records) - Emerald / Jade
  'wb-banglarbhumi': {
    topBarGradient: 'from-emerald-500 via-green-500 to-teal-500',
    cardBg: 'bg-emerald-50/90 dark:bg-[#05291b]',
    cardBorder: 'border-emerald-300/90 dark:border-emerald-700/80 hover:border-emerald-500 dark:hover:border-emerald-400',
    cardBgHover: 'hover:bg-emerald-100/80 dark:hover:bg-[#083523]',
    iconBg: 'bg-emerald-100/90 dark:bg-emerald-900/80 border-emerald-300 dark:border-emerald-700',
    iconColor: 'text-emerald-700 dark:text-emerald-200',
    govBadge: 'bg-emerald-200/90 text-emerald-900 dark:bg-emerald-900/90 dark:text-emerald-100 border-emerald-400 dark:border-emerald-600',
    subcatBadge: 'text-emerald-800 dark:text-emerald-200 bg-emerald-100/80 dark:bg-emerald-900/60 border-emerald-300/70 dark:border-emerald-700/60',
    titleHover: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-300',
    button: 'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white shadow-xs hover:shadow-emerald-600/30',
    statusDot: 'bg-emerald-500',
    accentHex: '#059669',
    brandTag: 'বাংলারভূমি'
  },

  // 2. e-District 2.0 - Royal Sky Blue
  'wb-edistrict': {
    topBarGradient: 'from-sky-500 via-blue-500 to-indigo-500',
    cardBg: 'bg-sky-50/90 dark:bg-[#072a44]',
    cardBorder: 'border-sky-300/90 dark:border-sky-700/80 hover:border-sky-500 dark:hover:border-sky-400',
    cardBgHover: 'hover:bg-sky-100/80 dark:hover:bg-[#0a3556]',
    iconBg: 'bg-sky-100/90 dark:bg-sky-900/80 border-sky-300 dark:border-sky-700',
    iconColor: 'text-sky-700 dark:text-sky-200',
    govBadge: 'bg-sky-200/90 text-sky-900 dark:bg-sky-900/90 dark:text-sky-100 border-sky-400 dark:border-sky-600',
    subcatBadge: 'text-sky-800 dark:text-sky-200 bg-sky-100/80 dark:bg-sky-900/60 border-sky-300/70 dark:border-sky-700/60',
    titleHover: 'group-hover:text-sky-700 dark:group-hover:text-sky-300',
    button: 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white shadow-xs hover:shadow-sky-500/30',
    statusDot: 'bg-sky-500',
    accentHex: '#0284c7',
    brandTag: 'e-District 2.0'
  },

  // 3. Duare Sarkar & Paray Samadhan - Vivid Violet / Amethyst
  'wb-duaresarkar': {
    topBarGradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    cardBg: 'bg-violet-50/90 dark:bg-[#280d58]',
    cardBorder: 'border-violet-300/90 dark:border-violet-700/80 hover:border-violet-500 dark:hover:border-violet-400',
    cardBgHover: 'hover:bg-violet-100/80 dark:hover:bg-[#341172]',
    iconBg: 'bg-violet-100/90 dark:bg-violet-900/80 border-violet-300 dark:border-violet-700',
    iconColor: 'text-violet-700 dark:text-violet-200',
    govBadge: 'bg-violet-200/90 text-violet-900 dark:bg-violet-900/90 dark:text-violet-100 border-violet-400 dark:border-violet-600',
    subcatBadge: 'text-violet-800 dark:text-violet-200 bg-violet-100/80 dark:bg-violet-900/60 border-violet-300/70 dark:border-violet-700/60',
    titleHover: 'group-hover:text-violet-700 dark:group-hover:text-violet-300',
    button: 'bg-violet-700 hover:bg-violet-800 active:bg-violet-900 text-white shadow-xs hover:shadow-violet-600/30',
    statusDot: 'bg-violet-500',
    accentHex: '#7c3aed',
    brandTag: 'দুয়ারে সরকার'
  },

  // 4. Swasthya Sathi - Crimson Rose & Ruby Red
  'wb-swasthyasathi': {
    topBarGradient: 'from-rose-500 via-red-500 to-pink-500',
    cardBg: 'bg-rose-50/90 dark:bg-[#430718]',
    cardBorder: 'border-rose-300/90 dark:border-rose-700/80 hover:border-rose-500 dark:hover:border-rose-400',
    cardBgHover: 'hover:bg-rose-100/80 dark:hover:bg-[#580b22]',
    iconBg: 'bg-rose-100/90 dark:bg-rose-900/80 border-rose-300 dark:border-rose-700',
    iconColor: 'text-rose-700 dark:text-rose-200',
    govBadge: 'bg-rose-200/90 text-rose-900 dark:bg-rose-900/90 dark:text-rose-100 border-rose-400 dark:border-rose-600',
    subcatBadge: 'text-rose-800 dark:text-rose-200 bg-rose-100/80 dark:bg-rose-900/60 border-rose-300/70 dark:border-rose-700/60',
    titleHover: 'group-hover:text-rose-700 dark:group-hover:text-rose-300',
    button: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-xs hover:shadow-rose-600/30',
    statusDot: 'bg-rose-500',
    accentHex: '#e11d48',
    brandTag: 'স্বাস্থ্য সাথী'
  },

  // 5. Lakshmir Bhandar - Pure Gold & Radiant Amber
  'wb-lakshmirbhandar': {
    topBarGradient: 'from-amber-400 via-yellow-400 to-amber-600',
    cardBg: 'bg-amber-50/95 dark:bg-[#3d1803]',
    cardBorder: 'border-amber-300/90 dark:border-amber-700/80 hover:border-amber-500 dark:hover:border-amber-400',
    cardBgHover: 'hover:bg-amber-100/80 dark:hover:bg-[#502005]',
    iconBg: 'bg-amber-100/90 dark:bg-amber-900/80 border-amber-300 dark:border-amber-700',
    iconColor: 'text-amber-800 dark:text-amber-200',
    govBadge: 'bg-amber-200/90 text-amber-950 dark:bg-amber-900/90 dark:text-amber-100 border-amber-400 dark:border-amber-600',
    subcatBadge: 'text-amber-900 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-900/60 border-amber-300/70 dark:border-amber-700/60',
    titleHover: 'group-hover:text-amber-700 dark:group-hover:text-amber-300',
    button: 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white shadow-xs hover:shadow-amber-500/30',
    statusDot: 'bg-amber-500',
    accentHex: '#d97706',
    brandTag: 'লক্ষ্মীর ভাণ্ডার'
  },

  // 6. Krishak Bandhu - Agriculture Lime & Spring Green
  'wb-krishakbandhu': {
    topBarGradient: 'from-lime-500 via-emerald-500 to-green-600',
    cardBg: 'bg-lime-50/90 dark:bg-[#192b05]',
    cardBorder: 'border-lime-300/90 dark:border-lime-700/80 hover:border-lime-500 dark:hover:border-lime-400',
    cardBgHover: 'hover:bg-lime-100/80 dark:hover:bg-[#233c09]',
    iconBg: 'bg-lime-100/90 dark:bg-lime-900/80 border-lime-300 dark:border-lime-700',
    iconColor: 'text-lime-800 dark:text-lime-200',
    govBadge: 'bg-lime-200/90 text-lime-950 dark:bg-lime-900/90 dark:text-lime-100 border-lime-400 dark:border-lime-600',
    subcatBadge: 'text-lime-900 dark:text-lime-200 bg-lime-100/80 dark:bg-lime-900/60 border-lime-300/70 dark:border-lime-700/60',
    titleHover: 'group-hover:text-lime-700 dark:group-hover:text-lime-300',
    button: 'bg-lime-700 hover:bg-lime-800 active:bg-lime-900 text-white shadow-xs hover:shadow-lime-600/30',
    statusDot: 'bg-lime-500',
    accentHex: '#65a30d',
    brandTag: 'কৃষক বন্ধু'
  },

  // 7. Kanyashree Prakalpa - Vibrant Fuchsia & Magenta
  'wb-kanyashree': {
    topBarGradient: 'from-fuchsia-500 via-pink-500 to-rose-500',
    cardBg: 'bg-fuchsia-50/90 dark:bg-[#3f0642]',
    cardBorder: 'border-fuchsia-300/90 dark:border-fuchsia-700/80 hover:border-fuchsia-500 dark:hover:border-fuchsia-400',
    cardBgHover: 'hover:bg-fuchsia-100/80 dark:hover:bg-[#520956]',
    iconBg: 'bg-fuchsia-100/90 dark:bg-fuchsia-900/80 border-fuchsia-300 dark:border-fuchsia-700',
    iconColor: 'text-fuchsia-700 dark:text-fuchsia-200',
    govBadge: 'bg-fuchsia-200/90 text-fuchsia-950 dark:bg-fuchsia-900/90 dark:text-fuchsia-100 border-fuchsia-400 dark:border-fuchsia-600',
    subcatBadge: 'text-fuchsia-900 dark:text-fuchsia-200 bg-fuchsia-100/80 dark:bg-fuchsia-900/60 border-fuchsia-300/70 dark:border-fuchsia-700/60',
    titleHover: 'group-hover:text-fuchsia-700 dark:group-hover:text-fuchsia-300',
    button: 'bg-fuchsia-700 hover:bg-fuchsia-800 active:bg-fuchsia-900 text-white shadow-xs hover:shadow-fuchsia-600/30',
    statusDot: 'bg-fuchsia-500',
    accentHex: '#c026d3',
    brandTag: 'কন্যাশ্রী'
  },

  // 8. Rupashree Prakalpa - Coral Pink & Salmon
  'wb-rupashree': {
    topBarGradient: 'from-pink-500 via-rose-400 to-red-400',
    cardBg: 'bg-pink-50/90 dark:bg-[#470621]',
    cardBorder: 'border-pink-300/90 dark:border-pink-700/80 hover:border-pink-500 dark:hover:border-pink-400',
    cardBgHover: 'hover:bg-pink-100/80 dark:hover:bg-[#5c092c]',
    iconBg: 'bg-pink-100/90 dark:bg-pink-900/80 border-pink-300 dark:border-pink-700',
    iconColor: 'text-pink-700 dark:text-pink-200',
    govBadge: 'bg-pink-200/90 text-pink-950 dark:bg-pink-900/90 dark:text-pink-100 border-pink-400 dark:border-pink-600',
    subcatBadge: 'text-pink-900 dark:text-pink-200 bg-pink-100/80 dark:bg-pink-900/60 border-pink-300/70 dark:border-pink-700/60',
    titleHover: 'group-hover:text-pink-700 dark:group-hover:text-pink-300',
    button: 'bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white shadow-xs hover:shadow-pink-500/30',
    statusDot: 'bg-pink-500',
    accentHex: '#db2777',
    brandTag: 'রূপশ্রী'
  },

  // 9. WB Student Credit Card - Electric Indigo & Blue
  'wb-student-credit-card': {
    topBarGradient: 'from-indigo-500 via-blue-600 to-cyan-500',
    cardBg: 'bg-indigo-50/90 dark:bg-[#1a1744]',
    cardBorder: 'border-indigo-300/90 dark:border-indigo-700/80 hover:border-indigo-500 dark:hover:border-indigo-400',
    cardBgHover: 'hover:bg-indigo-100/80 dark:hover:bg-[#23205a]',
    iconBg: 'bg-indigo-100/90 dark:bg-indigo-900/80 border-indigo-300 dark:border-indigo-700',
    iconColor: 'text-indigo-700 dark:text-indigo-200',
    govBadge: 'bg-indigo-200/90 text-indigo-950 dark:bg-indigo-900/90 dark:text-indigo-100 border-indigo-400 dark:border-indigo-600',
    subcatBadge: 'text-indigo-900 dark:text-indigo-200 bg-indigo-100/80 dark:bg-indigo-900/60 border-indigo-300/70 dark:border-indigo-700/60',
    titleHover: 'group-hover:text-indigo-700 dark:group-hover:text-indigo-300',
    button: 'bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900 text-white shadow-xs hover:shadow-indigo-600/30',
    statusDot: 'bg-indigo-500',
    accentHex: '#4f46e5',
    brandTag: 'WBSCC ক্রেডিট কার্ড'
  },

  // 10. Bhabishyat Credit Card - Teal & Turquoise
  'wb-bhavishyat-credit-card': {
    topBarGradient: 'from-teal-500 via-cyan-500 to-emerald-500',
    cardBg: 'bg-teal-50/90 dark:bg-[#032a29]',
    cardBorder: 'border-teal-300/90 dark:border-teal-700/80 hover:border-teal-500 dark:hover:border-teal-400',
    cardBgHover: 'hover:bg-teal-100/80 dark:hover:bg-[#053735]',
    iconBg: 'bg-teal-100/90 dark:bg-teal-900/80 border-teal-300 dark:border-teal-700',
    iconColor: 'text-teal-700 dark:text-teal-200',
    govBadge: 'bg-teal-200/90 text-teal-950 dark:bg-teal-900/90 dark:text-teal-100 border-teal-400 dark:border-teal-600',
    subcatBadge: 'text-teal-900 dark:text-teal-200 bg-teal-100/80 dark:bg-teal-900/60 border-teal-300/70 dark:border-teal-700/60',
    titleHover: 'group-hover:text-teal-700 dark:group-hover:text-teal-300',
    button: 'bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white shadow-xs hover:shadow-teal-600/30',
    statusDot: 'bg-teal-500',
    accentHex: '#0d9488',
    brandTag: 'ভবিষ্যৎ ক্রেডিট কার্ড'
  },

  // 11. Caste Certificate SC/ST/OBC - Orange & Ochre
  'wb-castecertificate': {
    topBarGradient: 'from-orange-500 via-amber-500 to-red-500',
    cardBg: 'bg-orange-50/90 dark:bg-[#3c1206]',
    cardBorder: 'border-orange-300/90 dark:border-orange-700/80 hover:border-orange-500 dark:hover:border-orange-400',
    cardBgHover: 'hover:bg-orange-100/80 dark:hover:bg-[#4d1909]',
    iconBg: 'bg-orange-100/90 dark:bg-orange-900/80 border-orange-300 dark:border-orange-700',
    iconColor: 'text-orange-700 dark:text-orange-200',
    govBadge: 'bg-orange-200/90 text-orange-950 dark:bg-orange-900/90 dark:text-orange-100 border-orange-400 dark:border-orange-600',
    subcatBadge: 'text-orange-900 dark:text-orange-200 bg-orange-100/80 dark:bg-orange-900/60 border-orange-300/70 dark:border-orange-700/60',
    titleHover: 'group-hover:text-orange-700 dark:group-hover:text-orange-300',
    button: 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white shadow-xs hover:shadow-orange-500/30',
    statusDot: 'bg-orange-500',
    accentHex: '#ea580c',
    brandTag: 'কাস্ট সার্টিফিকেট'
  },

  // 12. Digital Ration Card (Khadya Sathi) - Harvest Amber & Corn
  'wb-rationcard': {
    topBarGradient: 'from-amber-500 via-yellow-500 to-orange-500',
    cardBg: 'bg-yellow-50/95 dark:bg-[#3a1d04]',
    cardBorder: 'border-amber-300/90 dark:border-amber-700/80 hover:border-amber-500 dark:hover:border-amber-400',
    cardBgHover: 'hover:bg-yellow-100/80 dark:hover:bg-[#4a2607]',
    iconBg: 'bg-amber-100/90 dark:bg-amber-900/80 border-amber-300 dark:border-amber-700',
    iconColor: 'text-amber-800 dark:text-amber-200',
    govBadge: 'bg-amber-200/90 text-amber-950 dark:bg-amber-900/90 dark:text-amber-100 border-amber-400 dark:border-amber-600',
    subcatBadge: 'text-amber-900 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-900/60 border-amber-300/70 dark:border-amber-700/60',
    titleHover: 'group-hover:text-amber-700 dark:group-hover:text-amber-300',
    button: 'bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white shadow-xs hover:shadow-amber-600/30',
    statusDot: 'bg-amber-500',
    accentHex: '#b45309',
    brandTag: 'খাদ্য সাথী'
  },

  // 13. Jai Bangla Pension Portal - Oceanic Cyan & Blue
  'wb-jaibangla': {
    topBarGradient: 'from-cyan-500 via-blue-500 to-indigo-600',
    cardBg: 'bg-cyan-50/90 dark:bg-[#072d3d]',
    cardBorder: 'border-cyan-300/90 dark:border-cyan-700/80 hover:border-cyan-500 dark:hover:border-cyan-400',
    cardBgHover: 'hover:bg-cyan-100/80 dark:hover:bg-[#0a3a4e]',
    iconBg: 'bg-cyan-100/90 dark:bg-cyan-900/80 border-cyan-300 dark:border-cyan-700',
    iconColor: 'text-cyan-700 dark:text-cyan-200',
    govBadge: 'bg-cyan-200/90 text-cyan-950 dark:bg-cyan-900/90 dark:text-cyan-100 border-cyan-400 dark:border-cyan-600',
    subcatBadge: 'text-cyan-900 dark:text-cyan-200 bg-cyan-100/80 dark:bg-cyan-900/60 border-cyan-300/70 dark:border-cyan-700/60',
    titleHover: 'group-hover:text-cyan-700 dark:group-hover:text-cyan-300',
    button: 'bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900 text-white shadow-xs hover:shadow-cyan-600/30',
    statusDot: 'bg-cyan-500',
    accentHex: '#0891b2',
    brandTag: 'জয় বাংলা পেনশন'
  },

  // 14. WB Employment Bank (Yuvasree) - Steel Slate
  'wb-employmentbank': {
    topBarGradient: 'from-slate-600 via-blue-700 to-slate-800',
    cardBg: 'bg-slate-100/95 dark:bg-[#0d1526]',
    cardBorder: 'border-slate-300/90 dark:border-slate-700/80 hover:border-slate-500 dark:hover:border-slate-400',
    cardBgHover: 'hover:bg-slate-200/70 dark:hover:bg-[#121c33]',
    iconBg: 'bg-slate-200/90 dark:bg-slate-800/90 border-slate-300 dark:border-slate-700',
    iconColor: 'text-slate-800 dark:text-slate-200',
    govBadge: 'bg-slate-300 text-slate-900 dark:bg-slate-800 dark:text-slate-100 border-slate-400 dark:border-slate-600',
    subcatBadge: 'text-slate-900 dark:text-slate-200 bg-slate-200/80 dark:bg-slate-800/70 border-slate-300/70 dark:border-slate-700/60',
    titleHover: 'group-hover:text-slate-900 dark:group-hover:text-slate-100',
    button: 'bg-slate-800 hover:bg-slate-900 active:bg-black text-white shadow-xs hover:shadow-slate-700/30',
    statusDot: 'bg-slate-500',
    accentHex: '#475569',
    brandTag: 'এমপ্লয়মেন্ট ব্যাঙ্ক'
  },

  // 15. WBSEDCL Electricity - Electric Yellow & Amber
  'wb-electricity-wbsedcl': {
    topBarGradient: 'from-yellow-400 via-amber-400 to-orange-500',
    cardBg: 'bg-amber-100/75 dark:bg-[#381c02]',
    cardBorder: 'border-amber-300/90 dark:border-amber-700/80 hover:border-amber-500 dark:hover:border-amber-400',
    cardBgHover: 'hover:bg-amber-200/60 dark:hover:bg-[#482404]',
    iconBg: 'bg-amber-200/90 dark:bg-amber-900/80 border-amber-300 dark:border-amber-700',
    iconColor: 'text-amber-800 dark:text-amber-200',
    govBadge: 'bg-amber-200/90 text-amber-950 dark:bg-amber-900/90 dark:text-amber-100 border-amber-400 dark:border-amber-600',
    subcatBadge: 'text-amber-900 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-900/60 border-amber-300/70 dark:border-amber-700/60',
    titleHover: 'group-hover:text-amber-700 dark:group-hover:text-amber-300',
    button: 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white shadow-xs hover:shadow-amber-500/30',
    statusDot: 'bg-yellow-500',
    accentHex: '#ca8a04',
    brandTag: 'WBSEDCL বিদ্যুৎ'
  },

  // 16. WB Police Citizen Portal - Midnight Navy & Police Blue
  'wb-police': {
    topBarGradient: 'from-blue-700 via-indigo-800 to-slate-900',
    cardBg: 'bg-blue-50/90 dark:bg-[#0a1a38]',
    cardBorder: 'border-blue-300/90 dark:border-blue-800/80 hover:border-blue-600 dark:hover:border-blue-400',
    cardBgHover: 'hover:bg-blue-100/80 dark:hover:bg-[#0f234b]',
    iconBg: 'bg-blue-100/90 dark:bg-blue-900/80 border-blue-300 dark:border-blue-800',
    iconColor: 'text-blue-700 dark:text-blue-200',
    govBadge: 'bg-blue-200/90 text-blue-950 dark:bg-blue-900/90 dark:text-blue-100 border-blue-400 dark:border-blue-700',
    subcatBadge: 'text-blue-900 dark:text-blue-200 bg-blue-100/80 dark:bg-blue-900/60 border-blue-300/70 dark:border-blue-700/60',
    titleHover: 'group-hover:text-blue-700 dark:group-hover:text-blue-300',
    button: 'bg-blue-800 hover:bg-blue-900 active:bg-slate-950 text-white shadow-xs hover:shadow-blue-800/30',
    statusDot: 'bg-blue-600',
    accentHex: '#1e40af',
    brandTag: 'WB Police 112'
  },

  // 17. Annapurna Portal - Golden Wheat & Apricot
  'wb-annapurna': {
    topBarGradient: 'from-amber-500 via-yellow-500 to-orange-600',
    cardBg: 'bg-orange-100/75 dark:bg-[#341305]',
    cardBorder: 'border-orange-300/90 dark:border-orange-700/80 hover:border-orange-500 dark:hover:border-orange-400',
    cardBgHover: 'hover:bg-orange-200/60 dark:hover:bg-[#461a08]',
    iconBg: 'bg-orange-200/90 dark:bg-orange-900/80 border-orange-300 dark:border-orange-700',
    iconColor: 'text-orange-800 dark:text-orange-200',
    govBadge: 'bg-orange-200/90 text-orange-950 dark:bg-orange-900/90 dark:text-orange-100 border-orange-400 dark:border-orange-600',
    subcatBadge: 'text-orange-900 dark:text-orange-200 bg-orange-100/80 dark:bg-orange-900/60 border-orange-300/70 dark:border-orange-700/60',
    titleHover: 'group-hover:text-orange-700 dark:group-hover:text-orange-300',
    button: 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white shadow-xs hover:shadow-orange-500/30',
    statusDot: 'bg-orange-500',
    accentHex: '#ea580c',
    brandTag: 'অন্নপূর্ণা পোর্টাল'
  },

  // 18. SmarSathi WB - Modern Cyan & Aqua
  'wb-smartsathi': {
    topBarGradient: 'from-cyan-400 via-sky-500 to-blue-600',
    cardBg: 'bg-cyan-50/90 dark:bg-[#053240]',
    cardBorder: 'border-cyan-300/90 dark:border-cyan-700/80 hover:border-cyan-500 dark:hover:border-cyan-400',
    cardBgHover: 'hover:bg-cyan-100/80 dark:hover:bg-[#074154]',
    iconBg: 'bg-cyan-100/90 dark:bg-cyan-900/80 border-cyan-300 dark:border-cyan-700',
    iconColor: 'text-cyan-700 dark:text-cyan-200',
    govBadge: 'bg-cyan-200/90 text-cyan-950 dark:bg-cyan-900/90 dark:text-cyan-100 border-cyan-400 dark:border-cyan-600',
    subcatBadge: 'text-cyan-900 dark:text-cyan-200 bg-cyan-100/80 dark:bg-cyan-900/60 border-cyan-300/70 dark:border-cyan-700/60',
    titleHover: 'group-hover:text-cyan-700 dark:group-hover:text-cyan-300',
    button: 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white shadow-xs hover:shadow-sky-500/30',
    statusDot: 'bg-cyan-500',
    accentHex: '#06b6d4',
    brandTag: 'SmarSathi WB'
  },

  // 19. Janakalyan Shibir - Mint & Sea Green
  'wb-janakalyan-shibir': {
    topBarGradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    cardBg: 'bg-emerald-100/75 dark:bg-[#052d22]',
    cardBorder: 'border-emerald-300/90 dark:border-emerald-700/80 hover:border-emerald-500 dark:hover:border-emerald-400',
    cardBgHover: 'hover:bg-emerald-200/60 dark:hover:bg-[#073c2e]',
    iconBg: 'bg-emerald-200/90 dark:bg-emerald-900/80 border-emerald-300 dark:border-emerald-700',
    iconColor: 'text-emerald-800 dark:text-emerald-200',
    govBadge: 'bg-emerald-200/90 text-emerald-950 dark:bg-emerald-900/90 dark:text-emerald-100 border-emerald-400 dark:border-emerald-600',
    subcatBadge: 'text-emerald-900 dark:text-emerald-200 bg-emerald-100/80 dark:bg-emerald-900/60 border-emerald-300/70 dark:border-emerald-700/60',
    titleHover: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-300',
    button: 'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white shadow-xs hover:shadow-emerald-600/30',
    statusDot: 'bg-emerald-500',
    accentHex: '#047857',
    brandTag: 'জনকল্যাণ শিবির'
  },

  // 20. Gram Panchayat Tax & Form 4 - Forest Green & Bronze Gold
  'wb-panchayat-tax': {
    topBarGradient: 'from-green-600 via-emerald-600 to-teal-700',
    cardBg: 'bg-green-100/75 dark:bg-[#0b2d13]',
    cardBorder: 'border-green-300/90 dark:border-green-700/80 hover:border-green-600 dark:hover:border-green-400',
    cardBgHover: 'hover:bg-green-200/60 dark:hover:bg-[#103a19]',
    iconBg: 'bg-green-200/90 dark:bg-green-900/80 border-green-300 dark:border-green-700',
    iconColor: 'text-green-800 dark:text-green-200',
    govBadge: 'bg-green-200/90 text-green-950 dark:bg-green-900/90 dark:text-green-100 border-green-400 dark:border-green-600',
    subcatBadge: 'text-green-900 dark:text-green-200 bg-green-100/80 dark:bg-green-900/60 border-green-300/70 dark:border-green-700/60',
    titleHover: 'group-hover:text-green-700 dark:group-hover:text-green-300',
    button: 'bg-green-700 hover:bg-green-800 active:bg-green-900 text-white shadow-xs hover:shadow-green-700/30',
    statusDot: 'bg-green-600',
    accentHex: '#15803d',
    brandTag: 'WBPRD পঞ্চায়েত'
  },

  // 21. Urban & Municipality Property Tax - Cobalt Steel Blue
  'wb-urban-propertytax': {
    topBarGradient: 'from-blue-500 via-slate-500 to-indigo-600',
    cardBg: 'bg-blue-100/75 dark:bg-[#0e2038]',
    cardBorder: 'border-blue-300/90 dark:border-blue-700/80 hover:border-blue-500 dark:hover:border-blue-400',
    cardBgHover: 'hover:bg-blue-200/60 dark:hover:bg-[#132a48]',
    iconBg: 'bg-blue-200/90 dark:bg-blue-900/80 border-blue-300 dark:border-blue-700',
    iconColor: 'text-blue-800 dark:text-blue-200',
    govBadge: 'bg-blue-200/90 text-blue-950 dark:bg-blue-900/90 dark:text-blue-100 border-blue-400 dark:border-blue-600',
    subcatBadge: 'text-blue-900 dark:text-blue-200 bg-blue-100/80 dark:bg-blue-900/60 border-blue-300/70 dark:border-blue-700/60',
    titleHover: 'group-hover:text-blue-700 dark:group-hover:text-blue-300',
    button: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs hover:shadow-blue-500/30',
    statusDot: 'bg-blue-500',
    accentHex: '#2563eb',
    brandTag: 'পৌর প্রপার্টি ট্যাক্স'
  },

  // 22. Registration Deeds & e-Deed - Burgundy Crimson
  'wb-registration-deeds': {
    topBarGradient: 'from-rose-600 via-red-600 to-amber-700',
    cardBg: 'bg-rose-100/75 dark:bg-[#330910]',
    cardBorder: 'border-rose-300/90 dark:border-rose-700/80 hover:border-rose-500 dark:hover:border-rose-400',
    cardBgHover: 'hover:bg-rose-200/60 dark:hover:bg-[#430d17]',
    iconBg: 'bg-rose-200/90 dark:bg-rose-900/80 border-rose-300 dark:border-rose-700',
    iconColor: 'text-rose-800 dark:text-rose-200',
    govBadge: 'bg-rose-200/90 text-rose-950 dark:bg-rose-900/90 dark:text-rose-100 border-rose-400 dark:border-rose-600',
    subcatBadge: 'text-rose-900 dark:text-rose-200 bg-rose-100/80 dark:bg-rose-900/60 border-rose-300/70 dark:border-rose-700/60',
    titleHover: 'group-hover:text-rose-700 dark:group-hover:text-rose-300',
    button: 'bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white shadow-xs hover:shadow-rose-600/30',
    statusDot: 'bg-rose-600',
    accentHex: '#be123c',
    brandTag: 'ই-দলিল e-Deed'
  },

  // 23. Banglar Shiksha Portal - Academic Purple
  'wb-banglar-shiksha': {
    topBarGradient: 'from-purple-500 via-violet-600 to-indigo-600',
    cardBg: 'bg-purple-100/75 dark:bg-[#210b36]',
    cardBorder: 'border-purple-300/90 dark:border-purple-700/80 hover:border-purple-500 dark:hover:border-purple-400',
    cardBgHover: 'hover:bg-purple-200/60 dark:hover:bg-[#2c0e47]',
    iconBg: 'bg-purple-200/90 dark:bg-purple-900/80 border-purple-300 dark:border-purple-700',
    iconColor: 'text-purple-800 dark:text-purple-200',
    govBadge: 'bg-purple-200/90 text-purple-950 dark:bg-purple-900/90 dark:text-purple-100 border-purple-400 dark:border-purple-600',
    subcatBadge: 'text-purple-900 dark:text-purple-200 bg-purple-100/80 dark:bg-purple-900/60 border-purple-300/70 dark:border-purple-700/60',
    titleHover: 'group-hover:text-purple-700 dark:group-hover:text-purple-300',
    button: 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white shadow-xs hover:shadow-purple-500/30',
    statusDot: 'bg-purple-500',
    accentHex: '#9333ea',
    brandTag: 'বাংলার শিক্ষা'
  },

  // 24. SVMCM Scholarship - Saffron Gold & Sunrise Amber
  'wb-svmcm-scholarship': {
    topBarGradient: 'from-amber-400 via-orange-500 to-yellow-500',
    cardBg: 'bg-amber-100/80 dark:bg-[#391804]',
    cardBorder: 'border-amber-300/90 dark:border-amber-700/80 hover:border-amber-500 dark:hover:border-amber-400',
    cardBgHover: 'hover:bg-amber-200/60 dark:hover:bg-[#4a2006]',
    iconBg: 'bg-amber-200/90 dark:bg-amber-900/80 border-amber-300 dark:border-amber-700',
    iconColor: 'text-amber-800 dark:text-amber-200',
    govBadge: 'bg-amber-200/90 text-amber-950 dark:bg-amber-900/90 dark:text-amber-100 border-amber-400 dark:border-amber-600',
    subcatBadge: 'text-amber-900 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-900/60 border-amber-300/70 dark:border-amber-700/60',
    titleHover: 'group-hover:text-amber-700 dark:group-hover:text-amber-300',
    button: 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white shadow-xs hover:shadow-amber-500/30',
    statusDot: 'bg-amber-500',
    accentHex: '#d97706',
    brandTag: 'SVMCM স্কলারশিপ'
  },

  // 25. OASIS Scholarship - Jade & Malachite
  'wb-oasis-scholarship': {
    topBarGradient: 'from-teal-400 via-emerald-500 to-cyan-600',
    cardBg: 'bg-teal-100/75 dark:bg-[#042623]',
    cardBorder: 'border-teal-300/90 dark:border-teal-700/80 hover:border-teal-500 dark:hover:border-teal-400',
    cardBgHover: 'hover:bg-teal-200/60 dark:hover:bg-[#06332f]',
    iconBg: 'bg-teal-200/90 dark:bg-teal-900/80 border-teal-300 dark:border-teal-700',
    iconColor: 'text-teal-800 dark:text-teal-200',
    govBadge: 'bg-teal-200/90 text-teal-950 dark:bg-teal-900/90 dark:text-teal-100 border-teal-400 dark:border-teal-600',
    subcatBadge: 'text-teal-900 dark:text-teal-200 bg-teal-100/80 dark:bg-teal-900/60 border-teal-300/70 dark:border-teal-700/60',
    titleHover: 'group-hover:text-teal-700 dark:group-hover:text-teal-300',
    button: 'bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white shadow-xs hover:shadow-teal-600/30',
    statusDot: 'bg-teal-500',
    accentHex: '#0f766e',
    brandTag: 'OASIS স্কলারশিপ'
  },

  // 26. Aikyashree & Medhashree Scholarship - Sea Green & Emerald
  'wb-aikyashree-scholarship': {
    topBarGradient: 'from-emerald-500 via-teal-500 to-green-600',
    cardBg: 'bg-emerald-100/75 dark:bg-[#052b1b]',
    cardBorder: 'border-emerald-300/90 dark:border-emerald-700/80 hover:border-emerald-500 dark:hover:border-emerald-400',
    cardBgHover: 'hover:bg-emerald-200/60 dark:hover:bg-[#083824]',
    iconBg: 'bg-emerald-200/90 dark:bg-emerald-900/80 border-emerald-300 dark:border-emerald-700',
    iconColor: 'text-emerald-800 dark:text-emerald-200',
    govBadge: 'bg-emerald-200/90 text-emerald-950 dark:bg-emerald-900/90 dark:text-emerald-100 border-emerald-400 dark:border-emerald-600',
    subcatBadge: 'text-emerald-900 dark:text-emerald-200 bg-emerald-100/80 dark:bg-emerald-900/60 border-emerald-300/70 dark:border-emerald-700/60',
    titleHover: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-300',
    button: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs hover:shadow-emerald-500/30',
    statusDot: 'bg-emerald-500',
    accentHex: '#059669',
    brandTag: 'ঐক্যশ্রী WBMDFC'
  },

  // 27. WBPSC Recruitment Portal - Classic Deep Indigo
  'wb-psc': {
    topBarGradient: 'from-indigo-600 via-blue-700 to-slate-800',
    cardBg: 'bg-indigo-100/75 dark:bg-[#101738]',
    cardBorder: 'border-indigo-300/90 dark:border-indigo-700/80 hover:border-indigo-500 dark:hover:border-indigo-400',
    cardBgHover: 'hover:bg-indigo-200/60 dark:hover:bg-[#151f49]',
    iconBg: 'bg-indigo-200/90 dark:bg-indigo-900/80 border-indigo-300 dark:border-indigo-700',
    iconColor: 'text-indigo-800 dark:text-indigo-200',
    govBadge: 'bg-indigo-200/90 text-indigo-950 dark:bg-indigo-900/90 dark:text-indigo-100 border-indigo-400 dark:border-indigo-600',
    subcatBadge: 'text-indigo-900 dark:text-indigo-200 bg-indigo-100/80 dark:bg-indigo-900/60 border-indigo-300/70 dark:border-indigo-700/60',
    titleHover: 'group-hover:text-indigo-700 dark:group-hover:text-indigo-300',
    button: 'bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900 text-white shadow-xs hover:shadow-indigo-600/30',
    statusDot: 'bg-indigo-600',
    accentHex: '#4338ca',
    brandTag: 'WBPSC ক্লার্কশিপ'
  },

  // 28. WB Police Recruitment Board (WBPRB) - Crimson & Cobalt
  'wb-prb-police-jobs': {
    topBarGradient: 'from-red-600 via-rose-600 to-blue-800',
    cardBg: 'bg-red-100/75 dark:bg-[#34070f]',
    cardBorder: 'border-red-300/90 dark:border-red-700/80 hover:border-red-500 dark:hover:border-red-400',
    cardBgHover: 'hover:bg-red-200/60 dark:hover:bg-[#450a14]',
    iconBg: 'bg-red-200/90 dark:bg-red-900/80 border-red-300 dark:border-red-700',
    iconColor: 'text-red-800 dark:text-red-200',
    govBadge: 'bg-red-200/90 text-red-950 dark:bg-red-900/90 dark:text-red-100 border-red-400 dark:border-red-600',
    subcatBadge: 'text-red-900 dark:text-red-200 bg-red-100/80 dark:bg-red-900/60 border-red-300/70 dark:border-red-700/60',
    titleHover: 'group-hover:text-red-700 dark:group-hover:text-red-300',
    button: 'bg-red-700 hover:bg-red-800 active:bg-red-900 text-white shadow-xs hover:shadow-red-600/30',
    statusDot: 'bg-red-600',
    accentHex: '#b91c1c',
    brandTag: 'WBPRB পুলিশ রিক্রুট'
  },

  // 29. Primary Education Board (WBBPE / TET) - Pine Green
  'wb-wbbpe-tet': {
    topBarGradient: 'from-green-500 via-emerald-600 to-teal-600',
    cardBg: 'bg-green-100/75 dark:bg-[#0a2d16]',
    cardBorder: 'border-green-300/90 dark:border-green-700/80 hover:border-green-500 dark:hover:border-green-400',
    cardBgHover: 'hover:bg-green-200/60 dark:hover:bg-[#0e3b1d]',
    iconBg: 'bg-green-200/90 dark:bg-green-900/80 border-green-300 dark:border-green-700',
    iconColor: 'text-green-800 dark:text-green-200',
    govBadge: 'bg-green-200/90 text-green-950 dark:bg-green-900/90 dark:text-green-100 border-green-400 dark:border-green-600',
    subcatBadge: 'text-green-900 dark:text-green-200 bg-green-100/80 dark:bg-green-900/60 border-green-300/70 dark:border-green-700/60',
    titleHover: 'group-hover:text-green-700 dark:group-hover:text-green-300',
    button: 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-xs hover:shadow-green-500/30',
    statusDot: 'bg-green-500',
    accentHex: '#16a34a',
    brandTag: 'WBBPE প্রাইমারি টেট'
  },

  // 30. WB Transport Department - Racing Sunset Orange
  'wb-transport-vahan': {
    topBarGradient: 'from-orange-500 via-amber-500 to-red-500',
    cardBg: 'bg-orange-100/75 dark:bg-[#371607]',
    cardBorder: 'border-orange-300/90 dark:border-orange-700/80 hover:border-orange-500 dark:hover:border-orange-400',
    cardBgHover: 'hover:bg-orange-200/60 dark:hover:bg-[#481d09]',
    iconBg: 'bg-orange-200/90 dark:bg-orange-900/80 border-orange-300 dark:border-orange-700',
    iconColor: 'text-orange-800 dark:text-orange-200',
    govBadge: 'bg-orange-200/90 text-orange-950 dark:bg-orange-900/90 dark:text-orange-100 border-orange-400 dark:border-orange-600',
    subcatBadge: 'text-orange-900 dark:text-orange-200 bg-orange-100/80 dark:bg-orange-900/60 border-orange-300/70 dark:border-orange-700/60',
    titleHover: 'group-hover:text-orange-700 dark:group-hover:text-orange-300',
    button: 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white shadow-xs hover:shadow-orange-500/30',
    statusDot: 'bg-orange-500',
    accentHex: '#ea580c',
    brandTag: 'WB পরিবহন'
  }
};

// Fallback palette generator for any other or dynamic services
const DYNAMIC_PALETTES: ServiceCardTheme[] = [
  {
    topBarGradient: 'from-blue-500 to-cyan-500',
    cardBg: 'bg-blue-50/80 dark:bg-slate-900/90',
    cardBorder: 'border-blue-200 dark:border-blue-800/80 hover:border-blue-400',
    cardBgHover: 'hover:bg-blue-100/50 dark:hover:bg-blue-950/30',
    iconBg: 'bg-blue-100 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-300',
    govBadge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    subcatBadge: 'text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
    titleHover: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    button: 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-blue-500/25',
    statusDot: 'bg-blue-500',
    accentHex: '#2563eb'
  },
  {
    topBarGradient: 'from-emerald-500 to-teal-500',
    cardBg: 'bg-emerald-50/80 dark:bg-slate-900/90',
    cardBorder: 'border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-400',
    cardBgHover: 'hover:bg-emerald-100/50 dark:hover:bg-emerald-950/30',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800',
    iconColor: 'text-emerald-600 dark:text-emerald-300',
    govBadge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    subcatBadge: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
    titleHover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow-emerald-500/25',
    statusDot: 'bg-emerald-500',
    accentHex: '#059669'
  },
  {
    topBarGradient: 'from-purple-500 to-pink-500',
    cardBg: 'bg-purple-50/80 dark:bg-slate-900/90',
    cardBorder: 'border-purple-200 dark:border-purple-800/80 hover:border-purple-400',
    cardBgHover: 'hover:bg-purple-100/50 dark:hover:bg-purple-950/30',
    iconBg: 'bg-purple-100 dark:bg-purple-950/80 border-purple-200 dark:border-purple-800',
    iconColor: 'text-purple-600 dark:text-purple-300',
    govBadge: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-700',
    subcatBadge: 'text-purple-700 dark:text-purple-300 bg-purple-50/80 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800',
    titleHover: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    button: 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs hover:shadow-purple-500/25',
    statusDot: 'bg-purple-500',
    accentHex: '#9333ea'
  }
];

export function getServiceTheme(serviceId: string): ServiceCardTheme {
  if (WB_SERVICE_THEMES[serviceId]) {
    return WB_SERVICE_THEMES[serviceId];
  }
  // Deterministic fallback based on ID hash
  let hash = 0;
  for (let i = 0; i < serviceId.length; i++) {
    hash = (hash << 5) - hash + serviceId.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DYNAMIC_PALETTES.length;
  return DYNAMIC_PALETTES[index];
}
