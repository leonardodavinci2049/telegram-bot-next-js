import { escape as mysqlEscape } from "mysql2";
import { v4 as UuidV4 } from "uuid";
import { envs } from "@/core/config";
import type { PromoLinkCreateDto } from "../dto/promo_link_create.dto";

export function PromoLinkCreateQuery(dataJsonDto: PromoLinkCreateDto): string {
  const PE_UUID = mysqlEscape(UuidV4());
  const PE_CLIENT_ID = envs.CLIENT_ID;
  const PE_APP_ID = dataJsonDto.PE_APP_ID ?? envs.APP_ID;
  const PE_TYPE_ID = dataJsonDto.PE_TYPE_ID;
  const PE_LINK_NAME1 = mysqlEscape(dataJsonDto.PE_LINK_NAME1 ?? "");
  const PE_LINK_NAME2 = mysqlEscape(dataJsonDto.PE_LINK_NAME2 ?? "");
  const PE_LINK_NAME3 = mysqlEscape(dataJsonDto.PE_LINK_NAME3 ?? "");
  const PE_LINK1 = mysqlEscape(dataJsonDto.PE_LINK1);
  const PE_LINK2 = mysqlEscape(dataJsonDto.PE_LINK2 ?? "");
  const PE_LINK3 = mysqlEscape(dataJsonDto.PE_LINK3 ?? "");
  const PE_NOTES = mysqlEscape(dataJsonDto.PE_NOTES ?? "");

  const queryString = ` call sp_promo_link_create_v3(
        ${PE_UUID},
        ${PE_CLIENT_ID},
        ${PE_APP_ID},
        ${PE_TYPE_ID},
        ${PE_LINK_NAME1},
        ${PE_LINK_NAME2},
        ${PE_LINK_NAME3},
        ${PE_LINK1},
        ${PE_LINK2},
        ${PE_LINK3},
        ${PE_NOTES}
        ) `;

  return queryString;
}
