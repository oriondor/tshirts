import type { MultiPartData } from "h3";

export const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg"];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES_PER_ITEM = 6;

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
