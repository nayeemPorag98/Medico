// src/pages/DoctorHome.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorHome() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState({}); // store prescription per appointment
  const [notes, setNotes] = useState({}); // notes per appointment

  // Fetch logged-in doctor's appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      const user = localStorage.getItem("user");
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5001/api/appointments", {
          method: "GET",
          headers: { "Content-Type": "application/json", user },
        });
        const data = await res.json();
        if (data.success) setAppointments(data.appointments);
        else console.error("Fetch appointments failed:", data.message);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [navigate]);

  const handleStatus = async (id, status) => {
    try {
      const user = localStorage.getItem("user");
      if (!user) {
        navigate("/login");
        return;
      }

      const res = await fetch(`http://localhost:5001/api/appointments/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", user },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      else alert("Error: " + data.message);
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handlePrescribe = async (appt) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!prescriptions[appt.id] || prescriptions[appt.id].length === 0) {
      alert("Select at least one medicine");
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
          doctorUsername: user.username,
          patientUsername: appt.patient_name,
          medicines: prescriptions[appt.id],
          notes: notes[appt.id] || "",
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Prescription sent successfully!");
        setPrescriptions(prev => ({ ...prev, [appt.id]: [] }));
        setNotes(prev => ({ ...prev, [appt.id]: "" }));
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const toggleMedicine = (apptId, medName) => {
    setPrescriptions(prev => {
      const list = prev[apptId] || [];
      if (list.includes(medName)) {
        return { ...prev, [apptId]: list.filter(m => m !== medName) };
      } else {
        return { ...prev, [apptId]: [...list, medName] };
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full h-24 bg-sky-500 flex items-center px-10 justify-between shadow-2xl z-50">
        <img
          src="/src/assets/login-banner.png"
          alt="MEDICO Logo"
          className="w-36 h-16 rounded-3xl cursor-pointer object-contain bg-white p-2 shadow-lg"
          onClick={() => navigate("/")}
        />
        <h1 className="absolute left-1/2 -translate-x-1/2 top-6 text-5xl md:text-7xl font-black text-white tracking-wider drop-shadow-2xl">
          Consultations
        </h1>
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
            <div className="absolute right-0 top-20 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
              <button className="w-full text-left px-6 py-4 hover:bg-sky-50 transition font-medium text-gray-800">
                Profile
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
                className="w-full text-left px-6 py-4 hover:bg-sky-50 transition font-medium text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="pt-32 max-w-7xl mx-auto px-8 pb-20">
        {loading ? (
          <p className="text-center text-2xl text-gray-500 mt-20">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <div className="text-center mt-20">
            <h2 className="text-3xl font-bold text-gray-400">No Appointments Found</h2>
            <p className="text-xl text-gray-500 mt-4">You have no upcoming consultations.</p>
          </div>
        ) : (
          appointments.map(appt => (
            <div key={appt.id} className="mb-16 bg-gray-100 rounded-3xl p-12 shadow-2xl relative border border-gray-200 min-h-[400px]">
              <div className="pr-72">
                <h2 className="text-4xl font-bold mb-6 text-gray-900">
                  Patient Name: <span className="text-sky-600">{appt.patient_name}</span>
                </h2>
                <p className="text-2xl mb-8 text-gray-700">
                  <strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}
                </p>
                <p className="text-2xl leading-relaxed text-gray-800">
                  <strong>Reason:</strong> General Consultation
                </p>
              </div>

              <div className="absolute top-12 right-12 flex flex-col items-end gap-6">
                {appt.status === "Pending" || !appt.status ? (
                  <div className="flex flex-col gap-6">
                    <button
                      onClick={() => handleStatus(appt.id, "Accepted")}
                      className="w-48 h-16 bg-green-500 hover:bg-green-600 text-black font-bold text-2xl rounded-2xl shadow-xl transition transform hover:scale-110 active:scale-95"
                    >
                      ACCEPT
                    </button>
                    <button
                      onClick={() => handleStatus(appt.id, "Rejected")}
                      className="w-48 h-16 bg-red-600 hover:bg-red-700 text-white font-bold text-2xl rounded-2xl shadow-xl transition transform hover:scale-110 active:scale-95"
                    >
                      DECLINE
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      className={`px-8 py-4 rounded-2xl shadow-lg border-2 ${
                        appt.status === "Accepted"
                          ? "bg-green-100 border-green-500 text-green-700"
                          : "bg-red-100 border-red-500 text-red-700"
                      }`}
                    >
                      <p className="text-2xl font-bold uppercase">{appt.status}</p>
                      {appt.status === "Accepted" && (
                        <button
                          onClick={() => navigate("/video-consult")}
                          className="mt-4 px-6 py-2 bg-sky-600 text-white rounded-lg font-bold text-lg hover:bg-sky-700 transition"
                        >
                          Join Consult
                        </button>
                      )}
                    </div>

                    {/* PRESCRIPTION FORM */}
                    {appt.status === "Accepted" && (
                      <div className="mt-6 bg-white p-6 rounded-2xl shadow-md w-[400px]">
                        <h3 className="text-xl font-bold mb-2">Prescribe Medicines</h3>
                        <input
                          type="text"
                          placeholder="Add medicine name..."
                          className="w-full p-2 border rounded mb-2"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.target.value.trim()) {
                              toggleMedicine(appt.id, e.target.value.trim());
                              e.target.value = "";
                            }
                          }}
                        />
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(prescriptions[appt.id] || []).map((med, idx) => (
                            <span key={idx} className="px-2 py-1 bg-sky-200 rounded-full flex items-center gap-2">
                              {med}
                              <button
                                className="font-bold text-red-600"
                                onClick={() => toggleMedicine(appt.id, med)}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <textarea
                          placeholder="Notes..."
                          className="w-full p-2 border rounded mb-2"
                          value={notes[appt.id] || ""}
                          onChange={(e) =>
                            setNotes(prev => ({ ...prev, [appt.id]: e.target.value }))
                          }
                        />
                        <button
                          onClick={() => handlePrescribe(appt)}
                          className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded"
                        >
                          Send Prescription
                        </button>
                      </div>
                    )}
                  </>
                )}
                <div className="mt-6 bg-white px-8 py-4 rounded-2xl shadow-lg border-2 border-sky-200">
                  <p className="text-xl font-bold text-gray-800">
                    TIME: <span className="text-sky-600">{appt.time}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
