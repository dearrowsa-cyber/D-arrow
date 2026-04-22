'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SeoMetaForm from '@/components/seo/SeoMetaForm';
import SeoAnalysisPanel from '@/components/seo/SeoAnalysisPanel';

export default function SeoMetaEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const isNew = id === 'new';
  const router = useRouter();
  const [initialData, setInitialData] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/seo/meta/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      })
        .then(res => res.json())
        .then(res => {
          if (res.success) setInitialData(res.data);
        });
    } else {
      setInitialData({});
    }
  }, [id, isNew]);

  const handleSave = async (data: any) => {
    setSaving(true);
    const url = isNew ? '/api/admin/seo/meta' : `/api/admin/seo/meta/${id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('admin_token')}` 
      },
      body: JSON.stringify(data)
    });
    
    const result = await res.json();
    setSaving(false);

    if (result.success) {
      alert('Saved successfully!');
      if (isNew) router.push('/admin/seo/meta');
    } else {
      alert('Error: ' + result.error);
    }
  };

  const runAnalysis = async (data: any) => {
    setAnalyzing(true);
    // In a real scenario we'd fetch the actual page content here.
    // For now we'll send a dummy content text to get basic checks working.
    const res = await fetch('/api/admin/seo/analyze', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('admin_token')}` 
      },
      body: JSON.stringify({
        content: `This is the content for ${data.title}. We are analyzing ${data.focusKeyword}.`,
        title: data.title,
        description: data.description,
        focusKeyword: data.focusKeyword,
        slug: data.slug
      })
    });
    
    const result = await res.json();
    if (result.success) {
      setAnalysisResult(result.data);
    }
    setAnalyzing(false);
  };

  if (!initialData) return <div className="admin-content">Loading...</div>;

  return (
    <div className="admin-content">
      <h2 style={{ marginBottom: '32px' }}>{isNew ? 'إضافة بيانات سيو' : 'تعديل بيانات السيو'}</h2>
      
      <div className="admin-grid-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div>
          <SeoMetaForm 
            initialData={initialData} 
            onSave={handleSave} 
            isSaving={saving} 
          />
        </div>
        <div>
          <div className="admin-card" style={{ marginBottom: '24px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0 }}>SEO Analysis</h4>
            <button 
              className="admin-btn admin-btn-secondary admin-btn-sm" 
              onClick={() => runAnalysis(initialData)}
              disabled={analyzing}
            >
              Run Analysis
            </button>
          </div>
          <SeoAnalysisPanel result={analysisResult} loading={analyzing} />
        </div>
      </div>
    </div>
  );
}
