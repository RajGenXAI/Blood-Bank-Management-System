// =========================================================
// BLOOD BANK - DOM UTILITIES
// =========================================================

function getElement(id) {
    return document.getElementById(id);
}


function setText(id, value) {

    const element =
        getElement(id);

    if (element) {
        element.textContent =
            value ?? "";
    }
}


function setValue(id, value) {

    const element =
        getElement(id);

    if (element) {
        element.value =
            value ?? "";
    }
}


function getValueById(id) {

    const element =
        getElement(id);

    return element
        ? element.value
        : "";
}


function showElement(id) {

    const element =
        getElement(id);

    if (element) {
        element.style.display = "";
    }
}


function hideElement(id) {

    const element =
        getElement(id);

    if (element) {
        element.style.display = "none";
    }
}


function toggleElement(
    id,
    show
) {

    if (show) {
        showElement(id);
    } else {
        hideElement(id);
    }
}


function clearElement(id) {

    const element =
        getElement(id);

    if (element) {
        element.innerHTML = "";
    }
}


function disableElement(id) {

    const element =
        getElement(id);

    if (element) {
        element.disabled = true;
    }
}


function enableElement(id) {

    const element =
        getElement(id);

    if (element) {
        element.disabled = false;
    }
}