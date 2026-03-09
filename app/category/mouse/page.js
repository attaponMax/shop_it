"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";

const filters = {
  type: ["ทั้งหมด", "Gaming", "Office", "Ergonomic", "Trackball"],
  connect: ["ทั้งหมด", "Wired", "Wireless", "Bluetooth", "Tri-mode"],
  dpi: ["ทั้งหมด", "< 6,400 DPI", "6,400–16,000 DPI", "16,000+ DPI"],
  brand: ["ทั้งหมด", "Logitech", "Razer", "Corsair", "ASUS ROG", "HyperX", "SteelSeries", "Zowie"],
};

const products = [
  {
    id: 1,
    name: "Logitech G Pro X Superlight 2",
    brand: "Logitech",
    type: "Gaming",
    connect: "Wireless",
    dpi: "32,000 DPI",
    dpiGroup: "16,000+ DPI",
    price: 5490,
    originalPrice: 6990,
    rating: 4.9,
    reviews: 1024,
    badge: "ขายดี",
    badgeColor: "bg-amber-400 text-gray-950",
    img: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80",
    tags: ["61g Ultra-light", "HERO 2 Sensor", "LIGHTSPEED"],
    inStock: true,
  },
  {
    id: 2,
    name: "Razer DeathAdder V3 HyperSpeed",
    brand: "Razer",
    type: "Gaming",
    connect: "Wireless",
    dpi: "26,000 DPI",
    dpiGroup: "16,000+ DPI",
    price: 3290,
    originalPrice: 4500,
    rating: 4.8,
    reviews: 567,
    badge: "ลด 27%",
    badgeColor: "bg-red-500 text-white",
    img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80",
    tags: ["Ergonomic", "Focus Pro Sensor", "90hr Battery"],
    inStock: true,
  },
  {
    id: 3,
    name: "ASUS ROG Harpe Ace Aim Lab",
    brand: "ASUS ROG",
    type: "Gaming",
    connect: "Tri-mode",
    dpi: "36,000 DPI",
    dpiGroup: "16,000+ DPI",
    price: 4990,
    originalPrice: 5990,
    rating: 4.7,
    reviews: 312,
    badge: "ใหม่",
    badgeColor: "bg-blue-500 text-white",
    img: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRPWHg55_JjNQSS8jwoWzViKqGRMdgZoVZl9cOHmyQdFMly_3MGEnNEcAkxB5NY",
    tags: ["54g", "Tri-mode", "Aim Lab Edition"],
    inStock: true,
  },
  {
    id: 4,
    name: "SteelSeries Aerox 5 Wireless",
    brand: "SteelSeries",
    type: "Gaming",
    connect: "Wireless",
    dpi: "18,000 DPI",
    dpiGroup: "16,000+ DPI",
    price: 3890,
    originalPrice: 4790,
    rating: 4.6,
    reviews: 228,
    badge: "ลด 19%",
    badgeColor: "bg-red-500 text-white",
    img: "https://images.unsplash.com/photo-1563297007-0686b7003af7?w=500&q=80",
    tags: ["9 Buttons", "Honeycomb Shell", "180hr Battery"],
    inStock: true,
  },
  {
    id: 5,
    name: "Logitech MX Master 3S",
    brand: "Logitech",
    type: "Office",
    connect: "Bluetooth",
    dpi: "8,000 DPI",
    dpiGroup: "6,400–16,000 DPI",
    price: 3490,
    originalPrice: 3990,
    rating: 4.8,
    reviews: 890,
    badge: "Best Seller",
    badgeColor: "bg-amber-400 text-gray-950",
    img: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80",
    tags: ["MagSpeed Scroll", "Multi-device", "Silent Click"],
    inStock: true,
  },
  {
    id: 6,
    name: "Corsair M75 Air Wireless",
    brand: "Corsair",
    type: "Gaming",
    connect: "Wireless",
    dpi: "26,000 DPI",
    dpiGroup: "16,000+ DPI",
    price: 4290,
    originalPrice: 5500,
    rating: 4.5,
    reviews: 143,
    badge: null,
    badgeColor: "",
    img: "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Gaming-Mice/CH-931D100/M75_AIR_BLACK_RENDER_01.webp",
    tags: ["59g", "2000Hz Polling", "iCUE"],
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

export default function MouseCategory() {
  const [activeType, setActiveType] = useState("ทั้งหมด");
  const [activeConnect, setActiveConnect] = useState("ทั้งหมด");
  const [activeDpi, setActiveDpi] = useState("ทั้งหมด");
  const [activeBrand, setActiveBrand] = useState("ทั้งหมด");
  const [activeSort, setActiveSort] = useState("ยอดนิยม");
  const [priceMax, setPriceMax] = useState(6990);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = products.filter((p) => {
    if (activeType !== "ทั้งหมด" && p.type !== activeType) return false;
    if (activeConnect !== "ทั้งหมด" && p.connect !== activeConnect) return false;
    if (activeDpi !== "ทั้งหมด" && p.dpiGroup !== activeDpi) return false;
    if (activeBrand !== "ทั้งหมด" && p.brand !== activeBrand) return false;
    if (p.price > priceMax) return false;
    return true;
  });

  const resetFilters = () => {
    setActiveType("ทั้งหมด");
    setActiveConnect("ทั้งหมด");
    setActiveDpi("ทั้งหมด");
    setActiveBrand("ทั้งหมด");
    setPriceMax(6990);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* ─── HERO BANNER ─── */}
      <div className="relative overflow-hidden bg-gray-900 border-b border-white/8">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1527814050087-3793815479db?w=1400&q=80"
            alt="Mouse banner"
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
            <span className="text-amber-400">เมาส์</span>
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              🖱️ เมาส์
            </h1>
            <p className="text-gray-400 text-sm">
              Gaming · Office · Wireless · Ergonomic — กว่า <span className="text-amber-400 font-semibold">180+ รายการ</span>
            </p>
          </div>

          {/* Quick filter chips */}
          <div className="flex flex-wrap gap-2 mt-6">
            {["Wireless", "Ultra-light", "Gaming", "Ergonomic", "Bluetooth", "< 60g"].map((chip) => (
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

          {/* ─── SIDEBAR FILTERS ─── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-6">

              {/* Price Range */}
              <div>
                <p className="text-white text-sm font-semibold mb-3">ราคา</p>
                <input
                  type="range"
                  min={1000}
                  max={6990}
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
                    <button key={t} onClick={() => setActiveType(t)}
                      className={`text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${activeType === t ? "bg-amber-400/15 text-amber-400 font-medium" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/8" />

              {/* Connection */}
              <div>
                <p className="text-white text-sm font-semibold mb-3">การเชื่อมต่อ</p>
                <div className="flex flex-col gap-1">
                  {filters.connect.map((c) => (
                    <button key={c} onClick={() => setActiveConnect(c)}
                      className={`text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${activeConnect === c ? "bg-amber-400/15 text-amber-400 font-medium" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/8" />

              {/* DPI */}
              <div>
                <p className="text-white text-sm font-semibold mb-3">DPI</p>
                <div className="flex flex-col gap-1">
                  {filters.dpi.map((d) => (
                    <button key={d} onClick={() => setActiveDpi(d)}
                      className={`text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${activeDpi === d ? "bg-amber-400/15 text-amber-400 font-medium" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                      {d}
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
                    <button key={b} onClick={() => setActiveBrand(b)}
                      className={`text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${activeBrand === b ? "bg-amber-400/15 text-amber-400 font-medium" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={resetFilters} className="w-full text-xs text-gray-500 hover:text-red-400 transition-colors py-2">
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
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="lg:hidden flex items-center gap-1.5 text-sm border border-white/15 px-3 py-2 rounded-lg text-gray-300 hover:border-amber-400/40 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M3 4h18M7 12h10M11 20h2" />
                  </svg>
                  ตัวกรอง
                </button>
                <select
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value)}
                  className="bg-gray-900 border border-white/15 text-sm text-gray-300 px-3 py-2 rounded-lg outline-none focus:border-amber-400 transition-colors"
                >
                  {sortOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Mobile filter panel */}
            {showFilter && (
              <div className="lg:hidden bg-gray-900 border border-white/10 rounded-2xl p-4 mb-6 grid grid-cols-2 gap-4">
                {[
                  { label: "ประเภท", items: filters.type, active: activeType, set: setActiveType },
                  { label: "การเชื่อมต่อ", items: filters.connect, active: activeConnect, set: setActiveConnect },
                  { label: "DPI", items: filters.dpi, active: activeDpi, set: setActiveDpi },
                  { label: "แบรนด์", items: filters.brand, active: activeBrand, set: setActiveBrand },
                ].map(({ label, items, active, set }) => (
                  <div key={label}>
                    <p className="text-white text-xs font-semibold mb-2">{label}</p>
                    <div className="flex flex-col gap-0.5">
                      {items.map((item) => (
                        <button key={item} onClick={() => set(item)}
                          className={`text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${active === item ? "text-amber-400 font-medium" : "text-gray-500 hover:text-white"}`}>
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
                <button onClick={resetFilters} className="mt-3 text-xs text-amber-400 hover:underline">
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
                        <span className="text-gray-600 text-[10px] border border-white/10 px-1.5 py-0.5 rounded">{p.connect}</span>
                      </div>

                      <h3 className="text-white text-sm font-semibold leading-snug mb-2 line-clamp-2">{p.name}</h3>

                      {/* DPI badge */}
                      <p className="text-gray-500 text-[10px] mb-2">
                        <span className="text-gray-400 font-medium">{p.dpi}</span> Max DPI
                      </p>

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
                          onClick={(e) => e.preventDefault()}
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