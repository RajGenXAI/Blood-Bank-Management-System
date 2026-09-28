// =========================================================
// BLOOD BANK - PROFILE UTILITIES
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    loadUserProfile();

});


// ---------------------------------------------------------
// LOAD USER PROFILE
// ---------------------------------------------------------

function loadUserProfile() {

    const email =
        typeof getLoggedInEmail === "function"
            ? getLoggedInEmail()
            : "";

    const emailElement =
        document.getElementById("profileEmail");

    if (emailElement) {
        emailElement.textContent =
            email || "Administrator";
    }

    const nameElement =
        document.getElementById("profileName");

    if (nameElement && !nameElement.textContent.trim()) {
        nameElement.textContent =
            "Blood Bank Administrator";
    }
}


// ---------------------------------------------------------
// DISPLAY PROFILE DATA
// ---------------------------------------------------------

function displayProfileData(
    name,
    email
) {

    const nameElement =
        document.getElementById("profileName");

    const emailElement =
        document.getElementById("profileEmail");

    if (nameElement) {
        nameElement.textContent =
            name || "Blood Bank Administrator";
    }

    if (emailElement) {
        emailElement.textContent =
            email || "Administrator";
    }
}


// ---------------------------------------------------------
// PROFILE LOGOUT
// ---------------------------------------------------------

function profileLogout() {

    if (
        typeof logoutUser === "function"
    ) {
        logoutUser();
        return;
    }

    localStorage.removeItem(
        "bloodBankUser"
    );

    sessionStorage.removeItem(
        "bloodBankUser"
    );

    window.location.href =
        "index.html";
}