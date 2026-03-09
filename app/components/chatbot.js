'use client';
import { useState } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "สวัสดีครับ! ถามข้อมูลสินค้าหรือนโยบายร้าน ShopSanook จาก PDF ได้เลยครับ", sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.reply, sender: 'bot', id: data.logId }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "ขออภัยครับ ระบบขัดข้อง", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (logId, isPositive) => {
    // API สำหรับเก็บค่า KPI ลง Database
    await fetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify({ logId, isPositive }),
    });
    alert("ขอบคุณสำหรับคำแนะนำครับ! (บันทึก KPI เรียบร้อย)");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 text-black">
      {isOpen && (
        <div className="bg-white w-80 h-[450px] shadow-2xl rounded-2xl mb-4 flex flex-col border border-gray-200">
          <div className="p-4 bg-[#FF9900] text-white font-bold rounded-t-2xl flex justify-between">
            <span>ShopSanook AI (RAG)</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`p-3 rounded-xl text-sm ${msg.sender === 'user' ? 'bg-orange-100 self-end' : 'bg-white shadow-sm self-start'}`}>
                {msg.text}
                {msg.sender === 'bot' && i !== 0 && (
                  <div className="mt-2 flex gap-2 border-t pt-2">
                    <button onClick={() => handleFeedback(msg.id, true)} className="hover:scale-110">👍</button>
                    <button onClick={() => handleFeedback(msg.id, false)} className="hover:scale-110">👎</button>
                  </div>
                )}
              </div>
            ))}
            {isLoading && <div className="text-xs text-gray-400">AI กำลังอ่าน PDF...</div>}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} className="flex-1 border rounded-full px-3 py-1" placeholder="ถามนโยบายการคืนสินค้า..." />
            <button onClick={handleSend} className="bg-[#FF9900] text-white px-3 py-1 rounded-full">ส่ง</button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="bg-[#FF9900] w-14 h-14 rounded-full text-white shadow-xl text-2xl">💬</button>
    </div>
  );
}