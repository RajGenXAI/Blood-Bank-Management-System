// =========================================================
// BLOOD BANK - BLOOD ISSUES
// =========================================================

const ISSUE_API_URL = "/api/issues";
const BLOOD_UNIT_API_URL = "/api/blood-units";

let issues = [];
let availableUnits = [];


// =========================
// PAGE LOAD
// =========================

document.addEventListener("DOMContentLoaded", function () {

    loadIssues();
    loadAvailableUnits();
    setTodayIssueDate();

    const form =
        document.getElementById("issueForm");

    if (form) {
        form.addEventListener(
            "submit",
            saveIssue
        );
    }

});


// =========================
// LOAD ISSUES
// =========================

async function loadIssues() {

    try {

        const response =
            await fetch(ISSUE_API_URL);

        if (!response.ok) {
            throw new Error(
                "Unable to load blood issue records."
            );
        }

        issues =
            await response.json();

        renderIssues(issues);

    } catch (error) {

        console.error(
            "Issue loading error:",
            error
        );

        showIssueError(
            "Unable to load blood issue records."
        );
    }
}


// =========================
// LOAD AVAILABLE BLOOD UNITS
// =========================

async function loadAvailableUnits() {

    try {

        const response =
            await fetch(
                `${BLOOD_UNIT_API_URL}/available`
            );

        if (!response.ok) {
            throw new Error(
                "Unable to load available blood units."
            );
        }

        availableUnits =
            await response.json();

        populateBloodUnitDropdown();

    } catch (error) {

        console.error(
            "Available unit loading error:",
            error
        );

        showIssueError(
            "Unable to load available blood units."
        );
    }
}


// =========================
// POPULATE BLOOD UNIT DROPDOWN
// =========================

function populateBloodUnitDropdown() {

    const select =
        document.getElementById(
            "issueBloodUnitId"
        );

    if (!select) {
        return;
    }

    select.innerHTML = `
        <option value="">
            Select available blood unit
        </option>
    `;


    availableUnits.forEach(function (unit) {

        if (
            unit.status !== "AVAILABLE" ||
            isExpired(unit.expiryDate) ||
            isNearExpiry(unit.expiryDate)
        ) {
            return;
        }


        const option =
            document.createElement("option");

        option.value =
            unit.id;

        option.textContent =
            `${unit.unitCode} - ${formatBloodGroup(unit.bloodGroup)} - Expires ${formatDate(unit.expiryDate)}`;

        select.appendChild(option);

    });
}


// =========================
// RENDER ISSUES
// =========================

