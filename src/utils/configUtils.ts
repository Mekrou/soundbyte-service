import fs from 'fs';
import path from 'path';
import type { ConfigSchema } from '../types/config.js';

const configDir = path.join(process.env.APPDATA || process.env.HOME + '/.config', 'Soundbyte');
const configPath = path.join(configDir, 'config.json');


/**
 * Read saved user preferences for what input & output audio device to use.
 * @returns The configuration state, null if no config has been made.
 */
export function loadConfig(): ConfigSchema | null {
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8')) as ConfigSchema;
    }
  } catch (err) {
    console.error("Failed to read config:", err);
  }
  return null; // no config yet
}

/**
 * Save user preferences for what input & output audio devices to use.
 * @param cfg the config object to save
 */
export function saveConfig(cfg: ConfigSchema) {
  try {
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2), 'utf-8');
  } catch (err) {
    console.error("Failed to save config:", err);
  }
}
