import express, {} from 'express';
import { getDevices } from 'naudiodon';
import configRouter from "./routes/config.js";
const app = express();
const port = 3000;
const devices = getDevices();
const preferred = devices.filter(d => d.hostAPIName === 'Windows WASAPI');
console.log(preferred);
app.use("/config", configRouter);
app.get('/', (req, res) => {
    res.send('Hello TypeScript with Express!');
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map