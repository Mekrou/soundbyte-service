import { Router, type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import { configDir } from "../constants/global.js";
import { addSoundbyte, getSoundbytes } from "../utils/soundbyteStore.js"
import fs from "fs";

const upload = multer({ dest: "uploads/"});

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

router.post("/upload", upload.single("file"), (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: "No file uploaded"});
    }

    const newPath = path.join(path.join(configDir, "soundbytes"), file.originalname);
    fs.renameSync(file.path, newPath);
    addSoundbyte(file.originalname, newPath);

    return res.status(200);
});

export default router;