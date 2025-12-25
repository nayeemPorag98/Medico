const express = require("express");
const cors = require("cors");
const db = require("./db"); // MySQL connection pool
require("dotenv").config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "user", "Authorization"]
}));

app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ======================
// AUTH MIDDLEWARE
// ======================
function auth(req, res, next) {
  let rawUser = req.headers["user"];
  if (!rawUser) return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });

  try {
    // If header is URL encoded (valid JSON starts with { which is %7B encoded)
    if (rawUser.startsWith("%7B")) {
      rawUser = decodeURIComponent(rawUser);
    }
    const user = JSON.parse(rawUser);
    req.user = user;
  } catch {
    return res.status(400).json({ success: false, message: "Invalid user data" });
  }
  next();
}

// ======================
// LOGIN
// ======================
app.post("/api/login", (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) return res.status(400).json({ success: false, message: "Missing fields" });

  let query, params;
  if (role === "Patient") {
    query = "SELECT * FROM patients WHERE username=? AND password=?";
    params = [username, password];
  } else if (role === "Doctor") {
    query = "SELECT * FROM doctors WHERE username=? AND password=?";
    params = [username, password];
  } else if (role === "Pharmacy") {
    query = "SELECT * FROM pharmacies WHERE username=? AND password=?";
    params = [username, password];
  } else if (role === "Admin") {
    query = "SELECT * FROM admins WHERE username=? AND password=?";
    params = [username, password];
  } else {
    return res.status(400).json({ success: false, message: "Invalid role" });
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Login DB Error: " + err.message });
    if (results.length === 0) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const user = results[0];
    user.role = role;
    res.json({ success: true, user });
  });
});

// ======================
// SIGNUP
// ======================
app.post("/api/signup", (req, res) => {
  const { username, password, name, role, specialty } = req.body;
  if (!username || !password || !name || !role) return res.status(400).json({ success: false, message: "Missing fields" });

  let query, params;
  if (role === "Patient") {
    query = "INSERT INTO patients (username, password, name) VALUES (?, ?, ?)";
    params = [username, password, name];
  } else if (role === "Doctor") {
    query = "INSERT INTO doctors (username, password, name, specialty) VALUES (?, ?, ?, ?)";
    params = [username, password, name, specialty || null];
  } else if (role === "Pharmacy") {
    query = "INSERT INTO pharmacies (username, password, name, location) VALUES (?, ?, ?, ?)";
    params = [username, password, name, req.body.location || null];
  } else {
    return res.status(400).json({ success: false, message: "Invalid role" });
  }

  db.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error during registration" });
    res.json({ success: true, message: `${role} registered successfully` });
  });
});

// ======================
// GET ALL DOCTORS
// ======================
app.get("/api/doctors", (req, res) => {
  db.query("SELECT name, specialty, fees FROM doctors", (err, results) => {
    if (err) return res.json({ success: true, doctors: [] });
    res.json({ success: true, doctors: results });
  });
});

// ======================
// BOOK APPOINTMENT
// ======================
app.post("/api/book-appointment", auth, (req, res) => {
  const { patientName, doctorName, date, time } = req.body;
  if (!patientName || !doctorName || !date || !time) return res.status(400).json({ success: false, message: "All fields required" });

  const overlapQuery = "SELECT time FROM appointments WHERE doctor_name=? AND date=? AND status != 'Rejected'";
  db.query(overlapQuery, [doctorName, date], (err, existingAppts) => {
    if (err) return res.status(500).json({ success: false, message: "DB error during overlap check" });

    const requestedTime = new Date(`${date}T${time}`);
    const MIN_GAP_MS = 25 * 60 * 1000;

    const hasConflict = existingAppts.some(appt => Math.abs(new Date(`${date}T${appt.time}`) - requestedTime) < MIN_GAP_MS);
    if (hasConflict) return res.status(409).json({ success: false, message: "Time slot conflict (25 min gap required)" });

    const query = "INSERT INTO appointments (patient_name, doctor_name, date, time, status) VALUES (?, ?, ?, ?, 'Pending')";
    db.query(query, [patientName, doctorName, date, time], (err, results) => {
      if (err) return res.status(500).json({ success: false, message: "DB error: " + err.message });
      res.json({ success: true, message: "Appointment booked successfully" });
    });
  });
});

