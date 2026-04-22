import React from 'react';

interface SocialPreviewProps {
  title: string;
  description: string;
  image?: string;
  platform: 'facebook' | 'twitter';
  domain?: string;
}

export default function SocialPreview({ title, description, image, platform, domain = 'd-arrow.com' }: SocialPreviewProps) {
  const displayTitle = title || 'Social Title Example';
  const displayDesc = description || 'Social description example to show how this content will look when shared.';
  const displayImage = image || 'https://via.placeholder.com/1200x630/e2e8f0/64748b?text=Preview+Image';

  if (platform === 'twitter') {
    return (
      <div className="max-w-[500px] border border-gray-200 rounded-xl overflow-hidden bg-white hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="aspect-[1.91/1] overflow-hidden border-b border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayImage} alt="Twitter preview" className="w-full h-full object-cover" />
        </div>
        <div className="p-3">
          <div className="text-[13px] text-gray-500 mb-0.5 truncate">{domain}</div>
          <div className="text-[15px] font-bold text-gray-900 leading-snug truncate mb-1">
            {displayTitle}
          </div>
          <div className="text-[15px] text-gray-600 line-clamp-2 leading-snug">
            {displayDesc}
          </div>
        </div>
      </div>
    );
  }

  // Facebook style
  return (
    <div className="max-w-[500px] border border-gray-200 bg-[#f0f2f5] cursor-pointer">
      <div className="aspect-[1.91/1] overflow-hidden bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={displayImage} alt="Facebook preview" className="w-full h-full object-cover" />
      </div>
      <div className="px-4 py-2 border-t border-gray-200">
        <div className="text-[12px] text-[#606770] uppercase uppercase tracking-wider mb-1 truncate">{domain}</div>
        <div className="text-[16px] font-semibold text-[#1d2129] leading-tight truncate mb-1">
          {displayTitle}
        </div>
        <div className="text-[14px] text-[#606770] line-clamp-1 leading-tight">
          {displayDesc}
        </div>
      </div>
    </div>
  );
}
