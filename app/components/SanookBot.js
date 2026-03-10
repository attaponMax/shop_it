"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const QUICK_REPLIES = [
  { label: "⌨️ แนะนำคีย์บอร์ด",  text: "แนะนำคีย์บอร์ดเกมมิ่งสักตัวหน่อย" },
  { label: "🖱️ เมาส์ไร้สาย",      text: "มีเมาส์ไร้สายราคาไม่เกิน 3000 บาทไหม?" },
  { label: "🚚 จัดส่งกี่วัน?",    text: "สั่งซื้อแล้วจัดส่งกี่วันครับ?" },
  { label: "💳 ชำระเงินยังไง?",   text: "ชำระเงินได้วิธีไหนบ้าง?" },
  { label: "🎧 หูฟัง ANC",         text: "หูฟัง ANC ดีๆ มีอะไรแนะนำบ้าง?" },
  { label: "🔄 คืนสินค้า",         text: "อยากคืนสินค้า ทำได้ไหม?" },
];

const CSAT_OPTIONS = [
  { score: 5, emoji: "😄", label: "ดีมาก" },
  { score: 4, emoji: "🙂", label: "ดี" },
  { score: 3, emoji: "😐", label: "พอใช้" },
  { score: 2, emoji: "😞", label: "แย่" },
  { score: 1, emoji: "😡", label: "แย่มาก" },
];

function now() {
  return new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"} items-end`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mb-0.5">
          <span className="text-[11px] font-bold text-gray-950">S</span>
        </div>
      )}
      <div className={`max-w-[78%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-amber-400 text-gray-950 font-medium rounded-br-sm"
            : "bg-gray-800 text-gray-100 rounded-bl-sm border border-white/8"
        }`}>
          {msg.content}
        </div>
        <span className="text-gray-600 text-[10px] px-1">{msg.time}</span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2 items-end">
      <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
        <span className="text-[11px] font-bold text-gray-950">S</span>
      </div>
      <div className="bg-gray-800 border border-white/8 px-4 py-3 rounded-2xl rounded-bl-sm">
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CSAT Widget ──────────────────────────────
function CsatWidget({ onRate, onSkip }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = async (score) => {
    setSelected(score);
    setSubmitted(true);
    await onRate(score);
  };

  return (
    <div className="bg-gray-800/60 border border-white/8 rounded-2xl p-4 mt-2">
      {submitted ? (
        <div className="text-center py-1">
          <p className="text-green-400 text-sm font-semibold">ขอบคุณสำหรับ Feedback! 🙏</p>
        </div>
      ) : (
        <>
          <p className="text-gray-300 text-xs font-medium text-center mb-3">คุณพอใจกับการช่วยเหลือแค่ไหน?</p>
          <div className="flex justify-center gap-2">
            {CSAT_OPTIONS.map((opt) => (
              <button key={opt.score} onClick={() => handleRate(opt.score)}
                title={opt.label}
                className={`text-xl transition-all hover:scale-125 ${
                  selected === opt.score ? "scale-125" : ""
                }`}>
                {opt.emoji}
              </button>
            ))}
          </div>
          <button onClick={onSkip} className="w-full mt-2 text-[10px] text-gray-600 hover:text-gray-400 transition-colors">
            ข้ามขั้นตอนนี้
          </button>
        </>
      )}
    </div>
  );
}

