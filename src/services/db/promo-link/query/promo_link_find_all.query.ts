import { envs } from "@/core/config";
import type { PromoLinkFindAllDto } from "../dto/promo_link_find_all.dto";

export function PromoLinkFindAllQuery(
  dataJsonDto: PromoLinkFindAllDto,
): string {
  const PE_CLIENT_ID = envs.CLIENT_ID;
  const PE_APP_ID = dataJsonDto.PE_APP_ID ?? envs.APP_ID;
  const PE_TYPE_ID = dataJsonDto.PE_TYPE_ID;
  const PE_LIMIT = dataJsonDto.PE_LIMIT ?? 20;

  const queryString = ` call sp_promo_link_find_all_v3(
        ${PE_CLIENT_ID},
        ${PE_APP_ID},
        ${PE_TYPE_ID},
        ${PE_LIMIT}
        ) `;

  return queryString;
}
