import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("========================================");
    console.log("🚀 AI Agent Server Started");
    console.log(`🌐 URL       : http://localhost:${PORT}`);
    console.log(`❤️ Health    : http://localhost:${PORT}/health`);
    console.log(`💬 Chat API  : http://localhost:${PORT}/api/chat`);
    console.log("========================================");
});