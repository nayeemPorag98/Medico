const db = require("./db");

const doctors = [
    { name: "Dr. Fatima Rahman", username: "fatima", specialty: "Neurologist" },
    { name: "Dr. Syed Abdullah Al Mamun", username: "syed", specialty: "Pediatrician" },
    { name: "Dr. Ayesha Siddika", username: "ayesha", specialty: "Dermatologist" },
    { name: "Dr. Mohammad Omar Faruk", username: "omar", specialty: "General Physician" }
];

const password = "123"; // Simple password for all

console.log("Seeding specific doctors...");

doctors.forEach(doc => {
    // Check if exists first to avoid duplicates
    db.query("SELECT * FROM doctors WHERE username = ?", [doc.username], (err, results) => {
        if (err) {
            console.error("Error checking doctor:", err);
            return;
        }

        if (results.length > 0) {
            console.log(`Doctor ${doc.name} already exists.`);
        } else {
            const query = "INSERT INTO doctors (name, username, password, specialty) VALUES (?, ?, ?, ?)";
            db.query(query, [doc.name, doc.username, password, doc.specialty], (err, res) => {
                if (err) console.error("Error creating doctor:", err);
                else console.log(`Created account for: ${doc.name} (User: ${doc.username}, Pass: ${password})`);
            });
        }
    });
});

// Wait a bit then exit (simple script)
setTimeout(() => {
    console.log("\nSeeding complete. Press Ctrl+C if not exited.");
    process.exit(0);
}, 2000);
