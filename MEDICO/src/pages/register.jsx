import React, { useState } from "react";
import loginBanner from "../assets/login-banner.png";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [role, setRole] = useState("Patient");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialty, setSpecialty] = useState(""); // for doctors
  const [driverName, setDriverName] = useState(""); // for ambulance
  const navigate = useNavigate();

  const goToLogin = () => navigate("/login");

  const handleSubmit = async () => {
    if (!username || !password || !name) return alert("Fill all fields");
    if (password !== confirmPassword) return alert("Passwords do not match");

    let apiUrl = "http://localhost:5001/api/signup"; // adjust backend route
    const bodyData = { username, password, name, role };

    if (role === "Doctor") bodyData.specialty = specialty;
    if (role === "Ambulance") bodyData.driver_name = driverName;

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(`${role} registered successfully!`);
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server error!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <img src={loginBanner} alt="MEDICO" className="w-48 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-blue-700">WELCOME</h1>
        </div>

        <div className="space-y-7">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full max-w-md mx-auto block px-8 py-5 bg-gray-200 text-gray-800 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 text-center font-medium text-lg shadow-sm"
          />
          <input
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full max-w-md mx-auto block px-8 py-5 bg-gray-200 text-gray-800 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 text-center font-medium text-lg shadow-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full max-w-md mx-auto block px-8 py-5 bg-gray-200 text-gray-800 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 text-center font-medium text-lg shadow-sm"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full max-w-md mx-auto block px-8 py-5 bg-gray-200 text-gray-800 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 text-center font-medium text-lg shadow-sm"
          />

          {role === "Doctor" && (
            <input
              type="text"
              placeholder="Specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full max-w-md mx-auto block px-8 py-5 bg-gray-200 text-gray-800 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 text-center font-medium text-lg shadow-sm"
            />
          )}

          {role === "Ambulance" && (
            <input
              type="text"
              placeholder="Driver Name"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full max-w-md mx-auto block px-8 py-5 bg-gray-200 text-gray-800 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 text-center font-medium text-lg shadow-sm"
            />
          )}

          <div className="text-center">
            <p className="text-xl font-bold text-gray-800 mb-3">JOIN AS</p>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full max-w-md mx-auto block px-8 py-5 bg-gray-200 text-gray-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 text-center font-medium text-lg shadow-sm"
            >
              <option>Patient</option>
              <option>Doctor</option>
              <option>Pharmacy</option>
              <option>Ambulance</option>
              <option>Rider</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full max-w-md mx-auto block py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg text-xl"
          >
            Create Account
          </button>

          <button
            onClick={goToLogin}
            className="w-full max-w-md mx-auto block py-5 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl transition shadow-lg text-xl"
          >
            Back to Login
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-10">
          Join MEDICO as Patient, Doctor, Pharmacy, Ambulance or Rider
        </p>
      </div>
    </div>
  );
}
