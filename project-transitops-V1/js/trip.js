// ==========================================
// TransitOps Trip Management
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

// Fleet Manager and Dispatcher can manage trips

if(role !== "Fleet Manager" && role !== "Dispatcher"){

    alert("Access Denied!");

    location.href="dashboard.html";

}

// ----------------------------
// Elements
// ----------------------------

const modal = document.getElementById("tripModal");

const tripForm = document.getElementById("tripForm");

const addBtn = document.getElementById("addTrip");

const closeBtn = document.getElementById("closeModal");

const cancelBtn = document.getElementById("cancelBtn");

const tripBody = document.getElementById("tripBody");

const popup = document.getElementById("popup");

const popupTitle = document.getElementById("popupTitle");

const popupMessage = document.getElementById("popupMessage");

const popupClose = document.getElementById("popupClose");

const vehicleSelect = document.getElementById("tripVehicle");

const driverSelect = document.getElementById("tripDriver");

const searchTrip = document.getElementById("searchTrip");

// ----------------------------
// Data
// ----------------------------

let trips = Storage.getTrips();

let vehicles = Storage.getVehicles();

let drivers = Storage.getDrivers();

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

function loadVehicles(keepRegistration = ""){

    vehicleSelect.innerHTML =
    `<option value="">Select Vehicle</option>`;

    vehicles
    .filter(v=>v.status==="Available" || v.registration===keepRegistration)
    .forEach(vehicle=>{

        vehicleSelect.innerHTML +=

        `<option value="${vehicle.registration}">

        ${vehicle.registration} - ${vehicle.name}

        </option>`;

    });

}

// ----------------------------
// Load Drivers
// ----------------------------

function loadDrivers(keepLicense = ""){

    driverSelect.innerHTML =
    `<option value="">Select Driver</option>`;

    drivers
    .filter(d=>d.status==="Available" || d.license===keepLicense)
    .forEach(driver=>{

        driverSelect.innerHTML +=

        `<option value="${driver.license}">

        ${driver.name}

        </option>`;

    });

}

// ----------------------------
// Modal
// ----------------------------

addBtn.onclick=()=>{

    editIndex=-1;

    tripForm.reset();

    document.getElementById("modalTitle").textContent="Create Trip";

    loadVehicles();

    loadDrivers();

    modal.showModal();

};

closeBtn.onclick=()=>modal.close();

cancelBtn.onclick=()=>modal.close();

// ----------------------------
// Summary
// ----------------------------

function updateSummary(){

document.getElementById("totalTrips").textContent=
trips.length;

document.getElementById("draftTrips").textContent=
trips.filter(t=>t.status==="Draft").length;

document.getElementById("runningTrips").textContent=
trips.filter(t=>t.status==="Dispatched").length;

document.getElementById("completedTrips").textContent=
trips.filter(t=>t.status==="Completed").length;

}

// ----------------------------
// Render Table
// ----------------------------

function renderTrips(list=trips){

tripBody.innerHTML="";

if(list.length===0){

tripBody.innerHTML=`

<tr>

<td colspan="7" class="empty">

No Trips Created

</td>

</tr>

`;

updateSummary();

return;

}

list.forEach((trip,index)=>{

tripBody.innerHTML+=`

<tr>

<td>${trip.id}</td>

<td>${trip.source}</td>

<td>${trip.destination}</td>

<td>${trip.vehicle}</td>

<td>${trip.driver}</td>

<td>

<span class="badge ${trip.status.toLowerCase()}">

${trip.status}

</span>

</td>

<td>

<button
class="action-btn view"
onclick="viewTrip(${index})">

👁

</button>

<button
class="action-btn edit"
onclick="editTrip(${index})">

✏

</button>

<button
class="action-btn complete"
onclick="completeTrip(${index})">

✔

</button>

<button
class="action-btn delete"
onclick="deleteTrip(${index})">

❌

</button>

</td>

</tr>

`;

});

updateSummary();

}

renderTrips();
// ==========================================
// CRUD & BUSINESS RULES
// Part 2
// ==========================================

// ----------------------------
// Save Trip
// ----------------------------

