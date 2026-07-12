# TransitOps

Smart Transport Operations Platform — a role-based fleet, driver, and trip management system.

## Problem Statement

Small and mid-sized logistics operators often manage vehicles, drivers, and trips through spreadsheets or disconnected tools, making it hard to see fleet status at a glance, prevent double-booking of vehicles or drivers, or enforce basic operational rules (like not exceeding a truck's cargo capacity). TransitOps addresses this with a lightweight, browser-based operations dashboard that keeps vehicle, driver, and trip data in sync in real time.

## Project Overview

TransitOps is a client-side web application for managing a transport fleet. It supports role-based login, vehicle and driver registries, and a trip dispatch workflow that automatically updates vehicle and driver availability as trips are created, dispatched, completed, or cancelled. All data is stored locally in the browser via `localStorage` — no backend or database is required.

## Features

- Role-based login with four roles: Fleet Manager, Dispatcher, Safety Officer, Financial Analyst
- Role-scoped navigation and permissions (each role sees only the sections it needs)
- Vehicle registry with add/edit/delete/search and live status tracking
- Driver registry with add/edit/delete/search, license expiry validation, and safety scores
- Trip dispatch workflow with automatic vehicle/driver status synchronization
- Central dashboard with live fleet stats, filterable vehicle status table, and recent activity
- Duplicate prevention for vehicle registrations, driver licenses, and trip IDs
- Cargo capacity validation against the assigned vehicle
- Responsive layout for desktop, tablet, and mobile

## Modules

| Module | File | Description |
|---|---|---|
| Login | `login.html` / `auth.js` | Role-based authentication (demo credentials below) |
| Dashboard | `dashboard.html` / `js/dashboard.js` | Fleet-wide overview, quick actions, filters |
| Vehicles | `vehicle.html` / `js/vehicle.js` | Vehicle registry CRUD (Fleet Manager only) |
| Drivers | `driver.html` / `js/driver.js` | Driver registry CRUD (Fleet Manager only) |
| Trips | `trip.html` / `js/trip.js` | Trip creation, dispatch, and completion |
| Storage | `js/storage.js` | Shared `localStorage` data access layer |

## Folder Structure

```
project-transitops/
├── login.html
├── login.css
├── auth.js
├── dashboard.html
├── dashboard.css
├── vehicle.html
├── vehicle.css
├── driver.html
├── driver.css
├── trip.html
├── trip.css
├── js/
│   ├── storage.js
│   ├── dashboard.js
│   ├── vehicle.js
│   ├── driver.js
│   └── trip.js
└── README.md
```

## Technologies Used

- HTML5
- CSS3 (responsive, no framework)
- Vanilla JavaScript (ES6+)
- Browser `localStorage` for persistence
- Font Awesome (icons) and Google Fonts (Poppins) via CDN

No React, Bootstrap, Tailwind, jQuery, or backend server is used.

## How to Run

1. Download or clone this project.
2. Open `login.html` directly in a modern browser (Chrome, Edge, or Firefox recommended).
3. Sign in with one of the demo accounts below.
4. All data you create is saved to your browser's `localStorage` and will persist between visits on the same browser/device.

No build step, server, or installation is required.

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Fleet Manager | fleet@transitops.com | fleet123 |
| Dispatcher | dispatcher@transitops.com | dispatch123 |
| Safety Officer | safety@transitops.com | safety123 |
| Financial Analyst | finance@transitops.com | finance123 |

## Workflow

1. **Login** — Choose a role and sign in with the matching demo account.
2. **Register Vehicles** (Fleet Manager) — Add vehicles with registration, type, capacity, and region.
3. **Register Drivers** (Fleet Manager) — Add drivers with license number, category, and expiry date.
4. **Create & Dispatch Trips** (Fleet Manager / Dispatcher) — Assign an available vehicle and driver to a trip. Dispatching marks both as "On Trip."
5. **Complete Trips** — Marking a trip complete returns its vehicle and driver to "Available."
6. **Monitor** — The Dashboard reflects live counts, statuses, and recent activity across all modules.

## Business Rules

- Only vehicles with status **Available** can be assigned to a new trip (the exception is the vehicle already assigned when editing an existing dispatched trip).
- Only drivers with status **Available** can be assigned to a new trip, with the same edit-time exception.
- Duplicate vehicle registration numbers are rejected.
- Duplicate driver license numbers are rejected.
- Duplicate Trip IDs are rejected.
- Cargo weight cannot exceed the assigned vehicle's capacity.
- Dispatching a trip sets its vehicle and driver to **On Trip**.
- Completing a trip sets its vehicle and driver back to **Available**.
- Deleting or reassigning a dispatched trip releases its vehicle and driver back to **Available**.
- Driver licenses that have already expired cannot be saved.

## Screenshots

_Add screenshots of the Login, Dashboard, Vehicles, Drivers, and Trips pages here before submission._

- `screenshots/login.png`
- `screenshots/dashboard.png`
- `screenshots/vehicles.png`
- `screenshots/drivers.png`
- `screenshots/trips.png`

## Future Scope

- Maintenance scheduling module
- Fuel and expense tracking module
- Reporting and analytics dashboard
- Backend API with a real database and multi-device sync
- Push/email notifications for license expiry and maintenance due dates
- Route optimization and live GPS tracking integration

## Team Members

_Add team member names and roles here._

## License

This project was built for hackathon submission purposes. Add a license (e.g. MIT) here if you intend to distribute or open-source it.
