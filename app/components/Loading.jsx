"use client";

import { useState, useEffect } from "react";

export default function PageLoader({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ซ่อน loading หลัง page mount เสร็จ
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Loading Overlay */}
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950 transition-opacity duration-500 ${
          isLoading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-gray-950 font-bold text-xl">
              S
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">ShopSanook</p>
              <p className="text-amber-400 text-[10px] tracking-widest uppercase font-medium">IT & Gaming Store</p>
            </div>
          </div>

          {/* Spinner ring */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-white/8" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-amber-400 border-r-amber-400/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </div>
          </div>

          {/* Text + dots */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-gray-400 text-sm font-medium tracking-widest uppercase">
              กำลังโหลด
            </p>
            <div className="flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        {children}
      </div>
    </>
  );
}