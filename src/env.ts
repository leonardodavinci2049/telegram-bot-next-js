import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(7777),
  WEBHOOK_LOCAL_PORT: z.coerce.number().default(7777),
  WEBHOOK_URL: z.string().url(),
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_BOT_LINK: z.string().url(),
  TELEGRAM_API_URL: z.string().url(),
  TELEGRAM_MESSAGE_RESPONSE: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "[env] Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export const env = parsed.data;
