// =========================================================
// BLOOD BANK - DONATIONS
// =========================================================

const DONATION_API_URL = "/api/donations";
const DONOR_API_URL = "/api/donors";

let donations = [];
let donorList = [];


// =========================
// PAGE LOAD
// =========================

document.addEventListener("DOMContentLoaded", function () {

    loadDonorsForDonation();

    loadDonations();

    const form =
        document.getElementById("donationForm");

    if (form) {
        form.addEventListener(
            "submit",
            saveDonation
        );
    }

    setTodayDate();

});


// =========================
// LOAD DONORS
// =========================

async function loadDonorsForDonation() {

    try {

        const response =
            await fetch(DONOR_API_URL);

        if (!response.ok) {
            throw new Error(
                "Unable to load donors."
            );
        }

        donorList =
            await response.json();

        populateDonorDropdown();

    } catch (error) {

        console.error(
            "Donor loading error:",
            error
        );

        showDonationError(
            "Unable to load donor list."
        );
    }
}


// =========================
// POPULATE DONOR DROPDOWN
// =========================

function populateDonorDropdown() {

    const select =
        document.getElementById("donorId");

    if (!select) {
        return;
    }

    select.innerHTML = `
        <option value="">
            Select donor
        </option>
    `;


    donorList.forEach(function (donor) {

        const option =
            document.createElement("option");

        option.value =
            donor.id;

        option.textContent =
            `${donor.name} - ${formatBloodGroup(donor.bloodGroup)}`;

        select.appendChild(option);

    });
}


// =========================
// LOAD DONATIONS
// =========================

async function loadDonations() {

    try {

        const response =
            await fetch(DONATION_API_URL);

        if (!response.ok) {
            throw new Error(
                "Unable to load donations."
            );
        }

        donations =
            await response.json();

        renderDonations(donations);

    } catch (error) {

        console.error(
            "Donation loading error:",
            error
        );

        showDonationError(
            "Unable to load donation records."
        );
    }
}


// =========================
// RENDER DONATIONS
// =========================

