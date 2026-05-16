import type { RowDataPacket } from "mysql2/promise";

export type ConfigFindByIdItem = RowDataPacket & {
  CONFIG_ID: number;
  PROJECT_ID: number | null;
  CUSTOMER_NAME: string | null;
  TELEGRAM_BOT_NAME: string | null;
  TELEGRAM_BOT_LINK: string | null;
  TELEGRAM_BOT_TOKEN: string | null;
  TELEGRAM_BOT_CHATID: string | null;
  WEBHOOK_URL: string | null;
  WEBHOOK_LOCAL_PORT: number | null;
  OPENAI_API_KEY: string | null;
  SHOPEE_CREDENTIAL: string | null;
  SHOPEE_SECRET_KEY: string | null;
  SHOPEE_AFFILIATE_ENDPOINT: string | null;
  SHOPEE_AFFILIATE_TIMEOUT: string | null;
  SHOPEE_AFFILIATE_SUBIDS: string | null;
  CREATEDAT: Date | null;
  UPDATEDAT: Date | null;
};
