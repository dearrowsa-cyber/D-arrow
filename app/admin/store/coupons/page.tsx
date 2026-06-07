'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Ticket, Edit2 } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder?: number;
  maxUses?: number;
  expiresAt?: string;
  active: boolean;
  usedCount: number;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg:string;type:string}|null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [deleteId, setDeleteId] = useState<string|null>(null);
  const [form, setForm] = useState({code:'',type:'percentage',value:'',minOrder:'',maxUses:'',expiresAt:'',active:true});

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try { const r = await fetch('/api/store/coupons'); const d = await r.json(); if(d.success) setCoupons(d.coupons||[]); } catch{} finally{setLoading(false);}
  };

  const resetForm = () => { setForm({code:'',type:'percentage',value:'',minOrder:'',maxUses:'',expiresAt:'',active:true}); setEditId(null); setShowForm(false); };

  const handleSubmit = async () => {
    if(!form.code||!form.value) return showToast('أدخل الكود والقيمة','error');
    const method = editId ? 'PUT' : 'POST';
    const body = editId ? {...form, id: editId} : form;
    try {
      const r = await fetch('/api/store/coupons',{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const d = await r.json();
      if(d.success){showToast(editId?'تم التحديث':'تم الإنشاء','success');fetchCoupons();resetForm();}
      else showToast(d.error||'فشل','error');
    } catch{showToast('خطأ','error');}
  };

  const handleDelete = async () => {
    if(!deleteId) return;
    try { const r = await fetch(`/api/store/coupons?id=${deleteId}`,{method:'DELETE'}); const d = await r.json(); if(d.success){setCoupons(p=>p.filter(c=>c.id!==deleteId));showToast('تم الحذف','success');} } catch{}
    setDeleteId(null);
  };

  const startEdit = (c: Coupon) => {
    setForm({code:c.code,type:c.type,value:String(c.value),minOrder:c.minOrder?String(c.minOrder):'',maxUses:c.maxUses?String(c.maxUses):'',expiresAt:c.expiresAt?new Date(c.expiresAt).toISOString().split('T')[0]:'',active:c.active});
    setEditId(c.id); setShowForm(true);
  };

  const showToast = (msg:string,type:string) => {setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  return (
    <div className="admin-content">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}
      {deleteId && (
        <div className="admin-overlay"><div className="admin-dialog" style={{textAlign:'center'}}>
          <Trash2 size={40} style={{color:'#EF4444',marginBottom:16}} />
          <h3 style={{color:'#E6E6EA',margin:'0 0 8px'}}>حذف الكوبون</h3>
          <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:16}}>
            <button className="admin-btn admin-btn-ghost" onClick={()=>setDeleteId(null)}>إلغاء</button>
            <button className="admin-btn admin-btn-danger" onClick={handleDelete}>حذف</button>
          </div>
        </div></div>
      )}

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <h2 style={{fontSize:24,fontWeight:700,color:'#E6E6EA',margin:0}}>الكوبونات</h2>
        <button className="admin-btn admin-btn-primary" onClick={()=>{resetForm();setShowForm(true);}}><Plus size={16}/> إضافة كوبون</button>
      </div>

      {showForm && (
        <div className="admin-card" style={{marginBottom:24}}>
          <h4 style={{color:'#E6E6EA',margin:'0 0 16px'}}>{editId?'تعديل':'كوبون جديد'}</h4>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            <div><label className="admin-label">الكود *</label><input className="admin-input" placeholder="SALE20" value={form.code} onChange={e=>setForm(p=>({...p,code:e.target.value.toUpperCase()}))} dir="ltr"/></div>
            <div><label className="admin-label">النوع</label><select className="admin-select" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}><option value="percentage">نسبة %</option><option value="fixed">مبلغ ثابت</option></select></div>
            <div><label className="admin-label">القيمة *</label><input className="admin-input" type="number" value={form.value} onChange={e=>setForm(p=>({...p,value:e.target.value}))} dir="ltr"/></div>
            <div><label className="admin-label">الحد الأدنى</label><input className="admin-input" type="number" placeholder="اختياري" value={form.minOrder} onChange={e=>setForm(p=>({...p,minOrder:e.target.value}))} dir="ltr"/></div>
            <div><label className="admin-label">الحد الأقصى للاستخدام</label><input className="admin-input" type="number" placeholder="غير محدود" value={form.maxUses} onChange={e=>setForm(p=>({...p,maxUses:e.target.value}))} dir="ltr"/></div>
            <div><label className="admin-label">تاريخ الانتهاء</label><input className="admin-input" type="date" value={form.expiresAt} onChange={e=>setForm(p=>({...p,expiresAt:e.target.value}))} dir="ltr"/></div>
          </div>
          <div style={{display:'flex',gap:12,marginTop:16,justifyContent:'flex-end'}}>
            <button className="admin-btn admin-btn-ghost" onClick={resetForm}>إلغاء</button>
            <button className="admin-btn admin-btn-primary" onClick={handleSubmit}>{editId?'تحديث':'إنشاء'}</button>
          </div>
        </div>
      )}

      <div className="admin-card" style={{padding:0,overflow:'hidden'}}>
        {loading ? (
          <div style={{padding:64,textAlign:'center'}}><div style={{width:36,height:36,border:'3px solid rgba(255,77,109,0.2)',borderTopColor:'#FF4D6D',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto'}}/></div>
        ) : coupons.length===0 ? (
          <div className="admin-empty"><Ticket size={64}/><h3 style={{color:'#9CA3AF',margin:'16px 0 8px'}}>لا توجد كوبونات</h3></div>
        ) : (
          <table className="admin-table"><thead><tr><th>الكود</th><th>النوع</th><th>القيمة</th><th>الاستخدام</th><th>الانتهاء</th><th>الحالة</th><th>إجراءات</th></tr></thead>
          <tbody>{coupons.map(c=>(
            <tr key={c.id}>
              <td style={{fontWeight:700,color:'#FF4D6D',fontFamily:'monospace'}}>{c.code}</td>
              <td>{c.type==='percentage'?'نسبة %':'مبلغ ثابت'}</td>
              <td style={{fontWeight:600}}>{c.value}{c.type==='percentage'?'%':' ر.س'}</td>
              <td>{c.usedCount}{c.maxUses?` / ${c.maxUses}`:' / ∞'}</td>
              <td style={{fontSize:13}}>{c.expiresAt?new Date(c.expiresAt).toLocaleDateString('ar-SA'):'—'}</td>
              <td><span className={`admin-badge ${c.active?'admin-badge-success':'admin-badge-danger'}`}>{c.active?'مفعّل':'معطّل'}</span></td>
              <td><div style={{display:'flex',gap:8}}>
                <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={()=>startEdit(c)}><Edit2 size={14}/></button>
                <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={()=>setDeleteId(c.id)} style={{color:'#EF4444'}}><Trash2 size={14}/></button>
              </div></td>
            </tr>
          ))}</tbody></table>
        )}
      </div>
    </div>
  );
}
