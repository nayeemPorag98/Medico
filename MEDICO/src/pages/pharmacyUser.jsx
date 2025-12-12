// src/pages/PharmacyUser.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PharmacyUser() {
  const navigate = useNavigate();

  // ===========================
  // PHARMACY MEDICINES STATE
  // ===========================
  const [medicines, setMedicines] = useState([
    { name: "Paracetamol", price: 20 },
    { name: "Amoxicillin", price: 90 },
    { name: "Cetirizine", price: 15 },
  ]);

  const [newMedicineName, setNewMedicineName] = useState("");
  const [newMedicinePrice, setNewMedicinePrice] = useState("");

  // ===========================
  // ADD MEDICINE FUNCTION
  // ===========================
  const addMedicine = () => {
    if (!newMedicineName || !newMedicinePrice) {
      alert("Enter medicine name and price");
      return;
    }
    setMedicines([...medicines, { name: newMedicineName, price: parseFloat(newMedicinePrice) }]);
    setNewMedicineName("");
    setNewMedicinePrice("");
    alert("Medicine added!");
  };

  // ===========================
  // PLACE ORDER FUNCTION
  // ===========================
  const handleOrder = async (patientName, pharmacyName, orderList) => {
    if (!orderList.length) return;

    // Calculate total price based on medicine state
    const totalPrice = orderList.reduce((sum, itemName) => {
      const med = medicines.find((m) => itemName.includes(m.name));
      return sum + (med ? med.price : 0);
    }, 0);

    try {
      const res = await fetch("http://localhost:5001/api/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user": localStorage.getItem("user")
        },
        body: JSON.stringify({ patientName, pharmacyName, orderList, totalPrice }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Order placed successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // ===========================
  // ORDER CARD COMPONENT
  // ===========================
  const OrderCard = ({ patientName, location, pharmacyName, orderList }) => (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
      <div className="bg-zinc-300 h-72 p-10 flex items-start justify-between">
        <div className="max-w-3xl pr-40">
          <h3 className="text-2xl font-bold text-black mb-4">
            Customer name: <span className="text-sky-600">{patientName}</span>
          </h3>
          <p className="text-xl text-black mb-8">
            location: <span className="font-semibold">{location}</span>
          </p>
          <div className="text-xl leading-relaxed font-medium text-gray-800">
            <strong>Order list:</strong><br />
            {orderList.map((item, idx) => (
              <React.Fragment key={idx}>
                • {item}<br />
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex gap-10">
          {/* ACCEPT */}
          <div
            className="w-20 h-20 rounded-full shadow-2xl flex items-center justify-center overflow-hidden hover:scale-110 transition cursor-pointer"
            onClick={() => handleOrder(patientName, pharmacyName, orderList)}
          >
            <img src="/src/assets/check.png" alt="Accept" className="w-16 h-16 object-contain" />
          </div>

          {/* DECLINE */}
          <div className="w-20 h-20 rounded-full shadow-2xl flex items-center justify-center overflow-hidden hover:scale-110 transition cursor-pointer">
            <img src="/src/assets/decline.png" alt="Decline" className="w-16 h-16 object-contain" />
          </div>
        </div>
      </div>
    </div>
  );

  // ===========================
  // SAMPLE ORDERS DATA
  // ===========================
  const orders = [
    {
      patientName: "Rahim Khan",
      location: "Dhanmondi, Dhaka",
      pharmacyName: "MedLife Pharmacy",
      orderList: ["Paracetamol 500mg × 20", "Amoxicillin 250mg × 30"],
    },
    {
      patientName: "Fatima Begum",
      location: "Mirpur 10, Dhaka",
      pharmacyName: "Wellness Pharmacy",
      orderList: ["Metformin 500mg × 60", "Amlodipine 5mg × 30"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full h-24 bg-sky-500 shadow-2xl z-50 flex items-center justify-between px-10">
        <img
          src="/src/assets/login-banner.png"
          alt="Logo"
          className="w-36 h-16 rounded-3xl object-contain bg-white shadow-lg cursor-pointer"
          onClick={() => navigate("/")}
        />
        <div className="text-black text-2xl font-bold">Prescription Orders</div>
        <div className="w-14 h-14 bg-white rounded-full shadow-xl overflow-hidden ring-4 ring-white">
          <img src="https://placehold.co/60x60" alt="profile" className="w-full h-full object-cover" />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="pt-32 px-8 max-w-7xl mx-auto space-y-20">
        {/* ADD MEDICINE */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-sky-600 mb-4">Add New Medicine</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Medicine Name"
              value={newMedicineName}
              onChange={(e) => setNewMedicineName(e.target.value)}
              className="border p-2 rounded-xl flex-1"
            />
            <input
              type="number"
              placeholder="Price"
              value={newMedicinePrice}
              onChange={(e) => setNewMedicinePrice(e.target.value)}
              className="border p-2 rounded-xl w-32"
            />
            <button
              onClick={addMedicine}
              className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700"
            >
              Add
            </button>
          </div>

          {/* DISPLAY CURRENT MEDICINES */}
          <div className="mt-4">
            <strong>Current Medicines:</strong>
            <ul className="list-disc pl-5 mt-2">
              {medicines.map((med, idx) => (
                <li key={idx}>
                  {med.name} - ৳{med.price}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ORDERS */}
        {orders.map((order, idx) => (
          <OrderCard key={idx} {...order} />
        ))}
      </div>
    </div>
  );
}
