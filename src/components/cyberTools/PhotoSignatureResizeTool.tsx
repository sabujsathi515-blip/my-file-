import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RefreshCw, Image as ImageIcon, Sliders, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Language } from '../../types';

interface Preset {
  nameEn: string;
  nameBn: string;
  width: number;
  height: number;
  minKb: number;
  maxKb: number;
  descriptionEn: string;
  descriptionBn: string;
}

const PRESETS: Preset[] = [
  {
    nameEn: 'WB Police Photo',
    nameBn: 'পশ্চিমবঙ্গ পুলিশ ছবি',
    width: 200,
    height: 230,
    minKb: 20,
    maxKb: 50,
    descriptionEn: '200x230 px, Size: 20KB - 50KB (WBPRB Standard)',
    descriptionBn: '২০০x২৩০ পিক্সেল, সাইজ: ২০-৫০ কেবি'
  },
  {
    nameEn: 'WB Police Signature',
    nameBn: 'পশ্চিমবঙ্গ পুলিশ স্বাক্ষর',
    width: 200,
    height: 60,
    minKb: 10,
    maxKb: 20,
    descriptionEn: '200x60 px, Size: 10KB - 20KB (WBPRB Standard)',
    descriptionBn: '২০০x৬০ পিক্সেল, সাইজ: ১০-২০ কেবি'
  },
  {
    nameEn: 'SSC Photo (CGL/MTS/GD)',
    nameBn: 'এসএসসি (SSC) ছবি',
    width: 240,
    height: 300,
    minKb: 20,
    maxKb: 50,
    descriptionEn: '3.5 x 4.5 cm (~240x300 px), Size: 20KB - 50KB',
    descriptionBn: '৩.৫x৪.৫ সেমি, সাইজ: ২০-৫০ কেবি'
  },
  {
    nameEn: 'SSC Signature',
    nameBn: 'এসএসসি (SSC) স্বাক্ষর',
    width: 240,
    height: 120,
    minKb: 10,
    maxKb: 20,
    descriptionEn: '4.0 x 2.0 cm, Size: 10KB - 20KB',
    descriptionBn: '৪.০x২.০ সেমি, সাইজ: ১০-২০ কেবি'
  },
  {
    nameEn: 'Railway RRB Photo',
    nameBn: 'রেলওয়ে (RRB) ছবি',
    width: 240,
    height: 320,
    minKb: 30,
    maxKb: 70,
    descriptionEn: '35mm x 45mm, Size: 30KB - 70KB JPG',
    descriptionBn: '৩৫x৪৫ মিমি, সাইজ: ৩০-৭০ কেবি'
  },
  {
    nameEn: 'UPSC / WBPSC Photo',
    nameBn: 'ইউপিএসসি / ডব্লিউবিপিএসসি ছবি',
    width: 350,
    height: 450,
    minKb: 20,
    maxKb: 300,
    descriptionEn: 'Clear white background, 20KB - 300KB',
    descriptionBn: 'সাদা ব্যাকগ্রাউন্ড, ২০-৩০০ কেবি'
  }
];

