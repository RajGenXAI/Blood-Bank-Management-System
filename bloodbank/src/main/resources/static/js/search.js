// =========================================================
// BLOOD BANK - SEARCH UTILITIES
// =========================================================

function setupSearch(
    inputId,
    rowsSelector,
    emptyElementId = null
) {

    const searchInput =
        document.getElementById(inputId);

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener(
        "input",
        function () {

            const searchTerm =
                searchInput.value
                    .trim()
                    .toLowerCase();

            const rows =
                document.querySelectorAll(
                    rowsSelector
                );

            let visibleRows = 0;

            rows.forEach(function (row) {

                const rowText =
                    row.textContent
                        .toLowerCase();

                const matches =
                    rowText.includes(
                        searchTerm
                    );

                row.style.display =
                    matches ? "" : "none";

                if (matches) {
                    visibleRows++;
                }
            });

            updateSearchEmptyState(
                emptyElementId,
                visibleRows,
                searchTerm
            );
        }
    );
}


// ---------------------------------------------------------
// SEARCH EMPTY STATE
// ---------------------------------------------------------

function updateSearchEmptyState(
    emptyElementId,
    visibleRows,
    searchTerm
) {

    if (!emptyElementId) {
        return;
    }

    const emptyElement =
        document.getElementById(
            emptyElementId
        );

    if (!emptyElement) {
        return;
    }

    if (
        searchTerm &&
        visibleRows === 0
    ) {

        emptyElement.style.display =
            "block";

    } else {

        emptyElement.style.display =
            "none";
    }
}


// ---------------------------------------------------------
// FILTER TABLE ROWS
// ---------------------------------------------------------

function filterTableRows(
    rows,
    searchTerm
) {

    if (!rows) {
        return 0;
    }

    let visibleCount = 0;

    rows.forEach(function (row) {

        const text =
            row.textContent
                .toLowerCase();

        const visible =
            text.includes(
                searchTerm.toLowerCase()
            );

        row.style.display =
            visible ? "" : "none";

        if (visible) {
            visibleCount++;
        }
    });

    return visibleCount;
}