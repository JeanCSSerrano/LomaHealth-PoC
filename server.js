const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// ==========================================
// --- TEMPORARY DATABASES ---
// ==========================================
let activeAppointments = [
    { reference: "APT-1004", name: "Juana Dela Cruz", date: "2026-06-15", time: "10:00 AM", service: "General Consultation", location: "Proper", status: "Attended" },
    { reference: "APT-1001", name: "Maria Santos", date: "2026-05-05", time: "07:45 AM", service: "General Consultation", location: "Proper", status: "Missed" },
    { reference: "APT-1002", name: "Jose Cruz", date: "2026-05-05", time: "07:45 AM", service: "Vaccination", location: "Deca", status: "Attended" },
    { reference: "APT-1003", name: "Linda Torres", date: "2026-05-05", time: "07:45 AM", service: "Medicine Retrieval", location: "Heritage", status: "Confirmed" }
];

let registeredResidents = [
    { name: "Juan Dela Cruz", age: 42, dob: "1984-09-19", sex: "Male", area: "Heritage", address: "Block 1 Lot 1 Fake St. Loma De Gato", email: "juandelacruz111@gmail.com", mobile: "09991112222", lastVisit: "2026-04-28", vaxStatus: "Complete" },
    { name: "Ana Reyes", age: 69, dob: "1957-02-14", sex: "Female", area: "Deca", address: "Phase 2 Block 4 Deca Homes", email: "anareyes_deca@yahoo.com", mobile: "09178889999", lastVisit: "2026-02-21", vaxStatus: "Incomplete" },
    { name: "Pedro Garcia", age: 67, dob: "1959-11-30", sex: "Male", area: "Heritage", address: "Block 5 Lot 12 Heritage Homes", email: "pedro.garcia@gmail.com", mobile: "09223334444", lastVisit: "2026-01-18", vaxStatus: "Overdue" },
    { name: "Teresa Villanueva", age: 42, dob: "1984-07-15", sex: "Female", area: "Proper", address: "Block 1 Lot 1 Proper Homes", email: "teresavillanueva@gmail.com", mobile: "09177778888", lastVisit: "2025-12-28", vaxStatus: "Complete" },
    { name: "Juana Dela Cruz", age: 27, dob: "1999-09-19", sex: "Female", area: "Proper", address: "123 Fake Street Brgy. Loma de Gato", email: "juanadelacruz@gmail.com", mobile: "091234567890", lastVisit: "2026-07-02", vaxStatus: "Complete" }
];

let medicineInventory = [
    { id: 1, name: "Amoxicillin 500mg", category: "Antibiotic", stock: "850/1000", expiry: "01-22-2026", supplier: "PhilPharma Inc.", status: "In stock" },
    { id: 2, name: "Paracetamol 500mg", category: "Analgesic", stock: "150/1200", expiry: "11-11-2025", supplier: "Generics Pharma", status: "Low Stock" },
    { id: 3, name: "Cetirizine 10mg", category: "Antihistamine", stock: "0/500", expiry: "04-10-2025", supplier: "MedSupply Corp", status: "Out of Stock" },
    { id: 4, name: "Metformin", category: "Antidiabetic", stock: "458/700", expiry: "02-11-2026", supplier: "Generics Pharma", status: "Out of Stock" }
];

let missionsData = [
    { id: 1, name: "Measles Vaccination Drive", area: "Heritage", date: "2026-05-10", bhws: "Jose Cruz, Linda Torres", households: 45, priority: "High", status: "planned" },
    { id: 2, name: "Dengue Prevention Campaign", area: "Deca", date: "2026-05-08", bhws: "Maria Santos", households: 38, priority: "High", status: "on going" },
    { id: 3, name: "Senior Health Check-up", area: "Proper", date: "2026-04-28", bhws: "Jose Cruz, Ana Reyes", households: 52, priority: "Medium", status: "completed" }
];

let staffData = [
    { id: 1, name: "Maria Santos", email: "maria.santos@lomahealth.gov.ph", role: "Admin", area: "N/A", status: "Active", lastLogin: "Today, 9:23 AM" },
    { id: 2, name: "Jose Cruz", email: "jose.cruz@lomahealth.gov.ph", role: "BHW", area: "Heritage", status: "Active", lastLogin: "Today, 9:23 AM" },
    { id: 3, name: "Linda Torres", email: "linda.torres@lomahealth.gov.ph", role: "BHW", area: "Deca", status: "Active", lastLogin: "Today, 9:23 AM" },
    { id: 4, name: "Rosa Mendoza", email: "rosa.mendoza@lomahealth.gov.ph", role: "BHW", area: "Proper", status: "Active", lastLogin: "Today, 9:23 AM" },
    { id: 5, name: "Dr. Ramon Fernandez", email: "ramon.fernandez@lomahealth.gov.ph", role: "Health Official", area: "Heritage", status: "Active", lastLogin: "Today, 9:23 AM" },
    { id: 6, name: "Dr. Anna Reyes", email: "anna.reyes@lomahealth.gov.ph", role: "Health Official", area: "Deca", status: "Active", lastLogin: "Today, 9:23 AM" },
    { id: 7, name: "Dr. Carlos Garcia", email: "carlos.garcia@lomahealth.gov.ph", role: "Health Official", area: "Proper", status: "Active", lastLogin: "Today, 9:23 AM" }
];

