import { Router, type Request, type Response } from "express";
import { getDevices } from "naudiodon";
import { loadConfig, saveConfig }from "../utils/configUtils.js";
import { ConfigSchema, type ConfigDevice } from "../types/config.js";

const router = Router();

/**
 * Get the input/output audio devices for the device.
 * sample response: 
 *  [
        {
            "id": 8,
            "name": "XF250Q (HD Audio Driver for Display Audio)",
            "type": "Output"
        },
        {
            "id": 9,
            "name": "CABLE Input (VB-Audio Virtual Cable)",
            "type": "Output"
        }
    ]
 */
router.get("/devices", (req: Request, res: Response) => {
    const devices = getDevices();
    const preferred = devices.filter(d => d.hostAPIName === 'Windows WASAPI').map(d => {
        return {
            id: d.id,
            name: d.name,
            type: d.maxInputChannels > 0 ? "Input" : "Output"
        } as ConfigDevice
    });
    return res.status(200).json(preferred);
});

router.get("/", (req: Request, res: Response) => {
    return res.json(loadConfig());
});

router.post("/", (req: Request, res: Response) => {
    const parseResult = ConfigSchema.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.message });
    }

    const config = parseResult.data;
    saveConfig(config);
    res.status(201).json(config);
});

export default router;