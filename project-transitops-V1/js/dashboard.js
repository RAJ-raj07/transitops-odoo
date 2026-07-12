// ======================================
// TransitOps Dashboard
// ======================================

// ----------------------------
// Login Check
// ----------------------------

const email = localStorage.getItem("email");
const role = localStorage.getItem("role");

if (!email || !role) {

    window.location.href = "login.html";

}

// ----------------------------
// Welcome Text
// ----------------------------

document.getElementById("welcomeText").innerHTML =
`Welcome back, ${role}`;

document.getElementById("userRole").innerHTML = role;

// ----------------------------
// Role Based Access
// ----------------------------

function hide(id){

    document.getElementById(id).style.display="none";

}

switch(role){

    case "Fleet Manager":

        hide("driverMenu");
        hide("tripMenu");
        hide("fuelMenu");
        hide("reportMenu");

        hide("driverPageBtn");
        hide("viewTripsBtn");

        break;

    case "Dispatcher":

        hide("vehicleMenu");
        hide("maintenanceMenu");
        hide("fuelMenu");
        hide("reportMenu");

        hide("addVehicleBtn");
        hide("addDriverBtn");
        hide("vehiclePageBtn");
        hide("driverPageBtn");

        break;

    case "Safety Officer":

        hide("vehicleMenu");
        hide("tripMenu");
        hide("maintenanceMenu");
        hide("fuelMenu");
        hide("reportMenu");

        hide("addVehicleBtn");
        hide("createTripBtn");
        hide("vehiclePageBtn");
        hide("viewTripsBtn");

        break;

    case "Financial Analyst":

        hide("vehicleMenu");
        hide("driverMenu");
        hide("tripMenu");
        hide("maintenanceMenu");

        hide("addVehicleBtn");
        hide("addDriverBtn");
        hide("createTripBtn");
        hide("vehiclePageBtn");
        hide("driverPageBtn");
        hide("viewTripsBtn");

        break;

}

// ----------------------------
// Logout
// ----------------------------

document
.getElementById("logoutBtn")
.addEventListener("click",()=>{

    localStorage.removeItem("email");
    localStorage.removeItem("role");

    location.href="login.html";

});

// ----------------------------
// Read Storage
// ----------------------------

const vehicles = Storage.getVehicles();
const drivers = Storage.getDrivers();
const trips = Storage.getTrips();
const fuel = Storage.getFuel();
const expenses = Storage.getExpenses();

// ----------------------------
// Dashboard Cards
// ----------------------------

document.getElementById("totalVehicles").innerHTML =
vehicles.length;

document.getElementById("availableVehicles").innerHTML =
vehicles.filter(v=>v.status==="Available").length;

document.getElementById("runningTrips").innerHTML =
trips.filter(t=>t.status==="Dispatched").length;

document.getElementById("maintenanceVehicles").innerHTML =
vehicles.filter(v=>v.status==="Maintenance").length;

document.getElementById("activeDrivers").innerHTML =
drivers.filter(d=>d.status==="Available").length;

let utilization = 0;

if(vehicles.length>0){

    utilization =
    Math.round(
        (trips.filter(t=>t.status==="Dispatched").length /
        vehicles.length)*100
    );

}

document.getElementById("fleetUtilization").innerHTML =
utilization+"%";

// ----------------------------
// Summary
// ----------------------------

document.getElementById("driverCount").innerHTML =
drivers.length;

document.getElementById("tripCount").innerHTML =
trips.length;

document.getElementById("fuelLogs").innerHTML =
fuel.length;

let totalExpense=0;

expenses.forEach(e=>{

    totalExpense+=Number(e.amount);

});

document.getElementById("expenseTotal").innerHTML =
"₹"+totalExpense;

// ----------------------------
// Vehicle Table (filterable)
// ----------------------------

const vehicleTable =
document.getElementById("vehicleTable");

const typeFilter = document.getElementById("vehicleType");
const statusFilter = document.getElementById("vehicleStatus");
const regionFilter = document.getElementById("vehicleRegion");

function renderVehicleTable(){

    const typeValue = typeFilter.value;
    const statusValue = statusFilter.value;
    const regionValue = regionFilter.value;

    const filtered = vehicles.filter(v=>{

        const matchesType = typeValue==="" || v.type===typeValue;
        const matchesStatus = statusValue==="" || v.status===statusValue;
        const matchesRegion = regionValue==="" || v.region===regionValue;

        return matchesType && matchesStatus && matchesRegion;

    });

    if(filtered.length===0){

        vehicleTable.innerHTML =
        `<tr><td colspan="4">No Vehicles Found</td></tr>`;

        return;

    }

    vehicleTable.innerHTML="";

    filtered.forEach(v=>{

    vehicleTable.innerHTML+=`

    <tr>

    <td>${v.registration}</td>

    <td>${v.name}</td>

    <td>${v.type}</td>

    <td>${v.status}</td>

    </tr>

    `;

    });

}

renderVehicleTable();

typeFilter.addEventListener("change", renderVehicleTable);
statusFilter.addEventListener("change", renderVehicleTable);
regionFilter.addEventListener("change", renderVehicleTable);

// ----------------------------
// Driver Table
// ----------------------------

const driverTable =
document.getElementById("driverTable");

driverTable.innerHTML="";

drivers.forEach(d=>{

driverTable.innerHTML+=`

<tr>

<td>${d.name}</td>

<td>${d.license}</td>

<td>${d.status}</td>

<td>${d.score}</td>

</tr>

`;

});

// ----------------------------
// Trip Table
// ----------------------------

const tripTable =
document.getElementById("recentTrips");

tripTable.innerHTML="";

trips.forEach(t=>{

tripTable.innerHTML+=`

<tr>

<td>${t.id}</td>

<td>${t.vehicle}</td>

<td>${t.driver}</td>

<td>${t.status}</td>

</tr>

`;

});

// ----------------------------
// Loader
// ----------------------------

window.onload=()=>{

setTimeout(()=>{

document.getElementById("loader").style.display="none";

},700);

};

// ----------------------------
// Notification
// ----------------------------

document
.querySelector(".notify")
.addEventListener("click",()=>{

document
.getElementById("notificationDialog")
.showModal();

});

document
.getElementById("closeNotification")
.addEventListener("click",()=>{

document
.getElementById("notificationDialog")
.close();

});
console.log("Dashboard JS Loaded");

document.getElementById("addVehicleBtn").onclick = function () {
    location.href = "vehicle.html";
};

document.getElementById("addDriverBtn").onclick = function () {
    location.href = "driver.html";
};

document.getElementById("createTripBtn").onclick = function () {
    location.href = "trip.html";
};

document.getElementById("viewTripsBtn").onclick = function () {
    location.href = "trip.html";
};

document.getElementById("vehiclePageBtn").onclick = function () {
    location.href = "vehicle.html";
};

document.getElementById("driverPageBtn").onclick = function () {
    location.href = "driver.html";
};