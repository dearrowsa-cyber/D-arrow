'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Trash2, Copy, Check, Image as ImageIcon, Search } from 'lucide-react';

export default function MediaPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [dragOver, setDragOver] = useState(false);

  // Load existing uploads from a simple tracking approach
  useEffect(() => {
    // We'll store uploaded images in localStorage for tracking
    const stored = localStorage.getItem('admin_uploads');
    if (stored) {
      try {
        setImages(JSON.parse(stored));
      } catch { }
    }
  }, []);

  const saveImages = (imgs: { url: string; name: string }[]) => {
    setImages(imgs);
    localStorage.setItem('admin_uploads', JSON.stringify(imgs));
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: { url: string; name: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
          newImages.push({ url: data.url, name: file.name });
        } else {
          showToast(`فشل في رفع ${file.name}: ${data.error}`, 'error');
        }
      } catch {
        showToast(`خطأ في رفع ${file.name}`, 'error');
      }
    }

    if (newImages.length > 0) {
      const allImages = [...newImages, ...images];
      saveImages(allImages);
      showToast(`تم رفع ${newImages.length} صورة بنجاح`, 'success');
    }

    setUploading(false);
  };

  const handleDelete = (url: string) => {
    const filtered = images.filter(img => img.url !== url);
    saveImages(filtered);
    showToast('تم حذف الصورة', 'success');
  };

  const copyUrl = (url: string) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const showToast = (msg: string, type: string) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="admin-content">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#E6E6EA', margin: '0 0 4px' }}>مكتبة الوسائط</h2>
          <p style={{ color: '#6B7280', fontSize: 14, margin: 0 }}>{images.length} صورة</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => fileInputRef.current?.click()}>
          <Upload size={16} /> رفع صور
        </button>
      </div>

      {/* Upload Zone */}
      <div
        className={`admin-upload-zone ${dragOver ? 'dragging' : ''}`}
        style={{ marginBottom: 32 }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <>
            <div style={{ width: 48, height: 48, border: '3px solid rgba(255,77,109,0.2)', borderTopColor: '#FF4D6D', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: '#9CA3AF', fontSize: 16, margin: 0 }}>جاري رفع الصور...</p>
          </>
        ) : (
          <>
            <Upload size={48} style={{ color: '#6B7280', margin: '0 auto 16px', display: 'block' }} />
            <p style={{ color: '#E6E6EA', fontSize: 16, margin: '0 0 4px' }}>اسحب الصور هنا أو اضغط للرفع</p>
            <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>JPG, PNG, WebP, GIF, SVG — الحد الأقصى 5MB لكل صورة</p>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={e => handleUpload(e.target.files)}
        style={{ display: 'none' }}
      />

      {/* Images Grid */}
      {images.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {images.map((img, i) => (
            <div key={i} className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: 160, background: '#0B0D1F' }}>
                <img
                  src={img.url}
                  alt={img.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                  opacity: 0, transition: 'opacity 0.2s',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 12, gap: 8,
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                >
                  <button
                    className="admin-btn admin-btn-sm"
                    style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', backdropFilter: 'blur(4px)' }}
                    onClick={() => copyUrl(img.url)}
                  >
                    {copied === img.url ? <Check size={14} /> : <Copy size={14} />}
                    {copied === img.url ? 'تم النسخ' : 'نسخ الرابط'}
                  </button>
                  <button
                    className="admin-btn admin-btn-sm"
                    style={{ background: 'rgba(239,68,68,0.8)', color: 'white', border: 'none' }}
                    onClick={() => handleDelete(img.url)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div style={{ padding: '10px 12px' }}>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {img.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <ImageIcon size={64} style={{ color: '#6B7280', opacity: 0.3 }} />
          <p style={{ fontSize: 16, margin: '16px 0 4px', color: '#9CA3AF' }}>لا توجد صور</p>
          <p style={{ fontSize: 13, color: '#6B7280' }}>ابدأ برفع الصور لاستخدامها في المقالات والصفحات</p>
        </div>
      )}
    </div>
  );
}
