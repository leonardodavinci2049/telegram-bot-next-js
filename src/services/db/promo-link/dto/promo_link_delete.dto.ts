export interface PromoLinkDeleteDto {
  PE_ID: number;
  PE_CLIENT_ID: number;
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

export function validatePromoLinkDeleteDto(data: unknown): PromoLinkDeleteDto {
  if (data === undefined || data === null || typeof data !== "object") {
    throw new Error("Invalid payload provided");
  }

  const dto = data as Record<string, unknown>;

  return {
    PE_ID: normalizeRequiredPositiveNumber(dto.PE_ID, "PE_ID"),
    PE_CLIENT_ID: normalizeRequiredPositiveNumber(
      dto.PE_CLIENT_ID,
      "PE_CLIENT_ID",
    ),
  };
}
