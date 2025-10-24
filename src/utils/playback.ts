import portAudio from "naudiodon"
import { loadConfig } from "./configUtils.js"
import type { Soundbyte } from "./soundbyteStore.js";
import { Transform } from "stream"
import decode from "audio-decode"
import fs from "fs"

const config = loadConfig();

export async function computeRMS(filePath: string): Promise<number> {
    const buffer = fs.readFileSync(filePath);
    const audioBuffer = await decode(buffer);
    const channelData = audioBuffer.getChannelData(0); // assume mono or just take left

    // Compute RMS
    const rms = Math.sqrt(channelData.reduce((sum: number, s: number) => sum + s * s, 0) / channelData.length);
    return rms;
}

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

    const gain = 0.0125 / await computeRMS(soundbyte.filePath);

    const gainTransform = new Transform({
        transform(chunk: Buffer, encoding, callback) {
            // assuming 16-bit PCM
            for (let i = 0; i < chunk.length; i += 2) {
                let sample = chunk.readInt16LE(i);
                sample = Math.max(-32768, Math.min(32767, Math.floor(sample * gain)));
                chunk.writeInt16LE(sample, i);
            }
            callback(null, chunk);
        }
    });

    // Stream PCM only (skip full header)
    fs.createReadStream(soundbyte.filePath, { start: dataStart })
        .pipe(gainTransform)
        .pipe(ao);
    ao.start();
}