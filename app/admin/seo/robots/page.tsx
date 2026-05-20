'use client';

import { useEffect, useState } from 'react';
import RobotsEditor from '@/components/seo/RobotsEditor';

export default function RobotsManager() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  const showToast = (msg: string, type: string) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

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
    try {
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

      showToast('تم حفظ قواعد Robots.txt بنجاح!', 'success');
      // Update rules state after successful save
      const res = await fetch('/api/admin/seo/robots', {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) setRules(data.data);
    } catch {
      showToast('حدث خطأ أثناء حفظ القواعد', 'error');
    }
  };

  if (loading) return <div className="admin-content">Loading...</div>;

  return (
    <div className="admin-content">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}

      <div style={{ marginBottom: '32px' }}>
        <h2>إدارة ملف Robots.txt</h2>
        <p style={{ color: '#9CA3AF' }}>التحكم في العناكب والزواحف التي تفهرس موقعك</p>
      </div>

      <RobotsEditor initialRules={rules} onSave={handleSave} />
    </div>
  );
}
