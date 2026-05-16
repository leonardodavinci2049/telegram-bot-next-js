import "server-only";

import dbService from "@/database/dbConnection";
import { CONFIG_FIND_BY_ID_SQL } from "./query/config-find_by_id";
import type { ConfigFindByIdItem } from "./types/config-find.type";

export async function getConfigById(
  configId: number,
): Promise<ConfigFindByIdItem | null> {
  const configs = await dbService.selectExecute<ConfigFindByIdItem>(
    CONFIG_FIND_BY_ID_SQL,
    [configId],
  );

  return configs[0] ?? null;
}
