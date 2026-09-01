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
        
        residents.forEach(r => {
            const option = document.createElement('option');
            option.value = JSON.stringify({ name: r.name, area: r.area }); 
            option.textContent = r.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading dropdown:", error);
    }
}

// 2. Fetch & Render Table
async function loadAppointments() {
    try {
        const response = await fetch('/api/appointments');
        const appts = await response.json();
        
        // --- NEW: Sort by date (Newest first) ---
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

        // Update the log count text at bottom left
        document.getElementById('log-count').textContent = `Showing ${appts.length} log entries`;

    } catch (error) {
        console.error("Error loading appointments:", error);
    }
}

// 3. Admin Adding a Walk-In
async function addWalkIn() {
    const rawResident = document.getElementById('log-resident').value;
    const datetimeStr = document.getElementById('log-datetime').value;
    const service = document.getElementById('log-service').value;

    if (!rawResident || !datetimeStr) {
        alert("Please select a resident and a date/time!");
        return;
    }

    const residentObj = JSON.parse(rawResident);
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