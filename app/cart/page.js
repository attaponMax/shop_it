"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

// ─── Mock Auth ────────────────────────────────────────────────
// เปลี่ยนเป็น true เพื่อจำลอง login / false เพื่อทดสอบ redirect
const MOCK_IS_LOGGED_IN = false;
const MOCK_USER = { name: "สมชาย ใจดี", email: "somchai@email.com" };

// ─── Mock Cart Data ───────────────────────────────────────────
const initialCartItems = [
  {
    id: 1,
    name: "Mechanical Keyboard RGB Pro",
    brand: "Lorgar",
    price: 2990,
    originalPrice: 4500,
    qty: 1,
    img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80",
    tag: "Mechanical · RGB · Hot-swap",
    stock: 12,
  },
  {
    id: 2,
    name: "True Wireless Earbuds Pro",
    brand: "HECATE",
    price: 1490,
    originalPrice: 2200,
    qty: 2,
    img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
    tag: "ANC · 30hr Battery · IPX5",
    stock: 5,
  },
  {
    id: 3,
    name: "Gaming Mouse Wireless",
    brand: "Logitech",
    price: 3290,
    originalPrice: 3990,
    qty: 1,
    img: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&q=80",
    tag: "25600 DPI · Wireless · RGB",
    stock: 8,
  },
];

const SHIPPING_THRESHOLD = 1000;
const SHIPPING_COST = 0; // ส่งฟรี

function StarRating({ rating = 4.5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Login Prompt Modal ───────────────────────────────────────
function LoginPrompt({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" onClick={onClose} />
      {/* Modal */}
      <div className="relative bg-gray-900 border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 text-center">
          <div className="w-14 h-14 bg-amber-400/10 border border-amber-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-white text-lg font-bold mb-2">เข้าสู่ระบบก่อนชำระเงิน</h2>
          <p className="text-gray-400 text-sm mb-6">
            กรุณาเข้าสู่ระบบหรือสมัครสมาชิกเพื่อดำเนินการสั่งซื้อต่อ
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="/login"
              className="w-full bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(251,191,36,0.3)]"
            >
              เข้าสู่ระบบ
            </a>
            <a
              href="/register"
              className="w-full border border-white/15 hover:bg-white/5 text-white font-medium py-3 rounded-xl text-sm transition-all"
            >
              สมัครสมาชิกใหม่
            </a>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xs transition-colors mt-1">
              ยังไม่สมัคร ซื้อในฐานะแขก →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty Cart ───────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gray-800 border border-white/8 rounded-3xl flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400/10 border border-amber-400/30 rounded-full flex items-center justify-center">
          <span className="text-amber-400 text-xs font-bold">0</span>
        </div>
      </div>
      <h3 className="text-white text-lg font-bold mb-2">ตะกร้าสินค้าว่างเปล่า</h3>
      <p className="text-gray-500 text-sm mb-8 max-w-xs">ยังไม่มีสินค้าในตะกร้า เพิ่มสินค้าที่คุณสนใจเพื่อดำเนินการสั่งซื้อ</p>
      <a
        href="/products"
        className="bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold px-8 py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(251,191,36,0.3)]"
      >
        เลือกซื้อสินค้า 🛒
      </a>
    </div>
  );
}

// ─── Coupon Input ─────────────────────────────────────────────
function CouponInput({ onApply }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(null); // null | "success" | "error"

  const handleApply = () => {
    if (code.trim().toUpperCase() === "SANOOK50") {
      setStatus("success");
      onApply(50);
    } else {
      setStatus("error");
      onApply(0);
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value); setStatus(null); }}
          placeholder="กรอกโค้ดส่วนลด"
          className="flex-1 bg-gray-800 border border-white/10 focus:border-amber-400/50 text-white text-sm rounded-xl px-4 py-2.5 outline-none transition-colors placeholder-gray-600"
        />
        <button
          onClick={handleApply}
          className="bg-gray-800 border border-white/10 hover:border-amber-400/30 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:text-amber-400"
        >
          ใช้โค้ด
        </button>
      </div>
      {status === "success" && (
        <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          ใช้โค้ด SANOOK50 สำเร็จ! ลด ฿50
        </p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
          โค้ดไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง
        </p>
      )}
    </div>
  );
}

