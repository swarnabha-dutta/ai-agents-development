import { Router } from "express";
import { runPipeline } from "../agents/pipeline.js";

const router = Router();

router.post("/", async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const { query } = req.body || {};

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Query is required.",
            });
        }

        const history = [
            {
                role: "user",
                content: "Explain JavaScript",
            },
            {
                role: "assistant",
                content: "JavaScript is a programming language.",
            },
            {
                role: "user",
                content: "Explain React",
            },
            {
                role: "assistant",
                content: "React is a frontend library.",
            },
            {
                role: "user",
                content: "Explain Hooks",
            },
            {
                role: "assistant",
                content: "Hooks allow state in functional components.",
            },
        ];

        const response = await runPipeline(query, history);

        return res.status(200).json({
            success: true,
            ...response,
        });
    } catch (error) {
        console.error("Chat Route Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message, // debugging-এর জন্য
        });
    }
});

export default router;