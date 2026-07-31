import { planner } from "./planner.js";
import { retriever } from "./retriever.js";
import { summarizer } from "./summarizer.js";

import { compressHistory } from "../optimization/historySummary.js";
import { smartRetrieval } from "../optimization/smartRetrieval.js";

import { logStep } from "../debug/logger.js";
import { validateResponse } from "../debug/validator.js";
import { simulateFailure } from "../debug/simulateFailure.js";

import { calculateTotalTokens } from "../utils/tokenCounter.js";

export async function runPipeline(query, history = []) {
    try {
        // ------------------------------------
        // Simulate failures for debugging demo
        // ------------------------------------
        const failureType = process.env.SIMULATE_FAILURE || "none";
        simulateFailure(failureType);

        // ------------------------------------
        // Planner
        // ------------------------------------
        const plan = await planner(query);
        logStep("Planner", plan);

        // ------------------------------------
        // Retriever
        // ------------------------------------
        const retrievedData = await retriever(plan);
        logStep("Retriever", retrievedData);

        const beforeDocuments = retrievedData.documents;

        // ------------------------------------
        // Before Optimization
        // ------------------------------------
        const beforeTokens = calculateTotalTokens([
            ...history.map((msg) => msg.content),
            ...beforeDocuments.map((doc) => doc.content),
            query,
        ]);

        // ------------------------------------
        // Optimization 1
        // Conversation History Compression
        // ------------------------------------
        const optimizedHistory = await compressHistory(history);

        // ------------------------------------
        // Optimization 2
        // Smart Retrieval
        // ------------------------------------
        const optimizedDocs = smartRetrieval(
            beforeDocuments,
            query,
            5
        );

        // ------------------------------------
        // Summarizer
        // ------------------------------------
        const result = await summarizer(query, optimizedDocs);

        logStep("Summarizer", result);

        // ------------------------------------
        // Validate AI Output
        // ------------------------------------
        validateResponse(result);

        if (!result.answer) {
            throw new Error("AI returned an empty answer.");
        }

        // ------------------------------------
        // After Optimization
        // ------------------------------------
        const afterTokens = calculateTotalTokens([
            ...optimizedHistory.map((msg) => msg.content),
            ...optimizedDocs.map((doc) => doc.content),
            query,
        ]);

        return {
            success: true,

            metrics: {
                beforeTokens,
                afterTokens,
                tokensSaved: beforeTokens - afterTokens,
            },

            optimization: {
                historyCompression: {
                    originalMessages: history.length,
                    optimizedMessages: optimizedHistory.length,
                },

                smartRetrieval: {
                    originalDocuments: beforeDocuments.length,
                    optimizedDocuments: optimizedDocs.length,
                },
            },

            optimizedHistory,

            documentsUsed: optimizedDocs.length,

            answer: result.answer,
        };
    } catch (error) {
        console.error("\n========== PIPELINE ERROR ==========");
        console.error(error);
        console.error("====================================\n");

        throw error;
    }
}