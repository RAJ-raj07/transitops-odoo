// ==========================================
// TransitOps Vehicle Management
// Part 1
// ==========================================

// ----------------------------
// Login Check
// ----------------------------

const email = localStorage.getItem("email");
const role = localStorage.getItem("role");

if (!email || !role) {
    location.href = "login.html";
}

// ----------------------------
// RBAC
// ----------------------------

document.getElementById("userRole").textContent = role;

if (role !== "Fleet Manager") {

    alert("Access Denied!");

    location.href = "dashboard.html";

}

// ----------------------------
// Elements
// ----------------------------

const modal = document.getElementById("vehicleModal");

const addBtn = document.getElementById("addVehicle");

const closeBtn = document.getElementById("closeModal");

const cancelBtn = document.getElementById("cancelBtn");

const vehicleForm = document.getElementById("vehicleForm");

const popup = document.getElementById("popup");

const popupTitle = document.getElementById("popupTitle");

const popupMessage = document.getElementById("popupMessage");

const popupClose = document.getElementById("popupClose");

const vehicleBody = document.getElementById("vehicleBody");

const searchVehicle = document.getElementById("searchVehicle");

// ----------------------------
// Variables
// ----------------------------

let vehicles = Storage.getVehicles();

let editIndex = -1;

let deleteIndex = -1;

// ----------------------------
// Popup
// ----------------------------

function showPopup(title, message){

    popupTitle.textContent = title;

    popupMessage.textContent = message;

    popup.showModal();

}

popupClose.onclick = ()=>{

    popup.close();

};

// ----------------------------
// Modal
// ----------------------------

addBtn.onclick = ()=>{

    editIndex = -1;

    vehicleForm.reset();

    document.getElementById("modalTitle").textContent =
    "Add Vehicle";

    modal.showModal();

};

closeBtn.onclick = ()=>{

    modal.close();

};

cancelBtn.onclick = ()=>{

    modal.close();

};

// ----------------------------
// Summary
// ----------------------------

function updateSummary(){

    document.getElementById("totalVehicles").textContent =
    vehicles.length;

    document.getElementById("availableVehicles").textContent =
    vehicles.filter(v=>v.status==="Available").length;

    document.getElementById("tripVehicles").textContent =
    vehicles.filter(v=>v.status==="On Trip").length;

    document.getElementById("maintenanceVehicles").textContent =
    vehicles.filter(v=>v.status==="Maintenance").length;

}

// ----------------------------
// Render Table
// ----------------------------

function renderVehicles(list = vehicles){

    vehicleBody.innerHTML="";

    if(list.length===0){

        vehicleBody.innerHTML=`

        <tr>

        <td colspan="7" class="empty">

        No Vehicles Found

        </td>

        </tr>

        `;

        updateSummary();

        return;

    }

    list.forEach((vehicle,index)=>{

        vehicleBody.innerHTML += `

        <tr>

        <td>${vehicle.registration}</td>

        <td>${vehicle.name}</td>

        <td>${vehicle.model}</td>

        <td>${vehicle.type}</td>

        <td>${vehicle.capacity} KG</td>

        <td>

        <span class="badge ${vehicle.status.toLowerCase().replace(/\s/g,"")}">

        ${vehicle.status}

        </span>

        </td>

        <td>

        <button class="action-btn view"
        onclick="viewVehicle(${index})">

        👁

        </button>

        <button class="action-btn edit"
        onclick="editVehicle(${index})">

        ✏

        </button>

        <button class="action-btn delete"
        onclick="deleteVehicle(${index})">

        🗑

        </button>

        </td>

        </tr>

        `;

    });

    updateSummary();

}

// ----------------------------
// Initial Render
// ----------------------------

renderVehicles();
// ==========================================
// CRUD OPERATIONS
// Part 2
// ==========================================

// ----------------------------
// Save Vehicle
// ----------------------------

vehicleForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const vehicle = {

        registration: document.getElementById("registration").value.trim().toUpperCase(),

        name: document.getElementById("vehicleName").value.trim(),

        model: document.getElementById("model").value.trim(),

        type: document.getElementById("vehicleType").value,

        capacity: document.getElementById("capacity").value,

        odometer: document.getElementById("odometer").value,

        cost: document.getElementById("cost").value,

        status: document.getElementById("status").value,

        region: document.getElementById("region").value

    };

    // ----------------------------
    // Validation
    // ----------------------------

    if (
        vehicle.registration === "" ||
        vehicle.name === ""
    ) {

        showPopup(
            "Validation",
            "Registration and Vehicle Name are required."
        );

        return;

    }

    // ----------------------------
    // Duplicate Registration
    // ----------------------------

    const duplicate = vehicles.findIndex(v =>
        v.registration === vehicle.registration
    );

    if (
        duplicate !== -1 &&
        duplicate !== editIndex
    ) {

        showPopup(
            "Duplicate Vehicle",
            "Registration number already exists."
        );

        return;

    }

    // ----------------------------
    // Edit
    // ----------------------------

    if (editIndex !== -1) {

        vehicles[editIndex] = vehicle;

        showPopup(
            "Updated",
            "Vehicle updated successfully."
        );

    }

    // ----------------------------
    // Add
    // ----------------------------

    else {

        vehicles.push(vehicle);

        showPopup(
            "Success",
            "Vehicle added successfully."
        );

    }

    Storage.saveVehicles(vehicles);

    renderVehicles();

    modal.close();

});

// ----------------------------
// Edit Vehicle
// ----------------------------

function editVehicle(index) {

    editIndex = index;

    const vehicle = vehicles[index];

    document.getElementById("modalTitle").textContent =
        "Edit Vehicle";

    document.getElementById("registration").value =
        vehicle.registration;

    document.getElementById("vehicleName").value =
        vehicle.name;

    document.getElementById("model").value =
        vehicle.model;

    document.getElementById("vehicleType").value =
        vehicle.type;

    document.getElementById("capacity").value =
        vehicle.capacity;

    document.getElementById("odometer").value =
        vehicle.odometer;

    document.getElementById("cost").value =
        vehicle.cost;

    document.getElementById("status").value =
        vehicle.status;

    document.getElementById("region").value =
        vehicle.region || "North";

    modal.showModal();

}

// ----------------------------
// Delete Vehicle
// ----------------------------

function deleteVehicle(index){

    deleteIndex = index;

    document
    .getElementById("deleteDialog")
    .showModal();

}

document
.getElementById("cancelDelete")
.onclick = () => {

    document
    .getElementById("deleteDialog")
    .close();

};

document
.getElementById("confirmDelete")
.onclick = () => {

    vehicles.splice(deleteIndex,1);

    Storage.saveVehicles(vehicles);

    renderVehicles();

    document
    .getElementById("deleteDialog")
    .close();

    showPopup(
        "Deleted",
        "Vehicle removed successfully."
    );

};

// ----------------------------
// Refresh
// ----------------------------

document
.getElementById("refreshVehicles")
.onclick = ()=>{

    vehicles = Storage.getVehicles();

    renderVehicles();

    showPopup(
        "Refreshed",
        "Vehicle list updated."
    );

};
// ==========================================
// Part 3
// Search • View • Logout • Loader
// ==========================================

// ----------------------------
// Search
// ----------------------------

searchVehicle.addEventListener("keyup", function(){

    const value = this.value.toLowerCase();

    const filtered = vehicles.filter(vehicle =>

        vehicle.registration.toLowerCase().includes(value) ||

        vehicle.name.toLowerCase().includes(value) ||

        vehicle.model.toLowerCase().includes(value) ||

        vehicle.type.toLowerCase().includes(value) ||

        vehicle.status.toLowerCase().includes(value)

    );

    renderVehicles(filtered);

});

// ----------------------------
// View Vehicle
// ----------------------------

function viewVehicle(index){

    const vehicle = vehicles[index];

    showPopup(

        "Vehicle Details",

`Registration : ${vehicle.registration}

Vehicle : ${vehicle.name}

Model : ${vehicle.model}

Type : ${vehicle.type}

Capacity : ${vehicle.capacity} KG

Odometer : ${vehicle.odometer} KM

Cost : ₹${vehicle.cost}

Region : ${vehicle.region || "N/A"}

Status : ${vehicle.status}`

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

        location.href="login.html";

    }

};

// ----------------------------
// Refresh Summary
// ----------------------------

function refreshDashboard(){

    Storage.saveVehicles(vehicles);

    updateSummary();

}

// ----------------------------
// Auto Refresh
// ----------------------------

setInterval(()=>{

    vehicles = Storage.getVehicles();

    if(searchVehicle.value.trim()===""){

        renderVehicles();

    } else {

        updateSummary();

    }

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
// Escape closes modal
// ----------------------------

document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        modal.close();

    }

});

// ----------------------------
// Initial Refresh
// ----------------------------

refreshDashboard();

renderVehicles();
