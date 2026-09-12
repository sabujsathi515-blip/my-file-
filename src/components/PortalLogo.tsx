import React, { useState } from 'react';

interface PortalLogoProps {
  serviceId: string;
  officialUrl: string;
  nameEn: string;
  nameBn?: string;
  iconBg: string;
  iconColor: string;
  accentHex?: string;
  className?: string;
}

export const PortalLogo: React.FC<PortalLogoProps> = ({
  serviceId,
  officialUrl,
  nameEn,
  nameBn,
  iconBg,
  iconColor,
  accentHex = '#059669',
  className = 'w-12 h-12'
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Extract domain from officialUrl safely
  let domain = '';
  try {
    const parsed = new URL(officialUrl);
    domain = parsed.hostname.replace('www.', '');
  } catch {
    domain = '';
  }

  // Google Favicon service URL (high-res 128px)
  const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : '';

  // Return custom authentic vector insignia for WB Government websites
  const renderVectorInsignia = () => {
    switch (serviceId) {
      // 1. Banglarbhumi (Land Records)
      case 'wb-banglarbhumi':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#047857" />
            <path d="M8 44L24 24L40 38L56 18V52C56 54.2 54.2 56 52 56H12C9.8 56 8 54.2 8 52V44Z" fill="#10b981" fillOpacity="0.4" />
            <path d="M14 42L28 26L42 40L50 30" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="28" cy="26" r="3.5" fill="#fef08a" />
            <rect x="20" y="36" width="24" height="16" rx="3" fill="#ffffff" fillOpacity="0.9" />
            <path d="M25 41H39M25 45H35M25 48H32" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
            <text x="32" y="18" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900" fontFamily="sans-serif">ভূমি</text>
          </svg>
        );

      // 2. e-District 2.0 West Bengal
      case 'wb-edistrict':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#0284c7" />
            <rect x="14" y="12" width="36" height="42" rx="4" fill="#ffffff" />
            <path d="M20 20H44M20 26H44M20 32H36" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="38" cy="40" r="10" fill="#0284c7" />
            <path d="M33 40L36.5 43.5L43 36.5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="800" fontFamily="sans-serif">e-District 2.0</text>
          </svg>
        );

      // 3. Duare Sarkar & Paray Samadhan
      case 'wb-duaresarkar':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#7c3aed" />
            {/* Umbrella top representing Duare Sarkar umbrella */}
            <path d="M12 30C12 18.9543 20.9543 10 32 10C43.0457 10 52 18.9543 52 30C46 27 40 32 32 28C24 32 18 27 12 30Z" fill="#fbbf24" />
            <path d="M32 10V46C32 48 30 49 28 49C26 49 25 48 25 46" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            {/* Citizens standing under shelter */}
            <circle cx="24" cy="38" r="4" fill="#ffffff" />
            <path d="M17 48C17 44 20 43 24 43C28 43 31 44 31 48" fill="#ffffff" fillOpacity="0.8" />
            <circle cx="40" cy="38" r="4" fill="#fbcfe8" />
            <path d="M33 48C33 44 36 43 40 43C44 43 47 44 47 48" fill="#fbcfe8" fillOpacity="0.8" />
            <text x="32" y="59" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">দুয়ারে সরকার</text>
          </svg>
        );

      // 4. Swasthya Sathi Scheme
      case 'wb-swasthyasathi':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#e11d48" />
            {/* Health Shield */}
            <path d="M32 10L48 16V28C48 40 32 50 32 50C32 50 16 40 16 28V16L32 10Z" fill="#ffffff" />
            {/* Red medical cross */}
            <path d="M28 22H36V28H42V36H36V42H28V36H22V28H28V22Z" fill="#e11d48" />
            <circle cx="32" cy="32" r="3" fill="#fbbf24" />
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">স্বাস্থ্য সাথী</text>
          </svg>
        );

      // 5. Lakshmir Bhandar
      case 'wb-lakshmirbhandar':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#d97706" />
            {/* Golden Mangal Ghat / Pot of Gold */}
            <ellipse cx="32" cy="18" rx="10" ry="4" fill="#fef08a" />
            {/* Pot Body */}
            <path d="M22 20C14 26 12 44 22 50C26 53 38 53 42 50C52 44 50 26 42 20H22Z" fill="#f59e0b" />
            {/* Gold Coins overflowing */}
            <circle cx="32" cy="16" r="6" fill="#fef08a" stroke="#b45309" strokeWidth="1.5" />
            <circle cx="26" cy="19" r="4.5" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
            <circle cx="38" cy="19" r="4.5" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
            <path d="M32 30V44M27 34H37M27 40H35" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            <text x="32" y="60" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900" fontFamily="sans-serif">লক্ষ্মীর ভাণ্ডার</text>
          </svg>
        );

      // 6. Krishak Bandhu
      case 'wb-krishakbandhu':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#4d7c0f" />
            {/* Sprout & Sun */}
            <circle cx="32" cy="18" r="8" fill="#fef08a" />
            <path d="M32 50V26M32 26C32 26 22 22 18 32C24 36 30 32 32 26ZM32 26C32 26 42 22 46 32C40 36 34 32 32 26Z" fill="#a3e635" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12 50C18 46 46 46 52 50" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
            <text x="32" y="60" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">কৃষক বন্ধু</text>
          </svg>
        );

      // 7. Kanyashree Prakalpa
      case 'wb-kanyashree':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#c026d3" />
            {/* Empowered girl reaching out with wings */}
            <circle cx="32" cy="16" r="6" fill="#ffffff" />
            <path d="M26 28L32 22L38 28V46H26V28Z" fill="#ffffff" />
            <path d="M18 24C24 20 28 26 32 24C36 26 40 20 46 24" stroke="#fef08a" strokeWidth="3.5" strokeLinecap="round" />
            {/* Bicycle wheel / empowerment circle */}
            <circle cx="32" cy="42" r="10" stroke="#fde047" strokeWidth="2.5" strokeDasharray="3 3" />
            <text x="32" y="60" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900" fontFamily="sans-serif">কন্যাশ্রী</text>
          </svg>
        );

      // 8. Rupashree Prakalpa
      case 'wb-rupashree':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#db2777" />
            {/* Nuptial celebration knot & auspicious lotus */}
            <path d="M32 12C36 20 46 20 46 28C46 38 32 46 32 46C32 46 18 38 18 28C18 20 28 20 32 12Z" fill="#ffffff" />
            <circle cx="32" cy="28" r="6" fill="#f43f5e" />
            <text x="32" y="31" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">₹</text>
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900" fontFamily="sans-serif">রূপশ্রী</text>
          </svg>
        );

      // 9. WB Student Credit Card
      case 'wb-student-credit-card':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#4f46e5" />
            {/* Mortarboard */}
            <path d="M32 12L14 22L32 30L50 22L32 12Z" fill="#fde047" />
            <path d="M46 25V34" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
            {/* Smart Credit Card */}
            <rect x="14" y="32" width="36" height="22" rx="3.5" fill="#ffffff" />
            <rect x="18" y="37" width="8" height="6" rx="1.5" fill="#f59e0b" />
            <path d="M30 40H44M30 45H40" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
            <text x="32" y="60" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900" fontFamily="sans-serif">WBSCC</text>
          </svg>
        );

      // 10. Bhabishyat Credit Card (BCCS)
      case 'wb-bhavishyat-credit-card':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#0d9488" />
            {/* Briefcase & Rocket */}
            <rect x="14" y="24" width="36" height="26" rx="4" fill="#ffffff" />
            <path d="M24 24V18C24 16.5 25.5 15 27 15H37C38.5 15 40 16.5 40 18V24" stroke="#ffffff" strokeWidth="2.5" />
            <path d="M22 36L30 28L36 34L44 24" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M38 24H44V30" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900" fontFamily="sans-serif">BCCS</text>
          </svg>
        );

      // 11. Caste Certificate SC/ST/OBC
      case 'wb-castecertificate':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#ea580c" />
            {/* Government Seal & Ribbon */}
            <circle cx="32" cy="26" r="14" fill="#ffffff" />
            <circle cx="32" cy="26" r="10" fill="#f97316" />
            <path d="M32 19V33M25 26H39" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M26 38L22 52L32 46L42 52L38 38" fill="#ffffff" />
            <text x="32" y="60" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900" fontFamily="sans-serif">SC/ST/OBC</text>
          </svg>
        );

      // 12. Digital Ration Card (Khadya Sathi)
      case 'wb-rationcard':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#b45309" />
            {/* Golden Wheat & Ration Card */}
            <rect x="14" y="24" width="36" height="24" rx="3" fill="#ffffff" />
            <rect x="18" y="28" width="10" height="12" fill="#d97706" rx="2" />
            <path d="M32 30H44M32 36H42M32 42H38" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
            {/* Wheat stalk */}
            <path d="M32 10C28 14 26 18 32 22C38 18 36 14 32 10Z" fill="#fef08a" />
            <path d="M24 14C22 17 24 20 28 20" stroke="#fde047" strokeWidth="2" />
            <path d="M40 14C42 17 40 20 36 20" stroke="#fde047" strokeWidth="2" />
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">খাদ্য সাথী</text>
          </svg>
        );

      // 13. Jai Bangla Pension Portal
      case 'wb-jaibangla':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#0891b2" />
            {/* Supportive caring hands */}
            <circle cx="26" cy="20" r="5" fill="#ffffff" />
            <circle cx="38" cy="22" r="4.5" fill="#fef08a" />
            <path d="M16 46C18 34 26 30 32 30C38 30 46 34 48 46" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M12 48C18 42 28 42 32 46C36 42 46 42 52 48" fill="#ffffff" fillOpacity="0.3" />
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">জয় বাংলা</text>
          </svg>
        );

      // 14. WB Employment Bank (Yuvasree)
      case 'wb-employmentbank':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#334155" />
            {/* Briefcase & Star */}
            <rect x="14" y="22" width="36" height="26" rx="4" fill="#ffffff" />
            <path d="M24 22V16H40V22" stroke="#ffffff" strokeWidth="3" />
            <rect x="14" y="30" width="36" height="4" fill="#0284c7" />
            <circle cx="32" cy="38" r="4" fill="#f59e0b" />
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900" fontFamily="sans-serif">যুবশ্রী</text>
          </svg>
        );

      // 15. WBSEDCL Electricity
      case 'wb-electricity-wbsedcl':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#ca8a04" />
            {/* Power Gear */}
            <circle cx="32" cy="30" r="18" fill="#ffffff" />
            {/* High voltage bolt */}
            <path d="M34 14L20 32H32L28 48L44 28H32L34 14Z" fill="#ca8a04" stroke="#b45309" strokeWidth="1.5" strokeLinejoin="round" />
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">WBSEDCL</text>
          </svg>
        );

      // 16. West Bengal Police
      case 'wb-police':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#1e3a8a" />
            {/* Police Star Crest */}
            <path d="M32 10L36 20L47 20L38 27L42 38L32 31L22 38L26 27L17 20L28 20L32 10Z" fill="#fde047" stroke="#ffffff" strokeWidth="1" />
            <circle cx="32" cy="26" r="6" fill="#1e3a8a" />
            <path d="M30 24L32 27L34 24" stroke="#ffffff" strokeWidth="1.5" />
            <text x="32" y="52" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">WB POLICE</text>
            <text x="32" y="60" textAnchor="middle" fill="#fde047" fontSize="7" fontWeight="bold">112</text>
          </svg>
        );

      // 17. Annapurna Food Portal
      case 'wb-annapurna':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#c2410c" />
            {/* Grain Bowl */}
            <ellipse cx="32" cy="22" rx="14" ry="5" fill="#fef08a" />
            <path d="M18 22C18 36 24 44 32 44C40 44 46 36 46 22H18Z" fill="#ffffff" />
            <path d="M28 14C30 11 34 11 36 14" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">অন্নপূর্ণা</text>
          </svg>
        );

      // 18. SmarSathi WB Portal
      case 'wb-smartsathi':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#0284c7" />
            {/* Smartphone & Rays */}
            <rect x="20" y="12" width="24" height="38" rx="4" fill="#ffffff" />
            <rect x="23" y="16" width="18" height="26" rx="2" fill="#e0f2fe" />
            <circle cx="32" cy="46" r="2" fill="#0284c7" />
            <path d="M32 22V32M27 27H37" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M14 26C16 22 18 22 18 20" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
            <path d="M50 26C48 22 46 22 46 20" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
            <text x="32" y="59" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900" fontFamily="sans-serif">SmarSathi</text>
          </svg>
        );

      // 19. Janakalyan Shibir
      case 'wb-janakalyan-shibir':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#059669" />
            {/* Camp Pavilion Tent */}
            <path d="M32 10L12 28H52L32 10Z" fill="#fde047" />
            <path d="M16 28V46H48V28" stroke="#ffffff" strokeWidth="3" />
            <path d="M26 46V36H38V46" fill="#ffffff" fillOpacity="0.4" />
            <circle cx="32" cy="20" r="3" fill="#059669" />
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900" fontFamily="sans-serif">জনকল্যাণ শিবির</text>
          </svg>
        );

      // 20. Gram Panchayat Tax (PRD)
      case 'wb-panchayat-tax':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#15803d" />
            {/* Terracotta Rural Hut & Stamp */}
            <path d="M32 12L12 26H52L32 12Z" fill="#b45309" />
            <rect x="18" y="26" width="28" height="20" fill="#ffffff" />
            <rect x="28" y="32" width="8" height="14" fill="#b45309" />
            {/* Form 4 Tax stamp */}
            <circle cx="44" cy="38" r="7" fill="#15803d" />
            <text x="44" y="41" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900">4</text>
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900" fontFamily="sans-serif">WBPRD ট্যাক্স</text>
          </svg>
        );

      // 21. Urban Property Tax
      case 'wb-urban-propertytax':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#1d4ed8" />
            {/* Municipality Building */}
            <path d="M32 12L16 22H48L32 12Z" fill="#ffffff" />
            <rect x="20" y="22" width="24" height="24" fill="#ffffff" />
            <path d="M24 26V42M32 26V42M40 26V42" stroke="#1d4ed8" strokeWidth="2" />
            <circle cx="32" cy="18" r="2.5" fill="#f59e0b" />
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900" fontFamily="sans-serif">পৌর প্রপার্টি ট্যাক্স</text>
          </svg>
        );

      // 22. Registration & e-Deed
      case 'wb-registration-deeds':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#9f1239" />
            {/* Legal Deed Scroll & Quill */}
            <rect x="18" y="14" width="28" height="36" rx="2" fill="#ffffff" />
            <path d="M22 20H38M22 25H40M22 30H36M22 35H32" stroke="#9f1239" strokeWidth="2" strokeLinecap="round" />
            <circle cx="36" cy="40" r="5" fill="#e11d48" />
            {/* Feather Quill */}
            <path d="M48 10C42 16 40 26 38 34L36 38L40 36C44 32 46 22 52 16" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900" fontFamily="sans-serif">ই-দলিল</text>
          </svg>
        );

      // 23. Banglar Shiksha Portal
      case 'wb-banglar-shiksha':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#7e22ce" />
            {/* Open Book & Lamp */}
            <path d="M12 36C20 32 30 34 32 38C34 34 44 32 52 36V20C44 16 34 18 32 22C30 18 20 16 12 20V36Z" fill="#ffffff" />
            <path d="M32 22V42" stroke="#7e22ce" strokeWidth="2.5" />
            {/* Flame */}
            <path d="M32 10C30 14 34 16 32 19C30 16 34 14 32 10Z" fill="#fbbf24" />
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900" fontFamily="sans-serif">বাংলার শিক্ষা</text>
          </svg>
        );

      // 24. SVMCM Scholarship
      case 'wb-svmcm-scholarship':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#b45309" />
            {/* Swami Vivekananda Saffron Medallion */}
            <circle cx="32" cy="28" r="16" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
            <circle cx="32" cy="28" r="13" fill="#ffffff" />
            {/* Silhouette turban motif */}
            <path d="M26 22C28 18 36 18 38 22C40 24 38 28 36 30H28C26 28 24 24 26 22Z" fill="#d97706" />
            <circle cx="32" cy="27" r="4.5" fill="#f59e0b" />
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">SVMCM</text>
          </svg>
        );

      // 25. OASIS Scholarship Portal
      case 'wb-oasis-scholarship':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#0f766e" />
            {/* Blooming Lotus & Diploma */}
            <path d="M32 16C28 24 24 28 20 32C28 32 30 26 32 16ZM32 16C36 24 40 28 44 32C36 32 34 26 32 16Z" fill="#ffffff" />
            <path d="M32 20C30 26 28 32 32 38C36 32 34 26 32 20Z" fill="#a7f3d0" />
            <rect x="20" y="38" width="24" height="8" rx="2" fill="#ffffff" />
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900" fontFamily="sans-serif">OASIS</text>
          </svg>
        );

      // 26. Aikyashree & Medhashree Portal
      case 'wb-aikyashree-scholarship':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#047857" />
            {/* Minority Development crescent & book */}
            <circle cx="32" cy="26" r="14" fill="#ffffff" fillOpacity="0.2" />
            <path d="M38 16C32 16 26 21 26 28C26 35 32 40 38 40C34 38 32 33 32 28C32 23 34 18 38 16Z" fill="#fde047" />
            <circle cx="38" cy="22" r="2.5" fill="#ffffff" />
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">ঐক্যশ্রী</text>
          </svg>
        );

      // 27. WBPSC Recruitment Portal
      case 'wb-psc':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#312e81" />
            {/* Scales of Justice & Ashoka Pillar */}
            <path d="M32 14V42M20 20H44" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            <path d="M20 20L14 30H26L20 20ZM44 20L38 30H50L44 20Z" stroke="#fde047" strokeWidth="2" fill="#fde047" fillOpacity="0.4" />
            <rect x="24" y="42" width="16" height="4" fill="#ffffff" />
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900" fontFamily="sans-serif">WBPSC</text>
          </svg>
        );

      // 28. WB Police Recruitment Board (WBPRB)
      case 'wb-prb-police-jobs':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#991b1b" />
            {/* Shield with Crossed Batons & Star */}
            <path d="M32 12L48 18V32C48 42 32 50 32 50C32 50 16 42 16 32V18L32 12Z" fill="#ffffff" />
            <path d="M22 22L42 40M42 22L22 40" stroke="#991b1b" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="31" r="5" fill="#f59e0b" />
            <text x="32" y="59" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900" fontFamily="sans-serif">WBPRB</text>
          </svg>
        );

      // 29. Primary Education Board (WBBPE / TET)
      case 'wb-wbbpe-tet':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#166534" />
            {/* Bengali Alphabet 'অ' & Primary School Bell */}
            <circle cx="32" cy="28" r="16" fill="#ffffff" />
            <text x="32" y="36" textAnchor="middle" fill="#166534" fontSize="22" fontWeight="900" fontFamily="sans-serif">অ</text>
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">WBBPE টেট</text>
          </svg>
        );

      // 30. WB Transport Department
      case 'wb-transport-vahan':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill="#c2410c" />
            {/* Steering Wheel & Road */}
            <circle cx="32" cy="28" r="14" stroke="#ffffff" strokeWidth="3.5" fill="none" />
            <circle cx="32" cy="28" r="4.5" fill="#ffffff" />
            <path d="M32 14V42M18 28H46" stroke="#ffffff" strokeWidth="2.5" />
            <path d="M14 46L24 40M50 46L40 40" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900" fontFamily="sans-serif">WB Transport</text>
          </svg>
        );

      // Default West Bengal Government Biswa Bangla Emblem
      default:
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
            <rect width="64" height="64" rx="14" fill={accentHex} />
            <circle cx="32" cy="32" r="18" stroke="#ffffff" strokeWidth="3" />
            <path d="M26 24C28 20 36 20 38 24C40 28 36 34 32 38" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="42" r="2.5" fill="#fde047" />
            <text x="32" y="58" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">WB GOVT</text>
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative ${className} shrink-0 rounded-2xl overflow-hidden shadow-sm transition-transform group-hover:scale-105 border border-black/10 dark:border-white/15 bg-white dark:bg-slate-900 flex items-center justify-center`}
      title={`${nameEn} - Official Portal Logo`}
    >
      {/* 1. Official Vector Emblem */}
      {renderVectorInsignia()}

      {/* 2. Real Live Favicon overlay badge (when internet is accessible) */}
      {faviconUrl && !imgError && (
        <div
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-800 p-0.5 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden"
          title="Official Verified Favicon"
        >
          <img
            src={faviconUrl}
            alt={`${nameEn} favicon`}
            className="w-full h-full object-contain rounded-full"
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        </div>
      )}
    </div>
  );
};
