"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { createClient } from "@supabase/supabase-js";
import { useCart } from "../lib/cart";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function CouponInput({ onApply }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(null);
  const handleApply = () => {
    if (code.trim().toUpperCase() === "SANOOK50") { setStatus("success"); onApply(50); }
    else { setStatus("error"); onApply(0); }
  };
  return (
    <div>
      <div className="flex gap-2">
        <input type="text" value={code} onChange={(e) => { setCode(e.target.value); setStatus(null); }} placeholder="กรอกโค้ดส่วนลด"
          className="flex-1 bg-gray-800 border border-white/10 focus:border-amber-400/50 text-white text-sm rounded-xl px-4 py-2.5 outline-none transition-colors placeholder-gray-600" />
        <button onClick={handleApply} className="bg-gray-800 border border-white/10 hover:border-amber-400/30 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:text-amber-400">ใช้โค้ด</button>
      </div>
      {status === "success" && <p className="text-green-400 text-xs mt-2">✅ ใช้โค้ด SANOOK50 สำเร็จ! ลด ฿50</p>}
      {status === "error" && <p className="text-red-400 text-xs mt-2">❌ โค้ดไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง</p>}
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-24 h-24 bg-gray-800 border border-white/8 rounded-3xl flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      </div>
      <h3 className="text-white text-lg font-bold mb-2">ตะกร้าสินค้าว่างเปล่า</h3>
      <p className="text-gray-500 text-sm mb-8 max-w-xs">ยังไม่มีสินค้าในตะกร้า เพิ่มสินค้าที่คุณสนใจเพื่อดำเนินการสั่งซื้อ</p>
      <a href="/category" className="bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold px-8 py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5">เลือกซื้อสินค้า 🛒</a>
    </div>
  );
}

function NotLoggedIn() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-white/10 flex items-center justify-center mb-6">
          <svg className="w-9 h-9 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">เข้าสู่ระบบก่อนนะ</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">คุณต้องเข้าสู่ระบบก่อนเพื่อดูตะกร้าสินค้าของคุณ</p>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <a href="/login" className="flex-1 text-center bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5">เข้าสู่ระบบ</a>
          <a href="/register" className="flex-1 text-center border border-white/15 hover:bg-white/5 text-white font-medium py-3 rounded-xl text-sm transition-colors">สมัครสมาชิกฟรี</a>
        </div>
      </div>
    </div>
  );
}

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

// ─── Auth Guard ───────────────────────────────────────────────
export default function CartPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <LoadingScreen />;
  if (!session) return <NotLoggedIn />;
  return <CartContent user={session.user} />;
}

