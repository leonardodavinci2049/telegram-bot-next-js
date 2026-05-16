import { z } from "zod";

import { parseEnv } from "@/core/config/env-validation";

const serverEnvsSchema = z.object({
  PORT: z.coerce.number().default(7777),
  EXTERNAL_API_MAIN_URL: z.string().url(),
  WEBHOOK_LOCAL_PORT: z.coerce.number().default(7777),
  WEBHOOK_URL: z.string().url(),
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_BOT_LINK: z.string().url(),
  TELEGRAM_API_URL: z.string().url(),
  TELEGRAM_MESSAGE_RESPONSE: z.string().min(1),
});

export const serverEnvs = parseEnv(serverEnvsSchema, process.env, {
  scope: "server",
  sourceFiles: [".env.local"],
});

export type ServerEnvs = z.infer<typeof serverEnvsSchema>;
