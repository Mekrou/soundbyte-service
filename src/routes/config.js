import { Router } from "express";
import { getDevices } from "naudiodon";
const router = Router();
router.get("/devices", (req, res) => {
    const devices = getDevices();
    const preferred = devices.filter(d => d.hostAPIName === 'Windows WASAPI').map(d => d.name);
    return res.status(200).json(preferred);
});
export default router;
//# sourceMappingURL=config.js.map