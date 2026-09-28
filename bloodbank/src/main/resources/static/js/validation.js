// =========================================================
// BLOOD BANK - FORM VALIDATION UTILITIES
// =========================================================

function isRequired(value) {
    return value !== null &&
        value !== undefined &&
        String(value).trim() !== "";
}


function isValidEmail(email) {

    if (!isRequired(email)) {
        return false;
    }

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(
        String(email).trim()
    );
}


function isValidPhone(phone) {

    if (!isRequired(phone)) {
        return false;
    }

    const phonePattern =
        /^[0-9]{10}$/;

    return phonePattern.test(
        String(phone).trim()
    );
}


function isPositiveNumber(value) {

    const number =
        Number(value);

    return Number.isFinite(number) &&
        number > 0;
}


function isValidDate(dateValue) {

    if (!isRequired(dateValue)) {
        return false;
    }

    const date =
        new Date(dateValue);

    return !Number.isNaN(
        date.getTime()
    );
}


function isDateAfter(
    firstDate,
    secondDate
) {

    if (!isValidDate(firstDate) ||
        !isValidDate(secondDate)) {
        return false;
    }

    return new Date(firstDate) >
        new Date(secondDate);
}


function isDateBefore(
    firstDate,
    secondDate
) {

    if (!isValidDate(firstDate) ||
        !isValidDate(secondDate)) {
        return false;
    }

    return new Date(firstDate) <
        new Date(secondDate);
}


function showFieldError(
    elementId,
    message
) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) {
        return;
    }

    element.classList.add(
        "input-error"
    );

    let errorElement =
        document.getElementById(
            `${elementId}Error`
        );

    if (!errorElement) {

        errorElement =
            document.createElement("small");

        errorElement.id =
            `${elementId}Error`;

        errorElement.className =
            "field-error";

        element.parentElement
            ?.appendChild(errorElement);
    }

    errorElement.textContent =
        message;
}


function clearFieldError(
    elementId
) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) {
        return;
    }

    element.classList.remove(
        "input-error"
    );

    const errorElement =
        document.getElementById(
            `${elementId}Error`
        );

    if (errorElement) {
        errorElement.remove();
    }
}


function clearFormErrors(
    formId
) {

    const form =
        document.getElementById(
            formId
        );

    if (!form) {
        return;
    }

    form.querySelectorAll(
        ".input-error"
    ).forEach(function (element) {

        element.classList.remove(
            "input-error"
        );

    });

    form.querySelectorAll(
        ".field-error"
    ).forEach(function (element) {

        element.remove();

    });
}