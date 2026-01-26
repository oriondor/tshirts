import { mkdir, writeFile, readFile, stat } from "fs/promises";
import { join, extname } from "path";
import { randomUUID } from "crypto";
import type { MultiPartData } from "h3";

const UPLOADS_BASE_DIR = "./uploads/orders";

function getExtensionFromMime(mimeType: string): string {
  const map: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
  };
  return map[mimeType] || ".bin";
}

export interface SavedFile {
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  storagePath: string;
}

export async function saveOrderFile(
  orderId: string,
  orderItemId: string,
  file: MultiPartData,
): Promise<SavedFile> {
  const ext = getExtensionFromMime(file.type || "");
  const filename = `${randomUUID()}${ext}`;
  const relativePath = join(orderId, orderItemId);
  const fullDir = join(UPLOADS_BASE_DIR, relativePath);
  const storagePath = join(relativePath, filename);
  const fullPath = join(UPLOADS_BASE_DIR, storagePath);

  // Ensure directory exists
  await mkdir(fullDir, { recursive: true });

  // Write file
  await writeFile(fullPath, file.data);

  return {
    filename,
    originalFilename: file.filename || "unknown",
    mimeType: file.type || "application/octet-stream",
    fileSize: file.data.length,
    storagePath,
  };
}

export async function getOrderFile(
  storagePath: string,
): Promise<{ data: Buffer; mimeType: string } | null> {
  try {
    // Sanitize path - ensure it doesn't escape uploads directory
    const sanitizedPath = storagePath.replace(/\.\./g, "").replace(/\/+/g, "/");
    const fullPath = join(UPLOADS_BASE_DIR, sanitizedPath);

    // Verify the resolved path is still within uploads directory
    const resolvedPath = join(process.cwd(), fullPath);
    const uploadsDir = join(process.cwd(), UPLOADS_BASE_DIR);
    if (!resolvedPath.startsWith(uploadsDir)) {
      return null;
    }

    const data = await readFile(fullPath);
    const ext = extname(fullPath).toLowerCase();
    const mimeType =
      ext === ".png"
        ? "image/png"
        : ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : "application/octet-stream";

    return { data, mimeType };
  } catch {
    return null;
  }
}

export async function fileExists(storagePath: string): Promise<boolean> {
  try {
    const sanitizedPath = storagePath.replace(/\.\./g, "").replace(/\/+/g, "/");
    const fullPath = join(UPLOADS_BASE_DIR, sanitizedPath);
    await stat(fullPath);
    return true;
  } catch {
    return false;
  }
}
