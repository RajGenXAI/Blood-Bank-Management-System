// =========================================================
// BLOOD BANK - LOADING UTILITIES
// =========================================================

function showLoading(message = "Loading...") {

    let loader =
        document.getElementById("pageLoader");

    if (!loader) {

        loader =
            document.createElement("div");

        loader.id =
            "pageLoader";

        loader.className =
            "page-loader";

        loader.innerHTML = `
            <div class="loading-spinner"></div>
            <p class="loading-message"></p>
        `;

        document.body.appendChild(loader);
    }

    const messageElement =
        loader.querySelector(".loading-message");

    if (messageElement) {
        messageElement.textContent =
            message;
    }

    loader.classList.add("active");
}


function hideLoading() {

    const loader =
        document.getElementById("pageLoader");

    if (!loader) {
        return;
    }

    loader.classList.remove("active");
}


function setButtonLoading(
    button,
    loading,
    loadingText = "Saving..."
) {

    if (!button) {
        return;
    }

    if (loading) {

        if (!button.dataset.originalText) {
            button.dataset.originalText =
                button.textContent;
        }

        button.disabled = true;

        button.textContent =
            loadingText;

    } else {

        button.disabled = false;

        if (button.dataset.originalText) {

            button.textContent =
                button.dataset.originalText;

            delete button.dataset.originalText;
        }
    }
}