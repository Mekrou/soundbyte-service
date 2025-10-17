import z from "zod";

export const ConfigDeviceSchema = z.object({
    name: z.string(),
    id: z.number(),
    type: z.enum(["Input", "Output"])
})
export type ConfigDevice = z.infer<typeof ConfigDeviceSchema>;

export const ConfigSchema = z.object({
    output: ConfigDeviceSchema,
    input: ConfigDeviceSchema
})
export type ConfigSchema = z.infer<typeof ConfigSchema>
