import portAudio from "naudiodon"
import { loadConfig } from "./configUtils.js"
import type { Soundbyte } from "./soundbyteStore.js";
import decode from "audio-decode"
import fs from "fs"

const config = loadConfig();

export async function playSoundbyte(soundbyte: Soundbyte) {
    const fd = fs.openSync(soundbyte.filePath, "r");

    // Read first 4KB max to find the "data" chunk offset
    const header = Buffer.alloc(4096);
    const bytesRead = fs.readSync(fd, header, 0, header.length, 0);
    fs.closeSync(fd);

    const dataIndex = header.indexOf("data");
    if (dataIndex === -1 || dataIndex + 8 >= bytesRead)
        throw new Error("Invalid WAV file: no data chunk found");

    // “data” is followed by a 4-byte size field
    const dataStart = dataIndex + 8;

    // Create audio stream
    const ao: portAudio.IoStreamWrite = portAudio.AudioIO({
        outOptions: {
            channelCount: 2,
            sampleFormat: portAudio.SampleFormat16Bit,
            sampleRate: 48000,
            framesPerBuffer: 512,
            deviceId: 19,
        },
    });

    // Stream PCM only (skip full header)
    fs.createReadStream(soundbyte.filePath, { start: dataStart }).pipe(ao);
    ao.start();
}