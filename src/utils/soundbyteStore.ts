import fs, { existsSync } from "fs";
import path from "path";
import { soundbytesDir } from "../constants/global.js";

export type Soundbyte = {
    id: number,
    name: string;             // Human-friendly label
    filePath: string;         // Full path on disk
    tags?: string[];          // e.g. ["meme", "anime", "angry"]
};

export interface SoundbytesFile {
    soundbytes: Soundbyte[],
    nextId: number
}

let nextId: number = 1;
let soundbytes: Soundbyte[] = [];
const soundbytesFile = path.join(soundbytesDir, "soundbytes.json")

function ensureDir(dir: string): void {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

function loadSoundbytes() {
    ensureDir(soundbytesDir);

    if (fs.existsSync(soundbytesFile)) {
        const raw = fs.readFileSync(soundbytesFile, "utf-8");
        const file: SoundbytesFile = JSON.parse(raw);
        soundbytes = file.soundbytes;
        nextId = file.nextId;
    }
}

/* Lazy-load soundbytes whenever this module is imported */
loadSoundbytes();

export function saveSoundbytes() {
    fs.writeFileSync(soundbytesFile, JSON.stringify({
        soundbytes,
        nextId
    }));
}

export function addSoundbyte(name: string, filePath: string) {
    const newSb: Soundbyte = { id: nextId++, name, filePath };
    soundbytes.push(newSb);
    saveSoundbytes();
}

export function getSoundbytes(): Soundbyte[] {
    return soundbytes;
}

/**
 * Get a list of all uploaded soundbyte paths
 * @returns an array of all soundbyte paths
 */
// export function getSoundbytes(): string[] {
//     const soundbytes = fs
//         .readdirSync(soundbytesDir)
//         .filter(file => fs.statSync(path.join(soundbytesDir, file)).isFile())
//         .map(file => path.basename(path.join(soundbytesDir, file)))

//     return soundbytes
// }

/**
 * Get a specific soundbyte by name.
 * @param name the soundbyte's name to find
 * @returns the found soundbyte's path, null if not found.
 */
// export function getSoundbyte(name: string): string | null {
//     return soundbytes.find(sbPath => path.basename(sbPath) === name) || null;
// }