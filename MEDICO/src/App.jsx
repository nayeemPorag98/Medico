import Home from "./pages/home";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import DoctorsList from "./pages/doctor";
import Pharmacy from "./pages/pharmacy";


function App() {
  return (
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctor" element={<DoctorsList />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        
        
      </Routes>
   
  );
}

export default App;
