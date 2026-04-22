'use client';

import { useEffect, useState } from 'react';
import RobotsEditor from '@/components/seo/RobotsEditor';

export default function RobotsManager() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/seo/robots', {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setRules(data.data);
        setLoading(false);
      });
  }, []);

  const handleSave = async (updatedRules: any[]) => {
    // Basic implementation: delete all and recreate
    // For a real app, you'd do smart updates
    for (const rule of rules) {
      if (rule.id) {
        await fetch('/api/admin/seo/robots', {
          method: 'DELETE',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('admin_token')}` 
          },
          body: JSON.stringify({ id: rule.id })
        });
      }
    }

    for (const rule of updatedRules) {
      await fetch('/api/admin/seo/robots', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}` 
        },
        body: JSON.stringify(rule)
      });
    }

    alert('Robots rules saved!');
  };

  if (loading) return <div className="admin-content">Loading...</div>;

  return (
    <div className="admin-content">
      <div style={{ marginBottom: '32px' }}>
        <h2>إدارة ملف Robots.txt</h2>
        <p style={{ color: '#9CA3AF' }}>التحكم في العناكب والزواحف التي تفهرس موقعك</p>
      </div>

      <RobotsEditor initialRules={rules} onSave={handleSave} />
    </div>
  );
}
