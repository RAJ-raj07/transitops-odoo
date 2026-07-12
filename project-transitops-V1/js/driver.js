// ==========================================
// TransitOps Driver Management
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

const modal = document.getElementById("driverModal");

const addBtn = document.getElementById("addDriver");

const closeBtn = document.getElementById("closeModal");

const cancelBtn = document.getElementById("cancelBtn");

const driverForm = document.getElementById("driverForm");

const popup = document.getElementById("popup");

const popupTitle = document.getElementById("popupTitle");

const popupMessage = document.getElementById("popupMessage");

const popupClose = document.getElementById("popupClose");

const driverBody = document.getElementById("driverBody");

const searchDriver = document.getElementById("searchDriver");

// ----------------------------
// Variables
// ----------------------------

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

popupClose.onclick = ()=>{

    popup.close();

};

// ----------------------------
// Modal
// ----------------------------

addBtn.onclick = ()=>{

    editIndex = -1;

    driverForm.reset();

    document.getElementById("modalTitle").textContent =
    "Add Driver";

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

    document.getElementById("totalDrivers").textContent =
    drivers.length;

    document.getElementById("availableDrivers").textContent =
    drivers.filter(d=>d.status==="Available").length;

    document.getElementById("tripDrivers").textContent =
    drivers.filter(d=>d.status==="On Trip").length;

    document.getElementById("suspendedDrivers").textContent =
    drivers.filter(d=>d.status==="Suspended").length;

}

// ----------------------------
// Render Table
// ----------------------------

function renderDrivers(list = drivers){

    driverBody.innerHTML = "";

    if(list.length===0){

        driverBody.innerHTML = `

        <tr>

        <td colspan="7" class="empty">

        No Drivers Registered

        </td>

        </tr>

        `;

        updateSummary();

        return;

    }

    list.forEach((driver,index)=>{

        driverBody.innerHTML += `

        <tr>

        <td>${driver.name}</td>

        <td>${driver.license}</td>

        <td>${driver.category}</td>

        <td>${driver.phone}</td>

        <td>${driver.score}</td>

        <td>

        <span class="badge ${driver.status.toLowerCase().replace(/\s/g,'')}">

        ${driver.status}

        </span>

        </td>

        <td>

        <button class="action-btn view"

        onclick="viewDriver(${index})">

        👁

        </button>

        <button class="action-btn edit"

        onclick="editDriver(${index})">

        ✏

        </button>

        <button class="action-btn delete"

        onclick="deleteDriver(${index})">

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

renderDrivers();
// ==========================================
// CRUD OPERATIONS
// Part 2
// ==========================================

// ----------------------------
// Save Driver
// ----------------------------

driverForm.addEventListener("submit", function(e){

    e.preventDefault();

    const driver = {

        name: document.getElementById("driverName").value.trim(),

        license: document.getElementById("licenseNumber").value.trim().toUpperCase(),

        category: document.getElementById("licenseCategory").value,

        expiry: document.getElementById("licenseExpiry").value,

        phone: document.getElementById("contactNumber").value.trim(),

        score: document.getElementById("safetyScore").value,

        status: document.getElementById("driverStatus").value

    };

    // ----------------------------
    // Validation
    // ----------------------------

    if(driver.name==="" || driver.license===""){

        showPopup(
            "Validation",
            "Driver Name and License Number are required."
        );

        return;

    }

    // ----------------------------
    // Duplicate License
    // ----------------------------

    const duplicate = drivers.findIndex(d=>

        d.license===driver.license

    );

    if(duplicate!==-1 && duplicate!==editIndex){

        showPopup(
            "Duplicate License",
            "License Number already exists."
        );

        return;

    }

    // ----------------------------
    // License Expiry Check
    // ----------------------------

    const today = new Date();

    const expiry = new Date(driver.expiry);

    if(expiry < today){

        showPopup(
            "Expired License",
            "Driver license has expired."
        );

        return;

    }

    // ----------------------------
    // Edit
    // ----------------------------

    if(editIndex!==-1){

        drivers[editIndex]=driver;

        showPopup(
            "Updated",
            "Driver updated successfully."
        );

    }

    // ----------------------------
    // Add
    // ----------------------------

    else{

        drivers.push(driver);

        showPopup(
            "Success",
            "Driver added successfully."
        );

    }

    Storage.saveDrivers(drivers);

    renderDrivers();

    modal.close();

});

// ----------------------------
// Edit Driver
// ----------------------------

function editDriver(index){

    editIndex=index;

    const driver=drivers[index];

    document.getElementById("modalTitle").textContent="Edit Driver";

    document.getElementById("driverName").value=driver.name;

    document.getElementById("licenseNumber").value=driver.license;

    document.getElementById("licenseCategory").value=driver.category;

    document.getElementById("licenseExpiry").value=driver.expiry;

    document.getElementById("contactNumber").value=driver.phone;

    document.getElementById("safetyScore").value=driver.score;

    document.getElementById("driverStatus").value=driver.status;

    modal.showModal();

}

// ----------------------------
// Delete Driver
// ----------------------------

function deleteDriver(index){

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

    drivers.splice(deleteIndex,1);

    Storage.saveDrivers(drivers);

    renderDrivers();

    document
    .getElementById("deleteDialog")
    .close();

    showPopup(
        "Deleted",
        "Driver removed successfully."
    );

};

// ----------------------------
// Refresh
// ----------------------------

document
.getElementById("refreshDrivers")
.onclick=()=>{

    drivers=Storage.getDrivers();

    renderDrivers();

    showPopup(
        "Refreshed",
        "Driver list updated."
    );

};
// ==========================================
// Part 3
// Search • View • Logout • Loader
// ==========================================

// ----------------------------
// Search Driver
// ----------------------------

searchDriver.addEventListener("keyup", function(){

    const value = this.value.toLowerCase();

    const filtered = drivers.filter(driver =>

        driver.name.toLowerCase().includes(value) ||

        driver.license.toLowerCase().includes(value) ||

        driver.category.toLowerCase().includes(value) ||

        driver.phone.toLowerCase().includes(value) ||

        driver.status.toLowerCase().includes(value)

    );

    renderDrivers(filtered);

});

// ----------------------------
// View Driver
// ----------------------------

function viewDriver(index){

    const driver = drivers[index];

    document.getElementById("driverDetails").innerHTML = `

        <p><strong>Name:</strong> ${driver.name}</p>

        <p><strong>License:</strong> ${driver.license}</p>

        <p><strong>Category:</strong> ${driver.category}</p>

        <p><strong>License Expiry:</strong> ${driver.expiry}</p>

        <p><strong>Phone:</strong> ${driver.phone}</p>

        <p><strong>Safety Score:</strong> ${driver.score}</p>

        <p><strong>Status:</strong> ${driver.status}</p>

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

        location.href = "login.html";

    }

};

// ----------------------------
// Dashboard Sync
// ----------------------------

function refreshDashboard(){

    Storage.saveDrivers(drivers);

    updateSummary();

}

// ----------------------------
// Auto Refresh
// ----------------------------

setInterval(()=>{

    drivers = Storage.getDrivers();

    if(searchDriver.value.trim()===""){

        renderDrivers();

    } else {

        updateSummary();

    }

},5000);

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
// Initial Refresh
// ----------------------------

refreshDashboard();

renderDrivers();