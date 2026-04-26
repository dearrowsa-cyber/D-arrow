'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Trash2, Edit, Eye, FileText } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  titleAr?: string;
  category: string;
  date: string;
  status?: string;
  author: string;
  readTime: number;
  imageUrl?: string;
}

export default function PostsListPage() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<string>(searchParams.get('status') || 'all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog/posts');
      const data = await res.json();
      const sorted = (data.posts || []).sort((a: Post, b: Post) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setPosts(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/blog/posts?id=${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.filter(p => p.id !== deleteId));
        showToast('تم حذف المقال بنجاح', 'success');
      } else {
        showToast('فشل في حذف المقال', 'error');
      }
    } catch {
      showToast('حدث خطأ', 'error');
    }
    setDeleteId(null);
  };

  const showToast = (msg: string, type: string) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const categories = ['all', ...new Set(posts.map(p => p.category))];

  const filteredPosts = posts.filter(p => {
    const matchSearch = (p.title + (p.titleAr || '')).toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchStatus = filterStatus === 'all' || (filterStatus === 'draft' ? p.status === 'draft' : p.status !== 'draft');
    return matchSearch && matchCategory && matchStatus;
  });

  if (loading) {
    return (
      <div className="admin-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <div style={{
          width: 40, height: 40, border: '3px solid rgba(255,77,109,0.2)',
          borderTopColor: '#FF4D6D', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div className="admin-content">
      {/* Toast */}
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>
          {toast.msg}
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="admin-overlay">
          <div className="admin-dialog">
            <h3 style={{ color: '#E6E6EA', fontSize: 20, margin: '0 0 12px' }}>تأكيد الحذف</h3>
            <p style={{ color: '#9CA3AF', fontSize: 14, margin: '0 0 24px' }}>
              هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteId(null)}>إلغاء</button>
              <button className="admin-btn admin-btn-danger" onClick={handleDelete}>حذف</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#E6E6EA', margin: '0 0 4px' }}>المقالات</h2>
          <p style={{ color: '#6B7280', fontSize: 14, margin: 0 }}>{posts.length} مقال</p>
        </div>
        <Link href="/admin/posts/new" className="admin-btn admin-btn-primary">
          <Plus size={18} />
          مقال جديد
        </Link>
      </div>

      {/* Filters */}
      <div className="admin-card" style={{ marginBottom: 24, padding: 16 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="admin-search" style={{ flex: '1 1 300px' }}>
            <Search size={16} />
            <input
              className="admin-input"
              placeholder="البحث في المقالات..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingRight: 16 }}
            />
          </div>
          <select
            className="admin-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ width: 'auto', minWidth: 130 }}
          >
            <option value="all">كل الحالات</option>
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
          </select>
          <select
            className="admin-select"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            style={{ width: 'auto', minWidth: 150 }}
          >
            <option value="all">كل الفئات</option>
            {categories.filter(c => c !== 'all').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredPosts.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 50 }}></th>
                <th>العنوان</th>
                <th>الفئة</th>
                <th>التاريخ</th>
                <th>الكاتب</th>
                <th>الحالة</th>
                <th style={{ width: 120 }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map(post => (
                <tr key={post.id}>
                  <td>
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: 40, height: 40, borderRadius: 8,
                        background: 'linear-gradient(135deg, rgba(255,77,109,0.2), rgba(255,154,60,0.15))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF4D6D',
                      }}>
                        <FileText size={18} />
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#E6E6EA', marginBottom: 2 }}>
                      {post.titleAr || post.title}
                    </div>
                    {post.titleAr && post.title && (
                      <div style={{ fontSize: 12, color: '#6B7280' }}>{post.title}</div>
                    )}
                  </td>
                  <td><span className="admin-badge admin-badge-info">{post.category}</span></td>
                  <td style={{ color: '#9CA3AF', fontSize: 13 }}>{post.date}</td>
                  <td style={{ color: '#9CA3AF', fontSize: 13 }}>{post.author}</td>
                  <td>
                    <span className={`admin-badge ${post.status === 'draft' ? 'admin-badge-warning' : 'admin-badge-success'}`}>
                      {post.status === 'draft' ? 'مسودة' : 'منشور'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        title="تعديل"
                      >
                        <Edit size={15} />
                      </Link>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => setDeleteId(post.id)}
                        title="حذف"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="admin-empty">
            <FileText size={48} />
            <p style={{ fontSize: 16, margin: '12px 0 4px', color: '#9CA3AF' }}>لا توجد مقالات</p>
            <p style={{ fontSize: 13, color: '#6B7280' }}>
              {search ? 'لا توجد نتائج تطابق بحثك' : 'ابدأ بإنشاء أول مقال'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
