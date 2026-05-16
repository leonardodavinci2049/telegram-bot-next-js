import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { envs } from "@/core/config";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";
import promoLinkService from "./promo-link.service";
import type {
  TblPromoLinkLatestTypeRecord,
  TblPromoLinkRecord,
} from "./types/promo-link.type";

const logger = createLogger("PromoLinkCachedService");
const clientId = String(envs.CLIENT_ID);

function getPromoLinkCacheTags(typeId?: number, appId?: number): string[] {
  const tags = [CACHE_TAGS.promoLinks, CACHE_TAGS.promoLinksByClient(clientId)];

  if (appId !== undefined) {
    tags.push(CACHE_TAGS.promoLinksByApp(clientId, String(appId)));
  }

  if (typeId !== undefined) {
    tags.push(CACHE_TAGS.promoLinksByType(clientId, String(typeId)));
  }

  if (appId !== undefined && typeId !== undefined) {
    tags.push(
      CACHE_TAGS.promoLinksByAppAndType(
        clientId,
        String(appId),
        String(typeId),
      ),
    );
  }

  return tags;
}

export type PromoLinkListItem = {
  id: number;
  linkName1: string | null;
  linkName2: string | null;
  linkName3: string | null;
  link1: string | null;
  link2: string | null;
  link3: string | null;
  notes: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type PromoLinkTypeLinks = {
  id: number;
  link1: string | null;
  link2: string | null;
  link3: string | null;
};

export type PromoLinkLatestTypeItem = {
  type1: PromoLinkTypeLinks;
  type2: PromoLinkTypeLinks;
};

function transformPromoLinkRecord(
  record: TblPromoLinkRecord,
): PromoLinkListItem {
  return {
    id: record.ID,
    linkName1: record.LINK_NAME1 ?? null,
    linkName2: record.LINK_NAME2 ?? null,
    linkName3: record.LINK_NAME3 ?? null,
    link1: record.LINK1 ?? null,
    link2: record.LINK2 ?? null,
    link3: record.LINK3 ?? null,
    notes: record.NOTES ?? null,
    createdAt: record.CREATEDAT ?? null,
    updatedAt: record.UPDATEDAT ?? null,
  };
}

function transformPromoLinkLatestType(
  record: TblPromoLinkLatestTypeRecord,
): PromoLinkLatestTypeItem {
  return {
    type1: {
      id: record.LINK_ID_TYPE1,
      link1: record.LINK1_TYPE1 ?? null,
      link2: record.LINK2_TYPE1 ?? null,
      link3: record.LINK3_TYPE1 ?? null,
    },
    type2: {
      id: record.LINK_ID_TYPE2,
      link1: record.LINK1_TYPE2 ?? null,
      link2: record.LINK2_TYPE2 ?? null,
      link3: record.LINK3_TYPE2 ?? null,
    },
  };
}

export async function getAllPromoLinks(
  typeId: number,
  options?: {
    appId?: number;
    limit?: number;
  },
): Promise<PromoLinkListItem[]> {
  "use cache";

  cacheLife("frequent");
  cacheTag(...getPromoLinkCacheTags(typeId, options?.appId));

  try {
    const response = await promoLinkService.execPromoLinkFindAllQuery({
      PE_APP_ID: options?.appId,
      PE_TYPE_ID: typeId,
      PE_LIMIT: options?.limit,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.error("Error loading promo links", { message: response.message });
      return [];
    }

    const rawRecords = Array.isArray(response.data) ? response.data : [];

    return rawRecords.map((record) =>
      transformPromoLinkRecord(record as TblPromoLinkRecord),
    );
  } catch (error) {
    logger.error("Failed to fetch promo links", { error });
    return [];
  }
}

export async function getLatestPromoLinkByType(
  typeId: number,
  appId?: number,
): Promise<PromoLinkListItem | null> {
  "use cache";

  cacheLife("frequent");
  cacheTag(...getPromoLinkCacheTags(typeId, appId));

  try {
    const response = await promoLinkService.execPromoLinkFindLatestIdQuery({
      PE_APP_ID: appId,
      PE_TYPE_ID: typeId,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.error("Error loading latest promo link", {
        message: response.message,
      });
      return null;
    }

    const rawRecords = Array.isArray(response.data) ? response.data : [];
    const latestRecord = rawRecords[0] as TblPromoLinkRecord | undefined;

    return latestRecord ? transformPromoLinkRecord(latestRecord) : null;
  } catch (error) {
    logger.error("Failed to fetch latest promo link", { error });
    return null;
  }
}

export async function getLatestPromoLinksByType(
  appId?: number,
): Promise<PromoLinkLatestTypeItem | null> {
  "use cache";

  cacheLife("frequent");
  cacheTag(...getPromoLinkCacheTags(undefined, appId));

  try {
    const response = await promoLinkService.execPromoLinkFindLatestTypeQuery({
      PE_APP_ID: appId,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.error("Error loading latest promo links by type", {
        message: response.message,
      });
      return null;
    }

    const rawRecords = Array.isArray(response.data) ? response.data : [];
    const latestRecord = rawRecords[0] as
      | TblPromoLinkLatestTypeRecord
      | undefined;

    return latestRecord ? transformPromoLinkLatestType(latestRecord) : null;
  } catch (error) {
    logger.error("Failed to fetch latest promo links by type", { error });
    return null;
  }
}
