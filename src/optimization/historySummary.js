import ai from "../config/gemini.js";

export async function compressHistory(messages = []) {
    if (messages.length <= 4) {
        return messages;
    }

    const oldMessages = messages.slice(0, -4);
    const latestMessages = messages.slice(-4);

    const conversation = oldMessages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n");

    const prompt = `
You are a conversation summarizer.

Summarize the following conversation in under 120 words.

Preserve:
- User goals
- Important facts
- Context
- Decisions

Do NOT add new information.

Conversation:

${conversation}
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return [
            {
                role: "system",
                content: response.text,
            },
            ...latestMessages,
        ];
    } catch (error) {
        console.error("History Compression Error:", error);

        return messages;
    }
}