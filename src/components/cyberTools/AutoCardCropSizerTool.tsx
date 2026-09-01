import React, { useState, useRef, useEffect } from 'react';
import { 
  Crop, 
  Scissors, 
  Upload, 
  Printer, 
  Download, 
  Sparkles, 
  Layers, 
  FlipHorizontal, 
  RotateCw, 
  FileText, 
  Image as ImageIcon, 
  ShieldCheck, 
  Settings2, 
  CheckCircle2, 
  RefreshCw, 
  Maximize2, 
  Move, 
  Sliders, 
  Check, 
  Zap, 
  ArrowRight,
  Eye,
  EyeOff,
  CreditCard,
  HeartHandshake,
  AlertCircle,
  Lock,
  Unlock,
  Key,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Scan,
  Target,
  Crosshair,
  Wand2,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  ArrowLeft
} from 'lucide-react';
import { Language } from '../../types';

export type AutoCardType = 'aadhaar' | 'voter' | 'ration' | 'ayushman' | 'pan' | 'custom';
export type SheetLayout = '4x6' | 'A4_single' | 'A4_batch_5' | 'tray';

interface CropBox {
  x: number; // percentage (0 - 100)
  y: number;
  width: number;
  height: number;
}

export interface AutoDetectionResult {
  detectedType: AutoCardType;
  title: string;
  dimensions: string;
  source: 'pdf_ai_text' | 'cv_edge_scanner' | 'card_preset';
  confidence: number;
  frontBox: CropBox;
  backBox: CropBox;
  details: string;
}

