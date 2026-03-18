import Navbar from "../components/Navbar";

const categories = [
  { label: "คีย์บอร์ด", icon: "⌨️", count: "240+ รายการ", href: "/category/keyboard", color: "from-violet-500/20 to-violet-600/5" },
  { label: "เมาส์", icon: "🖱️", count: "180+ รายการ", href: "/category/mouse", color: "from-blue-500/20 to-blue-600/5" },
  { label: "หูฟัง", icon: "🎧", count: "320+ รายการ", href: "/category/headset", color: "from-rose-500/20 to-rose-600/5" },
  { label: "Webcam", icon: "📷", count: "90+ รายการ", href: "/category/webcam", color: "from-green-500/20 to-green-600/5" },
  { label: "Monitor", icon: "🖥️", count: "150+ รายการ", href: "/category/monitor", color: "from-amber-500/20 to-amber-600/5" },
  { label: "Storage", icon: "💾", count: "200+ รายการ", href: "/category/storage", color: "from-cyan-500/20 to-cyan-600/5" },
];

export default function CategoryPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden bg-gray-950">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            เลือกหมวดหมู่
            <br />
            รวดเร็ว ง่ายดาย<br />
            ค้นหาสินค้าที่ใช่สำหรับคุณ
          </h1>
          <p className="text-gray-400 text-base md:text-lg mb-10 max-w-2xl">
            เลือกหมวดหมู่ เพื่อค้นหาอุปกรณ์ไอทีที่ต้องการได้ทันที ไม่ว่าจะเป็นคีย์บอร์ด เมาส์ หูฟัง หรือจอมอนิเตอร์
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-1">หมวดหมู่</p>
            <h2 className="text-2xl font-bold text-white">เลือกตามประเภท</h2>
          </div>
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
    </div>
  );
}
