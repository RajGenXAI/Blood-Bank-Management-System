// =========================================================
// BLOOD BANK - FRONTEND CONFIGURATION
// =========================================================

const APP_CONFIG = {
    API_BASE_URL: "/api",

    REQUEST_TIMEOUT: 10000,

    DATE_LOCALE: "en-IN",

    DONOR_MINIMUM_GAP_DAYS: 90,

    BLOOD_NEAR_EXPIRY_DAYS: 3
};


// ---------------------------------------------------------
// API URL HELPER
// ---------------------------------------------------------

function getApiUrl(endpoint) {

    if (!endpoint) {
        return APP_CONFIG.API_BASE_URL;
    }

    if (endpoint.startsWith("/")) {
        return `${APP_CONFIG.API_BASE_URL}${endpoint}`;
    }

    return `${APP_CONFIG.API_BASE_URL}/${endpoint}`;
}


// ---------------------------------------------------------
// CONFIG VALUE HELPER
// ---------------------------------------------------------

function getConfig(key, defaultValue = null) {

    if (
        Object.prototype.hasOwnProperty.call(
            APP_CONFIG,
            key
        )
    ) {
        return APP_CONFIG[key];
    }

    return defaultValue;
}