import path from "path";

export const configDir = path.join(process.env.APPDATA || process.env.HOME + '/.config', 'Soundbyte');
export const configPath = path.join(configDir, 'config.json');

export const soundbytesDir = path.join(configDir, "soundbytes");