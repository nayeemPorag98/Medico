import React, { useEffect, useState } from "react";

export default function Prescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")); // Must have { username, role }

  useEffect(() => {
    if (!user || user.role !== "Patient") return;

    fetch("http://localhost:5001/api/patient/prescriptions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "user": JSON.stringify(user), // Important!
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPrescriptions(data.prescriptions);
        } else {
          console.log("No prescriptions found:", data.message);
        }
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-sky-600 mb-5">Your Prescriptions</h1>

      {prescriptions.length === 0 ? (
        <p className="text-gray-600 text-xl">No prescriptions found.</p>
      ) : (
        prescriptions.map(p => (
          <div key={p.id} className="bg-white p-6 shadow-md rounded-xl mb-4">
            <h2 className="text-xl font-bold text-sky-700">Dr. {p.doctor_name}</h2>
            <p className="mt-2"><strong>Medicines:</strong> {p.medicines.join(", ")}</p>
            <p className="mt-2"><strong>Notes:</strong> {p.notes}</p>
            <p className="mt-3 text-gray-500 text-sm">
              Date: {new Date(p.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
