const API_URL = 'http://localhost:5001/api';

async function request(endpoint, method, body = null, headers = {}) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json', ...headers },
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_URL}${endpoint}`, options);
    const data = await res.json();
    if (!res.ok) throw { status: res.status, data };
    return data;
}

async function runTest() {
    try {
        // 1. Register Users
        console.log("--- Registering Users ---");
        const patientUser = `testpat_${Date.now()}`;
        const doctorUser = `testdoc_${Date.now()}`;

        await request('/signup', 'POST', { username: patientUser, password: 'password', name: 'Test Patient', role: 'Patient' });
        await request('/signup', 'POST', { username: doctorUser, password: 'password', name: 'Dr. Test', role: 'Doctor', specialty: 'General' });
        console.log("Registered Patient and Doctor");

        // 2. Login Pharmacy & Add Medicine
        console.log("\n--- Pharmacy Flow ---");
        const pharmLogin = await request('/login', 'POST', { username: 'pharmacy1', password: 'password123', role: 'Pharmacy' });
        const pharmToken = JSON.stringify(pharmLogin.user);
        const pharmHeaders = { user: pharmToken };

        const medName = `Med_${Date.now()}`;
        await request('/medicines', 'POST', { name: medName, price: 100, description: 'Test Med Description' }, pharmHeaders);
        console.log("Added Medicine:", medName);

        // Verify Medicine List
        const meds = await request('/medicines', 'GET');
        const foundMed = meds.medicines.find(m => m.name === medName);
        if (foundMed) console.log("Verified Medicine in List:", foundMed.name);
        else console.error("FAILED: Medicine not found in list");

        // 3. Login Doctor & Prescribe
        console.log("\n--- Doctor Flow ---");
        const docLogin = await request('/login', 'POST', { username: doctorUser, password: 'password', role: 'Doctor' });
        const docToken = JSON.stringify(docLogin.user);
        const docHeaders = { user: docToken };

        await request('/prescriptions', 'POST', { patientName: 'Test Patient', medicineName: medName, dosage: '1 tablet' }, docHeaders);
        console.log("Prescribed Medicine to Test Patient");

        // 4. Login Patient & Check Prescriptions
        console.log("\n--- Patient Flow ---");
        const patLogin = await request('/login', 'POST', { username: patientUser, password: 'password', role: 'Patient' });
        const patToken = JSON.stringify(patLogin.user);
        const patHeaders = { user: patToken };

        const presc = await request('/prescriptions', 'GET', null, patHeaders);
        const myPresc = presc.prescriptions.find(p => p.medicine_name === medName);

        if (myPresc) console.log("Verified Prescription:", myPresc.medicine_name, myPresc.dosage);
        else console.error("FAILED: Prescription not found");

    } catch (err) {
        if (err.data) {
            console.error("Test Failed:", err.status, err.data);
        } else {
            console.error("Test Failed:", err);
        }
    }
}

runTest();
