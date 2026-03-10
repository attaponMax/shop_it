import { createClient } from "@supabase/supabase-js";

// Singleton — ใช้ไฟล์นี้แทนการ createClient ในทุกหน้า
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);