tripForm.addEventListener("submit", function(e){

    e.preventDefault();

    const trip={

        id:document.getElementById("tripId").value.trim(),

        source:document.getElementById("source").value.trim(),

        destination:document.getElementById("destination").value.trim(),

        vehicle:vehicleSelect.value,

        driver:driverSelect.value,

        weight:Number(document.getElementById("cargoWeight").value),

        distance:Number(document.getElementById("distance").value),

        status:document.getElementById("tripStatus").value

    };

    // Validation

    if(
        trip.id==="" ||
        trip.vehicle==="" ||
        trip.driver===""){

        showPopup(
            "Validation",
            "Please fill all required fields."
        );

        return;

    }

    // Duplicate Trip ID

    const duplicate=trips.findIndex(t=>t.id===trip.id);

    if(duplicate!==-1 && duplicate!==editIndex){

        showPopup(
            "Duplicate",
            "Trip ID already exists."
        );

        return;

    }

    // Vehicle Capacity Check

    const selectedVehicle=
    vehicles.find(v=>v.registration===trip.vehicle);

    if(
        selectedVehicle &&
        trip.weight > Number(selectedVehicle.capacity)
    ){

        showPopup(
            "Capacity Exceeded",
            "Cargo weight exceeds vehicle capacity."
        );

        return;

    }

    // ----------------------------
    // Release previous vehicle/driver on edit
    // (handles reassignment or status change away from Dispatched)
    // ----------------------------

    if(editIndex!==-1){

        const previousTrip = trips[editIndex];

        if(previousTrip.status==="Dispatched"){

            const oldVehicleChanged = previousTrip.vehicle!==trip.vehicle;
            const oldDriverChanged = previousTrip.driver!==trip.driver;
            const noLongerDispatched = trip.status!=="Dispatched";

            if(oldVehicleChanged || noLongerDispatched){

                const oldVehicleIndex=
                vehicles.findIndex(v=>v.registration===previousTrip.vehicle);

                if(oldVehicleIndex!==-1){
                    vehicles[oldVehicleIndex].status="Available";
                }

            }

            if(oldDriverChanged || noLongerDispatched){

                const oldDriverIndex=
                drivers.findIndex(d=>d.license===previousTrip.driver);

                if(oldDriverIndex!==-1){
                    drivers[oldDriverIndex].status="Available";
                }

            }

        }

    }

    // ----------------------------
    // Dispatch
    // ----------------------------

    if(trip.status==="Dispatched"){

        const vehicleIndex=
        vehicles.findIndex(v=>
        v.registration===trip.vehicle);

        const driverIndex=
        drivers.findIndex(d=>
        d.license===trip.driver);

        if(vehicleIndex!==-1){

            vehicles[vehicleIndex].status="On Trip";

        }

        if(driverIndex!==-1){

            drivers[driverIndex].status="On Trip";

        }

    }

    Storage.saveVehicles(vehicles);

    Storage.saveDrivers(drivers);

    // ----------------------------
    // Edit
    // ----------------------------

    if(editIndex!==-1){

        trips[editIndex]=trip;

        showPopup(
            "Updated",
            "Trip updated successfully."
        );

    }

    // ----------------------------
    // Add
    // ----------------------------

    else{

        trips.push(trip);

        showPopup(
            "Success",
            "Trip created successfully."
        );

    }

    Storage.saveTrips(trips);

    renderTrips();

    modal.close();

});

// ----------------------------
// Edit Trip
// ----------------------------

function editTrip(index){

    editIndex=index;

    const trip=trips[index];

    loadVehicles(trip.vehicle);

    loadDrivers(trip.driver);

    document.getElementById("modalTitle").textContent="Edit Trip";

    document.getElementById("tripId").value=trip.id;

    document.getElementById("source").value=trip.source;

    document.getElementById("destination").value=trip.destination;

    vehicleSelect.value=trip.vehicle;

    driverSelect.value=trip.driver;

    document.getElementById("cargoWeight").value=trip.weight;

    document.getElementById("distance").value=trip.distance;

    document.getElementById("tripStatus").value=trip.status;

    modal.showModal();

}

// ----------------------------
// Delete Trip
// ----------------------------

