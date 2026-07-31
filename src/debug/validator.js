export function validateResponse(response) {
    if (!response) {
        throw new Error("Empty response received.");
    }

    if (typeof response !== "object") {
        throw new Error("Invalid response format.");
    }

    if (!response.answer) {
        throw new Error("Answer field is missing.");
    }

    return true;
}