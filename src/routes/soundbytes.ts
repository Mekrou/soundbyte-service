import { Router, type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import { configDir, soundbytesDir } from "../constants/global.js";
import { addSoundbyte, getSoundbytes } from "../utils/soundbyteStore.js"
import fs from "fs";
import { playSoundbyte } from "../utils/playback.js";
import ffmpeg from "fluent-ffmpeg"

const upload = multer({ dest: "uploads/" });

const router = Router();

router.get("/search", (req: Request, res: Response) => {
    const { search } = req.query;

});

router.get("/", (req: Request, res: Response) => {
    return res.json(getSoundbytes());
})

router.get("/searchByTags", (req: Request, res: Response) => {
    const { tags } = req.query;
});

router.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const inputPath = file.path;
    const baseName = path.parse(file.originalname).name;
    const outputPath = path.join(soundbytesDir, `${baseName}.wav`);

    try {
        await convertToWav(inputPath, outputPath);
        fs.unlinkSync(inputPath);
        addSoundbyte(baseName, outputPath);
        return res.json({ success: true, file: outputPath });
    } catch (err) {
        console.error("FFmpeg conversion failed:", err);
        res.status(500).json({ error: "Failed to convert file" });
    }
});

router.post("/:id/play", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const sb = getSoundbytes().find(s => s.id === id);
    if (!sb) return res.status(404).json({ error: "Soundbyte not found" });

    playSoundbyte(sb).then(() => {
        return res.json({ success: true });
    });
});

export async function convertToWav(inputPath: string, outputPath: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
            .audioCodec("pcm_s16le") // 16-bit little endian PCM
            .audioFrequency(48000)   // 48 kHz
            .audioChannels(2)        // stereo
            .format("wav")
            .on("end", () => resolve())
            .on("error", (err) => reject(err))
            .save(outputPath);
    });
}


export default router;