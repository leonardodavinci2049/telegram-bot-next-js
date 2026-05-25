import { z } from "zod";

import { parseEnv } from "@/core/config/env-validation";

const serverEnvsSchema = z.object({
  PORT: z.coerce.number().default(7777),
  APP_ID: z.string().min(1),
  CLIENT_ID: z.string().min(1),
  EXTERNAL_API_MAIN_URL: z.string().url(),
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.coerce.number().positive(),
  DATABASE_NAME: z.string().min(1),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  TELEGRAM_MESSAGE_RESPONSE: z.string().min(1),
  TELEGRAM_BOT_CHANNEL_ID: z
    .string()
    .trim()
    .min(1)
    .default("@Celulares_Smartphone"),
  API_KEY: z.string().min(1),
});

export const serverEnvs = parseEnv(serverEnvsSchema, process.env, {
  scope: "server",
  sourceFiles: [".env.local"],
});

export type ServerEnvs = z.infer<typeof serverEnvsSchema>;
