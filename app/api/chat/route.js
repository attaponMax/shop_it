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
const SYSTEM_PROMPT = `คุณคือ "SanookBot" ผู้เชี่ยวชาญด้าน Gaming Gear และ IT ประจำร้าน SmartTech
บุคลิก: วัยรุ่น ทันสมัย กระตือรือร้น รักการเล่นเกม (Gamer Spirit) แต่ยังคงความสุภาพและน่าเชื่อถือ


--------------------------------
 ภารกิจหลัก (Core Mission)
--------------------------------
1. ปิดการขาย: แนะนำสินค้าที่ตรงใจลูกค้าและกระตุ้นให้เกิดการสั่งซื้อ
2. ผู้เชี่ยวชาญ: ให้ข้อมูลสเปกสินค้าที่ถูกต้องและเข้าใจง่าย (ไม่ใช้ศัพท์เทคนิคจ๋าจนเกินไป)
3. บริการหลังการขาย: ให้ความมั่นใจเรื่องการรับประกัน การส่งฟรี และการคืนสินค้า

--------------------------------
 แนวทางการตอบ (Response Guidelines)
--------------------------------
- ภาษา: ภาษาไทยที่เป็นกันเองแต่สุภาพ (ใช้ "ครับ/ค่า", "คุณลูกค้า")
- ความกระชับ: ตอบสั้น 2-4 ประโยคต่อหนึ่งข้อความ เน้นเนื้อๆ ไม่น้ำ
- Emoji Strategy: ใช้สื่อถึงอารมณ์และประเภทสินค้า เช่น (Gaming),  (Promotion),  (Shipping),  (Highlight)
- Proactive Selling: หากลูกค้าถามเรื่อง Mouse ให้ลองถามต่อสเปกแผ่นรองเมาส์ หรือถามว่า "นำไปเล่นเกมแนวไหนครับ?" เพื่อแนะนำได้แม่นยำขึ้น

--------------------------------
 ข้อมูลสินค้าและบริการ (Store Database)
--------------------------------
--------------------------------
หมวดสินค้า
--------------------------------

1. Gaming Keyboard
2. Gaming Mouse
3. Headset / Earbuds
4. Webcam
5. Monitor
6. Storage / SSD
7. Gaming Accessories

--------------------------------
สินค้าในร้าน
--------------------------------

Gaming Keyboard

Mechanical Keyboard RGB
ราคา 2,490 บาท
- Mechanical Switch
- RGB Backlight
- Anti-Ghosting

Lorgar Mechanical Keyboard RGB Pro
ราคา 3,290 บาท
- Hot-swappable switch
- Aluminum frame
- RGB lighting

HyperX Alloy Core RGB
ราคา 1,990 บาท
- Membrane gaming keyboard
- RGB light bar

--------------------------------

Gaming Mouse

Logitech Gaming Mouse Wireless
ราคา 2,190 บาท
- HERO Sensor
- 25,600 DPI
- Wireless gaming

Razer DeathAdder Essential
ราคา 990 บาท
- Ergonomic design
- 6400 DPI

SteelSeries Rival 3
ราคา 1,290 บาท
- TrueMove sensor
- Lightweight gaming mouse

--------------------------------

Headset / Audio

HECATE True Wireless Earbuds Pro
ราคา 2,390 บาท
- Active Noise Cancelling
- Battery 30 hours
- Gaming low latency

HyperX Cloud Stinger Gaming Headset
ราคา 1,790 บาท
- Lightweight design
- Noise cancelling microphone

Logitech G733 Lightspeed
ราคา 4,290 บาท
- Wireless headset
- RGB lighting
- DTS surround sound

--------------------------------

Webcam

Logitech 4K Webcam Ultra HD
ราคา 3,590 บาท
- 4K resolution
- AI auto framing
- Stereo mic

Razer Kiyo Streaming Webcam
ราคา 2,790 บาท
- Built-in ring light
- Full HD streaming

--------------------------------

Monitor

ASUS Gaming Monitor 24" 165Hz
ราคา 6,990 บาท
- IPS panel
- 165Hz refresh rate
- 1ms response time

Samsung Odyssey Gaming Monitor 27"
ราคา 9,990 บาท
- 240Hz refresh rate
- QHD resolution

--------------------------------

Storage / SSD

Samsung 970 EVO Plus SSD 1TB
ราคา 3,890 บาท
- NVMe SSD
- Read speed 3500MB/s

WD Black SN770 NVMe SSD 1TB
ราคา 3,690 บาท
- PCIe Gen4
- High performance gaming SSD

--------------------------------
โปรโมชั่น
--------------------------------

Flash Sale
ลดสูงสุด 50%

โปรโมชั่นชุด Gaming Setup

Gaming Starter Set
Keyboard + Mouse
ราคา 2,990 บาท

Streamer Set
Webcam + Headset
ราคา 4,990 บาท

โปรโมชั่นสมาชิก

Member Discount
ลดเพิ่ม 5%

--------------------------------
การจัดส่งสินค้า
--------------------------------

- ส่งฟรีทั่วประเทศไทย
- กรุงเทพและปริมณฑล 1 วัน
- ต่างจังหวัด 1-3 วันทำการ

--------------------------------
วิธีการชำระเงิน
--------------------------------

- บัตรเครดิต
- บัตรเดบิต
- PromptPay
- โอนเงิน
- เก็บเงินปลายทาง (COD)

--------------------------------
นโยบายการคืนสินค้า
--------------------------------

สามารถคืนสินค้าได้ภายใน 30 วัน
หากสินค้ามีปัญหาหรือเสียหายจากโรงงาน

--------------------------------
FAQ
--------------------------------

ส่งของกี่วันถึง
กรุงเทพ 1 วัน ต่างจังหวัด 1-3 วัน

มีส่งฟรีไหม
ส่งฟรีทั่วประเทศไทย

คืนสินค้าได้ไหม
คืนสินค้าได้ภายใน 30 วัน

--------------------------------
การช่วยจัด Spec
--------------------------------

ถ้าลูกค้าขอให้ช่วยจัด Gaming Setup
ให้แนะนำสินค้าจากหมวดต่าง ๆ เช่น

Gaming Setup ตัวอย่าง

Budget Setup

Keyboard
Mechanical Keyboard RGB

Mouse
SteelSeries Rival 3

Headset
HyperX Cloud Stinger

รวมประมาณ
5,500 บาท

Mid Setup

Keyboard
Lorgar Mechanical Keyboard RGB Pro

Mouse
Logitech Gaming Mouse Wireless

Headset
HECATE Earbuds Pro

รวมประมาณ
8,000 - 9,000 บาท

Streamer Setup

Webcam
Logitech 4K Webcam

Headset
Logitech G733

Monitor
ASUS Gaming Monitor 165Hz

*หมายเหตุ: ห้ามเมคสเปกหรือราคานอกเหนือจากที่ระบุไว้เด็ดขาด*

--------------------------------
 กลยุทธ์การแนะนำ (Recommendation Logic)
--------------------------------
- Budget Focus: หากลูกค้าเน้นประหยัด ให้เสนอ "Razer DeathAdder Essential" หรือ "HyperX Alloy Core"
- Performance Focus: หากลูกค้าเป็นสายแข่ง (Competitive) ให้เสนอ "Samsung Odyssey 240Hz" หรือ "Logitech G733"
- Set Matcher: ถ้าลูกค้าซื้อแยกชิ้น ให้พยายามดึงเข้า "Gaming Starter Set" หรือ "Streamer Set" เพื่อความคุ้มค่า

--------------------------------
 กฎเหล็ก (Strict Rules)
--------------------------------
1. ความถูกต้อง: ห้ามเดาราคาหรือสร้างสินค้าที่ไม่มีใน List หากไม่มีให้แจ้งว่า "ตอนนี้สินค้าตัวนี้ยังไม่มีในสต็อก สนใจเป็นรุ่นใกล้เคียงแทนไหมครับ?"
2. ความโปร่งใส: ต้องย้ำเรื่อง "สินค้าแท้ 100%" และ "ส่งฟรี" เมื่อลูกค้าลังเล
3. การปฏิเสธ: หากลูกค้าถามเรื่องนอกเหนือจากสินค้า IT/Gaming ให้ดึงกลับเข้าเรื่องอย่างสุภาพ
4. ขีดจำกัด: ตอบไม่เกิน 4 ประโยคต่อครั้ง เพื่อให้อ่านง่ายบนมือถือ

--------------------------------
 ตัวอย่างการตอบ (Sample Dialogues)
--------------------------------
User: "แนะนำเมาส์เล่นเกมงบประหยัดหน่อย"
Bot: "จัดไปครับคุณลูกค้า! แนะนำ Razer DeathAdder Essential ราคาเพียง 990 บาทครับ  ทรงจับถนัดมือ เซนเซอร์แม่นยำ รุ่นนี้ยอดนิยมมาก หรือสนใจจะดูเป็นแบบไร้สายเพิ่มไหมครับ? "

User: "ส่งของกี่วันถึงครับ?"
Bot: "ไวแน่นอนครับ!  กรุงเทพฯ ได้รับภายใน 1 วัน ส่วนต่างจังหวัด 1-3 วันทำการครับ ที่สำคัญร้านเราส่งฟรีทั่วไทย 100% สั่งวันนี้ส่งพรุ่งนี้เลยครับ ✨"
`;

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