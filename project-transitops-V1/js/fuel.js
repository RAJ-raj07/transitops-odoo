// ==========================================
// TransitOps Fuel & Expense Management
// Part 1
// ==========================================

// ----------------------------
// Login Check
// ----------------------------

const email = localStorage.getItem("email");
const role = localStorage.getItem("role");

if (!email || !role) {

    location.href = "index.html";

}

document.getElementById("userRole").textContent = role;

// ----------------------------
// Elements
// ----------------------------

const modal = document.getElementById("fuelModal");
const fuelForm = document.getElementById("fuelForm");
const addBtn = document.getElementById("addFuel");
const closeBtn = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");

const fuelBody = document.getElementById("fuelBody");

const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const popupClose = document.getElementById("popupClose");

const searchFuel = document.getElementById("searchFuel");
const vehicleSelect = document.getElementById("fuelVehicle");

// ----------------------------
// Data
// ----------------------------

let fuelRecords = Storage.getFuel();

let vehicles = Storage.getVehicles();

let editIndex = -1;

let deleteIndex = -1;

// ----------------------------
// Popup
// ----------------------------

function showPopup(title,message){

    popupTitle.textContent = title;

    popupMessage.textContent = message;

    popup.showModal();

}

popupClose.onclick = ()=>popup.close();

// ----------------------------
// Load Vehicles
// ----------------------------

function loadVehicles(){

    vehicleSelect.innerHTML =
    `<option value="">Select Vehicle</option>`;

    vehicles.forEach(vehicle=>{

        vehicleSelect.innerHTML +=

        `<option value="${vehicle.registration}">

        ${vehicle.registration} - ${vehicle.name}

        </option>`;

    });

}

// ----------------------------
// Modal
// ----------------------------

addBtn.onclick=()=>{

    editIndex=-1;

    fuelForm.reset();

    loadVehicles();

    document.getElementById("modalTitle").textContent=
    "Add Fuel Record";

    modal.showModal();

};

closeBtn.onclick=()=>modal.close();

cancelBtn.onclick=()=>modal.close();

// ----------------------------
// Summary
// ----------------------------

function updateSummary(){

    document.getElementById("totalFuelRecords").textContent =
    fuelRecords.length;

    let fuelCost=0;

    let expense=0;

    fuelRecords.forEach(item=>{

        fuelCost += Number(item.fuelCost);

        expense += Number(item.expense);

    });

    document.getElementById("totalFuelCost").textContent =
    "₹"+fuelCost.toLocaleString();

    document.getElementById("totalExpenses").textContent =
    "₹"+expense.toLocaleString();

    document.getElementById("overallCost").textContent =
    "₹"+(fuelCost+expense).toLocaleString();

}

// ----------------------------
// Render
// ----------------------------

function renderFuel(list=fuelRecords){

    fuelBody.innerHTML="";

    if(list.length===0){

        fuelBody.innerHTML=`

        <tr>

        <td colspan="8" class="empty">

        No Fuel Records Found

        </td>

        </tr>

        `;

        updateSummary();

        return;

    }

    list.forEach((item,index)=>{

        fuelBody.innerHTML+=`

        <tr>

        <td>${item.id}</td>

        <td>${item.vehicle}</td>

        <td>${item.date}</td>

        <td>${item.litres} L</td>

        <td>₹${item.fuelCost}</td>

        <td>₹${item.expense}</td>

        <td>₹${item.total}</td>

        <td>

        <button
        class="action-btn view"
        onclick="viewFuel(${index})">

        👁

        </button>

        <button
        class="action-btn edit"
        onclick="editFuel(${index})">

        ✏

        </button>

        <button
        class="action-btn delete"
        onclick="deleteFuel(${index})">

        🗑

        </button>

        </td>

        </tr>

        `;

    });

    updateSummary();

}

renderFuel();
// ==========================================
// CRUD OPERATIONS
// Part 2
// ==========================================

// ----------------------------
// Save Fuel Record
// ----------------------------

fuelForm.addEventListener("submit", function(e){

    e.preventDefault();

    const litres = Number(document.getElementById("fuelQuantity").value);

    const price = Number(document.getElementById("fuelPrice").value);

    const expense = Number(document.getElementById("otherExpense").value);

    const fuelCost = litres * price;

    const total = fuelCost + expense;

    const record = {

        id: document.getElementById("recordId").value.trim(),

        vehicle: vehicleSelect.value,

        date: document.getElementById("fuelDate").value,

        litres: litres,

        fuelPrice: price,

        fuelCost: fuelCost,

        expense: expense,

        expenseType: document.getElementById("expenseType").value,

        remarks: document.getElementById("remarks").value.trim(),

        total: total

    };

    // Validation

    if(record.id==="" || record.vehicle===""){

        showPopup(
            "Validation",
            "Please fill all required fields."
        );

        return;

    }

    // Duplicate ID

    const duplicate = fuelRecords.findIndex(r=>r.id===record.id);

    if(duplicate!==-1 && duplicate!==editIndex){

        showPopup(
            "Duplicate",
            "Record ID already exists."
        );

        return;

    }

    // Edit

    if(editIndex!==-1){

        fuelRecords[editIndex]=record;

        showPopup(
            "Updated",
            "Fuel record updated successfully."
        );

    }

    // Add

    else{

        fuelRecords.push(record);

        showPopup(
            "Success",
            "Fuel record added successfully."
        );

    }

    Storage.saveFuel(fuelRecords);

    renderFuel();

    modal.close();

});

