import express, { type Request, type Response } from 'express';
import { getDevices } from 'naudiodon';

import configRouter from "./routes/config.js"

const app = express();
const port = 3000;

app.use(express.json());

const devices = getDevices();
const preferred = devices.filter(d => d.hostAPIName === 'Windows WASAPI');
console.log(preferred);

app.use("/config", configRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello TypeScript with Express!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});