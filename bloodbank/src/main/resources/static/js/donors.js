// =========================================================
// BLOOD BANK - DONORS
// =========================================================

const DONOR_API_URL = "/api/donors";

let donors = [];


// =========================
// PAGE LOAD
// =========================

document.addEventListener("DOMContentLoaded", function () {

    loadDonors();

    const form = document.getElementById("donorForm");

    if (form) {
        form.addEventListener("submit", saveDonor);
    }

});


// =========================
// LOAD DONORS
// =========================

async function loadDonors() {

    try {

        const response = await fetch(DONOR_API_URL);

        if (!response.ok) {
            throw new Error("Unable to load donors.");
        }

        donors = await response.json();

        renderDonors(donors);

    } catch (error) {

        console.error("Donor loading error:", error);

        showDonorError(
            "Unable to load donor records. Please try again."
        );
    }
}


// =========================
// RENDER DONORS
// =========================

function renderDonors(list) {

    const tableBody =
        document.getElementById("donorTableBody");

    const emptyRow =
        document.getElementById("emptyDonorRow");

    const count =
        document.getElementById("donorCount");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    if (count) {
        count.textContent =
            `${list.length} donor${list.length === 1 ? "" : "s"}`;
    }

    if (list.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="empty-state">
                        <img
                            src="images/empty-donors.png"
                            alt="No Donors"
                        >

                        <h3>No donor records</h3>

                        <p>
                            Add a donor to start managing
                            donor information.
                        </p>
                    </div>
                </td>
            </tr>
        `;

        return;
    }


    list.forEach(function (donor) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${donor.id ?? "-"}</td>

            <td>
                <strong>
                    ${escapeHtml(donor.name ?? "-")}
                </strong>
            </td>

            <td>
                ${escapeHtml(donor.email ?? "-")}
            </td>

            <td>
                ${escapeHtml(donor.phone ?? "-")}
            </td>

            <td>
                ${formatBloodGroup(donor.bloodGroup)}
            </td>

            <td>
                ${formatDate(donor.lastDonationDate)}
            </td>

            <td>
                ${createStatusBadge(donor.status)}
            </td>

            <td>
                <button
                    type="button"
                    class="table-action"
                    onclick="editDonor(${donor.id})"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="table-action delete"
                    onclick="deleteDonor(${donor.id})"
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

function filterDonors() {

    const searchInput =
        document.getElementById("donorSearch");

    const bloodGroupFilter =
        document.getElementById("bloodGroupFilter");

    const search =
        (searchInput?.value || "")
            .trim()
            .toLowerCase();

    const bloodGroup =
        bloodGroupFilter?.value || "";


    const filtered = donors.filter(function (donor) {

        const matchesSearch =
            !search ||
            String(donor.name || "")
                .toLowerCase()
                .includes(search) ||
            String(donor.email || "")
                .toLowerCase()
                .includes(search) ||
            String(donor.phone || "")
                .toLowerCase()
                .includes(search);


        const matchesBloodGroup =
            !bloodGroup ||
            donor.bloodGroup === bloodGroup;


        return matchesSearch && matchesBloodGroup;

    });


    renderDonors(filtered);
}


// =========================
// OPEN ADD DONOR FORM
// =========================

function openDonorForm() {

    const modal =
        document.getElementById("donorModal");

    const form =
        document.getElementById("donorForm");

    const title =
        document.getElementById("donorModalTitle");

    if (form) {
        form.reset();
    }

    const donorId =
        document.getElementById("donorId");

    if (donorId) {
        donorId.value = "";
    }

    if (title) {
        title.textContent = "Add Donor";
    }

    hideDonorError();

    if (modal) {
        modal.style.display = "flex";
    }
}


// =========================
// CLOSE FORM
// =========================

function closeDonorForm() {

    const modal =
        document.getElementById("donorModal");

    if (modal) {
        modal.style.display = "none";
    }

    hideDonorError();
}


// =========================
// EDIT DONOR
// =========================

function editDonor(id) {

    const donor =
        donors.find(function (item) {
            return item.id === id;
        });

    if (!donor) {
        return;
    }


    document.getElementById("donorId").value =
        donor.id ?? "";

    document.getElementById("donorName").value =
        donor.name ?? "";

    document.getElementById("donorEmail").value =
        donor.email ?? "";

    document.getElementById("donorPhone").value =
        donor.phone ?? "";

    document.getElementById("donorBloodGroup").value =
        donor.bloodGroup ?? "";

    document.getElementById("dateOfBirth").value =
        donor.dateOfBirth ?? "";

    document.getElementById("lastDonationDate").value =
        donor.lastDonationDate ?? "";


    const title =
        document.getElementById("donorModalTitle");

    if (title) {
        title.textContent = "Edit Donor";
    }

    hideDonorError();

    document.getElementById("donorModal").style.display =
        "flex";
}


// =========================
// SAVE DONOR
// =========================

async function saveDonor(event) {

    event.preventDefault();

    hideDonorError();


    const donorId =
        document.getElementById("donorId").value;


    const donorData = {

        name:
            document.getElementById("donorName").value.trim(),

        email:
            document.getElementById("donorEmail").value.trim(),

        phone:
            document.getElementById("donorPhone").value.trim(),

        bloodGroup:
        document.getElementById("donorBloodGroup").value,

        dateOfBirth:
            document.getElementById("dateOfBirth").value || null,

        lastDonationDate:
            document.getElementById("lastDonationDate").value || null

    };


    const isEdit = donorId !== "";

    const url = isEdit
        ? `${DONOR_API_URL}/${donorId}`
        : DONOR_API_URL;

    const method = isEdit
        ? "PUT"
        : "POST";


    try {

        const response = await fetch(url, {

            method: method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(donorData)

        });


        const result =
            await response.json().catch(() => null);


        if (!response.ok) {

            throw new Error(
                getApiErrorMessage(
                    result,
                    "Unable to save donor."
                )
            );
        }


        closeDonorForm();

        await loadDonors();


    } catch (error) {

        console.error("Save donor error:", error);

        showDonorError(error.message);
    }
}


// =========================
// DELETE DONOR
// =========================

async function deleteDonor(id) {

    const donor =
        donors.find(function (item) {
            return item.id === id;
        });


    const donorName =
        donor?.name || "this donor";


    const confirmed =
        window.confirm(
            `Are you sure you want to delete ${donorName}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${DONOR_API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json().catch(() => null);


        if (!response.ok) {

            throw new Error(
                getApiErrorMessage(
                    result,
                    "Unable to delete donor."
                )
            );
        }


        await loadDonors();


    } catch (error) {

        console.error("Delete donor error:", error);

        showDonorError(error.message);
    }
}


// =========================
// STATUS BADGE
// =========================

function createStatusBadge(status) {

    const value =
        status || "NOT_ELIGIBLE";


    const label =
        formatStatus(value);


    const className =
        value === "ELIGIBLE"
            ? "status-eligible"
            : "status-not-eligible";


    return `
        <span class="status-badge ${className}">
            ${label}
        </span>
    `;
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

    return groups[value] || value || "-";
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
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, function (char) {
            return char.toUpperCase();
        });
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

        if (typeof data.errors === "string") {
            return data.errors;
        }

        return Object.values(data.errors).join(", ");
    }

    return fallback;
}


// =========================
// ERROR DISPLAY
// =========================

function showDonorError(message) {

    const errorBox =
        document.getElementById("donorFormError");

    if (!errorBox) {
        return;
    }

    errorBox.textContent =
        message || "Something went wrong.";

    errorBox.style.display = "block";
}


function hideDonorError() {

    const errorBox =
        document.getElementById("donorFormError");

    if (errorBox) {
        errorBox.textContent = "";
        errorBox.style.display = "none";
    }
}


// =========================
// HTML SAFETY
// =========================

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// =========================
// MODAL OUTSIDE CLICK
// =========================

window.addEventListener("click", function (event) {

    const modal =
        document.getElementById("donorModal");

    if (
        modal &&
        event.target === modal
    ) {
        closeDonorForm();
    }

});