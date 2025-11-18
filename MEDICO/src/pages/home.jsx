// src/pages/home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <header className="w-full h-24 bg-sky-500 flex items-center px-10 justify-between relative">
        {/* Logo */}
        <img
          src="https://placehold.co/150x70"
          alt="MEDICO Logo"
          className="w-36 h-16 rounded-3xl cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10 text-xl text-black font-medium">
          <button onClick={() => navigate("/")} className="hover:text-white transition">
            Home
          </button>
          <button className="hover:text-white transition">Consultations</button>
          <button className="hover:text-white transition">Medical History</button>
          <button className="hover:text-white transition">About</button>
        </div>

        {/* Hamburger Menu */}
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

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-20 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
              <button
                onClick={() => { navigate("/cart"); setDropdownOpen(false); }}
                className="w-full text-left px-6 py-4 hover:bg-sky-50 transition font-medium text-gray-800 flex items-center gap-3"
              >
                Cart
              </button>
              <button
                onClick={() => { navigate("/login"); setDropdownOpen(false); }}
                className="w-full text-left px-6 py-4 hover:bg-sky-50 transition font-medium text-gray-800 flex items-center gap-3"
              >
                Login
              </button>
              <button
                onClick={() => { navigate("/about"); setDropdownOpen(false); }}
                className="w-full text-left px-6 py-4 hover:bg-sky-50 transition font-medium text-gray-800 flex items-center gap-3"
              >
                About
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex justify-center mt-12 px-8">
        <img
          src="https://placehold.co/1400x500"
          alt="Hero Banner"
          className="w-full max-w-7xl h-96 lg:h-[520px] object-cover rounded-3xl shadow-2xl"
        />
      </section>

      {/* Big CTA Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate("/doctor")}
          className="px-16 py-7 bg-sky-600 hover:bg-sky-700 text-white text-2xl font-bold rounded-3xl shadow-2xl transition transform hover:scale-105"
        >
          CONSULT A SPECIALIST
        </button>
      </div>

      {/* Services Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-8 lg:px-20 mt-20 pb-24">
        {/* Consult a Doctor */}
        <div className="group">
          <img
            src="https://placehold.co/300x250"
            alt="Consult a Doctor"
            className="w-full h-64 object-cover rounded-2xl shadow-xl group-hover:shadow-2xl transition"
          />
          <button
            onClick={() => navigate("/doctor")}
            className="w-full mt-5 py-5 bg-sky-500 hover:bg-sky-600 text-white text-xl font-semibold rounded-2xl transition shadow-lg"
          >
            Consult a Doctor
          </button>
        </div>

        {/* AI Symptom Checker */}
        <div className="group">
          <img
            src="https://placehold.co/300x250"
            alt="AI Symptom Checker"
            className="w-full h-64 object-cover rounded-2xl shadow-xl group-hover:shadow-2xl transition"
          />
          <button className="w-full mt-5 py-5 bg-sky-500 hover:bg-sky-600 text-white text-xl font-semibold rounded-2xl transition shadow-lg">
            AI Symptom Checker
          </button>
        </div>

        {/* Order Medicines */}
        <div className="group">
          <img
            src="https://placehold.co/300x250"
            alt="Order Medicines"
            className="w-full h-64 object-cover rounded-2xl shadow-xl group-hover:shadow-2xl transition"
          />
          <button
            onClick={() => navigate("/pharmacy")}
            className="w-full mt-5 py-5 bg-sky-500 hover:bg-sky-600 text-white text-xl font-semibold rounded-2xl transition shadow-lg"
          >
            Order Medicines
          </button>
        </div>

        {/* Emergency Ambulance */}
        <div className="group">
          <img
            src="https://placehold.co/300x250"
            alt="Emergency Ambulance"
            className="w-full h-64 object-cover rounded-2xl shadow-xl group-hover:shadow-2xl transition"
          />
          <button className="w-full mt-5 py-5 bg-sky-500 hover:bg-sky-600 text-white text-xl font-semibold rounded-2xl transition shadow-lg">
            Emergency Ambulance
          </button>
        </div>
      </section>
    </div>
  );
}