// ===========================
// TransitOps Login Script
// ===========================

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const role = document.getElementById("role");

const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popupMessage");
const closePopup = document.getElementById("closePopup");

const togglePassword = document.getElementById("togglePassword");

let attempts = 0;

// ----------------------------
// Popup
// ----------------------------

function showPopup(message) {
    popupMessage.innerText = message;
    popup.showModal();
}

closePopup.addEventListener("click", () => {
    popup.close();
});

// ----------------------------
// Show / Hide Password
// ----------------------------

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";
        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        password.type = "password";
        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

});

// ----------------------------
// Email Validation
// ----------------------------

function validEmail(emailAddress) {

    let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(emailAddress);

}

// ----------------------------
// Login
// ----------------------------

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    let userEmail = email.value.trim();
    let userPassword = password.value.trim();
    let userRole = role.value;

    if (userEmail === "") {
        showPopup("Please enter your email.");
        return;
    }

    if (!validEmail(userEmail)) {
        showPopup("Please enter a valid email.");
        return;
    }

    if (userPassword === "") {
        showPopup("Please enter your password.");
        return;
    }

    if (userPassword.length < 6) {
        showPopup("Password must be at least 6 characters.");
        return;
    }

    if (userRole === "") {
        showPopup("Please select your role.");
        return;
    }

    // ----------------------------
    // Demo Users
    // ----------------------------

    const users = [

        {
            email: "fleet@transitops.com",
            password: "fleet123",
            role: "Fleet Manager"
        },

        {
            email: "dispatcher@transitops.com",
            password: "dispatch123",
            role: "Dispatcher"
        },

        {
            email: "safety@transitops.com",
            password: "safety123",
            role: "Safety Officer"
        },

        {
            email: "finance@transitops.com",
            password: "finance123",
            role: "Financial Analyst"
        }

    ];

    const user = users.find(u =>
        u.email === userEmail &&
        u.password === userPassword &&
        u.role === userRole
    );

    if (user) {

        const button = document.querySelector(".login-btn");

        button.innerHTML = "Signing In...";
        button.disabled = true;

        localStorage.setItem("email", user.email);
        localStorage.setItem("role", user.role);

        setTimeout(() => {

            showPopup("Login Successful!");

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 1200);

        }, 1000);

    }

    else {

        attempts++;

        if (attempts >= 3) {

            showPopup("Too many failed attempts. Try again after 10 seconds.");

            document.querySelector(".login-btn").disabled = true;

            setTimeout(() => {

                attempts = 0;

                document.querySelector(".login-btn").disabled = false;

            }, 10000);

        }

        else {

            showPopup("Incorrect email, password or role.");

        }

    }

});

// ----------------------------
// Remember Me
// ----------------------------

const remember = document.querySelector(".remember input");

window.onload = () => {

    if (localStorage.getItem("remember") === "true") {

        remember.checked = true;

        email.value = localStorage.getItem("savedEmail") || "";

    }

};

remember.addEventListener("change", () => {

    if (remember.checked) {

        localStorage.setItem("remember", true);
        localStorage.setItem("savedEmail", email.value);

    }

    else {

        localStorage.removeItem("remember");
        localStorage.removeItem("savedEmail");

    }

});

// ----------------------------
// Save Email While Typing
// ----------------------------

email.addEventListener("keyup", () => {

    if (remember.checked) {

        localStorage.setItem("savedEmail", email.value);

    }

});