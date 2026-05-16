export interface PromoLinkCreateDto {
  PE_APP_ID?: number;
  PE_TYPE_ID: number;
  PE_LINK_NAME1?: string;
  PE_LINK_NAME2?: string;
  PE_LINK_NAME3?: string;
  PE_LINK1: string;
  PE_LINK2?: string;
  PE_LINK3?: string;
  PE_NOTES?: string;
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

function normalizeOptionalString(
  value: unknown,
  fieldName: string,
  maxLength: number,
): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string`);
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length > maxLength) {
    throw new Error(`${fieldName} cannot exceed ${maxLength} characters`);
  }

  return trimmedValue;
}

function normalizeRequiredString(
  value: unknown,
  fieldName: string,
  maxLength: number,
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} is required and must be a non-empty string`);
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length > maxLength) {
    throw new Error(`${fieldName} cannot exceed ${maxLength} characters`);
  }

  return trimmedValue;
}

export function validatePromoLinkCreateDto(data: unknown): PromoLinkCreateDto {
  if (data !== undefined && data !== null && typeof data !== "object") {
    throw new Error("Invalid payload provided");
  }

  const dto = (data as Record<string, unknown>) || {};

  return {
    PE_APP_ID: normalizeOptionalPositiveNumber(dto.PE_APP_ID, "PE_APP_ID"),
    PE_TYPE_ID: normalizeRequiredPositiveNumber(dto.PE_TYPE_ID, "PE_TYPE_ID"),
    PE_LINK_NAME1: normalizeOptionalString(
      dto.PE_LINK_NAME1,
      "PE_LINK_NAME1",
      100,
    ),
    PE_LINK_NAME2: normalizeOptionalString(
      dto.PE_LINK_NAME2,
      "PE_LINK_NAME2",
      45,
    ),
    PE_LINK_NAME3: normalizeOptionalString(
      dto.PE_LINK_NAME3,
      "PE_LINK_NAME3",
      45,
    ),
    PE_LINK1: normalizeRequiredString(dto.PE_LINK1, "PE_LINK1", 500),
    PE_LINK2: normalizeOptionalString(dto.PE_LINK2, "PE_LINK2", 45),
    PE_LINK3: normalizeOptionalString(dto.PE_LINK3, "PE_LINK3", 45),
    PE_NOTES: normalizeOptionalString(dto.PE_NOTES, "PE_NOTES", 65535),
  };
}
