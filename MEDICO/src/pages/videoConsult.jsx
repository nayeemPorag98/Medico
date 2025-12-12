// src/pages/videoConsult.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function VideoConsult() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full h-24 bg-sky-500 flex items-center px-10 justify-between shadow-2xl z-50">
         <img
          src="/src/assets/login-banner.png"
          alt="MEDICO Logo"
          className="w-36 h-16 rounded-3xl cursor-pointer object-contain bg-white p-2 shadow-lg"
          onClick={() => navigate("/")}
        />

        <h1 className="absolute left-1/2 -translate-x-1/2 top-6 text-5xl md:text-7xl font-black text-white tracking-wider drop-shadow-2xl">
          Video Consultation
        </h1>
      </header>

      {/* MAIN CONTENT */}
      <div className="pt-32 flex flex-col items-center px-8 pb-20">

        {/* Patient Video Feed */}
        <div className="w-full max-w-5xl bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-300">
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
            <div className="text-white text-6xl font-bold tracking-wider animate-pulse">
              LIVE VIDEO CALL
            </div>
          </div>
        </div>

        {/* Doctor's Small Video (Bottom Right) */}
        <div className="absolute bottom-32 right-12 w-80 h-48 bg-gray-800 rounded-2xl shadow-2xl border-4 border-white overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-sky-600 to-blue-700 flex items-center justify-center">
            <span className="text-white text-3xl font-bold">Your Camera</span>
          </div>
        </div>

        {/* CONTROL BUTTONS - INCLUDING PRESCRIBE */}
        <div className="mt-12 flex gap-10">
          <button className="px-16 py-8 bg-red-600 hover:bg-red-700 text-white text-3xl font-bold rounded-3xl shadow-2xl transition transform hover:scale-105 active:scale-95">
            End Call
          </button>

          <button className="px-16 py-8 bg-gray-700 hover:bg-gray-800 text-white text-3xl font-bold rounded-3xl shadow-2xl transition transform hover:scale-105 active:scale-95">
            Mute
          </button>

          {/* PRESCRIBE MEDICINE BUTTON */}
          <button
            onClick={() => navigate("/medicine-prescribe")}
            className="px-16 py-8 bg-emerald-600 hover:bg-emerald-700 text-white text-3xl font-bold rounded-3xl shadow-2xl transition transform hover:scale-105 active:scale-95 flex items-center gap-4"
          >
            Prescribe Medicine
          </button>
        </div>

        {/* Status */}
        <div className="mt-10 flex items-center gap-4">
          <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-2xl font-semibold text-gray-700">Call Active • Encrypted • Secure</p>
        </div>
      </div>
    </div>
  );
}