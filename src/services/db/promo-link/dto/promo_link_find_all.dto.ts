export interface PromoLinkFindAllDto {
  PE_APP_ID?: number;
  PE_TYPE_ID: number;
  PE_LIMIT?: number;
}

function normalizeRequiredPositiveNumber(
  value: unknown,
  fieldName: string,
): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    throw new Error(`${fieldName} is required and must be a positive integer`);
  }

  return value;
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

function normalizeOptionalLimit(value: unknown): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    throw new Error("PE_LIMIT must be a positive integer");
  }

  return value;
}

export function validatePromoLinkFindAllDto(
  data: unknown,
): PromoLinkFindAllDto {
  if (data !== undefined && data !== null && typeof data !== "object") {
    throw new Error("Invalid payload provided");
  }

  const dto = (data as Record<string, unknown>) || {};

  return {
    PE_APP_ID: normalizeOptionalPositiveNumber(dto.PE_APP_ID, "PE_APP_ID"),
    PE_TYPE_ID: normalizeRequiredPositiveNumber(dto.PE_TYPE_ID, "PE_TYPE_ID"),
    PE_LIMIT: normalizeOptionalLimit(dto.PE_LIMIT),
  };
}
