export function validateInput(query) {
    if (!query) {
        throw new Error("Query is required.");
    }

    if (typeof query !== "string") {
        throw new Error("Query must be a string.");
    }

    if (query.trim().length === 0) {
        throw new Error("Query cannot be empty.");
    }

    if (query.length > 2000) {
        throw new Error("Query exceeds maximum length.");
    }

    return true;
}