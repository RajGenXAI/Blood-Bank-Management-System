// =========================================================
// BLOOD BANK - INVENTORY
// =========================================================

const INVENTORY_API_URL = "/api/blood-units";

let inventoryUnits = [];


// =========================
// PAGE LOAD
// =========================

document.addEventListener("DOMContentLoaded", function () {

    loadInventory();

    const form =
        document.getElementById("bloodUnitForm");

    if (form) {
        form.addEventListener(
            "submit",
            saveBloodUnit
        );
    }

    setDefaultInventoryDates();

});


// =========================
// LOAD INVENTORY
// =========================

async function loadInventory() {

    try {

        const response =
            await fetch(INVENTORY_API_URL);

        if (!response.ok) {
            throw new Error(
                "Unable to load blood inventory."
            );
        }

        inventoryUnits =
            await response.json();

        updateInventorySummary(
            inventoryUnits
        );

        renderInventory(
            inventoryUnits
        );

    } catch (error) {

        console.error(
            "Inventory loading error:",
            error
        );

        showInventoryError(
            "Unable to load blood inventory."
        );
    }
}


// =========================
// UPDATE SUMMARY
// =========================

function updateInventorySummary(list) {

    const total =
        list.length;

    const available =
        list.filter(
            unit => unit.status === "AVAILABLE"
        ).length;

    const expired =
        list.filter(
            unit => unit.status === "EXPIRED"
        ).length;

    const nearExpiry =
        list.filter(
            unit =>
                unit.status === "AVAILABLE" &&
                isNearExpiry(unit.expiryDate)
        ).length;


    setValue(
        "totalInventoryUnits",
        total
    );

    setValue(
        "availableInventoryUnits",
        available
    );

    setValue(
        "nearExpiryUnits",
        nearExpiry
    );

    setValue(
        "expiredInventoryUnits",
        expired
    );
}


// =========================
// RENDER INVENTORY
// =========================

