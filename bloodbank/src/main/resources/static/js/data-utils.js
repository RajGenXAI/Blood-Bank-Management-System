// =========================================================
// BLOOD BANK - DATA UTILITIES
// =========================================================

function getValue(data, key, defaultValue = "") {
    if (!data || data[key] === undefined || data[key] === null) {
        return defaultValue;
    }

    return data[key];
}


function getArray(data) {
    return Array.isArray(data) ? data : [];
}


function isEmptyArray(data) {
    return !Array.isArray(data) || data.length === 0;
}


function findById(data, id) {
    if (!Array.isArray(data)) {
        return null;
    }

    return data.find(function (item) {
        return String(item.id) === String(id);
    }) || null;
}


function sortById(data, descending = false) {
    if (!Array.isArray(data)) {
        return [];
    }

    return [...data].sort(function (a, b) {
        const result =
            Number(a.id || 0) - Number(b.id || 0);

        return descending ? -result : result;
    });
}


function countItems(data) {
    return Array.isArray(data) ? data.length : 0;
}


function countByValue(data, key, value) {
    if (!Array.isArray(data)) {
        return 0;
    }

    return data.filter(function (item) {
        return item[key] === value;
    }).length;
}