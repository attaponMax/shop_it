"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";

const filters = {
  type: ["ทั้งหมด", "NVMe M.2", "SSD SATA", "HDD Internal", "Portable SSD", "External HDD", "USB Flash Drive"],
  capacity: ["ทั้งหมด", "128–256 GB", "512 GB", "1 TB", "2 TB", "4 TB+"],
  brand: ["ทั้งหมด", "Samsung", "WD", "Seagate", "Kingston", "Crucial", "SK Hynix", "Lexar", "SanDisk"],
  interface: ["ทั้งหมด", "PCIe 4.0", "PCIe 5.0", "SATA III", "USB 3.2", "Thunderbolt"],
};

const products = [
  {
    id: 1,
    name: "Samsung 990 Pro NVMe 2TB",
    brand: "Samsung",
    type: "NVMe M.2",
    capacity: "2 TB",
    interface: "PCIe 4.0",
    readSpeed: "7,450 MB/s",
    price: 4290,
    originalPrice: 5990,
    rating: 4.9,
    reviews: 2341,
    badge: "ขายดี",
    badgeColor: "bg-amber-400 text-gray-950",
    img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&q=80",
    tags: ["PCIe 4.0 ×4", "NVMe 2.0", "Heatsink Edition"],
    spec: "NVMe M.2 · PCIe 4.0 · 7,450 MB/s",
    inStock: true,
  },
  {
    id: 2,
    name: "WD Black SN850X 1TB",
    brand: "WD",
    type: "NVMe M.2",
    capacity: "1 TB",
    interface: "PCIe 4.0",
    readSpeed: "7,300 MB/s",
    price: 2490,
    originalPrice: 3290,
    rating: 4.8,
    reviews: 1876,
    badge: "ลด 24%",
    badgeColor: "bg-red-500 text-white",
    img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80",
    tags: ["Gaming Storage", "PCIe 4.0", "PS5 Compatible"],
    spec: "NVMe M.2 · PCIe 4.0 · 7,300 MB/s",
    inStock: true,
  },
  {
    id: 3,
    name: "Samsung 990 EVO Plus 2TB",
    brand: "Samsung",
    type: "NVMe M.2",
    capacity: "2 TB",
    interface: "PCIe 5.0",
    readSpeed: "10,000 MB/s",
    price: 5990,
    originalPrice: 7500,
    rating: 4.9,
    reviews: 412,
    badge: "ใหม่",
    badgeColor: "bg-blue-500 text-white",
    img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&q=80",
    tags: ["PCIe 5.0", "10,000 MB/s", "Next-Gen"],
    spec: "NVMe M.2 · PCIe 5.0 · 10,000 MB/s",
    inStock: true,
  },
  {
    id: 4,
    name: "Samsung 870 EVO SATA 1TB",
    brand: "Samsung",
    type: "SSD SATA",
    capacity: "1 TB",
    interface: "SATA III",
    readSpeed: "560 MB/s",
    price: 1990,
    originalPrice: 2490,
    rating: 4.8,
    reviews: 4231,
    badge: "Best Value",
    badgeColor: "bg-green-500 text-white",
    img: "https://images.unsplash.com/photo-1560472355-536de3962603?w=500&q=80",
    tags: ["2.5\" SATA", "MLC NAND", "5 Year Warranty"],
    spec: "SSD SATA · 2.5\" · 560 MB/s",
    inStock: true,
  },
  {
    id: 5,
    name: "Seagate Barracuda HDD 4TB",
    brand: "Seagate",
    type: "HDD Internal",
    capacity: "4 TB+",
    interface: "SATA III",
    readSpeed: "190 MB/s",
    price: 2890,
    originalPrice: 3490,
    rating: 4.5,
    reviews: 987,
    badge: null,
    badgeColor: "",
    img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&q=80",
    tags: ["7200 RPM", "256MB Cache", "3 Year Warranty"],
    spec: "HDD Internal · 3.5\" · SATA",
    inStock: true,
  },
  {
    id: 6,
    name: "Samsung T9 Portable SSD 2TB",
    brand: "Samsung",
    type: "Portable SSD",
    capacity: "2 TB",
    interface: "USB 3.2",
    readSpeed: "2,000 MB/s",
    price: 3990,
    originalPrice: 4990,
    rating: 4.8,
    reviews: 723,
    badge: "ลด 20%",
    badgeColor: "bg-red-500 text-white",
    img: "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=500&q=80",
    tags: ["USB 3.2 Gen 2×2", "IP65", "Shock Resistant"],
    spec: "Portable SSD · USB 3.2 · 2,000 MB/s",
    inStock: true,
  },
  {
    id: 7,
    name: "WD My Passport 5TB External",
    brand: "WD",
    type: "External HDD",
    capacity: "4 TB+",
    interface: "USB 3.2",
    readSpeed: "130 MB/s",
    price: 3290,
    originalPrice: 3990,
    rating: 4.6,
    reviews: 1102,
    badge: null,
    badgeColor: "",
    img: "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=500&q=80",
    tags: ["Password Protection", "Auto Backup", "3 Year Warranty"],
    spec: "External HDD · USB 3.2 · Portable",
    inStock: true,
  },
  {
    id: 8,
    name: "Kingston DataTraveler Max 256GB",
    brand: "Kingston",
    type: "USB Flash Drive",
    capacity: "128–256 GB",
    interface: "USB 3.2",
    readSpeed: "1,000 MB/s",
    price: 890,
    originalPrice: 1290,
    rating: 4.7,
    reviews: 634,
    badge: "ราคาดี",
    badgeColor: "bg-green-500 text-white",
    img: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500&q=80",
    tags: ["USB-A + USB-C", "USB 3.2 Gen 2", "Capless Design"],
    spec: "Flash Drive · USB 3.2 · 1,000 MB/s",
    inStock: true,
  },
  {
    id: 9,
    name: "Crucial P3 Plus NVMe 512GB",
    brand: "Crucial",
    type: "NVMe M.2",
    capacity: "512 GB",
    interface: "PCIe 4.0",
    readSpeed: "5,000 MB/s",
    price: 1290,
    originalPrice: 1790,
    rating: 4.6,
    reviews: 892,
    badge: "ราคาถูก",
    badgeColor: "bg-green-500 text-white",
    img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&q=80",
    tags: ["PCIe 4.0", "5,000 MB/s", "Budget Pick"],
    spec: "NVMe M.2 · PCIe 4.0 · 5,000 MB/s",
    inStock: false,
  },
];

