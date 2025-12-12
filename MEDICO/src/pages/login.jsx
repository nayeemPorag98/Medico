import React, { useState } from "react";
import loginBanner from "../assets/login-banner.png";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState("Patient");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const goToRegister = () => navigate("/register");

  const handleLogin = async () => {
    if (!username || !password) return alert("Fill all fields");

    try {
      const res = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        // Redirect based on role
        if (role === "Patient") navigate("/");
        else if (role === "Doctor") navigate("/doctor-home");
        else if (role === "Pharmacy") navigate("/pharmacy-user");
        else if (role === "Ambulance") navigate("/ambulance");
        else if (role === "Rider") navigate("/rider");
      } else {
        alert(data.message || "Invalid credentials");
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
            placeholder="Username"
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
            onClick={handleLogin}
            className="w-full max-w-md mx-auto block py-5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition shadow-lg text-xl"
          >
            Login
          </button>

          <button
            onClick={goToRegister}
            className="w-full max-w-md mx-auto block py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg text-xl"
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
