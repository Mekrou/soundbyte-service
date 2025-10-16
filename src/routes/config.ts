import { Router, type Request, type Response } from "express";
import { getDevices } from "naudiodon";

const router = Router();

router.get("/devices", (req: Request, res: Response) => {
    const devices = getDevices();
    const preferred = devices.filter(d => d.hostAPIName === 'Windows WASAPI').map(d => d.name);
    return res.status(200).json(preferred);
});

export default router;