function renderIssues(list) {

    const tableBody =
        document.getElementById(
            "issueTableBody"
        );

    const count =
        document.getElementById(
            "issueCount"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (count) {

        count.textContent =
            `${list.length} record${list.length === 1 ? "" : "s"}`;

    }


    if (list.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8">

                    <div class="empty-state">

                        <img
                            src="images/empty-issues.png"
                            alt="No Blood Issues"
                        >

                        <h3>No blood issue records</h3>

                        <p>
                            Issue a blood unit to create
                            a distribution record.
                        </p>

                    </div>

                </td>
            </tr>
        `;

        return;
    }


    list.forEach(function (issue) {

        const bloodUnit =
            issue.bloodUnit || null;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${issue.id ?? "-"}
            </td>

            <td>
                <strong>
                    ${escapeHtml(
            bloodUnit?.unitCode || "-"
        )}
                </strong>
            </td>

            <td>
                ${formatBloodGroup(
            bloodUnit?.bloodGroup
        )}
            </td>

            <td>
                ${escapeHtml(
            issue.recipientName || "-"
        )}
            </td>

            <td>
                ${escapeHtml(
            issue.hospitalName || "-"
        )}
            </td>

            <td>
                ${formatDate(
            issue.issueDate
        )}
            </td>

            <td>
                ${createStatusBadge(
            issue.status
        )}
            </td>

            <td>

                <button
                    type="button"
                    class="table-action delete"
                    onclick="deleteIssue(${issue.id})"
                >
                    Delete
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });
}


// =========================
// SEARCH + FILTER
// =========================

function filterIssues() {

    const searchInput =
        document.getElementById(
            "issueSearch"
        );

    const statusFilter =
        document.getElementById(
            "issueStatusFilter"
        );


    const search =
        (searchInput?.value || "")
            .trim()
            .toLowerCase();


    const status =
        statusFilter?.value || "";


    const filtered =
        issues.filter(
            function (issue) {

                const bloodUnit =
                    issue.bloodUnit || {};


                const unitCode =
                    String(
                        bloodUnit.unitCode || ""
                    )
                        .toLowerCase();


                const recipient =
                    String(
                        issue.recipientName || ""
                    )
                        .toLowerCase();


                const hospital =
                    String(
                        issue.hospitalName || ""
                    )
                        .toLowerCase();


                const matchesSearch =
                    !search ||
                    unitCode.includes(search) ||
                    recipient.includes(search) ||
                    hospital.includes(search);


                const matchesStatus =
                    !status ||
                    issue.status === status;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    renderIssues(filtered);
}


// =========================
// OPEN ISSUE FORM
// =========================

function openIssueForm() {

    const modal =
        document.getElementById(
            "issueModal"
        );

    const form =
        document.getElementById(
            "issueForm"
        );


    if (form) {
        form.reset();
    }


    hideIssueError();
    hideIssueWarning();

    setTodayIssueDate();

    loadAvailableUnits();


    if (modal) {
        modal.style.display =
            "flex";
    }
}


// =========================
// CLOSE ISSUE FORM
// =========================

function closeIssueForm() {

    const modal =
        document.getElementById(
            "issueModal"
        );


    if (modal) {
        modal.style.display =
            "none";
    }


    hideIssueError();
    hideIssueWarning();
}


// =========================
// SAVE ISSUE
// =========================

async function saveIssue(event) {

    event.preventDefault();

    hideIssueError();
    hideIssueWarning();


    const bloodUnitId =
        document.getElementById(
            "issueBloodUnitId"
        ).value;


    const recipientName =
        document.getElementById(
            "recipientName"
        ).value.trim();


    const hospitalName =
        document.getElementById(
            "hospitalName"
        ).value.trim();


    const issueDate =
        document.getElementById(
            "issueDate"
        ).value;


    if (!bloodUnitId) {

        showIssueError(
            "Please select a blood unit."
        );

        return;
    }


    if (!recipientName) {

        showIssueError(
            "Please enter the recipient name."
        );

        return;
    }


    if (!hospitalName) {

        showIssueError(
            "Please enter the hospital name."
        );

        return;
    }


    if (!issueDate) {

        showIssueError(
            "Please select the issue date."
        );

        return;
    }


    const selectedUnit =
        availableUnits.find(
            unit =>
                String(unit.id) ===
                String(bloodUnitId)
        );


    if (selectedUnit) {

        if (
            isExpired(
                selectedUnit.expiryDate
            )
        ) {

            showIssueError(
                "This blood unit has expired and cannot be issued."
            );

            return;
        }


        if (
            isNearExpiry(
                selectedUnit.expiryDate
            )
        ) {

            showIssueError(
                "This blood unit is near expiry and cannot be issued."
            );

            return;
        }

    }


    const issueData = {

        bloodUnitId:
            Number(bloodUnitId),

        recipientName:
        recipientName,

        hospitalName:
        hospitalName,

        issueDate:
        issueDate

    };


    try {

        const response =
            await fetch(
                ISSUE_API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            issueData
                        )
                }
            );


        const result =
            await response
                .json()
                .catch(
                    () => null
                );


        if (!response.ok) {

            throw new Error(
                getApiErrorMessage(
                    result,
                    "Unable to issue blood."
                )
            );

        }


        closeIssueForm();


        await Promise.all([
            loadIssues(),
            loadAvailableUnits()
        ]);


    } catch (error) {

        console.error(
            "Save issue error:",
            error
        );

        showIssueError(
            error.message
        );
    }
}


// =========================
// DELETE ISSUE
// =========================

async function deleteIssue(id) {

    const confirmed =
        window.confirm(
            "Are you sure you want to delete this blood issue record?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${ISSUE_API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response
                .json()
                .catch(
                    () => null
                );


        if (!response.ok) {

            throw new Error(
                getApiErrorMessage(
                    result,
                    "Unable to delete issue record."
                )
            );

        }


        await Promise.all([
            loadIssues(),
            loadAvailableUnits()
        ]);


    } catch (error) {

        console.error(
            "Delete issue error:",
            error
        );

        showIssueError(
            error.message
        );
    }
}


// =========================
// TODAY'S DATE
// =========================

function setTodayIssueDate() {

    const dateInput =
        document.getElementById(
            "issueDate"
        );


    if (!dateInput) {
        return;
    }


    const today =
        new Date();


    dateInput.value =
        formatDateForInput(
            today
        );
}


// =========================
// DATE FOR INPUT
// =========================

function formatDateForInput(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;
}


// =========================
// EXPIRY CHECK
// =========================

function isExpired(expiryDate) {

    if (!expiryDate) {
        return false;
    }


    const expiry =
        new Date(
            `${expiryDate}T00:00:00`
        );


    return expiry < startOfToday();
}


// =========================
// NEAR EXPIRY CHECK
// =========================

function isNearExpiry(expiryDate) {

    if (!expiryDate) {
        return false;
    }


    const expiry =
        new Date(
            `${expiryDate}T00:00:00`
        );


    const today =
        startOfToday();


    const difference =
        Math.ceil(
            (
                expiry.getTime() -
                today.getTime()
            ) /
            (1000 * 60 * 60 * 24)
        );


    return (
        difference >= 0 &&
        difference <= 3
    );
}


// =========================
// START OF TODAY
// =========================

function startOfToday() {

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    return today;
}


// =========================
// BLOOD GROUP FORMAT
// =========================

function formatBloodGroup(value) {

    const groups = {

        A_POSITIVE: "A+",
        A_NEGATIVE: "A-",

        B_POSITIVE: "B+",
        B_NEGATIVE: "B-",

        AB_POSITIVE: "AB+",
        AB_NEGATIVE: "AB-",

        O_POSITIVE: "O+",
        O_NEGATIVE: "O-"

    };


    return groups[value] ||
        value ||
        "-";
}


// =========================
// STATUS BADGE
// =========================

function createStatusBadge(status) {

    const value =
        status || "ISSUED";


    let className =
        "status-issued";


    switch (value) {

        case "REQUESTED":
            className =
                "status-requested";
            break;

        case "APPROVED":
            className =
                "status-approved";
            break;

        case "ISSUED":
            className =
                "status-issued";
            break;

        case "REJECTED":
            className =
                "status-rejected";
            break;

        default:
            className =
                "status-issued";
    }


    return `
        <span class="status-badge ${className}">
            ${formatStatus(value)}
        </span>
    `;
}


// =========================
// STATUS FORMAT
// =========================

function formatStatus(value) {

    if (!value) {
        return "-";
    }


    return value
        .toString()
        .replaceAll(
            "_",
            " "
        )
        .toLowerCase()
        .replace(
            /\b\w/g,
            function (char) {
                return char.toUpperCase();
            }
        );
}


// =========================
// DATE FORMAT
// =========================

function formatDate(value) {

    if (!value) {
        return "-";
    }


    const parts =
        String(value).split("-");


    if (parts.length !== 3) {
        return value;
    }


    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}


// =========================
// API ERROR MESSAGE
// =========================

function getApiErrorMessage(
    data,
    fallback
) {

    if (!data) {
        return fallback;
    }


    if (data.message) {
        return data.message;
    }


    if (data.error) {
        return data.error;
    }


    if (data.errors) {

        if (
            typeof data.errors ===
            "string"
        ) {

            return data.errors;
        }


        return Object.values(
            data.errors
        ).join(", ");
    }


    return fallback;
}


// =========================
// ERROR DISPLAY
// =========================

function showIssueError(message) {

    const errorBox =
        document.getElementById(
            "issueFormError"
        );


    if (!errorBox) {
        return;
    }


    errorBox.textContent =
        message ||
        "Something went wrong.";


    errorBox.style.display =
        "block";
}


function hideIssueError() {

    const errorBox =
        document.getElementById(
            "issueFormError"
        );


    if (errorBox) {

        errorBox.textContent = "";

        errorBox.style.display =
            "none";
    }
}


// =========================
// WARNING DISPLAY
// =========================

function showIssueWarning(message) {

    const warningBox =
        document.getElementById(
            "issueWarning"
        );


    if (!warningBox) {
        return;
    }


    warningBox.textContent =
        message || "";


    warningBox.style.display =
        "block";
}


function hideIssueWarning() {

    const warningBox =
        document.getElementById(
            "issueWarning"
        );


    if (warningBox) {

        warningBox.textContent = "";

        warningBox.style.display =
            "none";
    }
}


// =========================
// HTML SAFETY
// =========================

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


// =========================
// MODAL OUTSIDE CLICK
// =========================

window.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "issueModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeIssueForm();

        }

    }
);