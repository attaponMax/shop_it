import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ใช้ service role เพื่อ bypass RLS ในการ log
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── Intent Detection ─────────────────────────
function detectIntent(text) {
  const t = text.toLowerCase();
  if (t.match(/พัสดุ|ส่ง|จัดส่ง|ติดตาม|tracking|ออเดอร์|order/))  return "สอบถามสถานะพัสดุ";
  if (t.match(/คืน|refund|เปลี่ยน|return/))                         return "ติดต่อขอคืนสินค้า";
  if (t.match(/ราคา|เท่าไร|โปรโมชั่น|ส่วนลด|โค้ด|sale|ลด/))       return "สอบถามราคา / โปรโมชัน";
  if (t.match(/ชำระ|จ่าย|บัตร|โอน|promptpay|payment/))            return "ปัญหาการชำระเงิน";
  if (t.match(/มีไหม|สต๊อก|stock|หมด|available/))                  return "ถามสต๊อกสินค้า";
  if (t.match(/แนะนำ|recommend|ดีไหม|เลือก|ควรซื้อ/))              return "แนะนำสินค้า";
  if (t.match(/ยกเลิก|cancel/))                                     return "ยกเลิกคำสั่งซื้อ";
  if (t.match(/คีย์บอร์ด|keyboard/))                                return "สอบถามสินค้า - คีย์บอร์ด";
  if (t.match(/เมาส์|mouse/))                                       return "สอบถามสินค้า - เมาส์";
  if (t.match(/หูฟัง|headphone|headset/))                           return "สอบถามสินค้า - หูฟัง";
  if (t.match(/จอ|monitor|screen/))                                  return "สอบถามสินค้า - Monitor";
  return "ทั่วไป";
}

// ─── System Prompt ────────────────────────────
const SYSTEM_PROMPT = `คุณคือ "SanookBot" ผู้ช่วย AI ของร้าน ShopSanook ร้านไอทีและเกมมิ่งออนไลน์ชั้นนำ
คุณพูดภาษาไทยเป็นหลัก เป็นมิตร กระชับ และช่วยเหลือลูกค้าได้ดี

ข้อมูลร้าน ShopSanook:
- สินค้า: คีย์บอร์ด, เมาส์, หูฟัง, ลำโพง, จอมอนิเตอร์, Storage & SSD, อุปกรณ์เสริม
- จัดส่งฟรีทั่วไทย ไม่มีขั้นต่ำ
- สั่งวันนี้รับพรุ่งนี้ (กทม.), ต่างจังหวัด 1-3 วัน
- ชำระเงินได้: บัตรเครดิต, PromptPay, โอนเงิน, COD
- คืนสินค้าได้ใน 30 วัน
- สินค้าแท้ 100% มีรับประกัน
- Flash Sale ทุกวัน มีโค้ดส่วนลดพิเศษสำหรับสมาชิก

กฎ:
- ตอบกระชับ ไม่เกิน 3-4 ประโยคต่อครั้ง
- ใช้ emoji พอดี ไม่มากเกินไป
- ถ้าไม่รู้ข้อมูลสินค้าจริง ให้แนะนำให้ไปดูที่หน้า category แทน
- ห้ามแต่งข้อมูลราคาสินค้า`;

// ─── POST — Send message ──────────────────────
export async function POST(request) {
  try {
    const { messages, sessionId, userId } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // 1. Ensure session exists
    let activeSessionId = sessionId;

    if (!activeSessionId) {
      const { data: session, error: sessionError } = await supabase
        .from("chat_sessions")
        .insert({ user_id: userId || null, message_count: 0 })
        .select("id")
        .single();

      if (sessionError) console.error("Session create error:", sessionError);
      else activeSessionId = session.id;
    }

    // 2. Log user message + detect intent
    const userMsg = messages[messages.length - 1];
    const intent  = detectIntent(userMsg?.content || "");

    if (activeSessionId && userMsg?.role === "user") {
      await supabase.from("chat_messages").insert({
        session_id: activeSessionId,
        role:       "user",
        content:    userMsg.content,
        intent,
      });
    }

    // 3. Call Groq + measure response time
    const t0 = Date.now();
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-10).map(({ role, content }) => ({ role, content })),
      ],
      max_tokens: 512,
      temperature: 0.7,
      stream: false,
    });
    const responseMs = Date.now() - t0;
    const reply = completion.choices[0]?.message?.content || "ขออภัยครับ ไม่สามารถตอบได้ในขณะนี้";

    // 4. Log assistant message + update session message_count
    if (activeSessionId) {
      await Promise.all([
        supabase.from("chat_messages").insert({
          session_id:  activeSessionId,
          role:        "assistant",
          content:     reply,
          response_ms: responseMs,
        }),
        supabase.from("chat_sessions")
          .update({ message_count: messages.length + 1 })
          .eq("id", activeSessionId),
      ]);
    }

    return NextResponse.json({ reply, sessionId: activeSessionId, responseMs, intent });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "ขออภัยครับ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}

// ─── PATCH — End session (CSAT + resolved) ────
export async function PATCH(request) {
  try {
    const { sessionId, csatScore, resolved, escalated } = await request.json();
    if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

    const { error } = await supabase
      .from("chat_sessions")
      .update({
        ended_at: new Date().toISOString(),
        ...(csatScore !== undefined && { csat_score: csatScore }),
        ...(resolved  !== undefined && { resolved }),
        ...(escalated !== undefined && { escalated }),
      })
      .eq("id", sessionId);

    if (error) throw error;
    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("End session error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}