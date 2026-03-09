import Navbar from "./components/Navbar";

const featuredProducts = [
  {
    id: 1,
    name: "Mechanical Keyboard RGB Pro",
    brand: "Lorgar",
    price: 2990,
    originalPrice: 4500,
    rating: 4.8,
    reviews: 324,
    badge: "ขายดี",
    badgeColor: "bg-amber-400 text-gray-950",
    img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80",
    tag: "Mechanical · RGB · Hot-swap",
  },
  {
    id: 2,
    name: "True Wireless Earbuds Pro",
    brand: "HECATE",
    price: 1490,
    originalPrice: 2200,
    rating: 4.6,
    reviews: 189,
    badge: "ลด 32%",
    badgeColor: "bg-red-500 text-white",
    img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
    tag: "ANC · 30hr Battery · IPX5",
  },
  {
    id: 3,
    name: "Gaming Mouse Wireless",
    brand: "Logitech",
    price: 3290,
    originalPrice: 3990,
    rating: 4.9,
    reviews: 512,
    badge: "ใหม่",
    badgeColor: "bg-blue-500 text-white",
    img: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&q=80",
    tag: "25600 DPI · Wireless · RGB",
  },
  {
    id: 4,
    name: "4K Webcam Ultra HD",
    brand: "Logitech",
    price: 4290,
    originalPrice: 5500,
    rating: 4.7,
    reviews: 203,
    badge: "ลด 22%",
    badgeColor: "bg-red-500 text-white",
    img: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400&q=80",
    tag: "4K · AI Frame · Stereo Mic",
  },
];

const categories = [
  { label: "คีย์บอร์ด", icon: "⌨️", count: "240+ รายการ", href: "/category/keyboard", color: "from-violet-500/20 to-violet-600/5" },
  { label: "เมาส์", icon: "🖱️", count: "180+ รายการ", href: "/category/mouse", color: "from-blue-500/20 to-blue-600/5" },
  { label: "หูฟัง", icon: "🎧", count: "320+ รายการ", href: "/category/headset", color: "from-rose-500/20 to-rose-600/5" },
  { label: "Webcam", icon: "📷", count: "90+ รายการ", href: "/category/webcam", color: "from-green-500/20 to-green-600/5" },
  { label: "Monitor", icon: "🖥️", count: "150+ รายการ", href: "/category/monitor", color: "from-amber-500/20 to-amber-600/5" },
  { label: "Storage", icon: "💾", count: "200+ รายการ", href: "/category/storage", color: "from-cyan-500/20 to-cyan-600/5" },
];

const brands = ["Logitech", "Razer", "ASUS ROG", "HyperX", "Samsung", "WD", "Corsair", "SteelSeries"];

