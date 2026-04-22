import React from 'react';

interface SerpPreviewProps {
  title: string;
  description: string;
  url: string;
}

export default function SerpPreview({ title, description, url }: SerpPreviewProps) {
  return (
    <div className="admin-card" style={{ padding: '20px', background: '#ffffff', borderRadius: '8px', border: '1px solid #dfe1e5', fontFamily: 'arial, sans-serif' }}>
      <div style={{ fontSize: '14px', color: '#202124', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '28px', height: '28px', background: '#f1f3f4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/DR-LOGO.png" alt="D-Arrow" style={{ width: '16px', height: '16px' }} />
        </div>
        <div>
          <div style={{ color: '#202124', lineHeight: '1.2' }}>D Arrow Digital</div>
          <div style={{ color: '#4d5156', fontSize: '12px' }}>{url || 'https://d-arrow.com'}</div>
        </div>
      </div>
      <div style={{ color: '#1a0dab', fontSize: '20px', lineHeight: '1.3', marginBottom: '4px', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {title || 'Please enter a title'}
      </div>
      <div style={{ color: '#4d5156', fontSize: '14px', lineHeight: '1.58', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {description || 'Please enter a meta description for this page. It should be compelling and contain your focus keywords.'}
      </div>
    </div>
  );
}
