import React from 'react';

interface SerpPreviewProps {
  title: string;
  description: string;
  url: string;
  isMobile?: boolean;
}

export default function SerpPreview({ title, description, url, isMobile = false }: SerpPreviewProps) {
  const displayTitle = title || 'SEO Title Example - Please write a title';
  const displayDesc = description || 'Please write a meta description. This helps users understand what your page is about before they click on it in the search results.';
  
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://d-arrow.com';
  const fullUrl = `${siteUrl}${url.startsWith('/') ? url : `/${url}`}`;

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${isMobile ? 'max-w-[375px]' : 'max-w-[600px]'}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500 overflow-hidden">
             {/* Simple favicon placeholder */}
             D
        </div>
        <div>
           <div className="text-sm text-[#202124] leading-tight truncate">D-Arrow Marketing</div>
           <div className="text-xs text-[#4d5156] leading-tight truncate">{fullUrl}</div>
        </div>
      </div>
      <div className="text-xl text-[#1a0dab] font-medium leading-tight mb-1 hover:underline cursor-pointer truncate">
        {displayTitle.substring(0, 60)}{displayTitle.length > 60 ? '...' : ''}
      </div>
      <div className="text-sm text-[#4d5156] leading-snug line-clamp-2">
        {displayDesc.substring(0, 160)}{displayDesc.length > 160 ? '...' : ''}
      </div>
    </div>
  );
}
