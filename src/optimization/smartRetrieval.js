export function smartRetrieval(documents = [], query = "", limit = 5) {
    if (!Array.isArray(documents) || documents.length === 0) {
        return [];
    }

    const keywords = query
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

    const rankedDocuments = documents
        .map((doc) => {
            const searchableText = `${doc.title} ${doc.content}`.toLowerCase();

            let score = 0;

            for (const keyword of keywords) {
                if (searchableText.includes(keyword)) {
                    score++;
                }
            }

            return {
                ...doc,
                score,
            };
        })
        .sort((a, b) => b.score - a.score);

    return rankedDocuments.slice(0, limit);
}