function renderInventory(list) {

    const tableBody =
        document.getElementById(
            "inventoryTableBody"
        );

    const count =
        document.getElementById(
            "inventoryCount"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (count) {

        count.textContent =
            `${list.length} unit${list.length === 1 ? "" : "s"}`;

    }


    if (list.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">

                    <div class="empty-state">

                        <img
                            src="images/empty-inventory.png"
                            alt="No Blood Units"
                        >

                        <h3>No blood units found</h3>

                        <p>
                            Add a blood unit to start
                            managing the inventory.
                        </p>

                    </div>

                </td>
            </tr>
        `;

        return;
    }


    list.forEach(function (unit) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${unit.id ?? "-"}
            </td>

            <td>
                <strong>
                    ${escapeHtml(
            unit.unitCode ?? "-"
        )}
                </strong>
            </td>

            <td>
                ${formatBloodGroup(
            unit.bloodGroup
        )}
            </td>

            <td>
                ${formatDate(
            unit.collectionDate
        )}
            </td>

            <td>
                ${formatDate(
            unit.expiryDate
        )}
            </td>

            <td>
                ${createStatusBadge(
            unit.status,
            unit.expiryDate
        )}
            </td>

            <td>

                <button
                    type="button"
                    class="table-action"
                    onclick="editBloodUnit(${unit.id})"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="table-action delete"
                    onclick="deleteBloodUnit(${unit.id})"
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

function filterInventory() {

    const searchInput =
        document.getElementById(
            "inventorySearch"
        );

    const bloodGroupFilter =
        document.getElementById(
            "inventoryBloodGroupFilter"
        );

    const statusFilter =
        document.getElementById(
            "inventoryStatusFilter"
        );


    const search =
        (searchInput?.value || "")
            .trim()
            .toLowerCase();


    const bloodGroup =
        bloodGroupFilter?.value || "";


    const status =
        statusFilter?.value || "";


    const filtered =
        inventoryUnits.filter(
            function (unit) {

                const matchesSearch =
                    !search ||
                    String(
                        unit.unitCode || ""
                    )
                        .toLowerCase()
                        .includes(search);


                const matchesBloodGroup =
                    !bloodGroup ||
                    unit.bloodGroup === bloodGroup;


                const matchesStatus =
                    !status ||
                    unit.status === status;


                return (
                    matchesSearch &&
                    matchesBloodGroup &&
                    matchesStatus
                );

            }
        );


    renderInventory(filtered);
}


// =========================
// OPEN ADD FORM
// =========================

function openBloodUnitForm() {

    const modal =
        document.getElementById(
            "bloodUnitModal"
        );

    const form =
        document.getElementById(
            "bloodUnitForm"
        );

    const title =
        document.getElementById(
            "bloodUnitModalTitle"
        );


    if (form) {
        form.reset();
    }


    const id =
        document.getElementById(
            "bloodUnitId"
        );

    if (id) {
        id.value = "";
    }


    if (title) {
        title.textContent =
            "Add Blood Unit";
    }


    hideInventoryError();

    setDefaultInventoryDates();


    if (modal) {
        modal.style.display =
            "flex";
    }
}


// =========================
// CLOSE FORM
// =========================

function closeBloodUnitForm() {

    const modal =
        document.getElementById(
            "bloodUnitModal"
        );


    if (modal) {
        modal.style.display =
            "none";
    }


    hideInventoryError();
}


// =========================
// EDIT BLOOD UNIT
// =========================

function editBloodUnit(id) {

    const unit =
        inventoryUnits.find(
            item => item.id === id
        );


    if (!unit) {
        return;
    }


    document.getElementById(
        "bloodUnitId"
    ).value =
        unit.id ?? "";


    document.getElementById(
        "unitCode"
    ).value =
        unit.unitCode ?? "";


    document.getElementById(
        "bloodUnitGroup"
    ).value =
        unit.bloodGroup ?? "";


    document.getElementById(
        "collectionDate"
    ).value =
        unit.collectionDate ?? "";


    document.getElementById(
        "expiryDate"
    ).value =
        unit.expiryDate ?? "";


    document.getElementById(
        "bloodUnitStatus"
    ).value =
        unit.status === "EXPIRED"
            ? "AVAILABLE"
            : unit.status || "AVAILABLE";


    const title =
        document.getElementById(
            "bloodUnitModalTitle"
        );


    if (title) {
        title.textContent =
            "Edit Blood Unit";
    }


    hideInventoryError();


    document.getElementById(
        "bloodUnitModal"
    ).style.display =
        "flex";
}


// =========================
// SAVE BLOOD UNIT
// =========================

async function saveBloodUnit(event) {

    event.preventDefault();

    hideInventoryError();


    const id =
        document.getElementById(
            "bloodUnitId"
        ).value;


    const unitCode =
        document.getElementById(
            "unitCode"
        ).value.trim();


    const bloodGroup =
        document.getElementById(
            "bloodUnitGroup"
        ).value;


    const collectionDate =
        document.getElementById(
            "collectionDate"
        ).value;


    const expiryDate =
        document.getElementById(
            "expiryDate"
        ).value;


    const status =
        document.getElementById(
            "bloodUnitStatus"
        ).value;


    if (!unitCode) {

        showInventoryError(
            "Please enter the blood unit code."
        );

        return;
    }


    if (!bloodGroup) {

        showInventoryError(
            "Please select a blood group."
        );

        return;
    }


    if (!collectionDate) {

        showInventoryError(
            "Please select the collection date."
        );

        return;
    }


    if (!expiryDate) {

        showInventoryError(
            "Please select the expiry date."
        );

        return;
    }


    if (
        new Date(expiryDate) <
        new Date(collectionDate)
    ) {

        showInventoryError(
            "Expiry date cannot be before collection date."
        );

        return;
    }


    const bloodUnitData = {

        unitCode:
        unitCode,

        bloodGroup:
        bloodGroup,

        collectionDate:
        collectionDate,

        expiryDate:
        expiryDate,

        status:
        status

    };


    const isEdit =
        id !== "";


    const url =
        isEdit
            ? `${INVENTORY_API_URL}/${id}`
            : INVENTORY_API_URL;


    const method =
        isEdit
            ? "PUT"
            : "POST";


    try {

        const response =
            await fetch(
                url,
                {
                    method: method,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            bloodUnitData
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
                    "Unable to save blood unit."
                )
            );

        }


        closeBloodUnitForm();

        await loadInventory();


    } catch (error) {

        console.error(
            "Save blood unit error:",
            error
        );

        showInventoryError(
            error.message
        );
    }
}


// =========================
// DELETE BLOOD UNIT
// =========================

async function deleteBloodUnit(id) {

    const unit =
        inventoryUnits.find(
            item => item.id === id
        );


    const unitCode =
        unit?.unitCode ||
        "this blood unit";


    const confirmed =
        window.confirm(
            `Are you sure you want to delete ${unitCode}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${INVENTORY_API_URL}/${id}`,
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
                    "Unable to delete blood unit."
                )
            );

        }


        await loadInventory();


    } catch (error) {

        console.error(
            "Delete blood unit error:",
            error
        );

        showInventoryError(
            error.message
        );
    }
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
        new Date();


    today.setHours(
        0, 0, 0, 0
    );


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
// STATUS BADGE
// =========================

function createStatusBadge(
    status,
    expiryDate
) {

    let actualStatus =
        status || "AVAILABLE";


    if (
        expiryDate &&
        new Date(
            `${expiryDate}T00:00:00`
        ) <
        startOfToday()
    ) {

        actualStatus =
            "EXPIRED";
    }


    const label =
        formatStatus(
            actualStatus
        );


    let className =
        "status-available";


    switch (actualStatus) {

        case "EXPIRED":
            className =
                "status-expired";
            break;

        case "RESERVED":
            className =
                "status-reserved";
            break;

        case "ISSUED":
            className =
                "status-issued";
            break;

        case "AVAILABLE":

            if (
                isNearExpiry(
                    expiryDate
                )
            ) {

                className =
                    "status-reserved";
            }

            break;

        default:
            className =
                "status-available";
    }


    return `
        <span class="status-badge ${className}">
            ${label}
        </span>
    `;
}


// =========================
// START OF TODAY
// =========================

function startOfToday() {

    const today =
        new Date();

    today.setHours(
        0, 0, 0, 0
    );

    return today;
}


// =========================
// DEFAULT DATES
// =========================

function setDefaultInventoryDates() {

    const collectionInput =
        document.getElementById(
            "collectionDate"
        );

    const expiryInput =
        document.getElementById(
            "expiryDate"
        );


    if (!collectionInput) {
        return;
    }


    const today =
        new Date();


    const todayString =
        formatDateForInput(
            today
        );


    if (!collectionInput.value) {

        collectionInput.value =
            todayString;
    }


    if (
        expiryInput &&
        !expiryInput.value
    ) {

        const expiry =
            new Date(today);

        expiry.setDate(
            expiry.getDate() + 42
        );


        expiryInput.value =
            formatDateForInput(
                expiry
            );
    }
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

function showInventoryError(message) {

    const errorBox =
        document.getElementById(
            "bloodUnitFormError"
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


function hideInventoryError() {

    const errorBox =
        document.getElementById(
            "bloodUnitFormError"
        );


    if (errorBox) {

        errorBox.textContent = "";

        errorBox.style.display =
            "none";
    }
}


// =========================
// SET VALUE
// =========================

function setValue(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {
        element.textContent =
            value;
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
                "bloodUnitModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeBloodUnitForm();

        }

    }
);