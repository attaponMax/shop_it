"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

// ─── Constants ────────────────────────────────
const CATEGORIES = [
  { value: "keyboard",  label: "⌨️ คีย์บอร์ด" },
  { value: "mouse",     label: "🖱️ เมาส์" },
  { value: "headset",   label: "🎧 หูฟัง" },
  { value: "monitor",   label: "🖥️ จอมอนิเตอร์" },
  { value: "storage",   label: "💾 Storage" },
  { value: "accessory", label: "🎮 อุปกรณ์เสริม" },
  { value: "other",     label: "📦 อื่นๆ" },
];

const STATUSES = [
  { value: "active",       label: "วางขาย",  color: "text-green-400",  bg: "bg-green-400/10  border-green-400/20" },
  { value: "hidden",       label: "ซ่อน",    color: "text-gray-400",   bg: "bg-gray-400/10   border-gray-400/20" },
  { value: "out_of_stock", label: "หมด",     color: "text-red-400",    bg: "bg-red-400/10    border-red-400/20" },
];

const EMPTY_FORM = {
  name: "", description: "", brand: "", category: "keyboard",
  price: "", original_price: "", stock: "", status: "active",
  tags: "", specs: "", images: [], is_featured: false,
};

// ─── Helpers ──────────────────────────────────
function formatPrice(n) {
  return Number(n).toLocaleString("th-TH", { minimumFractionDigits: 0 });
}
function discountPct(price, original) {
  if (!original || original <= price) return null;
  return Math.round((1 - price / original) * 100);
}
function statusBadge(status) {
  const s = STATUSES.find((x) => x.value === status) || STATUSES[0];
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${s.bg} ${s.color}`}>
      {s.label}
    </span>
  );
}
function catLabel(val) {
  return CATEGORIES.find((c) => c.value === val)?.label || val;
}

// ─── Auth screens ──────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <svg className="w-8 h-8 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>
  );
}

// ─── Image Uploader ────────────────────────────
function ImageUploader({ images, onChange }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const upload = async (files) => {
    setUploading(true);
    const results = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res  = await fetch("/api/products/upload-image", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) results.push(data.url);
      } catch (e) {
        console.error(e);
      }
    }
    onChange([...images, ...results]);
    setUploading(false);
  };

  const remove = (idx) => onChange(images.filter((_, i) => i !== idx));
  const setMain = (idx) => {
    const reordered = [...images];
    const [item] = reordered.splice(idx, 1);
    reordered.unshift(item);
    onChange(reordered);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {images.map((url, i) => (
          <div key={url} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-white/10">
            <img src={url} alt="" className="w-full h-full object-cover"/>
            {i === 0 && (
              <span className="absolute top-1 left-1 text-[9px] bg-amber-400 text-gray-950 font-bold px-1.5 py-0.5 rounded-full">
                หลัก
              </span>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-1.5">
              {i !== 0 && (
                <button type="button" onClick={() => setMain(i)} title="ตั้งเป็นรูปหลัก"
                  className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-gray-950">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                  </svg>
                </button>
              )}
              <button type="button" onClick={() => remove(i)}
                className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        ))}

        {/* Upload button */}
        <button type="button" onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-20 h-20 rounded-xl border-2 border-dashed border-white/15 hover:border-amber-400/50 hover:bg-amber-400/5 flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-50">
          {uploading
            ? <svg className="w-5 h-5 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            : <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
          }
          <span className="text-gray-600 text-[9px]">{uploading ? "อัปโหลด..." : "เพิ่มรูป"}</span>
        </button>
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => upload(Array.from(e.target.files || []))}/>
      <p className="text-gray-600 text-[10px]">JPG, PNG, WEBP · ไม่เกิน 5MB ต่อรูป · รูปแรก = รูปหลัก</p>
    </div>
  );
}

// ─── Product Form Modal ────────────────────────
function ProductModal({ product, onClose, onSave }) {
  const [form, setForm]       = useState(product ? {
    ...product,
    tags: (product.tags || []).join(", "),
    specs: product.specs ? JSON.stringify(product.specs, null, 2) : "",
  } : EMPTY_FORM);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const isEdit = !!product;

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.brand || !form.price) {
      setError("กรุณากรอกชื่อ, แบรนด์ และราคา"); return;
    }
    setSaving(true);
    try {
      let parsedSpecs = {};
      if (form.specs?.trim()) {
        try { parsedSpecs = JSON.parse(form.specs); }
        catch { setError("Specs JSON format ไม่ถูกต้อง"); setSaving(false); return; }
      }

      const payload = {
        ...form,
        tags:           form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        specs:          parsedSpecs,
        price:          parseFloat(form.price),
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        stock:          parseInt(form.stock) || 0,
      };

      const url    = isEdit ? `/api/products/${product.id}` : "/api/products";
      const method = isEdit ? "PATCH" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onSave(data.product);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const field = "bg-gray-800/60 border border-white/10 focus:border-amber-400/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors w-full";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-white font-bold text-base">{isEdit ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* รูปภาพ */}
          <div>
            <label className="text-gray-400 text-xs font-medium mb-2 block">รูปภาพสินค้า</label>
            <ImageUploader images={form.images || []} onChange={(imgs) => set("images", imgs)}/>
          </div>

          {/* ชื่อ + แบรนด์ */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">ชื่อสินค้า <span className="text-red-400">*</span></label>
              <input className={field} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Keychron Q1 Pro"/>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">แบรนด์ <span className="text-red-400">*</span></label>
              <input className={field} value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Keychron"/>
            </div>
          </div>

          {/* หมวดหมู่ + สถานะ */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">หมวดหมู่</label>
              <select className={field} value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">สถานะ</label>
              <select className={field} value={form.status} onChange={(e) => set("status", e.target.value)}>
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* ราคา */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">ราคาขาย <span className="text-red-400">*</span></label>
              <input className={field} type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0"/>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">ราคาเต็ม (ก่อนลด)</label>
              <input className={field} type="number" value={form.original_price} onChange={(e) => set("original_price", e.target.value)} placeholder="0"/>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">จำนวนสต็อก</label>
              <input className={field} type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} placeholder="0"/>
            </div>
          </div>

          {/* รายละเอียด */}
          <div>
            <label className="text-gray-400 text-xs font-medium mb-1.5 block">รายละเอียด</label>
            <textarea className={`${field} resize-none`} rows={3} value={form.description}
              onChange={(e) => set("description", e.target.value)} placeholder="รายละเอียดสินค้า..."/>
          </div>

          {/* Tags */}
          <div>
            <label className="text-gray-400 text-xs font-medium mb-1.5 block">Tags <span className="text-gray-600 font-normal">(คั่นด้วยลูกน้ำ)</span></label>
            <input className={field} value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="Wireless, RGB, Hot-swap, 75%"/>
          </div>

          {/* Specs JSON */}
          <div>
            <label className="text-gray-400 text-xs font-medium mb-1.5 block">
              Specs <span className="text-gray-600 font-normal">(JSON format)</span>
            </label>
            <textarea className={`${field} resize-none font-mono text-xs`} rows={3} value={form.specs}
              onChange={(e) => set("specs", e.target.value)}
              placeholder={'{\n  "connectivity": "Bluetooth 5.0",\n  "battery": "4000mAh"\n}'}/>
          </div>

          {/* Featured */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-10 h-5 rounded-full transition-colors ${form.is_featured ? "bg-amber-400" : "bg-gray-700"} relative`}
              onClick={() => set("is_featured", !form.is_featured)}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.is_featured ? "left-5" : "left-0.5"}`}/>
            </div>
            <span className="text-gray-300 text-sm">แสดงในหน้าแรก (Featured)</span>
          </label>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 text-red-400 text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border border-white/15 hover:bg-white/5 text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
              ยกเลิก
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-amber-400 hover:bg-amber-300 disabled:bg-gray-700 disabled:text-gray-500 text-gray-950 font-bold py-2.5 rounded-xl text-sm transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0">
              {saving ? "กำลังบันทึก..." : isEdit ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ──────────────────────
function DeleteModal({ count, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
          </svg>
        </div>
        <h3 className="text-white font-bold text-lg mb-2">ยืนยันการลบ</h3>
        <p className="text-gray-400 text-sm mb-6">ลบ <span className="text-red-400 font-semibold">{count} รายการ</span> ที่เลือก? การกระทำนี้ไม่สามารถย้อนกลับได้</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-white/15 hover:bg-white/5 text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
            ยกเลิก
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-400 disabled:bg-gray-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
            {loading ? "กำลังลบ..." : "ลบเลย"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────
export default function AdminProducts() {
  const [session, setSession]     = useState(null);
  const [userData, setUserData]   = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUser(session.user.id); else setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) fetchUser(s.user.id); else { setUserData(null); setAuthLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchUser = async (id) => {
    const { data } = await supabase.from("users").select("name, role").eq("id", id).single();
    setUserData(data); setAuthLoading(false);
  };

  if (authLoading) return <LoadingScreen/>;
  if (!session || userData?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold mb-2">ไม่มีสิทธิ์เข้าถึง</p>
          <a href="/" className="text-amber-400 hover:underline text-sm">กลับหน้าแรก</a>
        </div>
      </div>
    );
  }
  return <ProductsContent userData={userData}/>;
}

// ─── Products Content ──────────────────────────
function ProductsContent({ userData }) {
  const [products, setProducts]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterStat, setFilterStat] = useState("");
  const [sort, setSort]           = useState("created_at");
  const [order, setOrder]         = useState("desc");
  const [page, setPage]           = useState(1);
  const [selected, setSelected]   = useState(new Set());
  const [modal, setModal]         = useState(null); // null | 'add' | product obj
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [stats, setStats]         = useState(null);

  const LIMIT = 20;

  // ── Fetch products ──
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      search, sort, order, page: String(page), limit: String(LIMIT),
      ...(filterCat  && { category: filterCat }),
      ...(filterStat && { status:   filterStat }),
    });
    try {
      const res  = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [search, filterCat, filterStat, sort, order, page]);

  // ── Fetch stats ──
  const fetchStats = useCallback(async () => {
    const res  = await fetch("/api/products?limit=1000");
    const data = await res.json();
    const all  = data.products || [];
    setStats({
      total:        data.total || 0,
      active:       all.filter((p) => p.status === "active").length,
      hidden:       all.filter((p) => p.status === "hidden").length,
      out_of_stock: all.filter((p) => p.status === "out_of_stock").length,
      low_stock:    all.filter((p) => p.stock <= 5 && p.stock > 0).length,
    });
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  // ── Select ──
  const toggleSelect = (id) => {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const toggleAll = () => {
    setSelected(selected.size === products.length ? new Set() : new Set(products.map((p) => p.id)));
  };

  // ── Delete ──
  const handleDelete = async () => {
    setDeleting(true);
    await Promise.all([...selected].map((id) =>
      fetch(`/api/products/${id}`, { method: "DELETE" })
    ));
    setSelected(new Set());
    setDeleteModal(false);
    setDeleting(false);
    fetchProducts();
    fetchStats();
  };

  // ── Save (add/edit) ──
  const handleSave = (product) => {
    setModal(null);
    fetchProducts();
    fetchStats();
  };

  // ── Quick status toggle ──
  const quickStatus = async (id, status) => {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchProducts();
    fetchStats();
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <a href="/" className="hover:text-amber-400 transition-colors">หน้าแรก</a>
              <span>/</span>
              <a href="/dashboard" className="hover:text-amber-400 transition-colors">Admin</a>
              <span>/</span>
              <span className="text-gray-300">จัดการสินค้า</span>
            </div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </span>
              จัดการสินค้า
              <span className="text-[10px] font-semibold bg-amber-400/10 border border-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full">Admin</span>
            </h1>
          </div>
          <button onClick={() => setModal("add")}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-400/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4"/>
            </svg>
            เพิ่มสินค้า
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {[
              { label: "ทั้งหมด",    value: stats.total,        color: "amber",   icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
              { label: "วางขาย",     value: stats.active,       color: "green",   icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "ซ่อนอยู่",   value: stats.hidden,       color: "gray",    icon: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" },
              { label: "หมดสต็อก",  value: stats.out_of_stock,  color: "red",     icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" },
              { label: "สต็อกน้อย", value: stats.low_stock,    color: "orange",  icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-900 border border-white/8 rounded-2xl p-4">
                <p className="text-gray-500 text-[10px] mb-1">{s.label}</p>
                <p className="text-white text-xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="ค้นหาชื่อหรือแบรนด์..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-white/8 focus:border-amber-400/50 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-colors"/>
          </div>

          {/* Filters */}
          <select value={filterCat} onChange={(e) => { setFilterCat(e.target.value); setPage(1); }}
            className="bg-gray-900 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-gray-300 outline-none">
            <option value="">ทุกหมวดหมู่</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>

          <select value={filterStat} onChange={(e) => { setFilterStat(e.target.value); setPage(1); }}
            className="bg-gray-900 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-gray-300 outline-none">
            <option value="">ทุกสถานะ</option>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          <select value={`${sort}-${order}`}
            onChange={(e) => { const [s, o] = e.target.value.split("-"); setSort(s); setOrder(o); setPage(1); }}
            className="bg-gray-900 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-gray-300 outline-none">
            <option value="created_at-desc">ใหม่สุด</option>
            <option value="created_at-asc">เก่าสุด</option>
            <option value="price-asc">ราคา ↑</option>
            <option value="price-desc">ราคา ↓</option>
            <option value="name-asc">ชื่อ A-Z</option>
            <option value="stock-asc">สต็อกน้อย</option>
            <option value="rating-desc">Rating สูง</option>
          </select>
        </div>

        {/* Bulk Action Bar */}
        {selected.size > 0 && (
          <div className="flex items-center justify-between bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-2.5 mb-4">
            <span className="text-amber-400 text-sm font-semibold">เลือกแล้ว {selected.size} รายการ</span>
            <div className="flex gap-2">
              <button onClick={() => setSelected(new Set())}
                className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                ยกเลิก
              </button>
              <button onClick={() => setDeleteModal(true)}
                className="text-xs text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 px-3 py-1.5 rounded-lg transition-all font-semibold">
                ลบที่เลือก
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-gray-900 border border-white/8 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-white/8 text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <div className="flex items-center">
              <input type="checkbox" checked={selected.size === products.length && products.length > 0}
                onChange={toggleAll}
                className="w-4 h-4 rounded border-white/20 accent-amber-400 cursor-pointer"/>
            </div>
            <div>สินค้า</div>
            <div>หมวดหมู่</div>
            <div>ราคา</div>
            <div>สต็อก / สถานะ</div>
            <div>จัดการ</div>
          </div>

          {/* Rows */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <svg className="w-7 h-7 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-600">
              <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              <p className="text-sm">ไม่พบสินค้า</p>
            </div>
          ) : (
            products.map((product) => {
              const disc = discountPct(product.price, product.original_price);
              return (
                <div key={product.id}
                  className={`grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 border-b border-white/5 hover:bg-white/2 transition-colors items-center ${selected.has(product.id) ? "bg-amber-400/3" : ""}`}>

                  {/* Checkbox */}
                  <div className="flex items-center">
                    <input type="checkbox" checked={selected.has(product.id)} onChange={() => toggleSelect(product.id)}
                      className="w-4 h-4 rounded border-white/20 accent-amber-400 cursor-pointer"/>
                  </div>

                  {/* Product */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gray-800 border border-white/8 overflow-hidden flex-shrink-0">
                      {product.images?.[0]
                        ? <img src={product.images[0]} alt="" className="w-full h-full object-cover"/>
                        : <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                          </div>
                      }
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="text-white text-sm font-medium truncate">{product.name}</p>
                        {product.is_featured && <span className="text-amber-400 text-[9px]">★</span>}
                      </div>
                      <p className="text-gray-500 text-xs">{product.brand}</p>
                      {product.tags?.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {product.tags.slice(0, 3).map((t) => (
                            <span key={t} className="text-[9px] bg-white/5 border border-white/8 text-gray-400 px-1.5 py-0.5 rounded-full">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="text-gray-400 text-xs">{catLabel(product.category)}</div>

                  {/* Price */}
                  <div>
                    <p className="text-white text-sm font-semibold">฿{formatPrice(product.price)}</p>
                    {product.original_price && (
                      <p className="text-gray-600 text-xs line-through">฿{formatPrice(product.original_price)}</p>
                    )}
                    {disc && (
                      <span className="text-[9px] bg-red-500/10 border border-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-semibold">-{disc}%</span>
                    )}
                  </div>

                  {/* Stock + Status */}
                  <div className="space-y-1.5">
                    <div className={`text-xs font-semibold ${product.stock === 0 ? "text-red-400" : product.stock <= 5 ? "text-orange-400" : "text-gray-300"}`}>
                      {product.stock === 0 ? "หมด" : `${product.stock} ชิ้น`}
                      {product.stock > 0 && product.stock <= 5 && <span className="text-orange-400 ml-1">(น้อย)</span>}
                    </div>
                    {statusBadge(product.status)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {/* Quick status */}
                    <select value={product.status}
                      onChange={(e) => quickStatus(product.id, e.target.value)}
                      className="text-[10px] bg-gray-800 border border-white/8 rounded-lg px-2 py-1 text-gray-400 outline-none cursor-pointer">
                      {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>

                    {/* Edit */}
                    <button onClick={() => setModal(product)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-amber-400 hover:bg-amber-400/5 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>

                    {/* Preview */}
                    <a href={`/product/${product.slug || product.id}`} target="_blank" rel="noreferrer"
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-400 hover:bg-blue-400/5 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </a>

                    {/* Delete single */}
                    <button onClick={() => { setSelected(new Set([product.id])); setDeleteModal(true); }}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 0V4a1 1 0 011-1h2a1 1 0 011 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-gray-500 text-xs">แสดง {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} จาก {total} รายการ</p>
            <div className="flex gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center bg-gray-900 border border-white/8 rounded-xl text-gray-400 hover:text-white disabled:opacity-30 transition-colors text-xs">‹</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-semibold transition-all ${page === p ? "bg-amber-400 text-gray-950" : "bg-gray-900 border border-white/8 text-gray-400 hover:text-white"}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center bg-gray-900 border border-white/8 rounded-xl text-gray-400 hover:text-white disabled:opacity-30 transition-colors text-xs">›</button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal && (
        <ProductModal
          product={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {deleteModal && (
        <DeleteModal
          count={selected.size}
          onConfirm={handleDelete}
          onClose={() => setDeleteModal(false)}
          loading={deleting}
        />
      )}
    </div>
  );
}