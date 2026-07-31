import express from "express";
import cacheManager from "../cache/cacheManager.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
        uptime: `${Math.floor(process.uptime())} seconds`,
        cacheEntries: cacheManager.size(),
        timestamp: new Date().toISOString(),
    });
});

export default router;