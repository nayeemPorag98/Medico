// server.js
const express = require("express");
const cors = require("cors");
const db = require("./db"); // MySQL pool/connection
require("dotenv").config();

const app = express();

// --------------------
// Middlewares
// --------------------
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "user", "authorization", "Authorization"]
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --------------------
// Helper: parse user header safely
// --------------------
function parseUserHeader(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    try {
      const double = JSON.parse(JSON.parse(raw));
      if (typeof double === "object") return double;
    } catch {}
    return null;
  }
}

// --------------------
// Auth middleware
// --------------------
function auth(req, res, next) {
  const rawUser = req.headers["user"];
  if (!rawUser) return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });

  const user = parseUserHeader(rawUser);
  if (!user || !user.username || !user.role) {
    return res.status(400).json({ success: false, message: "Invalid user data in header." });
  }

  req.user = user;
  next();
}

// --------------------
// LOGIN
// --------------------
app.post("/api/login", (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) return res.status(400).json({ success: false, message: "Missing fields" });

  let query;
  if (role === "Patient") query = "SELECT id, username, name FROM patients WHERE username=? AND password=?";
  else if (role === "Doctor") query = "SELECT id, username, name FROM doctors WHERE username=? AND password=?";
  else if (role === "Pharmacy") query = "SELECT id, username, name, address, phone FROM pharmacy WHERE username=? AND password=?";
  else return res.status(400).json({ success: false, message: "Invalid role" });

  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "DB Error: " + err.message });
    if (!results || results.length === 0) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const user = results[0];
    user.role = role;
    res.json({ success: true, user });
  });
});

// --------------------
// SIGNUP
// --------------------
app.post("/api/signup", (req, res) => {
  const { username, password, name, role, specialty, address, phone } = req.body;
  if (!username || !password || !name || !role) return res.status(400).json({ success: false, message: "Missing fields" });

  let query, params;
  if (role === "Patient") {
    query = "INSERT INTO patients (username, password, name) VALUES (?, ?, ?)";
    params = [username, password, name];
  } else if (role === "Doctor") {
    query = "INSERT INTO doctors (username, password, name, specialty) VALUES (?, ?, ?, ?)";
    params = [username, password, name, specialty || null];
  } else if (role === "Pharmacy") {
    query = "INSERT INTO pharmacy (username, password, name, address, phone) VALUES (?, ?, ?, ?, ?)";
    params = [username, password, name, address || null, phone || null];
  } else return res.status(400).json({ success: false, message: "Invalid role" });

  db.query(query, params, (err) => {
    if (err) return res.status(500).json({ success: false, message: "DB Error: " + err.message });
    res.json({ success: true, message: `${role} registered successfully` });
  });
});

// --------------------
// GET list of patients (Doctor only)
// --------------------
app.get("/api/patients", auth, (req, res) => {
  if (req.user.role !== "Doctor") return res.status(403).json({ success: false, message: "Access denied" });

  db.query("SELECT username, name FROM patients", (err, results) => {
    if (err) return res.status(500).json({ success: false, patients: [] });
    res.json({ success: true, patients: results });
  });
});

// --------------------
// UPDATE APPOINTMENT STATUS (Doctor)
// --------------------
app.put("/api/appointments/:id/status", auth, (req, res) => {
  if (req.user.role !== "Doctor") return res.status(403).json({ success: false, message: "Only doctor can update status" });

  const { id } = req.params;
  const { status } = req.body;
  if (!["Accepted", "Rejected"].includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });

  db.query("UPDATE appointments SET status=? WHERE id=?", [status, id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "DB error updating status" });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Appointment not found" });

    res.json({ success: true, message: `Appointment ${status}` });
  });
});

// --------------------
// GET all medicines (Doctor fetch)
// --------------------
app.get("/api/medicines", auth, (req, res) => {
  if (req.user.role !== "Doctor") return res.status(403).json({ success: false, message: "Access denied" });

  db.query("SELECT pharmacy_name, name, price FROM medicines", (err, results) => {
    if (err) return res.status(500).json({ success: false, medicines: [] });
    res.json({ success: true, medicines: results });
  });
});

