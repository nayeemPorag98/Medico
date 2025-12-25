const db = require("./db");

const DEFAULT_MEDICINES = [
    { name: "Paracetamol", price: 20 },
    { name: "Napa Extra", price: 30 },
    { name: "Ecosprin", price: 60 },
    { name: "Monas 10", price: 25 },
    { name: "Sergel 20", price: 70 },
    { name: "Napa", price: 15 },
    { name: "Ace", price: 18 },
    { name: "Ceevit", price: 25 },
    { name: "Histacin", price: 5 }
];

async function seedInitialMedicines() {
    console.log("Seeding Initial Medicines for Pharmacies...");

    try {
        // 1. Get all pharmacies
        const [pharmacies] = await db.promise().query("SELECT id, name FROM pharmacies");

        for (const p of pharmacies) {
            // 2. Check if pharmacy has medicines
            const [meds] = await db.promise().query("SELECT id FROM medicines WHERE pharmacy_id = ?", [p.id]);

            if (meds.length === 0) {
                console.log(`Pharmacy '${p.name}' (ID: ${p.id}) has no medicines. Seeding defaults...`);

                // 3. Insert defaults
                for (const m of DEFAULT_MEDICINES) {
                    await db.promise().query(
                        "INSERT INTO medicines (name, price, description, pharmacy_id) VALUES (?, ?, ?, ?)",
                        [m.name, m.price, "Standard Medicine", p.id]
                    );
                }
                console.log(`  -> Added ${DEFAULT_MEDICINES.length} medicines.`);
            } else {
                console.log(`Pharmacy '${p.name}' (ID: ${p.id}) already has ${meds.length} medicines. Skipping.`);
            }
        }
        console.log("Done.");
    } catch (err) {
        console.error("Error seeding medicines:", err.message);
    }
    process.exit();
}

seedInitialMedicines();
