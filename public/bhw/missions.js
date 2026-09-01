document.addEventListener("DOMContentLoaded", () => {
    loadMissions();
});

// 1. Fetch & Render Table + Update Stats (Filtered for BHW)
async function loadMissions() {
    try {
        const response = await fetch('/api/missions');
        const allMissions = await response.json();
        
        // UPDATED: Filter missions where the assigned BHWs text INCLUDES "Jose Cruz"
        const myMissions = allMissions.filter(m => m.bhws.includes('Jose Cruz'));
        
        // Calculate stats based ONLY on Jose Cruz's missions
        document.getElementById('stat-total').textContent = myMissions.length;
        document.getElementById('stat-planned').textContent = myMissions.filter(m => m.status === 'planned').length;
        document.getElementById('stat-ongoing').textContent = myMissions.filter(m => m.status === 'on going').length;
        document.getElementById('stat-completed').textContent = myMissions.filter(m => m.status === 'completed').length;

        const tbody = document.getElementById('missions-tbody');
        tbody.innerHTML = ''; 

        myMissions.forEach(m => {
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
                    <!-- EDIT ICON (No Delete Icon, No View Icon) -->
                    <svg onclick="openEditModal(${m.id}, '${m.name}', '${m.area}', '${m.date}', '${m.bhws}', ${m.households}, '${m.priority}', '${m.status}')" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error loading missions:", error);
    }
}

// 2. Edit Existing Mission (Status Update Only)
async function submitEditMission() {
    const id = document.getElementById('edit-id').value;
    
    // We only pull the status from the form, to prevent unauthorized overwrites
    const updatedData = {
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