export default class Metrics {
    constructor() {
        this.startTime = Date.now();

        this.inputTokens = 0;
        this.optimizedTokens = 0;

        this.retrievedDocuments = 0;

        this.retries = 0;

        this.llmCalls = 0;

        this.cacheHits = 0;
        this.cacheMisses = 0;

        this.failedRequests = 0;
        this.successRequests = 0;
    }

    setInputTokens(tokens) {
        this.inputTokens = tokens;
    }

    setOptimizedTokens(tokens) {
        this.optimizedTokens = tokens;
    }

    setRetrievedDocuments(count) {
        this.retrievedDocuments = count;
    }

    incrementRetry() {
        this.retries++;
    }

    incrementLLMCalls() {
        this.llmCalls++;
    }

    incrementCacheHit() {
        this.cacheHits++;
    }

    incrementCacheMiss() {
        this.cacheMisses++;
    }

    incrementSuccess() {
        this.successRequests++;
    }

    incrementFailure() {
        this.failedRequests++;
    }

    finish() {
        const executionTime = Date.now() - this.startTime;

        return {
            executionTime: `${executionTime} ms`,

            inputTokens: this.inputTokens,

            optimizedTokens: this.optimizedTokens,

            savedTokens:
                this.inputTokens - this.optimizedTokens,

            retrievedDocuments: this.retrievedDocuments,

            retries: this.retries,

            llmCalls: this.llmCalls,

            cacheHits: this.cacheHits,

            cacheMisses: this.cacheMisses,

            successRequests: this.successRequests,

            failedRequests: this.failedRequests,
        };
    }
}