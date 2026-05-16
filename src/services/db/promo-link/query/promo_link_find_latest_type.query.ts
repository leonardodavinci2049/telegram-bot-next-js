import { envs } from "@/core/config";
import type { PromoLinkFindLatestTypeDto } from "../dto/promo_link_find_latest_type.dto";

export function PromoLinkFindLatestTypeQuery(
  dataJsonDto: PromoLinkFindLatestTypeDto,
): string {
  const PE_CLIENT_ID = envs.CLIENT_ID;
  const PE_APP_ID = dataJsonDto.PE_APP_ID ?? envs.APP_ID;

  const queryString = ` call sp_promo_link_find_latest_type_v3(
        ${PE_CLIENT_ID},
        ${PE_APP_ID}
        ) `;

  return queryString;
}
