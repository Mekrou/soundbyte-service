import express, { type Request, type Response } from 'express';
import { getDevices } from 'naudiodon';

import configRouter from "./routes/config.js"
import soundbytesRouter from "./routes/soundbytes.js"
import playbackRouter from "./routes/playback.js"
import { saveSoundbytes } from './utils/soundbyteStore.js';
import cors from "cors"

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const devices = getDevices();
const preferred = devices.filter(d => d.hostAPIName === 'MME');
console.log(preferred);

app.use("/config", configRouter);
app.use("/soundbytes", soundbytesRouter);
app.use("/playback", playbackRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello TypeScript with Express!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

process.on("SIGINT", () => {
    saveSoundbytes();
    process.exit();
})

process.on("SIGTERM", () => {
    saveSoundbytes();
    process.exit();
})