export const PhotoSignatureResizeTool: React.FC<{ language: Language }> = ({ language }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(200);
  const [height, setHeight] = useState<number>(230);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(false);
  const [quality, setQuality] = useState<number>(0.85);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');
  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);
  const [resultSizeKb, setResultSizeKb] = useState<number>(0);
  const [activePreset, setActivePreset] = useState<string>('WB Police Photo');
  const [addNameDate, setAddNameDate] = useState<boolean>(false);
  const [candidateName, setCandidateName] = useState<string>('');
  const [photoDate, setPhotoDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const applyPreset = (preset: Preset) => {
    setActivePreset(preset.nameEn);
    setWidth(preset.width);
    setHeight(preset.height);
    // Find initial quality estimation
    setQuality(0.85);
  };

  // Re-render canvas whenever params change
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background white
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Draw image
      ctx.drawImage(img, 0, 0, width, height);

      // Add Name & Date overlay if selected (standard for govt exams)
      if (addNameDate && (candidateName.trim() || photoDate)) {
        const barHeight = Math.max(28, Math.floor(height * 0.16));
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(0, height - barHeight, width, barHeight);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, height - barHeight, width, barHeight);

        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        const fontSize = Math.max(10, Math.floor(barHeight * 0.36));
        ctx.font = `bold ${fontSize}px sans-serif`;

        if (candidateName.trim()) {
          ctx.fillText(candidateName.toUpperCase(), width / 2, height - barHeight + fontSize + 2);
        }
        if (photoDate) {
          ctx.font = `${Math.max(9, fontSize - 2)}px sans-serif`;
          ctx.fillText(`DOB/DOP: ${photoDate}`, width / 2, height - 4);
        }
      }

      const dataUrl = canvas.toDataURL(outputFormat, quality);
      setResultDataUrl(dataUrl);

      // Estimate byte length
      const stringLength = dataUrl.length - 'data:image/jpeg;base64,'.length;
      const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383687;
      setResultSizeKb(Math.round(sizeInBytes / 1024));
    };
    img.src = imageSrc;
  }, [imageSrc, width, height, quality, outputFormat, addNameDate, candidateName, photoDate]);

  const downloadProcessedImage = () => {
    if (!resultDataUrl) return;
    const link = document.createElement('a');
    link.href = resultDataUrl;
    link.download = `resized_${width}x${height}_${resultSizeKb}KB.${outputFormat === 'image/jpeg' ? 'jpg' : 'png'}`;
    link.click();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-7 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            {language === 'bn' ? 'অনলাইন ফটো ও সিগনেচার রিসাইজ টুল' : 'Online Photo & Signature Resize Tool'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {language === 'bn' 
              ? 'চাকরির ফর্ম ফিলাপের জন্য সঠিক পিক্সেল এবং নির্দিষ্ট কেবি (KB)-তে ছবি বা স্বাক্ষর তৈরি করুন।'
              : 'Resize and compress photos & signatures to exact pixels and KB requirements for government portals.'}
          </p>
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          {language === 'bn' ? 'জনপ্রিয় সরকারি পরীক্ষার প্রিসেট (১-ক্লিক)' : 'Popular Govt Exam Presets (1-Click)'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PRESETS.map((preset) => {
            const isSelected = activePreset === preset.nameEn;
            return (
              <button
                key={preset.nameEn}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-200 shadow-sm font-semibold'
                    : 'border-slate-200 hover:border-blue-300 dark:border-slate-800 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-medium truncate">{language === 'bn' ? preset.nameBn : preset.nameEn}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{preset.width}x{preset.height} px</div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-mono mt-0.5">{preset.minKb}-{preset.maxKb} KB</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Upload & Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Upload Dropzone */}
          <div>
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
              className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-xl p-6 text-center bg-slate-50/60 dark:bg-slate-800/40 transition flex flex-col items-center justify-center cursor-pointer group"
            >
              <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {imageSrc 
                  ? (language === 'bn' ? 'অন্য ছবি আপলোড করুন' : 'Change / Upload New Photo') 
                  : (language === 'bn' ? 'কম্পিউটার বা মোবাইল থেকে ছবি সিলেক্ট করুন' : 'Click to Upload Photo / Signature')}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports JPG, PNG, WEBP (Max 20MB)
              </span>
            </button>
          </div>

          {/* Width, Height, Format controls */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {language === 'bn' ? 'প্রস্থ (Width px)' : 'Width (px)'}
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Math.max(20, Number(e.target.value)))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {language === 'bn' ? 'উচ্চতা (Height px)' : 'Height (px)'}
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Math.max(20, Number(e.target.value)))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {language === 'bn' ? 'ফরম্যাট' : 'Format'}
              </label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as 'image/jpeg' | 'image/png')}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="image/jpeg">JPG / JPEG</option>
                <option value="image/png">PNG</option>
              </select>
            </div>
          </div>

          {/* Quality & File Size Tuning Slider */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600" />
                {language === 'bn' ? 'কম্প্রেশন ও ফাইলের আকার নিয়ন্ত্রণ (KB Control)' : 'File Compression & Target Size'}
              </span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded">
                Quality: {Math.round(quality * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.02"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Small Size (Low KB)</span>
              <span>Balanced (Recommended)</span>
              <span>High Quality (High KB)</span>
            </div>
          </div>

          {/* Option: Add Name & Date Stamp (Standard for SSC/PSC/Police) */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={addNameDate}
                onChange={(e) => setAddNameDate(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {language === 'bn' ? 'ছবির নিচে নাম ও তারিখের বার (Name & Date on Photo) যুক্ত করুন' : 'Add Name & Date Stamp at bottom of photo'}
              </span>
            </label>

            {addNameDate && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                    {language === 'bn' ? 'প্রার্থীর নাম' : 'Candidate Name'}
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="e.g. SOURAV MONDAL"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-xs uppercase focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                    {language === 'bn' ? 'ছবির তারিখ' : 'Photo Date (DOP)'}
                  </label>
                  <input
                    type="date"
                    value={photoDate}
                    onChange={(e) => setPhotoDate(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Output Preview & Instant Download */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[350px]">
          {resultDataUrl ? (
            <div className="w-full flex flex-col items-center space-y-4">
              <div className="relative p-2 bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-200 dark:border-slate-800 flex items-center justify-center max-w-[280px] max-h-[320px] overflow-hidden">
                <img
                  src={resultDataUrl}
                  alt="Processed preview"
                  style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain' }}
                  className="rounded border border-slate-300 dark:border-slate-700 shadow-inner"
                />
              </div>

              {/* Status Badge */}
              <div className="w-full bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">{language === 'bn' ? 'আউটপুট রেজোলিউশন:' : 'Output Resolution:'}</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{width} x {height} px</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">{language === 'bn' ? 'ফাইল সাইজ:' : 'Estimated File Size:'}</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    {resultSizeKb} KB
                  </span>
                </div>
              </div>

              {/* Download Button */}
              <button
                type="button"
                onClick={downloadProcessedImage}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                {language === 'bn' ? 'রিসাইজড ছবি ডাউনলোড করুন' : 'Download Resized Image'}
              </button>
            </div>
          ) : (
            <div className="text-center p-6 text-slate-400 dark:text-slate-600">
              <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-40 stroke-1" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {language === 'bn' ? 'প্রিভিউ দেখতে বামপাশ থেকে ছবি আপলোড করুন' : 'Upload an image on the left to see live preview'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'bn' ? 'রেজোলিউশন ও কেবি পরিবর্তন স্বয়ংক্রিয়ভাবে আপডেট হবে' : 'Changes to resolution and quality will update instantly'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
