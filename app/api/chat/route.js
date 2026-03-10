import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── System Prompt ────────────────────────────────────────────
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

หน้าที่ของคุณ:
1. แนะนำสินค้าตามความต้องการลูกค้า
2. ตอบคำถามเรื่องการจัดส่ง, การชำระเงิน, การคืนสินค้า
3. ช่วยเปรียบเทียบสินค้า
4. แนะนำโปรโมชั่น
5. ช่วยติดตามออเดอร์ (แนะนำให้ login และไปที่หน้าบัญชี)

กฎ:
- ตอบกระชับ ไม่เกิน 3-4 ประโยคต่อครั้ง (ยกเว้นเปรียบเทียบสินค้า)
- ใช้ emoji พอดี ไม่มากเกินไป
- ถ้าไม่รู้ข้อมูลสินค้าจริง ให้แนะนำให้ไปดูที่หน้า category แทน
- ห้ามแต่งข้อมูลราคาสินค้า`;

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-10), // ส่งแค่ 10 messages ล่าสุด
      ],
      max_tokens: 512,
      temperature: 0.7,
      stream: false,
    });

    const reply = completion.choices[0]?.message?.content || "ขออภัยครับ ไม่สามารถตอบได้ในขณะนี้";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json(
      { error: "ขออภัยครับ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}