// ==========================================
// TransitOps Maintenance Management
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

// ----------------------------
// RBAC
// ----------------------------

document.getElementById("userRole").textContent = role;

if(role !== "Fleet Manager"){

    alert("Access Denied!");

    location.href = "dashboard.html";

}

// ----------------------------
// Elements
// ----------------------------

const modal = document.getElementById("maintenanceModal");

const maintenanceForm = document.getElementById("maintenanceForm");

const addBtn = document.getElementById("addMaintenance");

const closeBtn = document.getElementById("closeModal");

const cancelBtn = document.getElementById("cancelBtn");

const maintenanceBody = document.getElementById("maintenanceBody");

const popup = document.getElementById("popup");

const popupTitle = document.getElementById("popupTitle");

const popupMessage = document.getElementById("popupMessage");

const popupClose = document.getElementById("popupClose");

const vehicleSelect = document.getElementById("maintenanceVehicle");

const searchMaintenance = document.getElementById("searchMaintenance");

// ----------------------------
// Data
// ----------------------------

let maintenance = Storage.getMaintenance();

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

        vehicleSelect.innerHTML += `

        <option value="${vehicle.registration}">

        ${vehicle.registration} - ${vehicle.name}

        </option>

        `;

    });

}

// ----------------------------
// Modal
// ----------------------------

addBtn.onclick = ()=>{

    editIndex = -1;

    maintenanceForm.reset();

    loadVehicles();

    document.getElementById("modalTitle").textContent =
    "Add Maintenance";

    modal.showModal();

};

closeBtn.onclick = ()=>modal.close();

cancelBtn.onclick = ()=>modal.close();

// ----------------------------
// Summary
// ----------------------------

function updateSummary(){

    document.getElementById("totalMaintenance").textContent =
    maintenance.length;

    document.getElementById("activeMaintenance").textContent =
    maintenance.filter(m=>m.status==="Active").length;

    document.getElementById("completedMaintenance").textContent =
    maintenance.filter(m=>m.status==="Completed").length;

    const totalCost = maintenance.reduce((sum,item)=>{

        return sum + Number(item.cost || 0);

    },0);

    document.getElementById("maintenanceCost").textContent =
    "₹" + totalCost.toLocaleString();

}

// ----------------------------
// Render Table
// ----------------------------

function renderMaintenance(list = maintenance){

    maintenanceBody.innerHTML = "";

    if(list.length===0){

        maintenanceBody.innerHTML = `

        <tr>

        <td colspan="7" class="empty">

        No Maintenance Records

        </td>

        </tr>

        `;

        updateSummary();

        return;

    }

    list.forEach((item,index)=>{

        maintenanceBody.innerHTML += `

        <tr>

        <td>${item.id}</td>

        <td>${item.vehicle}</td>

        <td>${item.service}</td>

        <td>${item.date}</td>

        <td>₹${item.cost}</td>

        <td>

        <span class="badge ${item.status.toLowerCase()}">

        ${item.status}

        </span>

        </td>

        <td>

        <button

        class="action-btn view"

        onclick="viewMaintenance(${index})">

        👁

        </button>

        <button

        class="action-btn edit"

        onclick="editMaintenance(${index})">

        ✏

        </button>

        <button

        class="action-btn complete"

        onclick="completeMaintenance(${index})">

        ✔

        </button>

        <button

        class="action-btn delete"

        onclick="deleteMaintenance(${index})">

        🗑

        </button>

        </td>

        </tr>

        `;

    });

    updateSummary();

}

renderMaintenance();
// ==========================================
// CRUD OPERATIONS
// Part 2
// ==========================================

// ----------------------------
// Save Maintenance
// ----------------------------

maintenanceForm.addEventListener("submit", function(e){

    e.preventDefault();

    const record={

        id:document.getElementById("recordId").value.trim(),

        vehicle:vehicleSelect.value,

        service:document.getElementById("serviceType").value,

        date:document.getElementById("serviceDate").value,

        mechanic:document.getElementById("mechanic").value.trim(),

        cost:document.getElementById("serviceCost").value,

        remarks:document.getElementById("remarks").value.trim(),

        status:document.getElementById("maintenanceStatus").value

    };

    // Validation

    if(record.id==="" || record.vehicle===""){

        showPopup(
            "Validation",
            "Record ID and Vehicle are required."
        );

        return;

    }

    // Duplicate Record ID

    const duplicate=maintenance.findIndex(m=>m.id===record.id);

    if(duplicate!==-1 && duplicate!==editIndex){

        showPopup(
            "Duplicate",
            "Record ID already exists."
        );

        return;

    }

    // ----------------------------
    // Vehicle Status
    // ----------------------------

    const vehicleIndex=vehicles.findIndex(v=>

        v.registration===record.vehicle

    );

    if(vehicleIndex!==-1){

        if(record.status==="Active"){

            vehicles[vehicleIndex].status="In Shop";

        }

        if(record.status==="Completed"){

            vehicles[vehicleIndex].status="Available";

        }

        Storage.saveVehicles(vehicles);

    }

    // ----------------------------
    // Edit
    // ----------------------------

    if(editIndex!==-1){

        maintenance[editIndex]=record;

        showPopup(
            "Updated",
            "Maintenance updated successfully."
        );

    }

    // ----------------------------
    // Add
    // ----------------------------

    else{

        maintenance.push(record);

        showPopup(
            "Success",
            "Maintenance record added."
        );

    }

    Storage.saveMaintenance(maintenance);

    renderMaintenance();

    modal.close();

});

