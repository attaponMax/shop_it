"use client";

// ─── ป้องกัน Hydration Error ──────────────────
// "use client" ทำให้ component นี้ render บน client เท่านั้น
// ไม่มี SSR → ไม่มี mismatch

import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase"; // ← singleton client
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie,
} from "recharts";

// ─── Helpers ──────────────────────────────────
function fmtDate(d) {
  return new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short" });
}
function fmtHour(h) { return `${String(h).padStart(2, "0")}:00`; }

function CustomTooltip({ active, payload, label, unit = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-white/10 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-amber-400 font-bold">{payload[0].value}{unit}</p>
    </div>
  );
}

function AnimatedNumber({ value, suffix = "" }) {
  const [disp, setDisp] = useState(0);
  useEffect(() => {
    const target = parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
    let cur = 0; const steps = 40; const inc = target / steps; let count = 0;
    const iv = setInterval(() => {
      count++; cur = Math.min(cur + inc, target);
      setDisp(Number.isInteger(target) ? Math.round(cur) : +cur.toFixed(2));
      if (count >= steps) clearInterval(iv);
    }, 20);
    return () => clearInterval(iv);
  }, [value]);
  return <span>{disp.toLocaleString()}{suffix}</span>;
}

function SectionHeader({ label, title }) {
  return (
    <div className="mb-5">
      <p className="text-amber-400 text-[10px] font-semibold uppercase tracking-widest mb-1">{label}</p>
      <h2 className="text-white text-base font-bold">{title}</h2>
    </div>
  );
}

const colorMap = {
  amber:   { bg: "bg-amber-400/10",   border: "border-amber-400/20",   icon: "text-amber-400" },
  green:   { bg: "bg-green-400/10",   border: "border-green-400/20",   icon: "text-green-400" },
  orange:  { bg: "bg-orange-400/10",  border: "border-orange-400/20",  icon: "text-orange-400" },
  blue:    { bg: "bg-blue-400/10",    border: "border-blue-400/20",    icon: "text-blue-400" },
  violet:  { bg: "bg-violet-400/10",  border: "border-violet-400/20",  icon: "text-violet-400" },
  emerald: { bg: "bg-emerald-400/10", border: "border-emerald-400/20", icon: "text-emerald-400" },
};

// ─── Screens ───────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <svg className="w-8 h-8 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>
  );
}

function NotLoggedIn() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-white/10 flex items-center justify-center mb-6">
          <svg className="w-9 h-9 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">เข้าสู่ระบบก่อนนะ</h1>
        <p className="text-gray-400 text-sm mb-8">กรุณาเข้าสู่ระบบเพื่อเข้าถึง Dashboard</p>
        <div className="flex gap-3 w-full">
          <a href="/login" className="flex-1 text-center bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5">เข้าสู่ระบบ</a>
          <a href="/" className="flex-1 text-center border border-white/15 hover:bg-white/5 text-white font-medium py-3 rounded-xl text-sm">กลับหน้าแรก</a>
        </div>
      </div>
    </div>
  );
}

function AccessDenied({ userData, session }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-red-500/20 flex items-center justify-center mb-6">
          <svg className="w-9 h-9 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
          </svg>
        </div>
        <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">403 — Access Denied</span>
        <h1 className="text-2xl font-bold mb-2">ไม่มีสิทธิ์เข้าถึง</h1>
        <p className="text-gray-400 text-sm mb-4">หน้านี้สำหรับ <span className="text-amber-400 font-semibold">Admin</span> เท่านั้น</p>
        <div className="w-full bg-gray-900 border border-white/10 rounded-xl p-4 text-left mb-6 text-xs space-y-2">
          <p className="text-gray-500 font-semibold uppercase tracking-wider text-[10px] mb-2">Debug Info</p>
          <div className="flex justify-between"><span className="text-gray-500">email</span><span className="text-gray-300">{session?.user?.email}</span></div>
          <div className="flex justify-between">
            <span className="text-gray-500">role</span>
            <span className={`font-semibold ${userData?.role === "admin" ? "text-green-400" : "text-red-400"}`}>
              {userData?.role ?? "ไม่พบ row ใน users table"}
            </span>
          </div>
          {userData && userData.role !== "admin" && (
            <p className="text-amber-400 text-[10px] pt-2 border-t border-white/5">
              แก้ใน Supabase: <code>UPDATE users SET role = &apos;admin&apos; WHERE email = &apos;{session?.user?.email}&apos;;</code>
            </p>
          )}
        </div>
        <button onClick={() => supabase.auth.signOut().then(() => window.location.href = "/login")}
          className="w-full bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold py-3 rounded-xl text-sm transition-all">
          Logout แล้ว Login ใหม่
        </button>
      </div>
    </div>
  );
}

