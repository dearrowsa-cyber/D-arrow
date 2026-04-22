import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Rule {
  id?: string;
  userAgent: string;
  directive: string;
  path: string;
}

interface Props {
  initialRules: Rule[];
  onSave: (rules: Rule[]) => void;
  isSaving?: boolean;
}

export default function RobotsEditor({ initialRules, onSave, isSaving }: Props) {
  const [rules, setRules] = useState<Rule[]>(initialRules);

  const handleAdd = () => {
    setRules([...rules, { userAgent: '*', directive: 'Disallow', path: '/' }]);
  };

  const handleUpdate = (index: number, field: keyof Rule, value: string) => {
    const newRules = [...rules];
    newRules[index][field] = value;
    setRules(newRules);
  };

  const handleDelete = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const generatePreview = () => {
    const lines = [];
    const grouped = rules.reduce((acc, rule) => {
      if (!acc[rule.userAgent]) acc[rule.userAgent] = [];
      acc[rule.userAgent].push(rule);
      return acc;
    }, {} as Record<string, Rule[]>);

    for (const [ua, uaRules] of Object.entries(grouped)) {
      lines.push(`User-agent: ${ua}`);
      for (const rule of uaRules) {
        lines.push(`${rule.directive}: ${rule.path}`);
      }
      lines.push('');
    }
    
    lines.push('Sitemap: https://d-arrow.com/sitemap.xml');
    return lines.join('\n');
  };

  return (
    <div className="admin-grid-2">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0 }}>Rules Editor</h3>
          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={handleAdd}>
            <Plus size={16} /> Add Rule
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {rules.length === 0 && (
            <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '24px' }}>No rules configured. Click Add Rule to start.</div>
          )}
          {rules.map((rule, index) => (
            <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', background: 'rgba(11, 13, 31, 0.4)', borderRadius: '8px' }}>
              <div style={{ flex: 1 }}>
                <label className="admin-label">User Agent</label>
                <input type="text" className="admin-input" value={rule.userAgent} onChange={(e) => handleUpdate(index, 'userAgent', e.target.value)} placeholder="*" />
              </div>
              <div style={{ flex: 1 }}>
                <label className="admin-label">Directive</label>
                <select className="admin-select" value={rule.directive} onChange={(e) => handleUpdate(index, 'directive', e.target.value)}>
                  <option value="Allow">Allow</option>
                  <option value="Disallow">Disallow</option>
                </select>
              </div>
              <div style={{ flex: 2 }}>
                <label className="admin-label">Path</label>
                <input type="text" className="admin-input" value={rule.path} onChange={(e) => handleUpdate(index, 'path', e.target.value)} placeholder="/admin/" />
              </div>
              <div style={{ marginTop: '24px' }}>
                <button className="admin-btn admin-btn-danger" style={{ padding: '12px' }} onClick={() => handleDelete(index)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="admin-btn admin-btn-primary" onClick={() => onSave(rules)} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Rules'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ margin: '0 0 24px 0' }}>robots.txt Preview</h3>
        <pre style={{ 
          background: 'rgba(11, 13, 31, 0.6)', 
          padding: '24px', 
          borderRadius: '8px', 
          color: '#E6E6EA',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          minHeight: '300px'
        }}>
          {generatePreview()}
        </pre>
      </div>
    </div>
  );
}