function deleteTrip(index){

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

    const trip = trips[deleteIndex];

    if(trip && trip.status==="Dispatched"){

        const vehicleIndex=
        vehicles.findIndex(v=>v.registration===trip.vehicle);

        const driverIndex=
        drivers.findIndex(d=>d.license===trip.driver);

        if(vehicleIndex!==-1){
            vehicles[vehicleIndex].status="Available";
        }

        if(driverIndex!==-1){
            drivers[driverIndex].status="Available";
        }

        Storage.saveVehicles(vehicles);
        Storage.saveDrivers(drivers);

    }

    trips.splice(deleteIndex,1);

    Storage.saveTrips(trips);

    renderTrips();

    document
    .getElementById("deleteDialog")
    .close();

    showPopup(
        "Deleted",
        "Trip deleted successfully."
    );

};

// ----------------------------
// Refresh
// ----------------------------

document
.getElementById("refreshTrips")
.onclick=()=>{

    trips=Storage.getTrips();

    vehicles=Storage.getVehicles();

    drivers=Storage.getDrivers();

    renderTrips();

    showPopup(
        "Refreshed",
        "Trip list updated."
    );

};
// ==========================================
// Part 3
// Search • View • Complete • Logout
// ==========================================

// ----------------------------
// Search
// ----------------------------

searchTrip.addEventListener("keyup", function(){

    const value = this.value.toLowerCase();

    const filtered = trips.filter(trip =>

        trip.id.toLowerCase().includes(value) ||

        trip.source.toLowerCase().includes(value) ||

        trip.destination.toLowerCase().includes(value) ||

        trip.vehicle.toLowerCase().includes(value) ||

        trip.driver.toLowerCase().includes(value) ||

        trip.status.toLowerCase().includes(value)

    );

    renderTrips(filtered);

});

// ----------------------------
// View Trip
// ----------------------------

function viewTrip(index){

    const trip = trips[index];

    document.getElementById("tripDetails").innerHTML = `

        <p><strong>Trip ID:</strong> ${trip.id}</p>

        <p><strong>Source:</strong> ${trip.source}</p>

        <p><strong>Destination:</strong> ${trip.destination}</p>

        <p><strong>Vehicle:</strong> ${trip.vehicle}</p>

        <p><strong>Driver:</strong> ${trip.driver}</p>

        <p><strong>Cargo Weight:</strong> ${trip.weight} KG</p>

        <p><strong>Distance:</strong> ${trip.distance} KM</p>

        <p><strong>Status:</strong> ${trip.status}</p>

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
// Complete Trip
// ----------------------------

function completeTrip(index){

    const trip = trips[index];

    if(trip.status !== "Dispatched"){

        showPopup(
            "Invalid",
            "Only dispatched trips can be completed."
        );

        return;

    }

    trip.status = "Completed";

    const vehicle = vehicles.find(v=>v.registration===trip.vehicle);

    const driver = drivers.find(d=>d.license===trip.driver);

    if(vehicle){

        vehicle.status = "Available";

    }

    if(driver){

        driver.status = "Available";

    }

    Storage.saveVehicles(vehicles);

    Storage.saveDrivers(drivers);

    Storage.saveTrips(trips);

    renderTrips();

    showPopup(
        "Completed",
        "Trip completed successfully."
    );

}

// ----------------------------
// Dashboard Sync
// ----------------------------

function refreshDashboard(){

    Storage.saveTrips(trips);

    updateSummary();

}

// ----------------------------
// Logout
// ----------------------------

document
.getElementById("logoutBtn")
.onclick = ()=>{

    if(confirm("Logout from TransitOps?")){

        localStorage.removeItem("email");

        localStorage.removeItem("role");

        location.href = "login.html";

    }

};

// ----------------------------
// Loader
// ----------------------------

window.onload = ()=>{

    setTimeout(()=>{

        document
        .getElementById("loader")
        .style.display = "none";

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
// Auto Refresh
// ----------------------------

setInterval(()=>{

    trips = Storage.getTrips();

    vehicles = Storage.getVehicles();

    drivers = Storage.getDrivers();

    if(searchTrip.value.trim()===""){

        renderTrips();

    } else {

        updateSummary();

    }

},5000);

// ----------------------------
// Initial Refresh
// ----------------------------

refreshDashboard();

renderTrips();