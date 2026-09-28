// =========================================================
// BLOOD BANK - LOGIN
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    const loginForm =
        document.getElementById("loginForm");

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener(
        "submit",
        handleLogin
    );

});


// =========================
// LOGIN HANDLER
// =========================

function handleLogin(event) {

    event.preventDefault();

    hideLoginError();

    const email =
        document.getElementById("email")
            ?.value
            .trim();

    const password =
        document.getElementById("password")
            ?.value || "";


    // =========================
    // BASIC VALIDATION
    // =========================

    if (!email) {

        showLoginError(
            "Please enter your email address."
        );

        return;
    }


    if (!isValidEmail(email)) {

        showLoginError(
            "Please enter a valid email address."
        );

        return;
    }


    if (!password) {

        showLoginError(
            "Please enter your password."
        );

        return;
    }


    if (password.length < 6) {

        showLoginError(
            "Password must contain at least 6 characters."
        );

        return;
    }


    // =========================
    // LOGIN UI
    // =========================

    const loginButton =
        document.querySelector(
            "#loginForm button[type='submit']"
        );


    if (loginButton) {

        loginButton.disabled = true;

        loginButton.textContent =
            "Signing in...";

    }


    /*
     * Current project does not have
     * authentication API yet.
     *
     * Therefore this frontend login
     * performs validation and then
     * opens the dashboard.
     */

    setTimeout(function () {

        window.location.href =
            "dashboard.html";

    }, 500);
}


// =========================
// EMAIL VALIDATION
// =========================

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}


// =========================
// SHOW ERROR
// =========================

function showLoginError(message) {

    let errorBox =
        document.getElementById(
            "loginError"
        );


    if (!errorBox) {

        errorBox =
            document.createElement("div");

        errorBox.id =
            "loginError";

        errorBox.className =
            "form-error";


        const form =
            document.getElementById(
                "loginForm"
            );


        if (form) {

            form.insertBefore(
                errorBox,
                form.firstChild
            );

        }

    }


    errorBox.textContent =
        message;

    errorBox.style.display =
        "block";
}


// =========================
// HIDE ERROR
// =========================

function hideLoginError() {

    const errorBox =
        document.getElementById(
            "loginError"
        );


    if (errorBox) {

        errorBox.textContent =
            "";

        errorBox.style.display =
            "none";
    }
}