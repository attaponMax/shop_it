import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, name, role, created_at")
    .order("created_at", { ascending: false });

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify({ users: data }), { status: 200 });
}

export async function PATCH(request) {
  try {
    const { id, role } = await request.json();
    if (!id || !role) return new Response(JSON.stringify({ error: "id and role are required" }), { status: 400 });

    const { error } = await supabase.from("users").update({ role }).eq("id", id);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) return new Response(JSON.stringify({ error: "id is required" }), { status: 400 });

    // Delete from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) {
      // still attempt to delete profile row even if auth delete fails
      await supabase.from("users").delete().eq("id", id);
      return new Response(JSON.stringify({ error: authError.message }), { status: 500 });
    }

    // Delete profile row
    await supabase.from("users").delete().eq("id", id);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
