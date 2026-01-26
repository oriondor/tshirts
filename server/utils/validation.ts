import type { MultiPartData } from "h3";

export interface OrderItemInput {
  productType: string;
  designId: string;
  quantity: number;
  unitPrice: number;
  designColor?: string;
  size?: string;
  productColor?: string;
  name?: string;
  secondaryText?: string;
  specialRequest?: string;
}

export interface CreateOrderInput {
  items: OrderItemInput[];
  notes?: string;
}

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES_PER_ITEM = 6;

export function validateOrderInput(data: unknown): CreateOrderInput {
  if (!data || typeof data !== "object") {
    throw createError({
      statusCode: 400,
      message: "Invalid order data",
    });
  }

  const input = data as Record<string, unknown>;

  if (!Array.isArray(input.items) || input.items.length === 0) {
    throw createError({
      statusCode: 400,
      message: "Order must have at least one item",
    });
  }

  const validatedItems: OrderItemInput[] = [];

  for (let i = 0; i < input.items.length; i++) {
    const item = input.items[i] as Record<string, unknown>;

    if (!item.productType || typeof item.productType !== "string") {
      throw createError({
        statusCode: 400,
        message: `Item ${i + 1}: productType is required`,
      });
    }

    if (!item.designId || typeof item.designId !== "string") {
      throw createError({
        statusCode: 400,
        message: `Item ${i + 1}: designId is required`,
      });
    }

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw createError({
        statusCode: 400,
        message: `Item ${i + 1}: quantity must be a positive integer`,
      });
    }

    const unitPrice = Number(item.unitPrice);
    if (isNaN(unitPrice) || unitPrice < 0) {
      throw createError({
        statusCode: 400,
        message: `Item ${i + 1}: unitPrice must be a non-negative number`,
      });
    }

    validatedItems.push({
      productType: item.productType,
      designId: item.designId,
      quantity,
      unitPrice,
      designColor:
        typeof item.designColor === "string" ? item.designColor : undefined,
      size: typeof item.size === "string" ? item.size : undefined,
      productColor:
        typeof item.productColor === "string" ? item.productColor : undefined,
      name: typeof item.name === "string" ? item.name : undefined,
      secondaryText:
        typeof item.secondaryText === "string" ? item.secondaryText : undefined,
      specialRequest:
        typeof item.specialRequest === "string"
          ? item.specialRequest
          : undefined,
    });
  }

  return {
    items: validatedItems,
    notes: typeof input.notes === "string" ? input.notes : undefined,
  };
}

export function validateFile(file: MultiPartData): void {
  if (!file.type || !ALLOWED_MIME_TYPES.includes(file.type)) {
    throw createError({
      statusCode: 400,
      message: `Invalid file type: ${file.type}. Only PNG and JPEG are allowed.`,
    });
  }

  if (!file.data || file.data.length > MAX_FILE_SIZE) {
    throw createError({
      statusCode: 400,
      message: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    });
  }
}

export function validateFilesCount(
  files: MultiPartData[],
  itemIndex: number,
): void {
  if (files.length > MAX_FILES_PER_ITEM) {
    throw createError({
      statusCode: 400,
      message: `Item ${itemIndex + 1}: Maximum ${MAX_FILES_PER_ITEM} files allowed per item.`,
    });
  }
}

export { ALLOWED_MIME_TYPES, MAX_FILE_SIZE, MAX_FILES_PER_ITEM };
