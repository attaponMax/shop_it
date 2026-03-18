"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { useCart } from "../../lib/cart";

const filters = {
  type: ["ทั้งหมด", "Mechanical", "Membrane", "Optical", "Wireless"],
  size: ["ทั้งหมด", "Full Size (100%)", "TKL (80%)", "75%", "65%", "60%"],
  switch: ["ทั้งหมด", "Red (Linear)", "Blue (Clicky)", "Brown (Tactile)", "Yellow", "Silent"],
  brand: ["ทั้งหมด", "Logitech", "Razer", "Corsair", "Keychron", "ASUS ROG", "HyperX", "Ducky"],
};

const products = [
  {
    id: 1,
    name: "Keychron Q1 Pro Wireless",
    brand: "Keychron",
    type: "Mechanical",
    size: "75%",
    switch: "Brown (Tactile)",
    price: 5990,
    originalPrice: 7500,
    rating: 4.9,
    reviews: 412,
    badge: "ขายดี",
    badgeColor: "bg-amber-400 text-gray-950",
    img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&q=80",
    tags: ["Wireless", "Hot-swap", "Gasket Mount"],
    inStock: true,
  },
  {
    id: 2,
    name: "Razer BlackWidow V4 Pro",
    brand: "Razer",
    type: "Mechanical",
    size: "Full Size (100%)",
    switch: "Yellow",
    price: 7290,
    originalPrice: 8990,
    rating: 4.7,
    reviews: 289,
    badge: "ลด 19%",
    badgeColor: "bg-red-500 text-white",
    img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
    tags: ["RGB", "Wireless", "Wrist Rest"],
    inStock: true,
  },
  {
    id: 3,
    name: "Logitech G915 TKL",
    brand: "Logitech",
    type: "Mechanical",
    size: "TKL (80%)",
    switch: "Red (Linear)",
    price: 6490,
    originalPrice: 7990,
    rating: 4.8,
    reviews: 634,
    badge: "ใหม่",
    badgeColor: "bg-blue-500 text-white",
    img: "https://computerlounge.co.nz/cdn/shop/files/2ac0734ff61f78dfd774e040e5a01dbf064159c3_Logitech_G915_TKL_Lightspeed_White_1.jpg?v=1729652933&width=900",
    tags: ["Slim", "Wireless", "RGB"],
    inStock: true,
  },
  {
    id: 4,
    name: "Ducky One 3 Mini",
    brand: "Ducky",
    type: "Mechanical",
    size: "60%",
    switch: "Blue (Clicky)",
    price: 3890,
    originalPrice: 4500,
    rating: 4.6,
    reviews: 178,
    badge: "ลด 13%",
    badgeColor: "bg-red-500 text-white",
    img: "https://images.unsplash.com/photo-1615869442320-fd02a129c77c?w=500&q=80",
    tags: ["60%", "Hot-swap", "PBT Keycaps"],
    inStock: true,
  },
  {
    id: 5,
    name: "ASUS ROG Strix Scope II",
    brand: "ASUS ROG",
    type: "Mechanical",
    size: "Full Size (100%)",
    switch: "Red (Linear)",
    price: 4290,
    originalPrice: 5500,
    rating: 4.5,
    reviews: 203,
    badge: null,
    badgeColor: "",
    img: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=500&q=80",
    tags: ["RGB", "USB Passthrough", "Media Keys"],
    inStock: true,
  },
  {
    id: 6,
    name: "HyperX Alloy Origins 65",
    brand: "HyperX",
    type: "Mechanical",
    size: "65%",
    switch: "Red (Linear)",
    price: 2990,
    originalPrice: 3790,
    rating: 4.4,
    reviews: 321,
    badge: "ราคาดี",
    badgeColor: "bg-green-500 text-white",
    img: "https://row.hyperx.com/cdn/shop/files/hyperx_alloy_origins_65_english_us_1_top_down.jpg?v=1740220815",
    tags: ["Compact", "RGB", "Detachable Cable"],
    inStock: false,
  },
  {
    id: 7,
    name: "Corsair K100 RGB Optical",
    brand: "Corsair",
    type: "Optical",
    size: "Full Size (100%)",
    switch: "Optical",
    price: 8990,
    originalPrice: 10500,
    rating: 4.8,
    reviews: 156,
    badge: "Premium",
    badgeColor: "bg-purple-500 text-white",
    img: "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Gaming-Keyboards/CH-912A01A-NA/Gallery/K100_RGB_01.webp",
    tags: ["Optical Switch", "iCUE", "USB Hub"],
    inStock: true,
  },
  {
    id: 8,
    name: "Keychron K2 V2 Wireless",
    brand: "Keychron",
    type: "Mechanical",
    size: "75%",
    switch: "Brown (Tactile)",
    price: 2490,
    originalPrice: 2990,
    rating: 4.7,
    reviews: 892,
    badge: "Best Value",
    badgeColor: "bg-amber-400 text-gray-950",
    img: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSegCBcTdTvEay0hAjBkq2SeQp5XHAoJ7Ar02kW1s9ZNhNV5UhdiAThcRLkdtS-",
    tags: ["Mac / Win", "Wireless", "Compact"],
    inStock: true,
  },
];

