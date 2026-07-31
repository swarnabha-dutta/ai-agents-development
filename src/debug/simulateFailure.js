export function simulateFailure(type = "none") {
    switch (type) {
        case "timeout":
            throw new Error("Request timed out.");

        case "malformed":
            throw new Error("Malformed AI response.");

        case "wrong-data":
            return {
                answer: null,
            };

        default:
            return null;
    }
}