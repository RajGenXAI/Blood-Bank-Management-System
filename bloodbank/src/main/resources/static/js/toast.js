// =========================================================
// BLOOD BANK - TOAST NOTIFICATION
// =========================================================

function showToast(message, type = "success", duration = 3000) {

    let toastContainer =
        document.getElementById("toastContainer");

    if (!toastContainer) {

        toastContainer =
            document.createElement("div");

        toastContainer.id =
            "toastContainer";

        toastContainer.className =
            "toast-container";

        document.body.appendChild(
            toastContainer
        );
    }


    const toast =
        document.createElement("div");

    toast.className =
        `toast toast-${type}`;


    const messageElement =
        document.createElement("span");

    messageElement.className =
        "toast-message";

    messageElement.textContent =
        message;


    const closeButton =
        document.createElement("button");

    closeButton.className =
        "toast-close";

    closeButton.type =
        "button";

    closeButton.innerHTML =
        "&times;";


    closeButton.addEventListener(
        "click",
        function () {
            removeToast(toast);
        }
    );


    toast.appendChild(
        messageElement
    );

    toast.appendChild(
        closeButton
    );

    toastContainer.appendChild(
        toast
    );


    // Small animation delay

    setTimeout(function () {
        toast.classList.add("show");
    }, 10);


    // Automatically remove

    setTimeout(function () {
        removeToast(toast);
    }, duration);
}


function removeToast(toast) {

    if (!toast) {
        return;
    }

    toast.classList.remove("show");

    setTimeout(function () {

        if (toast.parentNode) {
            toast.parentNode.removeChild(
                toast
            );
        }

    }, 300);
}


// Convenient functions

function showSuccess(message) {
    showToast(
        message,
        "success"
    );
}


function showError(message) {
    showToast(
        message,
        "error"
    );
}


function showWarning(message) {
    showToast(
        message,
        "warning"
    );
}


function showInfo(message) {
    showToast(
        message,
        "info"
    );
}