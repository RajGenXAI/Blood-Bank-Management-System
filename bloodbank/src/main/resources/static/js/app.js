// =========================================================
// BLOOD BANK - COMMON APP UTILITIES
// =========================================================

const APP_API_BASE_URL = "/api";


// ---------------------------------------------------------
// API ERROR MESSAGE
// ---------------------------------------------------------

async function getApiErrorMessage(response) {

    try {

        const data =
            await response.json();

        if (data.message) {
            return data.message;
        }

        if (data.error) {
            return data.error;
        }

        if (data.errors &&
            Array.isArray(data.errors)) {

            return data.errors
                .map(error => error.defaultMessage || error.message)
                .join(", ");
        }

    } catch (error) {
        // Response was not JSON
    }

    return "Something went wrong. Please try again.";
}


// ---------------------------------------------------------
// HTML ESCAPE
// ---------------------------------------------------------

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ---------------------------------------------------------
// DATE FORMAT
// ---------------------------------------------------------

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date =
        new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ---------------------------------------------------------
// TODAY DATE
// ---------------------------------------------------------

function getTodayDate() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ---------------------------------------------------------
// LOGOUT
// ---------------------------------------------------------

function logout() {

    localStorage.removeItem(
        "bloodBankUser"
    );

    sessionStorage.removeItem(
        "bloodBankUser"
    );

    window.location.href =
        "index.html";
}


// ---------------------------------------------------------
// CONFIRM DELETE
// ---------------------------------------------------------

function confirmDelete(message =
                       "Are you sure you want to delete this record?"
) {

    return window.confirm(message);
}


// ---------------------------------------------------------
// COMMON NAVIGATION
// ---------------------------------------------------------

function goToPage(page) {

    if (!page) {
        return;
    }

    window.location.href =
        page;
}


// ---------------------------------------------------------
// ACTIVE SIDEBAR LINK
// ---------------------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const currentPage =
            window.location.pathname
                .split("/")
                .pop();

        const sidebarLinks =
            document.querySelectorAll(
                ".sidebar-nav a"
            );

        sidebarLinks.forEach(
            function (link) {

                const href =
                    link.getAttribute("href");

                if (href === currentPage) {
                    link.classList.add(
                        "active"
                    );
                }
            }
        );
    }
);