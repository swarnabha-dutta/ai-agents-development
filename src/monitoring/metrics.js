class Metrics {
    constructor() {
        this.startTime = Date.now();

        this.inputTokens = 0;
        this.optimizedTokens = 0;
        this.savedTokens = 0;

        this.documents = 0;

        this.retryCount = 0;
        this.llmCalls = 0;
    }

    setInputTokens(tokens) {
        this.inputTokens = tokens;
    }

    setOptimizedTokens(tokens) {
        this.optimizedTokens = tokens;
        this.savedTokens = this.inputTokens - tokens;
    }

    setRetrievedDocuments(count) {
        this.documents = count;
    }

    incrementRetry() {
        this.retryCount++;
    }

    incrementLLMCalls() {
        this.llmCalls++;
    }

    finish() {
        return {
            executionTime: `${Date.now() - this.startTime} ms`,
            inputTokens: this.inputTokens,
            optimizedTokens: this.optimizedTokens,
            savedTokens: this.savedTokens,
            retrievedDocuments: this.documents,
            retries: this.retryCount,
            llmCalls: this.llmCalls,
        };
    }
}

export default Metrics;