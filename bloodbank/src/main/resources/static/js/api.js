// =========================================================
// BLOOD BANK - API UTILITIES
// =========================================================

async function apiRequest(
    endpoint,
    options = {}
) {

    const controller =
        new AbortController();

    const timeout =
        setTimeout(function () {
            controller.abort();
        }, 10000);

    try {

        const response =
            await fetch(
                getApiUrl(endpoint),
                {
                    ...options,
                    signal: controller.signal,
                    headers: {
                        "Content-Type": "application/json",
                        ...(options.headers || {})
                    }
                }
            );

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(
                await getApiErrorMessage(response)
            );
        }

        if (response.status === 204) {
            return null;
        }

        return await response.json();

    } catch (error) {

        clearTimeout(timeout);

        if (error.name === "AbortError") {
            throw new Error(
                "Request timed out. Please try again."
            );
        }

        throw error;
    }
}


async function apiGet(endpoint) {
    return apiRequest(endpoint, {
        method: "GET"
    });
}


async function apiPost(endpoint, data) {
    return apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(data)
    });
}


async function apiPut(endpoint, data) {
    return apiRequest(endpoint, {
        method: "PUT",
        body: JSON.stringify(data)
    });
}


async function apiDelete(endpoint) {
    return apiRequest(endpoint, {
        method: "DELETE"
    });
}