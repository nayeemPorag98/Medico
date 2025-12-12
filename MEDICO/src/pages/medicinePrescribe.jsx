// src/pages/MedicinePrescribe.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MedicinePrescribe() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [notes, setNotes] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch all patients for dropdown
  useEffect(() => {
    fetch("http://localhost:5001/api/patients", {
      headers: { user: localStorage.getItem("user") },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setPatients(data.patients);
      });
  }, []);

  const handlePrescribe = async () => {
    if (!selectedPatient || !notes) {
      alert("Select a patient and write prescription notes.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          user: localStorage.getItem("user"),
        },
        body: JSON.stringify({
          doctorName: user.name,
          patientUsername: selectedPatient,
          medicines: [], // empty since we removed medicine selection
          notes: notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Prescription sent successfully!");
        setNotes("");
        setSelectedPatient("");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full h-24 bg-sky-500 flex items-center px-10 justify-between shadow-2xl z-50">
        <img
          src="/src/assets/login-banner.png"
          alt="MEDICO Logo"
          className="w-36 h-16 rounded-3xl cursor-pointer object-contain bg-white p-2 shadow-lg"
          onClick={() => navigate("/")}
        />

        <div className="hidden lg:flex items-center gap-12 text-xl font-medium">
          <button
            onClick={() => navigate("/doctor-home")}
            className="text-white hover:text-gray-200 transition"
          >
            Consultations
          </button>
          <button className="text-white hover:text-gray-200 transition">
            Medical History
          </button>
          <span className="text-white font-bold text-2xl">Prescription</span>
        </div>

        <div className="w-14 h-14 bg-gray-300 rounded-full ring-4 ring-white shadow-xl overflow-hidden">
          <img src="https://placehold.co/60x60" alt="Doctor" className="w-full h-full object-cover" />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="pt-32 px-10 max-w-4xl mx-auto space-y-8">

        {/* PATIENT SELECTION */}
        <div className="flex flex-col gap-4">
          <select
            className="p-4 text-xl rounded-xl border w-full"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
          >
            <option value="">-- Select Patient --</option>
            {patients.map((p) => (
              <option key={p.username} value={p.username}>
                {p.name} ({p.username})
              </option>
            ))}
          </select>

          {/* PRESCRIPTION NOTES */}
          <textarea
            placeholder="Write prescription notes..."
            className="w-full p-4 rounded-xl border h-48 text-lg"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

      </div>

      {/* PRESCRIBE BUTTON */}
      <div className="fixed bottom-16 right-16">
        <button
          onClick={handlePrescribe}
          className="w-72 h-28 bg-sky-500 hover:bg-sky-600 text-white text-4xl font-bold rounded-3xl shadow-2xl transition transform hover:scale-105 active:scale-95"
        >
          Prescribe
        </button>
      </div>
    </div>
  );
}
