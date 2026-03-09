"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────

const RANGES = ["7 วัน", "30 วัน", "90 วัน"];

const conversationData = {
  "7 วัน": [
    { day: "จ", value: 312 }, { day: "อ", value: 428 }, { day: "พ", value: 389 },
    { day: "พฤ", value: 512 }, { day: "ศ", value: 601 }, { day: "ส", value: 447 }, { day: "อา", value: 298 },
  ],
  "30 วัน": Array.from({ length: 30 }, (_, i) => ({ day: `${i + 1}`, value: Math.floor(280 + Math.random() * 400) })),
  "90 วัน": Array.from({ length: 12 }, (_, i) => ({ day: `W${i + 1}`, value: Math.floor(1800 + Math.random() * 2000) })),
};

const responseTimeData = {
  "7 วัน": [
    { day: "จ", value: 1.2 }, { day: "อ", value: 0.9 }, { day: "พ", value: 1.4 },
    { day: "พฤ", value: 0.8 }, { day: "ศ", value: 1.1 }, { day: "ส", value: 0.7 }, { day: "อา", value: 0.6 },
  ],
  "30 วัน": Array.from({ length: 30 }, (_, i) => ({ day: `${i + 1}`, value: +(0.6 + Math.random() * 1.2).toFixed(2) })),
  "90 วัน": Array.from({ length: 12 }, (_, i) => ({ day: `W${i + 1}`, value: +(0.7 + Math.random() * 0.9).toFixed(2) })),
};

const csatData = [
  { label: "ดีมาก 😄", value: 52, color: "#4ade80" },
  { label: "ดี 🙂", value: 28, color: "#fbbf24" },
  { label: "พอใช้ 😐", value: 13, color: "#94a3b8" },
  { label: "แย่ 😞", value: 7, color: "#f87171" },
];

const topIntents = [
  { intent: "สอบถามสถานะพัสดุ", count: 2841, pct: 100 },
  { intent: "ติดต่อขอคืนสินค้า", count: 1923, pct: 68 },
  { intent: "สอบถามราคา / โปรโมชัน", count: 1654, pct: 58 },
  { intent: "ปัญหาการชำระเงิน", count: 1102, pct: 39 },
  { intent: "ถามสต๊อกสินค้า", count: 874, pct: 31 },
  { intent: "แนะนำสินค้า", count: 743, pct: 26 },
  { intent: "ยกเลิกคำสั่งซื้อ", count: 612, pct: 22 },
];

const hourlyEscalation = [
  { hour: "00", rate: 4 }, { hour: "02", rate: 3 }, { hour: "04", rate: 2 },
  { hour: "06", rate: 5 }, { hour: "08", rate: 11 }, { hour: "10", rate: 18 },
  { hour: "12", rate: 22 }, { hour: "14", rate: 19 }, { hour: "16", rate: 24 },
  { hour: "18", rate: 20 }, { hour: "20", rate: 14 }, { hour: "22", rate: 8 },
];

const kpiCards = [
  {
    key: "conversations",
    label: "Conversations",
    sublabel: "สนทนาทั้งหมด",
    value: "12,847",
    delta: "+18.4%",
    deltaUp: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    color: "amber",
  },
  {
    key: "resolution",
    label: "Resolution Rate",
    sublabel: "แก้ปัญหาสำเร็จ",
    value: "87.3%",
    delta: "+2.1%",
    deltaUp: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "green",
  },
  {
    key: "escalation",
    label: "Escalation Rate",
    sublabel: "ส่งต่อ human agent",
    value: "12.7%",
    delta: "-1.3%",
    deltaUp: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: "orange",
  },
  {
    key: "csat",
    label: "CSAT Score",
    sublabel: "ความพึงพอใจ",
    value: "4.3 / 5",
    delta: "+0.2",
    deltaUp: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "blue",
  },
  {
    key: "response",
    label: "Avg. Response",
    sublabel: "เวลาตอบเฉลี่ย",
    value: "0.94s",
    delta: "-0.18s",
    deltaUp: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "violet",
  },
  {
    key: "active",
    label: "Active Now",
    sublabel: "กำลังสนทนาอยู่",
    value: "34",
    delta: "Live",
    deltaUp: true,
    live: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M9 10a3 3 0 106 0 3 3 0 00-6 0z" />
      </svg>
    ),
    color: "emerald",
  },
];