// --------------------
// BOOK APPOINTMENT (Patient)
// --------------------
app.post("/api/book-appointment", auth, (req, res) => {
  if (req.user.role !== "Patient") return res.status(403).json({ success: false, message: "Only patients can book appointments" });

  const { doctorName, date, time } = req.body;
  if (!doctorName || !date || !time) return res.status(400).json({ success: false, message: "All fields required" });

  db.query("SELECT time FROM appointments WHERE doctor_name=? AND date=? AND status!='Rejected'", [doctorName, date], (err, existing) => {
    if (err) return res.status(500).json({ success: false, message: "DB error" });

    const requestedTime = new Date(`${date}T${time}`);
    const MIN_GAP_MS = 25 * 60 * 1000;
    const hasConflict = existing.some(appt => Math.abs(requestedTime - new Date(`${date}T${appt.time}`)) < MIN_GAP_MS);
    if (hasConflict) return res.status(409).json({ success: false, message: "Time slot conflict (25 min gap required)" });

    db.query("INSERT INTO appointments (patient_name, doctor_name, date, time, status, created_at) VALUES (?, ?, ?, ?, 'Pending', NOW())",
      [req.user.name, doctorName, date, time],
      (err) => {
        if (err) return res.status(500).json({ success: false, message: "DB insert error: " + err.message });
        res.json({ success: true, message: "Appointment booked successfully" });
      }
    );
  });
});

// --------------------
// GET APPOINTMENTS
// --------------------
app.get("/api/appointments", auth, (req, res) => {
  const user = req.user;
  let q, params;
  if (user.role === "Doctor") { q = "SELECT * FROM appointments WHERE doctor_name=? ORDER BY date ASC, time ASC"; params = [user.name]; }
  else if (user.role === "Patient") { q = "SELECT * FROM appointments WHERE patient_name=? ORDER BY date ASC, time ASC"; params = [user.name]; }
  else return res.status(403).json({ success: false, message: "Access denied" });

  db.query(q, params, (err, results) => {
    if (err) return res.status(500).json({ success: false, appointments: [] });
    res.json({ success: true, appointments: results });
  });
});

// --------------------
// POST prescription (Doctor)
// --------------------
app.post("/api/prescriptions", auth, (req, res) => {
  if (req.user.role !== "Doctor") return res.status(403).json({ success: false, message: "Only doctors can prescribe" });

  const { patientUsername, medicines, notes } = req.body;
  if (!patientUsername) return res.status(400).json({ success: false, message: "Patient is required" });

  db.query("INSERT INTO prescriptions (doctor_name, patient_username, medicines, notes, created_at) VALUES (?, ?, ?, ?, NOW())",
    [req.user.name, patientUsername, JSON.stringify(Array.isArray(medicines) ? medicines : []), notes || ""],
    (err) => {
      if (err) return res.status(500).json({ success: false, message: "DB error saving prescription: " + err.message });
      res.json({ success: true, message: "Prescription saved and sent to patient" });
    }
  );
});

// --------------------
// ORDER MEDICINE (Patient)
// --------------------
app.post("/api/order-medicine", auth, (req, res) => {
  if (req.user.role !== "Patient") return res.status(403).json({ success: false, message: "Only patients can order medicines" });

  const { pharmacyName, items } = req.body;
  if (!pharmacyName || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "Pharmacy and items are required" });
  }

  const validItems = items.map(item => ({
    name: item.name,
    quantity: Number(item.quantity),
    price: Number(item.price)
  }));

  const totalPrice = validItems.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const query = `
    INSERT INTO medicine_orders (patient_name, pharmacy_name, order_list, total_price, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(query, [req.user.name, pharmacyName, JSON.stringify(validItems), totalPrice], (err, result) => {
    if (err) {
      console.error("Order medicine DB error:", err);
      return res.status(500).json({ success: false, message: "Database error while placing order" });
    }

    res.json({ success: true, message: "Medicine order placed successfully", orderId: result.insertId });
  });
});

// --------------------
// GET prescriptions for logged-in patient
// --------------------
app.get("/api/patient/prescriptions", auth, (req, res) => {
  if (req.user.role !== "Patient") {
    return res.status(403).json({ success: false, message: "Only patients can view prescriptions" });
  }

  const username = req.user.username;

  db.query(
    "SELECT id, doctor_name, patient_username, medicines, notes, created_at FROM prescriptions WHERE patient_username=? ORDER BY created_at DESC",
    [username],
    (err, results) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ success: false, prescriptions: [], message: err.message });
      }

      // parse medicines JSON string
      const prescriptions = results.map(p => ({
        ...p,
        medicines: JSON.parse(p.medicines || "[]")
      }));

      res.json({ success: true, prescriptions });
    }
  );
});
// --------------------
// ADD NEW MEDICINE (Pharmacy only)
// --------------------
app.post("/api/medicines", auth, (req, res) => {
  if (req.user.role !== "Pharmacy") 
    return res.status(403).json({ success: false, message: "Only pharmacy can add medicines" });

  const { name, price } = req.body;
  if (!name || !price) return res.status(400).json({ success: false, message: "Medicine name and price required" });

  db.query(
    "INSERT INTO new_medicines (pharmacy_name, name, price, created_at) VALUES (?, ?, ?, NOW())",
    [req.user.name, name, price],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: "Medicine added successfully", id: result.insertId });
    }
  );
});


// --------------------
// Start server
// --------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
