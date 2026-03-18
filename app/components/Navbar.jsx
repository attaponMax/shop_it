"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useCart } from "../lib/cart";
import Toast from "./Toast";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const categories = [
  { label: "คีย์บอร์ด", href: "/category/keyboard" },
  { label: "เมาส์", href: "/category/mouse" },
  { label: "หูฟัง & ลำโพง", href: "/category/headset" },
  { label: "Monitor", href: "/category/monitor" },
  { label: "Storage & SSD", href: "/category/storage" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Admin", href: "/admin" },
];

// ─── User Dropdown ────────────────────────────────────────────
function UserDropdown({ user, userData, onSignOut }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initial = userData?.name?.[0] || user.email?.[0]?.toUpperCase() || "U";
  const displayName = userData?.name || user.email;
  const isAdmin = userData?.role === "admin";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors group"
      >
        {/* Avatar */}
        {user.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover border border-white/10"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
            <span className="text-amber-400 text-sm font-bold">{initial}</span>
          </div>
        )}
        {/* Name (desktop) */}
        <span className="hidden lg:block text-sm text-gray-300 group-hover:text-white transition-colors max-w-[100px] truncate">
          {userData?.name?.split(" ")[0] || "บัญชีฉัน"}
        </span>
        {/* Admin badge */}
        {isAdmin && (
          <span className="hidden lg:block text-[9px] font-bold bg-amber-400/10 border border-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded-full">
            Admin
          </span>
        )}
        <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-white/8">
            <p className="text-white text-sm font-semibold truncate">{userData?.name || "ผู้ใช้"}</p>
            <p className="text-gray-500 text-xs truncate">{user.email}</p>
            {isAdmin && (
              <span className="inline-block mt-1.5 text-[9px] font-bold bg-amber-400/10 border border-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full">
                Administrator
              </span>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            {[
              { label: "บัญชีของฉัน", href: "/account", icon: <circle cx="12" cy="7" r="4"/> },
              { label: "คำสั่งซื้อของฉัน", href: "/orders", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/> },
              { label: "รายการโปรด", href: "/wishlist", icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/> },
              ...(isAdmin ? [{ label: "Dashboard", href: "/dashboard", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>, admin: true }] : []),
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${item.admin ? "text-amber-400 hover:text-amber-300" : "text-gray-300 hover:text-white"}`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  {item.icon}
                </svg>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Sign out */}
          <div className="border-t border-white/8 py-1.5">
            <button
              onClick={() => { setOpen(false); onSignOut(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              ออกจากระบบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { count: cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [session, setSession] = useState(null);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  // ── ดึง session + ข้อมูล user ──────────────────────────────
  useEffect(() => {
    // โหลด session ปัจจุบัน
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
    });

    // ฟัง event เมื่อ login / logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
      else setUserData(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    const { data } = await supabase
      .from("users")
      .select("name, role, avatar_url")
      .eq("id", userId)
      .single();
    if (data) setUserData(data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserData(null);
    router.push("/");
  };

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
      <Toast />
      <nav className={`sticky top-0 z-50 bg-gray-950 border-b border-white/10 transition-shadow duration-300 ${isScrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.6)]" : ""}`}>

        {/* Top Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-amber-400 flex items-center justify-center text-gray-950 font-bold text-lg">S</div>
            <div className="hidden sm:block">
              <p className="text-white font-bold text-base leading-tight">SmartTech</p>
              <p className="text-amber-400 text-[10px] tracking-widest uppercase font-medium">IT & Gaming Store</p>
            </div>
          </Link>

          {/* Search */}
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
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-1 ml-auto">
            <div className="hidden md:flex items-center gap-1">
              <Link href="/wishlist" className="p-2 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-white/5 transition-colors" title="รายการโปรด">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </Link>
              <Link href="/cart" className="relative p-2 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-white/5 transition-colors" title="ตะกร้าสินค้า">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-1 leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* ── Auth: แสดง UserDropdown หรือปุ่ม login ── */}
            {session ? (
              <div className="ml-2">
                <UserDropdown
                  user={session.user}
                  userData={userData}
                  onSignOut={handleSignOut}
                />
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-gray-950 font-semibold text-sm px-4 py-2 rounded-lg transition-all hover:-translate-y-0.5 ml-2"
              >
                เข้าสู่ระบบ
              </Link>
            )}

            {/* Mobile: cart + hamburger */}
            <Link href="/cart" className="relative p-2 rounded-lg text-gray-400 md:hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
              {isMenuOpen
                ? <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                : <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              }
            </button>
          </div>
        </div>

        {/* Category Bar */}
        <div className="bg-gray-900 border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 h-11 overflow-x-auto">
            {categories.map((cat) => (
              <Link key={cat.href} href={cat.href}
                className={`flex-shrink-0 flex items-center gap-1.5 text-sm px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                  cat.hot ? "bg-amber-400 text-gray-950 font-semibold" : "text-gray-400 hover:text-amber-400 hover:bg-amber-400/10"
                }`}>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-white/10 px-4 py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหา keyboard, mouse, headset..."
                className="w-full bg-gray-800 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-sm text-white placeholder-gray-500 outline-none focus:border-amber-400 transition-colors"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-500 hover:text-amber-400 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </button>
            </form>

            <div className="flex flex-col gap-0.5">
              {categories.map((cat) => (
                <Link key={cat.href} href={cat.href} onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-amber-400 hover:bg-white/5 transition-colors">
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* Mobile Auth */}
            {session ? (
              <div className="pt-2 border-t border-white/10 space-y-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                    <span className="text-amber-400 text-sm font-bold">
                      {userData?.name?.[0] || session.user.email?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{userData?.name || "ผู้ใช้"}</p>
                    <p className="text-gray-500 text-xs truncate">{session.user.email}</p>
                  </div>
                </div>
                {[
                  { label: "บัญชีของฉัน", href: "/account" },
                  { label: "คำสั่งซื้อ", href: "/orders" },
                  ...(userData?.role === "admin" ? [{ label: "Dashboard", href: "/dashboard" }] : []),
                ].map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-amber-400 hover:bg-white/5 transition-colors">
                    {item.label}
                  </Link>
                ))}
                <button onClick={() => { setIsMenuOpen(false); handleSignOut(); }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/5 transition-colors">
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2 border-t border-white/10">
                <Link href="/login" className="flex-1 text-center bg-amber-400 hover:bg-amber-300 text-gray-950 font-semibold text-sm py-2.5 rounded-xl transition-colors">
                  เข้าสู่ระบบ
                </Link>
                <Link href="/register" className="flex-1 text-center border border-white/15 text-gray-300 hover:bg-white/5 text-sm py-2.5 rounded-xl transition-colors">
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}