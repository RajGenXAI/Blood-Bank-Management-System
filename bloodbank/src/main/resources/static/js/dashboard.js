// =========================================================
// BLOOD BANK - DASHBOARD
// =========================================================

const API_BASE_URL = "/api";


// =========================
// PAGE LOAD
// =========================

document.addEventListener("DOMContentLoaded", function () {
    loadDashboardSummary();
});


// =========================
// LOAD DASHBOARD SUMMARY
// =========================

async function loadDashboardSummary() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/dashboard/summary`
        );

        if (!response.ok) {
            throw new Error("Unable to load dashboard data.");
        }

        const data = await response.json();

        updateDashboardCards(data);

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

        showDashboardFallback();

    }
}


// =========================
// UPDATE SUMMARY CARDS
// =========================

function updateDashboardCards(data) {

    setValue(
        "totalDonors",
        data.totalDonors ?? 0
    );

    setValue(
        "totalDonations",
        data.totalDonations ?? 0
    );

    setValue(
        "totalBloodUnits",
        data.totalBloodUnits ?? 0
    );

    setValue(
        "totalIssues",
        data.totalIssues ?? 0
    );

    setValue(
        "availableBloodUnits",
        data.availableBloodUnits ?? 0
    );

    setValue(
        "expiredBloodUnits",
        data.expiredBloodUnits ?? 0
    );
}


// =========================
// SET ELEMENT VALUE
// =========================

function setValue(elementId, value) {

    const element = document.getElementById(elementId);

    if (element) {
        element.textContent = value;
    }
}


// =========================
// FALLBACK
// =========================

function showDashboardFallback() {

    setValue("totalDonors", 0);
    setValue("totalDonations", 0);
    setValue("totalBloodUnits", 0);
    setValue("totalIssues", 0);
    setValue("availableBloodUnits", 0);
    setValue("expiredBloodUnits", 0);
}