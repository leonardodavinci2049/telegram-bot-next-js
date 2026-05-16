import "server-only";

import { z } from "zod";
import { createLogger } from "@/core/logger";
import { getConfigById } from "./config.service";

const logger = createLogger("ConfigCachedService");

const TELEGRAM_BOT_CONFIG_ID = 7;
const webhookBaseUrlSchema = z
  .string()
  .trim()
  .url()
  .superRefine((value, context) => {
    const url = new URL(value);

    if (url.pathname !== "/" || url.search || url.hash) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "WEBHOOK_URL deve conter apenas a URL base, sem path ou query",
      });
    }
  })
  .transform((value) => value.replace(/\/$/, ""));

const telegramBotConfigSchema = z.object({
  CONFIG_ID: z.number().int().positive(),
  TELEGRAM_BOT_TOKEN: z.string().trim().min(1),
  WEBHOOK_URL: webhookBaseUrlSchema,
  TELEGRAM_BOT_LINK: z.string().url().nullable(),
  TELEGRAM_BOT_CHATID: z.string().min(1).nullable(),
});

export type TelegramBotDbConfig = z.infer<typeof telegramBotConfigSchema>;

let telegramBotConfigPromise: Promise<TelegramBotDbConfig> | null = null;

async function loadTelegramBotConfig(): Promise<TelegramBotDbConfig> {
  const rawConfig = await getConfigById(TELEGRAM_BOT_CONFIG_ID);

  if (!rawConfig) {
    throw new Error(
      `Configuração ${TELEGRAM_BOT_CONFIG_ID} não encontrada na tbl_config`,
    );
  }

  const parsedConfig = telegramBotConfigSchema.safeParse(rawConfig);

  if (!parsedConfig.success) {
    logger.error(
      "Telegram bot config is invalid",
      parsedConfig.error.flatten(),
    );
    throw new Error(
      `Configuração ${TELEGRAM_BOT_CONFIG_ID} do Telegram está incompleta ou inválida`,
    );
  }

  return parsedConfig.data;
}

export async function getTelegramBotDbConfig(): Promise<TelegramBotDbConfig> {
  if (!telegramBotConfigPromise) {
    telegramBotConfigPromise = loadTelegramBotConfig().catch((error) => {
      telegramBotConfigPromise = null;
      throw error;
    });
  }

  return telegramBotConfigPromise;
}
