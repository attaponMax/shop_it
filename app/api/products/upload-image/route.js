import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── POST /api/products/upload-image ──────────
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file     = formData.get("file");

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "ไฟล์ต้องเป็น JPG, PNG, WEBP หรือ GIF" }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "ไฟล์ต้องไม่เกิน 5MB" }, { status: 400 });
    }

    const ext      = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path     = `products/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from("product-images")
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from("product-images")
      .getPublicUrl(path);

    return NextResponse.json({ url: publicUrl, path });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── DELETE /api/products/upload-image ─────────
export async function DELETE(request) {
  try {
    const { path } = await request.json();
    if (!path) return NextResponse.json({ error: "No path" }, { status: 400 });

    const { error } = await supabaseAdmin.storage.from("product-images").remove([path]);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}