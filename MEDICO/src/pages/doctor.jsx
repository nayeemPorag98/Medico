// src/pages/doctor.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Doctor() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const goToDoctors = () => navigate("/doctors");

  const doctors = [
    { name: "Dr. Sarah Johnson", specialty: "Cardiologist", rating: "4.9", fees: "₹800" },
    { name: "Dr. Michael Chen", specialty: "Neurologist", rating: "4.8", fees: "₹1000" },
    { name: "Dr. Priya Sharma", specialty: "Pediatrician", rating: "5.0", fees: "₹600" },
    { name: "Dr. Raj Patel", specialty: "Dermatologist", rating: "4.7", fees: "₹700" },
    { name: "Dr. Anika Singh", specialty: "General Physician", rating: "4.9", fees: "₹500" },
    { name: "Dr. Vikram Mehta", specialty: "Orthopedic", rating: "4.8", fees: "₹900" },
  ];

  return (
    <div className="w-full min-h-screen bg-white overflow-hidden">
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

        {/* Hamburger Menu (same as Home) */}
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

      {/* Page Title */}
      <div className="text-center py-12 bg-gray-50">
        <h1 className="text-5xl font-bold text-sky-600">Our Doctors</h1>
        <p className="text-xl text-gray-600 mt-4">Book consultation with top specialists</p>
      </div>

      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {doctors.map((doc, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 p-6 text-center">
              <img
                src={`https://placehold.co/200x200?text=Dr.${i + 1}`}
                alt={doc.name}
                className="w-32 h-32 mx-auto rounded-full object-cover ring-4 ring-sky-100 mb-4"
              />
              <h3 className="text-2xl font-bold text-gray-800">{doc.name}</h3>
              <p className="text-sky-600 font-medium">{doc.specialty}</p>
              <div className="flex justify-center items-center gap-1 my-3">
                {[...Array(5)].map((_, idx) => (
                  <span key={idx} className={`text-2xl ${idx < 4.5 ? "text-yellow-500" : "text-gray-300"}`}>★</span>
                ))}
                <span className="ml-2 text-lg font-semibold">{doc.rating}</span>
              </div>
              <div className="flex justify-between items-center mt-6">
                <span className="text-2xl font-bold text-sky-600">{doc.fees}</span>
                <button className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}