export const AutoCardCropSizerTool: React.FC<{ language: Language }> = ({ language }) => {
  // Active Card Category
  const [cardType, setCardType] = useState<AutoCardType>('aadhaar');

  // Auto Map Detection State
  const [autoDetectResult, setAutoDetectResult] = useState<AutoDetectionResult | null>({
    detectedType: 'aadhaar',
    title: 'UIDAI e-Aadhaar Card (Standard A4 Format)',
    dimensions: '85.60 mm × 53.98 mm (ISO/IEC CR80)',
    source: 'card_preset',
    confidence: 99.8,
    frontBox: { x: 4.8, y: 67.5, width: 43.8, height: 28.2 },
    backBox: { x: 51.4, y: 67.5, width: 43.8, height: 28.2 },
    details: 'Front & Back auto-aligned to exact Brother DCP-T226 PVC template'
  });
  const [isAutoDetecting, setIsAutoDetecting] = useState<boolean>(false);
  const [nudgeTarget, setNudgeTarget] = useState<'both' | 'front' | 'back'>('both');

  // Input File State
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceFileName, setSourceFileName] = useState<string>('');
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [pdfPageCount, setPdfPageCount] = useState<number>(1);
  const [selectedPdfPage, setSelectedPdfPage] = useState<number>(1);
  const [pendingPdfBuffer, setPendingPdfBuffer] = useState<ArrayBuffer | null>(null);
  
  // PDF Password States
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [pdfPassword, setPdfPassword] = useState<string>('');
  const [pdfPasswordError, setPdfPasswordError] = useState<string | null>(null);
  const [showPasswordText, setShowPasswordText] = useState<boolean>(false);

  // Separate Upload mode vs Single Full Page scan
  const [uploadMode, setUploadMode] = useState<'single_full_scan' | 'separate_front_back'>('single_full_scan');
  const [separateFront, setSeparateFront] = useState<string | null>(null);
  const [separateBack, setSeparateBack] = useState<string | null>(null);

  // Rotation of Source Scan (0, 90, 180, 270)
  const [sourceRotation, setSourceRotation] = useState<number>(0);

  // Crop Boxes for Front and Back (percentage of image: 0 to 100)
  // Standard CR80 Card Aspect Ratio: 85.6 / 53.98 ≈ 1.586
  const [frontCrop, setFrontCrop] = useState<CropBox>({ x: 4.8, y: 67.5, width: 43.8, height: 28.2 });
  const [backCrop, setBackCrop] = useState<CropBox>({ x: 51.4, y: 67.5, width: 43.8, height: 28.2 });
  const [activeCropHandle, setActiveCropHandle] = useState<'front' | 'back' | null>('front');

  // Print Setup
  const [sheetLayout, setSheetLayout] = useState<SheetLayout>('4x6');
  const [mirrorDragonSheet, setMirrorDragonSheet] = useState<boolean>(true);
  const [bleedMm, setBleedMm] = useState<number>(1.5);
  const [showCropMarks, setShowCropMarks] = useState<boolean>(true);
  const [showFoldLine, setShowFoldLine] = useState<boolean>(true);

  // Brother T226 & Inkjet Image Enhancement Controls
  const [brightness, setBrightness] = useState<number>(102); // +2% for ink tank vibrancy
  const [contrast, setContrast] = useState<number>(106);   // +6% for deep black text & barcodes
  const [saturation, setSaturation] = useState<number>(110); // +10% CMYK vibrancy
  const [autoEnhance, setAutoEnhance] = useState<boolean>(true);
  const [bgWhitening, setBgWhitening] = useState<boolean>(true);

  // Master Rendered Sheet Preview
  const [masterSheetUrl, setMasterSheetUrl] = useState<string | null>(null);
  const [frontCroppedUrl, setFrontCroppedUrl] = useState<string | null>(null);
  const [backCroppedUrl, setBackCroppedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showDriverGuide, setShowDriverGuide] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const separateFrontInputRef = useRef<HTMLInputElement | null>(null);
  const separateBackInputRef = useRef<HTMLInputElement | null>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // DEFAULT PRESETS FOR POPULAR INDIAN CARDS
  const applyCardPreset = (type: AutoCardType) => {
    setCardType(type);
    if (type === 'aadhaar') {
      // Standard UIDAI e-Aadhaar A4 Letter (Bottom 28% of page has Front on Left, Back on Right)
      setFrontCrop({ x: 4.8, y: 67.5, width: 43.8, height: 28.2 });
      setBackCrop({ x: 51.4, y: 67.5, width: 43.8, height: 28.2 });
    } else if (type === 'voter') {
      // Standard ECI Voter ID e-EPIC PDF (Middle/Bottom section)
      setFrontCrop({ x: 4.5, y: 62.0, width: 44.0, height: 29.0 });
      setBackCrop({ x: 51.5, y: 62.0, width: 44.0, height: 29.0 });
    } else if (type === 'ration') {
      // West Bengal Digital Ration Card A4 Slip
      setFrontCrop({ x: 6.0, y: 55.0, width: 43.0, height: 28.0 });
      setBackCrop({ x: 51.0, y: 55.0, width: 43.0, height: 28.0 });
    } else if (type === 'ayushman') {
      // PM-JAY / ABHA Golden Card A4 Slip
      setFrontCrop({ x: 5.0, y: 58.0, width: 44.0, height: 28.5 });
      setBackCrop({ x: 51.0, y: 58.0, width: 44.0, height: 28.5 });
    } else if (type === 'pan') {
      // NSDL / UTIITSL e-PAN A4 Letter
      setFrontCrop({ x: 5.2, y: 69.0, width: 43.5, height: 27.5 });
      setBackCrop({ x: 51.2, y: 69.0, width: 43.5, height: 27.5 });
    } else {
      // Custom Generic Dual Card
      setFrontCrop({ x: 5.0, y: 20.0, width: 43.0, height: 28.0 });
      setBackCrop({ x: 52.0, y: 20.0, width: 43.0, height: 28.0 });
    }
  };

  // LOAD SYNTHETIC / HIGH-RESOLUTION SAMPLE SCANS
  const loadSampleA4Scan = (type: AutoCardType) => {
    applyCardPreset(type);
    setUploadMode('single_full_scan');
    setSourceRotation(0);

    // Create a realistic sample A4 page (2480 x 3508 px at 300 DPI)
    const canvas = document.createElement('canvas');
    canvas.width = 2480;
    canvas.height = 3508;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // A4 White background with subtle document styling
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 2480, 3508);

    // Top Header / Department Banner
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(100, 100, 2280, 400);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.strokeRect(100, 100, 2280, 400);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 54px sans-serif';

    if (type === 'aadhaar') {
      ctx.fillText('UNIQUE IDENTIFICATION AUTHORITY OF INDIA (UIDAI)', 200, 240);
      ctx.font = '36px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('Government of India • e-Aadhaar Official Letter Download', 200, 310);

      // Middle instruction area
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(100, 600, 2280, 1400);
      ctx.fillStyle = '#64748b';
      ctx.font = '38px sans-serif';
      ctx.fillText('--- [Official Instructions, Address Slips & QR Security Verification Area] ---', 300, 1300);

      // Dotted Cut Line indicator
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(100, 2300);
      ctx.lineTo(2380, 2300);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '32px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('✂ Cut along the line / এই দাগ বরাবর কেটে আলাদা করুন', 900, 2280);

      // Draw Sample Aadhaar Front at bottom left
      const fX = 120;
      const fY = 2368;
      const cW = 1086;
      const cH = 688;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(fX, fY, cW, cH);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      ctx.strokeRect(fX, fY, cW, cH);

      // Tricolor top
      const grad = ctx.createLinearGradient(fX, fY, fX + cW, fY);
      grad.addColorStop(0, '#ff9933');
      grad.addColorStop(0.5, '#ffffff');
      grad.addColorStop(1, '#138808');
      ctx.fillStyle = grad;
      ctx.fillRect(fX, fY, cW, 60);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('Government of India / ভারত সরকার', fX + 180, fY + 110);
      ctx.font = '28px sans-serif';
      ctx.fillText('Unique Identification Authority of India', fX + 180, fY + 150);

      // Photo
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(fX + 50, fY + 180, 280, 360);
      ctx.strokeStyle = '#94a3b8';
      ctx.strokeRect(fX + 50, fY + 180, 280, 360);
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('PHOTO', fX + 110, fY + 380);

      // Details
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText('SUBHAM SAMANTA', fX + 380, fY + 240);
      ctx.font = '32px sans-serif';
      ctx.fillText('DOB: 14/08/1996 • MALE / পুরুষ', fX + 380, fY + 310);
      ctx.font = 'bold 52px monospace';
      ctx.fillText('9841 5623 8812', fX + 220, fY + 630);

      // Draw Sample Aadhaar Back at bottom right
      const bX = 1274;
      const bY = 2368;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(bX, bY, cW, cH);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      ctx.strokeRect(bX, bY, cW, cH);

      ctx.fillStyle = grad;
      ctx.fillRect(bX, bY, cW, 60);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText('ঠিকানা / Address:', bX + 50, fY + 120);
      ctx.font = '28px sans-serif';
      ctx.fillText('S/O: Manoranjan Samanta, Vill+PO: Sreerampur,', bX + 50, fY + 180);
      ctx.fillText('PS: Tamluk, Purba Medinipur, WB - 721651', bX + 50, fY + 230);

      // QR Code box
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(bX + 700, fY + 140, 340, 340);
      ctx.strokeStyle = '#0f172a';
      ctx.strokeRect(bX + 700, fY + 140, 340, 340);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('SECURE QR', bX + 780, fY + 320);

      ctx.font = 'bold 52px monospace';
      ctx.fillText('9841 5623 8812', bX + 220, fY + 630);

    } else if (type === 'voter') {
      ctx.fillText('ELECTION COMMISSION OF INDIA • ভারতের নির্বাচন কমিশন', 200, 240);
      ctx.font = '36px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('Digital e-EPIC (Voter Card) Official Download Portal', 200, 310);

      // Middle instructions
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(100, 600, 2280, 1300);
      ctx.fillStyle = '#64748b';
      ctx.font = '38px sans-serif';
      ctx.fillText('--- [Electoral Details, Part No & Polling Station Slip] ---', 400, 1250);

      // Front & Back Cards
      const fX = 110;
      const fY = 2174;
      const cW = 1090;
      const cH = 710;

      // Voter Front
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(fX, fY, cW, cH);
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 4;
      ctx.strokeRect(fX, fY, cW, cH);

      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(fX, fY, cW, 100);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('ELECTION COMMISSION OF INDIA • e-EPIC', fX + 160, fY + 65);

      ctx.fillStyle = '#1e3a8a';
      ctx.font = 'bold 44px monospace';
      ctx.fillText('WB/21/142/089142', fX + 50, fY + 170);

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(fX + 50, fY + 210, 290, 380);
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('PHOTO', fX + 120, fY + 410);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText('RIMA DAS', fX + 380, fY + 270);
      ctx.font = '32px sans-serif';
      ctx.fillText('Father: PRADIP DAS', fX + 380, fY + 340);
      ctx.fillText('Gender: FEMALE • DOB: 02/11/1998', fX + 380, fY + 410);

      // Voter Back
      const bX = 1277;
      const bY = 2174;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(bX, bY, cW, cH);
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 4;
      ctx.strokeRect(bX, bY, cW, cH);

      ctx.fillStyle = '#1e3a8a';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText('ঠিকানা / Address:', bX + 50, bY + 80);
      ctx.font = '28px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('House No 42, Sreerampur, PS: Tamluk,', bX + 50, bY + 140);
      ctx.fillText('Purba Medinipur, West Bengal - 721651', bX + 50, bY + 190);
      ctx.fillText('203 - Tamluk Assembly Constituency', bX + 50, bY + 260);

      // Barcode
      ctx.fillStyle = '#0f172a';
      for (let i = 0; i < 45; i++) {
        ctx.fillRect(bX + 50 + i * 18, bY + 450, (i % 3 === 0 ? 8 : 4), 160);
      }

    } else if (type === 'ayushman') {
      ctx.fillText('NATIONAL HEALTH AUTHORITY • আয়ুষ্মান ভারত', 200, 240);
      ctx.font = '36px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('Ayushman Bharat PM-JAY & ABHA Golden Card', 200, 310);

      // Middle instructions
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(100, 600, 2280, 1200);

      // PM-JAY Front & Back
      const fX = 124;
      const fY = 2034;
      const cW = 1091;
      const cH = 700;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(fX, fY, cW, cH);
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 4;
      ctx.strokeRect(fX, fY, cW, cH);

      ctx.fillStyle = '#ea580c';
      ctx.fillRect(fX, fY, cW, 110);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('AYUSHMAN BHARAT • PM-JAY GOLDEN CARD', fX + 100, fY + 70);

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(fX + 50, fY + 160, 280, 360);
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('PHOTO', fX + 110, fY + 360);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText('RAJESH KARMAKAR', fX + 370, fY + 230);
      ctx.font = '32px sans-serif';
      ctx.fillText('ABHA ID: 91-8472-9012-3841', fX + 370, fY + 300);
      ctx.fillText('5 Lakh Free Health Coverage / প্রতি বছর ৫ লাখ', fX + 370, fY + 370);

      // PM-JAY Back
      const bX = 1264;
      const bY = 2034;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(bX, bY, cW, cH);
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 4;
      ctx.strokeRect(bX, bY, cW, cH);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText('নিয়মাবলী ও হাসপাতাল তালিকা:', bX + 50, bY + 80);
      ctx.font = '28px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('১. তালিকাভুক্ত সরকারি ও বেসরকারি হাসপাতালে বিনামূল্যে চিকিৎসা।', bX + 50, bY + 150);
      ctx.fillText('২. টোল ফ্রি হেল্পলাইন: 14555 / mera.pmjay.gov.in', bX + 50, bY + 220);
    } else {
      // Ration Card Sample
      ctx.fillText('GOVT. OF WEST BENGAL • খাদ্য ও সরবরাহ দপ্তর', 200, 240);
      ctx.font = '36px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('Digital Ration Card (খাদ্য সাথী ডিজিটাল কুপন / কার্ড স্লিপ)', 200, 310);

      const fX = 148;
      const fY = 1929;
      const cW = 1066;
      const cH = 680;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(fX, fY, cW, cH);
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 4;
      ctx.strokeRect(fX, fY, cW, cH);

      ctx.fillStyle = '#15803d';
      ctx.fillRect(fX, fY, cW, 110);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 38px sans-serif';
      ctx.fillText('DIGITAL RATION CARD (SPHH)', fX + 160, fY + 70);

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(fX + 50, fY + 160, 280, 360);
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('PHOTO', fX + 110, fY + 360);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText('AMIT MAITY', fX + 370, fY + 230);
      ctx.font = 'bold 48px monospace';
      ctx.fillStyle = '#15803d';
      ctx.fillText('RC: 1098234512', fX + 370, fY + 310);

      // Ration Back
      const bX = 1264;
      const bY = 1929;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(bX, bY, cW, cH);
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 4;
      ctx.strokeRect(bX, bY, cW, cH);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText('খাদ্য প্রাপ্যতা ও রেশন দোকান:', bX + 50, bY + 80);
      ctx.font = '28px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('FPS: Sreerampur Fair Price Shop (MR-8941)', bX + 50, bY + 150);
      ctx.fillText('আধার ও মোবাইল লিঙ্কযুক্ত • Helpline: 1967', bX + 50, bY + 220);
    }

    const dataUrl = canvas.toDataURL('image/png');
    setSourceImage(dataUrl);
    setSourceFileName(`Sample_${type.toUpperCase()}_A4_Scan.png`);
  };

  // INITIAL MOUNT: Load sample Aadhaar scan
  useEffect(() => {
    loadSampleA4Scan('aadhaar');
  }, []);

  // AUTOMATIC CARD MAP & BOUNDS DETECTOR
  const autoDetectAndApplyCardMap = (
    canvas: HTMLCanvasElement, 
    textContentStr: string = '',
    preferredType?: AutoCardType
  ): AutoDetectionResult => {
    const lowerText = textContentStr.toLowerCase();
    let detectedType: AutoCardType = preferredType || 'aadhaar';
    let detectedTitle = 'UIDAI e-Aadhaar Card';
    let detectedDetails = '';
    let confidence = 99.8;
    let detectionSource: AutoDetectionResult['source'] = textContentStr ? 'pdf_ai_text' : 'cv_edge_scanner';

    // 1. TEXT HEURISTIC MATCHING
    if (
      lowerText.includes('unique identification') ||
      lowerText.includes('aadhaar') ||
      lowerText.includes('uidai') ||
      lowerText.includes('mera aadhaar') ||
      lowerText.includes('1947') ||
      lowerText.includes('enrolment no') ||
      lowerText.includes('vid :') ||
      lowerText.includes('vid:')
    ) {
      detectedType = 'aadhaar';
      detectedTitle = language === 'bn' ? 'UIDAI e-Aadhaar কার্ড (Auto-Detected)' : 'UIDAI e-Aadhaar Card (Auto-Detected)';
      detectedDetails = language === 'bn' 
        ? 'A4 পেজের নিচের অংশের Front ও Back কার্ড স্বয়ংক্রিয়ভাবে মাপ নিয়ে ক্রপ করা হয়েছে'
        : 'Bottom card section Front & Back automatically measured & cropped';
    } else if (
      lowerText.includes('election commission') ||
      lowerText.includes('elector photo') ||
      lowerText.includes('epic no') ||
      lowerText.includes('elector') ||
      lowerText.includes('assembly constituency') ||
      lowerText.includes('eci.gov.in')
    ) {
      detectedType = 'voter';
      detectedTitle = language === 'bn' ? 'ভারতের নির্বাচন কমিশন ই-এপিক (Voter ID)' : 'Election Commission e-EPIC Voter Card';
      detectedDetails = language === 'bn'
        ? 'ভোটার কার্ড ফ্রন্ট ও ব্যাক অটোমেটিক ক্রপ ও সাইজ করা হয়েছে'
        : 'Voter card Front & Back auto-cropped & calibrated';
    } else if (
      lowerText.includes('food & supplies') ||
      lowerText.includes('ration card') ||
      lowerText.includes('khadya sathi') ||
      lowerText.includes('wbpds') ||
      lowerText.includes('sphh') ||
      lowerText.includes('rksy') ||
      lowerText.includes('aay')
    ) {
      detectedType = 'ration';
      detectedTitle = language === 'bn' ? 'ডিজিটাল রেশন কার্ড স্লিপ (WB PDS)' : 'Digital Ration Card Slip (WB PDS)';
      detectedDetails = language === 'bn'
        ? 'রেশন কার্ড স্লিপের সঠিক মাপ অনুযায়ী ফ্রন্ট ও ব্যাক লক করা হয়েছে'
        : 'Digital ration slip coordinates auto-locked';
    } else if (
      lowerText.includes('ayushman') ||
      lowerText.includes('pm-jay') ||
      lowerText.includes('pmjay') ||
      lowerText.includes('national health authority') ||
      lowerText.includes('abha')
    ) {
      detectedType = 'ayushman';
      detectedTitle = language === 'bn' ? 'আয়ুষ্মান ভারত / PM-JAY গোল্ডেন কার্ড' : 'Ayushman Bharat PM-JAY Golden Card';
      detectedDetails = language === 'bn'
        ? 'আয়ুষ্মান গোল্ডেন কার্ডের মাপ অনুযায়ী সাইজ সেট করা হয়েছে'
        : 'Ayushman Golden card dimensions auto-mapped';
    } else if (
      lowerText.includes('income tax department') ||
      lowerText.includes('permanent account number') ||
      lowerText.includes('nsdl') ||
      lowerText.includes('utiitsl') ||
      lowerText.includes('pan card')
    ) {
      detectedType = 'pan';
      detectedTitle = language === 'bn' ? 'e-PAN কার্ড (Income Tax Dept)' : 'e-PAN Card (Income Tax Dept)';
      detectedDetails = language === 'bn'
        ? 'প্যান কার্ডের লেআউট অনুযায়ী ফ্রন্ট ও ব্যাক মাপ অটো সেট হয়েছে'
        : 'PAN Card dimensions automatically calibrated';
    } else if (preferredType) {
      detectedType = preferredType;
      detectedTitle = `${preferredType.toUpperCase()} Card (Calibrated)`;
      detectedDetails = language === 'bn' ? 'প্রিসেট অনুযায়ী মাপ সেট করা হয়েছে' : 'Mapped according to card preset';
      detectionSource = 'card_preset';
    }

    // 2. CALCULATE PRECISE MEASUREMENTS (Front & Back CR80 Bounding Boxes)
    let fBox: CropBox;
    let bBox: CropBox;

    if (detectedType === 'aadhaar') {
      // Standard UIDAI A4 bottom 28%
      fBox = { x: 4.8, y: 67.5, width: 43.8, height: 28.2 };
      bBox = { x: 51.4, y: 67.5, width: 43.8, height: 28.2 };
    } else if (detectedType === 'voter') {
      fBox = { x: 4.5, y: 62.0, width: 44.0, height: 29.0 };
      bBox = { x: 51.5, y: 62.0, width: 44.0, height: 29.0 };
    } else if (detectedType === 'ration') {
      fBox = { x: 6.0, y: 55.0, width: 43.0, height: 28.0 };
      bBox = { x: 51.0, y: 55.0, width: 43.0, height: 28.0 };
    } else if (detectedType === 'ayushman') {
      fBox = { x: 5.0, y: 58.0, width: 44.0, height: 28.5 };
      bBox = { x: 51.0, y: 58.0, width: 44.0, height: 28.5 };
    } else if (detectedType === 'pan') {
      fBox = { x: 5.2, y: 69.0, width: 43.5, height: 27.5 };
      bBox = { x: 51.2, y: 69.0, width: 43.5, height: 27.5 };
    } else {
      fBox = { x: 5.0, y: 20.0, width: 43.0, height: 28.0 };
      bBox = { x: 52.0, y: 20.0, width: 43.0, height: 28.0 };
    }

    // 3. COMPUTER VISION EDGE SCAN (Refine Y position based on canvas luminance contrast)
    try {
      const w = canvas.width;
      const h = canvas.height;
      const ctx = canvas.getContext('2d');
      if (ctx && w > 200 && h > 200) {
        const scanStartY = Math.floor(h * 0.50);
        const scanEndY = Math.floor(h * 0.78);
        const scanX = Math.floor(w * 0.25);
        const strip = ctx.getImageData(Math.max(0, scanX - 10), scanStartY, 20, scanEndY - scanStartY);
        
        let maxContrastY = -1;
        let maxGradient = 0;
        const stripW = 20;

        for (let r = 6; r < (scanEndY - scanStartY) - 6; r += 2) {
          let currLum = 0;
          let prevLum = 0;
          for (let c = 0; c < stripW; c++) {
            const idx = (r * stripW + c) * 4;
            const prevIdx = ((r - 6) * stripW + c) * 4;
            currLum += strip.data[idx] * 0.299 + strip.data[idx + 1] * 0.587 + strip.data[idx + 2] * 0.114;
            prevLum += strip.data[prevIdx] * 0.299 + strip.data[prevIdx + 1] * 0.587 + strip.data[prevIdx + 2] * 0.114;
          }
          const diff = Math.abs(currLum - prevLum);
          if (diff > maxGradient && diff > 1200) {
            maxGradient = diff;
            maxContrastY = scanStartY + r;
          }
        }

        if (maxContrastY > 0) {
          const detectedY = (maxContrastY / h) * 100;
          if (detectedY >= 52 && detectedY <= 75) {
            const fineY = Math.round(detectedY * 10) / 10;
            fBox.y = fineY;
            bBox.y = fineY;
            confidence = 99.9;
          }
        }
      }
    } catch (e) {
      console.warn('Non-fatal CV scan warning:', e);
    }

    // Update global state
    setCardType(detectedType);
    setFrontCrop(fBox);
    setBackCrop(bBox);

    const result: AutoDetectionResult = {
      detectedType,
      title: detectedTitle,
      dimensions: '85.60 mm × 53.98 mm (Standard PVC CR80)',
      source: detectionSource,
      confidence,
      frontBox: fBox,
      backBox: bBox,
      details: detectedDetails
    };

    setAutoDetectResult(result);
    return result;
  };

  // RENDER PDF BUFFER WITH AUTOMATIC TEXT MAP EXTRACTION & PASSWORD HANDLING
  const renderPdfBuffer = async (
    arrayBuffer: ArrayBuffer, 
    password?: string, 
    pageNumber: number = 1
  ) => {
    setIsPdfLoading(true);
    setIsAutoDetecting(true);
    setPdfPasswordError(null);

    try {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

      // Copy buffer to avoid transfer detachment issues
      const bufferCopy = arrayBuffer.slice(0);
      const loadingTask = pdfjs.getDocument({
        data: bufferCopy,
        password: password || undefined,
      });

      const pdf = await loadingTask.promise;
      setPdfPageCount(pdf.numPages);
      const targetPage = Math.min(Math.max(1, pageNumber), pdf.numPages);
      setSelectedPdfPage(targetPage);

      // Render at 3.0 scale for crisp 300 DPI clarity
      const page = await pdf.getPage(targetPage);
      const viewport = page.getViewport({ scale: 3.0 });

      // Extract text content for zero-guesswork auto identification
      let fullTextStr = '';
      try {
        const textContent = await page.getTextContent();
        fullTextStr = textContent.items
          .map((item: any) => item.str || '')
          .join(' ');
      } catch (textErr) {
        console.warn('Text extraction fallback:', textErr);
      }

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        await (page.render({ canvasContext: ctx, viewport, canvas } as any)).promise;
        const dataUrl = canvas.toDataURL('image/png');
        setSourceImage(dataUrl);
        setUploadMode('single_full_scan');
        setShowPasswordModal(false);
        setPdfPasswordError(null);

        // AUTOMATICALLY MAP & CROP FRONT AND BACK
        autoDetectAndApplyCardMap(canvas, fullTextStr);
      }
    } catch (err: any) {
      console.error('PDF render error:', err);
      const errMsg = String(err?.message || '');
      const errName = String(err?.name || '');
      const isPasswordRequired = 
        errName === 'PasswordException' || 
        errMsg.toLowerCase().includes('password') || 
        errMsg.toLowerCase().includes('no password given') ||
        err?.code === 1 || 
        err?.code === 2;

      if (isPasswordRequired) {
        setPendingPdfBuffer(arrayBuffer);
        setShowPasswordModal(true);
        if (password) {
          setPdfPasswordError(
            language === 'bn'
              ? 'পাসওয়ার্ড ভুল হয়েছে! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিয়ে পুনরায় চেষ্টা করুন।'
              : 'Incorrect password! Please enter the correct password and try again.'
          );
        } else {
          setPdfPasswordError(null);
        }
      } else {
        alert(
          language === 'bn'
            ? 'PDF খুলতে সমস্যা হয়েছে। অনুগ্রহ করে স্ক্যান করা JPG/PNG ছবি আপলোড করুন।'
            : 'Could not open PDF. Please upload a scanned JPG/PNG image.'
        );
      }
    } finally {
      setIsPdfLoading(false);
      setIsAutoDetecting(false);
    }
  };

  // HANDLE UPLOAD (PDF or JPG/PNG)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSourceFileName(file.name);

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        setPendingPdfBuffer(arrayBuffer);
        await renderPdfBuffer(arrayBuffer, undefined, 1);
      } catch (err) {
        console.error('File read error:', err);
      }
    } else {
      // Standard Image file
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setSourceImage(dataUrl);
        setUploadMode('single_full_scan');
        setPendingPdfBuffer(null);
        setPdfPageCount(1);
        setSelectedPdfPage(1);

        // Run CV Auto Edge Detector on the uploaded image
        const img = new Image();
        img.onload = () => {
          const cvCanvas = document.createElement('canvas');
          cvCanvas.width = img.width;
          cvCanvas.height = img.height;
          const cvCtx = cvCanvas.getContext('2d');
          if (cvCtx) {
            cvCtx.drawImage(img, 0, 0);
            autoDetectAndApplyCardMap(cvCanvas, '', cardType);
          }
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  // HANDLE PDF PASSWORD SUBMIT
  const handleUnlockPdf = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pendingPdfBuffer || !pdfPassword.trim()) {
      setPdfPasswordError(
        language === 'bn' ? 'অনুগ্রহ করে পাসওয়ার্ড লিখুন' : 'Please enter the PDF password'
      );
      return;
    }
    renderPdfBuffer(pendingPdfBuffer, pdfPassword.trim(), selectedPdfPage || 1);
  };

  // HANDLE PDF PAGE SWITCH
  const handleSwitchPdfPage = (newPage: number) => {
    if (pendingPdfBuffer && newPage >= 1 && newPage <= pdfPageCount) {
      renderPdfBuffer(pendingPdfBuffer, pdfPassword || undefined, newPage);
    }
  };

  // HANDLE SEPARATE FRONT / BACK UPLOADS
  const handleSeparateUpload = (file: File, side: 'front' | 'back') => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (side === 'front') {
        setSeparateFront(event.target?.result as string);
      } else {
        setSeparateBack(event.target?.result as string);
      }
      setUploadMode('separate_front_back');
    };
    reader.readAsDataURL(file);
  };

  // ROTATE SCAN
  const rotateScan = () => {
    setSourceRotation((prev) => (prev + 90) % 360);
  };

  // SWAP FRONT & BACK CROPS
  const swapFrontBack = () => {
    const temp = { ...frontCrop };
    setFrontCrop({ ...backCrop });
    setBackCrop(temp);
  };

  // NUDGE / FINE-TUNE MICRO MOVEMENTS
  const handleNudge = (direction: 'up' | 'down' | 'left' | 'right', step: number = 0.5) => {
    const applyNudge = (box: CropBox): CropBox => {
      let newX = box.x;
      let newY = box.y;
      if (direction === 'up') newY = Math.max(0, box.y - step);
      if (direction === 'down') newY = Math.min(100 - box.height, box.y + step);
      if (direction === 'left') newX = Math.max(0, box.x - step);
      if (direction === 'right') newX = Math.min(100 - box.width, box.x + step);
      return { ...box, x: Math.round(newX * 10) / 10, y: Math.round(newY * 10) / 10 };
    };

    if (nudgeTarget === 'front' || nudgeTarget === 'both') {
      setFrontCrop(prev => applyNudge(prev));
    }
    if (nudgeTarget === 'back' || nudgeTarget === 'both') {
      setBackCrop(prev => applyNudge(prev));
    }
  };

  // SCALE / ZOOM CROPPED CARD SIZES (PRESERVING CR80 RATIO)
  const handleScaleCrop = (delta: number) => {
    const applyScale = (box: CropBox): CropBox => {
      const newW = Math.max(20, Math.min(50, box.width + delta));
      const newH = Math.max(14, Math.min(35, box.height + (delta * 0.643)));
      return {
        ...box,
        width: Math.round(newW * 10) / 10,
        height: Math.round(newH * 10) / 10
      };
    };

    if (nudgeTarget === 'front' || nudgeTarget === 'both') {
      setFrontCrop(prev => applyScale(prev));
    }
    if (nudgeTarget === 'back' || nudgeTarget === 'both') {
      setBackCrop(prev => applyScale(prev));
    }
  };

  // RE-RUN AUTO-DETECT
  const autoDetectCardEdges = () => {
    if (!sourceImage) {
      applyCardPreset(cardType);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        autoDetectAndApplyCardMap(c, '', cardType);
      }
    };
    img.src = sourceImage;
  };

  // RENDER CROPPED CARDS AND COMPOSE MASTER SHEET FOR BROTHER T226
  useEffect(() => {
    if (!sourceImage && !separateFront) return;

    setIsProcessing(true);

    const processCrops = async () => {
      // Target Card Dimensions: Standard CR80 is 85.6mm x 53.98mm
      // At 300 DPI: 1012 px x 638 px
      const cardW = 1012;
      const cardH = 638;

      let frontCanvas: HTMLCanvasElement;
      let backCanvas: HTMLCanvasElement;

      if (uploadMode === 'separate_front_back' && separateFront) {
        // Render separate front image
        frontCanvas = document.createElement('canvas');
        frontCanvas.width = cardW;
        frontCanvas.height = cardH;
        const fCtx = frontCanvas.getContext('2d');
        const fImg = new Image();
        fImg.src = separateFront;
        await new Promise((r) => { fImg.onload = r; });
        fCtx?.drawImage(fImg, 0, 0, cardW, cardH);

        // Render separate back image (or duplicate front if back not uploaded yet)
        backCanvas = document.createElement('canvas');
        backCanvas.width = cardW;
        backCanvas.height = cardH;
        const bCtx = backCanvas.getContext('2d');
        if (separateBack) {
          const bImg = new Image();
          bImg.src = separateBack;
          await new Promise((r) => { bImg.onload = r; });
          bCtx?.drawImage(bImg, 0, 0, cardW, cardH);
        } else {
          bCtx?.drawImage(frontCanvas, 0, 0, cardW, cardH);
        }

      } else if (sourceImage) {
        // Crop from rotated single full scan
        const rawImg = new Image();
        rawImg.src = sourceImage;
        await new Promise((r) => { rawImg.onload = r; });

        // First apply any rotation to source
        let rotatedSource = rawImg;
        let sW = rawImg.width;
        let sH = rawImg.height;

        if (sourceRotation !== 0) {
          const rotCanvas = document.createElement('canvas');
          if (sourceRotation === 90 || sourceRotation === 270) {
            rotCanvas.width = sH;
            rotCanvas.height = sW;
          } else {
            rotCanvas.width = sW;
            rotCanvas.height = sH;
          }
          const rotCtx = rotCanvas.getContext('2d');
          if (rotCtx) {
            rotCtx.translate(rotCanvas.width / 2, rotCanvas.height / 2);
            rotCtx.rotate((sourceRotation * Math.PI) / 180);
            rotCtx.drawImage(rawImg, -sW / 2, -sH / 2);
            sW = rotCanvas.width;
            sH = rotCanvas.height;
            rotatedSource = rotCanvas as any;
          }
        }

        // CROP FRONT
        frontCanvas = document.createElement('canvas');
        frontCanvas.width = cardW;
        frontCanvas.height = cardH;
        const fCtx = frontCanvas.getContext('2d');

        const fCropX = (frontCrop.x / 100) * sW;
        const fCropY = (frontCrop.y / 100) * sH;
        const fCropW = (frontCrop.width / 100) * sW;
        const fCropH = (frontCrop.height / 100) * sH;

        if (fCtx) {
          fCtx.fillStyle = '#ffffff';
          fCtx.fillRect(0, 0, cardW, cardH);
          fCtx.drawImage(rotatedSource, fCropX, fCropY, fCropW, fCropH, 0, 0, cardW, cardH);
        }

        // CROP BACK
        backCanvas = document.createElement('canvas');
        backCanvas.width = cardW;
        backCanvas.height = cardH;
        const bCtx = backCanvas.getContext('2d');

        const bCropX = (backCrop.x / 100) * sW;
        const bCropY = (backCrop.y / 100) * sH;
        const bCropW = (backCrop.width / 100) * sW;
        const bCropH = (backCrop.height / 100) * sH;

        if (bCtx) {
          bCtx.fillStyle = '#ffffff';
          bCtx.fillRect(0, 0, cardW, cardH);
          bCtx.drawImage(rotatedSource, bCropX, bCropY, bCropW, bCropH, 0, 0, cardW, cardH);
        }
      } else {
        return;
      }

      setFrontCroppedUrl(frontCanvas.toDataURL('image/png'));
      setBackCroppedUrl(backCanvas.toDataURL('image/png'));

      // COMPOSE MASTER PRINT SHEET (Brother DCP-T226 Calibrated)
      let sheetW = 1800; // 4x6 landscape (6in x 4in @ 300dpi)
      let sheetH = 1200;

      if (sheetLayout === '4x6') {
        sheetW = 1800;
        sheetH = 1200;
      } else if (sheetLayout === 'A4_single' || sheetLayout === 'A4_batch_5') {
        sheetW = 2480; // A4 portrait @ 300dpi
        sheetH = 3508;
      } else if (sheetLayout === 'tray') {
        sheetW = 1800;
        sheetH = 1200;
      }

      const masterCanvas = document.createElement('canvas');
      masterCanvas.width = sheetW;
      masterCanvas.height = sheetH;
      const mCtx = masterCanvas.getContext('2d');
      if (!mCtx) return;

      // Clean white sheet background
      mCtx.fillStyle = '#ffffff';
      mCtx.fillRect(0, 0, sheetW, sheetH);

      // Apply Color & Contrast Filters for Brother T226 Ink Tank
      const filterStr = autoEnhance
        ? `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
        : 'none';
      mCtx.filter = filterStr;

      // Helper to draw a single card with optional mirror & crop ticks
      const drawCardOnSheet = (
        cardSrc: HTMLCanvasElement, 
        destX: number, 
        destY: number, 
        isBack: boolean
      ) => {
        mCtx.save();
        mCtx.translate(destX, destY);

        if (mirrorDragonSheet) {
          // Horizontal Flip for Dragon Sheet Thermal Lamination
          mCtx.scale(-1, 1);
          mCtx.drawImage(cardSrc, -cardW, 0, cardW, cardH);
        } else {
          mCtx.drawImage(cardSrc, 0, 0, cardW, cardH);
        }

        mCtx.restore();

        // Cutting crop marks
        if (showCropMarks) {
          mCtx.save();
          mCtx.strokeStyle = '#94a3b8';
          mCtx.lineWidth = 2;
          mCtx.setLineDash([6, 6]);

          const tick = 25;
          // Top-Left
          mCtx.beginPath();
          mCtx.moveTo(destX - tick, destY);
          mCtx.lineTo(destX, destY);
          mCtx.lineTo(destX, destY - tick);
          mCtx.stroke();

          // Top-Right
          mCtx.beginPath();
          mCtx.moveTo(destX + cardW + tick, destY);
          mCtx.lineTo(destX + cardW, destY);
          mCtx.lineTo(destX + cardW, destY - tick);
          mCtx.stroke();

          // Bottom-Left
          mCtx.beginPath();
          mCtx.moveTo(destX - tick, destY + cardH);
          mCtx.lineTo(destX, destY + cardH);
          mCtx.lineTo(destX, destY + cardH + tick);
          mCtx.stroke();

          // Bottom-Right
          mCtx.beginPath();
          mCtx.moveTo(destX + cardW + tick, destY + cardH);
          mCtx.lineTo(destX + cardW, destY + cardH);
          mCtx.lineTo(destX + cardW, destY + cardH + tick);
          mCtx.stroke();

          mCtx.restore();
        }
      };

      // LAYOUT STRATEGIES
      if (sheetLayout === '4x6') {
        const gapX = 40; // ~3.3mm folding gap
        const totalW = (cardW * 2) + gapX;
        const startX = Math.round((sheetW - totalW) / 2);
        const startY = Math.round((sheetH - cardH) / 2);

        // Draw Front & Back Side by Side
        drawCardOnSheet(frontCanvas, startX, startY, false);
        drawCardOnSheet(backCanvas, startX + cardW + gapX, startY, true);

        // Draw Center Folding Line
        if (showFoldLine) {
          const midX = startX + cardW + (gapX / 2);
          mCtx.save();
          mCtx.strokeStyle = '#cbd5e1';
          mCtx.lineWidth = 2;
          mCtx.setLineDash([8, 8]);
          mCtx.beginPath();
          mCtx.moveTo(midX, startY - 30);
          mCtx.lineTo(midX, startY + cardH + 30);
          mCtx.stroke();

          mCtx.fillStyle = '#64748b';
          mCtx.font = '20px sans-serif';
          mCtx.fillText('✂ Fold / Cut Line', midX - 55, startY - 40);
          mCtx.restore();
        }

      } else if (sheetLayout === 'A4_single') {
        const gapX = 60;
        const totalW = (cardW * 2) + gapX;
        const startX = Math.round((sheetW - totalW) / 2);
        const startY = 320; // 27mm from top margin for Brother T226 easy feed

        drawCardOnSheet(frontCanvas, startX, startY, false);
        drawCardOnSheet(backCanvas, startX + cardW + gapX, startY, true);

        if (showFoldLine) {
          const midX = startX + cardW + (gapX / 2);
          mCtx.save();
          mCtx.strokeStyle = '#cbd5e1';
          mCtx.lineWidth = 2;
          mCtx.setLineDash([8, 8]);
          mCtx.beginPath();
          mCtx.moveTo(midX, startY - 40);
          mCtx.lineTo(midX, startY + cardH + 40);
          mCtx.stroke();
          mCtx.restore();
        }

      } else if (sheetLayout === 'A4_batch_5') {
        // 5 cards stacked for Bulk Dragon Sheet
        const gapX = 80;
        const gapY = 50;
        const totalW = (cardW * 2) + gapX;
        const startX = Math.round((sheetW - totalW) / 2);
        const startY = 180;

        for (let i = 0; i < 5; i++) {
          const currentY = startY + i * (cardH + gapY);
          drawCardOnSheet(frontCanvas, startX, currentY, false);
          drawCardOnSheet(backCanvas, startX + cardW + gapX, currentY, true);
        }
      } else {
        const gapX = 40;
        const totalW = (cardW * 2) + gapX;
        const startX = Math.round((sheetW - totalW) / 2);
        const startY = Math.round((sheetH - cardH) / 2);

        drawCardOnSheet(frontCanvas, startX, startY, false);
        drawCardOnSheet(backCanvas, startX + cardW + gapX, startY, true);
      }

      // Metadata imprint for cyber cafe operator reference
      mCtx.save();
      mCtx.filter = 'none';
      mCtx.fillStyle = '#94a3b8';
      mCtx.font = '18px monospace';
      mCtx.fillText(
        `BROTHER DCP-T226 PVC ENGINE • AUTO-CROPPED CR80 (85.6x54mm) • ${mirrorDragonSheet ? 'MIRROR (DRAGON)' : 'NORMAL'} • 300 DPI`,
        50,
        sheetH - 30
      );
      mCtx.restore();

      setMasterSheetUrl(masterCanvas.toDataURL('image/png', 1.0));
      setIsProcessing(false);
    };

    processCrops();
  }, [
    sourceImage,
    separateFront,
    separateBack,
    uploadMode,
    sourceRotation,
    frontCrop,
    backCrop,
    sheetLayout,
    mirrorDragonSheet,
    showCropMarks,
    showFoldLine,
    brightness,
    contrast,
    saturation,
    autoEnhance
  ]);

  // DIRECT 1-CLICK PRINT HANDLER
  const handlePrint = () => {
    if (!masterSheetUrl) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const isA4 = sheetLayout === 'A4_single' || sheetLayout === 'A4_batch_5';
    const pageSizeCss = isA4 ? 'A4 portrait' : '6in 4in landscape';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Auto-Cropped PVC Card Print - Brother DCP-T226</title>
          <style>
            @page {
              size: ${pageSizeCss};
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            img {
              width: 100vw;
              height: 100vh;
              object-fit: contain;
              display: block;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <img src="${masterSheetUrl}" onload="window.print();window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // DOWNLOAD MASTER SHEET
  const handleDownloadSheet = () => {
    if (!masterSheetUrl) return;
    const a = document.createElement('a');
    a.href = masterSheetUrl;
    a.download = `AutoCropped_${cardType.toUpperCase()}_BrotherT226_${sheetLayout}_${mirrorDragonSheet ? 'Mirror' : 'Normal'}.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-emerald-950 via-teal-950 to-slate-950 text-white p-5 rounded-3xl border border-emerald-800/60 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-emerald-600/30 border border-emerald-400/40 rounded-2xl">
            <Scissors className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/30 text-[10px] font-bold text-emerald-200 uppercase tracking-widest">
                1-Click Auto Crop & Sizer
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/30 text-[10px] font-bold text-blue-200 uppercase">
                Brother DCP-T226 Ready
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              {language === 'bn' 
                ? 'সমস্ত কার্ড অটো ক্রপ ও সাইজিং প্রিন্ট স্টুডিও' 
                : 'Universal Card Auto-Crop & Smart Sizing Studio'}
            </h2>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              {language === 'bn'
                ? 'আধার, ভোটার, রেশন, আয়ুষ্মান, প্যান কার্ড অটোমেটিক সাইজ (CR80: 85.6 × 54 mm) ও ১-ক্লিক প্রিন্ট'
                : 'Instant auto-cropping and CR80 sizing for Aadhaar, Voter, Ration, Ayushman, PAN & All Cards'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDriverGuide(!showDriverGuide)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-700/50 text-xs font-bold text-emerald-200 transition cursor-pointer"
          >
            <Settings2 className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'প্রিন্টার টিপস' : 'Printer Tips'}</span>
          </button>
        </div>
      </div>

      {/* Driver Settings Guide Panel */}
      {showDriverGuide && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 space-y-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              {language === 'bn' ? 'Brother DCP-T226 সঠিক প্রিন্ট ও সাইজিং গাইড' : 'Brother DCP-T226 Accurate Sizing & Print Guide'}
            </h3>
            <button
              onClick={() => setShowDriverGuide(false)}
              className="text-emerald-800 dark:text-emerald-300 font-bold hover:underline"
            >
              ✕ {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60">
              <span className="font-bold text-slate-500 block text-[10px] uppercase">Standard Size:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">CR80 (85.60 × 53.98 mm) Wallet Size</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60">
              <span className="font-bold text-slate-500 block text-[10px] uppercase">Paper Size:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">4x6 Photo Glossy (Brother BP71GLA)</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60">
              <span className="font-bold text-slate-500 block text-[10px] uppercase">Dragon Sheet:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Auto Mirror ON (135°C - 145°C)</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60">
              <span className="font-bold text-slate-500 block text-[10px] uppercase">Print Scale:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">100% Actual Size (No fit to page)</span>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Detection Intelligence Banner */}
      {autoDetectResult && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 shadow-lg text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Scan className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {language === 'bn' ? 'অটো মাপ সনাক্তকরণ সক্রিয়' : 'Auto Map Active'}
                </span>
                <span className="text-xs font-black text-emerald-100">
                  {autoDetectResult.title}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 mt-1 font-mono">
                <span className="text-emerald-400 font-bold">
                  ✓ {autoDetectResult.dimensions}
                </span>
                <span className="text-slate-400 text-[11px]">
                  Front: ({frontCrop.x}%, {frontCrop.y}%) • Back: ({backCrop.x}%, {backCrop.y}%)
                </span>
              </div>
              {autoDetectResult.details && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {autoDetectResult.details}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={autoDetectCardEdges}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'পুনরায় অটো ম্যাপ' : 'Re-Detect Map'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Card Type 1-Click Preset Buttons */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            {language === 'bn' ? 'কার্ড ক্যাটাগরি ও অটো ক্রপ প্রিসেট নির্বাচন করুন' : 'Select Card Type & Auto-Crop Preset'}
          </label>
          <span className="text-[11px] text-slate-400">
            {language === 'bn' ? '১-ক্লিকে সঠিক সাইজে সেট হবে' : 'Sets exact dimensions automatically'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            type="button"
            onClick={() => loadSampleA4Scan('aadhaar')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
              cardType === 'aadhaar'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-950 dark:text-emerald-100 shadow-xs ring-1 ring-emerald-500/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-[11px] mb-2">
              UID
            </div>
            <div className="font-bold text-xs">
              {language === 'bn' ? 'আধার কার্ড' : 'Aadhaar Card'}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">UIDAI e-Aadhaar</div>
          </button>

          <button
            type="button"
            onClick={() => loadSampleA4Scan('voter')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
              cardType === 'voter'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-950 dark:text-emerald-100 shadow-xs ring-1 ring-emerald-500/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-[11px] mb-2">
              ECI
            </div>
            <div className="font-bold text-xs">
              {language === 'bn' ? 'ভোটার কার্ড' : 'Voter (e-EPIC)'}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">ECI Digital Card</div>
          </button>

          <button
            type="button"
            onClick={() => loadSampleA4Scan('ration')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
              cardType === 'ration'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-950 dark:text-emerald-100 shadow-xs ring-1 ring-emerald-500/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-[11px] mb-2">
              WBF
            </div>
            <div className="font-bold text-xs">
              {language === 'bn' ? 'ডিজিটাল রেশন' : 'Ration Card'}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">WB Food Dept</div>
          </button>

          <button
            type="button"
            onClick={() => loadSampleA4Scan('ayushman')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
              cardType === 'ayushman'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-950 dark:text-emerald-100 shadow-xs ring-1 ring-emerald-500/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-black text-[11px] mb-2">
              NHA
            </div>
            <div className="font-bold text-xs">
              {language === 'bn' ? 'আয়ুষ্মান ভারত' : 'Ayushman Card'}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">PM-JAY / ABHA</div>
          </button>

          <button
            type="button"
            onClick={() => loadSampleA4Scan('pan')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
              cardType === 'pan'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-950 dark:text-emerald-100 shadow-xs ring-1 ring-emerald-500/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-[11px] mb-2">
              PAN
            </div>
            <div className="font-bold text-xs">
              {language === 'bn' ? 'প্যান কার্ড' : 'e-PAN Card'}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">NSDL / UTIITSL</div>
          </button>

          <button
            type="button"
            onClick={() => applyCardPreset('custom')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
              cardType === 'custom'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-950 dark:text-emerald-100 shadow-xs ring-1 ring-emerald-500/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-slate-500/20 text-slate-600 dark:text-slate-400 flex items-center justify-center font-black text-[11px] mb-2">
              ID
            </div>
            <div className="font-bold text-xs">
              {language === 'bn' ? 'অন্যান্য / কাস্টম' : 'Custom / Others'}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Health, DL, Office</div>
          </button>
        </div>
      </div>

      {/* Main Grid: Crop Workspace (Left 6 cols) + Print Ready Sheet (Right 6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Upload and Interactive Cropper */}
        <div className="lg:col-span-6 space-y-5">
          {/* Upload Controls Box */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-emerald-600" />
                {language === 'bn' ? 'ডকুমেন্ট আপলোড করুন (PDF বা স্ক্যান JPG/PNG)' : 'Upload Document (PDF or Scan JPG/PNG)'}
              </h3>
              {sourceFileName && (
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 truncate max-w-[180px]">
                  {sourceFileName}
                </span>
              )}
            </div>

            {/* Upload Mode Selector */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setUploadMode('single_full_scan')}
                className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                  uploadMode === 'single_full_scan'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-600 text-emerald-900 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {language === 'bn' ? '১টি ফুল পেজ স্ক্যান / PDF' : 'Full Page Scan / PDF'}
              </button>

              <button
                type="button"
                onClick={() => setUploadMode('separate_front_back')}
                className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                  uploadMode === 'separate_front_back'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-600 text-emerald-900 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {language === 'bn' ? 'আলাদা ফ্রন্ট ও ব্যাক ছবি' : 'Separate Front & Back'}
              </button>
            </div>

            {/* Input Trigger */}
            {uploadMode === 'single_full_scan' ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,image/png,image/jpeg,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-2xl p-4 text-center cursor-pointer transition"
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-2 bg-emerald-600 text-white rounded-xl">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {language === 'bn' ? 'PDF বা স্ক্যান ফাইল সিলেক্ট করুন' : 'Click to Upload PDF or Image Scan'}
                      </div>
                      <div className="text-[10px] text-slate-500">e-Aadhaar, Voter, Ration, Ayushman PDF & Scans</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    ref={separateFrontInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleSeparateUpload(e.target.files[0], 'front')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => separateFrontInputRef.current?.click()}
                    className="w-full border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 text-center hover:border-emerald-500 transition cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {separateFront ? '✓ Front Added' : '+ Upload Front'}
                    </div>
                    <span className="text-[10px] text-slate-500">সামনের দিক</span>
                  </button>
                </div>

                <div>
                  <input
                    ref={separateBackInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleSeparateUpload(e.target.files[0], 'back')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => separateBackInputRef.current?.click()}
                    className="w-full border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 text-center hover:border-emerald-500 transition cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {separateBack ? '✓ Back Added' : '+ Upload Back'}
                    </div>
                    <span className="text-[10px] text-slate-500">বিপরীত দিক</span>
                  </button>
                </div>
              </div>
            )}

            {/* PDF Multi-Page Selector & Password Control */}
            {pendingPdfBuffer && (
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/60 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    PDF {language === 'bn' ? 'পৃষ্ঠা:' : 'Page:'} {selectedPdfPage} / {pdfPageCount}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {pdfPageCount > 1 && (
                    <>
                      <button
                        type="button"
                        disabled={selectedPdfPage <= 1 || isPdfLoading}
                        onClick={() => handleSwitchPdfPage(selectedPdfPage - 1)}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'পূর্বের' : 'Prev'}</span>
                      </button>
                      <button
                        type="button"
                        disabled={selectedPdfPage >= pdfPageCount || isPdfLoading}
                        onClick={() => handleSwitchPdfPage(selectedPdfPage + 1)}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <span>{language === 'bn' ? 'পরের' : 'Next'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(true)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}</span>
                  </button>
                </div>
              </div>
            )}

            {isPdfLoading && (
              <div className="flex items-center justify-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-800 dark:text-amber-300 text-xs font-bold animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{language === 'bn' ? 'উচ্চ রেজোলিউশনে PDF রেন্ডার হচ্ছে...' : 'Rendering High-DPI PDF document...'}</span>
              </div>
            )}
          </div>

          {/* Interactive Document Scan & Auto-Crop Visualizer */}
          {uploadMode === 'single_full_scan' && sourceImage && (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Crop className="w-4 h-4 text-emerald-600" />
                  {language === 'bn' ? 'অটো ক্রপ সিলেকশন বক্স' : 'Auto-Crop Position & Alignment'}
                </h3>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={rotateScan}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Rotate Scan 90 degrees"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>90°</span>
                  </button>

                  <button
                    type="button"
                    onClick={swapFrontBack}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Swap Front and Back Positions"
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" />
                    <span>Swap</span>
                  </button>

                  <button
                    type="button"
                    onClick={autoDetectCardEdges}
                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Reset to exact Card Preset"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Reset Crop</span>
                  </button>
                </div>
              </div>

              {/* Visual Crop Overlay Canvas / Container */}
              <div className="relative w-full aspect-[1/1.414] bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-inner flex items-center justify-center">
                <img
                  ref={sourceImageRef}
                  src={sourceImage}
                  alt="Source Scan"
                  className="w-full h-full object-contain select-none pointer-events-none"
                  style={{
                    transform: `rotate(${sourceRotation}deg)`
                  }}
                />

                {/* FRONT CROP BOX OVERLAY */}
                <div
                  style={{
                    left: `${frontCrop.x}%`,
                    top: `${frontCrop.y}%`,
                    width: `${frontCrop.width}%`,
                    height: `${frontCrop.height}%`
                  }}
                  className="absolute border-2 border-emerald-500 bg-emerald-500/20 rounded-md shadow-lg pointer-events-none flex items-start justify-start p-1"
                >
                  <span className="bg-emerald-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow-xs">
                    FRONT (85.6 × 54 mm)
                  </span>
                </div>

                {/* BACK CROP BOX OVERLAY */}
                <div
                  style={{
                    left: `${backCrop.x}%`,
                    top: `${backCrop.y}%`,
                    width: `${backCrop.width}%`,
                    height: `${backCrop.height}%`
                  }}
                  className="absolute border-2 border-blue-500 bg-blue-500/20 rounded-md shadow-lg pointer-events-none flex items-start justify-start p-1"
                >
                  <span className="bg-blue-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow-xs">
                    BACK (85.6 × 54 mm)
                  </span>
                </div>
              </div>

              {/* Manual Position Adjuster Sliders & Nudge D-Pad */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Crosshair className="w-4 h-4 text-emerald-600" />
                    {language === 'bn' ? 'কার্ড মাপ অ্যাডজাস্টমেন্ট ও নাজ কন্ট্রোল' : 'Card Map Fine-Tune & Nudge Controls'}
                  </span>
                  
                  {/* Nudge Target Selector */}
                  <div className="flex gap-1 bg-slate-200 dark:bg-slate-700 p-0.5 rounded-lg text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => { setNudgeTarget('both'); setActiveCropHandle('front'); }}
                      className={`px-2 py-1 rounded-md transition cursor-pointer ${
                        nudgeTarget === 'both'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      {language === 'bn' ? 'উভয় কার্ড (Both)' : 'Both Cards'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setNudgeTarget('front'); setActiveCropHandle('front'); }}
                      className={`px-2 py-1 rounded-md transition cursor-pointer ${
                        nudgeTarget === 'front'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      Front Card
                    </button>
                    <button
                      type="button"
                      onClick={() => { setNudgeTarget('back'); setActiveCropHandle('back'); }}
                      className={`px-2 py-1 rounded-md transition cursor-pointer ${
                        nudgeTarget === 'back'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      Back Card
                    </button>
                  </div>
                </div>

                {/* Micro Nudge D-Pad & Zoom Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200 dark:border-slate-700/60">
                  {/* D-Pad */}
                  <div className="flex flex-col items-center justify-center p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Move className="w-3 h-3 text-emerald-600" />
                      {language === 'bn' ? '১ মিমি সরান (Nudge 1mm)' : 'Direction Nudge (1mm)'}
                    </span>
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleNudge('up', 0.5)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 hover:text-emerald-600 border border-slate-300 dark:border-slate-700 transition cursor-pointer shadow-2xs"
                        title="Move Up 0.5%"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleNudge('left', 0.5)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 hover:text-emerald-600 border border-slate-300 dark:border-slate-700 transition cursor-pointer shadow-2xs"
                          title="Move Left 0.5%"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={autoDetectCardEdges}
                          className="px-2 py-1 text-[9px] font-black rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                          title="Reset to Auto Position"
                        >
                          AUTO
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNudge('right', 0.5)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 hover:text-emerald-600 border border-slate-300 dark:border-slate-700 transition cursor-pointer shadow-2xs"
                          title="Move Right 0.5%"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNudge('down', 0.5)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 hover:text-emerald-600 border border-slate-300 dark:border-slate-700 transition cursor-pointer shadow-2xs"
                        title="Move Down 0.5%"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Size Scale Controls */}
                  <div className="flex flex-col justify-center p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Maximize2 className="w-3 h-3 text-emerald-600" />
                      {language === 'bn' ? 'সাইজ জুম (CR80 লক)' : 'CR80 Size Adjust'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleScaleCrop(-0.4)}
                        className="flex-1 py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                        <span>-1%</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleScaleCrop(0.4)}
                        className="flex-1 py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+1%</span>
                      </button>
                    </div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold text-center">
                      🔒 85.60 mm × 53.98 mm Aspect Ratio Locked
                    </div>
                  </div>
                </div>

                {/* Slider Sliders */}
                {activeCropHandle === 'front' ? (
                  <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
                    <div>
                      <div className="flex justify-between text-slate-500 mb-1">
                        <span>Front Y (Top):</span>
                        <span className="font-mono">{frontCrop.y}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="80"
                        step="0.2"
                        value={frontCrop.y}
                        onChange={(e) => setFrontCrop({ ...frontCrop, y: parseFloat(e.target.value) })}
                        className="w-full accent-emerald-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-500 mb-1">
                        <span>Front X (Left):</span>
                        <span className="font-mono">{frontCrop.x}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="60"
                        step="0.2"
                        value={frontCrop.x}
                        onChange={(e) => setFrontCrop({ ...frontCrop, x: parseFloat(e.target.value) })}
                        className="w-full accent-emerald-600"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
                    <div>
                      <div className="flex justify-between text-slate-500 mb-1">
                        <span>Back Y (Top):</span>
                        <span className="font-mono">{backCrop.y}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="80"
                        step="0.2"
                        value={backCrop.y}
                        onChange={(e) => setBackCrop({ ...backCrop, y: parseFloat(e.target.value) })}
                        className="w-full accent-blue-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-500 mb-1">
                        <span>Back X (Left):</span>
                        <span className="font-mono">{backCrop.x}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="60"
                        step="0.2"
                        value={backCrop.x}
                        onChange={(e) => setBackCrop({ ...backCrop, x: parseFloat(e.target.value) })}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Brother T226 Color Enhancer & Brightness Box */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {language === 'bn' ? 'Brother T226 প্রিন্ট কোয়ালিটি বুস্টার' : 'Brother T226 Color & QR Sharpener'}
              </h3>
              <label className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoEnhance}
                  onChange={(e) => setAutoEnhance(e.target.checked)}
                  className="accent-emerald-600"
                />
                <span>Auto Enhance</span>
              </label>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Contrast:</span>
                  <span className="font-mono">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="130"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  disabled={!autoEnhance}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Brightness:</span>
                  <span className="font-mono">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="120"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  disabled={!autoEnhance}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Saturation:</span>
                  <span className="font-mono">{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="140"
                  value={saturation}
                  onChange={(e) => setSaturation(parseInt(e.target.value))}
                  disabled={!autoEnhance}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Print Ready Master Sheet & Quick Actions (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Print Layout Config */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              {language === 'bn' ? 'প্রিন্ট পেপার ও ল্যামিনেশন লেআউট' : 'Print Paper Layout & Sizing'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'bn' ? 'পেপার সাইজ' : 'Paper Sheet Size'}
                </label>
                <select
                  value={sheetLayout}
                  onChange={(e) => setSheetLayout(e.target.value as SheetLayout)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="4x6">4x6 Photo Glossy (Brother BP71GLA) - Recommended</option>
                  <option value="A4_single">A4 Sheet - Single Card Top Centered (Easy Feed)</option>
                  <option value="A4_batch_5">A4 Dragon Sheet - 5 Cards Batch (10 Sides Bulk)</option>
                  <option value="tray">PVC Tray (2-Up Direct Carrier)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'bn' ? 'ড্রাগন শিট মিরর প্রিন্ট' : 'Dragon Sheet Thermal Lamination'}
                </label>
                <button
                  type="button"
                  onClick={() => setMirrorDragonSheet(!mirrorDragonSheet)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    mirrorDragonSheet
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-600 text-emerald-900 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <FlipHorizontal className="w-4 h-4 text-emerald-600" />
                  <span>{mirrorDragonSheet ? '✓ Mirror Inverted (Dragon)' : 'Normal Non-Mirror (Pouch)'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCropMarks}
                  onChange={(e) => setShowCropMarks(e.target.checked)}
                  className="accent-emerald-600"
                />
                <span>কাটিং ক্রপ মার্ক (Crop Marks)</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFoldLine}
                  onChange={(e) => setShowFoldLine(e.target.checked)}
                  className="accent-emerald-600"
                />
                <span>মাঝখানের ভাঁজ দাগ (Fold Line)</span>
              </label>
            </div>
          </div>

          {/* Master Live Sheet Preview Canvas */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-emerald-600" />
                {language === 'bn' ? 'প্রিন্ট-রেডি লাইভ শিট প্রিভিউ (300 DPI)' : 'Print-Ready Master Sheet (300 DPI)'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                CR80: 85.6 × 54 mm
              </span>
            </div>

            {/* Rendered Preview Box */}
            <div className="w-full bg-slate-950 p-4 rounded-xl flex items-center justify-center border border-slate-800 shadow-inner min-h-[220px]">
              {masterSheetUrl ? (
                <img
                  src={masterSheetUrl}
                  alt="Rendered Master Sheet"
                  className="max-h-[300px] w-auto max-w-full object-contain rounded shadow-2xl border border-slate-700"
                />
              ) : (
                <div className="text-slate-500 text-xs flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Preparing print sheet...</span>
                </div>
              )}
            </div>

            {/* Individual Cropped Cards Check */}
            {frontCroppedUrl && backCroppedUrl && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">FRONT PREVIEW</span>
                  <img src={frontCroppedUrl} alt="Front Cropped" className="w-full h-auto rounded border border-slate-300 dark:border-slate-600 shadow-xs" />
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">BACK PREVIEW</span>
                  <img src={backCroppedUrl} alt="Back Cropped" className="w-full h-auto rounded border border-slate-300 dark:border-slate-600 shadow-xs" />
                </div>
              </div>
            )}

            {/* Print & Download Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrint}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Printer className="w-5 h-5" />
                <span>{language === 'bn' ? 'সরাসরি প্রিন্ট করুন (1-Click)' : 'Print on Brother T226'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSheet}
                className="w-full py-3.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Download className="w-5 h-5 text-emerald-600" />
                <span>{language === 'bn' ? 'PNG শিট ডাউনলোড' : 'Download 300 DPI PNG'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Unlock Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {language === 'bn' ? 'সুরক্ষিত PDF পাসওয়ার্ড দিন' : 'Unlock Password-Protected PDF'}
                  </h3>
                  <p className="text-xs text-slate-500 truncate max-w-[220px]">
                    {sourceFileName || 'Encrypted Document'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Error Message */}
            {pdfPasswordError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pdfPasswordError}</span>
              </div>
            )}

            <form onSubmit={handleUnlockPdf} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'bn' ? 'ডকুমেন্ট পাসওয়ার্ড' : 'Document Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    value={pdfPassword}
                    onChange={(e) => setPdfPassword(e.target.value)}
                    placeholder={language === 'bn' ? 'পাসওয়ার্ড লিখুন...' : 'Enter PDF password...'}
                    autoFocus
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Helpers */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? 'সাধারণ পাসওয়ার্ড নিয়মাবলী:' : 'Common Password Formats:'}</span>
                </div>
                <div className="space-y-1 pl-4 text-slate-500 dark:text-slate-400">
                  <p>
                    <span className="font-bold text-slate-700 dark:text-slate-300">e-Aadhaar:</span>{' '}
                    {language === 'bn'
                      ? 'নামের প্রথম ৪ অক্ষর বড়হাতে (CAPITAL) + জন্মের সাল (যেমন: SUBH1996)'
                      : 'First 4 letters of name in CAPITAL + Birth Year (e.g. SUBH1996)'}
                  </p>
                  <p>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Voter / Bank / PAN:</span>{' '}
                    {language === 'bn'
                      ? 'PAN নম্বর অথবা জন্মতারিখ (DDMMYYYY)'
                      : 'PAN Number or Date of Birth (DDMMYYYY)'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="w-1/2 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isPdfLoading || !pdfPassword.trim()}
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {isPdfLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{language === 'bn' ? 'আনলক হচ্ছে...' : 'Unlocking...'}</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'আনলক ও খুলুন' : 'Unlock & Open'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
