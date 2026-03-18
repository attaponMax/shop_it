"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { useCart } from "../lib/cart";

// Mock product database — รวมสินค้าทุก category
const allProducts = [
  // Keyboard
  { id: "k1", name: "Keychron Q1 Pro Wireless", brand: "Keychron", category: "คีย์บอร์ด", price: 5990, originalPrice: 7500, rating: 4.9, reviews: 412, img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80", tags: ["Wireless", "Hot-swap", "75%"], href: "/category/keyboard" },
  { id: "k2", name: "Razer BlackWidow V4 Pro", brand: "Razer", category: "คีย์บอร์ด", price: 7290, originalPrice: 8990, rating: 4.7, reviews: 289, img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80", tags: ["RGB", "Wireless", "Full Size"], href: "/category/keyboard" },
  { id: "k3", name: "Logitech G915 TKL", brand: "Logitech", category: "คีย์บอร์ด", price: 6490, originalPrice: 7990, rating: 4.8, reviews: 634, img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80", tags: ["Slim", "Wireless", "TKL"], href: "/category/keyboard" },
  { id: "k4", name: "Ducky One 3 Mini 60%", brand: "Ducky", category: "คีย์บอร์ด", price: 3890, originalPrice: 4500, rating: 4.6, reviews: 178, img: "https://images.unsplash.com/photo-1615869442320-fd02a129c77c?w=400&q=80", tags: ["60%", "Hot-swap", "PBT"], href: "/category/keyboard" },
  { id: "k5", name: "Keychron K2 V2 Wireless", brand: "Keychron", category: "คีย์บอร์ด", price: 2490, originalPrice: 2990, rating: 4.7, reviews: 892, img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80", tags: ["Mac/Win", "Wireless", "75%"], href: "/category/keyboard" },
  // Mouse
  { id: "m1", name: "Logitech G Pro X Superlight 2", brand: "Logitech", category: "เมาส์", price: 5490, originalPrice: 6990, rating: 4.9, reviews: 1024, img: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&q=80", tags: ["61g", "Wireless", "32000 DPI"], href: "/category/mouse" },
  { id: "m2", name: "Razer DeathAdder V3 HyperSpeed", brand: "Razer", category: "เมาส์", price: 3290, originalPrice: 4500, rating: 4.8, reviews: 567, img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80", tags: ["Ergonomic", "Wireless", "90hr"], href: "/category/mouse" },
  { id: "m3", name: "Logitech MX Master 3S", brand: "Logitech", category: "เมาส์", price: 3490, originalPrice: 3990, rating: 4.8, reviews: 890, img: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&q=80", tags: ["Office", "Bluetooth", "Silent"], href: "/category/mouse" },
  { id: "m4", name: "HyperX Pulsefire Haste 2", brand: "HyperX", category: "เมาส์", price: 1990, originalPrice: 2590, rating: 4.6, reviews: 445, img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&q=80", tags: ["53g", "Wired", "Honeycomb"], href: "/category/mouse" },
  // Headset
  { id: "h1", name: "Logitech G Pro X 2 Lightspeed", brand: "Logitech", category: "หูฟัง & ลำโพง", price: 7990, originalPrice: 9500, rating: 4.9, reviews: 634, img: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&q=80", tags: ["Wireless", "7.1 Surround", "Gaming"], href: "/category/headset" },
  { id: "h2", name: "Sony WH-1000XM5", brand: "Sony", category: "หูฟัง & ลำโพง", price: 9990, originalPrice: 12990, rating: 4.9, reviews: 2841, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", tags: ["ANC", "Bluetooth", "30hr"], href: "/category/headset" },
  { id: "h3", name: "JBL Flip 6", brand: "JBL", category: "หูฟัง & ลำโพง", price: 3490, originalPrice: 4290, rating: 4.7, reviews: 1876, img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80", tags: ["IP67", "Bluetooth", "Speaker"], href: "/category/headset" },
  // Monitor
  { id: "mo1", name: "LG 27GP850-B UltraGear 165Hz", brand: "LG", category: "Monitor", price: 9990, originalPrice: 12900, rating: 4.9, reviews: 1243, img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80", tags: ["QHD", "IPS", "165Hz"], href: "/category/monitor" },
  { id: "mo2", name: "Samsung Odyssey G7 240Hz", brand: "Samsung", category: "Monitor", price: 19900, originalPrice: 24900, rating: 4.8, reviews: 876, img: "https://images.unsplash.com/photo-1593640408182-31c228210673?w=400&q=80", tags: ["QHD", "VA", "240Hz"], href: "/category/monitor" },
  { id: "mo3", name: "ASUS ROG Swift PG27AQDM OLED", brand: "ASUS ROG", category: "Monitor", price: 32900, originalPrice: 38900, rating: 4.9, reviews: 412, img: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=400&q=80", tags: ["OLED", "QHD", "240Hz"], href: "/category/monitor" },
  // Storage
  { id: "s1", name: "Samsung 990 Pro NVMe 2TB", brand: "Samsung", category: "Storage & SSD", price: 4290, originalPrice: 5990, rating: 4.9, reviews: 2341, img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&q=80", tags: ["NVMe", "PCIe 4.0", "7450 MB/s"], href: "/category/storage" },
  { id: "s2", name: "WD Black SN850X 1TB", brand: "WD", category: "Storage & SSD", price: 2490, originalPrice: 3290, rating: 4.8, reviews: 1876, img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80", tags: ["NVMe", "PCIe 4.0", "Gaming"], href: "/category/storage" },
  { id: "s3", name: "Samsung T9 Portable SSD 2TB", brand: "Samsung", category: "Storage & SSD", price: 3990, originalPrice: 4990, rating: 4.8, reviews: 723, img: "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=400&q=80", tags: ["Portable", "USB 3.2", "IP65"], href: "/category/storage" },
];

const suggestions = ["keyboard", "mouse", "headset", "monitor", "SSD", "NVMe", "gaming", "wireless", "Logitech", "Samsung", "Razer"];

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

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(query);
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [sortBy, setSortBy] = useState("ยอดนิยม");
  const { addToCart } = useCart();

  // Sync input when URL changes
  useEffect(() => {
    setInputValue(query);
    setActiveCategory("ทั้งหมด");
  }, [query]);

  // Search logic — ค้นหาจาก name, brand, category, tags
  const results = allProducts.filter((p) => {
    if (!query) return false;
    const q = query.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));
    const matchCategory = activeCategory === "ทั้งหมด" || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  // Unique categories from results
  const foundCategories = ["ทั้งหมด", ...Array.from(new Set(allProducts
    .filter((p) => {
      const q = query.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q));
    })
    .map((p) => p.category)
  ))];

  const handleSearch = (e) => {
    e.preventDefault();
    const q = inputValue.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Search bar — prominent re-search */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mb-8">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ค้นหาสินค้า..."
            className="w-full bg-gray-900 border border-white/15 focus:border-amber-400 rounded-2xl py-3.5 pl-5 pr-14 text-white placeholder-gray-500 outline-none transition-colors text-sm"
          />
          <button type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-400 hover:bg-amber-300 transition-colors rounded-xl w-9 h-9 flex items-center justify-center text-gray-950">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </form>

        {/* No query state */}
        {!query && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-white text-lg font-semibold mb-2">ค้นหาสินค้า IT</p>
            <p className="text-gray-500 text-sm mb-8">พิมพ์ชื่อสินค้า แบรนด์ หรือหมวดหมู่</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => router.push(`/search?q=${encodeURIComponent(s)}`)}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-gray-400 hover:border-amber-400/50 hover:text-amber-400 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Has query */}
        {query && (
          <>
            {/* Result summary + breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <Link href="/" className="hover:text-amber-400 transition-colors">หน้าแรก</Link>
              <span>/</span>
              <span className="text-gray-300">ค้นหา: "<span className="text-amber-400">{query}</span>"</span>
            </div>

            {/* Category filter tabs */}
            {foundCategories.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {foundCategories.map((cat) => {
                  const count = cat === "ทั้งหมด"
                    ? results.length + (activeCategory !== "ทั้งหมด" ? allProducts.filter((p) => {
                        const q = query.toLowerCase();
                        return (p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
                      }).length - results.length : 0)
                    : allProducts.filter((p) => {
                        const q = query.toLowerCase();
                        return p.category === cat && (p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
                      }).length;
                  return (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                      className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
                        activeCategory === cat
                          ? "bg-amber-400 border-amber-400 text-gray-950 font-semibold"
                          : "border-white/15 text-gray-400 hover:border-amber-400/40 hover:text-amber-400"
                      }`}>
                      {cat}
                      <span className={`ml-1.5 text-[10px] ${activeCategory === cat ? "text-gray-800" : "text-gray-600"}`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}

                {/* Sort */}
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="ml-auto bg-gray-900 border border-white/15 text-xs text-gray-300 px-3 py-1.5 rounded-full outline-none focus:border-amber-400 transition-colors">
                  {["ยอดนิยม", "ราคา: ต่ำ → สูง", "ราคา: สูง → ต่ำ", "คะแนนสูงสุด"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            {/* No results */}
            {results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-5xl mb-4">😔</div>
                <p className="text-white text-lg font-semibold mb-2">ไม่พบสินค้าสำหรับ "{query}"</p>
                <p className="text-gray-500 text-sm mb-8">ลองค้นหาด้วยคำอื่น หรือเลือกดูหมวดหมู่</p>
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {suggestions.map((s) => (
                    <button key={s} onClick={() => router.push(`/search?q=${encodeURIComponent(s)}`)}
                      className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-gray-400 hover:border-amber-400/50 hover:text-amber-400 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
                <Link href="/" className="text-sm text-amber-400 hover:underline">← กลับหน้าแรก</Link>
              </div>
            )}

            {/* Results grid */}
            {results.length > 0 && (
              <>
                <p className="text-gray-400 text-sm mb-5">
                  พบ <span className="text-white font-semibold">{results.length}</span> รายการสำหรับ "
                  <span className="text-amber-400">{query}</span>"
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {results.map((p) => (
                    <a key={p.id} href={p.href}
                      className="group bg-gray-900 border border-white/8 rounded-2xl overflow-hidden hover:border-amber-400/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.07)] transition-all duration-300">
                      <div className="relative overflow-hidden bg-gray-800 h-44">
                        <img src={p.img} alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
                        <span className="absolute top-2 left-2 text-[10px] font-medium bg-gray-950/70 backdrop-blur text-gray-300 px-2 py-0.5 rounded-full border border-white/10">
                          {p.category}
                        </span>
                      </div>
                      <div className="p-3.5">
                        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-1">{p.brand}</p>
                        <h3 className="text-white text-sm font-semibold leading-snug mb-2 line-clamp-2">{p.name}</h3>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {p.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          <StarRating rating={p.rating} />
                          <span className="text-gray-500 text-[10px]">({p.reviews.toLocaleString()})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-amber-400 font-bold">฿{p.price.toLocaleString()}</p>
                            <p className="text-gray-600 text-xs line-through">฿{p.originalPrice.toLocaleString()}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart({
                                id: p.id,
                                name: p.name,
                                brand: p.brand,
                                price: p.price,
                                originalPrice: p.originalPrice,
                                img: p.img,
                                tag: p.tags?.join(", ") || "",
                                qty: 1,
                                stock: 999,
                              });
                            }}
                            className="bg-amber-400 hover:bg-amber-300 text-gray-950 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                            + ตะกร้า
                          </button>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}