function renderDonations(list) {

    const tableBody =
        document.getElementById(
            "donationTableBody"
        );

    const count =
        document.getElementById(
            "donationCount"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (count) {

        count.textContent =
            `${list.length} donation${list.length === 1 ? "" : "s"}`;

    }


    if (list.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">

                    <div class="empty-state">

                        <img
                            src="images/empty-donations.png"
                            alt="No Donations"
                        >

                        <h3>No donation records</h3>

                        <p>
                            Record a donation to start
                            building donation history.
                        </p>

                    </div>

                </td>
            </tr>
        `;

        return;
    }


    list.forEach(function (donation) {

        const donor =
            findDonor(donation.donor);


        const donorName =
            donor?.name ||
            donation.donor?.name ||
            "Unknown Donor";


        const bloodGroup =
            donor?.bloodGroup ||
            donation.donor?.bloodGroup ||
            null;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${donation.id ?? "-"}
            </td>

            <td>
                <strong>
                    ${escapeHtml(donorName)}
                </strong>
            </td>

            <td>
                ${formatBloodGroup(bloodGroup)}
            </td>

            <td>
                ${formatDate(donation.donationDate)}
            </td>

            <td>
                ${donation.unitsCollected ?? "-"}
            </td>

            <td>
                ${createStatusBadge(
            donation.status
        )}
            </td>

            <td>

                <button
                    type="button"
                    class="table-action delete"
                    onclick="deleteDonation(${donation.id})"
                >
                    Delete
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });
}


// =========================
// FIND DONOR
// =========================

function findDonor(donorData) {

    if (!donorData) {
        return null;
    }


    if (typeof donorData === "object") {

        return donorData;
    }


    return donorList.find(
        function (donor) {
            return donor.id === donorData;
        }
    );
}


// =========================
// SEARCH DONATIONS
// =========================

function filterDonations() {

    const searchInput =
        document.getElementById(
            "donationSearch"
        );


    const search =
        (searchInput?.value || "")
            .trim()
            .toLowerCase();


    if (!search) {

        renderDonations(donations);

        return;
    }


    const filtered =
        donations.filter(
            function (donation) {

                const donor =
                    findDonor(
                        donation.donor
                    );


                const donorName =
                    donor?.name ||
                    donation.donor?.name ||
                    "";


                const donorEmail =
                    donor?.email ||
                    donation.donor?.email ||
                    "";


                const bloodGroup =
                    formatBloodGroup(
                        donor?.bloodGroup ||
                        donation.donor?.bloodGroup
                    );


                return (

                    donorName
                        .toLowerCase()
                        .includes(search)

                    ||

                    donorEmail
                        .toLowerCase()
                        .includes(search)

                    ||

                    bloodGroup
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        donation.id || ""
                    )
                        .toLowerCase()
                        .includes(search)

                );

            }
        );


    renderDonations(filtered);
}


// =========================
// OPEN DONATION FORM
// =========================

function openDonationForm() {

    const modal =
        document.getElementById(
            "donationModal"
        );


    const form =
        document.getElementById(
            "donationForm"
        );


    if (form) {
        form.reset();
    }


    hideDonationError();

    setTodayDate();


    const message =
        document.getElementById(
            "eligibilityMessage"
        );


    if (message) {

        message.style.display =
            "none";

        message.textContent = "";

    }


    if (modal) {
        modal.style.display = "flex";
    }
}


// =========================
// CLOSE DONATION FORM
// =========================

function closeDonationForm() {

    const modal =
        document.getElementById(
            "donationModal"
        );


    if (modal) {
        modal.style.display = "none";
    }


    hideDonationError();

}


// =========================
// SAVE DONATION
// =========================

async function saveDonation(event) {

    event.preventDefault();

    hideDonationError();


    const donorId =
        document.getElementById(
            "donorId"
        ).value;


    const donationDate =
        document.getElementById(
            "donationDate"
        ).value;


    const unitsCollected =
        document.getElementById(
            "unitsCollected"
        ).value;


    if (!donorId) {

        showDonationError(
            "Please select a donor."
        );

        return;
    }


    if (!donationDate) {

        showDonationError(
            "Please select the donation date."
        );

        return;
    }


    if (
        !unitsCollected ||
        Number(unitsCollected) <= 0
    ) {

        showDonationError(
            "Units collected must be greater than zero."
        );

        return;
    }


    const donationData = {

        donorId:
            Number(donorId),

        donationDate:
        donationDate,

        unitsCollected:
            Number(unitsCollected)

    };


    try {

        const response =
            await fetch(
                DONATION_API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            donationData
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
                    "Unable to record donation."
                )
            );

        }


        closeDonationForm();


        await Promise.all([
            loadDonorsForDonation(),
            loadDonations()
        ]);


    } catch (error) {

        console.error(
            "Save donation error:",
            error
        );

        showDonationError(
            error.message
        );
    }
}


// =========================
// DELETE DONATION
// =========================

async function deleteDonation(id) {

    const confirmed =
        window.confirm(
            "Are you sure you want to delete this donation record?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${DONATION_API_URL}/${id}`,
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
                    "Unable to delete donation."
                )
            );

        }


        await loadDonations();


    } catch (error) {

        console.error(
            "Delete donation error:",
            error
        );

        showDonationError(
            error.message
        );
    }
}


// =========================
// TODAY'S DATE
// =========================

function setTodayDate() {

    const dateInput =
        document.getElementById(
            "donationDate"
        );


    if (!dateInput) {
        return;
    }


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


    dateInput.value =
        `${year}-${month}-${day}`;
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
        status || "COMPLETED";


    const label =
        formatStatus(value);


    let className =
        "status-completed";


    if (
        value === "REJECTED" ||
        value === "NOT_ELIGIBLE"
    ) {

        className =
            "status-rejected";

    }


    return `
        <span class="status-badge ${className}">
            ${label}
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
        .replaceAll("_", " ")
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

function showDonationError(message) {

    const errorBox =
        document.getElementById(
            "donationFormError"
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


function hideDonationError() {

    const errorBox =
        document.getElementById(
            "donationFormError"
        );


    if (errorBox) {

        errorBox.textContent = "";

        errorBox.style.display =
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
                "donationModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeDonationForm();

        }

    }
);