const colorMap = {
  amber: { bg: "bg-amber-400/10", border: "border-amber-400/20", icon: "text-amber-400", delta: "text-amber-400" },
  green: { bg: "bg-green-400/10", border: "border-green-400/20", icon: "text-green-400", delta: "text-green-400" },
  orange: { bg: "bg-orange-400/10", border: "border-orange-400/20", icon: "text-orange-400", delta: "text-orange-400" },
  blue: { bg: "bg-blue-400/10", border: "border-blue-400/20", icon: "text-blue-400", delta: "text-blue-400" },
  violet: { bg: "bg-violet-400/10", border: "border-violet-400/20", icon: "text-violet-400", delta: "text-violet-400" },
  emerald: { bg: "bg-emerald-400/10", border: "border-emerald-400/20", icon: "text-emerald-400", delta: "text-emerald-400" },
};

// ─── Custom Tooltip ────────────────────────────────────────────
function CustomTooltip({ active, payload, label, unit = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-white/10 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-amber-400 font-bold">{payload[0].value}{unit}</p>
    </div>
  );
}

// ─── Animated Counter ─────────────────────────────────────────
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) { setDisplay(value); return; }
    let start = 0;
    const steps = 40;
    const step = num / steps;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      start = Math.min(start + step, num);
      const formatted = value.includes(",")
        ? Math.round(start).toLocaleString()
        : value.includes(".")
          ? start.toFixed(value.split(".")[1]?.replace(/[^0-9]/g, "").length || 1)
          : Math.round(start).toString();
      setDisplay(value.replace(/[0-9,./]+/, formatted));
      if (count >= steps) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [value]);
  return <span>{display}</span>;
}

// ─── Section Header ────────────────────────────────────────────
function SectionHeader({ label, title }) {
  return (
    <div className="mb-5">
      <p className="text-amber-400 text-[10px] font-semibold uppercase tracking-widest mb-1">{label}</p>
      <h2 className="text-white text-base font-bold">{title}</h2>
    </div>
  );
}

// ─── Mock Auth ────────────────────────────────────────────────
// เปลี่ยนเป็น true เพื่อจำลอง login / false เพื่อทดสอบ redirect
const MOCK_IS_LOGGED_IN = true;
const MOCK_USER = { name: "สมชาย ใจดี", email: "somchai@email.com", role: "admin" };
// เปลี่ยนเป็น false เพื่อทดสอบ user ที่ไม่ใช่ admin
const MOCK_IS_ADMIN = MOCK_USER.role === "admin";

// ─── Not Logged In Screen ─────────────────────────────────────
function NotLoggedIn() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-white/10 flex items-center justify-center mb-6">
          <svg className="w-9 h-9 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">เข้าสู่ระบบก่อนนะ</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          กรุณาเข้าสู่ระบบเพื่อเข้าถึง Dashboard
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <a href="/login" className="flex-1 text-center bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(251,191,36,0.3)]">
            เข้าสู่ระบบ
          </a>
          <a href="/" className="flex-1 text-center border border-white/15 hover:bg-white/5 text-white font-medium py-3 rounded-xl text-sm transition-colors">
            กลับหน้าแรก
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Access Denied Screen ─────────────────────────────────────
function AccessDenied() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-red-500/20 flex items-center justify-center mb-6">
          <svg className="w-9 h-9 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          403 — Access Denied
        </span>
        <h1 className="text-2xl font-bold text-white mb-2">ไม่มีสิทธิ์เข้าถึง</h1>
        <p className="text-gray-400 text-sm mb-2 leading-relaxed">
          หน้านี้สำหรับ <span className="text-amber-400 font-semibold">Admin</span> เท่านั้น
        </p>
        <p className="text-gray-600 text-xs mb-8">
          logged in as: <span className="text-gray-400">{MOCK_USER.name}</span> · role: <span className="text-gray-400">{MOCK_USER.role}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <a href="/" className="flex-1 text-center bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(251,191,36,0.3)]">
            กลับหน้าแรก
          </a>
          <a href="/contact" className="flex-1 text-center border border-white/15 hover:bg-white/5 text-white font-medium py-3 rounded-xl text-sm transition-colors">
            ติดต่อ Admin
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────
// Auth + Role guard — render ก่อน hooks ทำงานใน DashboardContent
export default function ChatbotDashboard() {
  if (!MOCK_IS_LOGGED_IN) return <NotLoggedIn />;
  if (!MOCK_IS_ADMIN) return <AccessDenied />;
  return <DashboardContent />;
}

