// =========================================================
// BLOOD BANK - DATE UTILITIES
// =========================================================

function getCurrentDate() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function addDays(dateValue, days) {

    const date =
        new Date(dateValue);

    date.setDate(
        date.getDate() + Number(days)
    );

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function isExpired(dateValue) {

    if (!dateValue) {
        return false;
    }

    return new Date(dateValue) <
        new Date(getCurrentDate());
}


function isToday(dateValue) {

    return dateValue ===
        getCurrentDate();
}


function daysBetween(
    startDate,
    endDate
) {

    const start =
        new Date(startDate);

    const end =
        new Date(endDate);

    const difference =
        end.getTime() - start.getTime();

    return Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );
}


function formatDateShort(dateValue) {

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