// src/pages/ambulance.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Ambulance() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-white overflow-hidden">
      {/* SAME NAVBAR AS HOME PAGE */}
      <header className="w-full h-24 bg-sky-500 flex items-center px-10 justify-between relative">
        <img
          src="/src/assets/login-banner.png"
          alt="MEDICO Logo"
          className="w-36 h-16 rounded-3xl cursor-pointer object-contain bg-white p-2 shadow-lg"
          onClick={() => navigate("/")}
        />

        <div className="hidden lg:flex items-center gap-10 text-xl text-black font-medium">
          <button onClick={() => navigate("/")} className="hover:text-white transition">Home</button>
          <button className="hover:text-white transition">Consultations</button>
          <button className="hover:text-white transition">Medical History</button>
          <button className="hover:text-white transition">About</button>
        </div>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl ring-4 ring-white hover:ring-sky-200 transition"
          >
            <div className="space-y-1">
              <span className="block w-7 h-1 bg-sky-600 rounded-full"></span>
              <span className="block w-7 h-1 bg-sky-600 rounded-full"></span>
              <span className="block w-7 h-1 bg-sky-600 rounded-full"></span>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-20 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
              <button onClick={() => { navigate("/cart"); setDropdownOpen(false); }} className="w-full text-left px-6 py-4 hover:bg-sky-50 transition font-medium text-gray-800">Cart</button>
              <button onClick={() => { navigate("/login"); setDropdownOpen(false); }} className="w-full text-left px-6 py-4 hover:bg-sky-50 transition font-medium text-gray-800">Login</button>
              <button onClick={() => { navigate("/about"); setDropdownOpen(false); }} className="w-full text-left px-6 py-4 hover:bg-sky-50 transition font-medium text-gray-800">About</button>
            </div>
          )}
        </div>
      </header>

      {/* BIG RED EMERGENCY CIRCLE */}
      <div className="flex flex-col items-center justify-center mt-32">
        <div className="relative">
          <div className="w-80 h-80 bg-red-600 rounded-full border-8 border-black/20 shadow-2xl flex items-center justify-center cursor-pointer hover:bg-red-700 transition transform hover:scale-105">
            <span className="text-white text-5xl font-bold tracking-wider">EMERGENCY</span>
          </div>
        </div>

        {/* TITLE BELOW */}
        <h1 className="mt-16 text-6xl font-bold text-black">
          EMERGENCY AMBULANCE SERVICE
        </h1>
      </div>

      {/* Optional: Call button or info */}
      <div className="text-center mt-10">
        <p className="text-2xl text-gray-700">Tap the button above or call 999 for immediate help</p>
      </div>
    </div>
  );
}