const sortOptions = ["ยอดนิยม", "ราคา: ต่ำ → สูง", "ราคา: สูง → ต่ำ", "คะแนนสูงสุด", "ใหม่ล่าสุด"];

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

export default function KeyboardCategory() {
  const { addToCart } = useCart();
  const [activeType, setActiveType] = useState("ทั้งหมด");
  const [activeSize, setActiveSize] = useState("ทั้งหมด");
  const [activeSwitch, setActiveSwitch] = useState("ทั้งหมด");
  const [activeBrand, setActiveBrand] = useState("ทั้งหมด");
  const [activeSort, setActiveSort] = useState("ยอดนิยม");
  const [priceMax, setPriceMax] = useState(10500);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = products.filter((p) => {
    if (activeType !== "ทั้งหมด" && p.type !== activeType) return false;
    if (activeSize !== "ทั้งหมด" && p.size !== activeSize) return false;
    if (activeSwitch !== "ทั้งหมด" && p.switch !== activeSwitch) return false;
    if (activeBrand !== "ทั้งหมด" && p.brand !== activeBrand) return false;
    if (p.price > priceMax) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* ─── HERO BANNER ─── */}
      <div className="relative overflow-hidden bg-gray-900 border-b border-white/8">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=1400&q=80"
            alt="Keyboard banner"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/70 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Link href="/" className="hover:text-amber-400 transition-colors">หน้าแรก</Link>
            <span>/</span>
            <Link href="/category" className="hover:text-amber-400 transition-colors">หมวดหมู่</Link>
            <span>/</span>
            <span className="text-amber-400">คีย์บอร์ด</span>
          </div>

          <div className="flex items-end gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                ⌨️ คีย์บอร์ด
              </h1>
              <p className="text-gray-400 text-sm">
                Mechanical · Wireless · Gaming · Office — กว่า <span className="text-amber-400 font-semibold">240+ รายการ</span>
              </p>
            </div>
          </div>

          {/* Quick filter chips */}
          <div className="flex flex-wrap gap-2 mt-6">
            {["Mechanical", "Wireless", "60%", "TKL", "Hot-swap", "RGB"].map((chip) => (
              <button
                key={chip}
                className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-gray-400 hover:border-amber-400/50 hover:text-amber-400 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6">

          {/* ─── SIDEBAR FILTERS (desktop) ─── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-6">

              {/* Price Range */}
              <div>
                <p className="text-white text-sm font-semibold mb-3">ราคา</p>
                <input
                  type="range"
                  min={1000}
                  max={10500}
                  step={500}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>฿1,000</span>
                  <span className="text-amber-400 font-semibold">฿{priceMax.toLocaleString()}</span>
                </div>
              </div>

              <div className="h-px bg-white/8" />

              {/* Type */}
              <div>
                <p className="text-white text-sm font-semibold mb-3">ประเภท</p>
                <div className="flex flex-col gap-1">
                  {filters.type.map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveType(t)}
                      className={`text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                        activeType === t
                          ? "bg-amber-400/15 text-amber-400 font-medium"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/8" />

              {/* Size */}
              <div>
                <p className="text-white text-sm font-semibold mb-3">ขนาด</p>
                <div className="flex flex-col gap-1">
                  {filters.size.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSize(s)}
                      className={`text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                        activeSize === s
                          ? "bg-amber-400/15 text-amber-400 font-medium"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/8" />

              {/* Switch */}
              <div>
                <p className="text-white text-sm font-semibold mb-3">สวิตช์</p>
                <div className="flex flex-col gap-1">
                  {filters.switch.map((sw) => (
                    <button
                      key={sw}
                      onClick={() => setActiveSwitch(sw)}
                      className={`text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                        activeSwitch === sw
                          ? "bg-amber-400/15 text-amber-400 font-medium"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {sw}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/8" />

              {/* Brand */}
              <div>
                <p className="text-white text-sm font-semibold mb-3">แบรนด์</p>
                <div className="flex flex-col gap-1">
                  {filters.brand.map((b) => (
                    <button
                      key={b}
                      onClick={() => setActiveBrand(b)}
                      className={`text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                        activeBrand === b
                          ? "bg-amber-400/15 text-amber-400 font-medium"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={() => {
                  setActiveType("ทั้งหมด");
                  setActiveSize("ทั้งหมด");
                  setActiveSwitch("ทั้งหมด");
                  setActiveBrand("ทั้งหมด");
                  setPriceMax(10500);
                }}
                className="w-full text-xs text-gray-500 hover:text-red-400 transition-colors py-2"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          </aside>

          {/* ─── MAIN CONTENT ─── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-3">
              <p className="text-gray-400 text-sm">
                พบ <span className="text-white font-semibold">{filtered.length}</span> รายการ
              </p>

              <div className="flex items-center gap-2">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="lg:hidden flex items-center gap-1.5 text-sm border border-white/15 px-3 py-2 rounded-lg text-gray-300 hover:border-amber-400/40 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M3 4h18M7 12h10M11 20h2" />
                  </svg>
                  ตัวกรอง
                </button>

                {/* Sort */}
                <select
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value)}
                  className="bg-gray-900 border border-white/15 text-sm text-gray-300 px-3 py-2 rounded-lg outline-none focus:border-amber-400 transition-colors"
                >
                  {sortOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile filter panel */}
            {showFilter && (
              <div className="lg:hidden bg-gray-900 border border-white/10 rounded-2xl p-4 mb-6 grid grid-cols-2 gap-4">
                {[
                  { label: "ประเภท", items: filters.type, active: activeType, set: setActiveType },
                  { label: "ขนาด", items: filters.size, active: activeSize, set: setActiveSize },
                  { label: "สวิตช์", items: filters.switch, active: activeSwitch, set: setActiveSwitch },
                  { label: "แบรนด์", items: filters.brand, active: activeBrand, set: setActiveBrand },
                ].map(({ label, items, active, set }) => (
                  <div key={label}>
                    <p className="text-white text-xs font-semibold mb-2">{label}</p>
                    <div className="flex flex-col gap-0.5">
                      {items.map((item) => (
                        <button
                          key={item}
                          onClick={() => set(item)}
                          className={`text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${
                            active === item ? "text-amber-400 font-medium" : "text-gray-500 hover:text-white"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Product Grid */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-600">
                <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <p className="text-sm">ไม่พบสินค้าที่ตรงกับตัวกรอง</p>
                <button
                  onClick={() => { setActiveType("ทั้งหมด"); setActiveSize("ทั้งหมด"); setActiveSwitch("ทั้งหมด"); setActiveBrand("ทั้งหมด"); setPriceMax(10500); }}
                  className="mt-3 text-xs text-amber-400 hover:underline"
                >
                  ล้างตัวกรอง
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((p) => (
                  <a
                    key={p.id}
                    href={`/product/${p.id}`}
                    className="group bg-gray-900 border border-white/8 rounded-2xl overflow-hidden hover:border-amber-400/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.07)] transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden bg-gray-800 h-48">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />

                      {p.badge && (
                        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${p.badgeColor}`}>
                          {p.badge}
                        </span>
                      )}
                      {!p.inStock && (
                        <div className="absolute inset-0 bg-gray-950/60 flex items-center justify-center">
                          <span className="bg-gray-800 text-gray-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10">
                            สินค้าหมด
                          </span>
                        </div>
                      )}
                      <button
                        onClick={(e) => e.preventDefault()}
                        className="absolute top-3 right-3 w-7 h-7 bg-gray-900/60 hover:bg-gray-900 backdrop-blur rounded-full flex items-center justify-center transition-colors"
                      >
                        <svg className="w-3.5 h-3.5 text-gray-400 hover:text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider">{p.brand}</p>
                        <span className="text-gray-600 text-[10px] border border-white/10 px-1.5 py-0.5 rounded">{p.size}</span>
                      </div>

                      <h3 className="text-white text-sm font-semibold leading-snug mb-2 line-clamp-2">{p.name}</h3>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {p.tags.map((tag) => (
                          <span key={tag} className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 mb-3">
                        <StarRating rating={p.rating} />
                        <span className="text-gray-500 text-[10px]">{p.rating} ({p.reviews})</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-amber-400 font-bold text-base">฿{p.price.toLocaleString()}</p>
                          <p className="text-gray-600 text-xs line-through">฿{p.originalPrice.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!p.inStock) return;
                            addToCart({
                              id: p.id,
                              name: p.name,
                              brand: p.brand,
                              price: p.price,
                              originalPrice: p.originalPrice,
                              img: p.img,
                              tag: p.tags?.join(", ") || "",
                              qty: 1,
                              stock: p.inStock ? 999 : 0,
                            });
                          }}
                          disabled={!p.inStock}
                          className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                            p.inStock
                              ? "bg-amber-400 hover:bg-amber-300 text-gray-950"
                              : "bg-gray-800 text-gray-600 cursor-not-allowed"
                          }`}
                        >
                          {p.inStock ? "+ ตะกร้า" : "หมด"}
                        </button>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}