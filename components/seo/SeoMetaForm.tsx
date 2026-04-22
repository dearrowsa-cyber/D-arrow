import React, { useState } from 'react';
import SerpPreview from './SerpPreview';
import SocialPreview from './SocialPreview';

interface FormData {
  slug: string;
  title: string;
  description: string;
  focusKeyword: string;
  canonicalUrl: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  schemaType: string;
}

interface Props {
  initialData?: Partial<FormData>;
  onSave: (data: FormData) => void;
  isSaving?: boolean;
}

export default function SeoMetaForm({ initialData = {}, onSave, isSaving = false }: Props) {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<FormData>({
    slug: initialData.slug || '',
    title: initialData.title || '',
    description: initialData.description || '',
    focusKeyword: initialData.focusKeyword || '',
    canonicalUrl: initialData.canonicalUrl || '',
    robots: initialData.robots || 'index, follow',
    ogTitle: initialData.ogTitle || '',
    ogDescription: initialData.ogDescription || '',
    ogImage: initialData.ogImage || '',
    twitterCard: initialData.twitterCard || 'summary_large_image',
    schemaType: initialData.schemaType || 'WebPage',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255, 77, 109, 0.1)' }}>
        <div className="admin-tabs" style={{ display: 'inline-flex' }}>
          <button type="button" className={`admin-tab ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>General</button>
          <button type="button" className={`admin-tab ${activeTab === 'social' ? 'active' : ''}`} onClick={() => setActiveTab('social')}>Social Media</button>
          <button type="button" className={`admin-tab ${activeTab === 'advanced' ? 'active' : ''}`} onClick={() => setActiveTab('advanced')}>Advanced</button>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {activeTab === 'general' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="admin-label">URL Slug *</label>
              <input required type="text" name="slug" className="admin-input" value={formData.slug} onChange={handleChange} placeholder="/my-page" />
            </div>
            
            <div>
              <label className="admin-label">SEO Title ({formData.title.length}/60)</label>
              <input type="text" name="title" className="admin-input" value={formData.title} onChange={handleChange} />
              <div style={{ height: '4px', width: '100%', background: '#374151', marginTop: '4px', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: `${Math.min(100, (formData.title.length / 60) * 100)}%`, background: formData.title.length > 60 ? '#EF4444' : formData.title.length > 40 ? '#22C55E' : '#F59E0B', borderRadius: '2px', transition: 'all 0.3s' }} />
              </div>
            </div>

            <div>
              <label className="admin-label">Meta Description ({formData.description.length}/160)</label>
              <textarea name="description" className="admin-textarea" value={formData.description} onChange={handleChange} rows={3} />
              <div style={{ height: '4px', width: '100%', background: '#374151', marginTop: '4px', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: `${Math.min(100, (formData.description.length / 160) * 100)}%`, background: formData.description.length > 160 ? '#EF4444' : formData.description.length > 120 ? '#22C55E' : '#F59E0B', borderRadius: '2px', transition: 'all 0.3s' }} />
              </div>
            </div>

            <div>
              <label className="admin-label">Focus Keyword</label>
              <input type="text" name="focusKeyword" className="admin-input" value={formData.focusKeyword} onChange={handleChange} placeholder="e.g. digital marketing agency" />
            </div>

            <div style={{ marginTop: '16px' }}>
              <h4 style={{ marginBottom: '12px' }}>Google Preview</h4>
              <SerpPreview title={formData.title} description={formData.description} url={`https://d-arrow.com${formData.slug.startsWith('/') ? formData.slug : '/' + formData.slug}`} />
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="admin-grid-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className="admin-label">Social Title</label>
                  <input type="text" name="ogTitle" className="admin-input" value={formData.ogTitle} onChange={handleChange} placeholder="Leave blank to use SEO Title" />
                </div>
                <div>
                  <label className="admin-label">Social Description</label>
                  <textarea name="ogDescription" className="admin-textarea" value={formData.ogDescription} onChange={handleChange} rows={3} placeholder="Leave blank to use Meta Description" />
                </div>
                <div>
                  <label className="admin-label">Social Image URL</label>
                  <input type="text" name="ogImage" className="admin-input" value={formData.ogImage} onChange={handleChange} placeholder="https://..." />
                </div>
                <div>
                  <label className="admin-label">Twitter Card Type</label>
                  <select name="twitterCard" className="admin-select" value={formData.twitterCard} onChange={handleChange}>
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary Large Image</option>
                  </select>
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '12px' }}>Social Preview</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <SocialPreview type="facebook" title={formData.ogTitle || formData.title} description={formData.ogDescription || formData.description} image={formData.ogImage} />
                  <SocialPreview type="twitter" title={formData.ogTitle || formData.title} description={formData.ogDescription || formData.description} image={formData.ogImage} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="admin-label">Canonical URL</label>
              <input type="text" name="canonicalUrl" className="admin-input" value={formData.canonicalUrl} onChange={handleChange} placeholder="Leave blank to auto-generate" />
            </div>
            
            <div>
              <label className="admin-label">Robots Directives</label>
              <input type="text" name="robots" className="admin-input" value={formData.robots} onChange={handleChange} placeholder="index, follow" />
              <small style={{ color: '#9CA3AF', marginTop: '4px', display: 'block' }}>Default is "index, follow". Change to "noindex, nofollow" to hide from search engines.</small>
            </div>

            <div>
              <label className="admin-label">Schema Type</label>
              <select name="schemaType" className="admin-select" value={formData.schemaType} onChange={handleChange}>
                <option value="WebPage">WebPage (Default)</option>
                <option value="Article">Article</option>
                <option value="FAQPage">FAQPage</option>
                <option value="Product">Product</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 77, 109, 0.1)', display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save SEO Settings'}
        </button>
      </div>
    </form>
  );
}
