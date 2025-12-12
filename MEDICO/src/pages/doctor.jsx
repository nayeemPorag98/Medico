import React from "react";
import { useNavigate } from "react-router-dom";

export default function Doctor() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  // ORIGINAL HARDCODED DOCTORS (As requested)
  // These will correspond to the accounts created by seed_doctors.js
  const doctors = [
    { name: "Dr. Fatima Rahman", specialty: "Neurologist", rating: "4.8", fees: "৳1100" },
    { name: "Dr. Syed Abdullah Al Mamun", specialty: "Pediatrician", rating: "5.0", fees: "৳700" },
    { name: "Dr. Ayesha Siddika", specialty: "Dermatologist", rating: "4.9", fees: "৳800" },
    { name: "Dr. Mohammad Omar Faruk", specialty: "General Physician", rating: "4.9", fees: "৳600" },
  ];

  /* 
  // Dynamic fetch removed to restore specific list
  React.useEffect(() => { ... }, []);
  */

  return (
    <div className="w-full min-h-screen bg-white overflow-hidden">
      {/* Navbar */}
      <header className="w-full h-24 bg-sky-500 flex items-center px-10 justify-between relative">
        <img
          src="/src/assets/login-banner.png"
          alt="MEDICO Logo"
          className="w-36 h-16 rounded-3xl cursor-pointer object-contain bg-white p-2 shadow-lg"
          onClick={() => navigate("/")}
        />
      </header>

      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {doctors.map((doc, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-xl p-6 text-center">
              <img
                src={`https://placehold.co/200x200?text=${encodeURIComponent(doc.name.split(" ").pop())}`}
                alt={doc.name}
                className="w-32 h-32 mx-auto rounded-full mb-4"
              />
              <h3 className="text-2xl font-bold text-gray-800">{doc.name}</h3>
              <p className="text-sky-600 font-medium">{doc.specialty || "Specialist"}</p>
              <div className="flex justify-between items-center mt-6">
                <span className="text-2xl font-bold text-sky-600">{doc.fees || "৳800"}</span>
                <button
                  className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition"
                  onClick={() => navigate(`/book-doctor/${encodeURIComponent(doc.name)}`)}
                >
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