// ─── Auth Guard ────────────────────────────────
export default function ChatbotDashboard() {
  const [session, setSession]     = useState(null);
  const [userData, setUserData]   = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUser(session.user.id);
      else setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) fetchUser(s.user.id);
      else { setUserData(null); setAuthLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchUser = async (id) => {
    const { data } = await supabase.from("users").select("name, role").eq("id", id).single();
    setUserData(data ?? null);
    setAuthLoading(false);
  };

  if (authLoading) return <LoadingScreen />;
  if (!session)    return <NotLoggedIn />;
  if (userData?.role !== "admin") return <AccessDenied userData={userData} session={session} />;
  return <DashboardContent session={session} userData={userData} />;
}

// ─── Dashboard Content ─────────────────────────
function DashboardContent({ userData }) {
  const RANGES = ["7 วัน", "30 วัน", "90 วัน"];
  const [range, setRange]         = useState("7 วัน");
  const [stats, setStats]         = useState(null);
  const [fetching, setFetching]   = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [activeNow, setActiveNow] = useState(0);

  // ── ใช้ state แทน new Date() ตรงๆ เพื่อป้องกัน hydration error ──
  const [nowStr, setNowStr] = useState("");
  useEffect(() => {
    const update = () =>
      setNowStr(new Date().toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" }));
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  // ── Live active sessions ──
  const fetchActive = useCallback(async () => {
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("chat_sessions")
      .select("id", { count: "exact", head: true })
      .is("ended_at", null)
      .gte("started_at", since);
    setActiveNow(count || 0);
  }, []);

  useEffect(() => {
    fetchActive();
    const t = setInterval(fetchActive, 10000);
    return () => clearInterval(t);
  }, [fetchActive]);

  // ── Main data fetch ──
  const fetchStats = useCallback(async () => {
    setFetching(true);
    setFetchError(null);
    try {
      const days  = range === "7 วัน" ? 7 : range === "30 วัน" ? 30 : 90;
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      const [r1, r2, r3, r4] = await Promise.all([
        supabase.from("chat_sessions").select("*").gte("started_at", since),
        supabase.from("chat_messages").select("created_at, response_ms, role").gte("created_at", since),
        supabase.from("chat_messages").select("intent, created_at").eq("role", "user").not("intent", "is", null).gte("created_at", since),
        supabase.from("chat_messages").select("response_ms, created_at").eq("role", "assistant").not("response_ms", "is", null).gte("created_at", since),
      ]);

      const firstError = [r1, r2, r3, r4].find((r) => r.error);
      if (firstError?.error) throw new Error(`${firstError.error.message} (code: ${firstError.error.code})`);

      const sessions     = r1.data || [];
      const responseRows = r4.data || [];
      const intentRows   = r3.data || [];

      const totalSessions  = sessions.length;
      const resolved       = sessions.filter((s) => s.resolved).length;
      const escalated      = sessions.filter((s) => s.escalated).length;
      const csatScores     = sessions.filter((s) => s.csat_score).map((s) => s.csat_score);
      const avgCsat        = csatScores.length ? (csatScores.reduce((a, b) => a + b, 0) / csatScores.length).toFixed(1) : "0";
      const resMs          = responseRows.map((r) => r.response_ms).filter(Boolean);
      const avgResponseMs  = resMs.length ? Math.round(resMs.reduce((a, b) => a + b, 0) / resMs.length) : 0;
      const resolutionRate = totalSessions ? ((resolved / totalSessions) * 100).toFixed(1) : "0";
      const escalationRate = totalSessions ? ((escalated / totalSessions) * 100).toFixed(1) : "0";
      const slaPct         = resMs.length ? Math.round((resMs.filter((ms) => ms < 2000).length / resMs.length) * 100) : 0;

      const sessionsByDay = {};
      sessions.forEach((s) => { const d = fmtDate(s.started_at); sessionsByDay[d] = (sessionsByDay[d] || 0) + 1; });
      const conversationChart = Object.entries(sessionsByDay).map(([day, value]) => ({ day, value }));

      const rsByDay = {};
      responseRows.forEach((r) => {
        const d = fmtDate(r.created_at);
        if (!rsByDay[d]) rsByDay[d] = [];
        rsByDay[d].push(r.response_ms);
      });
      const responseChart = Object.entries(rsByDay).map(([day, arr]) => ({
        day, value: +(arr.reduce((a, b) => a + b, 0) / arr.length / 1000).toFixed(2),
      }));

      const escByHour = {}; const totalByHour = {};
      sessions.filter((s) => s.escalated).forEach((s) => { const h = new Date(s.started_at).getHours(); escByHour[h] = (escByHour[h] || 0) + 1; });
      sessions.forEach((s) => { const h = new Date(s.started_at).getHours(); totalByHour[h] = (totalByHour[h] || 0) + 1; });
      const escalationChart = Array.from({ length: 12 }, (_, i) => {
        const h = i * 2;
        return { hour: String(h).padStart(2, "0"), rate: totalByHour[h] ? Math.round(((escByHour[h] || 0) / totalByHour[h]) * 100) : 0 };
      });

      const intentCount = {};
      intentRows.forEach((r) => { intentCount[r.intent] = (intentCount[r.intent] || 0) + 1; });
      const topIntents = Object.entries(intentCount)
        .sort((a, b) => b[1] - a[1]).slice(0, 7)
        .map(([intent, count], i, arr) => ({ intent, count, pct: Math.round((count / arr[0][1]) * 100) }));

      const csatDist = [
        { label: "ดีมาก 😄", score: 5, color: "#4ade80" },
        { label: "ดี 🙂",     score: 4, color: "#fbbf24" },
        { label: "พอใช้ 😐",  score: 3, color: "#94a3b8" },
        { label: "แย่ 😞",    score: 2, color: "#f87171" },
        { label: "แย่มาก 😡", score: 1, color: "#ef4444" },
      ].map((c) => {
        const cnt = csatScores.filter((s) => s === c.score).length;
        return { ...c, value: csatScores.length ? Math.round((cnt / csatScores.length) * 100) : 0 };
      });

      setStats({ kpi: { totalSessions, resolutionRate, escalationRate, avgCsat, avgResponseMs, slaPct }, conversationChart, responseChart, escalationChart, topIntents, csatDist, csatCount: csatScores.length });
    } catch (err) {
      console.error("fetchStats:", err);
      setFetchError(err.message);
    } finally {
      setFetching(false);
    }
  }, [range]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const kpiCards = stats ? [
    { key: "conv",     label: "สนทนาทั้งหมด",       value: stats.kpi.totalSessions,                       suffix: "",   color: "amber",   icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
    { key: "res",      label: "แก้ปัญหาสำเร็จ",      value: parseFloat(stats.kpi.resolutionRate),          suffix: "%",  color: "green",   icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { key: "esc",      label: "ส่งต่อ agent",         value: parseFloat(stats.kpi.escalationRate),          suffix: "%",  color: "orange",  icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { key: "csat",     label: "CSAT Score",           value: parseFloat(stats.kpi.avgCsat) || 0,            suffix: "/5", color: "blue",    icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { key: "resp",     label: "Response Time เฉลี่ย", value: +(stats.kpi.avgResponseMs / 1000).toFixed(2),  suffix: "s",  color: "violet",  icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { key: "active",   label: "กำลังสนทนาอยู่",       value: activeNow,                                     suffix: "",   color: "emerald", live: true, icon: "M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M9 10a3 3 0 106 0 3 3 0 00-6 0z" },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <a href="/" className="hover:text-amber-400 transition-colors">หน้าแรก</a>
              <span>/</span><span className="text-gray-300">Chatbot Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </span>
              Chatbot KPI Dashboard
              <span className="text-[10px] font-semibold bg-amber-400/10 border border-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full">Admin</span>
            </h1>
            {/* nowStr ใส่ใน useEffect ป้องกัน hydration */}
            <p className="text-gray-500 text-xs mt-1">
              {nowStr ? `อัปเดตล่าสุด: ${nowStr}` : ""} · {userData?.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchStats} disabled={fetching}
              className="w-9 h-9 flex items-center justify-center bg-gray-900 border border-white/8 hover:border-amber-400/30 text-gray-400 hover:text-amber-400 rounded-xl transition-colors disabled:opacity-50">
              <svg className={`w-4 h-4 ${fetching ? "animate-spin" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
            <div className="flex items-center gap-1 bg-gray-900 border border-white/8 rounded-xl p-1">
              {RANGES.map((r) => (
                <button key={r} onClick={() => setRange(r)}
                  className={`text-xs px-4 py-2 rounded-lg font-semibold transition-all ${range === r ? "bg-amber-400 text-gray-950" : "text-gray-400 hover:text-white"}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {fetchError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
            </svg>
            <div>
              <p className="text-red-400 text-sm font-semibold">โหลดข้อมูลไม่สำเร็จ</p>
              <p className="text-red-300/70 text-xs mt-0.5 font-mono">{fetchError}</p>
              <p className="text-gray-500 text-xs mt-1">ตรวจสอบว่ารัน chatbot_analytics_schema.sql และ fix_chat_rls.sql แล้วหรือยัง</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {fetching && !stats && !fetchError && (
          <div className="flex items-center justify-center py-24">
            <svg className="w-8 h-8 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
        )}

        {/* Empty */}
        {stats && stats.kpi.totalSessions === 0 && !fetchError && (
          <div className="bg-gray-900 border border-white/8 rounded-2xl px-6 py-12 text-center mb-8">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-white font-semibold mb-1">ยังไม่มีข้อมูล Chatbot</p>
            <p className="text-gray-500 text-sm">เริ่มใช้งาน SanookBot แล้วข้อมูลจะปรากฏที่นี่อัตโนมัติ</p>
          </div>
        )}

        {stats && stats.kpi.totalSessions > 0 && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {kpiCards.map((card) => {
                const c = colorMap[card.color];
                return (
                  <div key={card.key} className="bg-gray-900 border border-white/8 rounded-2xl p-4 hover:border-white/15 transition-all relative overflow-hidden">
                    <div className={`absolute -top-4 -right-4 w-16 h-16 ${c.bg} rounded-full blur-xl pointer-events-none`}/>
                    <div className={`w-8 h-8 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-3 ${c.icon}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={card.icon}/>
                      </svg>
                    </div>
                    <p className="text-gray-500 text-[10px] mb-0.5">{card.label}</p>
                    <p className="text-white text-lg font-bold leading-tight mb-1">
                      <AnimatedNumber value={card.value} suffix={card.suffix}/>
                    </p>
                    {card.live && (
                      <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/>Live
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-900 border border-white/8 rounded-2xl p-5">
                <SectionHeader label="Volume" title="จำนวน Sessions รายวัน"/>
                {stats.conversationChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={stats.conversationChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.25}/><stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08"/>
                      <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false}/>
                      <Tooltip content={<CustomTooltip unit=" sessions"/>}/>
                      <Area type="monotone" dataKey="value" stroke="#fbbf24" strokeWidth={2} fill="url(#convGrad)" dot={false} activeDot={{ r: 4, fill: "#fbbf24" }}/>
                    </AreaChart>
                  </ResponsiveContainer>
                ) : <div className="h-[200px] flex items-center justify-center text-gray-600 text-sm">ยังไม่มีข้อมูล</div>}
              </div>

              <div className="bg-gray-900 border border-white/8 rounded-2xl p-5">
                <SectionHeader label="Latency" title="Avg. Response Time (วินาที)"/>
                {stats.responseChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={stats.responseChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08"/>
                      <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false}/>
                      <Tooltip content={<CustomTooltip unit="s"/>}/>
                      <Line type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#a78bfa" }}/>
                    </LineChart>
                  </ResponsiveContainer>
                ) : <div className="h-[200px] flex items-center justify-center text-gray-600 text-sm">ยังไม่มีข้อมูล</div>}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-400 rounded-full" style={{ width: `${stats.kpi.slaPct}%` }}/>
                  </div>
                  <span className="text-[10px] text-gray-500">SLA &lt;2s: <span className="text-violet-400 font-semibold">{stats.kpi.slaPct}%</span></span>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-900 border border-white/8 rounded-2xl p-5">
                <SectionHeader label="Satisfaction" title={`CSAT Score (${stats.csatCount} ratings)`}/>
                {stats.csatCount > 0 ? (
                  <div className="flex items-center gap-6">
                    <div className="relative shrink-0">
                      <PieChart width={140} height={140}>
                        <Pie data={stats.csatDist.filter((d) => d.value > 0)} cx={65} cy={65} innerRadius={42} outerRadius={62} paddingAngle={3} dataKey="value" stroke="none">
                          {stats.csatDist.map((e, i) => <Cell key={i} fill={e.color}/>)}
                        </Pie>
                      </PieChart>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <p className="text-white text-xl font-bold">{stats.kpi.avgCsat}</p>
                        <p className="text-gray-500 text-[10px]">/ 5.0</p>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2.5">
                      {stats.csatDist.map((d) => (
                        <div key={d.label} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }}/>
                          <span className="text-gray-400 text-xs flex-1">{d.label}</span>
                          <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${d.value}%`, backgroundColor: d.color }}/>
                          </div>
                          <span className="text-gray-400 text-xs w-8 text-right">{d.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : <div className="h-[140px] flex items-center justify-center text-gray-600 text-sm">ยังไม่มีการให้คะแนน</div>}
              </div>

              <div className="bg-gray-900 border border-white/8 rounded-2xl p-5">
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <p className="text-amber-400 text-[10px] font-semibold uppercase tracking-widest mb-1">Escalation</p>
                    <h2 className="text-white text-base font-bold">Escalation รายชั่วโมง</h2>
                  </div>
                  <span className="text-xs text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2.5 py-1 rounded-full font-semibold">{stats.kpi.escalationRate}% avg</span>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={stats.escalationChart} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false}/>
                    <XAxis dataKey="hour" tick={{ fill: "#6b7280", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={fmtHour}/>
                    <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`}/>
                    <Tooltip content={<CustomTooltip unit="%"/>}/>
                    <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                      {stats.escalationChart.map((e, i) => (
                        <Cell key={i} fill={e.rate >= 20 ? "#fb923c" : e.rate >= 14 ? "#fbbf24" : "#4b5563"}/>
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              <div className="lg:col-span-2 bg-gray-900 border border-white/8 rounded-2xl p-5">
                <SectionHeader label="Intents" title="Top Intents / คำถามยอดนิยม"/>
                {stats.topIntents.length > 0 ? (
                  <div className="space-y-3">
                    {stats.topIntents.map((item, i) => (
                      <div key={item.intent} className="flex items-center gap-3 group">
                        <span className={`text-[10px] font-bold w-5 text-center shrink-0 ${i === 0 ? "text-amber-400" : "text-gray-600"}`}>#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-gray-300 text-xs font-medium truncate group-hover:text-white transition-colors">{item.intent}</p>
                            <span className="text-gray-500 text-[10px] ml-2 shrink-0">{item.count.toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-700 ${i === 0 ? "bg-amber-400" : "bg-gray-600"}`} style={{ width: `${item.pct}%` }}/>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <div className="py-8 text-center text-gray-600 text-sm">ยังไม่มีข้อมูล intent</div>}
              </div>

              <div className="bg-gray-900 border border-white/8 rounded-2xl p-5 flex flex-col">
                <SectionHeader label="Outcome" title="Resolution Rate"/>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative w-36 h-36 mb-4">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#1f2937" strokeWidth="12"/>
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#fbbf24" strokeWidth="12"
                        strokeDasharray={`${2 * Math.PI * 50 * (parseFloat(stats.kpi.resolutionRate) / 100)} ${2 * Math.PI * 50}`}
                        strokeLinecap="round"/>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-white text-2xl font-bold">{stats.kpi.resolutionRate}%</p>
                      <p className="text-gray-500 text-[10px]">resolved</p>
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    {[
                      { label: "Resolved by bot",    value: `${stats.kpi.resolutionRate}%`, color: "bg-amber-400" },
                      { label: "Escalated to agent", value: `${stats.kpi.escalationRate}%`, color: "bg-orange-400" },
                    ].map((r) => (
                      <div key={r.label} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${r.color}`}/>
                        <span className="text-gray-400 text-xs flex-1">{r.label}</span>
                        <span className="text-white text-xs font-semibold">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 bg-gray-800/50 border border-white/5 rounded-xl px-3 py-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-gray-500 text-[10px]">เป้าหมาย 90%</span>
                    <span className={`text-[10px] font-semibold ${parseFloat(stats.kpi.resolutionRate) >= 90 ? "text-green-400" : "text-amber-400"}`}>
                      {parseFloat(stats.kpi.resolutionRate) >= 90 ? "✓ บรรลุเป้า" : `${Math.round((parseFloat(stats.kpi.resolutionRate) / 90) * 100)}% ของเป้า`}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-green-400 rounded-full"
                      style={{ width: `${Math.min((parseFloat(stats.kpi.resolutionRate) / 90) * 100, 100)}%` }}/>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <p className="text-center text-gray-700 text-[10px] mt-8">
          Real-time data from Supabase · ShopSanook Chatbot Dashboard © 2026
        </p>
      </div>
    </div>
  );
}