const sortOptions = ["ยอดนิยม", "ราคา: ต่ำ → สูง", "ราคา: สูง → ต่ำ", "คะแนนสูงสุด", "ความเร็วสูงสุด"];

const typeIcon = {
  "NVMe M.2": "⚡",
  "SSD SATA": "💿",
  "HDD Internal": "🖴",
  "Portable SSD": "🔋",
  "External HDD": "📦",
  "USB Flash Drive": "🔌",
};

const typeColor = {
  "NVMe M.2": "text-amber-400 bg-amber-400/10 border-amber-400/25",
  "SSD SATA": "text-blue-400 bg-blue-400/10 border-blue-400/25",
  "HDD Internal": "text-gray-400 bg-gray-400/10 border-gray-400/25",
  "Portable SSD": "text-green-400 bg-green-400/10 border-green-400/25",
  "External HDD": "text-purple-400 bg-purple-400/10 border-purple-400/25",
  "USB Flash Drive": "text-cyan-400 bg-cyan-400/10 border-cyan-400/25",
};

const interfaceColor = {
  "PCIe 4.0": "text-amber-400",
  "PCIe 5.0": "text-red-400",
  "SATA III": "text-blue-400",
  "USB 3.2": "text-green-400",
  "Thunderbolt": "text-purple-400",
};

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