// ─── Cart Content ─────────────────────────────────────────────
function CartContent({ user }) {
  const { cart: items, addToCart, updateCartItem, removeFromCart, clearCart } = useCart();
  const [discount, setDiscount] = useState(0);
  const [removingId, setRemovingId] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from("users").select("name, avatar_url").eq("id", user.id).single()
      .then(({ data }) => { if (data) setUserData(data); });
  }, [user]);

  const displayName = userData?.name || user?.user_metadata?.name || user?.email || "ผู้ใช้";
  const displayInitial = displayName[0]?.toUpperCase() || "U";

  const updateQty = (id, delta) => {
    const item = items.find((item) => item.id === id);
    if (!item) return;
    const nextQty = Math.max(1, Math.min(item.stock ?? Infinity, item.qty + delta));
    updateCartItem(id, { qty: nextQty });
  };

  const removeItem = (id) => {
    setRemovingId(id);
    setTimeout(() => { removeFromCart(id); setRemovingId(null); }, 300);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const originalTotal = items.reduce((sum, item) => sum + item.originalPrice * item.qty, 0);
  const savedAmount = originalTotal - subtotal;
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const finalTotal = Math.max(0, subtotal - discount);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <a href="/" className="hover:text-amber-400 transition-colors">หน้าแรก</a>
          <span>/</span>
          <span className="text-gray-300">ตะกร้าสินค้า</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">ตะกร้าสินค้า</h1>
          {items.length > 0 && (
            <span className="bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full">{totalQty} ชิ้น</span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {items.length === 0 ? <EmptyCart /> : (
          <div className="flex flex-col lg:flex-row gap-6 mt-4">

            {/* Left */}
            <div className="flex-1 min-w-0">

              {/* User greeting */}
              <div className="bg-gray-900 border border-white/8 rounded-2xl p-4 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                  {user?.user_metadata?.avatar_url
                    ? <img src={user.user_metadata.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                    : <span className="text-amber-400 font-bold">{displayInitial}</span>
                  }
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{displayName}</p>
                  <p className="text-gray-500 text-xs truncate">{user?.email}</p>
                </div>
                <span className="ml-auto text-xs text-green-400 flex items-center gap-1 shrink-0">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  เข้าสู่ระบบแล้ว
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className={`bg-gray-900 border border-white/8 rounded-2xl overflow-hidden transition-all duration-300 ${removingId === item.id ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
                    <div className="flex gap-4 p-4">
                      <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-800">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-0.5">{item.brand}</p>
                            <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2">{item.name}</h3>
                            <p className="text-gray-600 text-[10px] mt-0.5">{item.tag}</p>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="shrink-0 w-7 h-7 bg-gray-800 hover:bg-red-500/10 border border-white/8 hover:border-red-500/30 rounded-lg flex items-center justify-center transition-all group">
                            <svg className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 bg-gray-800 border border-white/8 rounded-xl p-1">
                            <button onClick={() => updateQty(item.id, -1)} disabled={item.qty <= 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                            </button>
                            <span className="text-white text-sm font-semibold w-6 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} disabled={item.qty >= item.stock} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-amber-400 font-bold text-base">฿{(item.price * item.qty).toLocaleString()}</p>
                            {item.qty > 1 && <p className="text-gray-600 text-[10px]">฿{item.price.toLocaleString()} × {item.qty}</p>}
                            <p className="text-gray-600 text-[10px] line-through">฿{(item.originalPrice * item.qty).toLocaleString()}</p>
                          </div>
                        </div>
                        {item.stock <= 5 && (
                          <p className="text-orange-400 text-[10px] mt-2">⚠️ เหลือสินค้าในคลังแค่ {item.stock} ชิ้น</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <a href="/products" className="flex items-center gap-2 text-sm text-gray-500 hover:text-amber-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  ช้อปต่อ
                </a>
                <button onClick={() => clearCart()} className="text-xs text-gray-600 hover:text-red-400 transition-colors">🗑 ลบสินค้าทั้งหมด</button>
              </div>

              {/* Suggested */}
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
                    { id: 7, name: 'Monitor 27" 144Hz', brand: "ASUS", price: 8990, img: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&q=80" },
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
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart({
                                id: p.id,
                                name: p.name,
                                brand: p.brand,
                                price: p.price,
                                originalPrice: p.originalPrice || p.price,
                                img: p.img,
                                tag: "",
                                qty: 1,
                                stock: 999,
                              });
                            }}
                            className="bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-gray-950 text-[10px] font-bold px-2 py-1 rounded-lg transition-all"
                          >+ ตะกร้า</button>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:w-80 xl:w-96 shrink-0">
              <div className="sticky top-20 space-y-4">
                <div className="bg-gray-900 border border-white/8 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
                  <h2 className="text-white font-bold text-base mb-4">สรุปคำสั่งซื้อ</h2>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">ราคาสินค้า ({totalQty} ชิ้น)</span><span className="text-white">฿{subtotal.toLocaleString()}</span></div>
                    {savedAmount > 0 && <div className="flex justify-between"><span className="text-green-400">ส่วนลดสินค้า</span><span className="text-green-400">-฿{savedAmount.toLocaleString()}</span></div>}
                    {discount > 0 && <div className="flex justify-between"><span className="text-green-400">โค้ดส่วนลด</span><span className="text-green-400">-฿{discount.toLocaleString()}</span></div>}
                    <div className="flex justify-between"><span className="text-gray-400">ค่าจัดส่ง</span><span className="text-green-400 font-semibold">ฟรี 🎉</span></div>
                  </div>
                  <div className="border-t border-white/8 my-4" />
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
                  <div className="mb-4">
                    <p className="text-gray-400 text-xs font-semibold mb-2">โค้ดส่วนลด</p>
                    <CouponInput onApply={setDiscount} />
                  </div>
                  <button onClick={() => window.location.href = "/checkout"}
                    className="w-full bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold py-3.5 rounded-xl text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(251,191,36,0.35)] flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    ดำเนินการสั่งซื้อ
                  </button>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
                    {["🔒 ชำระเงินปลอดภัย", "✅ สินค้าแท้ 100%", "🔄 คืนสินค้าใน 30 วัน"].map((t) => (
                      <span key={t} className="text-gray-600 text-[10px]">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900 border border-white/8 rounded-2xl p-4">
                  <p className="text-gray-500 text-xs font-semibold mb-3 text-center">ช่องทางชำระเงินที่รองรับ</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["💳 บัตรเครดิต", "📱 PromptPay", "🏦 โอนเงิน", "💰 COD"].map((m) => (
                      <span key={m} className="bg-gray-800 border border-white/8 text-gray-400 text-[10px] px-2.5 py-1.5 rounded-lg">{m}</span>
                    ))}
                  </div>
                </div>

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