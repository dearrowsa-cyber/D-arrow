'use client';

import { useState, useEffect } from 'react';
import { Star, Check, X, Trash2 } from 'lucide-react';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment?: string;
  approved: boolean;
  createdAt: string;
  product?: { name: string; nameAr?: string };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg:string;type:string}|null>(null);
  const [filter, setFilter] = useState<'all'|'pending'|'approved'>('all');

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try { const r = await fetch('/api/store/reviews?all=true'); const d = await r.json(); if(d.success) setReviews(d.reviews||[]); } catch{} finally{setLoading(false);}
  };

  const handleApprove = async (id:string, approved:boolean) => {
    try {
      const r = await fetch('/api/store/reviews',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,approved})});
      const d = await r.json();
      if(d.success){setReviews(p=>p.map(rv=>rv.id===id?{...rv,approved}:rv));showToast(approved?'تم القبول':'تم الرفض','success');}
    } catch{showToast('خطأ','error');}
  };

  const handleDelete = async (id:string) => {
    try { const r = await fetch(`/api/store/reviews?id=${id}`,{method:'DELETE'}); const d = await r.json(); if(d.success){setReviews(p=>p.filter(rv=>rv.id!==id));showToast('تم الحذف','success');} } catch{}
  };

  const showToast = (msg:string,type:string) => {setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const filtered = filter==='all'?reviews:filter==='pending'?reviews.filter(r=>!r.approved):reviews.filter(r=>r.approved);
  const pendingCount = reviews.filter(r=>!r.approved).length;

  return (
    <div className="admin-content">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <div>
          <h2 style={{fontSize:24,fontWeight:700,color:'#E6E6EA',margin:0}}>التقييمات</h2>
          <p style={{color:'#6B7280',fontSize:14,margin:'4px 0 0'}}>{reviews.length} تقييم — {pendingCount} بانتظار المراجعة</p>
        </div>
        <div className="admin-tabs">
          <button className={`admin-tab ${filter==='all'?'active':''}`} onClick={()=>setFilter('all')}>الكل ({reviews.length})</button>
          <button className={`admin-tab ${filter==='pending'?'active':''}`} onClick={()=>setFilter('pending')}>بانتظار ({pendingCount})</button>
          <button className={`admin-tab ${filter==='approved'?'active':''}`} onClick={()=>setFilter('approved')}>موافق ({reviews.length-pendingCount})</button>
        </div>
      </div>

      {loading ? (
        <div style={{padding:64,textAlign:'center'}}><div style={{width:36,height:36,border:'3px solid rgba(255,77,109,0.2)',borderTopColor:'#FF4D6D',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto'}}/></div>
      ) : filtered.length===0 ? (
        <div className="admin-card admin-empty"><Star size={64}/><h3 style={{color:'#9CA3AF',margin:'16px 0 8px'}}>لا توجد تقييمات</h3></div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {filtered.map(review => (
            <div key={review.id} className="admin-card" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:16}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#FF4D6D,#FF9A3C)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:16}}>
                    {review.customerName.charAt(0)}
                  </div>
                  <div>
                    <div style={{fontWeight:600,color:'#E6E6EA'}}>{review.customerName}</div>
                    <div style={{fontSize:12,color:'#6B7280'}}>{review.product?.nameAr||review.product?.name||'—'} • {new Date(review.createdAt).toLocaleDateString('ar-SA')}</div>
                  </div>
                </div>
                <div style={{display:'flex',gap:2,marginBottom:8}}>
                  {[1,2,3,4,5].map(s=>(
                    <Star key={s} size={16} style={{color:s<=review.rating?'#EAB308':'#374151',fill:s<=review.rating?'#EAB308':'none'}}/>
                  ))}
                </div>
                {review.comment && <p style={{color:'#D1D5DB',fontSize:14,margin:0,lineHeight:1.6}}>{review.comment}</p>}
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end'}}>
                <span className={`admin-badge ${review.approved?'admin-badge-success':'admin-badge-warning'}`}>
                  {review.approved?'موافق عليه':'بانتظار المراجعة'}
                </span>
                <div style={{display:'flex',gap:8}}>
                  {!review.approved && (
                    <button className="admin-btn admin-btn-sm" onClick={()=>handleApprove(review.id,true)} style={{background:'rgba(34,197,94,0.15)',color:'#22C55E',border:'1px solid rgba(34,197,94,0.3)'}}>
                      <Check size={14}/> قبول
                    </button>
                  )}
                  {review.approved && (
                    <button className="admin-btn admin-btn-sm" onClick={()=>handleApprove(review.id,false)} style={{background:'rgba(234,179,8,0.15)',color:'#EAB308',border:'1px solid rgba(234,179,8,0.3)'}}>
                      <X size={14}/> إخفاء
                    </button>
                  )}
                  <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={()=>handleDelete(review.id)} style={{color:'#EF4444'}}>
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