// ----------------------------
// Edit Maintenance
// ----------------------------

function editMaintenance(index){

    editIndex=index;

    const item=maintenance[index];

    loadVehicles();

    document.getElementById("modalTitle").textContent=
    "Edit Maintenance";

    document.getElementById("recordId").value=item.id;

    vehicleSelect.value=item.vehicle;

    document.getElementById("serviceType").value=item.service;

    document.getElementById("serviceDate").value=item.date;

    document.getElementById("mechanic").value=item.mechanic;

    document.getElementById("serviceCost").value=item.cost;

    document.getElementById("remarks").value=item.remarks;

    document.getElementById("maintenanceStatus").value=item.status;

    modal.showModal();

}

// ----------------------------
// Delete
// ----------------------------

function deleteMaintenance(index){

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

    maintenance.splice(deleteIndex,1);

    Storage.saveMaintenance(maintenance);

    renderMaintenance();

    document
    .getElementById("deleteDialog")
    .close();

    showPopup(
        "Deleted",
        "Maintenance record removed."
    );

};

// ----------------------------
// Refresh
// ----------------------------

document
.getElementById("refreshMaintenance")
.onclick=()=>{

    maintenance=Storage.getMaintenance();

    vehicles=Storage.getVehicles();

    renderMaintenance();

    showPopup(
        "Refreshed",
        "Maintenance list updated."
    );

};
// ==========================================
// Part 3
// Search • View • Complete • Logout
// ==========================================

// ----------------------------
// Search
// ----------------------------

searchMaintenance.addEventListener("keyup",function(){

    const value=this.value.toLowerCase();

    const filtered=maintenance.filter(item=>

        item.id.toLowerCase().includes(value) ||

        item.vehicle.toLowerCase().includes(value) ||

        item.service.toLowerCase().includes(value) ||

        item.mechanic.toLowerCase().includes(value) ||

        item.status.toLowerCase().includes(value)

    );

    renderMaintenance(filtered);

});

// ----------------------------
// View
// ----------------------------

function viewMaintenance(index){

    const item=maintenance[index];

    document.getElementById("maintenanceDetails").innerHTML=`

    <p><strong>Record ID :</strong> ${item.id}</p>

    <p><strong>Vehicle :</strong> ${item.vehicle}</p>

    <p><strong>Service :</strong> ${item.service}</p>

    <p><strong>Date :</strong> ${item.date}</p>

    <p><strong>Mechanic :</strong> ${item.mechanic}</p>

    <p><strong>Cost :</strong> ₹${item.cost}</p>

    <p><strong>Remarks :</strong> ${item.remarks}</p>

    <p><strong>Status :</strong> ${item.status}</p>

    `;

    document
    .getElementById("viewDialog")
    .showModal();

}

document
.getElementById("closeViewDialog")
.onclick=()=>{

    document
    .getElementById("viewDialog")
    .close();

};

// ----------------------------
// Complete Maintenance
// ----------------------------

function completeMaintenance(index){

    maintenance[index].status="Completed";

    const vehicle=vehicles.find(v=>

        v.registration===maintenance[index].vehicle

    );

    if(vehicle){

        vehicle.status="Available";

    }

    Storage.saveVehicles(vehicles);

    Storage.saveMaintenance(maintenance);

    renderMaintenance();

    showPopup(

        "Completed",

        "Maintenance completed successfully."

    );

}

// ----------------------------
// Logout
// ----------------------------

document
.getElementById("logoutBtn")
.onclick=()=>{

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

    Storage.saveMaintenance(maintenance);

    updateSummary();

}

// ----------------------------
// Auto Refresh
// ----------------------------

setInterval(()=>{

    maintenance=Storage.getMaintenance();

    vehicles=Storage.getVehicles();

    updateSummary();

},5000);

// ----------------------------
// Loader
// ----------------------------

window.onload=()=>{

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

renderMaintenance();