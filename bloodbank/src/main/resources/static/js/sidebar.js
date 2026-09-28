// =========================================================
// BLOOD BANK - SIDEBAR UTILITIES
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    setActiveSidebarLink();

    setupSidebarToggle();

});


// ---------------------------------------------------------
// ACTIVE SIDEBAR LINK
// ---------------------------------------------------------

function setActiveSidebarLink() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();

    const links =
        document.querySelectorAll(
            ".sidebar-nav a"
        );

    links.forEach(function (link) {

        const href =
            link.getAttribute("href");

        if (href === currentPage) {

            link.classList.add(
                "active"
            );

        } else {

            link.classList.remove(
                "active"
            );

        }

    });
}


// ---------------------------------------------------------
// MOBILE SIDEBAR TOGGLE
// ---------------------------------------------------------

function setupSidebarToggle() {

    const sidebar =
        document.querySelector(".sidebar");

    const toggleButton =
        document.getElementById(
            "sidebarToggle"
        );

    if (!sidebar || !toggleButton) {
        return;
    }

    toggleButton.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}