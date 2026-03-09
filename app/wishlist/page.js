"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Link from "next/link";

// ─── Mock Auth ────────────────────────────────────────────────
// เปลี่ยนเป็น true เพื่อจำลอง login / false เพื่อทดสอบ redirect
const MOCK_IS_LOGGED_IN = false;
const MOCK_USER = { name: "สมชาย ใจดี", email: "somchai@email.com" };

// ─── Mock Wishlist Data ───────────────────────────────────────
const initialWishlist = [
  {
    id: "k1",
    name: "Keychron Q1 Pro Wireless",
    brand: "Keychron",
    category: "คีย์บอร์ด",
    price: 5990,
    originalPrice: 7500,
    rating: 4.9,
    reviews: 412,
    img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&q=80",
    tags: ["Wireless", "Hot-swap", "75%"],
    inStock: true,
    href: "/category/keyboard",
  },
  {
    id: "m1",
    name: "Logitech G Pro X Superlight 2",
    brand: "Logitech",
    category: "เมาส์",
    price: 5490,
    originalPrice: 6990,
    rating: 4.9,
    reviews: 1024,
    img: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80",
    tags: ["61g", "Wireless", "32,000 DPI"],
    inStock: true,
    href: "/category/mouse",
  },
  {
    id: "h2",
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "หูฟัง & ลำโพง",
    price: 9990,
    originalPrice: 12990,
    rating: 4.9,
    reviews: 2841,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    tags: ["ANC", "Bluetooth", "30hr"],
    inStock: true,
    href: "/category/headset",
  },
  {
    id: "mo1",
    name: "ASUS ROG Swift PG27AQDM OLED",
    brand: "ASUS ROG",
    category: "Monitor",
    price: 32900,
    originalPrice: 38900,
    rating: 4.9,
    reviews: 412,
    img: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=500&q=80",
    tags: ["OLED", "QHD", "240Hz"],
    inStock: false,
    href: "/category/monitor",
  },
  {
    id: "s1",
    name: "Samsung 990 Pro NVMe 2TB",
    brand: "Samsung",
    category: "Storage & SSD",
    price: 4290,
    originalPrice: 5990,
    rating: 4.9,
    reviews: 2341,
    img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&q=80",
    tags: ["NVMe", "PCIe 4.0", "7,450 MB/s"],
    inStock: true,
    href: "/category/storage",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-700"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Not Logged In Screen ─────────────────────────────────────
function NotLoggedIn() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center text-center">
        {/* Lock icon */}
        <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-white/10 flex items-center justify-center mb-6">
          <svg className="w-9 h-9 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">เข้าสู่ระบบก่อนนะ</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          คุณต้องเข้าสู่ระบบก่อนเพื่อดูรายการโปรดของคุณ
          <br />บันทึกสินค้าที่ชอบไว้ดูภายหลังได้เลย
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link href="/login"
            className="flex-1 text-center bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(251,191,36,0.3)]">
            เข้าสู่ระบบ
          </Link>
          <Link href="/register"
            className="flex-1 text-center border border-white/15 hover:bg-white/5 text-white font-medium py-3 rounded-xl text-sm transition-colors">
            สมัครสมาชิกฟรี
          </Link>
        </div>

        <div className="mt-10 w-full border-t border-white/8 pt-8">
          <p className="text-gray-500 text-xs mb-4">หรือเลือกดูสินค้าต่อ</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "⌨️ คีย์บอร์ด", href: "/category/keyboard" },
              { label: "🖱️ เมาส์", href: "/category/mouse" },
              { label: "🎧 หูฟัง", href: "/category/headset" },
              { label: "🖥️ Monitor", href: "/category/monitor" },
            ].map((c) => (
              <Link key={c.href} href={c.href}
                className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-gray-400 hover:border-amber-400/50 hover:text-amber-400 transition-colors">
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Wishlist Page ───────────────────────────────────────
export default function WishlistPage() {
  const router = useRouter();
  const [isLoggedIn] = useState(MOCK_IS_LOGGED_IN);
  const [wishlist, setWishlist] = useState(initialWishlist);
  const [removing, setRemoving] = useState(null);
  const [addedToCart, setAddedToCart] = useState(null);
  const [sortBy, setSortBy] = useState("เพิ่มล่าสุด");
  const [filterCategory, setFilterCategory] = useState("ทั้งหมด");

  // ─── Auth guard ───
  if (!isLoggedIn) return <NotLoggedIn />;

  const categories = ["ทั้งหมด", ...Array.from(new Set(wishlist.map((p) => p.category)))];

  const sorted = [...wishlist]
    .filter((p) => filterCategory === "ทั้งหมด" || p.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === "ราคา: ต่ำ → สูง") return a.price - b.price;
      if (sortBy === "ราคา: สูง → ต่ำ") return b.price - a.price;
      if (sortBy === "คะแนนสูงสุด") return b.rating - a.rating;
      return 0; // เพิ่มล่าสุด — keep original order
    });

  const handleRemove = async (id) => {
    setRemoving(id);
    await new Promise((res) => setTimeout(res, 400));
    setWishlist((prev) => prev.filter((p) => p.id !== id));
    setRemoving(null);
  };

  const handleAddToCart = (id) => {
    setAddedToCart(id);
    setTimeout(() => setAddedToCart(null), 1500);
  };

  const totalValue = wishlist.filter((p) => p.inStock).reduce((sum, p) => sum + p.price, 0);
  const totalSavings = wishlist.filter((p) => p.inStock).reduce((sum, p) => sum + (p.originalPrice - p.price), 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <Link href="/" className="hover:text-amber-400 transition-colors">หน้าแรก</Link>
              <span>/</span>
              <span className="text-gray-300">รายการโปรด</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              รายการโปรด
              <span className="text-gray-500 text-base font-normal ml-1">({wishlist.length} รายการ)</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">สวัสดี, <span className="text-amber-400">{MOCK_USER.name}</span></p>
          </div>

          {/* Summary card */}
          {wishlist.length > 0 && (
            <div className="bg-gray-900 border border-white/8 rounded-2xl px-5 py-3 flex items-center gap-6 flex-shrink-0">
              <div className="text-center">
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">มูลค่ารวม</p>
                <p className="text-amber-400 font-bold text-lg">฿{totalValue.toLocaleString()}</p>
              </div>
              <div className="h-8 w-px bg-white/8" />
              <div className="text-center">
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">ประหยัดได้</p>
                <p className="text-green-400 font-bold text-lg">฿{totalSavings.toLocaleString()}</p>
              </div>
              <div className="h-8 w-px bg-white/8" />
              <div className="text-center">
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">มีสินค้า</p>
                <p className="text-white font-bold text-lg">{wishlist.filter((p) => p.inStock).length}/{wishlist.length}</p>
              </div>
            </div>
          )}
        </div>

        {/* Toolbar */}
        {wishlist.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Category filter */}
            <div className="flex gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setFilterCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    filterCategory === cat
                      ? "bg-amber-400 border-amber-400 text-gray-950 font-semibold"
                      : "border-white/15 text-gray-400 hover:border-amber-400/40 hover:text-amber-400"
                  }`}>
                  {cat}
                  {cat !== "ทั้งหมด" && (
                    <span className={`ml-1 text-[10px] ${filterCategory === cat ? "text-gray-800" : "text-gray-600"}`}>
                      ({wishlist.filter((p) => p.category === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Sort + actions */}
            <div className="flex items-center gap-2 ml-auto">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-900 border border-white/15 text-xs text-gray-300 px-3 py-1.5 rounded-full outline-none focus:border-amber-400 transition-colors">
                {["เพิ่มล่าสุด", "ราคา: ต่ำ → สูง", "ราคา: สูง → ต่ำ", "คะแนนสูงสุด"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <button onClick={() => setWishlist([])}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1.5">
                ลบทั้งหมด
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {wishlist.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-white/10 flex items-center justify-center mb-6">
              <svg className="w-9 h-9 text-gray-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">ยังไม่มีรายการโปรด</h2>
            <p className="text-gray-500 text-sm mb-8">กดไอคอน ♡ ที่สินค้าเพื่อบันทึกไว้ดูภายหลัง</p>
            <Link href="/"
              className="bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold px-8 py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5">
              เริ่มช้อปเลย
            </Link>
          </div>
        )}

        {/* Product grid */}
        {sorted.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sorted.map((p) => (
              <div key={p.id}
                className={`group bg-gray-900 border border-white/8 rounded-2xl overflow-hidden transition-all duration-300 ${
                  removing === p.id ? "opacity-0 scale-95" : "opacity-100 scale-100"
                } hover:border-amber-400/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.07)]`}>

                {/* Image */}
                <div className="relative overflow-hidden bg-gray-800 h-48">
                  <Link href={p.href}>
                    <img src={p.img} alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
                  </Link>

                  {/* Category chip */}
                  <span className="absolute top-3 left-3 text-[10px] font-medium bg-gray-950/70 backdrop-blur text-gray-300 px-2 py-1 rounded-full border border-white/10">
                    {p.category}
                  </span>

                  {/* Out of stock */}
                  {!p.inStock && (
                    <div className="absolute inset-0 bg-gray-950/50 flex items-center justify-center">
                      <span className="bg-gray-800 text-gray-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10">
                        สินค้าหมด
                      </span>
                    </div>
                  )}

                  {/* Remove button */}
                  <button onClick={() => handleRemove(p.id)}
                    className="absolute top-3 right-3 w-7 h-7 bg-gray-900/70 hover:bg-red-500 backdrop-blur rounded-full flex items-center justify-center transition-colors group/rm"
                    title="นำออกจากรายการโปรด">
                    <svg className="w-3.5 h-3.5 text-red-400 group-hover/rm:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-1">{p.brand}</p>
                  <Link href={p.href}>
                    <h3 className="text-white text-sm font-semibold leading-snug mb-2 line-clamp-2 hover:text-amber-400 transition-colors">
                      {p.name}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {p.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 mb-3">
                    <StarRating rating={p.rating} />
                    <span className="text-gray-500 text-[10px]">{p.rating} ({p.reviews.toLocaleString()})</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-amber-400 font-bold text-base">฿{p.price.toLocaleString()}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-gray-600 text-xs line-through">฿{p.originalPrice.toLocaleString()}</p>
                        <span className="text-green-400 text-[10px] font-semibold">
                          ลด ฿{(p.originalPrice - p.price).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(p.id)}
                      disabled={!p.inStock}
                      className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl transition-all ${
                        addedToCart === p.id
                          ? "bg-green-500 text-white"
                          : p.inStock
                            ? "bg-amber-400 hover:bg-amber-300 text-gray-950"
                            : "bg-gray-800 text-gray-600 cursor-not-allowed"
                      }`}>
                      {addedToCart === p.id ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7"/>
                          </svg>
                          เพิ่มแล้ว
                        </>
                      ) : p.inStock ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 0 1-8 0"/>
                          </svg>
                          ใส่ตะกร้า
                        </>
                      ) : "สินค้าหมด"}
                    </button>
                    <button onClick={() => handleRemove(p.id)}
                      className="w-10 flex items-center justify-center border border-white/10 hover:border-red-500/50 hover:text-red-400 text-gray-500 rounded-xl transition-colors"
                      title="ลบ">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results after filter */}
        {wishlist.length > 0 && sorted.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-sm">ไม่พบสินค้าในหมวด "{filterCategory}"</p>
            <button onClick={() => setFilterCategory("ทั้งหมด")} className="mt-2 text-xs text-amber-400 hover:underline">
              ดูทั้งหมด
            </button>
          </div>
        )}
      </div>
    </div>
  );
}