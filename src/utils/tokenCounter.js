export function estimateTokens(text = "") {
    if (!text) return 0;

    // Approximation:
    // 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
}

export function calculateTotalTokens(parts = []) {
    return parts.reduce((total, part) => {
        return total + estimateTokens(part);
    }, 0);
}