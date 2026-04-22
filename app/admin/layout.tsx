'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import './admin.css';
import { LayoutDashboard, FileText, Globe, DollarSign, LogOut, Menu, X, Image, Search, Tags, ArrowRightLeft, Bot, Code, Map } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/admin/posts', label: 'المقالات', icon: FileText },
  { href: '/admin/pages', label: 'الصفحات', icon: Globe },
  { href: '/admin/pricing', label: 'الأسعار', icon: DollarSign },
  { href: '/admin/media', label: 'الوسائط', icon: Image },
  { href: '/admin/seo', label: 'لوحة SEO', icon: Search },
  { href: '/admin/seo/meta', label: 'بيانات SEO', icon: Tags },
  { href: '/admin/seo/redirects', label: 'التحويلات', icon: ArrowRightLeft },
  { href: '/admin/seo/robots', label: 'Robots.txt', icon: Bot },
  { href: '/admin/seo/schema', label: 'Schema', icon: Code },
  { href: '/admin/seo/sitemap', label: 'خريطة الموقع', icon: Map },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else if (token) {
      // Verify token
      fetch('/api/admin/auth', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setIsAuth(true);
          } else {
            localStorage.removeItem('admin_token');
            router.push('/admin/login');
          }
        })
        .catch(() => {
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  // Login page - no sidebar
  if (pathname === '/admin/login') {
    return (
      <div className="admin-layout">
        <style suppressHydrationWarning>{`
          header, footer, canvas, .network-background { display: none !important; }
          .admin-sidebar { display: flex !important; }
          .admin-main { display: flex !important; }
        `}</style>
        {children}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, border: '3px solid rgba(255,77,109,0.2)',
            borderTopColor: '#FF4D6D', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#9CA3AF', fontSize: 14 }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) return null;

  return (
    <div className="admin-layout">
      {/* FORCE HIDE GLOBAL CHROME */}
      <style suppressHydrationWarning>{`
        header, footer, canvas, .network-background { display: none !important; }
        .admin-sidebar { display: flex !important; }
        .admin-main { display: flex !important; }
      `}</style>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 45 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <img src="/DR-LOGO.png" alt="D Arrow" style={{ height: 36 }} />
          <span>Admin Panel</span>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="admin-nav-section">القائمة الرئيسية</div>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-nav-item" style={{ width: '100%', border: 'none' }}>
            <LogOut size={20} />
            تسجيل الخروج
          </button>
          <Link href="/" className="admin-nav-item" style={{ marginTop: 4 }} target="_blank">
            <Globe size={20} />
            عرض الموقع
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        {/* Top bar */}
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              className="admin-btn-ghost"
              style={{ display: 'none', padding: 8, background: 'transparent', border: 'none', color: '#9CA3AF' }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              id="mobile-menu-btn"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <style>{`@media(max-width:1024px){#mobile-menu-btn{display:flex!important}}`}</style>
            <h1 className="admin-topbar-title" style={{ fontSize: 18, margin: 0 }}>
              {navItems.find(n => n.href === pathname)?.label || 'لوحة التحكم'}
            </h1>
          </div>
          <div className="admin-topbar-actions">
            <span style={{ fontSize: 13, color: '#6B7280' }}>
              مرحباً، Admin
            </span>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
