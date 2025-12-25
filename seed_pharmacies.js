const db = require("./db");

async function seedPharmacies() {
    const pharmacies = [
        { name: "MedLife Pharmacy", location: "Mirpur", medicines: [{ name: "Paracetamol", price: 20 }, { name: "Napa Extra", price: 30 }] },
        { name: "Apollo Pharmacy", location: "Badda", medicines: [{ name: "Azithromycin", price: 120 }, { name: "Antacid", price: 40 }] },
        { name: "Wellness Forever", location: "Uttara", medicines: [{ name: "Vitamin C", price: 150 }, { name: "Zinc Tablets", price: 160 }] },
        { name: "Guardian Pharmacy", location: "Bashundhora", medicines: [{ name: "Amoxicillin", price: 90 }, { name: "Napa", price: 15 }] },
        { name: "Noble Plus", location: "Tongi", medicines: [{ name: "Saline", price: 85 }, { name: "Pain Killer", price: 70 }] },
        { name: "HealthHub", location: "Banani", medicines: [{ name: "Metformin", price: 55 }, { name: "Insulin", price: 500 }] },
    ];

    console.log("Seeding pharmacies...");

    for (const p of pharmacies) {
        try {
            const username = p.name.replace(/\s+/g, '').toLowerCase();
            const password = 'password123';

            // Check if exists
            const [rows] = await db.promise().query("SELECT id FROM pharmacies WHERE name = ?", [p.name]);
            let pharmacyId;

            if (rows.length > 0) {
                pharmacyId = rows[0].id;
                console.log(`Pharmacy ${p.name} exists.`);
            } else {
                const [res] = await db.promise().query("INSERT INTO pharmacies (username, password, name, location) VALUES (?, ?, ?, ?)",
                    [username, password, p.name, p.location]);
                pharmacyId = res.insertId;
                console.log(`Created pharmacy ${p.name}. Credentials: ${username} / ${password}`);
            }

            // Add medicines
            for (const m of p.medicines) {
                // Check if med exists for THIS pharmacy
                const [medRows] = await db.promise().query("SELECT id FROM medicines WHERE name = ? AND pharmacy_id = ?", [m.name, pharmacyId]);
                if (medRows.length === 0) {
                    await db.promise().query("INSERT INTO medicines (name, price, description, pharmacy_id) VALUES (?, ?, ?, ?)",
                        [m.name, m.price, 'Standard description', pharmacyId]);
                    console.log(`  Added ${m.name}`);
                }
            }

        } catch (err) {
            console.error(`Error seeding ${p.name}:`, err.message);
        }
    }
    process.exit();
}

seedPharmacies();
