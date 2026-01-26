import { eq } from "drizzle-orm";
import { getDb, orders, orderItems, orderItemImages } from "../../db";
import {
  validateOrderInput,
  validateFile,
  validateFilesCount,
} from "../../utils/validation";
import { saveOrderFile } from "../../utils/storage";

export default defineEventHandler(async (event) => {
  // Require authentication
  const session = await getUserSession(event);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: "Authentication required",
    });
  }

  // Parse multipart form data
  const formData = await readMultipartFormData(event);
  if (!formData) {
    throw createError({
      statusCode: 400,
      message: "Invalid form data",
    });
  }

  // Extract order data and files
  let orderData: ReturnType<typeof validateOrderInput> | null = null;
  const filesByItem: Map<number, typeof formData> = new Map();

  for (const part of formData) {
    if (part.name === "data" && part.data) {
      // Parse JSON order data
      try {
        const jsonData = JSON.parse(part.data.toString("utf-8"));
        orderData = validateOrderInput(jsonData);
      } catch (e) {
        if (e instanceof Error && "statusCode" in e) throw e;
        throw createError({
          statusCode: 400,
          message: "Invalid order JSON data",
        });
      }
    } else if (part.name?.startsWith("files[") && part.filename) {
      // Extract item index from field name (e.g., "files[0]" -> 0)
      const match = part.name.match(/^files\[(\d+)\]/);
      if (match && match[1]) {
        const itemIndex = parseInt(match[1], 10);
        if (!filesByItem.has(itemIndex)) {
          filesByItem.set(itemIndex, []);
        }
        filesByItem.get(itemIndex)!.push(part);
      }
    }
  }

  if (!orderData) {
    throw createError({
      statusCode: 400,
      message: "Missing order data",
    });
  }

  // Validate all files before processing
  for (const [itemIndex, files] of filesByItem) {
    validateFilesCount(files, itemIndex);
    for (const file of files) {
      validateFile(file);
    }
  }

  // Calculate total price
  const totalPrice = orderData.items
    .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    .toFixed(2);

  const db = getDb();

  // Create order
  const [order] = await db
    .insert(orders)
    .values({
      userId,
      totalPrice,
      notes: orderData.notes,
    })
    .returning();

  // Create order items and save files
  const createdItems = [];

  for (let i = 0; i < orderData.items.length; i++) {
    const item = orderData.items[i]!;

    const [orderItem] = await db
      .insert(orderItems)
      .values({
        orderId: order!.id,
        productType: item.productType,
        designId: item.designId,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toFixed(2),
        designColor: item.designColor,
        size: item.size,
        productColor: item.productColor,
        name: item.name,
        secondaryText: item.secondaryText,
        specialRequest: item.specialRequest,
      })
      .returning();

    // Save files for this item
    const itemFiles = filesByItem.get(i) || [];
    const savedImages = [];

    for (let sortOrder = 0; sortOrder < itemFiles.length; sortOrder++) {
      const file = itemFiles[sortOrder]!;
      const savedFile = await saveOrderFile(order!.id, orderItem!.id, file);

      const [image] = await db
        .insert(orderItemImages)
        .values({
          orderItemId: orderItem!.id,
          filename: savedFile.filename,
          originalFilename: savedFile.originalFilename,
          mimeType: savedFile.mimeType,
          fileSize: savedFile.fileSize,
          storagePath: savedFile.storagePath,
          sortOrder,
        })
        .returning();

      savedImages.push(image);
    }

    createdItems.push({
      ...orderItem!,
      images: savedImages,
    });
  }

  return {
    success: true,
    order: {
      id: order!.id,
      status: order!.status,
      totalPrice: order!.totalPrice,
      currency: order!.currency,
      notes: order!.notes,
      createdAt: order!.createdAt,
      items: createdItems,
    },
  };
});
