import express from "express";
import cors from "cors";

import chatRouter from "./routes/chat.js";
import healthRouter from "./routes/health.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AI Agent Assignment API is running 🚀",
    });
});

// Health Check Route
app.use("/health", healthRouter);

// Chat Route
app.use("/api/chat", chatRouter);

export default app;