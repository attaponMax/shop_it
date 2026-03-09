"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ─── Mock Orders & Addresses (ยังไม่ได้เชื่อม DB) ─────────────
const MOCK_ORDERS = [
  { id: "ORD-2024-001", date: "10 มี.ค. 2025", status: "จัดส่งแล้ว", total: 5990, items: [{ name: "Keychron Q1 Pro", img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=80&q=80" }] },
  { id: "ORD-2024-002", date: "28 ก.พ. 2025", status: "กำลังจัดส่ง", total: 9990, items: [{ name: "Sony WH-1000XM5", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80" }] },
  { id: "ORD-2024-003", date: "14 ก.พ. 2025", status: "จัดส่งแล้ว", total: 5490, items: [{ name: "Logitech G Pro X2", img: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=80&q=80" }] },
  { id: "ORD-2024-004", date: "02 ก.พ. 2025", status: "ยกเลิก", total: 4290, items: [{ name: "Samsung 990 Pro NVMe", img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=80&q=80" }] },
];

const MOCK_ADDRESSES = [
  { id: 1, label: "บ้าน", name: "สมชาย ใจดี", phone: "081-234-5678", address: "123/45 ถ.สุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพมหานคร 10110", isDefault: true },
  { id: 2, label: "ที่ทำงาน", name: "สมชาย ใจดี", phone: "081-234-5678", address: "456 ถ.พระราม 4 แขวงสีลม เขตบางรัก กรุงเทพมหานคร 10500", isDefault: false },
];

const statusConfig = {
  "จัดส่งแล้ว": { color: "text-green-400 bg-green-400/10 border-green-400/25" },
  "กำลังจัดส่ง": { color: "text-blue-400 bg-blue-400/10 border-blue-400/25" },
  "รอชำระเงิน": { color: "text-amber-400 bg-amber-400/10 border-amber-400/25" },
  "ยกเลิก": { color: "text-red-400 bg-red-400/10 border-red-400/25" },
};

const tabs = [
  { id: "profile",  label: "ข้อมูลส่วนตัว",      icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
  { id: "orders",   label: "ประวัติคำสั่งซื้อ",   icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" },
  { id: "address",  label: "ที่อยู่จัดส่ง",       icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" },
  { id: "security", label: "ความปลอดภัย",          icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
];

// ─── Loading Screen ───────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <svg className="w-8 h-8 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );
}

// ─── Not Logged In ────────────────────────────────────────────
function NotLoggedIn() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-white/10 flex items-center justify-center mb-6">
          <svg className="w-9 h-9 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">เข้าสู่ระบบก่อนนะ</h1>
        <p className="text-gray-400 text-sm mb-8">คุณต้องเข้าสู่ระบบก่อนเพื่อดูข้อมูลบัญชีของคุณ</p>
        <div className="flex gap-3 w-full">
          <Link href="/login" className="flex-1 text-center bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5">เข้าสู่ระบบ</Link>
          <Link href="/register" className="flex-1 text-center border border-white/15 hover:bg-white/5 text-white font-medium py-3 rounded-xl text-sm transition-colors">สมัครสมาชิก</Link>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────
function ProfileTab({ user, userData, onUserDataUpdate }) {
  const nameParts = (userData?.name || user?.user_metadata?.name || "").split(" ");
  const [form, setForm] = useState({
    firstName: nameParts[0] || "",
    lastName:  nameParts.slice(1).join(" ") || "",
    email:     user?.email || "",
    phone:     userData?.phone || "",
  });
  const [saved, setSaved]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const inputCls = "w-full bg-gray-800 border border-white/10 focus:border-amber-400 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 outline-none transition-colors";

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const newName = `${form.firstName} ${form.lastName}`.trim();

      // อัปเดต users table
      const { error: dbError } = await supabase
        .from("users")
        .update({ name: newName })
        .eq("id", user.id);

      if (dbError) throw dbError;

      // อัปเดต Supabase Auth metadata
      await supabase.auth.updateUser({ data: { name: newName } });

      onUserDataUpdate({ ...userData, name: newName });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const displayName = userData?.name || user?.user_metadata?.name || user?.email || "ผู้ใช้";
  const initial = displayName[0]?.toUpperCase() || "U";
  const isGoogleUser = user?.app_metadata?.provider === "google";

  return (
    <div className="space-y-6">
      {/* Avatar section */}
      <div className="flex items-center gap-5 p-5 bg-gray-900 border border-white/8 rounded-2xl">
        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
          {user?.user_metadata?.avatar_url
            ? <img src={user.user_metadata.avatar_url} alt={displayName} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-amber-400 flex items-center justify-center text-gray-950 font-bold text-2xl">{initial}</div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold">{displayName}</p>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          {isGoogleUser && (
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-gray-400 bg-gray-800 border border-white/10 px-2 py-0.5 rounded-full">
              <svg className="w-3 h-3" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              เชื่อมกับ Google
            </span>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-gray-900 border border-white/8 rounded-2xl p-5 space-y-4">
        <h3 className="text-white font-semibold text-sm">ข้อมูลส่วนตัว</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">ชื่อ</label>
            <input value={form.firstName} onChange={set("firstName")} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">นามสกุล</label>
            <input value={form.lastName} onChange={set("lastName")} className={inputCls} />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">อีเมล</label>
          <input type="email" value={form.email} disabled
            className="w-full bg-gray-800/50 border border-white/5 rounded-xl py-3 px-4 text-sm text-gray-500 outline-none cursor-not-allowed" />
          <p className="text-gray-600 text-[10px] mt-1">อีเมลไม่สามารถเปลี่ยนได้</p>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">เบอร์โทรศัพท์</label>
          <input type="tel" value={form.phone} onChange={set("phone")} placeholder="08X-XXX-XXXX" className={inputCls} />
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="flex items-center gap-1.5 text-green-400 text-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
              บันทึกเรียบร้อยแล้ว
            </span>
          )}
          <button type="submit" disabled={loading}
            className="ml-auto flex items-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-400/50 text-gray-950 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5">
            {loading && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
            {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────
function OrdersTab() {
  const [filter, setFilter] = useState("ทั้งหมด");
  const statuses = ["ทั้งหมด", "กำลังจัดส่ง", "จัดส่งแล้ว", "ยกเลิก"];
  const filtered = MOCK_ORDERS.filter((o) => filter === "ทั้งหมด" || o.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
              filter === s ? "bg-amber-400 border-amber-400 text-gray-950 font-semibold" : "border-white/15 text-gray-400 hover:border-amber-400/40 hover:text-amber-400"
            }`}>
            {s}
          </button>
        ))}
      </div>
      {filtered.length === 0 && <div className="text-center py-16 text-gray-600 text-sm">ไม่พบคำสั่งซื้อ</div>}
      {filtered.map((order) => (
        <div key={order.id} className="bg-gray-900 border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-colors">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-white text-sm font-semibold">{order.id}</p>
              <p className="text-gray-500 text-xs mt-0.5">{order.date}</p>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusConfig[order.status]?.color}`}>{order.status}</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                <p className="text-gray-300 text-xs">{item.name}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-white/8">
            <p className="text-gray-400 text-sm">ยอดรวม <span className="text-amber-400 font-bold">฿{order.total.toLocaleString()}</span></p>
            <div className="flex gap-2">
              {order.status === "จัดส่งแล้ว" && (
                <button className="text-xs border border-white/15 hover:border-amber-400/40 text-gray-400 hover:text-amber-400 px-3 py-1.5 rounded-lg transition-colors">รีวิวสินค้า</button>
              )}
              <button className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors">ดูรายละเอียด</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Address Tab ──────────────────────────────────────────────
function AddressTab() {
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const setDefault = (id) => setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  const remove = (id) => setAddresses((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="space-y-4">
      {addresses.map((addr) => (
        <div key={addr.id} className={`bg-gray-900 border rounded-2xl p-5 transition-colors ${addr.isDefault ? "border-amber-400/30" : "border-white/8 hover:border-white/15"}`}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-gray-800 border border-white/10 px-2 py-0.5 rounded-full text-gray-300">{addr.label}</span>
              {addr.isDefault && <span className="text-xs font-semibold bg-amber-400/15 border border-amber-400/30 text-amber-400 px-2 py-0.5 rounded-full">ค่าเริ่มต้น</span>}
            </div>
            <div className="flex items-center gap-1.5">
              {!addr.isDefault && <button onClick={() => setDefault(addr.id)} className="text-[11px] text-gray-500 hover:text-amber-400 transition-colors px-2 py-1 rounded-lg">ตั้งค่าเริ่มต้น</button>}
              <button className="text-[11px] text-gray-500 hover:text-white transition-colors px-2 py-1 rounded-lg">แก้ไข</button>
              {!addr.isDefault && <button onClick={() => remove(addr.id)} className="text-[11px] text-gray-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg">ลบ</button>}
            </div>
          </div>
          <p className="text-white text-sm font-medium">{addr.name}</p>
          <p className="text-gray-400 text-xs mt-0.5">{addr.phone}</p>
          <p className="text-gray-500 text-xs mt-1 leading-relaxed">{addr.address}</p>
        </div>
      ))}
      <button className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-white/15 hover:border-amber-400/40 text-gray-500 hover:text-amber-400 rounded-2xl py-4 text-sm transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        เพิ่มที่อยู่ใหม่
      </button>
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────
function SecurityTab({ user }) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [saved, setSaved]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const inputCls = "w-full bg-gray-800 border border-white/10 focus:border-amber-400 rounded-xl py-3 pl-4 pr-11 text-sm text-white placeholder-gray-600 outline-none transition-colors";
  const isGoogleUser = user?.app_metadata?.provider === "google";

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    if (form.newPassword !== form.confirmPassword) { setError("รหัสผ่านใหม่ไม่ตรงกัน"); return; }
    if (form.newPassword.length < 8) { setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: form.newPassword });
      if (error) throw error;
      setSaved(true);
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Change password */}
      {isGoogleUser ? (
        <div className="bg-gray-900 border border-white/8 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-semibold">บัญชี Google</p>
              <p className="text-gray-500 text-xs mt-0.5">คุณ login ด้วย Google จึงไม่มีรหัสผ่านสำหรับเปลี่ยน</p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleChangePassword} className="bg-gray-900 border border-white/8 rounded-2xl p-5 space-y-4">
          <h3 className="text-white font-semibold text-sm">เปลี่ยนรหัสผ่าน</h3>
          {[
            { label: "รหัสผ่านใหม่",          field: "newPassword",     show: showNew, toggle: () => setShowNew(!showNew) },
            { label: "ยืนยันรหัสผ่านใหม่",    field: "confirmPassword", show: showNew, toggle: () => setShowNew(!showNew) },
          ].map(({ label, field, show, toggle }) => (
            <div key={field}>
              <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={form[field]} onChange={set(field)} placeholder="••••••••" className={inputCls} />
                <button type="button" onClick={toggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {show
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>
          ))}
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex items-center justify-between pt-1">
            {saved && <span className="flex items-center gap-1.5 text-green-400 text-xs"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>เปลี่ยนรหัสผ่านเรียบร้อย</span>}
            <button type="submit" disabled={loading}
              className="ml-auto flex items-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-400/50 text-gray-950 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5">
              {loading && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
              {loading ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
            </button>
          </div>
        </form>
      )}

      {/* 2FA */}
      <div className="bg-gray-900 border border-white/8 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-semibold">การยืนยันตัวตน 2 ขั้นตอน (2FA)</p>
            <p className="text-gray-500 text-xs mt-0.5">เพิ่มความปลอดภัยให้บัญชีของคุณ</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-400">ปิดอยู่</span>
            <button className="w-10 h-5 rounded-full bg-gray-700 relative transition-colors hover:bg-gray-600">
              <span className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-gray-400 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
        <h3 className="text-red-400 font-semibold text-sm mb-1">Danger Zone</h3>
        <p className="text-gray-500 text-xs mb-4">การกระทำเหล่านี้ไม่สามารถย้อนกลับได้</p>
        <button className="text-xs border border-red-500/40 hover:bg-red-500/10 text-red-400 px-4 py-2 rounded-lg transition-colors">
          ลบบัญชีถาวร
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AccountPage() {
  const router = useRouter();
  const [session, setSession]   = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
      else { setUserData(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    const { data } = await supabase
      .from("users")
      .select("name, role, avatar_url")
      .eq("id", userId)
      .single();
    if (data) setUserData(data);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return <LoadingScreen />;
  if (!session) return <NotLoggedIn />;

  const displayName = userData?.name || session.user?.user_metadata?.name || session.user?.email || "ผู้ใช้";
  const initial = displayName[0]?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-amber-400 transition-colors">หน้าแรก</Link>
          <span>/</span>
          <span className="text-gray-300">บัญชีของฉัน</span>
        </div>

        <div className="flex gap-6 flex-col lg:flex-row">

          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            {/* User card */}
            <div className="bg-gray-900 border border-white/8 rounded-2xl p-4 mb-4 flex lg:flex-col items-center lg:items-start gap-3">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl overflow-hidden flex-shrink-0">
                {session.user?.user_metadata?.avatar_url
                  ? <img src={session.user.user_metadata.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-amber-400 flex items-center justify-center text-gray-950 font-bold text-xl">{initial}</div>
                }
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">{displayName}</p>
                <p className="text-gray-500 text-xs truncate">{session.user?.email}</p>
                {userData?.role === "admin" && (
                  <span className="inline-block mt-1.5 text-[9px] font-bold bg-amber-400/10 border border-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full">Admin</span>
                )}
              </div>
            </div>

            {/* Nav */}
            <nav className="bg-gray-900 border border-white/8 rounded-2xl p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap w-full text-left ${
                    activeTab === tab.id ? "bg-amber-400/15 text-amber-400 font-medium" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path d={tab.icon} />
                  </svg>
                  <span className="hidden lg:block">{tab.label}</span>
                </button>
              ))}

              <div className="h-px bg-white/8 my-1 hidden lg:block" />

              {/* Sign out */}
              <button onClick={handleSignOut}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-colors w-full text-left whitespace-nowrap">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                </svg>
                <span className="hidden lg:block">ออกจากระบบ</span>
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white mb-6">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            {activeTab === "profile"  && <ProfileTab user={session.user} userData={userData} onUserDataUpdate={setUserData} />}
            {activeTab === "orders"   && <OrdersTab />}
            {activeTab === "address"  && <AddressTab />}
            {activeTab === "security" && <SecurityTab user={session.user} />}
          </div>
        </div>
      </div>
    </div>
  );
}