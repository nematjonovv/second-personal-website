import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

const MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;

export async function imageToWebp(buffer: Buffer, folder: string): Promise<string> {
  const fileName = `${randomUUID()}.webp`;
  const targetDir = path.join(UPLOAD_DIR, folder);

  await fs.mkdir(targetDir, { recursive: true });
  await sharp(buffer)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(path.join(targetDir, fileName));

  return `/uploads/${folder}/${fileName}`;
}

export async function removeUpload(publicPath: string): Promise<void> {
  if (!publicPath.startsWith("/uploads/")) {
    return;
  }

  const absolutePath = path.resolve(UPLOAD_DIR, publicPath.slice("/uploads/".length));
  if (!absolutePath.startsWith(UPLOAD_DIR + path.sep)) {
    return;
  }

  await fs.rm(absolutePath, { force: true });
}

export async function removeUploads(publicPaths: string[]): Promise<void> {
  await Promise.all(publicPaths.map(removeUpload));
}
