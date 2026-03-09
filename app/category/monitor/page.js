"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";

const filters = {
  use: ["ทั้งหมด", "Gaming", "Professional", "Office", "Creator"],
  resolution: ["ทั้งหมด", "Full HD (1080p)", "QHD (1440p)", "4K (2160p)", "Ultrawide"],
  panel: ["ทั้งหมด", "IPS", "VA", "TN", "OLED", "Mini-LED"],
  refresh: ["ทั้งหมด", "60 Hz", "144 Hz", "165 Hz", "240 Hz", "360 Hz+"],
  brand: ["ทั้งหมด", "Samsung", "LG", "ASUS ROG", "Alienware", "MSI", "BenQ", "ViewSonic", "Gigabyte"],
};

const products = [
  {
    id: 1,
    name: "LG 27GP850-B UltraGear",
    brand: "LG",
    use: "Gaming",
    resolution: "QHD (1440p)",
    panel: "IPS",
    refresh: "165 Hz",
    size: "27\"",
    price: 9990,
    originalPrice: 12900,
    rating: 4.9,
    reviews: 1243,
    badge: "ขายดี",
    badgeColor: "bg-amber-400 text-gray-950",
    img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80",
    tags: ["1ms GTG", "G-Sync Compatible", "HDR10"],
    spec: "27\" · QHD · IPS · 165Hz",
    inStock: true,
  },
  {
    id: 2,
    name: "Samsung Odyssey G7 32\"",
    brand: "Samsung",
    use: "Gaming",
    resolution: "QHD (1440p)",
    panel: "VA",
    refresh: "240 Hz",
    size: "32\"",
    price: 19900,
    originalPrice: 24900,
    rating: 4.8,
    reviews: 876,
    badge: "ลด 20%",
    badgeColor: "bg-red-500 text-white",
    img: "https://images.samsung.com/is/image/samsung/p6pim/my/ls32dg702eexxs/gallery/my-odyssey-g7-g70d-ls32dg702eexxs-544757208?$Q90_1920_1280_F_PNG$",
    tags: ["1000R Curve", "G-Sync", "1ms"],
    spec: "32\" · QHD · VA · 240Hz",
    inStock: true,
  },
  {
    id: 3,
    name: "ASUS ROG Swift PG27AQDM",
    brand: "ASUS ROG",
    use: "Gaming",
    resolution: "QHD (1440p)",
    panel: "OLED",
    refresh: "240 Hz",
    size: "27\"",
    price: 32900,
    originalPrice: 38900,
    rating: 4.9,
    reviews: 412,
    badge: "Premium",
    badgeColor: "bg-purple-500 text-white",
    img: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=500&q=80",
    tags: ["OLED", "HDR True Black 400", "0.03ms"],
    spec: "27\" · QHD · OLED · 240Hz",
    inStock: true,
  },
  {
    id: 5,
    name: "Alienware AW3423DWF QD-OLED",
    brand: "Alienware",
    use: "Gaming",
    resolution: "Ultrawide",
    panel: "OLED",
    refresh: "165 Hz",
    size: "34\"",
    price: 39900,
    originalPrice: 45900,
    rating: 4.9,
    reviews: 521,
    badge: "Top Pick",
    badgeColor: "bg-purple-500 text-white",
    img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80",
    tags: ["QD-OLED", "3440×1440", "FreeSync Premium"],
    spec: "34\" · UW · OLED · 165Hz",
    inStock: true,
  },
  {
    id: 8,
    name: "Gigabyte M28U 4K 144Hz",
    brand: "Gigabyte",
    use: "Gaming",
    resolution: "4K (2160p)",
    panel: "IPS",
    refresh: "144 Hz",
    size: "28\"",
    price: 14900,
    originalPrice: 18500,
    rating: 4.7,
    reviews: 267,
    badge: "ลด 19%",
    badgeColor: "bg-red-500 text-white",
    img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80",
    tags: ["4K 144Hz", "HDMI 2.1", "KVM Switch"],
    spec: "28\" · 4K · IPS · 144Hz",
    inStock: false,
  },
];

const sortOptions = ["ยอดนิยม", "ราคา: ต่ำ → สูง", "ราคา: สูง → ต่ำ", "คะแนนสูงสุด", "ใหม่ล่าสุด"];

const useIcon = { Gaming: "🎮", Professional: "💼", Office: "🏢", Creator: "🎨" };

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

// Panel color accent
const panelColor = {
  IPS: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  VA: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  TN: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  OLED: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "Mini-LED": "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
};