export default function StorageCategory() {
  const [activeType, setActiveType] = useState("ทั้งหมด");
  const [activeCapacity, setActiveCapacity] = useState("ทั้งหมด");
  const [activeBrand, setActiveBrand] = useState("ทั้งหมด");
  const [activeInterface, setActiveInterface] = useState("ทั้งหมด");
  const [activeSort, setActiveSort] = useState("ยอดนิยม");
  const [priceMax, setPriceMax] = useState(7500);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = products.filter((p) => {
    if (activeType !== "ทั้งหมด" && p.type !== activeType) return false;
    if (activeCapacity !== "ทั้งหมด" && p.capacity !== activeCapacity) return false;
    if (activeBrand !== "ทั้งหมด" && p.brand !== activeBrand) return false;
    if (activeInterface !== "ทั้งหมด" && p.interface !== activeInterface) return false;
    if (p.price > priceMax) return false;
    return true;
  });

  const resetFilters = () => {
    setActiveType("ทั้งหมด");
    setActiveCapacity("ทั้งหมด");
    setActiveBrand("ทั้งหมด");
    setActiveInterface("ทั้งหมด");
    setPriceMax(7500);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* ─── HERO BANNER ─── */}
      <div className="relative overflow-hidden bg-gray-900 border-b border-white/8">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=1400&q=80"
            alt="Storage banner"
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
            <span className="text-amber-400">Storage & SSD</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            💾 Storage & SSD
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            NVMe · SSD · HDD · Portable · Flash Drive — กว่า{" "}
            <span className="text-amber-400 font-semibold">200+ รายการ</span>
          </p>

          {/* Type quick-select pills */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(typeIcon).map(([type, icon]) => {
              const count = products.filter((p) => p.type === type).length;
              return (
                <button key={type}
                  onClick={() => setActiveType(activeType === type ? "ทั้งหมด" : type)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    activeType === type
                      ? "bg-amber-400 border-amber-400 text-gray-950 font-semibold"
                      : "border-white/15 text-gray-400 hover:border-amber-400/50 hover:text-amber-400"
                  }`}>
                  {icon} {type}
                  <span className={`text-[10px] ${activeType === type ? "text-gray-800" : "text-gray-600"}`}>({count})</span>
                </button>
              );
            })}
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
                <input type="range" min={500} max={7500} step={250} value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-amber-400" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>฿500</span>
                  <span className="text-amber-400 font-semibold">฿{priceMax.toLocaleString()}</span>
                </div>
              </div>

              <div className="h-px bg-white/8" />

              {/* Type */}
              <div>
                <p className="text-white text-sm font-semibold mb-3">ประเภท</p>
                <div className="flex flex-col gap-1">
                  {["ทั้งหมด", ...Object.keys(typeIcon)].map((t) => (
                    <button key={t} onClick={() => setActiveType(t)}
                      className={`text-left text-sm px-2 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                        activeType === t ? "bg-amber-400/15 text-amber-400 font-medium" : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}>
                      {typeIcon[t] && <span>{typeIcon[t]}</span>}
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/8" />

              {/* Capacity */}
              <div>
                <p className="text-white text-sm font-semibold mb-3">ความจุ</p>
                <div className="flex flex-col gap-1">
                  {filters.capacity.map((c) => (
                    <button key={c} onClick={() => setActiveCapacity(c)}
                      className={`text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                        activeCapacity === c ? "bg-amber-400/15 text-amber-400 font-medium" : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/8" />

              {/* Interface */}
              <div>
                <p className="text-white text-sm font-semibold mb-3">Interface</p>
                <div className="flex flex-wrap gap-1.5">
                  {filters.interface.map((i) => (
                    <button key={i} onClick={() => setActiveInterface(i)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        activeInterface === i
                          ? `${interfaceColor[i] || "text-amber-400"} bg-white/5 border-current`
                          : "border-white/10 text-gray-500 hover:border-white/25 hover:text-gray-300"
                      }`}>
                      {i}
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
                {activeType !== "ทั้งหมด" && (
                  <span className="ml-2 text-amber-400 text-xs">· {typeIcon[activeType]} {activeType}</span>
                )}
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
                  { label: "ประเภท", items: ["ทั้งหมด", ...Object.keys(typeIcon)], active: activeType, set: setActiveType },
                  { label: "ความจุ", items: filters.capacity, active: activeCapacity, set: setActiveCapacity },
                  { label: "Interface", items: filters.interface, active: activeInterface, set: setActiveInterface },
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

                      {/* Type chip */}
                      <span className={`absolute bottom-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full border ${typeColor[p.type]}`}>
                        {typeIcon[p.type]} {p.type}
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
                        <span className="text-gray-600 text-[10px] border border-white/10 px-1.5 py-0.5 rounded">{p.capacity}</span>
                      </div>

                      <h3 className="text-white text-sm font-semibold leading-snug mb-1 line-clamp-2">{p.name}</h3>

                      {/* Speed + Interface highlight */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold ${interfaceColor[p.interface] || "text-gray-400"}`}>
                          {p.interface}
                        </span>
                        <span className="text-gray-600 text-[10px]">·</span>
                        <span className="text-[10px] text-white font-medium">
                          ⚡ {p.readSpeed}
                        </span>
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