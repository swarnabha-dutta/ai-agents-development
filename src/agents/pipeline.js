import { planner } from "./planner.js";
import { retriever } from "./retriever.js";
import { summarizer } from "./summarizer.js";

import { compressHistory } from "../optimization/historySummary.js";
import { smartRetrieval } from "../optimization/smartRetrieval.js";

import { logStep } from "../debug/logger.js";
import { validateResponse as validateDebugResponse } from "../debug/validator.js";
import { simulateFailure } from "../debug/simulateFailure.js";
import { withTimeout } from "../debug/timeout.js";

import { calculateTotalTokens } from "../utils/tokenCounter.js";

import MemoryManager from "../memory/memoryManager.js";
import Metrics from "../monitoring/metrics.js";

import { validateInput } from "../validation/inputValidator.js";
import { validateResponse } from "../validation/responseValidator.js";

import { retry } from "../fallback/retry.js";
import { fallbackResponse } from "../fallback/fallbackResponse.js";

import cacheManager from "../cache/cacheManager.js";
import { generateRequestId } from "../monitoring/requestTracker.js";
import config from "../config/pipelineConfig.js";

const memory = new MemoryManager();
export async function runPipeline(query, history = []) {

    const metrics = new Metrics();

    const requestId = generateRequestId();

    console.log(`\n==============================`);
    console.log(`[${requestId}] Pipeline Started`);
    console.log(`==============================\n`);

    try {

        // ------------------------------------
        // Input Validation
        // ------------------------------------
        validateInput(query);

        // ------------------------------------
        // Cache Lookup
        // ------------------------------------
        const cachedResponse = cacheManager.get(query);

        if (cachedResponse) {

            metrics.incrementCacheHit();
            metrics.incrementSuccess();

            console.log(`[${requestId}] ✅ Cache Hit`);

            return {
                success: true,
                cached: true,
                requestId,
                metrics: metrics.finish(),
                answer: cachedResponse,
            };
        }

        metrics.incrementCacheMiss();

        console.log(`[${requestId}] ❌ Cache Miss`);

        // ------------------------------------
        // Store User Query
        // ------------------------------------
        memory.add("user", query);

        // ------------------------------------
        // Simulate Failure
        // ------------------------------------
        const failureType = process.env.SIMULATE_FAILURE || "none";
        simulateFailure(failureType);

        // ------------------------------------
        // Planner
        // ------------------------------------
        const plan = await retry(async () => {

            metrics.incrementLLMCalls();

            return await withTimeout(
                planner(query),
                config.REQUEST_TIMEOUT
            );

        });

        logStep("Planner", plan);

        // ------------------------------------
        // Retriever
        // ------------------------------------
        const retrievedData = await retriever(plan);

        logStep("Retriever", retrievedData);

        const beforeDocuments = retrievedData.documents;

        // ------------------------------------
        // Token Count Before Optimization
        // ------------------------------------
        const beforeTokens = calculateTotalTokens([
            ...history.map((msg) => msg.content),
            ...beforeDocuments.map((doc) => doc.content),
            query,
        ]);

        metrics.setInputTokens(beforeTokens);

        // ------------------------------------
        // Optimization 1
        // ------------------------------------
        const optimizedHistory = await compressHistory(history);

        // ------------------------------------
        // Optimization 2
        // ------------------------------------
        const optimizedDocs = smartRetrieval(
            beforeDocuments,
            query,
            config.MAX_RETRIEVED_DOCUMENTS
        );

        metrics.setRetrievedDocuments(
            optimizedDocs.length
        );
        // ------------------------------------
        // Summarizer
        // ------------------------------------
        const result = await retry(async () => {

            metrics.incrementLLMCalls();

            return await withTimeout(
                summarizer(query, optimizedDocs),
                config.REQUEST_TIMEOUT
            );

        });

        logStep("Summarizer", result);

        // ------------------------------------
        // Response Validation
        // ------------------------------------
        validateDebugResponse(result);

        validateResponse(result.answer);

        // ------------------------------------
        // Store Response in Cache
        // ------------------------------------
        cacheManager.set(query, result.answer);

        // ------------------------------------
        // Store Assistant Response
        // ------------------------------------
        memory.add("assistant", result.answer);

        // ------------------------------------
        // Token Count After Optimization
        // ------------------------------------
        const afterTokens = calculateTotalTokens([
            ...optimizedHistory.map((msg) => msg.content),
            ...optimizedDocs.map((doc) => doc.content),
            query,
        ]);

        metrics.setOptimizedTokens(afterTokens);

        metrics.incrementSuccess();

        console.log(`[${requestId}] ✅ Pipeline Completed`);

        return {

            success: true,

            cached: false,

            requestId,

            metrics: metrics.finish(),

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

            memory: memory.getHistory(),

            documentsUsed: optimizedDocs.length,

            answer: result.answer,

        };

    } catch (error) {

        metrics.incrementFailure();

        console.error("\n====================================");
        console.error(`[${requestId}] PIPELINE ERROR`);
        console.error(error);
        console.error("====================================\n");

        return {

            ...fallbackResponse(),

            requestId,

            metrics: metrics.finish(),

        };

    }

}