import { describe, it, expect } from "vitest";
import { validateInput } from "./inputValidator.js";

describe("validateInput", () => {
    it("should return true for a valid query", () => {
        expect(validateInput("Explain AI agents")).toBe(true);
    });

    it("should throw an error if query is missing", () => {
        expect(() => validateInput()).toThrow("Query is required.");
    });

    it("should throw an error if query is not a string", () => {
        expect(() => validateInput(123)).toThrow("Query must be a string.");
        expect(() => validateInput({})).toThrow("Query must be a string.");
        expect(() => validateInput([])).toThrow("Query must be a string.");
    });

    it("should treat null as a missing query", () => {
        expect(() => validateInput(null)).toThrow("Query is required.");
    });

    it("should throw an error for an empty string", () => {
        expect(() => validateInput("")).toThrow("Query is required.");
    });

    it("should throw an error for whitespace-only input", () => {
        expect(() => validateInput("     ")).toThrow("Query cannot be empty.");
    });

    it("should throw an error if query exceeds maximum length", () => {
        const longQuery = "a".repeat(2001);

        expect(() => validateInput(longQuery)).toThrow(
            "Query exceeds maximum length."
        );
    });
});