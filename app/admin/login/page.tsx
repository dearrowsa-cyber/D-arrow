'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        router.push('/admin');
        // Force reload to trigger auth check
        window.location.href = '/admin';
      } else {
        setError(data.error || 'كلمة المرور غير صحيحة');
      }
    } catch {
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/DR-LOGO.png" alt="D Arrow" style={{ height: 56, margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#E6E6EA', margin: '0 0 8px' }}>
            لوحة التحكم
          </h2>
          <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
            أدخل كلمة المرور للوصول
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Password field */}
          <div style={{ marginBottom: 24 }}>
            <label className="admin-label">كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }}>
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="admin-input"
                style={{ paddingLeft: 42, paddingRight: 42 }}
                required
                autoFocus
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', padding: 0,
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10, padding: '10px 16px', marginBottom: 20,
              color: '#EF4444', fontSize: 14, textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={loading}
            style={{
              width: '100%', justifyContent: 'center', padding: '14px 24px',
              fontSize: 16, borderRadius: 12, opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                جاري الدخول...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>

        {/* Back to site link */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="/" style={{ color: '#6B7280', fontSize: 13, textDecoration: 'none' }}>
            ← العودة للموقع
          </a>
        </div>
      </div>
    </div>
  );
}
