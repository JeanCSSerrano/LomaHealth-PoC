document.addEventListener("DOMContentLoaded", () => {
    loadResidentsDropdown();
    loadAppointments();
});

// 1. Fetch residents to populate the "Log an Appointment" dropdown
async function loadResidentsDropdown() {
    try {
        const res = await fetch('/api/residents');
        const residents = await res.json();
        const select = document.getElementById('log-resident');
        
        // Failsafe in case there's a specific dropdown for it in the HTML later
        if(select) {
            residents.forEach(r => {
                const option = document.createElement('option');
                option.value = JSON.stringify({ name: r.name, area: r.area }); 
                option.textContent = r.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error loading dropdown:", error);
    }
}

// 2. Fetch & Render Table
async function loadAppointments() {
    try {
        const response = await fetch('/api/appointments');
        let appts = await response.json();
        
        // --- NEW: Filter by Service Dropdown ---
        const filterEl = document.getElementById('filter-service');
        if (filterEl && filterEl.value !== 'All') {
            appts = appts.filter(a => a.service === filterEl.value);
        }

        // --- Sort by date (Newest first) ---
        appts.sort((a, b) => new Date(b.date) - new Date(a.date));

        const tbody = document.getElementById('appointments-tbody');
        tbody.innerHTML = ''; 

        appts.forEach(a => {
            // Determine Status CSS
            let statusClass = 'apt-status-pending';
            if (a.status === 'Missed') statusClass = 'apt-status-missed';
            if (a.status === 'Attended') statusClass = 'apt-status-attended';
            if (a.status === 'Confirmed') statusClass = 'apt-status-confirmed';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align: left; padding-left: 20px; font-weight: 500;">${a.name}</td>
                <td>${a.date} ${a.time}</td>
                <td>${a.service}</td>
                <td><span class="${statusClass}">${a.status}</span></td>
                <td>${a.location ? a.location.toUpperCase() : 'N/A'}</td>
                <td style="display: flex; gap: 5px; justify-content: center;">
                    <!-- Added Confirmed Button Here -->
                    <button class="btn-action-confirmed" onclick="updateStatus('${a.reference}', 'Confirmed')">Confirm</button>
                    <button class="btn-action-missed" onclick="updateStatus('${a.reference}', 'Missed')">Missed</button>
                    <button class="btn-action-attended" onclick="updateStatus('${a.reference}', 'Attended')">Attended</button>
                </td>
            `;
            tbody.appendChild(tr);
        });



    } catch (error) {
        console.error("Error loading appointments:", error);
    }
}

// 3. Admin Adding a Walk-In
async function addWalkIn() {
    // Note: If you switched resident input back to a free text field, this logic adapts
    let residentObj = { name: "Unknown Resident", area: "N/A" };
    const rawResidentInput = document.querySelector('input[name="username"]');
    const rawResidentSelect = document.getElementById('log-resident');

    if (rawResidentSelect && rawResidentSelect.value) {
        residentObj = JSON.parse(rawResidentSelect.value);
    } else if (rawResidentInput && rawResidentInput.value) {
        residentObj.name = rawResidentInput.value;
    } else {
        alert("Please enter a resident and a date/time!");
        return;
    }

    const datetimeStr = document.getElementById('log-datetime').value;
    const service = document.getElementById('log-service').value;

    if (!datetimeStr) {
        alert("Please select a date and time!");
        return;
    }

    const [datePart, timePart] = datetimeStr.split('T');

    const newAppt = {
        name: residentObj.name,
        location: residentObj.area,
        service: service,
        date: datePart,
        time: timePart,
        status: "Confirmed" 
    };

    await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppt)
    });

    document.getElementById('log-datetime').value = ''; 
    if(rawResidentInput) rawResidentInput.value = '';
    loadAppointments(); 
}

// 4. Update Status 
async function updateStatus(ref, newStatus) {
    await fetch(`/api/appointments/${ref}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });
    
    loadAppointments(); 
}