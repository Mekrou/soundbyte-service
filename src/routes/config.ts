import { Router, type Request, type Response } from "express";
import { getDevices } from "naudiodon";

const router = Router();

export type ConfigDevice = {
    name: string,
    id: number,
    type: "Speaker" | "Microphone"
}

/**
 * Get the input/output audio devices for the device.
 * sample response: 
 *  [
        {
            "id": 8,
            "name": "XF250Q (HD Audio Driver for Display Audio)",
            "type": "Speaker"
        },
        {
            "id": 9,
            "name": "CABLE Input (VB-Audio Virtual Cable)",
            "type": "Speaker"
        }
    ]
 */
router.get("/devices", (req: Request, res: Response) => {
    const devices = getDevices();
    const preferred = devices.filter(d => d.hostAPIName === 'Windows WASAPI').map(d => {
        return {
            id: d.id,
            name: d.name,
            type: d.maxInputChannels > 0 ? "Microphone" : "Speaker"
        } as ConfigDevice
    });
    return res.status(200).json(preferred);
});

router.get("/", (req: Request, res: Response) => {

});

export default router;