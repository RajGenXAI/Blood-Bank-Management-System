// =========================================================
// BLOOD BANK - FORMAT UTILITIES
// =========================================================

function formatBloodGroup(
    bloodGroup
) {

    if (!bloodGroup) {
        return "-";
    }

    const formatted =
        String(bloodGroup)
            .replace("_POSITIVE", "+")
            .replace("_NEGATIVE", "-");

    return formatted;
}


function formatStatus(status) {

    if (!status) {
        return "-";
    }

    return String(status)
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, function (letter) {
            return letter.toUpperCase();
        });
}


function formatNumber(value) {

    const number =
        Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString(
        "en-IN"
    );
}


function formatUnits(units) {

    const value =
        Number(units);

    if (!Number.isFinite(value)) {
        return "0 units";
    }

    return `${value} ${
        value === 1
            ? "unit"
            : "units"
    }`;
}


function formatName(name) {

    if (!name) {
        return "-";
    }

    return String(name)
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, function (letter) {
            return letter.toUpperCase();
        });
}


function truncateText(
    text,
    maxLength = 40
) {

    if (!text) {
        return "";
    }

    const value =
        String(text);

    if (value.length <= maxLength) {
        return value;
    }

    return value.substring(
        0,
        maxLength
    ) + "...";
}