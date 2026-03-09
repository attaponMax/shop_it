"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    setIsLoading(true);
    // Mock login — replace with real auth
    await new Promise((res) => setTimeout(res, 1200));
    setIsLoading(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">

      {/* ─── LEFT PANEL — branding ─── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1593640408182-31c228210673?w=900&q=80"
            alt="bg"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950/80 to-gray-900/60" />
        </div>

        {/* Glow */}
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-gray-950 font-bold text-xl">
            S
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">ShopSanook</p>
            <p className="text-amber-400 text-[10px] tracking-widest uppercase font-medium">IT & Gaming Store</p>
          </div>
        </div>

        {/* Center copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">ยินดีต้อนรับกลับ</p>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            ช้อปสนุก
            <br />
            <span className="text-amber-400">ราคาที่ใช่</span>
            <br />
            ทุกวัน
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            เข้าสู่ระบบเพื่อเข้าถึงสินค้า IT กว่า 1,000+ รายการ ติดตามออเดอร์ และรับสิทธิ์โปรโมชั่นพิเศษ
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {["🚚 ส่งฟรีทั่วไทย", "🔒 ชำระเงินปลอดภัย", "✅ สินค้าแท้ 100%", "🔄 คืนสินค้าใน 30 วัน"].map((f) => (
              <span key={f} className="text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <p className="text-gray-600 text-xs">© 2026 ShopSanook. All rights reserved.</p>
        </div>
      </div>

      {/* ─── RIGHT PANEL — form ─── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-gray-950 font-bold text-lg">S</div>
          <div>
            <p className="text-white font-bold text-base leading-tight">ShopSanook</p>
            <p className="text-amber-400 text-[10px] tracking-widest uppercase">IT & Gaming Store</p>
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto lg:mx-0">
          <h2 className="text-2xl font-bold text-white mb-1">เข้าสู่ระบบ</h2>
          <p className="text-gray-400 text-sm mb-8">
            ยังไม่มีบัญชี?{" "}
            <Link href="/register" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              สมัครสมาชิกฟรี
            </Link>
          </p>

          {/* Social login */}
          <div className="flex gap-3 mb-6">
            <button className="flex-1 flex items-center justify-center gap-2 bg-gray-900 border border-white/10 hover:border-white/25 text-white text-sm py-2.5 rounded-xl transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-gray-600 text-xs">หรือเข้าสู่ระบบด้วยอีเมล</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">อีเมล</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full bg-gray-900 border border-white/10 focus:border-amber-400 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm text-gray-400">รหัสผ่าน</label>
                <Link href="/forgot-password" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                  ลืมรหัสผ่าน?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="รหัสผ่านของคุณ"
                  className="w-full bg-gray-900 border border-white/10 focus:border-amber-400 rounded-xl py-3 pl-10 pr-11 text-sm text-white placeholder-gray-600 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-4 h-4 rounded border border-white/20 peer-checked:bg-amber-400 peer-checked:border-amber-400 transition-colors" />
                <svg className="absolute inset-0 w-4 h-4 text-gray-950 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">จดจำการเข้าสู่ระบบ</span>
            </label>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2.5 rounded-xl">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-amber-400/50 disabled:cursor-not-allowed text-gray-950 font-bold py-3 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(251,191,36,0.3)] text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-xs text-gray-600 mt-6">
            การเข้าสู่ระบบถือว่าคุณยอมรับ{" "}
            <Link href="/terms" className="text-gray-400 hover:text-amber-400 transition-colors">เงื่อนไขการใช้งาน</Link>
            {" "}และ{" "}
            <Link href="/privacy" className="text-gray-400 hover:text-amber-400 transition-colors">นโยบายความเป็นส่วนตัว</Link>
          </p>
        </div>
      </div>
    </div>
  );
}