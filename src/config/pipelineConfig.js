const pipelineConfig = {
    MAX_HISTORY_MESSAGES: 4,

    MAX_RETRIEVED_DOCUMENTS: 5,

    CACHE_TTL: 5 * 60 * 1000,

    REQUEST_TIMEOUT: 10000,

    MAX_RETRIES: 3,

    MAX_INPUT_LENGTH: 1000,
};

export default pipelineConfig;