function DashboardContent() {
  const [range, setRange] = useState("7 วัน");
  const [now, setNow] = useState("");
  const [activeNow, setActiveNow] = useState(34);

  useEffect(() => {
    const update = () => setNow(new Date().toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" }));
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  // simulate live active count
  useEffect(() => {
    const t = setInterval(() => {
      setActiveNow((v) => Math.max(20, Math.min(60, v + Math.round((Math.random() - 0.48) * 3))));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const liveKpiCards = kpiCards.map((c) =>
    c.key === "active" ? { ...c, value: String(activeNow) } : c
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ─── Page Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <a href="/" className="hover:text-amber-400 transition-colors">หน้าแรก</a>
              <span>/</span>
              <span className="text-gray-300">Chatbot Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              Chatbot KPI Dashboard
              <span className="text-[10px] font-semibold bg-amber-400/10 border border-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full ml-1">
                Admin
              </span>
            </h1>
            <p className="text-gray-500 text-xs mt-1">
              อัปเดตล่าสุด: {now} · {MOCK_USER.name}
            </p>
          </div>

          {/* Range selector */}
          <div className="flex items-center gap-1 bg-gray-900 border border-white/8 rounded-xl p-1">
            {RANGES.map((r) => (
              <button key={r} onClick={() => setRange(r)}
                className={`text-xs px-4 py-2 rounded-lg font-semibold transition-all ${
                  range === r
                    ? "bg-amber-400 text-gray-950 shadow"
                    : "text-gray-400 hover:text-white"
                }`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* ─── KPI Cards ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {liveKpiCards.map((card) => {
            const c = colorMap[card.color];
            return (
              <div key={card.key}
                className={`bg-gray-900 border border-white/8 rounded-2xl p-4 hover:border-white/15 transition-all group relative overflow-hidden`}>
                {/* glow */}
                <div className={`absolute -top-4 -right-4 w-16 h-16 ${c.bg} rounded-full blur-xl pointer-events-none`} />

                <div className={`w-8 h-8 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-3 ${c.icon}`}>
                  {card.icon}
                </div>

                <p className="text-gray-500 text-[10px] mb-0.5">{card.sublabel}</p>
                <p className="text-white text-lg font-bold leading-tight mb-1">
                  {card.key === "active" ? activeNow : <AnimatedNumber value={card.value} />}
                </p>

                <div className="flex items-center gap-1">
                  {card.live ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-semibold">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      Live
                    </span>
                  ) : (
                    <span className={`text-[10px] font-semibold ${card.deltaUp ? "text-green-400" : "text-red-400"}`}>
                      {card.deltaUp ? "↑" : "↓"} {card.delta}
                    </span>
                  )}
                  <span className="text-gray-600 text-[10px]">vs ช่วงก่อน</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Row 1: Conversations + Response Time ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* Conversations */}
          <div className="bg-gray-900 border border-white/8 rounded-2xl p-5">
            <SectionHeader label="Volume" title="จำนวน Conversations" />
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={conversationData[range]} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip unit=" sessions" />} />
                <Area type="monotone" dataKey="value" stroke="#fbbf24" strokeWidth={2}
                  fill="url(#convGrad)" dot={false} activeDot={{ r: 4, fill: "#fbbf24" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Response Time */}
          <div className="bg-gray-900 border border-white/8 rounded-2xl p-5">
            <SectionHeader label="Latency" title="Avg. Response Time" />
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={responseTimeData[range]} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 2.5]} />
                <Tooltip content={<CustomTooltip unit="s" />} />
                <Line type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={2}
                  dot={false} activeDot={{ r: 4, fill: "#a78bfa" }} />
              </LineChart>
            </ResponsiveContainer>
            {/* SLA indicator */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-violet-400 rounded-full" style={{ width: "94%" }} />
              </div>
              <span className="text-[10px] text-gray-500">SLA &lt;2s: <span className="text-violet-400 font-semibold">94%</span></span>
            </div>
          </div>
        </div>

        {/* ─── Row 2: CSAT + Escalation Heatmap ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* CSAT */}
          <div className="bg-gray-900 border border-white/8 rounded-2xl p-5">
            <SectionHeader label="Satisfaction" title="CSAT Score Distribution" />
            <div className="flex items-center gap-6">
              {/* Donut */}
              <div className="relative shrink-0">
                <PieChart width={140} height={140}>
                  <Pie data={csatData} cx={65} cy={65} innerRadius={42} outerRadius={62}
                    paddingAngle={3} dataKey="value" stroke="none">
                    {csatData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-white text-xl font-bold">4.3</p>
                  <p className="text-gray-500 text-[10px]">/ 5.0</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-2.5">
                {csatData.map((d) => (
                  <div key={d.label} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-gray-400 text-xs flex-1">{d.label}</span>
                    <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${d.value}%`, backgroundColor: d.color }} />
                    </div>
                    <span className="text-gray-400 text-xs w-8 text-right">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Escalation by hour */}
          <div className="bg-gray-900 border border-white/8 rounded-2xl p-5">
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="text-amber-400 text-[10px] font-semibold uppercase tracking-widest mb-1">Escalation</p>
                <h2 className="text-white text-base font-bold">Escalation Rate รายชั่วโมง</h2>
              </div>
              <span className="text-xs text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2.5 py-1 rounded-full font-semibold">
                12.7% avg
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={hourlyEscalation} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="hour" tick={{ fill: "#6b7280", fontSize: 9 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${v}:00`} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip unit="%" />} />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                  {hourlyEscalation.map((entry, i) => (
                    <Cell key={i} fill={entry.rate >= 20 ? "#fb923c" : entry.rate >= 14 ? "#fbbf24" : "#4b5563"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3 text-[10px]">
              {[{ color: "#fb923c", label: "สูง (≥20%)" }, { color: "#fbbf24", label: "กลาง (14–19%)" }, { color: "#4b5563", label: "ปกติ" }].map((l) => (
                <span key={l.label} className="flex items-center gap-1 text-gray-500">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Row 3: Top Intents + Resolution ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

          {/* Top Intents */}
          <div className="lg:col-span-2 bg-gray-900 border border-white/8 rounded-2xl p-5">
            <SectionHeader label="Intents" title="Top Intents / คำถามยอดนิยม" />
            <div className="space-y-3">
              {topIntents.map((item, i) => (
                <div key={item.intent} className="flex items-center gap-3 group">
                  <span className={`text-[10px] font-bold w-5 text-center shrink-0 ${i === 0 ? "text-amber-400" : "text-gray-600"}`}>
                    #{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-gray-300 text-xs font-medium truncate group-hover:text-white transition-colors">
                        {item.intent}
                      </p>
                      <span className="text-gray-500 text-[10px] ml-2 shrink-0">{item.count.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${i === 0 ? "bg-amber-400" : "bg-gray-600"}`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution Rate */}
          <div className="bg-gray-900 border border-white/8 rounded-2xl p-5 flex flex-col">
            <SectionHeader label="Outcome" title="Resolution Rate" />

            {/* Big gauge */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 mb-4">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#1f2937" strokeWidth="12" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#fbbf24" strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 50 * 0.873} ${2 * Math.PI * 50}`}
                    strokeLinecap="round" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f87171" strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 50 * 0.127} ${2 * Math.PI * 50}`}
                    strokeDashoffset={`${-2 * Math.PI * 50 * 0.873}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-white text-2xl font-bold">87.3%</p>
                  <p className="text-gray-500 text-[10px]">resolved</p>
                </div>
              </div>

              <div className="w-full space-y-2">
                {[
                  { label: "Resolved by bot", value: "87.3%", color: "bg-amber-400" },
                  { label: "Escalated to agent", value: "12.7%", color: "bg-red-400" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${r.color}`} />
                    <span className="text-gray-400 text-xs flex-1">{r.label}</span>
                    <span className="text-white text-xs font-semibold">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target */}
            <div className="mt-4 bg-gray-800/50 border border-white/5 rounded-xl px-3 py-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-gray-500 text-[10px]">เป้าหมายเดือนนี้</span>
                <span className="text-green-400 text-[10px] font-semibold">90%</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-green-400 rounded-full" style={{ width: "97%" }} />
              </div>
              <p className="text-gray-600 text-[10px] mt-1">ความคืบหน้า 97% ของเป้า</p>
            </div>
          </div>
        </div>

        {/* ─── Footer note ─── */}
        <p className="text-center text-gray-700 text-[10px] mt-8">
          ข้อมูลจำลองเพื่อ demo เท่านั้น · ShopSanook Chatbot Dashboard © 2026
        </p>
      </div>
    </div>
  );
}