// ======================
// GET DOCTOR APPOINTMENTS
// ======================
app.get("/api/appointments", auth, (req, res) => {
  const doctor = req.user;
  if (!doctor || doctor.role !== "Doctor") return res.status(403).json({ success: false, message: "Access denied" });

  const query = "SELECT * FROM appointments WHERE doctor_name=? ORDER BY date ASC, time ASC";
  db.query(query, [doctor.name], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "DB error fetching appointments" });
    res.json({ success: true, appointments: results });
  });
});

// ======================
// UPDATE APPOINTMENT STATUS
// ======================
app.put("/api/appointments/:id/status", auth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['Accepted', 'Rejected'].includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });

  db.query("UPDATE appointments SET status=? WHERE id=?", [status, id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "DB error updating status" });
    res.json({ success: true, message: `Appointment ${status}` });
  });
});

// ======================
// PRESCRIPTIONS & MEDICINES
// ======================
app.post("/api/prescriptions", auth, (req, res) => {
  const { patientName, medicines } = req.body; // medicines = [{ name: '...', dosage: '...' }, ...]
  const doctorName = req.user.name;

  if (!patientName || !medicines || !Array.isArray(medicines) || medicines.length === 0) {
    return res.status(400).json({ success: false, message: "Missing fields or invalid medicines list" });
  }

  const medicinesJson = JSON.stringify(medicines);

  const query = "INSERT INTO prescriptions (patient_name, doctor_name, medicines, date) VALUES (?, ?, ?, NOW())";
  db.query(query, [patientName, doctorName, medicinesJson], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "DB error adding prescription: " + err.message });
    res.json({ success: true, message: "Prescription added successfully" });
  });
});

app.get("/api/prescriptions", auth, (req, res) => {
  const user = req.user;
  // If Patient, show their prescriptions. If Doctor, maybe show all they prescribed? 
  // Requirement says: "when the patient will logged in he will see that in prescription section"

  let query, params;
  if (user.role === 'Patient') {
    query = "SELECT * FROM prescriptions WHERE patient_name = ? ORDER BY date DESC";
    params = [user.name];
  } else {
    // Fallback or specific logic for doctors
    query = "SELECT * FROM prescriptions WHERE doctor_name = ? ORDER BY date DESC";
    params = [user.name];
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "DB error fetching prescriptions" });
    res.json({ success: true, prescriptions: results });
  });
});

app.post("/api/medicines", auth, (req, res) => {
  const { name, price, description } = req.body;
  const pharmacyId = req.user.id; // Assumes Pharmacy user is logged in

  if (req.user.role !== 'Pharmacy') return res.status(403).json({ success: false, message: "Only Pharmacy can add medicines" });

  const query = "INSERT INTO medicines (name, price, description, pharmacy_id) VALUES (?, ?, ?, ?)";
  db.query(query, [name, price, description, pharmacyId], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "DB error adding medicine" });
    res.json({ success: true, message: "Medicine added successfully" });
  });
});

app.post("/api/place-order", auth, (req, res) => {
  const { patientName, pharmacyName, orderList } = req.body;

  if (!patientName || !pharmacyName || !orderList || !orderList.length) {
    return res.status(400).json({ success: false, message: "Missing order details" });
  }

  let totalPrice = 0;
  try {
    orderList.forEach(item => {
      totalPrice += (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1);
    });
  } catch (e) {
    totalPrice = 0;
  }

  const orderListJson = JSON.stringify(orderList);

  const query = "INSERT INTO medicine_orders (patient_name, pharmacy_name, order_list, total_price, created_at) VALUES (?, ?, ?, ?, NOW())";
  db.query(query, [patientName, pharmacyName, orderListJson, totalPrice], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "DB error placing order: " + err.message });
    res.json({ success: true, message: "Order placed successfully" });
  });
});

