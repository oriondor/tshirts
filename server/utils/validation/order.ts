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
  addressId?: string;
}

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
    addressId: typeof input.addressId === "string" ? input.addressId : undefined,
  };
}
