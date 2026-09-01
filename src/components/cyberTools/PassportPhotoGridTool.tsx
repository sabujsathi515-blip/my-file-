import React, { useState, useRef, useEffect } from 'react';
import { Upload, Printer, Download, Grid, Layers, Sparkles, Sliders } from 'lucide-react';
import { Language } from '../../types';

export const PassportPhotoGridTool: React.FC<{ language: Language }> = ({ language }) => {
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [copies, setCopies] = useState<number>(8);
  const [sheetSize, setSheetSize] = useState<'4x6' | 'A4'>('4x6');
  const [showBorder, setShowBorder] = useState<boolean>(true);
  const [gridDataUrl, setGridDataUrl] = useState<string | null>(null);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [bgColor, setBgColor] = useState<'original' | 'white' | 'lightblue'>('original');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const printAreaRef = useRef<HTMLDivElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoSrc(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!photoSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // 4x6 at 300 DPI = 1200 x 1800 px (or 1800 x 1200 landscape)
      // A4 at 300 DPI = 2480 x 3508 px
      const isA4 = sheetSize === 'A4';
      const canvasWidth = isA4 ? 2480 : 1800;
      const canvasHeight = isA4 ? 3508 : 1200;

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill white background for print paper
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Single passport photo size: 3.5cm x 4.5cm approx 413 x 531 px at 300 DPI
      const photoWidth = isA4 ? 413 : 360;
      const photoHeight = isA4 ? 531 : 460;
      const gapX = isA4 ? 60 : 50;
      const gapY = isA4 ? 60 : 50;

      // Calculate grid columns and rows based on count
      let cols = 4;
      if (copies === 4) cols = 2;
      else if (copies === 8) cols = 4;
      else if (copies === 12) cols = 4;
      else if (copies === 16) cols = 4;
      else if (copies === 32) cols = 6;

      const rows = Math.ceil(copies / cols);

      // Center the grid on the sheet
      const totalGridW = cols * photoWidth + (cols - 1) * gapX;
      const totalGridH = rows * photoHeight + (rows - 1) * gapY;
      const startX = (canvasWidth - totalGridW) / 2;
      const startY = (canvasHeight - totalGridH) / 2;

      // Draw off-screen adjusted single image first
      const singleCanvas = document.createElement('canvas');
      singleCanvas.width = photoWidth;
      singleCanvas.height = photoHeight;
      const sCtx = singleCanvas.getContext('2d');
      if (!sCtx) return;

      if (bgColor === 'lightblue') {
        sCtx.fillStyle = '#cbe4f9';
        sCtx.fillRect(0, 0, photoWidth, photoHeight);
      } else {
        sCtx.fillStyle = '#ffffff';
        sCtx.fillRect(0, 0, photoWidth, photoHeight);
      }

      sCtx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      sCtx.drawImage(img, 0, 0, photoWidth, photoHeight);
      sCtx.filter = 'none';

      // Draw cutting border on single photo if enabled
      if (showBorder) {
        sCtx.strokeStyle = '#cccccc';
        sCtx.lineWidth = 2;
        sCtx.strokeRect(1, 1, photoWidth - 2, photoHeight - 2);
      }

      // Draw repeatedly in the grid
      let count = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (count >= copies) break;
          const x = startX + c * (photoWidth + gapX);
          const y = startY + r * (photoHeight + gapY);
          ctx.drawImage(singleCanvas, x, y);
          count++;
        }
      }

      const outUrl = canvas.toDataURL('image/jpeg', 0.95);
      setGridDataUrl(outUrl);
    };
    img.src = photoSrc;
  }, [photoSrc, copies, sheetSize, showBorder, brightness, contrast, bgColor]);

  const handlePrint = () => {
    if (!gridDataUrl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to open the print dialog, or use the Download Sheet button.');
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Passport Photo Sheet Print</title>
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

  const handleDownloadSheet = () => {
    if (!gridDataUrl) return;
    const a = document.createElement('a');
    a.href = gridDataUrl;
    a.download = `passport_photos_${copies}copies_${sheetSize}.jpg`;
    a.click();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-7 shadow-sm">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Grid className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          {language === 'bn' ? 'পাসপোর্ট সাইজ ফটো শিট জেনারেটর (প্রিন্ট রেডি)' : 'Passport Photo Sheet Generator (Print-Ready)'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {language === 'bn'
            ? '৪x৬ ইঞ্চি ফটো পেপার বা A4 পেপারে ৪, ৮, ১২ বা ১৬ কপি পাসপোর্ট ছবি তৈরি করে সরাসরি প্রিন্ট করুন।'
            : 'Generate multiple copies of passport photos arranged perfectly on 4x6 inch or A4 paper with cutting guides.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Controls */}
        <div className="lg:col-span-6 space-y-4">
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
            className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-xl p-5 text-center bg-slate-50/60 dark:bg-slate-800/40 transition flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="w-7 h-7 text-blue-600 dark:text-blue-400 mb-2" />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {photoSrc 
                ? (language === 'bn' ? 'অন্য পাসপোর্ট ছবি নির্বাচন করুন' : 'Choose Different Photo') 
                : (language === 'bn' ? 'গ্রাহকের পাসপোর্ট ছবি আপলোড করুন' : 'Upload Customer Passport Photo')}
            </span>
          </button>

          {/* Number of Copies */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {language === 'bn' ? 'কপি সংখ্যা (Number of Copies)' : 'Select Copies to Print'}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[4, 8, 12, 16, 32].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCopies(num)}
                  className={`py-2 text-xs font-bold rounded-lg border transition ${
                    copies === num
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                  }`}
                >
                  {num} Copies
                </button>
              ))}
            </div>
          </div>

          {/* Paper Size & Border */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {language === 'bn' ? 'কাগজের সাইজ' : 'Paper Size'}
              </label>
              <select
                value={sheetSize}
                onChange={(e) => setSheetSize(e.target.value as '4x6' | 'A4')}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="4x6">4 x 6 Photo Paper (Standard)</option>
                <option value="A4">A4 Full Sheet (2480x3508)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {language === 'bn' ? 'কাটিং বর্ডার' : 'Cutting Border'}
              </label>
              <button
                type="button"
                onClick={() => setShowBorder(!showBorder)}
                className={`w-full py-1.5 px-3 rounded-lg border text-xs font-semibold transition ${
                  showBorder
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {showBorder ? (language === 'bn' ? 'বর্ডার চালু (ON)' : 'Border ON') : (language === 'bn' ? 'বর্ডার বন্ধ (OFF)' : 'Border OFF')}
              </button>
            </div>
          </div>

          {/* Brightness & Contrast Adjustment */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                {language === 'bn' ? 'উজ্জ্বলতা ও কনট্রাস্ট অ্যাডজাস্ট' : 'Brightness & Contrast'}
              </span>
              <button
                type="button"
                onClick={() => { setBrightness(100); setContrast(100); }}
                className="text-[11px] text-blue-600 hover:underline"
              >
                Reset
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Brightness: {brightness}%</label>
                <input
                  type="range"
                  min="80"
                  max="140"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Contrast: {contrast}%</label>
                <input
                  type="range"
                  min="80"
                  max="140"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Grid Sheet Preview & Action Buttons */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[380px]">
          {gridDataUrl ? (
            <div className="w-full space-y-4 flex flex-col items-center">
              <div className="p-3 bg-white shadow-lg rounded border border-slate-300 max-w-[340px] max-h-[340px] overflow-hidden flex items-center justify-center">
                <img
                  src={gridDataUrl}
                  alt="Passport photo grid"
                  className="max-h-[300px] w-auto object-contain shadow-sm"
                />
              </div>

              <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{copies} Copies</span> on{' '}
                <span className="font-mono text-blue-600 dark:text-blue-400">{sheetSize} Sheet</span> (Ready to Print)
              </div>

              <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  {language === 'bn' ? 'সরাসরি প্রিন্ট দিন' : 'Print Sheet'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSheet}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  {language === 'bn' ? 'শিট ডাউনলোড' : 'Download JPG'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 text-slate-400">
              <Grid className="w-14 h-14 mx-auto mb-2 opacity-40 stroke-1" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {language === 'bn' ? 'ফটো শিট তৈরি করতে ছবি নির্বাচন করুন' : 'Upload photo to generate instant printable grid'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
