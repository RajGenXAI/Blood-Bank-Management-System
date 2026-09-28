// =========================================================
// BLOOD BANK - AUTHENTICATION UTILITIES
// =========================================================

const AUTH_STORAGE_KEY = "bloodBankUser";


// ---------------------------------------------------------
// SAVE USER SESSION
// ---------------------------------------------------------

function saveUserSession(email, rememberMe = false) {

    const userData = {
        email: email,
        loggedIn: true
    };

    const data =
        JSON.stringify(userData);

    if (rememberMe) {

        localStorage.setItem(
            AUTH_STORAGE_KEY,
            data
        );

    } else {

        sessionStorage.setItem(
            AUTH_STORAGE_KEY,
            data
        );
    }
}


// ---------------------------------------------------------
// GET USER SESSION
// ---------------------------------------------------------

function getUserSession() {

    const localUser =
        localStorage.getItem(
            AUTH_STORAGE_KEY
        );

    if (localUser) {
        return JSON.parse(localUser);
    }

    const sessionUser =
        sessionStorage.getItem(
            AUTH_STORAGE_KEY
        );

    if (sessionUser) {
        return JSON.parse(sessionUser);
    }

    return null;
}


// ---------------------------------------------------------
// CHECK LOGIN STATUS
// ---------------------------------------------------------

function isLoggedIn() {

    const user =
        getUserSession();

    return user !== null &&
        user.loggedIn === true;
}


// ---------------------------------------------------------
// PROTECT PAGE
// ---------------------------------------------------------

function requireLogin() {

    if (!isLoggedIn()) {

        window.location.href =
            "index.html";

        return false;
    }

    return true;
}


// ---------------------------------------------------------
// LOGOUT USER
// ---------------------------------------------------------

function logoutUser() {

    localStorage.removeItem(
        AUTH_STORAGE_KEY
    );

    sessionStorage.removeItem(
        AUTH_STORAGE_KEY
    );

    window.location.href =
        "index.html";
}


// ---------------------------------------------------------
// GET LOGGED-IN EMAIL
// ---------------------------------------------------------

function getLoggedInEmail() {

    const user =
        getUserSession();

    if (!user) {
        return "";
    }

    return user.email || "";
}