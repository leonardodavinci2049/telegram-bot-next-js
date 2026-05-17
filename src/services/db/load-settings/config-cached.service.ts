import "server-only";

import { z } from "zod";
import { createLogger } from "@/core/logger";
import { getConfigById } from "./config.service";

const logger = createLogger("ConfigCachedService");

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

const configCache = new Map<number, Promise<TelegramBotDbConfig>>();

async function loadTelegramBotConfig(
  configId: number,
): Promise<TelegramBotDbConfig> {
  const rawConfig = await getConfigById(configId);

  if (!rawConfig) {
    throw new Error(`Configuração ${configId} não encontrada na tbl_config`);
  }

  const parsedConfig = telegramBotConfigSchema.safeParse(rawConfig);

  if (!parsedConfig.success) {
    logger.error(
      "Telegram bot config is invalid",
      parsedConfig.error.flatten(),
    );
    throw new Error(
      `Configuração ${configId} do Telegram está incompleta ou inválida`,
    );
  }

  return parsedConfig.data;
}

export async function getTelegramBotDbConfig(
  configId: number,
): Promise<TelegramBotDbConfig> {
  if (!configCache.has(configId)) {
    configCache.set(
      configId,
      loadTelegramBotConfig(configId).catch((error) => {
        configCache.delete(configId);
        throw error;
      }),
    );
  }

  const cached = configCache.get(configId);
  if (!cached) {
    throw new Error(`Cache inexistente para configId ${configId}`);
  }
  return cached;
}
