// ======================================
// TransitOps Storage Manager
// ======================================

const Storage = {

    // -----------------------------
    // Get Data
    // -----------------------------

    get(key) {

        return JSON.parse(localStorage.getItem(key)) || [];

    },

    // -----------------------------
    // Save Data
    // -----------------------------

    save(key, data) {

        localStorage.setItem(key, JSON.stringify(data));

    },

    // =============================
    // VEHICLES
    // =============================

    getVehicles() {

        return this.get("vehicles");

    },

    saveVehicles(data) {

        this.save("vehicles", data);

    },

    // =============================
    // DRIVERS
    // =============================

    getDrivers() {

        return this.get("drivers");

    },

    saveDrivers(data) {

        this.save("drivers", data);

    },

    // =============================
    // TRIPS
    // =============================

    getTrips() {

        return this.get("trips");

    },

    saveTrips(data) {

        this.save("trips", data);

    },

    // =============================
    // MAINTENANCE
    // =============================

    getMaintenance() {

        return this.get("maintenance");

    },

    saveMaintenance(data) {

        this.save("maintenance", data);

    },

    // =============================
    // FUEL
    // =============================

    getFuel() {

        return this.get("fuel");

    },

    saveFuel(data) {

        this.save("fuel", data);

    },

    // =============================
    // EXPENSES
    // =============================

    getExpenses() {

        return this.get("expenses");

    },

    saveExpenses(data) {

        this.save("expenses", data);

    }

};


// ======================================
// First Time Default Data
// ======================================

if (!localStorage.getItem("vehicles")) {

    Storage.saveVehicles([]);

}

if (!localStorage.getItem("drivers")) {

    Storage.saveDrivers([]);

}

if (!localStorage.getItem("trips")) {

    Storage.saveTrips([]);

}

if (!localStorage.getItem("maintenance")) {

    Storage.saveMaintenance([]);

}

if (!localStorage.getItem("fuel")) {

    Storage.saveFuel([]);

}

if (!localStorage.getItem("expenses")) {

    Storage.saveExpenses([]);

}