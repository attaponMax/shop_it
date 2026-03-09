'use client';
import { useState } from 'react';

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div className="bg-white w-80 h-96 shadow-2xl rounded-lg mb-4 flex flex-col border border-gray-200">
          <div className="p-4 bg-orange-500 text-white rounded-t-lg">ShopSanook Chat</div>
          <div className="flex-1 p-4 overflow-y-auto text-black">
            {/* ข้อความแชทจะอยู่ตรงนี้ */}
            สวัสดีครับ มีอะไรให้ช่วยไหม?
          </div>
          <input type="text" className="p-2 border-t" placeholder="พิมพ์ข้อความ..." />
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-orange-500 w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center text-2xl hover:bg-orange-600 transition"
      >
        💬
      </button>
    </div>
  );
}