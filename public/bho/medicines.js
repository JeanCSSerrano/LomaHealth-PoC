document.addEventListener("DOMContentLoaded", () => {
    loadMedicines();
});

// 1. Fetch & Render Table
async function loadMedicines() {
    try {
        const response = await fetch('/api/medicines');
        const meds = await response.json();
        const tbody = document.getElementById('medicines-tbody');
        tbody.innerHTML = ''; 

        meds.forEach(m => {
            let pillClass = 'status-complete'; 
            if (m.status === 'Low Stock' || m.status === 'Low stock') pillClass = 'status-incomplete'; 
            if (m.status === 'Out of Stock' || m.status === 'Out of stock') pillClass = 'status-overdue'; 
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align: left; padding-left: 20px; font-weight: 500;">${m.name}</td>
                <td>${m.category}</td>
                <td>${m.stock}</td>
                <td>${m.expiry}</td>
                <td>${m.supplier}</td>
                <td><span class="status-pill ${pillClass}">${m.status}</span></td>
                <td class="action-icons">
                    <!-- VIEW ICON -->
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <!-- EDIT ICON: Opens modal and passes data in (Trash icon removed here!) -->
                    <svg onclick="openEditModal('${m.name}', '${m.category}', '${m.stock}', '${m.expiry}', '${m.supplier}')" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error loading medicines:", error);
    }
}

// 2. Submit New Medicine
async function submitNewMedicine() {
    const name = document.getElementById('add-name').value;
    if (!name) { alert("Please enter a medicine name."); return; }
    
    const curr = document.getElementById('add-curr').value || 0;
    const max = document.getElementById('add-max').value || 1000;

    const newMed = {
        name: name,
        category: document.getElementById('add-cat').value || "N/A",
        supplier: document.getElementById('add-sup').value || "N/A",
        stock: `${curr}/${max}`,
        expiry: document.getElementById('add-exp').value || "N/A"
    };

    await fetch('/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMed)
    });

    closeAddModal();
    document.querySelectorAll('#add-med-modal input').forEach(input => input.value = '');
    loadMedicines(); 
}

// 3. Edit Medicine (Visual Only)
function openEditModal(name, cat, stock, exp, sup) {
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-cat').value = cat;
    document.getElementById('edit-stock').value = stock;
    document.getElementById('edit-exp').value = exp;
    document.getElementById('edit-sup').value = sup;
    
    document.getElementById('edit-med-modal').style.display = 'flex';
}

function fakeSaveEdit() {
    alert("In this PoC, edits are visual only. Data update simulated successfully!");
    closeEditModal();
}

function openAddModal() { document.getElementById('add-med-modal').style.display = 'flex'; }
function closeAddModal() { document.getElementById('add-med-modal').style.display = 'none'; }
function closeEditModal() { document.getElementById('edit-med-modal').style.display = 'none'; }