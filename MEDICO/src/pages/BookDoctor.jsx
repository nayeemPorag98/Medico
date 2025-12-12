import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BookDoctor() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleBooking = async () => {
    if (!patientName || !date || !time) return;

    try {
      const res = await fetch("http://localhost:5001/api/book-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user": localStorage.getItem("user")
        },
        body: JSON.stringify({ patientName, doctorName: name, date, time }),
      });
      const data = await res.json();
      console.log("Booking Response:", data);

      if (data.success) {
        alert("Appointment booked successfully!");
        navigate("/doctor");
      } else {
        console.error("Booking Failed:", data.message);
        // Show the specific error message from server (e.g. "Time slot too close")
        alert(data.message);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Server connection error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-bold text-sky-600 mb-6">Book Doctor</h1>
      <p className="text-2xl text-gray-700 mb-6">
        Booking with <span className="font-semibold">{name}</span>
      </p>

      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
        <input
          type="text"
          placeholder="Your Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-300"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-300"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-300"
        />
        <button
          onClick={handleBooking}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition"
        >
          Confirm Booking
        </button>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 text-sky-600 underline font-medium"
      >
        Go Back
      </button>
    </div>
  );
}
