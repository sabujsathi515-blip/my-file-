import React, { useState, useRef, useEffect } from 'react';
import { 
  CreditCard, 
  Upload, 
  Printer, 
  Download, 
  Settings2, 
  Sliders, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  FlipHorizontal, 
  RotateCw, 
  FileText, 
  Image as ImageIcon, 
  ShieldCheck, 
  HelpCircle, 
  RefreshCw, 
  Eye, 
  Maximize2,
  Minimize2,
  Info,
  Check,
  Zap,
  Scissors
} from 'lucide-react';
import { Language } from '../../types';

export type CardType = 'aadhaar' | 'voter' | 'ration' | 'custom';
export type SheetSize = '4x6' | 'A4_single' | 'A4_batch_5' | 'tray';
export type PvcMethod = 'dragon_sheet_mirror' | 'pouch_laminating' | 'direct_inkjet_tray';

export const PvcCardPrintTool: React.FC<{ language: Language }> = ({ language }) => {
  // Main Configuration States
  const [cardType, setCardType] = useState<CardType>('aadhaar');
  const [sheetSize, setSheetSize] = useState<SheetSize>('4x6');
  const [pvcMethod, setPvcMethod] = useState<PvcMethod>('dragon_sheet_mirror');
  const [mirrorPrint, setMirrorPrint] = useState<boolean>(true); // default true for dragon sheet
  const [showCropMarks, setShowCropMarks] = useState<boolean>(true);
  const [showFoldLine, setShowFoldLine] = useState<boolean>(true);
  const [bleedMm, setBleedMm] = useState<number>(1.5);
  const [roundedCorners, setRoundedCorners] = useState<boolean>(true);

  // Image Uploads for Front and Back
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);

  // Enhancement controls for Brother DCP-T226 Ink Tank
  const [brightness, setBrightness] = useState<number>(102); // +2% for ink tank vibrancy
  const [contrast, setContrast] = useState<number>(105);   // +5% for crisp text
  const [saturation, setSaturation] = useState<number>(110); // vivid CMYK
  const [sharpnessPreset, setSharpnessPreset] = useState<'vivid_cmyk' | 'deep_black_qr' | 'standard'>('vivid_cmyk');

  // Interactive Card Template Data (if generating from template)
  const [useTemplateMode, setUseTemplateMode] = useState<boolean>(false);

  // Aadhaar template state
  const [aadhaarName, setAadhaarName] = useState('SUBHAM SAMANTA');
  const [aadhaarNumber, setAadhaarNumber] = useState('9841 5623 8812');
  const [aadhaarDob, setAadhaarDob] = useState('14/08/1996');
  const [aadhaarGender, setAadhaarGender] = useState('MALE / পুরুষ');
  const [aadhaarAddress, setAadhaarAddress] = useState('S/O: Manoranjan Samanta, Vill+PO: Sreerampur, PS: Tamluk, Purba Medinipur, West Bengal - 721651');
  const [maskAadhaar, setMaskAadhaar] = useState<boolean>(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  // Voter template state
  const [voterEpic, setVoterEpic] = useState('WB/21/142/089142');
  const [voterName, setVoterName] = useState('RIMA DAS');
  const [voterRelationName, setVoterRelationName] = useState('PRADIP DAS');
  const [voterGender, setVoterGender] = useState('FEMALE / মহিলা');
  const [voterDob, setVoterDob] = useState('02/11/1998');
  const [voterAcNo, setVoterAcNo] = useState('203 - Tamluk');
  const [voterAddress, setVoterAddress] = useState('House No 42, Sreerampur, PS: Tamluk, Purba Medinipur - 721651');

  // Ration template state
  const [rationCat, setRationCat] = useState<'SPHH' | 'PHH' | 'AAY' | 'RKSY-I' | 'RKSY-II'>('SPHH');
  const [rationNo, setRationNo] = useState('1098234512');
  const [rationName, setRationName] = useState('AMIT MAITY');
  const [rationFhName, setRationFhName] = useState('BANKIM MAITY');
  const [rationFps, setRationFps] = useState('Tamluk Central F.P.S (MR-7842)');
  const [rationAadhaarLinked, setRationAadhaarLinked] = useState<boolean>(true);

  // UI state
  const [showDriverGuide, setShowDriverGuide] = useState<boolean>(false);
  const [renderedSheetUrl, setRenderedSheetUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frontInputRef = useRef<HTMLInputElement | null>(null);
  const backInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  // Auto set mirror print according to PVC method
  const handlePvcMethodChange = (method: PvcMethod) => {
    setPvcMethod(method);
    if (method === 'dragon_sheet_mirror') {
      setMirrorPrint(true);
    } else {
      setMirrorPrint(false);
    }
  };

  // Helper to load sample data for instant preview
  const handleLoadSample = () => {
    setUseTemplateMode(true);
    if (cardType === 'aadhaar') {
      setAadhaarName('SUBHAM SAMANTA');
      setAadhaarNumber('9841 5623 8812');
      setAadhaarDob('14/08/1996');
      setAadhaarGender('MALE / পুরুষ');
      setAadhaarAddress('S/O: Manoranjan Samanta, Vill+PO: Sreerampur, PS: Tamluk, Purba Medinipur, West Bengal - 721651');
    } else if (cardType === 'voter') {
      setVoterEpic('WB/21/142/089142');
      setVoterName('RIMA DAS');
      setVoterRelationName('PRADIP DAS');
      setVoterGender('FEMALE / মহিলা');
      setVoterDob('02/11/1998');
      setVoterAcNo('203 - Tamluk AC');
      setVoterAddress('House No 42, Sreerampur, PS: Tamluk, Purba Medinipur, West Bengal - 721651');
    } else if (cardType === 'ration') {
      setRationCat('SPHH');
      setRationNo('1098234512');
      setRationName('AMIT MAITY');
      setRationFhName('BANKIM MAITY');
      setRationFps('Sreerampur Fair Price Shop (Code: MR-8941)');
      setRationAadhaarLinked(true);
    }
  };

  // Handle image files
  const handleImageUpload = (file: File, target: 'front' | 'back' | 'photo') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      if (target === 'front') {
        setFrontImage(res);
        setUseTemplateMode(false);
      } else if (target === 'back') {
        setBackImage(res);
        setUseTemplateMode(false);
      } else if (target === 'photo') {
        setUserPhoto(res);
      }
    };
    reader.readAsDataURL(file);
  };

  // DRAW FRONT CARD TO TEMPORARY CANVAS
  const drawFrontCard = (widthPx: number, heightPx: number): HTMLCanvasElement => {
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = widthPx;
    cardCanvas.height = heightPx;
    const ctx = cardCanvas.getContext('2d');
    if (!ctx) return cardCanvas;

    // Base background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, widthPx, heightPx);

    if (!useTemplateMode && frontImage) {
      // Draw user uploaded image
      const img = new Image();
      img.src = frontImage;
      ctx.drawImage(img, 0, 0, widthPx, heightPx);
      return cardCanvas;
    }

    // DRAW TEMPLATES
    if (cardType === 'aadhaar') {
      // Aadhaar Front Template Design
      // Top Tricolor stripe
      const grad = ctx.createLinearGradient(0, 0, widthPx, 0);
      grad.addColorStop(0, '#ff9933');
      grad.addColorStop(0.5, '#ffffff');
      grad.addColorStop(1, '#138808');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, widthPx, heightPx * 0.08);

      // Govt Emblem & Header
      ctx.fillStyle = '#0f172a';
      ctx.font = `bold ${Math.round(heightPx * 0.045)}px sans-serif`;
      ctx.fillText('Government of India / ভারত সরকার', widthPx * 0.18, heightPx * 0.15);
      ctx.font = `${Math.round(heightPx * 0.035)}px sans-serif`;
      ctx.fillStyle = '#475569';
      ctx.fillText('Unique Identification Authority of India', widthPx * 0.18, heightPx * 0.20);

      // Emblem placeholder circle
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.arc(widthPx * 0.09, heightPx * 0.16, widthPx * 0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(heightPx * 0.03)}px sans-serif`;
      ctx.fillText('UID', widthPx * 0.065, heightPx * 0.17);

      // User Photo Box
      const photoW = widthPx * 0.28;
      const photoH = heightPx * 0.52;
      const photoX = widthPx * 0.06;
      const photoY = heightPx * 0.28;

      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(photoX, photoY, photoW, photoH);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.strokeRect(photoX, photoY, photoW, photoH);

      if (userPhoto) {
        const pImg = new Image();
        pImg.src = userPhoto;
        ctx.drawImage(pImg, photoX, photoY, photoW, photoH);
      } else {
        ctx.fillStyle = '#64748b';
        ctx.font = `${Math.round(heightPx * 0.04)}px sans-serif`;
        ctx.fillText('PHOTO', photoX + photoW * 0.2, photoY + photoH * 0.55);
      }

      // Aadhaar Details
      const textX = widthPx * 0.38;
      ctx.fillStyle = '#0f172a';
      ctx.font = `bold ${Math.round(heightPx * 0.052)}px sans-serif`;
      ctx.fillText(aadhaarName, textX, heightPx * 0.35);

      ctx.font = `${Math.round(heightPx * 0.042)}px sans-serif`;
      ctx.fillStyle = '#334155';
      ctx.fillText(`জন্ম তারিখ / DOB: ${aadhaarDob}`, textX, heightPx * 0.44);
      ctx.fillText(`লিঙ্গ / Gender: ${aadhaarGender}`, textX, heightPx * 0.52);

      // UIDAI Hologram Area
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#cbd5e1';
      ctx.fillRect(widthPx * 0.78, heightPx * 0.58, widthPx * 0.16, heightPx * 0.22);
      ctx.strokeRect(widthPx * 0.78, heightPx * 0.58, widthPx * 0.16, heightPx * 0.22);
      ctx.fillStyle = '#0284c7';
      ctx.font = `bold ${Math.round(heightPx * 0.03)}px sans-serif`;
      ctx.fillText('HOLOGRAM', widthPx * 0.79, heightPx * 0.70);

      // Red Line Divider
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(widthPx * 0.06, heightPx * 0.83);
      ctx.lineTo(widthPx * 0.94, heightPx * 0.83);
      ctx.stroke();

      // Aadhaar Number (Large High-Contrast)
      ctx.fillStyle = '#0f172a';
      ctx.font = `bold ${Math.round(heightPx * 0.075)}px monospace`;
      const displayNum = maskAadhaar 
        ? `XXXX XXXX ${aadhaarNumber.slice(-4)}` 
        : aadhaarNumber;
      ctx.fillText(displayNum, widthPx * 0.20, heightPx * 0.92);

      // Bottom tagline
      ctx.font = `bold ${Math.round(heightPx * 0.035)}px sans-serif`;
      ctx.fillStyle = '#dc2626';
      ctx.fillText('আমার আধার, আমার পরিচয়', widthPx * 0.35, heightPx * 0.98);

    } else if (cardType === 'voter') {
      // Voter Front Template (ECI e-EPIC)
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(0, 0, widthPx, heightPx * 0.14);

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(heightPx * 0.045)}px sans-serif`;
      ctx.fillText('ELECTION COMMISSION OF INDIA', widthPx * 0.12, heightPx * 0.065);
      ctx.font = `${Math.round(heightPx * 0.035)}px sans-serif`;
      ctx.fillText('ভারতের নির্বাচন কমিশন • IDENTITY CARD', widthPx * 0.18, heightPx * 0.11);

      // EPIC Number Badge
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.fillRect(widthPx * 0.06, heightPx * 0.17, widthPx * 0.50, heightPx * 0.08);
      ctx.strokeRect(widthPx * 0.06, heightPx * 0.17, widthPx * 0.50, heightPx * 0.08);
      ctx.fillStyle = '#1e3a8a';
      ctx.font = `bold ${Math.round(heightPx * 0.05)}px monospace`;
      ctx.fillText(voterEpic, widthPx * 0.08, heightPx * 0.23);

      // Photo
      const photoW = widthPx * 0.30;
      const photoH = heightPx * 0.56;
      const photoX = widthPx * 0.06;
      const photoY = heightPx * 0.28;

      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(photoX, photoY, photoW, photoH);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.strokeRect(photoX, photoY, photoW, photoH);

      if (userPhoto) {
        const pImg = new Image();
        pImg.src = userPhoto;
        ctx.drawImage(pImg, photoX, photoY, photoW, photoH);
      } else {
        ctx.fillStyle = '#64748b';
        ctx.font = `${Math.round(heightPx * 0.04)}px sans-serif`;
        ctx.fillText('PHOTO', photoX + photoW * 0.2, photoY + photoH * 0.55);
      }

      // Details
      const textX = widthPx * 0.40;
      ctx.fillStyle = '#0f172a';
      ctx.font = `bold ${Math.round(heightPx * 0.045)}px sans-serif`;
      ctx.fillText(`নাম / Name:`, textX, heightPx * 0.32);
      ctx.font = `bold ${Math.round(heightPx * 0.052)}px sans-serif`;
      ctx.fillText(voterName, textX, heightPx * 0.38);

      ctx.font = `bold ${Math.round(heightPx * 0.042)}px sans-serif`;
      ctx.fillStyle = '#334155';
      ctx.fillText(`পিতা/স্বামীর নাম:`, textX, heightPx * 0.47);
      ctx.font = `bold ${Math.round(heightPx * 0.048)}px sans-serif`;
      ctx.fillText(voterRelationName, textX, heightPx * 0.53);

      ctx.font = `${Math.round(heightPx * 0.042)}px sans-serif`;
      ctx.fillText(`লিঙ্গ / Gender: ${voterGender}`, textX, heightPx * 0.63);
      ctx.fillText(`জন্ম তারিখ / DOB: ${voterDob}`, textX, heightPx * 0.71);

      // Hologram & Security Stamp
      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = '#eab308';
      ctx.fillRect(widthPx * 0.72, heightPx * 0.76, widthPx * 0.22, heightPx * 0.16);
      ctx.strokeRect(widthPx * 0.72, heightPx * 0.76, widthPx * 0.22, heightPx * 0.16);
      ctx.fillStyle = '#854d0e';
      ctx.font = `bold ${Math.round(heightPx * 0.03)}px sans-serif`;
      ctx.fillText('ECI HOLOGRAM', widthPx * 0.73, heightPx * 0.86);

      // Bottom Bar
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(0, heightPx * 0.94, widthPx, heightPx * 0.06);

    } else if (cardType === 'ration') {
      // West Bengal Digital Ration Card Front
      const headerColor = rationCat === 'SPHH' ? '#15803d' : rationCat === 'AAY' ? '#b91c1c' : '#0369a1';
      ctx.fillStyle = headerColor;
      ctx.fillRect(0, 0, widthPx, heightPx * 0.18);

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(heightPx * 0.045)}px sans-serif`;
      ctx.fillText('GOVT. OF WEST BENGAL • খাদ্য ও সরবরাহ দপ্তর', widthPx * 0.08, heightPx * 0.07);
      ctx.font = `bold ${Math.round(heightPx * 0.040)}px sans-serif`;
      ctx.fillText(`DIGITAL RATION CARD (${rationCat})`, widthPx * 0.08, heightPx * 0.13);

      // Category Pill
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(widthPx * 0.75, heightPx * 0.03, widthPx * 0.20, heightPx * 0.12);
      ctx.fillStyle = headerColor;
      ctx.font = `bold ${Math.round(heightPx * 0.06)}px sans-serif`;
      ctx.fillText(rationCat, widthPx * 0.77, heightPx * 0.11);

      // Photo
      const photoW = widthPx * 0.28;
      const photoH = heightPx * 0.52;
      const photoX = widthPx * 0.06;
      const photoY = heightPx * 0.24;

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(photoX, photoY, photoW, photoH);
      ctx.strokeStyle = '#94a3b8';
      ctx.strokeRect(photoX, photoY, photoW, photoH);

      if (userPhoto) {
        const pImg = new Image();
        pImg.src = userPhoto;
        ctx.drawImage(pImg, photoX, photoY, photoW, photoH);
      } else {
        ctx.fillStyle = '#64748b';
        ctx.font = `${Math.round(heightPx * 0.04)}px sans-serif`;
        ctx.fillText('PHOTO', photoX + photoW * 0.2, photoY + photoH * 0.55);
      }

      // Details
      const textX = widthPx * 0.38;
      ctx.fillStyle = '#0f172a';
      ctx.font = `bold ${Math.round(heightPx * 0.045)}px sans-serif`;
      ctx.fillText(`কার্ড নং / Card No:`, textX, heightPx * 0.28);
      ctx.font = `bold ${Math.round(heightPx * 0.060)}px monospace`;
      ctx.fillStyle = headerColor;
      ctx.fillText(rationNo, textX, heightPx * 0.35);

      ctx.fillStyle = '#0f172a';
      ctx.font = `bold ${Math.round(heightPx * 0.045)}px sans-serif`;
      ctx.fillText(`কার্ডধারীর নাম:`, textX, heightPx * 0.44);
      ctx.font = `bold ${Math.round(heightPx * 0.052)}px sans-serif`;
      ctx.fillText(rationName, textX, heightPx * 0.51);

      ctx.font = `${Math.round(heightPx * 0.042)}px sans-serif`;
      ctx.fillStyle = '#334155';
      ctx.fillText(`পিতা/স্বামীর নাম: ${rationFhName}`, textX, heightPx * 0.60);
      ctx.fillText(`FPS: ${rationFps.slice(0, 22)}...`, textX, heightPx * 0.68);

      // Aadhaar Seeding Badge
      ctx.fillStyle = rationAadhaarLinked ? '#dcfce7' : '#fee2e2';
      ctx.strokeStyle = rationAadhaarLinked ? '#22c55e' : '#ef4444';
      ctx.fillRect(widthPx * 0.06, heightPx * 0.80, widthPx * 0.88, heightPx * 0.09);
      ctx.strokeRect(widthPx * 0.06, heightPx * 0.80, widthPx * 0.88, heightPx * 0.09);
      ctx.fillStyle = rationAadhaarLinked ? '#15803d' : '#b91c1c';
      ctx.font = `bold ${Math.round(heightPx * 0.038)}px sans-serif`;
      ctx.fillText(
        rationAadhaarLinked ? '✓ Aadhaar & Mobile Seeded / আধার ও মোবাইল লিঙ্কযুক্ত' : '✗ Aadhaar Not Seeded',
        widthPx * 0.10,
        heightPx * 0.86
      );

      // Bottom Helpline
      ctx.fillStyle = '#475569';
      ctx.font = `${Math.round(heightPx * 0.032)}px sans-serif`;
      ctx.fillText('Helpline: 1967 / 1800-345-5505 • food.wb.gov.in', widthPx * 0.20, heightPx * 0.96);

    } else {
      // Custom Card Template
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, widthPx, heightPx * 0.16);
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(heightPx * 0.05)}px sans-serif`;
      ctx.fillText('IDENTITY CARD / পরিচয়পত্র', widthPx * 0.25, heightPx * 0.10);

      // Center instructions
      ctx.fillStyle = '#64748b';
      ctx.font = `${Math.round(heightPx * 0.045)}px sans-serif`;
      ctx.fillText('Upload custom front image or use form', widthPx * 0.18, heightPx * 0.50);
    }

    return cardCanvas;
  };

  // DRAW BACK CARD TO TEMPORARY CANVAS
  const drawBackCard = (widthPx: number, heightPx: number): HTMLCanvasElement => {
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = widthPx;
    cardCanvas.height = heightPx;
    const ctx = cardCanvas.getContext('2d');
    if (!ctx) return cardCanvas;

    // Base background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, widthPx, heightPx);

    if (!useTemplateMode && backImage) {
      const img = new Image();
      img.src = backImage;
      ctx.drawImage(img, 0, 0, widthPx, heightPx);
      return cardCanvas;
    }

    if (cardType === 'aadhaar') {
      // Aadhaar Back Template
      // Top Tricolor stripe
      const grad = ctx.createLinearGradient(0, 0, widthPx, 0);
      grad.addColorStop(0, '#ff9933');
      grad.addColorStop(0.5, '#ffffff');
      grad.addColorStop(1, '#138808');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, widthPx, heightPx * 0.08);

      // Address Header
      ctx.fillStyle = '#0f172a';
      ctx.font = `bold ${Math.round(heightPx * 0.045)}px sans-serif`;
      ctx.fillText('ঠিকানা / Address:', widthPx * 0.06, heightPx * 0.17);

      // Multiline Address text
      ctx.font = `${Math.round(heightPx * 0.040)}px sans-serif`;
      ctx.fillStyle = '#334155';
      const words = aadhaarAddress.split(' ');
      let line = '';
      let lineY = heightPx * 0.25;
      const maxW = widthPx * 0.58;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxW && i > 0) {
          ctx.fillText(line, widthPx * 0.06, lineY);
          line = words[i] + ' ';
          lineY += heightPx * 0.065;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, widthPx * 0.06, lineY);

      // High-res QR Code Box on right
      const qrSize = heightPx * 0.50;
      const qrX = widthPx * 0.68;
      const qrY = heightPx * 0.20;

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);

      // Fake QR pattern
      ctx.fillStyle = '#0f172a';
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if ((r + c) % 2 === 0 || (r === 0 && c === 0) || (r === 7 && c === 7)) {
            ctx.fillRect(qrX + c * (qrSize / 8) + 4, qrY + r * (qrSize / 8) + 4, qrSize / 10, qrSize / 10);
          }
        }
      }
      ctx.font = `bold ${Math.round(heightPx * 0.028)}px sans-serif`;
      ctx.fillStyle = '#0284c7';
      ctx.fillText('SECURE QR', qrX + qrSize * 0.15, qrY + qrSize + heightPx * 0.05);

      // Divider
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(widthPx * 0.06, heightPx * 0.83);
      ctx.lineTo(widthPx * 0.94, heightPx * 0.83);
      ctx.stroke();

      // Aadhaar Number
      ctx.fillStyle = '#0f172a';
      ctx.font = `bold ${Math.round(heightPx * 0.075)}px monospace`;
      const displayNum = maskAadhaar ? `XXXX XXXX ${aadhaarNumber.slice(-4)}` : aadhaarNumber;
      ctx.fillText(displayNum, widthPx * 0.20, heightPx * 0.92);

      // Bottom info
      ctx.font = `${Math.round(heightPx * 0.032)}px sans-serif`;
      ctx.fillStyle = '#64748b';
      ctx.fillText('1947 • help@uidai.gov.in • www.uidai.gov.in', widthPx * 0.22, heightPx * 0.98);

    } else if (cardType === 'voter') {
      // Voter Back Template
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, widthPx, heightPx);

      ctx.fillStyle = '#1e3a8a';
      ctx.font = `bold ${Math.round(heightPx * 0.045)}px sans-serif`;
      ctx.fillText('ঠিকানা / Address:', widthPx * 0.06, heightPx * 0.12);

      ctx.font = `${Math.round(heightPx * 0.040)}px sans-serif`;
      ctx.fillStyle = '#334155';
      ctx.fillText(voterAddress, widthPx * 0.06, heightPx * 0.20);

      ctx.fillStyle = '#1e3a8a';
      ctx.font = `bold ${Math.round(heightPx * 0.045)}px sans-serif`;
      ctx.fillText(`বিধানসভা কেন্দ্র / Assembly Constituency:`, widthPx * 0.06, heightPx * 0.36);
      ctx.font = `bold ${Math.round(heightPx * 0.048)}px sans-serif`;
      ctx.fillStyle = '#0f172a';
      ctx.fillText(voterAcNo, widthPx * 0.06, heightPx * 0.44);

      // Electoral Officer Stamp & Signature box
      ctx.strokeStyle = '#94a3b8';
      ctx.strokeRect(widthPx * 0.55, heightPx * 0.55, widthPx * 0.38, heightPx * 0.32);
      ctx.fillStyle = '#475569';
      ctx.font = `bold ${Math.round(heightPx * 0.032)}px sans-serif`;
      ctx.fillText('Electoral Registration Officer', widthPx * 0.57, heightPx * 0.82);
      ctx.font = `${Math.round(heightPx * 0.028)}px sans-serif`;
      ctx.fillText('নির্বাচন নিবন্ধক আধিকারিক', widthPx * 0.60, heightPx * 0.86);

      // Barcode
      ctx.fillStyle = '#0f172a';
      for (let i = 0; i < 40; i++) {
        const w = (i % 3 === 0) ? 4 : 2;
        ctx.fillRect(widthPx * 0.06 + i * 8, heightPx * 0.58, w, heightPx * 0.22);
      }
      ctx.font = `bold ${Math.round(heightPx * 0.035)}px monospace`;
      ctx.fillText(voterEpic, widthPx * 0.08, heightPx * 0.86);

      // Bottom Bar
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(0, heightPx * 0.94, widthPx, heightPx * 0.06);

    } else if (cardType === 'ration') {
      // Ration Back Template
      ctx.fillStyle = '#0f172a';
      ctx.font = `bold ${Math.round(heightPx * 0.045)}px sans-serif`;
      ctx.fillText('নিয়মাবলী ও খাদ্য প্রাপ্যতা শর্তাবলী:', widthPx * 0.06, heightPx * 0.12);

      ctx.font = `${Math.round(heightPx * 0.038)}px sans-serif`;
      ctx.fillStyle = '#334155';
      ctx.fillText('১. এই কার্ডটি ই-পস (e-POS) মেশিনে আধার ও ফিঙ্গারপ্রিন্ট দ্বারা ব্যবহারযোগ্য।', widthPx * 0.06, heightPx * 0.22);
      ctx.fillText('২. কার্ডের ক্যাটাগরি অনুযায়ী প্রতি মাসে বিনামূল্যে খাদ্যশস্য প্রাপ্য।', widthPx * 0.06, heightPx * 0.30);
      ctx.fillText('৩. কার্ড সংক্রান্ত যে কোন অভিযোগ বা স্থানান্তরের জন্য দুয়ারে সরকার ক্যাম্প বা', widthPx * 0.06, heightPx * 0.38);
      ctx.fillText('   নিকটবর্তী বাংলা সহায়তা কেন্দ্রে (BSK) যোগাযোগ করুন।', widthPx * 0.06, heightPx * 0.44);

      // QR Code
      const qrSize = heightPx * 0.35;
      const qrX = widthPx * 0.06;
      const qrY = heightPx * 0.54;

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#0f172a';
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);

      ctx.fillStyle = '#0f172a';
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
          if ((r + c) % 2 === 0) {
            ctx.fillRect(qrX + c * (qrSize / 6) + 4, qrY + r * (qrSize / 6) + 4, qrSize / 8, qrSize / 8);
          }
        }
      }

      ctx.fillStyle = '#0f172a';
      ctx.font = `bold ${Math.round(heightPx * 0.042)}px sans-serif`;
      ctx.fillText(`Family Card ID: ${rationNo}`, widthPx * 0.46, heightPx * 0.65);
      ctx.font = `${Math.round(heightPx * 0.036)}px sans-serif`;
      ctx.fillStyle = '#64748b';
      ctx.fillText('Department of Food & Supplies', widthPx * 0.46, heightPx * 0.73);
      ctx.fillText('Government of West Bengal', widthPx * 0.46, heightPx * 0.80);

      // Bottom Bar
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, heightPx * 0.94, widthPx, heightPx * 0.06);

    } else {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, widthPx, heightPx * 0.16);
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(heightPx * 0.05)}px sans-serif`;
      ctx.fillText('BACK SIDE / বিপরীত দিক', widthPx * 0.28, heightPx * 0.10);

      ctx.fillStyle = '#64748b';
      ctx.font = `${Math.round(heightPx * 0.045)}px sans-serif`;
      ctx.fillText('Upload custom back image', widthPx * 0.28, heightPx * 0.50);
    }

    return cardCanvas;
  };

  // RENDER MASTER SHEET OPTIMIZED FOR BROTHER DCP-T226 (300 DPI)
  useEffect(() => {
    // CR80 Standard dimensions: 85.60mm x 53.98mm
    // At 300 DPI (approx 11.811 px per mm):
    // Standard Card: 1012 px × 638 px
    const dpi = 300;
    const pxPerMm = dpi / 25.4; // 11.811 px/mm

    // Add bleed if configured (e.g. 1.5mm bleed)
    const cardWidthMm = 85.6 + (bleedMm * 2);
    const cardHeightMm = 53.98 + (bleedMm * 2);

    const cardWidthPx = Math.round(cardWidthMm * pxPerMm);
    const cardHeightPx = Math.round(cardHeightMm * pxPerMm);

    // Sheet Dimensions:
    // 4x6 inch (101.6mm x 152.4mm) -> 1200 x 1800 px (or 1800 x 1200 landscape)
    // A4 (210mm x 297mm) -> 2480 x 3508 px
    let sheetWidthPx = 1800;
    let sheetHeightPx = 1200;

    if (sheetSize === '4x6') {
      sheetWidthPx = 1800; // Landscape 6x4 inch
      sheetHeightPx = 1200;
    } else if (sheetSize === 'A4_single' || sheetSize === 'A4_batch_5') {
      sheetWidthPx = 2480; // A4 Portrait
      sheetHeightPx = 3508;
    } else if (sheetSize === 'tray') {
      sheetWidthPx = 1800;
      sheetHeightPx = 1200;
    }

    const masterCanvas = document.createElement('canvas');
    masterCanvas.width = sheetWidthPx;
    masterCanvas.height = sheetHeightPx;
    const ctx = masterCanvas.getContext('2d');
    if (!ctx) return;

    // Fill white paper background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, sheetWidthPx, sheetHeightPx);

    // Generate Single Front and Back canvases
    const frontCanvas = drawFrontCard(cardWidthPx, cardHeightPx);
    const backCanvas = drawBackCard(cardWidthPx, cardHeightPx);

    // Apply Brother T226 Color Filters (Brightness, Contrast, Saturation)
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

    // Helper to draw a single card with optional mirror & crop marks
    const drawCardItem = (
      sourceCanvas: HTMLCanvasElement, 
      destX: number, 
      destY: number, 
      isBack: boolean
    ) => {
      ctx.save();
      ctx.translate(destX, destY);

      if (mirrorPrint) {
        // Horizontal Flip for Dragon Sheet
        ctx.scale(-1, 1);
        ctx.drawImage(sourceCanvas, -cardWidthPx, 0, cardWidthPx, cardHeightPx);
      } else {
        ctx.drawImage(sourceCanvas, 0, 0, cardWidthPx, cardHeightPx);
      }

      ctx.restore();

      // Draw Crop marks / Cutting Guides
      if (showCropMarks) {
        ctx.save();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);

        // Corner crop ticks
        const markLen = 25;
        // Top-left
        ctx.beginPath();
        ctx.moveTo(destX - markLen, destY);
        ctx.lineTo(destX, destY);
        ctx.lineTo(destX, destY - markLen);
        ctx.stroke();

        // Top-right
        ctx.beginPath();
        ctx.moveTo(destX + cardWidthPx + markLen, destY);
        ctx.lineTo(destX + cardWidthPx, destY);
        ctx.lineTo(destX + cardWidthPx, destY - markLen);
        ctx.stroke();

        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(destX - markLen, destY + cardHeightPx);
        ctx.lineTo(destX, destY + cardHeightPx);
        ctx.lineTo(destX, destY + cardHeightPx + markLen);
        ctx.stroke();

        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(destX + cardWidthPx + markLen, destY + cardHeightPx);
        ctx.lineTo(destX + cardWidthPx, destY + cardHeightPx);
        ctx.lineTo(destX + cardWidthPx, destY + cardHeightPx + markLen);
        ctx.stroke();

        ctx.restore();
      }
    };

    // LAYOUT PLACEMENTS
    if (sheetSize === '4x6') {
      // 4x6 Photo Paper (1800 x 1200 px)
      // Front and Back placed side by side with center fold line
      const gapX = 40;
      const totalWidth = (cardWidthPx * 2) + gapX;
      const startX = Math.round((sheetWidthPx - totalWidth) / 2);
      const startY = Math.round((sheetHeightPx - cardHeightPx) / 2);

      // Draw Front Card (Left)
      drawCardItem(frontCanvas, startX, startY, false);

      // Draw Back Card (Right)
      drawCardItem(backCanvas, startX + cardWidthPx + gapX, startY, true);

      // Draw Center Fold / Cut Guide Line
      if (showFoldLine) {
        const midX = startX + cardWidthPx + (gapX / 2);
        ctx.save();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(midX, startY - 30);
        ctx.lineTo(midX, startY + cardHeightPx + 30);
        ctx.stroke();

        // Small scissors icon indicator
        ctx.fillStyle = '#64748b';
        ctx.font = '20px sans-serif';
        ctx.fillText('✂ Fold / Cut', midX - 45, startY - 40);
        ctx.restore();
      }

    } else if (sheetSize === 'A4_single') {
      // Single card centered on top half of A4 for easy Brother T226 manual feed
      const gapX = 60;
      const totalWidth = (cardWidthPx * 2) + gapX;
      const startX = Math.round((sheetWidthPx - totalWidth) / 2);
      const startY = 300; // 25mm from top margin

      drawCardItem(frontCanvas, startX, startY, false);
      drawCardItem(backCanvas, startX + cardWidthPx + gapX, startY, true);

      if (showFoldLine) {
        const midX = startX + cardWidthPx + (gapX / 2);
        ctx.save();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(midX, startY - 40);
        ctx.lineTo(midX, startY + cardHeightPx + 40);
        ctx.stroke();
        ctx.restore();
      }

    } else if (sheetSize === 'A4_batch_5') {
      // A4 Bulk Dragon Sheet Layout: 5 Cards (10 sides: 5 Front in left column, 5 Back in right column)
      const gapX = 80;
      const gapY = 50;
      const totalWidth = (cardWidthPx * 2) + gapX;
      const startX = Math.round((sheetWidthPx - totalWidth) / 2);
      const startY = 180;

      for (let i = 0; i < 5; i++) {
        const currentY = startY + i * (cardHeightPx + gapY);
        drawCardItem(frontCanvas, startX, currentY, false);
        drawCardItem(backCanvas, startX + cardWidthPx + gapX, currentY, true);
      }
    } else if (sheetSize === 'tray') {
      // Card Tray Layout
      const gapX = 40;
      const totalWidth = (cardWidthPx * 2) + gapX;
      const startX = Math.round((sheetWidthPx - totalWidth) / 2);
      const startY = Math.round((sheetHeightPx - cardHeightPx) / 2);

      drawCardItem(frontCanvas, startX, startY, false);
      drawCardItem(backCanvas, startX + cardWidthPx + gapX, startY, true);
    }

    // Watermark / Model Header in Sheet corner for reference
    ctx.save();
    ctx.filter = 'none';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px monospace';
    ctx.fillText(
      `BROTHER DCP-T226 PVC ENGINE • ${mirrorPrint ? 'MIRROR (DRAGON SHEET)' : 'STANDARD NON-MIRROR'} • 300 DPI • 85.6x54mm`,
      50,
      sheetHeightPx - 30
    );
    ctx.restore();

    setRenderedSheetUrl(masterCanvas.toDataURL('image/png', 1.0));
  }, [
    cardType,
    sheetSize,
    pvcMethod,
    mirrorPrint,
    showCropMarks,
    showFoldLine,
    bleedMm,
    roundedCorners,
    frontImage,
    backImage,
    brightness,
    contrast,
    saturation,
    sharpnessPreset,
    useTemplateMode,
    aadhaarName,
    aadhaarNumber,
    aadhaarDob,
    aadhaarGender,
    aadhaarAddress,
    maskAadhaar,
    userPhoto,
    voterEpic,
    voterName,
    voterRelationName,
    voterGender,
    voterDob,
    voterAcNo,
    voterAddress,
    rationCat,
    rationNo,
    rationName,
    rationFhName,
    rationFps,
    rationAadhaarLinked
  ]);

  // Direct Print Handler with Brother DCP-T226 Accurate Dimensions
  const handlePrint = () => {
    if (!renderedSheetUrl) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const isA4 = sheetSize === 'A4_single' || sheetSize === 'A4_batch_5';
    const pageSizeCss = isA4 ? 'A4 portrait' : '6in 4in landscape';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Brother DCP-T226 PVC Print - ${cardType.toUpperCase()}</title>
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
          <img src="${renderedSheetUrl}" onload="window.print();window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Download High-Res PNG
  const handleDownload = () => {
    if (!renderedSheetUrl) return;
    const a = document.createElement('a');
    a.href = renderedSheetUrl;
    a.download = `Brother_T226_PVC_${cardType}_${sheetSize}_${mirrorPrint ? 'Mirror' : 'Normal'}.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Brother T226 Optimization Top Ribbon */}
      <div className="bg-linear-to-r from-blue-950 via-indigo-950 to-slate-950 text-white p-5 rounded-3xl border border-blue-800/60 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-blue-600/30 border border-blue-400/40 rounded-2xl">
            <CreditCard className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/30 text-[10px] font-bold text-blue-200 uppercase tracking-widest">
                Brother DCP-T226 Calibrated
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/30 border border-amber-400/30 text-[10px] font-bold text-amber-200 uppercase">
                CR80 (85.6 × 54 mm)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              {language === 'bn' ? 'পিভিসি ও স্মার্ট কার্ড প্রিন্ট স্টুডিও' : 'PVC & Smart Card Print Studio'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDriverGuide(!showDriverGuide)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900/60 hover:bg-blue-800/80 border border-blue-700/50 text-xs font-bold text-blue-200 transition cursor-pointer"
          >
            <Settings2 className="w-4 h-4 text-amber-400" />
            <span>{language === 'bn' ? 'Brother T226 সেটিংস গাইড' : 'Brother T226 Guide'}</span>
          </button>

          <button
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'bn' ? 'নমুনা ডেটা লোড করুন' : 'Load Sample Card'}</span>
          </button>
        </div>
      </div>

      {/* Driver Settings Guide Panel (Collapsible) */}
      {showDriverGuide && (
        <div className="bg-amber-50 dark:bg-amber-950/40 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 space-y-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-amber-950 dark:text-amber-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              {language === 'bn' ? 'Brother DCP-T226 প্রিন্টার সঠিক সেটিংস নির্দেশিকা' : 'Brother DCP-T226 Printer Driver Exact Settings'}
            </h3>
            <button
              onClick={() => setShowDriverGuide(false)}
              className="text-amber-800 dark:text-amber-300 font-bold hover:underline"
            >
              ✕ {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/80 dark:border-amber-800/60">
              <span className="font-bold text-slate-500 block text-[10px] uppercase">Media / Paper Type:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Brother BP71GLA Glossy / Photo Paper</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/80 dark:border-amber-800/60">
              <span className="font-bold text-slate-500 block text-[10px] uppercase">Print Quality:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Fine / High (1200 × 6000 dpi)</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/80 dark:border-amber-800/60">
              <span className="font-bold text-slate-500 block text-[10px] uppercase">Scale / Sizing:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">100% Actual Size (Fit to page OFF)</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/80 dark:border-amber-800/60">
              <span className="font-bold text-slate-500 block text-[10px] uppercase">Lamination Temp:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">135°C - 145°C (Dragon) / 115°C (Pouch)</span>
            </div>
          </div>
        </div>
      )}

      {/* Card Type Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setCardType('aadhaar')}
          className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${
            cardType === 'aadhaar'
              ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-600 dark:border-blue-500 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-xs shrink-0">
            UID
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              {language === 'bn' ? 'আধার কার্ড পিভিসি' : 'Aadhaar Card PVC'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">UIDAI Front & Back</div>
          </div>
        </button>

        <button
          onClick={() => setCardType('voter')}
          className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${
            cardType === 'voter'
              ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-600 dark:border-blue-500 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs shrink-0">
            ECI
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              {language === 'bn' ? 'ভোটার কার্ড পিভিসি' : 'Voter (EPIC) PVC'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Digital e-EPIC Format</div>
          </div>
        </button>

        <button
          onClick={() => setCardType('ration')}
          className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${
            cardType === 'ration'
              ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-600 dark:border-blue-500 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">
            WBF
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              {language === 'bn' ? 'রেশন কার্ড পিভিসি' : 'Ration Card PVC'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">WB Food & Supplies</div>
          </div>
        </button>

        <button
          onClick={() => setCardType('custom')}
          className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${
            cardType === 'custom'
              ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-600 dark:border-blue-500 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-xs shrink-0">
            ID
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              {language === 'bn' ? 'কাস্টম পিভিসি আইডি' : 'Custom PVC / PAN'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Any Dual-Side Card</div>
          </div>
        </button>
      </div>

      {/* Main Grid: Controls on Left, Live Canvas Sheet on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Uploads & Print Settings (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Print Layout & Method Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              {language === 'bn' ? 'প্রিন্টিং মেথড ও পেপার সাইজ' : 'Printing Method & Paper Setup'}
            </h3>

            {/* Printing Method */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'bn' ? 'প্রিন্ট টেকনোলজি / মেথড' : 'PVC Printing Technology'}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handlePvcMethodChange('dragon_sheet_mirror')}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    pvcMethod === 'dragon_sheet_mirror'
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-600 text-blue-900 dark:text-blue-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <FlipHorizontal className="w-3.5 h-3.5 text-blue-600" />
                    <span>Dragon Sheet (Mirror)</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">অটো মিরর প্রিন্ট (ল্যামিনেশন)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePvcMethodChange('pouch_laminating')}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    pvcMethod === 'pouch_laminating'
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-600 text-blue-900 dark:text-blue-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pouch / Photo Paper</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">গ্লসি পেপার + পাউচ</span>
                </button>
              </div>
            </div>

            {/* Sheet Size */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'bn' ? 'Brother T226 পেপার সাইজ' : 'Brother T226 Paper Sheet Size'}
              </label>
              <select
                value={sheetSize}
                onChange={(e) => setSheetSize(e.target.value as SheetSize)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="4x6">4x6 Photo Glossy (Brother BP71GLA) - Single Card (Front + Back)</option>
                <option value="A4_single">A4 Sheet - Single Card Top Centered (Manual Feed)</option>
                <option value="A4_batch_5">A4 Dragon Sheet - 5 Cards Batch (10 Sides Bulk)</option>
                <option value="tray">PVC Tray (2-Up Card Carrier)</option>
              </select>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mirrorPrint}
                  onChange={(e) => setMirrorPrint(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'bn' ? 'মিরর প্রিন্ট (Mirror)' : 'Mirror Image'}
                </span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCropMarks}
                  onChange={(e) => setShowCropMarks(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'bn' ? 'কাটিং গাইডলাইন' : 'Crop & Cut Marks'}
                </span>
              </label>
            </div>
          </div>

          {/* Upload Images OR Template Form Tabs */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                {language === 'bn' ? 'কার্ড ইনপুট (ছবি আপলোড / ডেটা এন্ট্রি)' : 'Card Input Mode'}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setUseTemplateMode(false)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    !useTemplateMode ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {language === 'bn' ? 'ছবি আপলোড' : 'Upload Images'}
                </button>
                <button
                  onClick={() => setUseTemplateMode(true)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    useTemplateMode ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {language === 'bn' ? 'টেমপ্লেট মোড' : 'Template Form'}
                </button>
              </div>
            </div>

            {!useTemplateMode ? (
              <div className="grid grid-cols-2 gap-3">
                {/* Front Side Upload */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {language === 'bn' ? 'সামনের দিক (Front Side)' : 'Front Side Image'}
                  </span>
                  <div
                    onClick={() => frontInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-xl p-3 text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/60 aspect-3/2 flex flex-col items-center justify-center"
                  >
                    {frontImage ? (
                      <div className="relative w-full h-full">
                        <img src={frontImage} alt="Front" className="w-full h-full object-contain rounded-lg" />
                        <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-bold">✓ Loaded</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          {language === 'bn' ? 'ফ্রন্ট ছবি আপলোড' : 'Upload Front'}
                        </span>
                      </>
                    )}
                  </div>
                  <input
                    ref={frontInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'front')}
                    className="hidden"
                  />
                </div>

                {/* Back Side Upload */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {language === 'bn' ? 'পেছনের দিক (Back Side)' : 'Back Side Image'}
                  </span>
                  <div
                    onClick={() => backInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-xl p-3 text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/60 aspect-3/2 flex flex-col items-center justify-center"
                  >
                    {backImage ? (
                      <div className="relative w-full h-full">
                        <img src={backImage} alt="Back" className="w-full h-full object-contain rounded-lg" />
                        <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-bold">✓ Loaded</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          {language === 'bn' ? 'ব্যাক ছবি আপলোড' : 'Upload Back'}
                        </span>
                      </>
                    )}
                  </div>
                  <input
                    ref={backInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'back')}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              /* Template Fields */
              <div className="space-y-3 text-xs">
                {cardType === 'aadhaar' && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">নাম (Full Name)</label>
                        <input
                          type="text"
                          value={aadhaarName}
                          onChange={(e) => setAadhaarName(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">আধার নং (Aadhaar No)</label>
                        <input
                          type="text"
                          value={aadhaarNumber}
                          onChange={(e) => setAadhaarNumber(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">জন্ম তারিখ (DOB)</label>
                        <input
                          type="text"
                          value={aadhaarDob}
                          onChange={(e) => setAadhaarDob(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">লিঙ্গ (Gender)</label>
                        <input
                          type="text"
                          value={aadhaarGender}
                          onChange={(e) => setAadhaarGender(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">ঠিকানা (Full Address)</label>
                      <textarea
                        value={aadhaarAddress}
                        onChange={(e) => setAadhaarAddress(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 outline-none resize-none"
                      />
                    </div>
                  </>
                )}

                {cardType === 'voter' && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">EPIC No / ভোটার নং</label>
                        <input
                          type="text"
                          value={voterEpic}
                          onChange={(e) => setVoterEpic(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">ভোটারের নাম</label>
                        <input
                          type="text"
                          value={voterName}
                          onChange={(e) => setVoterName(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">পিতা / স্বামীর নাম</label>
                        <input
                          type="text"
                          value={voterRelationName}
                          onChange={(e) => setVoterRelationName(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">বিধানসভা কেন্দ্র (AC)</label>
                        <input
                          type="text"
                          value={voterAcNo}
                          onChange={(e) => setVoterAcNo(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {cardType === 'ration' && (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">ক্যাটাগরি</label>
                        <select
                          value={rationCat}
                          onChange={(e) => setRationCat(e.target.value as any)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 outline-none"
                        >
                          <option value="SPHH">SPHH</option>
                          <option value="PHH">PHH</option>
                          <option value="AAY">AAY</option>
                          <option value="RKSY-I">RKSY-I</option>
                          <option value="RKSY-II">RKSY-II</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">রেশন কার্ড নং</label>
                        <input
                          type="text"
                          value={rationNo}
                          onChange={(e) => setRationNo(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">কার্ডধারীর নাম</label>
                        <input
                          type="text"
                          value={rationName}
                          onChange={(e) => setRationName(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">পিতা/স্বামীর নাম</label>
                        <input
                          type="text"
                          value={rationFhName}
                          onChange={(e) => setRationFhName(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Photo Upload for Template */}
                <div className="flex items-center gap-3 pt-1">
                  <div
                    onClick={() => photoInputRef.current?.click()}
                    className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800 text-center cursor-pointer font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>{userPhoto ? 'ছবি পরিবর্তন করুন' : 'পাসপোর্ট ছবি আপলোড'}</span>
                  </div>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'photo')}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Color & Ink Tank Calibrations */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-600" />
              {language === 'bn' ? 'Brother T226 কালার ও শার্পনেস টিউনিং' : 'Brother T226 Color & Sharpness Tuning'}
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">
                  ব্রাইটনেস: {brightness}%
                </label>
                <input
                  type="range"
                  min="80"
                  max="130"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">
                  কনট্রাস্ট: {contrast}%
                </label>
                <input
                  type="range"
                  min="80"
                  max="130"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">
                  স্যাচুরেশন: {saturation}%
                </label>
                <input
                  type="range"
                  min="80"
                  max="140"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live High-Res Sheet Preview & Print Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {language === 'bn' ? 'লাইভ প্রিন্ট প্রিভিউ (300 DPI Brother T226 Sheet)' : 'Live Print Preview (300 DPI Brother T226 Sheet)'}
                </h3>
              </div>
              <span className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                CR80 • {sheetSize.toUpperCase()}
              </span>
            </div>

            {/* Live Render Canvas View */}
            <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden min-h-[360px]">
              {renderedSheetUrl ? (
                <img
                  src={renderedSheetUrl}
                  alt="Rendered Sheet"
                  className="max-h-[460px] w-auto max-w-full object-contain rounded-lg shadow-lg border border-slate-300 dark:border-slate-700"
                />
              ) : (
                <div className="text-center text-slate-400 text-xs">Generating high-res card layout...</div>
              )}
            </div>

            {/* Quick Status Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-slate-500 block text-[10px]">Card Format</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{cardType.toUpperCase()}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-slate-500 block text-[10px]">Mirror Mode</span>
                <span className={`font-bold ${mirrorPrint ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {mirrorPrint ? 'ENABLED (Dragon)' : 'DISABLED'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-slate-500 block text-[10px]">Card Size</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">85.6 × 54.0 mm</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-slate-500 block text-[10px]">Target Printer</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Brother T226</span>
              </div>
            </div>

            {/* Action Buttons: Direct Print & Download */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{language === 'bn' ? 'Brother T226 এ প্রিন্ট করুন' : 'Print on Brother DCP-T226'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'bn' ? 'হাই-রেজ PNG ডাউনলোড' : 'Download 300DPI PNG'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
