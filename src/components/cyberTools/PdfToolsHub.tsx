import React, { useState } from 'react';
import { FileText, Upload, Download, Trash2, ArrowUp, ArrowDown, CheckCircle2, Lock, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { Language } from '../../types';

interface UploadedImage {
  id: string;
  name: string;
  dataUrl: string;
  sizeKb: number;
}

export const PdfToolsHub: React.FC<{ language: Language }> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'jpg_to_pdf' | 'pdf_merge_split' | 'compress_info'>('jpg_to_pdf');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'fit'>('a4');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [pdfFileName, setPdfFileName] = useState<string>('Document_Scanned');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const item: UploadedImage = {
          id: 'img-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          name: file.name,
          dataUrl: event.target?.result as string,
          sizeKb: Math.round(file.size / 1024)
        };
        setImages((prev) => [...prev, item]);
      };
      reader.readAsDataURL(file);
    });
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    setImages((prev) => {
      const next = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const generateAndDownloadPdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const imgItem of images) {
        let embeddedImage;
        const isPng = imgItem.dataUrl.startsWith('data:image/png');

        if (isPng) {
          embeddedImage = await pdfDoc.embedPng(imgItem.dataUrl);
        } else {
          // Defaults to JPG
          embeddedImage = await pdfDoc.embedJpg(imgItem.dataUrl);
        }

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        if (pageSize === 'a4') {
          // Standard A4 in points: 595.28 x 841.89
          const page = pdfDoc.addPage([595.28, 841.89]);
          const pageWidth = page.getWidth();
          const pageHeight = page.getHeight();
          const margin = 20;
          const maxWidth = pageWidth - margin * 2;
          const maxHeight = pageHeight - margin * 2;

          const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);
          const scaledWidth = imgWidth * scale;
          const scaledHeight = imgHeight * scale;

          page.drawImage(embeddedImage, {
            x: (pageWidth - scaledWidth) / 2,
            y: (pageHeight - scaledHeight) / 2,
            width: scaledWidth,
            height: scaledHeight
          });
        } else {
          // Fit page strictly to image dimensions
          const page = pdfDoc.addPage([imgWidth, imgHeight]);
          page.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: imgWidth,
            height: imgHeight
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pdfFileName.trim() || 'Document'}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error generating PDF. Please ensure valid JPG or PNG images.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-7 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            {language === 'bn' ? 'সাইবার ক্যাফে PDF টুলস হাব' : 'Cyber Café PDF Tools Hub'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {language === 'bn' 
              ? 'স্ক্যান করা ছবি থেকে PDF তৈরি, মার্জ ও সাইজ নিয়ন্ত্রণের কার্যকর টুল।' 
              : 'Convert scanned images to PDF, combine multi-page certificates, and manage PDF documents.'}
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('jpg_to_pdf')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'jpg_to_pdf'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {language === 'bn' ? 'JPG to PDF কনভার্টার' : 'JPG to PDF'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pdf_merge_split')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'pdf_merge_split'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {language === 'bn' ? 'PDF মার্জ ও স্প্লিট গাইড' : 'Merge & Split Guide'}
          </button>
        </div>
      </div>

      {activeTab === 'jpg_to_pdf' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Upload Area */}
            <div className="md:col-span-6 space-y-4">
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-xl p-6 text-center bg-slate-50/60 dark:bg-slate-800/40 transition flex flex-col items-center justify-center cursor-pointer group">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {language === 'bn' ? 'এক বা একাধিক ছবি / স্ক্যান ফাইল সিলেক্ট করুন' : 'Select One or Multiple Images to Combine'}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Supports JPG, PNG (Madhyamik Admit, Marksheet, Aadhaar, etc.)
                </span>
              </label>

              {/* PDF Settings */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {language === 'bn' ? 'পিডিএফ ফাইলের নাম' : 'PDF File Name'}
                    </label>
                    <input
                      type="text"
                      value={pdfFileName}
                      onChange={(e) => setPdfFileName(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {language === 'bn' ? 'পৃষ্ঠার সাইজ' : 'Page Size Mode'}
                    </label>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value as 'a4' | 'fit')}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="a4">Standard A4 (Portrait Centered)</option>
                      <option value="fit">Original Image Size (Fit)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={generateAndDownloadPdf}
                  disabled={images.length === 0 || isGenerating}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition ${
                    images.length > 0 && !isGenerating
                      ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-98'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {language === 'bn' ? 'পিডিএফ তৈরি হচ্ছে...' : 'Generating PDF...'}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      {language === 'bn' 
                        ? `পিডিএফ তৈরি ও ডাউনলোড করুন (${images.length} পৃষ্ঠা)` 
                        : `Generate & Download PDF (${images.length} Pages)`}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Reorderable Image List */}
            <div className="md:col-span-6 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[260px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span>{language === 'bn' ? 'পৃষ্ঠার ক্রম সাজান' : 'Selected Pages Order'} ({images.length})</span>
                  {images.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setImages([])}
                      className="text-red-600 dark:text-red-400 hover:underline"
                    >
                      {language === 'bn' ? 'সব মুছুন' : 'Clear All'}
                    </button>
                  )}
                </div>

                {images.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <p className="text-xs">
                      {language === 'bn' ? 'কোনো ছবি যুক্ত করা হয়নি। বামপাশ থেকে ছবি সিলেক্ট করুন।' : 'No images added yet. Click upload on the left.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {images.map((img, index) => (
                      <div
                        key={img.id}
                        className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded font-bold text-[10px]">
                            {index + 1}
                          </span>
                          <img src={img.dataUrl} alt="thumb" className="w-8 h-8 object-cover rounded border" />
                          <div className="truncate">
                            <p className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[150px]">{img.name}</p>
                            <p className="text-[10px] text-slate-400">{img.sizeKb} KB</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveImage(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(index, 'down')}
                            disabled={index === images.length - 1}
                            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {images.length > 0 && (
                <p className="text-[11px] text-slate-500 mt-3 text-center">
                  💡 {language === 'bn' ? 'তীর চিহ্নে ক্লিক করে পেজের ক্রম আগে-পরে করতে পারেন' : 'Click the up/down arrows to adjust page order before downloading'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pdf_merge_split' && (
        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {language === 'bn' ? 'সাইবার ক্যাফে PDF হ্যান্ডলিং টিপস ও ফর্ম্যাট নির্দেশিকা' : 'Cyber Café PDF Handling Guide & Portal Requirements'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-blue-600 dark:text-blue-400">1. WB Police / SSC Format</span>
              <p className="text-slate-600 dark:text-slate-400">
                Ensure photo is under 50KB JPG and signature under 20KB JPG. Documents like Madhyamik Admit must be 100KB - 200KB PDF.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">2. SVMCM / OASIS Scholarship</span>
              <p className="text-slate-600 dark:text-slate-400">
                Income Certificate, Bank Passbook, Marksheets and Admission Receipt must be crisp and under 400KB PDF.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-amber-600 dark:text-amber-400">3. Banglarbhumi Mutation</span>
              <p className="text-slate-600 dark:text-slate-400">
                Registered Deed (Dolil) and Land Tax Receipt should be scanned in 150 DPI grayscale to keep size under 2MB PDF.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
