// src/pages/pharmacy.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Pharmacy() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pharmacies = [
    { name: "MedLife Pharmacy", location: "Andheri West, Mumbai" },
    { name: "Apollo Pharmacy", location: "Bandra East, Mumbai" },
    { name: "Wellness Forever", location: "Juhu, Mumbai" },
    { name: "Guardian Pharmacy", location: "Powai, Mumbai" },
    { name: "Noble Plus", location: "Malad West, Mumbai" },
    { name: "HealthHub", location: "Goregaon East, Mumbai" },
    { name: "CarePlus Pharmacy", location: "Kandivali, Mumbai" },
    { name: "LifeCare Medicos", location: "Borivali West, Mumbai" },
    { name: "Prime Chemist", location: "Dadar, Mumbai" },
    { name: "Trust Pharmacy", location: "Chembur, Mumbai" },
    { name: "City Medicos", location: "Vikhroli, Mumbai" },
    { name: "Sunrise Pharmacy", location: "Thane West" },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* EXACT SAME NAVBAR AS HOME PAGE */}
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

          {dropdownOpen && (
            <div className="absolute right-0 top-20 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
              <button onClick={() => { navigate("/cart"); setDropdownOpen(false); }}
                className="w-full text-left px-6 py-4 hover:bg-sky-50 transition font-medium text-gray-800">
                Cart
              </button>
              <button onClick={() => { navigate("/login"); setDropdownOpen(false); }}
                className="w-full text-left px-6 py-4 hover:bg-sky-50 transition font-medium text-gray-800">
                Login
              </button>
              <button onClick={() => { navigate("/about"); setDropdownOpen(false); }}
                className="w-full text-left px-6 py-4 hover:bg-sky-50 transition font-medium text-gray-800">
                About
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mt-12 px-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for medicines, pharmacies or location..."
            className="w-full px-10 py-6 text-2xl text-gray-700 bg-gray-200 rounded-full focus:outline-none focus:ring-4 focus:ring-sky-300 shadow-lg placeholder-gray-500"
          />
          <svg className="w-8 h-8 absolute left-4 top-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Page Title */}
      <div className="text-center mt-16">
        <h1 className="text-5xl font-bold text-sky-600">Order Medicines</h1>
        <p className="text-xl text-gray-600 mt-4">Choose from trusted pharmacies near you</p>
      </div>

      {/* Pharmacy Grid */}
      <div className="max-w-7xl mx-auto px-8 mt-12 pb-16 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {pharmacies.map((pharmacy, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 overflow-hidden"
            >
              {/* Pharmacy Image */}
              <div className="h-64 bg-gradient-to-br from-sky-100 to-blue-200 relative overflow-hidden">
                <img
                  src={`https://placehold.co/300x250?text=${encodeURIComponent(pharmacy.name)}`}
                  alt={pharmacy.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition"></div>
              </div>

              {/* Info */}
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800">{pharmacy.name}</h3>
                <p className="text-lg text-gray-600 mt-2 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {pharmacy.location}
                </p>

                <button className="mt-6 w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xl rounded-xl transition shadow-lg">
                  View Store
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}