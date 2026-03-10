import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── GET /api/products/[id] ────────────────────
export async function GET(request, { params }) {
  try {
    const { data, error } = await supabaseAdmin
      .from("products").select("*").eq("id", params.id).single();
    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}

// ── PATCH /api/products/[id] ──────────────────
export async function PATCH(request, { params }) {
  try {
    const body = await request.json();

    const allowed = ["name","description","brand","category","price","original_price",
                     "stock","status","tags","specs","images","is_featured","rating","review_count"];
    const update = {};
    allowed.forEach((k) => { if (body[k] !== undefined) update[k] = body[k]; });

    if (update.price)          update.price          = parseFloat(update.price);
    if (update.original_price) update.original_price = parseFloat(update.original_price);
    if (update.stock)          update.stock          = parseInt(update.stock);

    const { data, error } = await supabaseAdmin
      .from("products").update(update).eq("id", params.id).select().single();
    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── DELETE /api/products/[id] ─────────────────
export async function DELETE(request, { params }) {
  try {
    // ลบรูปจาก Storage ก่อน
    const { data: product } = await supabaseAdmin
      .from("products").select("images").eq("id", params.id).single();

    if (product?.images?.length) {
      const paths = product.images.map((url) => {
        const parts = url.split("/product-images/");
        return parts[1] || "";
      }).filter(Boolean);
      if (paths.length) {
        await supabaseAdmin.storage.from("product-images").remove(paths);
      }
    }

    const { error } = await supabaseAdmin.from("products").delete().eq("id", params.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}