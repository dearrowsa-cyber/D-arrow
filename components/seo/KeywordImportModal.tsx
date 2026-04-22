'use client';

import React, { useState } from 'react';
import { Upload, Plus, Database, X } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function KeywordImportModal({ onClose, onSuccess }: Props) {
  const [activeTab, setActiveTab] = useState<'manual' | 'csv' | 'focus'>('manual');
  const [loading, setLoading] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [group, setGroup] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleManualSubmit = async () => {
    if (!manualInput.trim()) return;
    setLoading(true);

    const keywords = manualInput.split('\\n').map(k => k.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/admin/seo/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ keywords, group })
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleCsvSubmit = async () => {
    if (!csvFile) return;
    setLoading(true);

    try {
      const text = await csvFile.text();
      const res = await fetch('/api/admin/seo/keywords/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ source: 'csv', data: text })
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleFocusImport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo/keywords/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ source: 'focus-keywords' })
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="admin-card" style={{ width: '100%', maxWidth: '600px', margin: '20px', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <h3 style={{ marginTop: 0, marginBottom: '24px' }}>إضافة كلمات مفتاحية للتتبع</h3>

        <div style={{ display: 'flex', borderBottom: '1px solid #374151', marginBottom: '24px' }}>
          <button 
            className={`admin-tab ${activeTab === 'manual' ? 'active' : ''}`}
            onClick={() => setActiveTab('manual')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', padding: '12px 24px', color: activeTab === 'manual' ? '#3B82F6' : '#9CA3AF', borderBottom: activeTab === 'manual' ? '2px solid #3B82F6' : 'none', cursor: 'pointer' }}
          >
            <Plus size={16} /> إدخال يدوي
          </button>
          <button 
            className={`admin-tab ${activeTab === 'csv' ? 'active' : ''}`}
            onClick={() => setActiveTab('csv')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', padding: '12px 24px', color: activeTab === 'csv' ? '#3B82F6' : '#9CA3AF', borderBottom: activeTab === 'csv' ? '2px solid #3B82F6' : 'none', cursor: 'pointer' }}
          >
            <Upload size={16} /> استيراد CSV
          </button>
          <button 
            className={`admin-tab ${activeTab === 'focus' ? 'active' : ''}`}
            onClick={() => setActiveTab('focus')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', padding: '12px 24px', color: activeTab === 'focus' ? '#3B82F6' : '#9CA3AF', borderBottom: activeTab === 'focus' ? '2px solid #3B82F6' : 'none', cursor: 'pointer' }}
          >
            <Database size={16} /> جلب من السيو
          </button>
        </div>

        {activeTab === 'manual' && (
          <div>
            <div className="admin-form-group">
              <label className="admin-label">الكلمات المفتاحية (كلمة في كل سطر)</label>
              <textarea 
                className="admin-input" 
                rows={5}
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
                placeholder="digital marketing\nseo services\nweb design"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">المجموعة (اختياري)</label>
              <input 
                type="text" 
                className="admin-input" 
                value={group}
                onChange={e => setGroup(e.target.value)}
                placeholder="مثال: main-services"
              />
            </div>
            <button 
              className="admin-btn admin-btn-primary" 
              style={{ width: '100%' }}
              onClick={handleManualSubmit}
              disabled={loading || !manualInput.trim()}
            >
              {loading ? 'جاري الإضافة...' : 'إضافة الكلمات'}
            </button>
          </div>
        )}

        {activeTab === 'csv' && (
          <div>
            <div className="admin-form-group" style={{ textAlign: 'center', padding: '40px 20px', border: '2px dashed #374151', borderRadius: '8px', marginBottom: '24px' }}>
              <Upload size={48} color="#9CA3AF" style={{ marginBottom: '16px' }} />
              <p style={{ margin: '0 0 16px', color: '#D1D5DB' }}>قم برفع ملف CSV يحتوي على الكلمات المفتاحية</p>
              <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#9CA3AF' }}>الصيغة: keyword, group (اختياري)</p>
              <input 
                type="file" 
                accept=".csv"
                onChange={e => setCsvFile(e.target.files?.[0] || null)}
                style={{ color: '#D1D5DB' }}
              />
            </div>
            <button 
              className="admin-btn admin-btn-primary" 
              style={{ width: '100%' }}
              onClick={handleCsvSubmit}
              disabled={loading || !csvFile}
            >
              {loading ? 'جاري الاستيراد...' : 'استيراد الملف'}
            </button>
          </div>
        )}

        {activeTab === 'focus' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Database size={48} color="#3B82F6" style={{ marginBottom: '16px' }} />
            <p style={{ color: '#D1D5DB', marginBottom: '8px' }}>سيقوم النظام بجمع جميع الكلمات المفتاحية (Focus Keywords)</p>
            <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '24px' }}>التي قمت بإضافتها مسبقاً في إعدادات صفحات الموقع وإضافتها للمتتبع.</p>
            <button 
              className="admin-btn admin-btn-primary" 
              style={{ width: '100%' }}
              onClick={handleFocusImport}
              disabled={loading}
            >
              {loading ? 'جاري الجلب...' : 'بدء الجلب الآن'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
