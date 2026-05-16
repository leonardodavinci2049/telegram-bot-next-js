export interface PromoLinkFindLatestTypeDto {
  PE_APP_ID?: number;
}

function normalizeOptionalPositiveNumber(
  value: unknown,
  fieldName: string,
): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }

  return value;
}

export function validatePromoLinkFindLatestTypeDto(
  data: unknown,
): PromoLinkFindLatestTypeDto {
  if (data !== undefined && data !== null && typeof data !== "object") {
    throw new Error("Invalid payload provided");
  }

  const dto = (data as Record<string, unknown>) || {};

  return {
    PE_APP_ID: normalizeOptionalPositiveNumber(dto.PE_APP_ID, "PE_APP_ID"),
  };
}
