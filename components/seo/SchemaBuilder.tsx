import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  initialType: string;
  initialData: string;
  onSave: (type: string, data: string) => void;
  isSaving?: boolean;
}

export default function SchemaBuilder({ initialType, initialData, onSave, isSaving }: Props) {
  const [type, setType] = useState(initialType || 'Article');
  const [jsonData, setJsonData] = useState(initialData || '');
  const [faqs, setFaqs] = useState<{question: string, answer: string}[]>([{ question: '', answer: '' }]);

  const handleGenerateFaq = () => {
    const validFaqs = faqs.filter(f => f.question && f.answer);
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": validFaqs.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer
        }
      }))
    };
    setJsonData(JSON.stringify(schema, null, 2));
  };

  return (
    <div className="admin-card">
      <div style={{ marginBottom: '24px' }}>
        <label className="admin-label">Schema Type</label>
        <select className="admin-select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Article">Article</option>
          <option value="FAQPage">FAQPage</option>
          <option value="Product">Product</option>
          <option value="Organization">Organization</option>
          <option value="Custom">Custom</option>
        </select>
      </div>

      {type === 'FAQPage' && (
        <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(11, 13, 31, 0.4)', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '16px' }}>FAQ Builder</h4>
          {faqs.map((faq, index) => (
            <div key={index} style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input 
                  type="text" 
                  className="admin-input" 
                  placeholder="Question" 
                  value={faq.question}
                  onChange={(e) => {
                    const newFaqs = [...faqs];
                    newFaqs[index].question = e.target.value;
                    setFaqs(newFaqs);
                  }}
                />
                <textarea 
                  className="admin-textarea" 
                  placeholder="Answer" 
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => {
                    const newFaqs = [...faqs];
                    newFaqs[index].answer = e.target.value;
                    setFaqs(newFaqs);
                  }}
                />
              </div>
              <button 
                type="button" 
                className="admin-btn admin-btn-danger" 
                style={{ padding: '12px' }}
                onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}>
              <Plus size={16} /> Add Question
            </button>
            <button type="button" className="admin-btn admin-btn-primary" onClick={handleGenerateFaq}>
              Generate JSON-LD
            </button>
          </div>
        </div>
      )}

      <div>
        <label className="admin-label">JSON-LD Code</label>
        <textarea 
          className="admin-textarea" 
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          rows={12}
          style={{ fontFamily: 'monospace' }}
          placeholder="Paste or edit JSON-LD here..."
        />
      </div>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          className="admin-btn admin-btn-primary" 
          onClick={() => onSave(type, jsonData)}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Schema'}
        </button>
      </div>
    </div>
  );
}