// ----------------------------
// Edit
// ----------------------------

function editFuel(index){

    editIndex=index;

    const item=fuelRecords[index];

    loadVehicles();

    document.getElementById("modalTitle").textContent=
    "Edit Fuel Record";

    document.getElementById("recordId").value=item.id;

    vehicleSelect.value=item.vehicle;

    document.getElementById("fuelDate").value=item.date;

    document.getElementById("fuelQuantity").value=item.litres;

    document.getElementById("fuelPrice").value=item.fuelPrice;

    document.getElementById("otherExpense").value=item.expense;

    document.getElementById("expenseType").value=item.expenseType;

    document.getElementById("remarks").value=item.remarks;

    modal.showModal();

}

// ----------------------------
// Delete
// ----------------------------

function deleteFuel(index){

    deleteIndex=index;

    document
    .getElementById("deleteDialog")
    .showModal();

}

document
.getElementById("cancelDelete")
.onclick=()=>{

    document
    .getElementById("deleteDialog")
    .close();

};

document
.getElementById("confirmDelete")
.onclick=()=>{

    fuelRecords.splice(deleteIndex,1);

    Storage.saveFuel(fuelRecords);

    renderFuel();

    document
    .getElementById("deleteDialog")
    .close();

    showPopup(
        "Deleted",
        "Fuel record deleted."
    );

};

// ----------------------------
// Refresh
// ----------------------------

document
.getElementById("refreshFuel")
.onclick=()=>{

    fuelRecords=Storage.getFuel();

    renderFuel();

    showPopup(
        "Refreshed",
        "Fuel records updated."
    );

};
// ==========================================
// Part 3
// Search • View • Logout • Loader
// ==========================================

// ----------------------------
// Search
// ----------------------------

searchFuel.addEventListener("keyup", function(){

    const value = this.value.toLowerCase();

    const filtered = fuelRecords.filter(item =>

        item.id.toLowerCase().includes(value) ||

        item.vehicle.toLowerCase().includes(value) ||

        item.date.toLowerCase().includes(value) ||

        item.expenseType.toLowerCase().includes(value) ||

        item.remarks.toLowerCase().includes(value)

    );

    renderFuel(filtered);

});

// ----------------------------
// View Fuel Record
// ----------------------------

function viewFuel(index){

    const item = fuelRecords[index];

    document.getElementById("fuelDetails").innerHTML = `

        <p><strong>Record ID :</strong> ${item.id}</p>

        <p><strong>Vehicle :</strong> ${item.vehicle}</p>

        <p><strong>Date :</strong> ${item.date}</p>

        <p><strong>Fuel :</strong> ${item.litres} Litres</p>

        <p><strong>Price/Litre :</strong> ₹${item.fuelPrice}</p>

        <p><strong>Fuel Cost :</strong> ₹${item.fuelCost}</p>

        <p><strong>Other Expense :</strong> ₹${item.expense}</p>

        <p><strong>Expense Type :</strong> ${item.expenseType}</p>

        <p><strong>Total :</strong> ₹${item.total}</p>

        <p><strong>Remarks :</strong> ${item.remarks}</p>

    `;

    document
    .getElementById("viewDialog")
    .showModal();

}

document
.getElementById("closeViewDialog")
.onclick = ()=>{

    document
    .getElementById("viewDialog")
    .close();

};

// ----------------------------
// Logout
// ----------------------------

document
.getElementById("logoutBtn")
.onclick = ()=>{

    if(confirm("Logout from TransitOps?")){

        localStorage.removeItem("email");

        localStorage.removeItem("role");

        location.href="index.html";

    }

};

// ----------------------------
// Dashboard Sync
// ----------------------------

function refreshDashboard(){

    Storage.saveFuel(fuelRecords);

    updateSummary();

}

// ----------------------------
// Auto Refresh
// ----------------------------

setInterval(()=>{

    fuelRecords = Storage.getFuel();

    updateSummary();

},5000);

// ----------------------------
// Loader
// ----------------------------

window.onload = ()=>{

    setTimeout(()=>{

        document
        .getElementById("loader")
        .style.display="none";

    },700);

};

// ----------------------------
// Keyboard Shortcut
// Ctrl + N
// ----------------------------

document.addEventListener("keydown",function(e){

    if(e.ctrlKey && e.key==="n"){

        e.preventDefault();

        addBtn.click();

    }

});

// ----------------------------
// ESC closes dialogs
// ----------------------------

document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        modal.close();

        document
        .getElementById("viewDialog")
        .close();

    }

});

// ----------------------------
// Initial Refresh
// ----------------------------

refreshDashboard();

renderFuel();