function StarRating({ rating }) {
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

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gray-950">
        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
          {/* Left */}
          <div className="flex-1 text-center md:text-left z-10">
            <span className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              Flash Sale · ลดสูงสุด 50%
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              อุปกรณ์ IT
              <br />
              <span className="text-amber-400">ครบครัน</span>
              <br />
              ราคาที่ใช่
            </h1>

            <p className="text-gray-400 text-base md:text-lg mb-8 max-w-md mx-auto md:mx-0">
              คีย์บอร์ด เมาส์ หูฟัง และอุปกรณ์ไอทีกว่า 1,000+ รายการ จัดส่งไว ถูกกว่าห้าง
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a
                href="/deals"
                className="bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold px-8 py-3.5 rounded-xl text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(251,191,36,0.35)]"
              >
                ช้อปเลย 🛒
              </a>
              <a
                href="/category"
                className="border border-white/15 hover:bg-white/5 text-white font-medium px-8 py-3.5 rounded-xl text-sm transition-all"
              >
                ดูหมวดหมู่ทั้งหมด
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 mt-10 justify-center md:justify-start text-xs text-gray-500">
              {["🚚 ส่งฟรีทั่วไทย", "✅ สินค้าแท้ 100%", "🔄 คืนสินค้าใน 30 วัน", "🔒 ชำระเงินปลอดภัย"].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>

          {/* Right — hero image collage */}
          <div className="flex-1 relative z-10 w-full max-w-lg mx-auto">
            <div className="relative">
              {/* Main image */}
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1593640408182-31c228210673?w=700&q=80"
                  alt="IT Setup"
                  className="w-full h-72 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent rounded-2xl" />
              </div>

              {/* Floating card 1 */}
              <div className="absolute -bottom-4 -left-4 bg-gray-900 border border-white/10 rounded-xl p-3 shadow-xl flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=80&q=80"
                  className="w-12 h-12 rounded-lg object-cover"
                  alt="keyboard"
                />
                <div>
                  <p className="text-white text-xs font-semibold">Mech Keyboard RGB</p>
                  <p className="text-amber-400 text-xs font-bold">฿2,990</p>
                </div>
              </div>

              {/* Floating card 2 */}
              <div className="absolute -top-4 -right-4 bg-gray-900 border border-white/10 rounded-xl p-3 shadow-xl">
                <p className="text-gray-400 text-[10px] mb-1">ยอดขายวันนี้</p>
                <p className="text-white text-lg font-bold">1,284</p>
                <p className="text-green-400 text-[10px]">↑ +18% จากเมื่อวาน</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORY CARDS ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-1">หมวดหมู่</p>
            <h2 className="text-2xl font-bold text-white">เลือกตามประเภท</h2>
          </div>
          <a href="/category" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">
            ดูทั้งหมด →
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <a
              key={cat.label}
              href={cat.href}
              className={`group bg-gradient-to-b ${cat.color} border border-white/8 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-amber-400/30 hover:scale-105 transition-all duration-200`}
            >
              <span className="text-3xl">{cat.icon}</span>
              <p className="text-white text-sm font-semibold">{cat.label}</p>
              <p className="text-gray-500 text-[10px]">{cat.count}</p>
            </a>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4 pb-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-1">สินค้าแนะนำ</p>
            <h2 className="text-2xl font-bold text-white">ยอดนิยมประจำสัปดาห์</h2>
          </div>
          <a href="/products" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">
            ดูทั้งหมด →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProducts.map((p) => (
            <a
              key={p.id}
              href={`/product/${p.id}`}
              className="group bg-gray-900 border border-white/8 rounded-2xl overflow-hidden hover:border-amber-400/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.08)] transition-all duration-300"
            >
              {/* Image */}
              <div className="relative overflow-hidden bg-gray-800 h-48">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
                <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${p.badgeColor}`}>
                  {p.badge}
                </span>
                {/* Wishlist */}
                <button className="absolute top-3 right-3 w-7 h-7 bg-gray-900/60 hover:bg-gray-900 backdrop-blur rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-3.5 h-3.5 text-gray-400 hover:text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-1">{p.brand}</p>
                <h3 className="text-white text-sm font-semibold leading-snug mb-1 line-clamp-2">{p.name}</h3>
                <p className="text-gray-600 text-[10px] mb-2">{p.tag}</p>

                <div className="flex items-center gap-1.5 mb-3">
                  <StarRating rating={p.rating} />
                  <span className="text-gray-500 text-[10px]">({p.reviews})</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-400 font-bold text-base">฿{p.price.toLocaleString()}</p>
                    <p className="text-gray-600 text-xs line-through">฿{p.originalPrice.toLocaleString()}</p>
                  </div>
                  <button className="bg-amber-400 hover:bg-amber-300 text-gray-950 text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
                    + ตะกร้า
                  </button>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ─── PROMO BANNER ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 to-gray-900 border border-white/8">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1593640408182-31c228210673?w=1200&q=80"
              alt="banner"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent" />
          </div>

          <div className="relative z-10 p-8 md:p-12 max-w-lg">
            <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
              ⚡ Flash Sale · เหลือเวลาอีก 12:34:56
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Gaming Setup
              <br />
              <span className="text-amber-400">ลดสูงสุด 50%</span>
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              อุปกรณ์เกมมิ่งระดับโปร คีย์บอร์ด เมาส์ หูฟัง พร้อมจัดเต็ม
            </p>
            <a
              href="/sale/gaming"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold px-6 py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5"
            >
              ช้อปเลย →
            </a>
          </div>
        </div>
      </section>

      {/* ─── BRANDS ─── */}
      <section className="border-t border-white/8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-center text-gray-500 text-xs font-semibold uppercase tracking-widest mb-6">แบรนด์ที่เราจำหน่าย</p>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {brands.map((b) => (
              <span key={b} className="text-gray-500 hover:text-gray-300 font-semibold text-sm transition-colors cursor-pointer">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/8 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
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