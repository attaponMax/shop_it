"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    { label: "เสื้อผ้า", href: "/category/clothing" },
    { label: "รองเท้า", href: "/category/shoes" },
    { label: "กระเป๋า", href: "/category/bags" },
    { label: "อุปกรณ์อิเล็กทรอนิกส์", href: "/category/electronics" },
    { label: "เครื่องสำอาง", href: "/category/beauty" },
    { label: "ของใช้ในบ้าน", href: "/category/home" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500&display=swap');

        .navbar-root * {
          font-family: 'Prompt', 'Sarabun', sans-serif;
        }

        .navbar-root {
          --clr-bg: #0a0a0a;
          --clr-surface: #141414;
          --clr-accent: #f5a623;
          --clr-accent2: #e8442a;
          --clr-text: #f0ece4;
          --clr-muted: #888;
          --clr-border: rgba(255,255,255,0.08);
        }

        .nav-wrapper {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--clr-bg);
          border-bottom: 1px solid var(--clr-border);
          transition: box-shadow 0.3s ease;
        }

        .nav-wrapper.scrolled {
          box-shadow: 0 4px 30px rgba(0,0,0,0.5);
        }

        /* Top bar */
        .topbar {
          background: var(--clr-accent2);
          text-align: center;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 500;
          color: #fff;
          letter-spacing: 0.04em;
        }

        /* Main nav row */
        .main-nav {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        /* Logo */
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: var(--clr-accent);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          color: #0a0a0a;
        }

        .logo-text {
          font-size: 18px;
          font-weight: 700;
          color: var(--clr-text);
          line-height: 1.1;
        }

        .logo-sub {
          font-size: 10px;
          color: var(--clr-accent);
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* Search bar */
        .search-bar {
          flex: 1;
          max-width: 480px;
          position: relative;
        }

        .search-bar input {
          width: 100%;
          background: var(--clr-surface);
          border: 1px solid var(--clr-border);
          border-radius: 24px;
          padding: 10px 48px 10px 18px;
          font-size: 13px;
          color: var(--clr-text);
          outline: none;
          transition: border-color 0.2s;
          font-family: 'Sarabun', sans-serif;
        }

        .search-bar input::placeholder {
          color: var(--clr-muted);
        }

        .search-bar input:focus {
          border-color: var(--clr-accent);
        }

        .search-btn {
          position: absolute;
          right: 4px;
          top: 50%;
          transform: translateY(-50%);
          background: var(--clr-accent);
          border: none;
          border-radius: 20px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #0a0a0a;
          transition: background 0.2s;
        }

        .search-btn:hover {
          background: #ffbe4d;
        }

        /* Right actions */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
          flex-shrink: 0;
        }

        .icon-btn {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: var(--clr-text);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s;
          text-decoration: none;
        }

        .icon-btn:hover {
          background: var(--clr-surface);
          color: var(--clr-accent);
        }

        .badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: var(--clr-accent2);
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          border-radius: 99px;
          min-width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }

        .login-btn {
          background: var(--clr-accent);
          color: #0a0a0a;
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.2s, transform 0.15s;
          font-family: 'Prompt', sans-serif;
        }

        .login-btn:hover {
          background: #ffbe4d;
          transform: translateY(-1px);
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--clr-text);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
        }

        /* Category bar */
        .category-bar {
          border-top: 1px solid var(--clr-border);
          background: var(--clr-surface);
        }

        .category-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 4px;
          height: 44px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .category-inner::-webkit-scrollbar {
          display: none;
        }

        .cat-link {
          white-space: nowrap;
          text-decoration: none;
          color: var(--clr-muted);
          font-size: 13px;
          font-weight: 400;
          padding: 6px 14px;
          border-radius: 20px;
          transition: background 0.2s, color 0.2s;
          flex-shrink: 0;
        }

        .cat-link:hover {
          background: rgba(245,166,35,0.12);
          color: var(--clr-accent);
        }

        .cat-link.active {
          background: var(--clr-accent);
          color: #0a0a0a;
          font-weight: 600;
        }

        .cat-divider {
          width: 1px;
          height: 16px;
          background: var(--clr-border);
          flex-shrink: 0;
          margin: 0 4px;
        }

        /* Sale chip */
        .sale-chip {
          background: var(--clr-accent2);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          letter-spacing: 0.05em;
          margin-left: 4px;
          vertical-align: middle;
        }

        /* Mobile menu */
        .mobile-menu {
          background: var(--clr-surface);
          border-top: 1px solid var(--clr-border);
          padding: 16px 24px 20px;
        }

        .mobile-search {
          position: relative;
          margin-bottom: 16px;
        }

        .mobile-search input {
          width: 100%;
          box-sizing: border-box;
          background: var(--clr-bg);
          border: 1px solid var(--clr-border);
          border-radius: 12px;
          padding: 10px 44px 10px 14px;
          font-size: 13px;
          color: var(--clr-text);
          outline: none;
          font-family: 'Sarabun', sans-serif;
        }

        .mobile-search input::placeholder { color: var(--clr-muted); }

        .mobile-search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--clr-muted);
        }

        .mobile-cats {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 16px;
        }

        .mobile-cat-link {
          display: block;
          text-decoration: none;
          color: var(--clr-text);
          font-size: 14px;
          padding: 10px 12px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .mobile-cat-link:hover {
          background: rgba(245,166,35,0.1);
          color: var(--clr-accent);
        }

        .mobile-divider {
          height: 1px;
          background: var(--clr-border);
          margin: 12px 0;
        }

        .mobile-actions {
          display: flex;
          gap: 10px;
        }

        .mobile-login-btn {
          flex: 1;
          background: var(--clr-accent);
          color: #0a0a0a;
          border: none;
          border-radius: 10px;
          padding: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          display: block;
          font-family: 'Prompt', sans-serif;
        }

        .mobile-register-btn {
          flex: 1;
          background: transparent;
          color: var(--clr-text);
          border: 1px solid var(--clr-border);
          border-radius: 10px;
          padding: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          display: block;
          font-family: 'Prompt', sans-serif;
        }

        @media (max-width: 768px) {
          .search-bar { display: none; }
          .cat-link-text { display: none; }
          .mobile-toggle { display: flex; }
          .login-btn { display: none; }
          .desktop-icons { display: none; }
        }

        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>

      <div className="navbar-root">
        {/* Promo bar */}
        <div className="topbar">
          🔥 ส่งฟรีทั่วไทย เมื่อซื้อครบ 500 บาท &nbsp;|&nbsp; โค้ด: <strong>FREESHIP500</strong>
        </div>

        <nav className={`nav-wrapper ${isScrolled ? "scrolled" : ""}`}>
          {/* Main Row */}
          <div className="main-nav">
            {/* Logo */}
            <Link href="/" className="logo">
              <div className="logo-icon">S</div>
              <div>
                <div className="logo-text">ShopSanook</div>
                <div className="logo-sub">ช้อปสนุก ราคาดี</div>
              </div>
            </Link>

            {/* Search */}
            <div className="search-bar">
              <input type="text" placeholder="ค้นหาสินค้า เช่น เสื้อยืด, รองเท้า..." />
              <button className="search-btn">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </button>
            </div>

            {/* Desktop Actions */}
            <div className="nav-actions">
              <div className="desktop-icons" style={{display:"flex",alignItems:"center",gap:"4px"}}>
                <Link href="/wishlist" className="icon-btn" title="รายการโปรด">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </Link>
                <Link href="/account" className="icon-btn" title="บัญชีของฉัน">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </Link>
                <Link href="/cart" className="icon-btn" title="ตะกร้าสินค้า">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  {cartCount > 0 && <span className="badge">{cartCount}</span>}
                </Link>
              </div>

              <Link href="/login" className="login-btn">
                เข้าสู่ระบบ
              </Link>

              {/* Mobile toggle */}
              <button
                className="mobile-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="เมนู"
              >
                {isMenuOpen ? (
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                ) : (
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Category Bar */}
          <div className="category-bar">
            <div className="category-inner">
              <Link href="/deals" className="cat-link active">
                🔥 ดีลวันนี้ <span className="sale-chip">HOT</span>
              </Link>
              <div className="cat-divider"/>
              {categories.map((cat) => (
                <Link key={cat.href} href={cat.href} className="cat-link">
                  {cat.label}
                </Link>
              ))}
              <div className="cat-divider"/>
              <Link href="/brands" className="cat-link">แบรนด์ยอดนิยม</Link>
              <Link href="/new" className="cat-link">สินค้าใหม่</Link>
              <Link href="/sale" className="cat-link">
                ลดราคา <span className="sale-chip">SALE</span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="mobile-menu">
              <div className="mobile-search">
                <input type="text" placeholder="ค้นหาสินค้า..." />
                <svg className="mobile-search-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>

              <div className="mobile-cats">
                <Link href="/deals" className="mobile-cat-link">🔥 ดีลวันนี้</Link>
                {categories.map((cat) => (
                  <Link key={cat.href} href={cat.href} className="mobile-cat-link">
                    {cat.label}
                  </Link>
                ))}
                <Link href="/brands" className="mobile-cat-link">แบรนด์ยอดนิยม</Link>
                <Link href="/new" className="mobile-cat-link">สินค้าใหม่</Link>
                <Link href="/sale" className="mobile-cat-link">🏷️ ลดราคา</Link>
              </div>

              <div className="mobile-divider"/>

              <div className="mobile-actions">
                <Link href="/login" className="mobile-login-btn">เข้าสู่ระบบ</Link>
                <Link href="/register" className="mobile-register-btn">สมัครสมาชิก</Link>
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}