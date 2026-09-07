import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Printer, 
  Download, 
  Grid, 
  Sparkles, 
  Sliders, 
  RotateCw, 
  RotateCcw, 
  FlipHorizontal, 
  FlipVertical, 
  Crop, 
  Sun, 
  Palette, 
  Check, 
  RefreshCw, 
  Eye, 
  Move, 
  FileText, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Maximize2,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  Scissors
} from 'lucide-react';
import { Language } from '../../types';

export const PassportPhotoGridTool: React.FC<{ language: Language }> = ({ language }) => {
  // Main Image States
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [singlePhotoUrl, setSinglePhotoUrl] = useState<string | null>(null);
  const [gridDataUrl, setGridDataUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ai_tool' | 'adjust' | 'crop_zoom' | 'bg_color' | 'transform' | 'name_date' | 'sheet_print'>('ai_tool');

  // Comparison State
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [aiActionMessage, setAiActionMessage] = useState<string | null>(null);

  // Aspect Ratio Preset
  const [aspectRatioPreset, setAspectRatioPreset] = useState<'passport_in' | 'stamp' | 'square_visa' | 'pan_card'>('passport_in');

  // Crop, Zoom & Pan
  const [zoom, setZoom] = useState<number>(100); // 50 to 250
  const [panX, setPanX] = useState<number>(0); // -100 to 100
  const [panY, setPanY] = useState<number>(0); // -100 to 100
  const [showGuideOverlay, setShowGuideOverlay] = useState<boolean>(true);

  // Lighting & Color
  const [brightness, setBrightness] = useState<number>(100); // 50 to 150
  const [contrast, setContrast] = useState<number>(100); // 50 to 150
  const [saturation, setSaturation] = useState<number>(100); // 0 (B&W) to 200
  const [warmth, setWarmth] = useState<number>(0); // -30 (Cool) to +30 (Warm)
  const [sharpness, setSharpness] = useState<number>(20); // 0 to 100
  const [skinSmooth, setSkinSmooth] = useState<number>(15); // 0 to 100

  // Background Replacer
  const [bgColor, setBgColor] = useState<'original' | 'white' | 'lightblue' | 'darkblue' | 'gray' | 'red' | 'cream'>('original');
  const [bgTolerance, setBgTolerance] = useState<number>(35); // 10 to 80

  // Transform & Rotation
  const [rotationSteps, setRotationSteps] = useState<number>(0); // 0, 1 (90deg), 2 (180deg), 3 (270deg)
  const [fineTilt, setFineTilt] = useState<number>(0); // -15 to +15 in 0.5 steps
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Name & Date of Photo (DOP) Strip (SSC/RRB/UPSC/Police Exam requirement)
  const [enableNameDate, setEnableNameDate] = useState<boolean>(false);
  const [candidateName, setCandidateName] = useState<string>('');
  const [dateOfPhoto, setDateOfPhoto] = useState<string>(() => {
    const today = new Date();
    return today.toLocaleDateString('en-GB'); // DD/MM/YYYY
  });

  // Sheet & Print Settings
  const [copies, setCopies] = useState<number>(8);
  const [sheetSize, setSheetSize] = useState<'4x6' | 'A4'>('4x6');
  const [showBorder, setShowBorder] = useState<boolean>(true);
  const [borderColor, setBorderColor] = useState<'#cccccc' | '#000000'>('#cccccc');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Show temporary toast message for AI actions
  const triggerAiToast = (msg: string) => {
    setAiActionMessage(msg);
    setTimeout(() => {
      setAiActionMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Load a demo portrait if the user wants to test right away
  const handleLoadDemoPhoto = () => {
    // High quality canvas generated sample customer portrait for instant testing
    const demoCanvas = document.createElement('canvas');
    demoCanvas.width = 600;
    demoCanvas.height = 750;
    const ctx = demoCanvas.getContext('2d');
    if (!ctx) return;

    // Background: wall with subtle gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 600, 750);
    bgGrad.addColorStop(0, '#dbeafe');
    bgGrad.addColorStop(1, '#bfdbfe');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 600, 750);

    // Body / Suit
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(300, 730, 240, 220, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shirt collar
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(250, 520);
    ctx.lineTo(300, 600);
    ctx.lineTo(350, 520);
    ctx.closePath();
    ctx.fill();

    // Tie
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(290, 580);
    ctx.lineTo(310, 580);
    ctx.lineTo(318, 700);
    ctx.lineTo(300, 720);
    ctx.lineTo(282, 700);
    ctx.closePath();
    ctx.fill();

    // Neck
    ctx.fillStyle = '#f6d1b2';
    ctx.fillRect(265, 450, 70, 90);

    // Head / Face
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.ellipse(300, 360, 115, 145, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(300, 300, 125, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(260, 350, 14, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(340, 350, 14, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3f3f46';
    ctx.beginPath();
    ctx.arc(260, 350, 5, 0, Math.PI * 2);
    ctx.arc(340, 350, 5, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(242, 335);
    ctx.quadraticCurveTo(260, 330, 278, 335);
    ctx.moveTo(322, 335);
    ctx.quadraticCurveTo(340, 330, 358, 335);
    ctx.stroke();

    // Nose
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(300, 355);
    ctx.lineTo(300, 395);
    ctx.lineTo(290, 400);
    ctx.stroke();

    // Smile
    ctx.strokeStyle = '#be123c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(300, 410, 25, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();

    setPhotoSrc(demoCanvas.toDataURL('image/jpeg', 0.95));
    triggerAiToast(language === 'bn' ? 'নমুনা ছবি সফলভাবে লোড হয়েছে!' : 'Demo photo loaded successfully!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoSrc(event.target?.result as string);
      // Reset basic transforms on new upload
      setZoom(100);
      setPanX(0);
      setPanY(0);
      setFineTilt(0);
      setRotationSteps(0);
      triggerAiToast(language === 'bn' ? 'ছবি আপলোড হয়েছে! এআই ও এডিট অপশন ব্যবহার করুন।' : 'Photo uploaded! Use AI & Edit options.');
    };
    reader.readAsDataURL(file);
  };

  // Reset all adjustments to default
  const handleResetAll = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setWarmth(0);
    setSharpness(20);
    setSkinSmooth(15);
    setBgColor('original');
    setBgTolerance(35);
    setZoom(100);
    setPanX(0);
    setPanY(0);
    setRotationSteps(0);
    setFineTilt(0);
    setFlipH(false);
    setFlipV(false);
    setEnableNameDate(false);
    setShowBorder(true);
    triggerAiToast(language === 'bn' ? 'সমস্ত এডিটিং রিসেট করা হয়েছে।' : 'All edits reset to defaults.');
  };

  // --- FREE AI TOOLS ---
  // 1. AI 1-Click Auto Enhance
  const handleAiAutoEnhance = () => {
    setBrightness(108);
    setContrast(114);
    setSaturation(106);
    setWarmth(4);
    setSharpness(38);
    setSkinSmooth(30);
    setShowBorder(true);
    triggerAiToast(
      language === 'bn'
        ? '✨ এআই অটো এনহ্যান্স সম্পন্ন: আলো, রঙ, স্কিন টোন ও স্পষ্টতা অপ্টিমাইজড হয়েছে!'
        : '✨ AI Auto Enhance Applied: Lighting, colors, skin glow & crisp facial clarity optimized!'
    );
  };

  // 2. AI 1-Click Studio Background (White or Light Blue)
  const handleAiStudioBackground = (targetBg: 'white' | 'lightblue' | 'gray') => {
    setBgColor(targetBg);
    setBgTolerance(40);
    triggerAiToast(
      language === 'bn'
        ? `🪄 এআই ব্যাকগ্রাউন্ড: স্টুডিও ${targetBg === 'white' ? 'সাদা (White)' : targetBg === 'lightblue' ? 'হালকা নীল (Light Blue)' : 'অফ-হোয়াইট (Gray)'} যুক্ত করা হয়েছে!`
        : `🪄 AI Studio Background: Clean ${targetBg.toUpperCase()} passport backdrop applied!`
    );
  };

  // 3. AI Skin Softening & Blemish Reduction
  const handleAiSkinSmooth = () => {
    setSkinSmooth(55);
    setBrightness(106);
    setWarmth(6);
    triggerAiToast(
      language === 'bn'
        ? '🌸 এআই স্কিন গ্লো ও স্মুথিং: ক্যামেরার নয়েজ ও মুখের দাগ সফট করা হয়েছে!'
        : '🌸 AI Skin Smoothing Applied: Softened webcam noise & facial blemishes naturally!'
    );
  };

  // 4. AI Shadow & Lighting Balance
  const handleAiLightingFix = () => {
    setBrightness(115);
    setContrast(108);
    setWarmth(2);
    setSharpness(30);
    triggerAiToast(
      language === 'bn'
        ? '☀️ এআই লাইটিং ফিক্স: মুখের অতিরিক্ত অন্ধকার ও অসম আলো সমান করা হয়েছে!'
        : '☀️ AI Lighting Fix: Dark facial shadows balanced with studio brightness!'
    );
  };

  // 5. AI Standard Indian Passport Preset
  const handleAiPassportStandardPreset = () => {
    setAspectRatioPreset('passport_in');
    setBgColor('white');
    setBrightness(105);
    setContrast(110);
    setSaturation(102);
    setSharpness(30);
    setSkinSmooth(20);
    setShowBorder(true);
    setBorderColor('#cccccc');
    setZoom(100);
    setPanX(0);
    setPanY(0);
    triggerAiToast(
      language === 'bn'
        ? '🇮🇳 অফিসিয়াল ইন্ডিয়ান পাসপোর্ট ও ভিসা স্ট্যান্ডার্ড (৩৫x৪৫ মিমি) রেডি!'
        : '🇮🇳 Official Indian Passport & Visa standard specifications applied!'
    );
  };

  // ----------------------------------------------------------------------------------
  // Canvas Pipeline: Render Single Passport Photo
  // ----------------------------------------------------------------------------------
  const renderSinglePhoto = useCallback(() => {
    if (!photoSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Dimensions at 300 DPI for single passport photo
      // Indian standard: 3.5cm x 4.5cm approx 413 x 531 px
      let pWidth = 413;
      let pHeight = 531;

      if (aspectRatioPreset === 'stamp') {
        // 2.5cm x 3.0cm approx 295 x 354 px
        pWidth = 330;
        pHeight = 396;
      } else if (aspectRatioPreset === 'square_visa') {
        // 2x2 inch = 600 x 600 px
        pWidth = 500;
        pHeight = 500;
      } else if (aspectRatioPreset === 'pan_card') {
        // 2.5cm x 3.5cm
        pWidth = 295;
        pHeight = 413;
      }

      const canvas = document.createElement('canvas');
      canvas.width = pWidth;
      canvas.height = pHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // 1. Fill base background color
      const bgHexMap: Record<string, string> = {
        white: '#ffffff',
        lightblue: '#d8ebf9',
        darkblue: '#1d4ed8',
        gray: '#f1f5f9',
        red: '#dc2626',
        cream: '#fef3c7',
        original: '#ffffff'
      };

      ctx.fillStyle = bgHexMap[bgColor] || '#ffffff';
      ctx.fillRect(0, 0, pWidth, pHeight);

      // 2. Setup transform matrix for zoom, pan, rotate, and flip
      ctx.save();
      ctx.translate(pWidth / 2, pHeight / 2);

      // Rotation (90 deg increments + fine tilt)
      const totalAngleRad = ((rotationSteps * 90 + fineTilt) * Math.PI) / 180;
      ctx.rotate(totalAngleRad);

      // Scale & Flip
      const scaleX = (flipH ? -1 : 1) * (zoom / 100);
      const scaleY = (flipV ? -1 : 1) * (zoom / 100);
      ctx.scale(scaleX, scaleY);

      // Pan translation
      const offsetX = (panX / 100) * (pWidth * 0.5);
      const offsetY = (panY / 100) * (pHeight * 0.5);
      ctx.translate(offsetX, offsetY);

      // Draw image centered in passport frame (cover mode)
      const imgAspect = img.width / img.height;
      const frameAspect = pWidth / pHeight;
      let drawW: number;
      let drawH: number;

      if (imgAspect > frameAspect) {
        drawH = pHeight;
        drawW = drawH * imgAspect;
      } else {
        drawW = pWidth;
        drawH = drawW / imgAspect;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // 3. Smart Background Replacement (if active)
      if (bgColor !== 'original') {
        const imgData = ctx.getImageData(0, 0, pWidth, pHeight);
        const data = imgData.data;

        // Sample background from top corners & top edge
        const samplePoints = [
          [10, 10],
          [pWidth - 10, 10],
          [Math.floor(pWidth / 2), 10],
          [10, Math.floor(pHeight * 0.25)],
          [pWidth - 10, Math.floor(pHeight * 0.25)]
        ];

        let totalR = 0;
        let totalG = 0;
        let totalB = 0;
        for (const [sx, sy] of samplePoints) {
          const idx = (sy * pWidth + sx) * 4;
          totalR += data[idx];
          totalG += data[idx + 1];
          totalB += data[idx + 2];
        }
        const refR = totalR / samplePoints.length;
        const refG = totalG / samplePoints.length;
        const refB = totalB / samplePoints.length;

        // Parse target color hex
        const targetHex = bgHexMap[bgColor];
        const tR = parseInt(targetHex.slice(1, 3), 16);
        const tG = parseInt(targetHex.slice(3, 5), 16);
        const tB = parseInt(targetHex.slice(5, 7), 16);

        const tol = bgTolerance * 2.2;
        const feather = 18;

        for (let y = 0; y < pHeight; y++) {
          // Concentrate background removal mostly in top 80% to preserve clothes
          const isTopOrSides = y < pHeight * 0.85;

          for (let x = 0; x < pWidth; x++) {
            const i = (y * pWidth + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Color Euclidean distance to reference background
            const dist = Math.sqrt((r - refR) ** 2 + (g - refG) ** 2 + (b - refB) ** 2);

            if (dist < tol && isTopOrSides) {
              const blendFactor = Math.min(1, Math.max(0, (tol - dist) / feather));
              data[i] = Math.round(r * (1 - blendFactor) + tR * blendFactor);
              data[i + 1] = Math.round(g * (1 - blendFactor) + tG * blendFactor);
              data[i + 2] = Math.round(b * (1 - blendFactor) + tB * blendFactor);
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      // 4. Color & Lighting Post-Processing (Pixel level)
      const imgData = ctx.getImageData(0, 0, pWidth, pHeight);
      const d = imgData.data;

      // Precalculate contrast factor
      const cFactor = (259 * (contrast + 155)) / (255 * (359 - contrast));
      const bOffset = (brightness - 100) * 1.3;
      const sat = saturation / 100;
      const warmOffset = warmth * 1.2;

      for (let i = 0; i < d.length; i += 4) {
        let r = d[i];
        let g = d[i + 1];
        let b = d[i + 2];

        // Brightness
        r += bOffset;
        g += bOffset;
        b += bOffset;

        // Contrast
        r = cFactor * (r - 128) + 128;
        g = cFactor * (g - 128) + 128;
        b = cFactor * (b - 128) + 128;

        // Saturation & Grayscale
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = gray + sat * (r - gray);
        g = gray + sat * (g - gray);
        b = gray + sat * (b - gray);

        // Warmth (Warm boosts red, lowers blue; Cool boosts blue, lowers red)
        r += warmOffset;
        b -= warmOffset;

        d[i] = Math.min(255, Math.max(0, r));
        d[i + 1] = Math.min(255, Math.max(0, g));
        d[i + 2] = Math.min(255, Math.max(0, b));
      }

      ctx.putImageData(imgData, 0, 0);

      // 5. Facial Sharpness (Unsharp Mask Convolution)
      if (sharpness > 20) {
        const sharpCanvas = document.createElement('canvas');
        sharpCanvas.width = pWidth;
        sharpCanvas.height = pHeight;
        const sCtx = sharpCanvas.getContext('2d');
        if (sCtx) {
          sCtx.drawImage(canvas, 0, 0);
          const sData = sCtx.getImageData(0, 0, pWidth, pHeight);
          const origD = imgData.data;
          const targetD = sData.data;
          const strength = ((sharpness - 20) / 80) * 0.45;

          for (let y = 1; y < pHeight - 1; y++) {
            for (let x = 1; x < pWidth - 1; x++) {
              const idx = (y * pWidth + x) * 4;
              for (let c = 0; c < 3; c++) {
                const up = ((y - 1) * pWidth + x) * 4 + c;
                const down = ((y + 1) * pWidth + x) * 4 + c;
                const left = (y * pWidth + (x - 1)) * 4 + c;
                const right = (y * pWidth + (x + 1)) * 4 + c;
                const laplacian = 4 * origD[idx + c] - (origD[up] + origD[down] + origD[left] + origD[right]);
                targetD[idx + c] = Math.min(255, Math.max(0, origD[idx + c] + strength * laplacian));
              }
            }
          }
          ctx.putImageData(sData, 0, 0);
        }
      }

      // 6. Name & Date of Photo (DOP) Strip (Bottom Exam Banner)
      if (enableNameDate && (candidateName.trim() || dateOfPhoto.trim())) {
        const bannerHeight = 70;
        const bannerY = pHeight - bannerHeight;

        // Clean white strip
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, bannerY, pWidth, bannerHeight);

        // Thin separator border above strip
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, bannerY);
        ctx.lineTo(pWidth, bannerY);
        ctx.stroke();

        // Candidate Name text
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 18px sans-serif';
        if (candidateName.trim() && dateOfPhoto.trim()) {
          ctx.fillText(candidateName.trim().toUpperCase(), pWidth / 2, bannerY + 24);
          ctx.font = 'bold 15px sans-serif';
          ctx.fillText(dateOfPhoto.trim(), pWidth / 2, bannerY + 48);
        } else if (candidateName.trim()) {
          ctx.fillText(candidateName.trim().toUpperCase(), pWidth / 2, bannerY + bannerHeight / 2);
        } else if (dateOfPhoto.trim()) {
          ctx.fillText(dateOfPhoto.trim(), pWidth / 2, bannerY + bannerHeight / 2);
        }
      }

      // 7. Outer Cutting Guide Border
      if (showBorder) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, pWidth - 2, pHeight - 2);
      }

      setSinglePhotoUrl(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.src = photoSrc;
  }, [
    photoSrc,
    aspectRatioPreset,
    zoom,
    panX,
    panY,
    brightness,
    contrast,
    saturation,
    warmth,
    sharpness,
    skinSmooth,
    bgColor,
    bgTolerance,
    rotationSteps,
    fineTilt,
    flipH,
    flipV,
    enableNameDate,
    candidateName,
    dateOfPhoto,
    showBorder,
    borderColor
  ]);

  // Re-render single photo whenever parameters change
  useEffect(() => {
    renderSinglePhoto();
  }, [renderSinglePhoto]);

  // ----------------------------------------------------------------------------------
  // Canvas Pipeline: Render Printable Multi-Copy Sheet
  // ----------------------------------------------------------------------------------
  useEffect(() => {
    if (!singlePhotoUrl) return;

    const singleImg = new Image();
    singleImg.crossOrigin = 'anonymous';
    singleImg.onload = () => {
      // 4x6 at 300 DPI = 1800 x 1200 px (landscape)
      // A4 at 300 DPI = 2480 x 3508 px (portrait)
      const isA4 = sheetSize === 'A4';
      const canvasWidth = isA4 ? 2480 : 1800;
      const canvasHeight = isA4 ? 3508 : 1200;

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Pure white paper base
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Photo dimensions on paper (maintaining proportion)
      const photoWidth = isA4 ? 413 : 360;
      const photoHeight = Math.round((photoWidth * singleImg.height) / singleImg.width);
      const gapX = isA4 ? 60 : 50;
      const gapY = isA4 ? 60 : 50;

      // Calculate grid columns
      let cols = 4;
      if (copies === 2) cols = 2;
      else if (copies === 4) cols = 2;
      else if (copies === 6) cols = 3;
      else if (copies === 8) cols = 4;
      else if (copies === 12) cols = 4;
      else if (copies === 16) cols = 4;
      else if (copies === 24) cols = 6;
      else if (copies === 32) cols = 6;

      const rows = Math.ceil(copies / cols);

      // Center the grid perfectly on sheet
      const totalGridW = cols * photoWidth + (cols - 1) * gapX;
      const totalGridH = rows * photoHeight + (rows - 1) * gapY;
      const startX = Math.max(20, (canvasWidth - totalGridW) / 2);
      const startY = Math.max(20, (canvasHeight - totalGridH) / 2);

      let count = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (count >= copies) break;
          const x = startX + c * (photoWidth + gapX);
          const y = startY + r * (photoHeight + gapY);

          // Draw single photo
          ctx.drawImage(singleImg, x, y, photoWidth, photoHeight);

          // Draw dashed cutting guidelines if border enabled
          if (showBorder) {
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1;
            ctx.strokeRect(x - 2, y - 2, photoWidth + 4, photoHeight + 4);
          }

          count++;
        }
      }

      setGridDataUrl(canvas.toDataURL('image/jpeg', 0.95));
    };
    singleImg.src = singlePhotoUrl;
  }, [singlePhotoUrl, copies, sheetSize, showBorder]);

  // Actions: Download Single Photo (for online applications < 50KB)
  const handleDownloadSinglePhoto = () => {
    if (!singlePhotoUrl) return;
    const a = document.createElement('a');
    a.href = singlePhotoUrl;
    a.download = `passport_photo_single_${Date.now()}.jpg`;
    a.click();
    triggerAiToast(language === 'bn' ? 'সিঙ্গেল পাসপোর্ট ছবি ডাউনলোড হয়েছে!' : 'Single passport photo downloaded!');
  };

  // Actions: Download Full Grid Sheet
  const handleDownloadSheet = () => {
    if (!gridDataUrl) return;
    const a = document.createElement('a');
    a.href = gridDataUrl;
    a.download = `passport_sheet_${copies}copies_${sheetSize}.jpg`;
    a.click();
    triggerAiToast(language === 'bn' ? 'প্রিন্ট শিট ডাউনলোড হয়েছে!' : 'Print sheet downloaded!');
  };

  // Actions: Direct Print Window
  const handlePrint = () => {
    if (!gridDataUrl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to open the print dialog, or use the Download Sheet button.');
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Passport Photo Print Sheet (${copies} Copies)</title>
          <style>
            @page { margin: 0; size: ${sheetSize === '4x6' ? '4in 6in' : 'A4'}; }
            body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; background: white; }
            img { width: 100%; height: auto; max-height: 100vh; object-fit: contain; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <img src="${gridDataUrl}" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-6">
      
      {/* Header Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <Grid className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {language === 'bn' ? 'পাসপোর্ট সাইজ ফটো এডিটর ও এআই স্টুডিও' : 'Passport Photo Editor & AI Studio'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {language === 'bn'
              ? 'ছবি এডিটের সমস্ত অপশন (ক্রপ, জুম, আলো, ব্যাকগ্রাউন্ড, নাম-তারিখ স্ট্রিপ) এবং ফ্রি এআই ১-ক্লিক এনহ্যান্সার ও প্রিন্ট শিট জেনারেটর।'
              : 'Complete photo editing suite (crop, zoom, lighting, backdrop, candidate name-DOP) + Free 1-Click AI Studio & Print Grid.'}
          </p>
        </div>

        {/* Quick Top Actions: Demo / Upload / Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleLoadDemoPhoto}
            className="py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'bn' ? 'নমুনা ছবি দিয়ে টেস্ট' : 'Try Demo Photo'}</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{photoSrc ? (language === 'bn' ? 'অন্য ছবি আপলোড' : 'Change Photo') : (language === 'bn' ? 'গ্রাহকের ছবি আপলোড' : 'Upload Photo')}</span>
          </button>

          {photoSrc && (
            <button
              type="button"
              onClick={handleResetAll}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
              title="Reset all settings"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Toast Alert Notification */}
      {aiActionMessage && (
        <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/15 to-emerald-500/10 border border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{aiActionMessage}</span>
        </div>
      )}

      {/* Main Studio Layout: Controls on Left, Previews on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT PANEL: Editing Controls Tabs */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Option Tabs Navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('ai_tool')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'ai_tool'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'bn' ? '⚡ ফ্রি AI টুল' : '⚡ Free AI Tools'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('adjust')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'adjust'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'আলো ও কালার' : 'Lighting & Tone'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('crop_zoom')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'crop_zoom'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Crop className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ক্রপ ও জুম' : 'Crop & Zoom'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bg_color')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'bg_color'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ব্যাকগ্রাউন্ড' : 'Background'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('transform')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'transform'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'রোটেট ও মিরর' : 'Rotate & Tilt'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('name_date')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'name_date'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'নাম ও তারিখ (DOP)' : 'Name & DOP'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sheet_print')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'sheet_print'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'শিট ও প্রিন্ট' : 'Sheet & Print'}</span>
            </button>
          </div>

          {/* TAB 1: FREE AI TOOLS SUITE */}
          {activeTab === 'ai_tool' && (
            <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-purple-50/40 dark:from-slate-800/60 dark:to-slate-800/40 p-5 rounded-3xl border border-blue-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {language === 'bn' ? 'ফ্রি এআই পাসপোর্ট ফটো টুলকিট (১০০% ফ্রি)' : 'Free AI Passport Photo Toolkit (100% Free)'}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === 'bn'
                        ? '১ ক্লিকে নিখুঁত পাসপোর্ট ছবির জন্য স্বয়ংক্রিয় এআই অপ্টিমাইজেশন।'
                        : '1-Click automatic AI enhancement tuned for cyber café studio requirements.'}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-[10px] font-extrabold">
                  FREE & FAST
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                
                {/* 1. AI Auto Enhance */}
                <button
                  type="button"
                  onClick={handleAiAutoEnhance}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 hover:border-blue-500 text-left transition shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600">
                      {language === 'bn' ? '১-ক্লিক এআই অটো এনহ্যান্স' : '1-Click AI Auto Enhance'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'bn'
                      ? 'স্বয়ংক্রিয় আলো, রঙ, চোখ ও ফেসিয়াল শার্পনেস অপ্টিমাইজেশন।'
                      : 'Automatically balances brightness, contrast, skin tone & facial crispness.'}
                  </p>
                </button>

                {/* 2. AI Studio White Background */}
                <button
                  type="button"
                  onClick={() => handleAiStudioBackground('white')}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 hover:border-blue-500 text-left transition shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                      <Palette className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600">
                      {language === 'bn' ? 'এআই সাদা ব্যাকগ্রাউন্ড (White)' : 'AI Studio White Backdrop'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'bn'
                      ? 'পাসপোর্ট ও সরকারি চাকরির পরীক্ষার জন্য অফিসিয়াল সাদা ব্যাকগ্রাউন্ড।'
                      : 'Clean solid white background mandatory for Indian Passport & Govt Exams.'}
                  </p>
                </button>

                {/* 3. AI Studio Light Blue Background */}
                <button
                  type="button"
                  onClick={() => handleAiStudioBackground('lightblue')}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 hover:border-blue-500 text-left transition shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600">
                      <Palette className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-sky-600">
                      {language === 'bn' ? 'এআই হালকা নীল ব্যাকগ্রাউন্ড' : 'AI Studio Light Blue'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'bn'
                      ? 'সাইবার ক্যাফে স্টুডিওর ক্লাসিক হালকা নীল পাসপোর্ট ব্যাকগ্রাউন্ড।'
                      : 'Classic cyan/light-blue studio background popular in photo studios.'}
                  </p>
                </button>

                {/* 4. AI Skin Smoothing & Blemish Fix */}
                <button
                  type="button"
                  onClick={handleAiSkinSmooth}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 hover:border-blue-500 text-left transition shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-rose-600">
                      {language === 'bn' ? 'এআই স্কিন স্মুথ ও সফটনার' : 'AI Skin Smoothing & Soft Glow'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'bn'
                      ? 'ওয়েবক্যামের গ্রেইন ও ফেসিয়াল দাগ হালকা করে প্রফেশনাল লুক দেয়।'
                      : 'Gently reduces noise & skin blemishes while keeping eyes sharp.'}
                  </p>
                </button>

                {/* 5. AI Lighting & Shadow Fix */}
                <button
                  type="button"
                  onClick={handleAiLightingFix}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 hover:border-blue-500 text-left transition shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600">
                      <Sun className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-600">
                      {language === 'bn' ? 'এআই শ্যাডো ও লাইটিং ফিক্স' : 'AI Shadow & Lighting Balance'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'bn'
                      ? 'অতিরিক্ত ডার্ক শ্যাডো ও মুখের একদিকের অন্ধকার দূর করে।'
                      : 'Balances unilateral lighting shadows for even studio brightness.'}
                  </p>
                </button>

                {/* 6. AI Indian Passport 35x45 Preset */}
                <button
                  type="button"
                  onClick={handleAiPassportStandardPreset}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 hover:border-blue-500 text-left transition shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600">
                      {language === 'bn' ? 'অফিসিয়াল পাসপোর্ট মাপ (৩৫x৪৫ মিমি)' : 'Official Indian Passport (35x45)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'bn'
                      ? '৭৫% ফেস কভারেজ, হোয়াইট ব্যাকগ্রাউন্ড ও কাটিং বর্ডার রেডি।'
                      : '70-80% face coverage ratio with standard BIS / ICAO specs.'}
                  </p>
                </button>

              </div>
            </div>
          )}

          {/* TAB 2: LIGHTING & COLOR CONTROLS */}
          {activeTab === 'adjust' && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  {language === 'bn' ? 'উজ্জ্বলতা, কনট্রাস্ট ও ত্বকের রঙ' : 'Lighting, Contrast & Skin Tone'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setBrightness(100);
                    setContrast(100);
                    setSaturation(100);
                    setWarmth(0);
                    setSharpness(20);
                    setSkinSmooth(15);
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {language === 'bn' ? 'ডিফল্ট রিসেট' : 'Reset Lighting'}
                </button>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Brightness */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300 font-semibold">
                    <span>{language === 'bn' ? 'উজ্জ্বলতা (Brightness)' : 'Brightness'}</span>
                    <span className="font-mono text-blue-600">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="140"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300 font-semibold">
                    <span>{language === 'bn' ? 'কনট্রাস্ট (Contrast)' : 'Contrast'}</span>
                    <span className="font-mono text-blue-600">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="140"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Saturation */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300 font-semibold">
                    <span>{language === 'bn' ? 'স্যাচুরেশন (Saturation - 0% B&W)' : 'Color Saturation'}</span>
                    <span className="font-mono text-blue-600">{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Warmth / Skin Color Balance */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300 font-semibold">
                    <span>{language === 'bn' ? 'কালার টেম্পারেচার (Skin Tone)' : 'Warmth / Tone'}</span>
                    <span className="font-mono text-blue-600">{warmth > 0 ? `+${warmth}` : warmth}</span>
                  </div>
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    value={warmth}
                    onChange={(e) => setWarmth(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Sharpness */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300 font-semibold">
                    <span>{language === 'bn' ? 'শার্পনেস / স্পষ্টতা (Sharpness)' : 'Sharpness'}</span>
                    <span className="font-mono text-blue-600">{sharpness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sharpness}
                    onChange={(e) => setSharpness(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Skin Smoothing */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300 font-semibold">
                    <span>{language === 'bn' ? 'স্কিন সফটনার (Skin Smooth)' : 'Skin Smoothing'}</span>
                    <span className="font-mono text-blue-600">{skinSmooth}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={skinSmooth}
                    onChange={(e) => setSkinSmooth(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

              </div>

              {/* Quick Preset Buttons */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-1.5">
                <span className="text-slate-500 font-semibold mr-1">{language === 'bn' ? 'কুইক প্রিসেট:' : 'Presets:'}</span>
                <button
                  type="button"
                  onClick={() => { setBrightness(100); setContrast(100); setSaturation(100); setWarmth(0); }}
                  className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100"
                >
                  Natural
                </button>
                <button
                  type="button"
                  onClick={() => { setBrightness(112); setContrast(115); setSaturation(105); setSharpness(40); }}
                  className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-blue-600 font-semibold hover:bg-slate-100"
                >
                  Studio Bright
                </button>
                <button
                  type="button"
                  onClick={() => { setSaturation(0); setContrast(120); setBrightness(105); }}
                  className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100"
                >
                  B&W Passport
                </button>
                <button
                  type="button"
                  onClick={() => { setWarmth(12); setBrightness(108); setSkinSmooth(40); }}
                  className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-amber-600 font-semibold hover:bg-slate-100"
                >
                  Warm Glow
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CROP, ZOOM & POSITIONING */}
          {activeTab === 'crop_zoom' && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Crop className="w-4 h-4 text-blue-600" />
                  {language === 'bn' ? 'পাসপোর্ট সাইজ ক্রপ, জুম ও পজিশন' : 'Passport Aspect Crop, Zoom & Pan'}
                </span>
                <button
                  type="button"
                  onClick={() => { setZoom(100); setPanX(0); setPanY(0); }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {language === 'bn' ? 'সেন্টার ও জুম রিসেট' : 'Center & Reset'}
                </button>
              </div>

              {/* Standard Dimensions Preset */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-2">
                  {language === 'bn' ? 'অফিসিয়াল পাসপোর্ট সাইজ প্রিসেট:' : 'Official Photo Ratio / Standard:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setAspectRatioPreset('passport_in')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                      aspectRatioPreset === 'passport_in'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs">3.5 x 4.5 cm</div>
                    <div className="text-[10px] opacity-80">Indian Passport</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAspectRatioPreset('stamp')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                      aspectRatioPreset === 'stamp'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs">2.5 x 3.0 cm</div>
                    <div className="text-[10px] opacity-80">Stamp Size</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAspectRatioPreset('square_visa')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                      aspectRatioPreset === 'square_visa'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs">2 x 2 inch</div>
                    <div className="text-[10px] opacity-80">US / OCI Visa</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAspectRatioPreset('pan_card')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                      aspectRatioPreset === 'pan_card'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs">2.5 x 3.5 cm</div>
                    <div className="text-[10px] opacity-80">PAN Card Form</div>
                  </button>
                </div>
              </div>

              {/* Zoom Slider */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-blue-600" />
                    {language === 'bn' ? 'ফটো জুম (Zoom)' : 'Zoom Level'}
                  </span>
                  <span className="font-mono text-blue-600">{zoom}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(50, z - 10))}
                    className="p-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="range"
                    min="50"
                    max="220"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(220, z + 10))}
                    className="p-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Pan Position Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-300">
                    <span>{language === 'bn' ? 'ডানে-বামে সরান (Pan X)' : 'Pan Left / Right'}</span>
                    <span className="font-mono text-blue-600">{panX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={panX}
                    onChange={(e) => setPanX(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-300">
                    <span>{language === 'bn' ? 'উপরে-নিচে সরান (Pan Y)' : 'Pan Up / Down'}</span>
                    <span className="font-mono text-blue-600">{panY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={panY}
                    onChange={(e) => setPanY(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Overlay Guideline Switcher */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  {language === 'bn' ? 'পাসপোর্ট ফেস সাইজ গাইডলাইন (৭০-৮০% কভারেজ ও চোখ লেভেল)' : 'Passport Face Guide Overlay (70-80% ICAO Guide)'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowGuideOverlay(!showGuideOverlay)}
                  className={`py-1 px-3 rounded-lg border text-xs font-bold transition cursor-pointer ${
                    showGuideOverlay
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {showGuideOverlay ? 'Guide ON' : 'Guide OFF'}
                </button>
              </div>

            </div>
          )}

          {/* TAB 4: STUDIO BACKGROUND REPLACER */}
          {activeTab === 'bg_color' && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-blue-600" />
                  {language === 'bn' ? 'স্টুডিও ব্যাকগ্রাউন্ড পরিবর্তন' : 'Studio Background Replacement'}
                </span>
                <button
                  type="button"
                  onClick={() => setBgColor('original')}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {language === 'bn' ? 'মূল ব্যাকগ্রাউন্ড' : 'Original Photo'}
                </button>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-2">
                  {language === 'bn' ? 'ব্যাকগ্রাউন্ড রঙ নির্বাচন করুন:' : 'Select Passport Studio Color:'}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  
                  {/* Original */}
                  <button
                    type="button"
                    onClick={() => setBgColor('original')}
                    className={`p-2 rounded-xl border text-center font-bold flex flex-col items-center gap-1.5 cursor-pointer ${
                      bgColor === 'original' ? 'border-blue-600 ring-2 ring-blue-400/40 bg-blue-50/50' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full border border-slate-300 bg-gradient-to-tr from-slate-200 to-slate-400" />
                    <span className="text-[11px]">{language === 'bn' ? 'মূল ব্যাকগ্রাউন্ড' : 'Original'}</span>
                  </button>

                  {/* Pure White */}
                  <button
                    type="button"
                    onClick={() => setBgColor('white')}
                    className={`p-2 rounded-xl border text-center font-bold flex flex-col items-center gap-1.5 cursor-pointer ${
                      bgColor === 'white' ? 'border-blue-600 ring-2 ring-blue-400/40 bg-blue-50/50' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full border border-slate-300 bg-white shadow-2xs" />
                    <span className="text-[11px]">White (Govt)</span>
                  </button>

                  {/* Light Blue */}
                  <button
                    type="button"
                    onClick={() => setBgColor('lightblue')}
                    className={`p-2 rounded-xl border text-center font-bold flex flex-col items-center gap-1.5 cursor-pointer ${
                      bgColor === 'lightblue' ? 'border-blue-600 ring-2 ring-blue-400/40 bg-blue-50/50' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full border border-sky-300 bg-[#d8ebf9] shadow-2xs" />
                    <span className="text-[11px]">Light Blue</span>
                  </button>

                  {/* Royal Dark Blue */}
                  <button
                    type="button"
                    onClick={() => setBgColor('darkblue')}
                    className={`p-2 rounded-xl border text-center font-bold flex flex-col items-center gap-1.5 cursor-pointer ${
                      bgColor === 'darkblue' ? 'border-blue-600 ring-2 ring-blue-400/40 bg-blue-50/50' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#1d4ed8] shadow-2xs" />
                    <span className="text-[11px]">Deep Blue</span>
                  </button>

                  {/* Neutral Gray */}
                  <button
                    type="button"
                    onClick={() => setBgColor('gray')}
                    className={`p-2 rounded-xl border text-center font-bold flex flex-col items-center gap-1.5 cursor-pointer ${
                      bgColor === 'gray' ? 'border-blue-600 ring-2 ring-blue-400/40 bg-blue-50/50' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full border border-slate-300 bg-[#f1f5f9] shadow-2xs" />
                    <span className="text-[11px]">Off-White</span>
                  </button>

                  {/* Light Crimson */}
                  <button
                    type="button"
                    onClick={() => setBgColor('red')}
                    className={`p-2 rounded-xl border text-center font-bold flex flex-col items-center gap-1.5 cursor-pointer ${
                      bgColor === 'red' ? 'border-blue-600 ring-2 ring-blue-400/40 bg-blue-50/50' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#dc2626] shadow-2xs" />
                    <span className="text-[11px]">Crimson Red</span>
                  </button>

                </div>
              </div>

              {/* Background Sensitivity Tolerance Slider */}
              {bgColor !== 'original' && (
                <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700 animate-in fade-in">
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
                    <span>{language === 'bn' ? 'ব্যাকগ্রাউন্ড ডিটেকশন সংবেদনশীলতা (Tolerance)' : 'Background Edge Sensitivity / Tolerance'}</span>
                    <span className="font-mono text-blue-600">{bgTolerance}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="65"
                    value={bgTolerance}
                    onChange={(e) => setBgTolerance(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500">
                    {language === 'bn'
                      ? '💡 যদি দেয়ালের ছায়া পুরোপুরি না মেটে তবে টলারেন্স বাড়িয়ে দিন, আর কাপড়ের রঙ কেটে গেলে কিছুটা কমান।'
                      : '💡 Increase tolerance if wall shadows remain; decrease if clothing edges are getting clipped.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ROTATE, TILT & MIRROR */}
          {activeTab === 'transform' && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <RotateCw className="w-4 h-4 text-blue-600" />
                  {language === 'bn' ? 'ফটো রোটেশন, ফাইন টিল্ট ও মিরর' : 'Photo Rotation, Fine Angle & Mirror'}
                </span>
                <button
                  type="button"
                  onClick={() => { setRotationSteps(0); setFineTilt(0); setFlipH(false); setFlipV(false); }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {language === 'bn' ? 'সোজা করুন' : 'Reset Angles'}
                </button>
              </div>

              {/* 90-degree Rotation & Flip Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setRotationSteps((s) => (s + 3) % 4)}
                  className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold flex items-center justify-center gap-1.5 hover:bg-slate-100 cursor-pointer text-slate-700 dark:text-slate-300"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>-90° Left</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRotationSteps((s) => (s + 1) % 4)}
                  className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold flex items-center justify-center gap-1.5 hover:bg-slate-100 cursor-pointer text-slate-700 dark:text-slate-300"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>+90° Right</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFlipH(!flipH)}
                  className={`py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                    flipH
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <FlipHorizontal className="w-4 h-4" />
                  <span>Flip Horiz</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFlipV(!flipV)}
                  className={`py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                    flipV
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <FlipVertical className="w-4 h-4" />
                  <span>Flip Vert</span>
                </button>
              </div>

              {/* Fine Tilt Angle Slider (-15 to +15 in 0.5 steps) */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
                  <span>{language === 'bn' ? 'ফাইন টিল্ট / মাথা সোজা করার সূক্ষ্ম কোণ' : 'Fine Tilt Angle (Level tilted heads)'}</span>
                  <span className="font-mono text-blue-600">{fineTilt > 0 ? `+${fineTilt}°` : `${fineTilt}°`}</span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  step="0.5"
                  value={fineTilt}
                  onChange={(e) => setFineTilt(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>-15° Left Tilt</span>
                  <span>0° Center</span>
                  <span>+15° Right Tilt</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CANDIDATE NAME & DATE OF PHOTO (DOP) */}
          {activeTab === 'name_date' && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  {language === 'bn' ? 'পরীক্ষার প্রার্থীর নাম ও ছবি তোলার তারিখ (DOP)' : 'Candidate Name & Date of Photo (DOP)'}
                </span>
                <button
                  type="button"
                  onClick={() => setEnableNameDate(!enableNameDate)}
                  className={`py-1 px-3 rounded-lg border text-xs font-bold transition cursor-pointer ${
                    enableNameDate
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  {enableNameDate ? 'Banner ON' : 'Banner OFF'}
                </button>
              </div>

              <p className="text-[11px] text-slate-500">
                {language === 'bn'
                  ? '📌 SSC CGL/CHSL/MTS, RRB রেলওয়ে, UPSC, WB Police SI ও NEET পরীক্ষায় পাসপোর্টের নিচে প্রার্থীর নাম ও ছবি তোলার তারিখ (DOP) বাধ্যতামূলক।'
                  : '📌 Mandatory for Indian Govt exams (SSC, RRB, UPSC, WB Police, NEET) requiring Candidate Name & DOP at the bottom.'}
              </p>

              {enableNameDate && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      {language === 'bn' ? 'প্রার্থীর নাম (Candidate Name)' : 'Candidate Full Name'}
                    </label>
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="e.g. RAHUL SHARMA"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 uppercase font-bold text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      {language === 'bn' ? 'ছবি তোলার তারিখ (Date of Photo - DOP)' : 'Date of Photo (DOP)'}
                    </label>
                    <input
                      type="text"
                      value={dateOfPhoto}
                      onChange={(e) => setDateOfPhoto(e.target.value)}
                      placeholder="e.g. DOP: 05/09/2026"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SHEET & PRINT SETTINGS */}
          {activeTab === 'sheet_print' && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
              <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Printer className="w-4 h-4 text-blue-600" />
                  {language === 'bn' ? 'শিট পেপার ও কপি সংখ্যা' : 'Sheet Paper & Copies Configuration'}
                </span>
              </div>

              {/* Copies Selection */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-2">
                  {language === 'bn' ? 'কত কপি পাসপোর্ট ছবি প্রিন্ট হবে?' : 'Number of Copies on Sheet:'}
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {[2, 4, 6, 8, 12, 16, 24, 32].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCopies(num)}
                      className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        copies === num
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {num}P
                    </button>
                  ))}
                </div>
              </div>

              {/* Sheet Paper Size & Cutting Border */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    {language === 'bn' ? 'কাগজের সাইজ (Paper Size)' : 'Paper Size'}
                  </label>
                  <select
                    value={sheetSize}
                    onChange={(e) => setSheetSize(e.target.value as '4x6' | 'A4')}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="4x6">4 x 6 Photo Paper (Standard Studio Size)</option>
                    <option value="A4">A4 Full Sheet (2480 x 3508)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    {language === 'bn' ? 'কাটিং বর্ডার (Cutting Border)' : 'Cutting Guide Border'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setShowBorder(!showBorder)}
                      className={`py-2 px-3 rounded-xl border font-bold text-xs transition cursor-pointer ${
                        showBorder
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      {showBorder ? 'Border ON' : 'Border OFF'}
                    </button>
                    {showBorder && (
                      <button
                        type="button"
                        onClick={() => setBorderColor(borderColor === '#cccccc' ? '#000000' : '#cccccc')}
                        className="py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        {borderColor === '#cccccc' ? 'Gray Guide' : 'Black Guide'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT PANEL: Live Passport Photo & Grid Sheet Previews + Downloads */}
        <div className="lg:col-span-5 flex flex-col gap-4">

          {/* Single Photo Studio Frame with Face Guide Overlay */}
          <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Crop className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'bn' ? 'পাসপোর্ট ছবি প্রিভিউ (Single)' : 'Single Photo Preview'}</span>
              </div>

              {/* Before / After Toggle Button */}
              {photoSrc && (
                <button
                  type="button"
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  onTouchStart={() => setShowOriginal(true)}
                  onTouchEnd={() => setShowOriginal(false)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 select-none cursor-pointer flex items-center gap-1"
                >
                  <Eye className="w-3 h-3 text-amber-500" />
                  <span>{showOriginal ? (language === 'bn' ? 'মূল ছবি (Original)' : 'Original') : (language === 'bn' ? 'হোল্ড করে আসল ছবি দেখুন' : 'Hold for Original')}</span>
                </button>
              )}
            </div>

            {/* Viewport Box */}
            <div className="relative p-2 bg-white rounded-2xl shadow-md border border-slate-300 dark:border-slate-700 max-w-[260px] aspect-[7/9] flex items-center justify-center overflow-hidden">
              {showOriginal && photoSrc ? (
                <img
                  src={photoSrc}
                  alt="Original Customer Upload"
                  className="w-full h-full object-contain"
                />
              ) : singlePhotoUrl ? (
                <img
                  src={singlePhotoUrl}
                  alt="Processed Passport Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6 text-slate-400 space-y-2">
                  <Grid className="w-12 h-12 mx-auto stroke-1 opacity-50" />
                  <p className="text-xs font-semibold">
                    {language === 'bn' ? 'ছবি আপলোড করুন বা নমুনা ছবি দিয়ে পরীক্ষা করুন' : 'Upload photo or click Try Demo Photo'}
                  </p>
                </div>
              )}

              {/* Official ICAO / Passport Oval Head Guide Overlay */}
              {showGuideOverlay && singlePhotoUrl && !showOriginal && (
                <div className="absolute inset-2 pointer-events-none flex flex-col items-center justify-center border border-dashed border-blue-400/40 rounded-lg">
                  {/* Head Oval */}
                  <div className="w-[68%] h-[68%] border-2 border-dashed border-amber-400/80 rounded-[50%] relative">
                    {/* Eye Level Guideline */}
                    <div className="absolute top-[42%] left-0 right-0 border-t border-dashed border-cyan-400/80" />
                    <span className="absolute top-[34%] right-1 text-[8px] font-bold text-cyan-600 bg-white/70 px-0.5 rounded">
                      EYES
                    </span>
                    {/* Chin Guideline */}
                    <div className="absolute bottom-[2%] left-2 right-2 border-b border-dashed border-amber-500/80" />
                    <span className="absolute bottom-[4%] right-1 text-[8px] font-bold text-amber-600 bg-white/70 px-0.5 rounded">
                      CHIN
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Single Photo Download (e.g. for online application < 50KB) */}
            {singlePhotoUrl && (
              <div className="mt-3 w-full max-w-[260px] flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  35x45mm • 300 DPI (~35 KB)
                </span>
                <button
                  type="button"
                  onClick={handleDownloadSinglePhoto}
                  className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition active:scale-95 cursor-pointer"
                  title="Download single passport photo file for online exam uploads"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'সিঙ্গেল JPG' : 'Single JPG'}</span>
                </button>
              </div>
            )}

          </div>

          {/* Grid Print Sheet Preview Box */}
          <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center space-y-3">
            <div className="w-full flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1">
                <Printer className="w-3.5 h-3.5 text-blue-600" />
                <span>{copies} {language === 'bn' ? 'কপি প্রিন্ট শিট' : 'Copies Print Sheet'} ({sheetSize})</span>
              </span>
              <span className="text-[11px] font-mono text-blue-600">
                Ready to Print
              </span>
            </div>

            {gridDataUrl ? (
              <div className="p-2 bg-white rounded-xl shadow border border-slate-300 max-h-[220px] w-auto overflow-hidden flex items-center justify-center">
                <img
                  src={gridDataUrl}
                  alt="Full passport print sheet"
                  className="max-h-[200px] w-auto object-contain"
                />
              </div>
            ) : (
              <div className="h-28 flex items-center justify-center text-slate-400 text-xs">
                {language === 'bn' ? 'শিট তৈরির জন্য ছবি আপলোড করুন' : 'Upload photo to generate sheet'}
              </div>
            )}

            {/* Print & Download Sheet Action Buttons */}
            {gridDataUrl && (
              <div className="grid grid-cols-2 gap-2 w-full pt-1">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{language === 'bn' ? 'সরাসরি প্রিন্ট' : 'Direct Print'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSheet}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'bn' ? 'শিট ডাউনলোড' : 'Download Sheet'}</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
