import "server-only";

import { MESSAGES } from "@/core/constants/globalConstants";
import dbService from "@/database/dbConnection";
import { processProcedureResultMutation } from "@/database/utils/process-procedure-result.mutation";
import { processProcedureResultQueryWithoutId } from "@/database/utils/process-procedure-result.query";
import { ResultModel } from "@/database/utils/result.model";
import { validatePromoLinkCreateDto } from "./dto/promo_link_create.dto";
import { validatePromoLinkDeleteDto } from "./dto/promo_link_delete.dto";
import { validatePromoLinkFindAllDto } from "./dto/promo_link_find_all.dto";
import { validatePromoLinkFindLatestIdDto } from "./dto/promo_link_find_latest_id.dto";
import { validatePromoLinkFindLatestTypeDto } from "./dto/promo_link_find_latest_type.dto";
import { PromoLinkCreateQuery } from "./query/promo_link_create.query";
import { PromoLinkFindAllQuery } from "./query/promo_link_find_all.query";
import { PromoLinkFindLatestIdQuery } from "./query/promo_link_find_latest_id.query";
import { PromoLinkFindLatestTypeQuery } from "./query/promo_link_find_latest_type.query";
import type {
  SpResultRecordCreateType,
  SpResultRecordPromoLinkFindAllType,
  SpResultRecordPromoLinkFindLatestIdType,
  SpResultRecordPromoLinkFindLatestTypeType,
  TblPromoLinkLatestTypeRecord,
  TblPromoLinkRecord,
} from "./types/promo-link.type";

export class PromoLinkService {
  async execPromoLinkCreateQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validatePromoLinkCreateDto(dataJsonDto);
      const queryString = PromoLinkCreateQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordCreateType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Promo link creation failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;

      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execPromoLinkFindAllQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validatePromoLinkFindAllDto(dataJsonDto);
      const queryString = PromoLinkFindAllQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordPromoLinkFindAllType;

      return processProcedureResultQueryWithoutId<TblPromoLinkRecord>(
        resultData as unknown[],
        "Promo links not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;

      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execPromoLinkFindLatestIdQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      const validatedDto = validatePromoLinkFindLatestIdDto(dataJsonDto);
      const queryString = PromoLinkFindLatestIdQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordPromoLinkFindLatestIdType;

      return processProcedureResultQueryWithoutId<TblPromoLinkRecord>(
        resultData as unknown[],
        "Promo link not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;

      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execPromoLinkFindLatestTypeQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      const validatedDto = validatePromoLinkFindLatestTypeDto(dataJsonDto);
      const queryString = PromoLinkFindLatestTypeQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordPromoLinkFindLatestTypeType;

      return processProcedureResultQueryWithoutId<TblPromoLinkLatestTypeRecord>(
        resultData as unknown[],
        "Promo links by latest type not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;

      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execPromoLinkDeleteQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validatePromoLinkDeleteDto(dataJsonDto);

      const result = await dbService.modifyExecute(
        "DELETE FROM tbl_promo_link WHERE ID = ? AND CLIENT_ID = ?",
        [validatedDto.PE_ID, validatedDto.PE_CLIENT_ID],
      );

      if (result.affectedRows === 0) {
        return new ResultModel(100404, "Registro não encontrado.", "", []);
      }

      return new ResultModel(
        100200,
        "Link excluído com sucesso.",
        String(validatedDto.PE_ID),
        [],
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;

      return new ResultModel(100404, errorMessage, "", []);
    }
  }
}

const promoLinkService = new PromoLinkService();
export default promoLinkService;
