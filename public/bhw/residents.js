// Load data immediately when the file runs
document.addEventListener("DOMContentLoaded", () => {
    loadResidents();
});

// 1. Fetch data from server and draw the table
async function loadResidents() {
    try {
        const response = await fetch('/api/residents');
        let allResidents = await response.json();
        
        // Grab the current values from the dropdowns!
        const areaFilter = document.getElementById('filter-area').value;
        const genderFilter = document.getElementById('filter-gender').value;

        // Apply the active filters to the array
        const filteredResidents = allResidents.filter(r => {
            const matchArea = (areaFilter === 'All') || (r.area === areaFilter);
            const matchGender = (genderFilter === 'All') || (r.sex === genderFilter);
            return matchArea && matchGender;
        });

        const tbody = document.getElementById('residents-tbody');
        tbody.innerHTML = ''; // Clear the table first

        filteredResidents.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><div class="res-avatar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div></td>
                <td>${r.name}</td>
                <td>${r.age}</td>
                <td>${r.area}</td>
                <td>${r.lastVisit}</td>
                <td>${r.mobile}</td>
                <td class="action-icons">
                    <!-- VIEW ICON -->
                    <svg onclick="openModal('${r.name}', ${r.age}, '${r.dob}', '${r.sex}', '${r.area}', '${r.address}', '${r.email}', '${r.mobile}')" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="cursor:pointer;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <!-- HISTORY ICON -->
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="cursor:pointer;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Update the footer text count
        const logCount = document.getElementById('log-count');
        if(logCount) {
            logCount.textContent = `Showing ${filteredResidents.length} of ${allResidents.length} total residents`;
        }

    } catch (error) {
        console.error("Error loading residents:", error);
    }
}

// 2. Submit new resident to the server
async function submitNewResident() {
    const fName = document.getElementById('add-fname').value;
    const lName = document.getElementById('add-lname').value;
    
    // Prevent empty submits
    if (!fName || !lName) {
        alert("Please enter at least a first and last name!");
        return;
    }
    
    const newRes = {
        name: fName + " " + lName,
        age: document.getElementById('add-age').value || 0,
        dob: document.getElementById('add-dob').value || "N/A",
        sex: document.getElementById('add-sex').value,
        area: document.getElementById('add-area').value,
        address: document.getElementById('add-address').value || "N/A",
        email: document.getElementById('add-email').value || "N/A",
        mobile: document.getElementById('add-mobile').value || "N/A"
    };

    try {
        await fetch('/api/residents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRes)
        });

        document.querySelectorAll('#add-resident-modal input').forEach(input => input.value = '');
        closeAddModal();     
        loadResidents();     
    } catch (error) {
        console.error("Failed to add resident:", error);
    }
}

// ==========================================
// Modal Controls
// ==========================================
function openModal(name, age, dob, sex, area, address, email, mobile) {
    document.getElementById('modal-name').textContent = name;
    document.getElementById('modal-age').textContent = age;
    document.getElementById('modal-dob').textContent = dob;
    document.getElementById('modal-sex').textContent = sex;
    document.getElementById('modal-area').textContent = area;
    document.getElementById('modal-address').textContent = address;
    document.getElementById('modal-email').textContent = email;
    document.getElementById('modal-mobile').textContent = mobile;
    
    // Hash the resident's name so their map image is always the exact same!
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const mapNumber = (Math.abs(hash) % 3) + 1; 
    document.getElementById('resident-map').src = `../assets/images/map${mapNumber}.png`;
    document.getElementById('view-resident-modal').style.display = 'flex';
}

function closeModal() { document.getElementById('view-resident-modal').style.display = 'none'; }
function openAddModal() { document.getElementById('add-resident-modal').style.display = 'flex'; }
function closeAddModal() { document.getElementById('add-resident-modal').style.display = 'none'; }