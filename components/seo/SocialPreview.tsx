import React from 'react';

interface SocialPreviewProps {
  type: 'facebook' | 'twitter';
  title: string;
  description: string;
  image: string;
  domain?: string;
}

export default function SocialPreview({ type, title, description, image, domain = 'd-arrow.com' }: SocialPreviewProps) {
  const isTwitter = type === 'twitter';

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
      border: '1px solid #e1e8ed',
      borderRadius: isTwitter ? '16px' : '0',
      overflow: 'hidden',
      fontFamily: isTwitter ? '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif' : 'Helvetica, Arial, sans-serif',
      backgroundColor: '#ffffff'
    }}>
      <div style={{ 
        width: '100%', 
        height: '260px', 
        backgroundColor: '#f3f4f6', 
        backgroundImage: image ? `url(${image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #e1e8ed'
      }}>
        {!image && <span style={{ color: '#9ca3af' }}>No Image Provided</span>}
      </div>
      
      <div style={{ padding: '12px 16px', backgroundColor: isTwitter ? '#ffffff' : '#f2f3f5' }}>
        <div style={{ 
          color: '#536471', 
          fontSize: isTwitter ? '15px' : '12px', 
          textTransform: isTwitter ? 'none' : 'uppercase',
          marginBottom: '4px'
        }}>
          {domain}
        </div>
        <div style={{ 
          color: '#0f1419', 
          fontSize: isTwitter ? '15px' : '16px', 
          fontWeight: isTwitter ? '400' : '600',
          marginBottom: isTwitter ? '4px' : '4px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {title || 'Title'}
        </div>
        <div style={{ 
          color: '#536471', 
          fontSize: '15px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {description || 'Description'}
        </div>
      </div>
    </div>
  );
}
