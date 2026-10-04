import sharp from "sharp";
import { randomBytes } from "crypto";
import { uploadToR2, deleteFromR2, getKeyFromUrl } from "./r2";

export interface ProcessedImage {
  originalUrl: string;
  largeUrl: string;
  mediumUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;
  format: string;
}

export async function processAndUploadImage(fileBuffer: Buffer): Promise<ProcessedImage> {
  const uniqueId = randomBytes(16).toString("hex");
  const basePath = `images/${uniqueId}`;

  const metadata = await sharp(fileBuffer).metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;
  const size = fileBuffer.length;

  const originalBuffer = await sharp(fileBuffer).webp({ quality: 90 }).toBuffer();
  const largeBuffer = await sharp(fileBuffer)
    .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
  const mediumBuffer = await sharp(fileBuffer)
    .resize({ width: 1000, height: 1000, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  const thumbnailBuffer = await sharp(fileBuffer)
    .resize({ width: 400, height: 400, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 75 })
    .toBuffer();

  const [originalUrl, largeUrl, mediumUrl, thumbnailUrl] = await Promise.all([
    uploadToR2(`${basePath}/original.webp`, originalBuffer, "image/webp"),
    uploadToR2(`${basePath}/large.webp`, largeBuffer, "image/webp"),
    uploadToR2(`${basePath}/medium.webp`, mediumBuffer, "image/webp"),
    uploadToR2(`${basePath}/thumbnail.webp`, thumbnailBuffer, "image/webp"),
  ]);

  return {
    originalUrl,
    largeUrl,
    mediumUrl,
    thumbnailUrl,
    width,
    height,
    size,
    format: "webp",
  };
}

export async function deleteImageVersions(urls: {
  originalUrl: string;
  largeUrl: string;
  mediumUrl: string;
  thumbnailUrl: string;
}) {
  const keys = [
    getKeyFromUrl(urls.originalUrl),
    getKeyFromUrl(urls.largeUrl),
    getKeyFromUrl(urls.mediumUrl),
    getKeyFromUrl(urls.thumbnailUrl),
  ];
  await Promise.all(keys.map((key) => deleteFromR2(key)));
}