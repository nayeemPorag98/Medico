// src/pages/medicalHistory.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function MedicalHistory() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white relative">
      {/* NAVBAR - SKY BLUE */}
      <div className="fixed top-0 left-0 w-full h-24 bg-sky-500 shadow-2xl z-50 flex items-center justify-between px-10">
        {/* LOGO */}
        <img
          src="/src/assets/tickLogo.png"
          alt="Logo"
          className="w-36 h-16 rounded-3xl object-contain bg-white shadow-lg cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* NAVBAR LINKS */}
        <div className="flex gap-20 text-xl font-medium">
          <button className="text-black hover:text-white transition">Consultations</button>
          <button className="text-black hover:text-white transition">Medical History</button>
          <button onClick={() => navigate("/prescription")} className="text-black hover:text-white transition">
            Prescription
          </button>
        </div>

        {/* PROFILE ICON */}
        <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden shadow-lg">
          <img src="https://placehold.co/50x50" alt="profile" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="pt-32 flex flex-col items-center px-8">

        {/* TITLE */}
        <h1 className="text-6xl font-bold text-black mt-10">Medical History</h1>

        {/* PATIENT PHOTO */}
        <div className="mt-10">
          <img
            src="https://placehold.co/300x300"
            alt="Patient"
            className="w-72 h-72 rounded-full shadow-2xl border-8 border-white"
          />
        </div>

        {/* PATIENT NAME */}
        <h2 className="mt-8 text-6xl font-bold text-black">Patient Name</h2>

        {/* HISTORY CARDS */}
        <div className="mt-16 space-y-32 max-w-7xl w-full">

          {/* CARD 1 */}
          <div className="bg-zinc-300 rounded-3xl h-48 shadow-2xl p-8 flex flex-col justify-center">
            <p className="text-3xl text-black"><strong>name:</strong> Paracetamol 500mg</p>
            <p className="text-3xl text-black"><strong>doctor name:</strong> Dr. Rahman</p>
            <p className="text-3xl text-black"><strong>pharmacy order:</strong> Delivered on 10 Nov 2025</p>
            <p className="text-3xl text-black"><strong>doctor feedback:</strong> Take after meal, 2 times daily</p>
          </div>

          {/* CARD 2 */}
          <div className="bg-zinc-300 rounded-3xl h-48 shadow-2xl p-8 flex flex-col justify-center">
            <p className="text-3xl text-black"><strong>name:</strong> Amoxicillin 250mg</p>
            <p className="text-3xl text-black"><strong>doctor name:</strong> Dr. Fatima</p>
            <p className="text-3xl text-black"><strong>pharmacy order:</strong> Dispensed on 15 Oct 2025</p>
            <p className="text-3xl text-black"><strong>doctor feedback:</strong> Complete full course of 5 days</p>
          </div>

        </div>
      </div>
    </div>
  );
}