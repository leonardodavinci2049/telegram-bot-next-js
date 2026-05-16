import { envs } from "@/core/config";
import type { PromoLinkFindLatestIdDto } from "../dto/promo_link_find_latest_id.dto";

export function PromoLinkFindLatestIdQuery(
  dataJsonDto: PromoLinkFindLatestIdDto,
): string {
  const PE_CLIENT_ID = envs.CLIENT_ID;
  const PE_APP_ID = dataJsonDto.PE_APP_ID ?? envs.APP_ID;
  const PE_TYPE_ID = dataJsonDto.PE_TYPE_ID;

  const queryString = ` call sp_promo_link_find_latest_id_v3(
        ${PE_CLIENT_ID},
        ${PE_APP_ID},
        ${PE_TYPE_ID}
        ) `;

  return queryString;
}
