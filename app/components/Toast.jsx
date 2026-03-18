"use client";

import { useEffect, useState } from "react";

export default function Toast() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      const itemName = event.detail?.item?.name;
      const msg = itemName ? `✅ เพิ่ม "${itemName}" เข้าตะกร้าแล้ว` : "✅ เพิ่มสินค้าเข้าตะกร้าแล้ว";
      setMessage(msg);
      setVisible(true);
      window.setTimeout(() => setVisible(false), 1800);
    };

    window.addEventListener("cart-item-added", handler);
    return () => window.removeEventListener("cart-item-added", handler);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="rounded-full bg-gray-900/90 text-white px-5 py-3 shadow-xl border border-white/10 backdrop-blur-lg flex items-center gap-3">
        <span className="text-lg">✅</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