app.get("/api/medicines", (req, res) => {
  const query = `
        SELECT m.*, p.name as pharmacy_name, p.location 
        FROM medicines m 
        JOIN pharmacies p ON m.pharmacy_id = p.id
    `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "DB error fetching medicines" });
    res.json({ success: true, medicines: results });
  });
});

app.get("/api/pharmacies-list", (req, res) => {
  db.query("SELECT * FROM pharmacies", (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "DB error fetching pharmacies" });
    res.json({ success: true, pharmacies: results });
  });
});


// ======================
// ADMIN ROUTES
// ======================

// GET Admin Dashboard Data
app.get("/api/admin/data", auth, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ success: false, message: "Admin access required" });

  const doctorsQuery = "SELECT id, name, username, specialty FROM doctors";
  const pharmaciesQuery = "SELECT id, name, username, location FROM pharmacies";
  const appointmentsQuery = "SELECT * FROM appointments ORDER BY date DESC, time ASC";

  db.query(doctorsQuery, (err, doctors) => {
    if (err) return res.status(500).json({ success: false, message: "Error fetching doctors" });

    db.query(pharmaciesQuery, (err, pharmacies) => {
      if (err) return res.status(500).json({ success: false, message: "Error fetching pharmacies" });

      db.query(appointmentsQuery, (err, appointments) => {
        if (err) return res.status(500).json({ success: false, message: "Error fetching appointments" });

        res.json({ success: true, doctors, pharmacies, appointments });
      });
    });
  });
});

// ADD Doctor
app.post("/api/admin/doctors", auth, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ success: false, message: "Admin access required" });
  const { name, specialty, fees } = req.body;

  if (!name) return res.status(400).json({ success: false, message: "Missing Name" });

  const username = name.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 100);
  const password = "password123";

  const query = "INSERT INTO doctors (username, password, name, specialty, fees) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [username, password, name, specialty || null, fees || '৳800'], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "DB Error: " + err.message });
    res.json({ success: true, message: `Doctor added! Login: ${username} / ${password}` });
  });
});

// DELETE Doctor
app.delete("/api/admin/doctors/:id", auth, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ success: false, message: "Admin access required" });
  const { id } = req.params;

  db.query("DELETE FROM doctors WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "DB Error deleting doctor" });
    res.json({ success: true, message: "Doctor deleted successfully" });
  });
});

// ADD Pharmacy
app.post("/api/admin/pharmacies", auth, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ success: false, message: "Admin access required" });
  const { name, location } = req.body;

  if (!name) return res.status(400).json({ success: false, message: "Missing Name" });

  const username = name.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 100);
  const password = "password123";

  const query = "INSERT INTO pharmacies (username, password, name, location) VALUES (?, ?, ?, ?)";
  db.query(query, [username, password, name, location || null], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "DB Error: " + err.message });
    res.json({ success: true, message: `Pharmacy added! Login: ${username} / ${password}` });
  });
});

// DELETE Pharmacy
app.delete("/api/admin/pharmacies/:id", auth, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ success: false, message: "Admin access required" });
  const { id } = req.params;

  db.query("DELETE FROM pharmacies WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "DB Error deleting pharmacy" });
    res.json({ success: true, message: "Pharmacy deleted successfully" });
  });
});

// CANCEL Appointment
app.put("/api/admin/appointments/:id/cancel", auth, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ success: false, message: "Admin access required" });
  const { id } = req.params;

  db.query("UPDATE appointments SET status='Rejected' WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "DB Error cancelling appointment" });
    res.json({ success: true, message: "Appointment cancelled successfully" });
  });
});
// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