// ==========================================
// --- API ENDPOINTS ---
// ==========================================

// Dashboard Resident Data
app.get('/api/resident', (req, res) => {
    const juanaAppts = activeAppointments.filter(a => a.name === "Juana Dela Cruz");
    const latestApt = juanaAppts.length > 0 ? juanaAppts[0] : null;

    res.json({
        name: "Juana",
        upcomingAppointment: latestApt ? {
            service: latestApt.service, date: latestApt.date, time: latestApt.time, location: latestApt.location, status: latestApt.status
        } : { service: "No upcoming appointments", date: "-", time: "-", location: "-", status: "N/A" },
        recentActivity: [
            { name: "Polio vaccine", date: "Received Jun 12, 2026", status: "Complete" },
            { name: "Paracetamol 500mg", date: "Received May 25, 2026", status: "Complete" }
        ],
        summary: { appointments: juanaAppts.length, records: 3 }
    });
});

app.get('/api/appointments', (req, res) => { res.json(activeAppointments); });
app.post('/api/appointments', (req, res) => {
    const newAppointment = req.body;
    newAppointment.reference = "APT-" + Math.floor(1000 + Math.random() * 9000);
    newAppointment.status = newAppointment.status || "Pending"; 
    if (!newAppointment.name) newAppointment.name = "Juana Dela Cruz";
    activeAppointments.unshift(newAppointment); 
    res.json({ success: true });
});
app.put('/api/appointments/:ref', (req, res) => {
    const index = activeAppointments.findIndex(a => a.reference === req.params.ref);
    if (index !== -1) activeAppointments[index].status = req.body.status;
    res.json({ success: true });
});

// Resident Endpoints
app.get('/api/residents', (req, res) => { res.json(registeredResidents); });
app.post('/api/residents', (req, res) => {
    const newRes = req.body;
    newRes.lastVisit = "N/A"; newRes.vaxStatus = "Incomplete"; 
    registeredResidents.unshift(newRes); 
    res.json({ success: true });
});
app.put('/api/residents/:name', (req, res) => {
    const index = registeredResidents.findIndex(r => r.name === req.params.name);
    if(index !== -1) registeredResidents[index] = { ...registeredResidents[index], ...req.body };
    res.json({ success: true });
});
app.delete('/api/residents/:name', (req, res) => {
    registeredResidents = registeredResidents.filter(r => r.name !== req.params.name);
    res.json({ success: true });
});

// Medicine Endpoints
app.get('/api/medicines', (req, res) => { res.json(medicineInventory); });
app.post('/api/medicines', (req, res) => {
    const newMed = req.body;
    newMed.id = Date.now(); 
    const currentStock = parseInt(newMed.stock.split('/')[0]);
    if (currentStock === 0) newMed.status = "Out of Stock";
    else if (currentStock < 200) newMed.status = "Low Stock";
    else newMed.status = "In stock";
    medicineInventory.unshift(newMed);
    res.json({ success: true });
});

// Mission Endpoints
app.get('/api/missions', (req, res) => { res.json(missionsData); });
app.post('/api/missions', (req, res) => {
    const newMission = req.body;
    newMission.id = Date.now(); 
    newMission.status = "planned";
    missionsData.unshift(newMission);
    res.json({ success: true });
});
app.put('/api/missions/:id', (req, res) => {
    const index = missionsData.findIndex(m => m.id === parseInt(req.params.id));
    if(index !== -1) missionsData[index] = { ...missionsData[index], ...req.body };
    res.json({ success: true });
});
app.delete('/api/missions/:id', (req, res) => {
    missionsData = missionsData.filter(m => m.id !== parseInt(req.params.id));
    res.json({ success: true });
});

// Staff Endpoints
app.get('/api/staff', (req, res) => { res.json(staffData); });
app.post('/api/staff', (req, res) => {
    const newStaff = req.body;
    newStaff.id = Date.now(); 
    newStaff.status = "Active"; 
    newStaff.lastLogin = "Never";
    staffData.unshift(newStaff);
    res.json({ success: true });
});
app.put('/api/staff/:id', (req, res) => {
    const index = staffData.findIndex(s => s.id === parseInt(req.params.id));
    if(index !== -1) staffData[index] = { ...staffData[index], ...req.body };
    res.json({ success: true });
});
app.delete('/api/staff/:id', (req, res) => {
    staffData = staffData.filter(s => s.id !== parseInt(req.params.id));
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server is active at http://localhost:${PORT}`);
});