// ─── Not Logged In Screen ─────────────────────────────────────
function NotLoggedIn() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-20 h-20 rounded-2xl bg-gray-900 border border-white/10 flex items-center justify-center mb-6">
          <svg className="w-9 h-9 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-800 border border-white/10 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">เข้าสู่ระบบก่อนนะ</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          คุณต้องเข้าสู่ระบบก่อนเพื่อดูตะกร้าสินค้าของคุณ
          <br />สินค้าที่เพิ่มไว้จะถูกบันทึกเมื่อเข้าสู่ระบบแล้ว
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <a href="/login"
            className="flex-1 text-center bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(251,191,36,0.3)]">
            เข้าสู่ระบบ
          </a>
          <a href="/register"
            className="flex-1 text-center border border-white/15 hover:bg-white/5 text-white font-medium py-3 rounded-xl text-sm transition-colors">
            สมัครสมาชิกฟรี
          </a>
        </div>

        <div className="mt-10 w-full border-t border-white/8 pt-8">
          <p className="text-gray-500 text-xs mb-4">หรือเลือกดูสินค้าต่อ</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "⌨️ คีย์บอร์ด", href: "/category/keyboard" },
              { label: "🖱️ เมาส์", href: "/category/mouse" },
              { label: "🎧 หูฟัง", href: "/category/headset" },
              { label: "🖥️ Monitor", href: "/category/monitor" },
              { label: "💾 Storage", href: "/category/storage" },
            ].map((c) => (
              <a key={c.href} href={c.href}
                className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-gray-400 hover:border-amber-400/50 hover:text-amber-400 transition-colors">
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Cart Page ───────────────────────────────────────────
// Auth guard อยู่นอก hooks — ถ้าไม่ได้ login render NotLoggedIn เลย
export default function CartPage() {
  if (!MOCK_IS_LOGGED_IN) return <NotLoggedIn />;
  return <CartContent />;
}

function CartContent() {
  const [items, setItems] = useState(initialCartItems);
  const [discount, setDiscount] = useState(0);
  const [removingId, setRemovingId] = useState(null);

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, Math.min(item.stock, item.qty + delta)) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setRemovingId(null);
    }, 300);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const originalTotal = items.reduce((sum, item) => sum + item.originalPrice * item.qty, 0);
  const savedAmount = originalTotal - subtotal;
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const finalTotal = Math.max(0, subtotal - discount);

  const handleCheckout = () => {
    window.location.href = "/checkout";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* ─── Page Header ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <a href="/" className="hover:text-amber-400 transition-colors">หน้าแรก</a>
          <span>/</span>
          <span className="text-gray-300">ตะกร้าสินค้า</span>
        </div>

        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">ตะกร้าสินค้า</h1>
          {items.length > 0 && (
            <span className="bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full">
              {totalQty} ชิ้น
            </span>
          )}
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 mt-4">

            {/* ─── Left: Cart Items ─── */}
            <div className="flex-1 min-w-0">

              {/* User greeting if logged in */}
              {MOCK_IS_LOGGED_IN && (
                <div className="bg-gray-900 border border-white/8 rounded-2xl p-4 mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-amber-400 font-bold">{MOCK_USER.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{MOCK_USER.name}</p>
                    <p className="text-gray-500 text-xs">{MOCK_USER.email}</p>
                  </div>
                  <span className="ml-auto text-xs text-green-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    เข้าสู่ระบบแล้ว
                  </span>
                </div>
              )}

              {/* Items list */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-gray-900 border border-white/8 rounded-2xl overflow-hidden transition-all duration-300 ${
                      removingId === item.id ? "opacity-0 scale-95" : "opacity-100 scale-100"
                    }`}
                  >
                    <div className="flex gap-4 p-4">
                      {/* Product image */}
                      <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-800">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-0.5">{item.brand}</p>
                            <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2">{item.name}</h3>
                            <p className="text-gray-600 text-[10px] mt-0.5">{item.tag}</p>
                          </div>
                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="shrink-0 w-7 h-7 bg-gray-800 hover:bg-red-500/10 border border-white/8 hover:border-red-500/30 rounded-lg flex items-center justify-center transition-all group"
                          >
                            <svg className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        {/* Price + Qty row */}
                        <div className="flex items-center justify-between mt-3">
                          {/* Qty control */}
                          <div className="flex items-center gap-1 bg-gray-800 border border-white/8 rounded-xl p-1">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              disabled={item.qty <= 1}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="text-white text-sm font-semibold w-6 text-center">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              disabled={item.qty >= item.stock}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-amber-400 font-bold text-base">฿{(item.price * item.qty).toLocaleString()}</p>
                            {item.qty > 1 && (
                              <p className="text-gray-600 text-[10px]">฿{item.price.toLocaleString()} × {item.qty}</p>
                            )}
                            <p className="text-gray-600 text-[10px] line-through">฿{(item.originalPrice * item.qty).toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Stock warning */}
                        {item.stock <= 5 && (
                          <p className="text-orange-400 text-[10px] mt-2 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            เหลือสินค้าในคลังแค่ {item.stock} ชิ้น
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear cart */}
              <div className="mt-4 flex items-center justify-between">
                <a href="/products" className="flex items-center gap-2 text-sm text-gray-500 hover:text-amber-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  ช้อปต่อ
                </a>
                <button
                  onClick={() => setItems([])}
                  className="text-xs text-gray-600 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  ลบสินค้าทั้งหมด
                </button>
              </div>

              {/* ─── Suggested / You may also like ─── */}
              <div className="mt-8">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-0.5">บางทีคุณอาจชอบ</p>
                    <h3 className="text-white text-base font-bold">สินค้าแนะนำ</h3>
                  </div>
                  <a href="/products" className="text-xs text-gray-400 hover:text-amber-400 transition-colors">ดูทั้งหมด →</a>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 5, name: "4K Webcam Ultra HD", brand: "Logitech", price: 4290, img: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400&q=80" },
                    { id: 6, name: "USB-C Hub 7-in-1", brand: "Anker", price: 890, img: "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=400&q=80" },
                    { id: 7, name: "Monitor 27\" 144Hz", brand: "ASUS", price: 8990, img: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&q=80" },
                  ].map((p) => (
                    <a key={p.id} href={`/product/${p.id}`} className="group bg-gray-900 border border-white/8 rounded-xl overflow-hidden hover:border-amber-400/30 transition-all">
                      <div className="h-28 overflow-hidden bg-gray-800">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-3">
                        <p className="text-gray-500 text-[10px] uppercase font-semibold mb-0.5">{p.brand}</p>
                        <p className="text-white text-xs font-semibold leading-snug line-clamp-2 mb-2">{p.name}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-amber-400 font-bold text-sm">฿{p.price.toLocaleString()}</p>
                          <button className="bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-gray-950 text-[10px] font-bold px-2 py-1 rounded-lg transition-all">
                            + ตะกร้า
                          </button>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ─── Right: Order Summary ─── */}
            <div className="lg:w-80 xl:w-96 shrink-0">
              <div className="sticky top-20 space-y-4">

                {/* Summary card */}
                <div className="bg-gray-900 border border-white/8 rounded-2xl p-5">
                  {/* Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

                  <h2 className="text-white font-bold text-base mb-4">สรุปคำสั่งซื้อ</h2>

                  {/* Line items */}
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">ราคาสินค้า ({totalQty} ชิ้น)</span>
                      <span className="text-white">฿{subtotal.toLocaleString()}</span>
                    </div>
                    {savedAmount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-green-400">ส่วนลดสินค้า</span>
                        <span className="text-green-400">-฿{savedAmount.toLocaleString()}</span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-green-400">โค้ดส่วนลด</span>
                        <span className="text-green-400">-฿{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">ค่าจัดส่ง</span>
                      <span className="text-green-400 font-semibold">ฟรี 🎉</span>
                    </div>
                  </div>

                  <div className="border-t border-white/8 my-4" />

                  {/* Total */}
                  <div className="flex justify-between items-end mb-5">
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">ยอดรวมทั้งหมด</p>
                      <p className="text-white text-2xl font-bold">฿{finalTotal.toLocaleString()}</p>
                    </div>
                    {savedAmount + discount > 0 && (
                      <div className="text-right">
                        <p className="text-gray-500 text-xs">คุณประหยัดได้</p>
                        <p className="text-green-400 text-sm font-bold">฿{(savedAmount + discount).toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Coupon */}
                  <div className="mb-4">
                    <p className="text-gray-400 text-xs font-semibold mb-2">โค้ดส่วนลด</p>
                    <CouponInput onApply={setDiscount} />
                  </div>

                  {/* CTA */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold py-3.5 rounded-xl text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(251,191,36,0.35)] flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {MOCK_IS_LOGGED_IN ? "ดำเนินการสั่งซื้อ" : "เข้าสู่ระบบเพื่อสั่งซื้อ"}
                  </button>

                  {/* Trust */}
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
                    {["🔒 ชำระเงินปลอดภัย", "✅ สินค้าแท้ 100%", "🔄 คืนสินค้าใน 30 วัน"].map((t) => (
                      <span key={t} className="text-gray-600 text-[10px]">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Payment methods */}
                <div className="bg-gray-900 border border-white/8 rounded-2xl p-4">
                  <p className="text-gray-500 text-xs font-semibold mb-3 text-center">ช่องทางชำระเงินที่รองรับ</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["💳 บัตรเครดิต", "📱 PromptPay", "🏦 โอนเงิน", "💰 COD"].map((m) => (
                      <span key={m} className="bg-gray-800 border border-white/8 text-gray-400 text-[10px] px-2.5 py-1.5 rounded-lg">{m}</span>
                    ))}
                  </div>
                </div>

                {/* Shipping info */}
                <div className="bg-gray-900 border border-white/8 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <p className="text-white text-xs font-semibold">ข้อมูลการจัดส่ง</p>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-500">
                    <p>🚚 จัดส่งฟรีทั่วไทย ไม่มีขั้นต่ำ</p>
                    <p>⚡ สั่งวันนี้ ได้รับพรุ่งนี้ (กทม.)</p>
                    <p>📦 ส่งต่างจังหวัด 1–3 วันทำการ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/8 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold">ShopSanook</p>
            <p className="text-gray-600 text-xs mt-0.5">© 2026 All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            {["นโยบายความเป็นส่วนตัว", "เงื่อนไขการใช้งาน", "ติดต่อเรา", "วิธีการสั่งซื้อ"].map((l) => (
              <a key={l} href="#" className="hover:text-amber-400 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}