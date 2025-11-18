// src/pages/Register.jsx
import React, { useState } from "react";
import loginBanner from "../assets/login-banner.png";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [role, setRole] = useState("Patient");
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">

        {/* Logo + Title */}
        <div className="text-center mb-10">
          <img 
            src={loginBanner} 
            alt="MEDICO" 
            className="w-48 mx-auto mb-4" 
          />
          <h1 className="text-5xl font-bold text-blue-700">WELCOME</h1>
        
        </div>

        {/* Registration Form */}
        <div className="space-y-7">

          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full max-w-md mx-auto block px-8 py-5 bg-gray-200 text-gray-800 rounded-xl 
                     placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 
                     text-center font-medium text-lg shadow-sm"
          />

          {/* Username or Email */}
          <input
            type="text"
            placeholder="Username or Email"
            className="w-full max-w-md mx-auto block px-8 py-5 bg-gray-200 text-gray-800 rounded-xl 
                     placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 
                     text-center font-medium text-lg shadow-sm"
          />

          {/* Password */}
          <input
            extra="true"
            type="password"
            placeholder="Password"
            className="w-full max-w-md mx-auto block px-8 py-5 bg-gray-200 text-gray-800 rounded-xl 
                     placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 
                     text-center font-medium text-lg shadow-sm"
          />

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full max-w-md mx-auto block px-8 py-5 bg-gray-200 text-gray-800 rounded-xl 
                     placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 
                     text-center font-medium text-lg shadow-sm"
          />

          {/* JOIN AS - On its own line */}
          <div className="text-center">
            <p className="text-xl font-bold text-gray-800 mb-3">JOIN AS</p>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full max-w-md mx-auto block px-8 py-5 bg-gray-200 text-gray-800 rounded-xl 
                       focus:outline-none focus:ring-4 focus:ring-blue-300 
                       text-center font-medium text-lg shadow-sm"
            >
              <option>Patient</option>
              <option>Doctor</option>
              <option>Pharmacy</option>
              <option>Ambulance</option>
              <option>Rider</option>
            </select>
          </div>

          {/* Create Account Button */}
          <button className="w-full max-w-md mx-auto block py-5 bg-blue-600 hover:bg-blue-700 
                           text-white font-bold rounded-xl transition shadow-lg text-xl">
            Create Account
          </button>

          {/* Back to Login */}
          <button
            onClick={goToLogin}
            className="w-full max-w-md mx-auto block py-5 bg-gray-600 hover:bg-gray-700 
                     text-white font-bold rounded-xl transition shadow-lg text-xl"
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