// ─── Main Bot ─────────────────────────────────
export default function SanookBot() {
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState([
    { role: "assistant", content: "สวัสดีครับ! 👋 ผม SanookBot ผู้ช่วยของร้าน ShopSanook\nช่วยอะไรได้บ้างครับ?", time: now() },
  ]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [hasNew, setHasNew]       = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const [showCsat, setShowCsat]   = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [userId, setUserId]       = useState(null);
  const bottomRef                 = useRef(null);
  const inputRef                  = useRef(null);

  // Get current user id if logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) setUserId(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, showCsat]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setHasNew(false);
    }
  }, [open]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    setInput("");
    setShowQuick(false);
    setShowCsat(false);

    const userMsg = { role: "user", content: userText, time: now() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
          sessionId,
          userId,
        }),
      });

      const data = await res.json();

      // Save session ID from first response
      if (data.sessionId && !sessionId) setSessionId(data.sessionId);

      const reply = data.reply || "ขออภัยครับ ไม่สามารถตอบได้ในขณะนี้";
      setMessages((prev) => [...prev, { role: "assistant", content: reply, time: now() }]);

      if (!open) setHasNew(true);

      // Show CSAT after every 4 bot replies
      const totalBotMsgs = nextMessages.filter((m) => m.role === "assistant").length + 1;
      if (totalBotMsgs > 0 && totalBotMsgs % 4 === 0) {
        setTimeout(() => setShowCsat(true), 1000);
      }

    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ เกิดข้อผิดพลาด กรุณาลองใหม่ครับ", time: now() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCsatRate = async (score) => {
    if (!sessionId) return;
    await fetch("/api/chat", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, csatScore: score, resolved: true }),
    });
    setTimeout(() => setShowCsat(false), 2000);
  };

  const handleCsatSkip = () => setShowCsat(false);

  const clearChat = async () => {
    // End old session
    if (sessionId) {
      await fetch("/api/chat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, resolved: false }),
      });
    }
    setSessionId(null);
    setMessages([{ role: "assistant", content: "สวัสดีครับ! 👋 ผม SanookBot ผู้ช่วยของร้าน ShopSanook\nช่วยอะไรได้บ้างครับ?", time: now() }]);
    setShowQuick(true);
    setShowCsat(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* Chat Window */}
      <div className={`fixed bottom-24 right-5 z-50 w-[340px] sm:w-[380px] transition-all duration-300 origin-bottom-right ${
        open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"
      }`}>
        <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden" style={{ height: "540px" }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-white/8 flex-shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-950">S</span>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-gray-900" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">SanookBot</p>
              <p className="text-green-400 text-[10px]">ออนไลน์ · ตอบทันที</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={clearChat} title="เริ่มการสนทนาใหม่"
                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                </svg>
              </button>
              <button onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}

            {/* Quick Replies */}
            {showQuick && !loading && messages.length === 1 && (
              <div className="pt-1">
                <p className="text-gray-600 text-[10px] mb-2 px-1">คำถามยอดนิยม</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_REPLIES.map((q) => (
                    <button key={q.label} onClick={() => sendMessage(q.text)}
                      className="text-[11px] px-2.5 py-1.5 rounded-full border border-white/15 text-gray-400 hover:border-amber-400/50 hover:text-amber-400 hover:bg-amber-400/5 transition-colors whitespace-nowrap">
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && <TypingIndicator />}

            {/* CSAT */}
            {showCsat && !loading && (
              <CsatWidget onRate={handleCsatRate} onSkip={handleCsatSkip} />
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-white/8 flex-shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="พิมพ์ข้อความ..."
                rows={1}
                style={{ resize: "none", maxHeight: "80px" }}
                className="flex-1 bg-gray-800 border border-white/10 focus:border-amber-400/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors"
                onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                className="w-9 h-9 flex-shrink-0 bg-amber-400 hover:bg-amber-300 disabled:bg-gray-700 disabled:text-gray-600 text-gray-950 rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0">
                {loading
                  ? <svg className="w-4 h-4 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                }
              </button>
            </div>
            <p className="text-gray-700 text-[10px] text-center mt-2">Powered by Groq · ShopSanook AI</p>
          </div>
        </div>
      </div>

      {/* Floating Ball */}
      <button onClick={() => setOpen((p) => !p)}
        className={`fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-2xl shadow-black/40 flex items-center justify-center transition-all duration-300 ${
          open ? "bg-gray-800 border border-white/15 scale-95" : "bg-amber-400 hover:bg-amber-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(251,191,36,0.5)]"
        }`}>
        {hasNew && !open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white animate-pulse">1</span>
        )}
        {open
          ? <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          : <svg className="w-7 h-7 text-gray-950" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        }
      </button>
    </>
  );
}