"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "shopSanookCart";

export function getCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") || [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("cart-updated", { detail: { cart } }));
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + (item.qty || 0), 0);
}

export function addToCart(item) {
  const cart = getCart();
  const existing = cart.find((p) => p.id === item.id);
  if (existing) {
    existing.qty = Math.min((existing.qty || 0) + (item.qty || 1), item.stock ?? Infinity);
  } else {
    cart.push({ ...item, qty: item.qty || 1 });
  }
  saveCart(cart);

  // Dispatch a global event so UI can show a toast/notification
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cart-item-added", { detail: { item, cart } }));
  }

  return cart;
}

export function updateCartItem(id, updates) {
  const cart = getCart();
  const idx = cart.findIndex((p) => p.id === id);
  if (idx === -1) return cart;
  cart[idx] = { ...cart[idx], ...updates };
  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1);
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(id) {
  const cart = getCart().filter((p) => p.id !== id);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
  return [];
}

export function useCart() {
  const [cart, setCart] = useState(getCart());
  const [count, setCount] = useState(getCartCount());

  useEffect(() => {
    const handle = () => {
      const updated = getCart();
      setCart(updated);
      setCount(getCartCount());
    };
    window.addEventListener("cart-updated", handle);
    return () => window.removeEventListener("cart-updated", handle);
  }, []);

  const add = (item) => {
    const updated = addToCart(item);
    setCart(updated);
    setCount(getCartCount());
    return updated;
  };

  const update = (id, updates) => {
    const updated = updateCartItem(id, updates);
    setCart(updated);
    setCount(getCartCount());
    return updated;
  };

  const remove = (id) => {
    const updated = removeFromCart(id);
    setCart(updated);
    setCount(getCartCount());
    return updated;
  };

  const clear = () => {
    const updated = clearCart();
    setCart(updated);
    setCount(0);
    return updated;
  };

  return {
    cart,
    count,
    addToCart: add,
    updateCartItem: update,
    removeFromCart: remove,
    clearCart: clear,
  };
}
