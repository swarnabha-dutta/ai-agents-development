export async function planner(query) {
    return {
        originalQuery: query,
        intent: "general_question",
        tasks: [
            "Retrieve relevant information",
            "Generate concise answer"
        ]
    };
}