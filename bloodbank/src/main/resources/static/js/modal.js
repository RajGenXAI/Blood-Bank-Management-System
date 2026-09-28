// =========================================================
// BLOOD BANK - MODAL UTILITIES
// =========================================================

function openModal(modalId) {

    const modal =
        document.getElementById(modalId);

    if (!modal) {
        return;
    }

    modal.classList.add("active");

    document.body.classList.add(
        "modal-open"
    );
}


function closeModal(modalId) {

    const modal =
        document.getElementById(modalId);

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    document.body.classList.remove(
        "modal-open"
    );
}


function closeAllModals() {

    document.querySelectorAll(
        ".modal.active"
    ).forEach(function (modal) {

        modal.classList.remove(
            "active"
        );

    });

    document.body.classList.remove(
        "modal-open"
    );
}


// ---------------------------------------------------------
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ---------------------------------------------------------

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "modal"
            )
        ) {
            event.target.classList.remove(
                "active"
            );

            document.body.classList.remove(
                "modal-open"
            );
        }

    }
);


// ---------------------------------------------------------
// ESCAPE KEY
// ---------------------------------------------------------

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }

        closeAllModals();

    }
);