"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const categories = [
  { label: "⚡ Flash Sale", href: "/deals", hot: true },
  { label: "คีย์บอร์ด", href: "/category/keyboard" },
  { label: "เมาส์", href: "/category/mouse" },
  { label: "หูฟัง & ลำโพง", href: "/category/headset" },
  { label: "Monitor", href: "/category/monitor" },
  { label: "Storage & SSD", href: "/category/storage" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setSearchQuery("");
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 bg-gray-950 border-b border-white/10 transition-shadow duration-300 ${
          isScrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.6)]" : ""
        }`}
      >
        {/* Top Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-amber-400 flex items-center justify-center text-gray-950 font-bold text-lg">
              S
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-bold text-base leading-tight">ShopSanook</p>
              <p className="text-amber-400 text-[10px] tracking-widest uppercase font-medium">IT & Gaming Store</p>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative flex-1 max-w-xl hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาสินค้า เช่น keyboard, mouse, headset..."
              className="w-full bg-gray-800 border border-white/10 rounded-full py-2.5 pl-4 pr-14 text-sm text-white placeholder-gray-500 outline-none focus:border-amber-400 transition-colors"
            />
            <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-amber-400 hover:bg-amber-300 transition-colors rounded-full w-8 h-8 flex items-center justify-center text-gray-950">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Desktop icons */}
            <div className="hidden md:flex items-center gap-1">
              <Link href="/wishlist" className="p-2 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-white/5 transition-colors" title="รายการโปรด">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </Link>
              <Link href="/account" className="p-2 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-white/5 transition-colors" title="บัญชีของฉัน">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
              <Link href="/cart" className="relative p-2 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-white/5 transition-colors" title="ตะกร้าสินค้า">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-1 leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            <Link
              href="/login"
              className="hidden md:flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-gray-950 font-semibold text-sm px-4 py-2 rounded-lg transition-all hover:-translate-y-0.5 ml-2"
            >
              เข้าสู่ระบบ
            </Link>

            {/* Mobile: cart + hamburger */}
            <Link href="/cart" className="relative p-2 rounded-lg text-gray-400 md:hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
            >
              {isMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Category Bar */}
        <div className="bg-gray-900 border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 h-11 overflow-x-auto">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className={`flex-shrink-0 flex items-center gap-1.5 text-sm px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                  cat.hot
                    ? "bg-amber-400 text-gray-950 font-semibold"
                    : "text-gray-400 hover:text-amber-400 hover:bg-amber-400/10"
                }`}
              >
                {cat.label}
                {cat.sale && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    SALE
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-white/10 px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหา keyboard, mouse, headset..."
                className="w-full bg-gray-800 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-sm text-white placeholder-gray-500 outline-none focus:border-amber-400 transition-colors"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-500 hover:text-amber-400 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </form>

            {/* Mobile Category Links */}
            <div className="flex flex-col gap-0.5">
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-amber-400 hover:bg-white/5 transition-colors"
                >
                  <span>{cat.label}</span>
                  {cat.sale && (
                    <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      SALE
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex gap-2 pt-2 border-t border-white/10">
              <Link
                href="/login"
                className="flex-1 text-center bg-amber-400 hover:bg-amber-300 text-gray-950 font-semibold text-sm py-2.5 rounded-xl transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center border border-white/15 text-gray-300 hover:bg-white/5 text-sm py-2.5 rounded-xl transition-colors"
              >
                สมัครสมาชิก
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}