import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Check login status
  const storedUser = localStorage.getItem("user");

  // If no user found → block access
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  // Parse user (optional but safe)
  let user = null;
  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    // If stored value is corrupted → logout user automatically
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  // If user is valid → allow page
  return children;
}
