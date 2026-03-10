import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service role สำหรับ admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── GET /api/products ─────────────────────────
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search   = searchParams.get("search")   || "";
  const category = searchParams.get("category") || "";
  const status   = searchParams.get("status")   || "";
  const sort     = searchParams.get("sort")      || "created_at";
  const order    = searchParams.get("order")     || "desc";
  const page     = parseInt(searchParams.get("page") || "1");
  const limit    = parseInt(searchParams.get("limit") || "20");
  const from     = (page - 1) * limit;

  try {
    let query = supabaseAdmin.from("products").select("*", { count: "exact" });

    if (search)   query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%`);
    if (category) query = query.eq("category", category);
    if (status)   query = query.eq("status", status);

    const validSorts = ["created_at", "name", "price", "stock", "rating", "review_count"];
    const sortCol = validSorts.includes(sort) ? sort : "created_at";
    query = query.order(sortCol, { ascending: order === "asc" }).range(from, from + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ products: data, total: count, page, limit });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── POST /api/products ────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, brand, category, price, original_price,
            stock, status, tags, specs, images, is_featured } = body;

    if (!name || !brand || !category || price === undefined) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลที่จำเป็น (name, brand, category, price)" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert({
        name, description, brand, category,
        price: parseFloat(price),
        original_price: original_price ? parseFloat(original_price) : null,
        stock: parseInt(stock) || 0,
        status: status || "active",
        tags:   tags   || [],
        specs:  specs  || {},
        images: images || [],
        is_featured: is_featured || false,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ product: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}