export default function MonitorCategory() {
  const [activeUse, setActiveUse] = useState("ทั้งหมด");
  const [activeResolution, setActiveResolution] = useState("ทั้งหมด");
  const [activePanel, setActivePanel] = useState("ทั้งหมด");
  const [activeRefresh, setActiveRefresh] = useState("ทั้งหมด");
  const [activeBrand, setActiveBrand] = useState("ทั้งหมด");
  const [activeSort, setActiveSort] = useState("ยอดนิยม");
  const [priceMax, setPriceMax] = useState(45900);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = products.filter((p) => {
    if (activeUse !== "ทั้งหมด" && p.use !== activeUse) return false;
    if (activeResolution !== "ทั้งหมด" && p.resolution !== activeResolution) return false;
    if (activePanel !== "ทั้งหมด" && p.panel !== activePanel) return false;
    if (activeRefresh !== "ทั้งหมด" && p.refresh !== activeRefresh) return false;
    if (activeBrand !== "ทั้งหมด" && p.brand !== activeBrand) return false;
    if (p.price > priceMax) return false;
    return true;
  });

  const resetFilters = () => {
    setActiveUse("ทั้งหมด");
    setActiveResolution("ทั้งหมด");
    setActivePanel("ทั้งหมด");
    setActiveRefresh("ทั้งหมด");
    setActiveBrand("ทั้งหมด");
    setPriceMax(45900);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* ─── HERO BANNER ─── */}
      <div className="relative overflow-hidden bg-gray-900 border-b border-white/8">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1400&q=80"
            alt="Monitor banner"
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
            <span className="text-amber-400">Monitor</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            🖥️ Monitor
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            Gaming · 4K · OLED · Ultrawide · Creator — กว่า{" "}
            <span className="text-amber-400 font-semibold">150+ รายการ</span>
          </p>

          {/* Quick use-case pills */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(useIcon).map(([use, icon]) => (
              <button
                key={use}
                onClick={() => setActiveUse(activeUse === use ? "ทั้งหมด" : use)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  activeUse === use
                    ? "bg-amber-400 border-amber-400 text-gray-950 font-semibold"
                    : "border-white/15 text-gray-400 hover:border-amber-400/50 hover:text-amber-400"
                }`}
              >
                {icon} {use}
              </button>
            ))}
            {/* Panel type quick filters */}
            {["OLED", "IPS", "144 Hz", "240 Hz"].map((chip) => (
              <button key={chip}
                className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-gray-500 hover:border-amber-400/40 hover:text-amber-400 transition-colors">
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

              {/* Price */}
              <div>
                <p className="text-white text-sm font-semibold mb-3">ราคา</p>
                <input type="range" min={5000} max={45900} step={1000} value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-amber-400" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>฿5,000</span>
                  <span className="text-amber-400 font-semibold">฿{priceMax.toLocaleString()}</span>
                </div>
              </div>

              <div className="h-px bg-white/8" />

              {/* Use case */}
              <div>
                <p className="text-white text-sm font-semibold mb-3">การใช้งาน</p>
                <div className="flex flex-col gap-1">
                  {filters.use.map((u) => (
                    <button key={u} onClick={() => setActiveUse(u)}
                      className={`text-left text-sm px-2 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                        activeUse === u ? "bg-amber-400/15 text-amber-400 font-medium" : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}>
                      {useIcon[u] && <span>{useIcon[u]}</span>}
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/8" />

              {/* Resolution */}
              <div>
                <p className="text-white text-sm font-semibold mb-3">ความละเอียด</p>
                <div className="flex flex-col gap-1">
                  {filters.resolution.map((r) => (
                    <button key={r} onClick={() => setActiveResolution(r)}
                      className={`text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                        activeResolution === r ? "bg-amber-400/15 text-amber-400 font-medium" : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/8" />

              {/* Panel */}
              <div>
                <p className="text-white text-sm font-semibold mb-3">ชนิดแผง (Panel)</p>
                <div className="flex flex-wrap gap-1.5">
                  {filters.panel.map((p) => (
                    <button key={p} onClick={() => setActivePanel(p)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        activePanel === p
                          ? (panelColor[p] || "bg-amber-400/15 text-amber-400 border-amber-400/20")
                          : "border-white/10 text-gray-500 hover:border-white/25 hover:text-gray-300"
                      }`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/8" />

              {/* Refresh Rate */}
              <div>
                <p className="text-white text-sm font-semibold mb-3">Refresh Rate</p>
                <div className="flex flex-col gap-1">
                  {filters.refresh.map((r) => (
                    <button key={r} onClick={() => setActiveRefresh(r)}
                      className={`text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                        activeRefresh === r ? "bg-amber-400/15 text-amber-400 font-medium" : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}>
                      {r}
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
                      className={`text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                        activeBrand === b ? "bg-amber-400/15 text-amber-400 font-medium" : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}>
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
                {activeUse !== "ทั้งหมด" && <span className="ml-2 text-amber-400 text-xs">· {useIcon[activeUse]} {activeUse}</span>}
                {activePanel !== "ทั้งหมด" && <span className="ml-1 text-amber-400 text-xs">· {activePanel}</span>}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowFilter(!showFilter)}
                  className="lg:hidden flex items-center gap-1.5 text-sm border border-white/15 px-3 py-2 rounded-lg text-gray-300 hover:border-amber-400/40 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M3 4h18M7 12h10M11 20h2" />
                  </svg>
                  ตัวกรอง
                </button>
                <select value={activeSort} onChange={(e) => setActiveSort(e.target.value)}
                  className="bg-gray-900 border border-white/15 text-sm text-gray-300 px-3 py-2 rounded-lg outline-none focus:border-amber-400 transition-colors">
                  {sortOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Mobile filter panel */}
            {showFilter && (
              <div className="lg:hidden bg-gray-900 border border-white/10 rounded-2xl p-4 mb-6 grid grid-cols-2 gap-4">
                {[
                  { label: "การใช้งาน", items: filters.use, active: activeUse, set: setActiveUse },
                  { label: "ความละเอียด", items: filters.resolution, active: activeResolution, set: setActiveResolution },
                  { label: "Panel", items: filters.panel, active: activePanel, set: setActivePanel },
                  { label: "Refresh Rate", items: filters.refresh, active: activeRefresh, set: setActiveRefresh },
                  { label: "แบรนด์", items: filters.brand, active: activeBrand, set: setActiveBrand },
                ].map(({ label, items, active, set }) => (
                  <div key={label}>
                    <p className="text-white text-xs font-semibold mb-2">{label}</p>
                    <div className="flex flex-col gap-0.5">
                      {items.map((item) => (
                        <button key={item} onClick={() => set(item)}
                          className={`text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${
                            active === item ? "text-amber-400 font-medium" : "text-gray-500 hover:text-white"
                          }`}>
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
                <button onClick={resetFilters} className="mt-3 text-xs text-amber-400 hover:underline">ล้างตัวกรอง</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((p) => (
                  <a key={p.id} href={`/product/${p.id}`}
                    className="group bg-gray-900 border border-white/8 rounded-2xl overflow-hidden hover:border-amber-400/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.07)] transition-all duration-300">

                    {/* Image */}
                    <div className="relative overflow-hidden bg-gray-800 h-48">
                      <img src={p.img} alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />

                      {p.badge && (
                        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${p.badgeColor}`}>
                          {p.badge}
                        </span>
                      )}

                      {/* Panel type chip */}
                      <span className={`absolute bottom-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full border ${panelColor[p.panel] || "text-gray-400 bg-gray-800 border-white/10"}`}>
                        {p.panel}
                      </span>

                      {/* Size chip */}
                      <span className="absolute bottom-3 right-3 text-[10px] font-medium bg-gray-950/70 backdrop-blur text-gray-300 px-2 py-1 rounded-full border border-white/10">
                        {p.size}
                      </span>

                      {!p.inStock && (
                        <div className="absolute inset-0 bg-gray-950/60 flex items-center justify-center">
                          <span className="bg-gray-800 text-gray-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10">
                            สินค้าหมด
                          </span>
                        </div>
                      )}

                      <button onClick={(e) => e.preventDefault()}
                        className="absolute top-3 right-3 w-7 h-7 bg-gray-900/60 hover:bg-gray-900 backdrop-blur rounded-full flex items-center justify-center transition-colors">
                        <svg className="w-3.5 h-3.5 text-gray-400 hover:text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider">{p.brand}</p>
                        <span className="text-gray-500 text-[10px]">{useIcon[p.use]} {p.use}</span>
                      </div>

                      <h3 className="text-white text-sm font-semibold leading-snug mb-1 line-clamp-2">{p.name}</h3>

                      {/* Spec summary */}
                      <p className="text-gray-500 text-[10px] mb-2 font-medium">{p.spec}</p>

                      {/* Refresh rate highlight */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                          {p.refresh}
                        </span>
                        <span className="text-[10px] text-gray-600">{p.resolution}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {p.tags.map((tag) => (
                          <span key={tag} className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 mb-3">
                        <StarRating rating={p.rating} />
                        <span className="text-gray-500 text-[10px]">{p.rating} ({p.reviews.toLocaleString()})</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-amber-400 font-bold text-base">฿{p.price.toLocaleString()}</p>
                          <p className="text-gray-600 text-xs line-through">฿{p.originalPrice.toLocaleString()}</p>
                        </div>
                        <button onClick={(e) => e.preventDefault()} disabled={!p.inStock}
                          className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                            p.inStock ? "bg-amber-400 hover:bg-amber-300 text-gray-950" : "bg-gray-800 text-gray-600 cursor-not-allowed"
                          }`}>
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