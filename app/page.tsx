"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [station, setStation] = useState("กำลังตรวจสอบ...");
  const [status, setStatus] = useState("ready"); // ready, loading, success, error

  useEffect(() => {
    // ดึงค่า ?station=001 จาก URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("station") || "ไม่ได้ระบุรหัสตู้";
    setStation(id);
  }, []);

  const handleDispense = async () => {
    setStatus("loading");
    try {
      const response = await fetch(`http://192.168.195.102:8000/dispense`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ station_id: station, liters: 1.5 }),
      });
      if (response.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6 font-sans">
      {/* Header */}
      <div className="w-full max-w-md mt-10 text-center">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-2">
          SAMUI WATER
        </h1>
        <p className="text-slate-400">ระบบจ่ายน้ำอัจฉริยะ</p>
      </div>

      {/* Card UI */}
      <div className="w-full max-w-md bg-slate-800 mt-10 rounded-3xl p-8 shadow-2xl border border-slate-700">
        <div className="text-center mb-8">
          <span className="text-sm text-slate-400 uppercase tracking-widest">
            รหัสตู้ปัจจุบัน
          </span>
          <div className="text-3xl font-mono mt-1 text-blue-300">{station}</div>
        </div>

        {status === "ready" && (
          <button
            onClick={handleDispense}
            className="w-full bg-blue-500 hover:bg-blue-600 h-20 rounded-2xl text-2xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20"
          >
            สั่งจ่ายน้ำ 1.5 ลิตร
          </button>
        )}

        {status === "loading" && (
          <div className="text-center p-4 text-xl animate-pulse">
            ⏳ กำลังสั่งการตู้จ่ายน้ำ...
          </div>
        )}

        {status === "success" && (
          <div className="text-center p-4 bg-green-500/20 text-green-400 rounded-xl border border-green-500/50">
            ✅ จ่ายน้ำสำเร็จ! ขอบคุณที่ใช้บริการ
          </div>
        )}

        {status === "error" && (
          <div className="text-center p-4 bg-red-500/20 text-red-400 rounded-xl border border-red-500/50">
            ❌ เกิดข้อผิดพลาด กรุณาลองใหม่
          </div>
        )}
      </div>

      <p className="mt-10 text-slate-500 text-sm">
        Powered by IOT2050 & FastAPI
      </p>
    </div>
  );
}
