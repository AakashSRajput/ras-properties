'use client';

import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyGalleryProps {
  images: { id?: string; url: string; caption?: string | null }[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const fallbackList = images && images.length > 0 ? images : [
    { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', caption: 'Main Exterior' }
  ];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % fallbackList.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + fallbackList.length) % fallbackList.length);
  };

  return (
    <div className="space-y-3">
      {/* Main Big Image */}
      <div
        className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group shadow-lg border border-slate-200"
        onClick={() => setIsLightboxOpen(true)}
      >
        <img
          src={fallbackList[selectedIndex].url}
          alt={`${title} - Photo ${selectedIndex + 1}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Overlay Badges */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md transition-all shadow-md"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>View All ({fallbackList.length})</span>
          </button>
        </div>

        {/* Prev / Next Chevrons on Main Image */}
        {fallbackList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {fallbackList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {fallbackList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-[16/10] w-24 sm:w-28 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-amber-500 scale-105 shadow-md'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Full-Screen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Header */}
          <div className="flex items-center justify-between text-white pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-sm sm:text-base">{title}</h3>
              <p className="text-xs text-slate-400">
                Photo {selectedIndex + 1} of {fallbackList.length}
              </p>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Lightbox Image */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fallbackList[selectedIndex].url}
              alt="Full size view"
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl animate-scale-up"
            />

            {fallbackList.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-6 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-all border border-slate-700"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-6 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-all border border-slate-700"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails in Lightbox */}
          <div
            className="flex items-center justify-center gap-2 overflow-x-auto py-2"
            onClick={(e) => e.stopPropagation()}
          >
            {fallbackList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`relative aspect-[16/10] w-16 sm:w-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  selectedIndex === idx
                    ? 'border-amber-400 scale-110 shadow-lg'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
