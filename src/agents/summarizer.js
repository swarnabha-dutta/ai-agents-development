export async function summarizer(query, documents) {
    return {
        answer: documents
            .map((doc) => doc.content)
            .join("\n")
    };
}