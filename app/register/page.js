"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase Client ──────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function PasswordStrength({ password }) {
  const checks = [
    { label: "อย่างน้อย 8 ตัวอักษร", pass: password.length >= 8 },
    { label: "ตัวพิมพ์ใหญ่ (A-Z)", pass: /[A-Z]/.test(password) },
    { label: "ตัวเลข (0-9)", pass: /[0-9]/.test(password) },
    { label: "อักขระพิเศษ (!@#$)", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const levels = [
    { label: "", color: "bg-white/10" },
    { label: "อ่อน", color: "bg-red-500" },
    { label: "พอใช้", color: "bg-orange-400" },
    { label: "ดี", color: "bg-yellow-400" },
    { label: "แข็งแกร่ง", color: "bg-green-400" },
  ];
  const level = levels[score];
  if (!password) return null;
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= score ? level.color : "bg-white/10"}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {checks.map((c) => (
            <span key={c.label} className={`flex items-center gap-1 text-[10px] transition-colors ${c.pass ? "text-green-400" : "text-gray-600"}`}>
              {c.pass
                ? <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                : <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
              }
              {c.label}
            </span>
          ))}
        </div>
        {level.label && (
          <span className={`text-[10px] font-semibold ${level.color.replace("bg-", "text-")}`}>{level.label}</span>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "", agree: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  // ── เพิ่ม: global error และ success state ──
  const [globalError, setGlobalError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setGlobalError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "กรุณากรอกชื่อ";
    if (!form.lastName.trim()) errs.lastName = "กรุณากรอกนามสกุล";
    if (!form.email.trim()) errs.email = "กรุณากรอกอีเมล";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (!form.password) errs.password = "กรุณากรอกรหัสผ่าน";
    else if (form.password.length < 8) errs.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
    if (!form.confirmPassword) errs.confirmPassword = "กรุณายืนยันรหัสผ่าน";
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    if (!form.agree) errs.agree = "กรุณายอมรับเงื่อนไขการใช้งาน";
    return errs;
  };

  // ── เพิ่ม: Google Sign Up ─────────────────────────────────────
  const handleGoogleSignUp = async () => {
    setGlobalError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // ส่ง role: 'user' ไปด้วยผ่าน metadata
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) setGlobalError("ไม่สามารถเชื่อมต่อ Google ได้ กรุณาลองใหม่อีกครั้ง");
  };

  // ── แก้ไข: handleSubmit เชื่อม Supabase ──────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsLoading(true);
    try {
      // 1. สมัครด้วย Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: `${form.firstName} ${form.lastName}`,
            avatar_url: null,
          },
        },
      });

      if (signUpError) {
        // แปล error message เป็นภาษาไทย
        if (signUpError.message.includes("already registered")) {
          setErrors((prev) => ({ ...prev, email: "อีเมลนี้มีบัญชีอยู่แล้ว" }));
        } else {
          setGlobalError(signUpError.message);
        }
        return;
      }

      // 2. Insert ข้อมูลเพิ่มเติมลง users table — role บังคับเป็น 'user'
      if (data.user) {
        const { error: insertError } = await supabase.from("users").insert({
          id: data.user.id,
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          role: "user",            // ← บังคับ user เสมอ ห้าม admin สมัครเอง
          email_verified: null,    // รอยืนยันอีเมล
        });

        if (insertError) {
          // ถ้า user มีอยู่แล้วใน table ไม่ถือว่า error
          if (!insertError.message.includes("duplicate")) {
            setGlobalError("สร้างโปรไฟล์ไม่สำเร็จ กรุณาติดต่อ support");
            return;
          }
        }
      }

      // 3. แสดง success — แจ้งให้ยืนยันอีเมล
      setSuccess(true);

    } catch {
      setGlobalError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = "w-full bg-gray-900 border rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 outline-none transition-colors";
  const inputNormal = `${inputBase} border-white/10 focus:border-amber-400`;
  const inputError  = `${inputBase} border-red-500/60 focus:border-red-500`;

  // ── Success Screen ────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 bg-green-400/10 border border-green-400/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">ยืนยันอีเมลของคุณ</h2>
          <p className="text-gray-400 text-sm mb-2">
            เราส่งลิงก์ยืนยันไปที่
          </p>
          <p className="text-amber-400 font-semibold text-sm mb-6">{form.email}</p>
          <p className="text-gray-500 text-xs mb-8">
            กรุณาเปิดอีเมลและกดลิงก์ยืนยันเพื่อเริ่มใช้งาน SmartTech ของเรา หากไม่พบอีเมลในกล่องจดหมายหลัก โปรดตรวจสอบโฟลเดอร์สแปมหรือโฟลเดอร์โปรโมชั่นด้วยนะครับ
          </p>
          <Link href="/login"
            className="w-full inline-block bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5">
            ไปหน้าเข้าสู่ระบบ
          </Link>
          <p className="text-gray-600 text-xs mt-4">
            ไม่ได้รับอีเมล?{" "}
            <button
              onClick={() => supabase.auth.resend({ type: "signup", email: form.email })}
              className="text-amber-400 hover:text-amber-300 transition-colors">
              ส่งอีกครั้ง
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">

      {/* ─── LEFT PANEL ─── */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 relative overflow-hidden p-12">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=900&q=80" alt="bg"
            className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950/85 to-gray-900/60" />
        </div>
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-gray-950 font-bold text-xl">S</div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">SmartTech</p>
            <p className="text-amber-400 text-[10px] tracking-widest uppercase font-medium">IT & Gaming Store</p>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">สมัครสมาชิกฟรี</p>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            เริ่มต้น<br />
            <span className="text-amber-400">ช้อปสนุก</span><br />
            วันนี้เลย
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            สมัครสมาชิกเพื่อรับสิทธิ์พิเศษ โปรโมชั่นเอกสิทธิ์ และติดตามออเดอร์ได้ทุกที่ทุกเวลา
          </p>
          <div className="mt-8 space-y-3">
            {[
              { icon: "🎁", title: "รับส่วนลด 100 บาท", desc: "สำหรับการสั่งซื้อครั้งแรก" },
              { icon: "⚡", title: "Flash Sale ก่อนใคร", desc: "รับแจ้งเตือนดีลพิเศษก่อนคนอื่น" },
              { icon: "🔄", title: "ติดตามออเดอร์ real-time", desc: "รู้ทุกสถานะการจัดส่ง" },
            ].map((b) => (
              <div key={b.title} className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{b.icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{b.title}</p>
                  <p className="text-gray-500 text-xs">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-gray-600 text-xs">© 2026 SmartTech. All rights reserved.</p>
      </div>

      {/* ─── RIGHT PANEL — form ─── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 overflow-y-auto">

        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-gray-950 font-bold text-lg">S</div>
          <div>
            <p className="text-white font-bold text-base leading-tight">SmartTech</p>
            <p className="text-amber-400 text-[10px] tracking-widest uppercase">IT & Gaming Store</p>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto lg:mx-0">
          <h2 className="text-2xl font-bold text-white mb-1">สร้างบัญชีใหม่</h2>
          <p className="text-gray-400 text-sm mb-6">
            มีบัญชีอยู่แล้ว?{" "}
            <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">เข้าสู่ระบบ</Link>
          </p>

          {/* ── เพิ่ม: Global Error Banner ── */}
          {globalError && (
            <div className="mb-4 flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <p className="text-red-400 text-xs">{globalError}</p>
            </div>
          )}

          {/* Google signup — ── แก้: เรียก handleGoogleSignUp ── */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleGoogleSignUp}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 border border-white/10 hover:border-white/25 text-white text-sm py-2.5 rounded-xl transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-gray-600 text-xs">หรือสมัครด้วยอีเมล</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">ชื่อ <span className="text-red-400">*</span></label>
                <input type="text" value={form.firstName} onChange={set("firstName")} placeholder="สมชาย"
                  className={errors.firstName ? inputError : inputNormal} />
                {errors.firstName && <p className="text-red-400 text-[10px] mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">นามสกุล <span className="text-red-400">*</span></label>
                <input type="text" value={form.lastName} onChange={set("lastName")} placeholder="ใจดี"
                  className={errors.lastName ? inputError : inputNormal} />
                {errors.lastName && <p className="text-red-400 text-[10px] mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">อีเมล <span className="text-red-400">*</span></label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <input type="email" value={form.email} onChange={set("email")} placeholder="example@email.com"
                  className={`${errors.email ? inputError : inputNormal} pl-10`} />
              </div>
              {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">เบอร์โทรศัพท์ <span className="text-gray-600 text-[10px]">(ไม่บังคับ)</span></label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.86a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
                  </svg>
                </div>
                <input type="tel" value={form.phone} onChange={set("phone")} placeholder="08X-XXX-XXXX"
                  className={`${inputNormal} pl-10`} />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">รหัสผ่าน <span className="text-red-400">*</span></label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={set("password")}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  className={`${errors.password ? inputError : inputNormal} pl-10 pr-11`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPassword
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-[10px] mt-1">{errors.password}</p>}
              <PasswordStrength password={form.password} />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">ยืนยันรหัสผ่าน <span className="text-red-400">*</span></label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={set("confirmPassword")}
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                  className={`${errors.confirmPassword ? inputError : inputNormal} pl-10 pr-11`} />
                {form.confirmPassword && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    {form.password === form.confirmPassword
                      ? <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                      : <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    }
                  </div>
                )}
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showConfirm
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-[10px] mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input type="checkbox" checked={form.agree} onChange={set("agree")} className="sr-only peer" />
                  <div className={`w-4 h-4 rounded border transition-colors ${form.agree ? "bg-amber-400 border-amber-400" : errors.agree ? "border-red-500/60" : "border-white/20"}`} />
                  {form.agree && (
                    <svg className="absolute inset-0 w-4 h-4 text-gray-950 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7"/>
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-400 leading-snug">
                  ฉันยอมรับ{" "}
                  <Link href="/terms" className="text-amber-400 hover:text-amber-300 transition-colors">เงื่อนไขการใช้งาน</Link>
                  {" "}และ{" "}
                  <Link href="/privacy" className="text-amber-400 hover:text-amber-300 transition-colors">นโยบายความเป็นส่วนตัว</Link>
                  {" "}ของ SmartTech
                </span>
              </label>
              {errors.agree && <p className="text-red-400 text-[10px] mt-1 ml-6">{errors.agree}</p>}
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-amber-400/50 disabled:cursor-not-allowed text-gray-950 font-bold py-3 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(251,191,36,0.3)] text-sm flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  กำลังสร้างบัญชี...
                </>
              ) : "สร้างบัญชีฟรี"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}