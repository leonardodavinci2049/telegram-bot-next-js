export type { PromoLinkCreateDto } from "./dto/promo_link_create.dto";
export type { PromoLinkDeleteDto } from "./dto/promo_link_delete.dto";
export type { PromoLinkFindAllDto } from "./dto/promo_link_find_all.dto";
export type { PromoLinkFindLatestIdDto } from "./dto/promo_link_find_latest_id.dto";
export type { PromoLinkFindLatestTypeDto } from "./dto/promo_link_find_latest_type.dto";
export { default, PromoLinkService } from "./promo-link.service";
export type {
  PromoLinkLatestTypeItem,
  PromoLinkListItem,
  PromoLinkTypeLinks,
} from "./promo-link-cached-service";
export {
  getAllPromoLinks,
  getLatestPromoLinkByType,
  getLatestPromoLinksByType,
} from "./promo-link-cached-service";
export type {
  SpDefaultFeedback,
  TblPromoLinkLatestTypeRecord,
  TblPromoLinkRecord,
} from "./types/promo-link.type";
