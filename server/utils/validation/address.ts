export interface AddressInput {
  recipientName: string;
  phone?: string;
  street: string;
  streetNumber: string;
  additionalInfo?: string;
  postalCode: string;
  city: string;
  country?: string;
  label?: string;
  isDefault?: boolean;
}

export function validateAddressInput(data: unknown): AddressInput {
  if (!data || typeof data !== "object") {
    throw createError({
      statusCode: 400,
      message: "Invalid address data",
    });
  }

  const input = data as Record<string, unknown>;

  // Required fields
  if (!input.recipientName || typeof input.recipientName !== "string") {
    throw createError({
      statusCode: 400,
      message: "Recipient name is required",
    });
  }

  if (!input.street || typeof input.street !== "string") {
    throw createError({
      statusCode: 400,
      message: "Street is required",
    });
  }

  if (!input.streetNumber || typeof input.streetNumber !== "string") {
    throw createError({
      statusCode: 400,
      message: "Street number is required",
    });
  }

  if (!input.postalCode || typeof input.postalCode !== "string") {
    throw createError({
      statusCode: 400,
      message: "Postal code is required",
    });
  }

  if (!input.city || typeof input.city !== "string") {
    throw createError({
      statusCode: 400,
      message: "City is required",
    });
  }

  return {
    recipientName: input.recipientName.trim(),
    phone: typeof input.phone === "string" ? input.phone.trim() : undefined,
    street: input.street.trim(),
    streetNumber: input.streetNumber.trim(),
    additionalInfo:
      typeof input.additionalInfo === "string"
        ? input.additionalInfo.trim()
        : undefined,
    postalCode: input.postalCode.trim(),
    city: input.city.trim(),
    country:
      typeof input.country === "string" ? input.country.trim() : "Germany",
    label: typeof input.label === "string" ? input.label.trim() : undefined,
    isDefault: typeof input.isDefault === "boolean" ? input.isDefault : false,
  };
}
