// src/pages/Login.jsx
import React, { useState } from "react";
import loginBanner from "../assets/login-banner.png";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState("Patient");
  const navigate = useNavigate();

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg"> {/* Wider container */}

        {/* Logo + Title - Image stays narrow */}
        <div className="text-center mb-10">
          <img 
            src={loginBanner} 
            alt="MEDICO" 
            className="w-48 mx-auto mb-4" 
          />
          <h1 className="text-5xl font-bold text-blue-700">WELCOME</h1>
        
        </div>

        {/* Form Fields - Now Full Width & Modern */}
        <div className="space-y-7">

          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            className="w-full max-w-md mx-auto block px-8 py-5 bg-gray-200 text-gray-800 rounded-xl 
                     placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 
                     text-center font-medium text-lg shadow-sm"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
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

          {/* Login Button */}
          <button className="w-full max-w-md mx-auto block w-full py-5 bg-green-600 hover:bg-green-700 
                           text-white font-bold rounded-xl transition shadow-lg text-xl">
            Login
          </button>

          {/* Register Button */}
          <button
            onClick={goToRegister}
            className="w-full max-w-md mx-auto block w-full py-5 bg-blue-600 hover:bg-blue-700 
                     text-white font-bold rounded-xl transition shadow-lg text-xl"
          >
            SignUp
          </button>

        </div>

        <p className="text-center text-gray-500 text-sm mt-10">
          New here? Create your account now
        </p>
      </div>
    </div>
  );
}