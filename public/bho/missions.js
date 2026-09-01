document.addEventListener("DOMContentLoaded", () => {
    loadMissions();
    loadBHWsDropdown();
});

// 1. Fetch & Render Table + Update Stats
async function loadMissions() {
    try {
        const response = await fetch('/api/missions');
        const missions = await response.json();
        
        document.getElementById('stat-total').textContent = missions.length;
        document.getElementById('stat-planned').textContent = missions.filter(m => m.status === 'planned').length;
        document.getElementById('stat-ongoing').textContent = missions.filter(m => m.status === 'on going').length;
        document.getElementById('stat-completed').textContent = missions.filter(m => m.status === 'completed').length;

        const tbody = document.getElementById('missions-tbody');
        tbody.innerHTML = ''; 

        missions.forEach(m => {
            let statusClass = 'm-planned';
            if (m.status === 'on going') statusClass = 'm-ongoing';
            if (m.status === 'completed') statusClass = 'm-completed';

            let prioClass = 'priority-high';
            if (m.priority === 'Medium') prioClass = 'priority-medium';
            if (m.priority === 'Low') prioClass = 'priority-low';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align: left; padding-left: 20px; font-weight: 500;">${m.name}</td>
                <td>${m.area}</td>
                <td>${m.date}</td>
                <td>${m.bhws}</td>
                <td>${m.households}</td>
                <td><span class="priority-badge ${prioClass}">${m.priority}</span></td>
                <td><span class="mission-status ${statusClass}">${m.status}</span></td>
                <td class="action-icons">
                    <!-- EDIT ICON (No Delete Icon for BHO!) -->
                    <svg onclick="openEditModal(${m.id}, '${m.name}', '${m.area}', '${m.date}', '${m.bhws}', ${m.households}, '${m.priority}', '${m.status}')" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error loading missions:", error);
    }
}

// 2. Submit New Mission
async function submitNewMission() {
    const name = document.getElementById('add-name').value;
    if (!name) { alert("Please enter a mission name!"); return; }

    const newMission = {
        name: name,
        area: document.getElementById('add-area').value,
        date: document.getElementById('add-date').value || "N/A",
        bhws: document.getElementById('add-bhws').value || "Unassigned",
        households: document.getElementById('add-hh').value || 0,
        priority: document.getElementById('add-priority').value
    };

    await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMission)
    });

    closeAddModal();
    document.querySelectorAll('#add-mission-modal input').forEach(input => input.value = '');
    loadMissions();
}

// 3. Edit Existing Mission
async function submitEditMission() {
    const id = document.getElementById('edit-id').value;
    const updatedData = {
        name: document.getElementById('edit-name').value,
        area: document.getElementById('edit-area').value,
        date: document.getElementById('edit-date').value || "N/A",
        bhws: document.getElementById('edit-bhws').value || "Unassigned",
        households: document.getElementById('edit-hh').value || 0,
        priority: document.getElementById('edit-priority').value,
        status: document.getElementById('edit-status').value
    };

    await fetch(`/api/missions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    });

    closeEditModal();
    loadMissions(); 
}

// Modal Helpers
function openAddModal() { document.getElementById('add-mission-modal').style.display = 'flex'; }
function closeAddModal() { document.getElementById('add-mission-modal').style.display = 'none'; }
function openEditModal(id, name, area, date, bhws, hh, priority, status) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-area').value = area;
    document.getElementById('edit-date').value = date;
    document.getElementById('edit-bhws').value = bhws;
    document.getElementById('edit-hh').value = hh;
    document.getElementById('edit-priority').value = priority;
    document.getElementById('edit-status').value = status;
    document.getElementById('edit-mission-modal').style.display = 'flex';
}
function closeEditModal() { document.getElementById('edit-mission-modal').style.display = 'none'; }

// --- UPDATED: Dynamically load ONLY BHWs from the Staff Database ---
async function loadBHWsDropdown() {
    try {
        const res = await fetch('/api/staff');
        const staffs = await res.json();
        
        // Filter the database: We STRICTLY only want people with the role of 'BHW'
        const availableStaff = staffs.filter(s => s.role === 'BHW');

        const addSelect = document.getElementById('add-bhws');
        const editSelect = document.getElementById('edit-bhws');
        
        addSelect.innerHTML = '';
        editSelect.innerHTML = '';

        availableStaff.forEach(staff => {
            const optName = `${staff.name} (${staff.area})`;
            
            const opt1 = document.createElement('option');
            opt1.value = staff.name; 
            opt1.textContent = optName; 
            addSelect.appendChild(opt1);

            const opt2 = document.createElement('option');
            opt2.value = staff.name;
            opt2.textContent = optName;
            editSelect.appendChild(opt2);
        });
    } catch (error) {
        console.error("Error loading BHWs:", error);
    }
}