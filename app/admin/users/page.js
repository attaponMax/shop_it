"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabase";

function formatDateTime(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <svg className="w-8 h-8 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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
        <p className="text-gray-400 text-sm mb-8">กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้าจัดการผู้ใช้</p>
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

function DeleteModal({ user, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
          </svg>
        </div>
        <h3 className="text-white font-bold text-lg mb-2">ยืนยันการลบ</h3>
        <p className="text-gray-400 text-sm mb-6">คุณแน่ใจหรือไม่ว่าจะลบผู้ใช้ <span className="text-red-400 font-semibold">{user?.email}</span>? การกระทำนี้ไม่สามารถย้อนกลับได้</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-white/15 hover:bg-white/5 text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
            ยกเลิก
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-400 disabled:bg-gray-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
            {loading ? "กำลังลบ..." : "ลบเลย"}
          </button>
        </div>
      </div>
    </div>
  );
}

function UsersContent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.trim().toLowerCase();
    return users.filter((u) =>
      (u.email || "").toLowerCase().includes(q) ||
      (u.name || "").toLowerCase().includes(q)
    );
  }, [users, search]);

  const handleRoleChange = async (userId, role) => {
    setEditingRoleId(userId);
    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role }),
      });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    } finally {
      setEditingRoleId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setSaving(true);
    try {
      await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingUser.id }),
      });
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
    } finally {
      setSaving(false);
      setDeletingUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <a href="/" className="hover:text-amber-400 transition-colors">หน้าแรก</a>
              <span>/</span>
              <a href="/dashboard" className="hover:text-amber-400 transition-colors">Admin</a>
              <span>/</span>
              <span className="text-gray-300">จัดการผู้ใช้</span>
            </div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V5a3 3 0 00-6 0v6m-4 4h14a2 2 0 012 2v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1a2 2 0 012-2z"/>
                </svg>
              </span>
              จัดการผู้ใช้
              <span className="text-[10px] font-semibold bg-amber-400/10 border border-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full">Admin</span>
            </h1>
          </div>
          <button onClick={fetchUsers}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-400/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M4 4v6h6" />
              <path d="M20 20v-6h-6" />
              <path d="M20 10a8 8 0 11-8-8" />
            </svg>
            โหลดใหม่
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาอีเมลหรือชื่อ..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-white/8 focus:border-amber-400/50 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-colors"/>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>รวม</span>
            <span className="font-semibold text-white">{users.length}</span>
            <span>ผู้ใช้</span>
          </div>
        </div>

        <div className="bg-gray-900 border border-white/8 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-white/8 text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <div>อีเมล</div>
            <div>ชื่อ</div>
            <div>บทบาท</div>
            <div>สมัครเมื่อ</div>
            <div>จัดการ</div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <svg className="w-7 h-7 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-600">
              <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 21V7a2 2 0 00-2-2H6a2 2 0 00-2 2v14" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 15h5" />
              </svg>
              <p className="text-sm">ไม่พบผู้ใช้</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id}
                className="grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 px-5 py-4 border-b border-white/5 items-center hover:bg-white/2 transition-colors">
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{user.email}</p>
                </div>
                <div className="text-gray-400 text-sm truncate">{user.name || "—"}</div>
                <div>
                  <select value={user.role || "user"} onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={editingRoleId === user.id}
                    className="bg-gray-800 border border-white/8 rounded-lg px-2 py-1 text-xs text-gray-200 outline-none cursor-pointer">
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div className="text-gray-400 text-xs">{formatDateTime(user.created_at)}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setDeletingUser(user)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 0V4a1 1 0 011-1h2a1 1 0 011 1v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {deletingUser && (
        <DeleteModal user={deletingUser} onConfirm={handleDelete} onClose={() => setDeletingUser(null)} loading={saving} />
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  const [session, setSession] = useState(null);
  const [userData, setUserData] = useState(null);
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
  if (!session) return <NotLoggedIn />;
  if (userData?.role !== "admin") return <AccessDenied userData={userData} session={session} />;
  return <UsersContent />;
}
