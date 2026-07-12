// ==========================================
// TransitOps Reports
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
// Load Data
// ----------------------------

const vehicles = Storage.getVehicles();

const drivers = Storage.getDrivers();

const trips = Storage.getTrips();

const maintenance = Storage.getMaintenance();

const fuel = Storage.getFuel();

// ----------------------------
// Calculate Values
// ----------------------------

const totalVehicles = vehicles.length;

const totalDrivers = drivers.length;

const totalTrips = trips.length;

const runningTrips =
trips.filter(t=>t.status==="Dispatched").length;

const completedTrips =
trips.filter(t=>t.status==="Completed").length;

const maintenanceVehicles =
vehicles.filter(v=>v.status==="In Shop").length;

const fuelCost =
fuel.reduce((sum,item)=>sum+Number(item.fuelCost||0),0);

const maintenanceCost =
maintenance.reduce((sum,item)=>sum+Number(item.cost||0),0);

const operationCost =
fuelCost + maintenanceCost;

const utilization =
totalVehicles===0
?0
:Math.round((runningTrips/totalVehicles)*100);

// ----------------------------
// Summary Cards
// ----------------------------

document.getElementById("reportVehicles").textContent=
totalVehicles;

document.getElementById("reportDrivers").textContent=
totalDrivers;

document.getElementById("reportTrips").textContent=
totalTrips;

document.getElementById("fleetUtilization").textContent=
utilization+"%";

document.getElementById("fuelCost").textContent=
"₹"+fuelCost.toLocaleString();

document.getElementById("maintenanceCost").textContent=
"₹"+maintenanceCost.toLocaleString();

document.getElementById("operationCost").textContent=
"₹"+operationCost.toLocaleString();

document.getElementById("completedTrips").textContent=
completedTrips;

// ----------------------------
// Performance Table
// ----------------------------

document.getElementById("metricVehicles").textContent=
totalVehicles;

document.getElementById("metricDrivers").textContent=
totalDrivers;

document.getElementById("metricTrips").textContent=
totalTrips;

document.getElementById("metricRunningTrips").textContent=
runningTrips;

document.getElementById("metricCompletedTrips").textContent=
completedTrips;

document.getElementById("metricMaintenance").textContent=
maintenanceVehicles;

document.getElementById("metricFuelCost").textContent=
"₹"+fuelCost.toLocaleString();

document.getElementById("metricMaintenanceCost").textContent=
"₹"+maintenanceCost.toLocaleString();

document.getElementById("metricOperationCost").textContent=
"₹"+operationCost.toLocaleString();
// ==========================================
// Reports Part 2
// ==========================================

// ----------------------------
// Recent Activity
// ----------------------------

const activityBody = document.getElementById("activityBody");

let activities = [];

trips.forEach(trip => {

    activities.push({

        text: `Trip ${trip.id} (${trip.status})`,

        date: trip.date || "-"

    });

});

maintenance.forEach(item => {

    activities.push({

        text: `Maintenance ${item.id} (${item.status})`,

        date: item.date

    });

});

fuel.forEach(item => {

    activities.push({

        text: `Fuel Record ${item.id}`,

        date: item.date

    });

});

activityBody.innerHTML = "";

if(activities.length===0){

    activityBody.innerHTML=`

    <tr>

    <td colspan="2" class="empty">

    No Recent Activity

    </td>

    </tr>

    `;

}else{

    activities.reverse().slice(0,10).forEach(item=>{

        activityBody.innerHTML+=`

        <tr>

        <td>${item.text}</td>

        <td>${item.date}</td>

        </tr>

        `;

    });

}

// ----------------------------
// Report Summary
// ----------------------------

document.getElementById("reportSummary").innerHTML=`

<b>Total Vehicles:</b> ${totalVehicles}<br><br>

<b>Total Drivers:</b> ${totalDrivers}<br><br>

<b>Total Trips:</b> ${totalTrips}<br><br>

<b>Completed Trips:</b> ${completedTrips}<br><br>

<b>Fleet Utilization:</b> ${utilization}%<br><br>

<b>Total Fuel Cost:</b> ₹${fuelCost.toLocaleString()}<br><br>

<b>Total Maintenance Cost:</b> ₹${maintenanceCost.toLocaleString()}<br><br>

<b>Total Operational Cost:</b> ₹${operationCost.toLocaleString()}

`;

// ----------------------------
// Print
// ----------------------------

document.getElementById("printReport").onclick=()=>{

    window.print();

};

// ----------------------------
// Export CSV
// ----------------------------

document.getElementById("downloadCSV").onclick=()=>{

    let csv="Metric,Value\n";

    csv+=`Vehicles,${totalVehicles}\n`;

    csv+=`Drivers,${totalDrivers}\n`;

    csv+=`Trips,${totalTrips}\n`;

    csv+=`Running Trips,${runningTrips}\n`;

    csv+=`Completed Trips,${completedTrips}\n`;

    csv+=`Maintenance Vehicles,${maintenanceVehicles}\n`;

    csv+=`Fuel Cost,${fuelCost}\n`;

    csv+=`Maintenance Cost,${maintenanceCost}\n`;

    csv+=`Operational Cost,${operationCost}\n`;

    const blob=new Blob([csv],{

        type:"text/csv"

    });

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download="TransitOps_Report.csv";

    a.click();

    URL.revokeObjectURL(url);

};

// ----------------------------
// Logout
// ----------------------------

document.getElementById("logoutBtn").onclick=()=>{

    if(confirm("Logout?")){

        localStorage.removeItem("email");

        localStorage.removeItem("role");

        location.href="index.html";

    }

};

// ----------------------------
// Loader
// ----------------------------

window.onload=()=>{

    setTimeout(()=>{

        document.getElementById("loader").style.display="none";

    },700);

};

// ----------------------------
// Popup
// ----------------------------

const popup=document.getElementById("popup");

const popupTitle=document.getElementById("popupTitle");

const popupMessage=document.getElementById("popupMessage");

document.getElementById("popupClose").onclick=()=>{

    popup.close();

};

// ----------------------------
// Auto Refresh
// ----------------------------

setInterval(()=>{

    location.reload();

},30000);