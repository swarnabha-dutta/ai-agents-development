export function validateResponse(response) {
    if (!response) {
        throw new Error("Empty response received.");
    }

    if (typeof response !== "string") {
        throw new Error("Invalid response type.");
    }

    if (response.trim().length < 5) {
        throw new Error("Response is too short.");
    }

    return true;
}