import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Pharmacy() {
  const navigate = useNavigate();

  // --------------------------
  // Static pharmacies (old list)
  // --------------------------
  const staticPharmacies = [
    {
      name: "MedLife Pharmacy",
      location: "Mirpur",
      medicines: [
        { name: "Paracetamol", price: 20 },
        { name: "Napa Extra", price: 30 },
        { name: "Ecosprin", price: 60 },
      ],
    },
    {
      name: "Apollo Pharmacy",
      location: "Badda",
      medicines: [
        { name: "Azithromycin", price: 120 },
        { name: "Antacid", price: 40 },
        { name: "Cetrizine", price: 10 },
      ],
    },
    {
      name: "Wellness Forever",
      location: "Uttara",
      medicines: [
        { name: "Vitamin C", price: 150 },
        { name: "Zinc Tablets", price: 160 },
        { name: "ORS", price: 25 },
      ],
    },
  ];

  const [pharmacies, setPharmacies] = useState(staticPharmacies);
  const [cartPharmacy, setCartPharmacy] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // --------------------------
  // Fetch new medicines from backend
  // --------------------------
  useEffect(() => {
    fetch("http://localhost:5001/api/medicines")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const newMedicines = data.medicines;

          // Group new medicines by pharmacy
          const grouped = {};
          newMedicines.forEach(med => {
            if (!grouped[med.pharmacy_name]) grouped[med.pharmacy_name] = [];
            grouped[med.pharmacy_name].push({ name: med.name, price: med.price });
          });

          // Merge static and new medicines
          const mergedPharmacies = [...staticPharmacies];

          Object.keys(grouped).forEach(name => {
            const existing = mergedPharmacies.find(p => p.name === name);
            if (existing) {
              // Add new medicines without duplicating
              grouped[name].forEach(med => {
                if (!existing.medicines.find(x => x.name === med.name)) {
                  existing.medicines.push(med);
                }
              });
            } else {
              // Add completely new pharmacy
              mergedPharmacies.push({
                name,
                location: "",
                medicines: grouped[name]
              });
            }
          });

          setPharmacies(mergedPharmacies);
        }
      })
      .catch(err => console.error("Fetch medicines error:", err));
  }, []);

  const addToCart = (pharmacy, medicine) => {
    if (cartPharmacy && cartPharmacy.name !== pharmacy.name) {
      alert("You can only order from one pharmacy at a time.");
      return;
    }
    setCartPharmacy(pharmacy);
    const existing = cartItems.find((item) => item.name === medicine.name);
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.name === medicine.name ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...medicine, quantity: 1 }]);
    }
  };

  const removeFromCart = (name) => {
    const newCart = cartItems.filter((item) => item.name !== name);
    setCartItems(newCart);
    if (newCart.length === 0) setCartPharmacy(null);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async () => {
    if (!cartItems.length) {
      alert("Cart is empty");
      return;
    }

    try {
      const userHeader = localStorage.getItem("user");
      if (!userHeader) {
        alert("You must log in first");
        return;
      }

      const res = await fetch("http://localhost:5001/api/order-medicine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user": userHeader
        },
        body: JSON.stringify({
          pharmacyName: cartPharmacy.name,
          items: cartItems
        }),
      });

      const data = await res.json();
      console.log("Order response:", data);

      if (data.success) {
        alert("Order placed successfully!");
        setCartItems([]);
        setCartPharmacy(null);
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Place order error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <header className="w-full h-24 bg-sky-500 flex items-center px-10 justify-between relative">
        <img
          src="/src/assets/login-banner.png"
          alt="MEDICO Logo"
          className="w-36 h-16 rounded-3xl cursor-pointer object-contain bg-white p-2 shadow-lg"
          onClick={() => navigate("/")}
        />
      </header>

      <div className="text-center mt-16">
        <h1 className="text-5xl font-bold text-sky-600">Order Medicines</h1>
        <p className="text-xl text-gray-600 mt-4">Choose from trusted pharmacies near you</p>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-12 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {pharmacies.map((pharmacy, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">
              <h3 className="text-3xl font-bold text-gray-800 text-center">{pharmacy.name}</h3>
              <p className="text-lg text-gray-600 text-center">{pharmacy.location}</p>

              <h4 className="text-xl font-semibold mt-6 mb-3">Medicines</h4>

              {pharmacy.medicines.map((med, mIndex) => (
                <div key={mIndex} className="flex justify-between bg-gray-100 p-3 rounded-xl mb-3">
                  <span className="font-medium">{med.name}</span>
                  <span className="font-bold">৳{med.price}</span>
                  <button
                    onClick={() => addToCart(pharmacy, med)}
                    className="ml-4 px-4 py-1 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 right-0 w-96 bg-white shadow-xl p-6 rounded-tl-2xl rounded-bl-2xl">
          <h2 className="text-2xl font-bold text-sky-600 mb-4">Your Cart</h2>
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between mb-2">
              <span>{item.name} × {item.quantity}</span>
              <span>৳{item.price * item.quantity}</span>
              <button onClick={() => removeFromCart(item.name)} className="text-red-500 font-medium ml-2">X</button>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Total:</span>
            <span>৳{totalPrice}</span>
          </div>
          <button onClick={placeOrder} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl mt-4">
            Confirm Order
          </button>
        </div>
      )}
    </div>
  );
}
