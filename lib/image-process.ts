import sharp from "sharp";
import { randomBytes } from "crypto";
import { uploadToR2, deleteFromR2, getKeyFromUrl } from "./r2";
type SharpInstance = ReturnType<typeof sharp>;
export interface ProcessedImage {
  previewUrl: string;
  originalUrl: string;
  largeUrl: string;
  mediumUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;
  format: string;
}

type Fit = {
  width: number;
  height: number;
  fit: "inside";
  withoutEnlargement: true;
};
const box = (n: number): Fit => ({
  width: n,
  height: n,
  fit: "inside",
  withoutEnlargement: true,
});

const FORMATS: Record<string, { ext: string; mime: string }> = {
  jpeg: { ext: "jpeg", mime: "image/jpeg" },
  png: { ext: "png", mime: "image/png" },
  webp: { ext: "webp", mime: "image/webp" },
};

export async function processAndUploadImage(
  fileBuffer: Buffer,
): Promise<ProcessedImage> {
  const basePath = `images/${randomBytes(16).toString("hex")}`;

  const meta = await sharp(fileBuffer).metadata();
  const format = meta.format && FORMATS[meta.format] ? meta.format : "jpeg";
  const { ext, mime } = FORMATS[format];

  // EXIF অনুযায়ী ছবি ঘোরানো থাকলে (orientation 5-8) width/height উল্টে যায়
  const rotated = (meta.orientation ?? 1) >= 5;
  const width = (rotated ? meta.height : meta.width) || 0;
  const height = (rotated ? meta.width : meta.height) || 0;

  // রিসাইজ করা ছবির পাইপলাইন (rotate() দিয়ে সঠিক দিক নিশ্চিত)
  const resize = (n: number) => sharp(fileBuffer).rotate().resize(box(n));

  // ডাউনলোডের জন্য: আসল ফরম্যাটে
  const toOriginalFormat = (p: SharpInstance, quality: number) =>
    format === "png"
      ? p.png({ compressionLevel: 9 }).toBuffer()
      : format === "webp"
        ? p.webp({ quality }).toBuffer()
        : p.jpeg({ quality, mozjpeg: true }).toBuffer();

  // ওয়েবসাইটে দেখানোর জন্য: সবসময় WebP (ছোট ফাইল, দ্রুত লোড)
  const toWebp = (p: SharpInstance, quality: number) =>
    p.webp({ quality }).toBuffer();

  const [largeBuffer, previewBuffer, mediumBuffer, thumbnailBuffer] =
    await Promise.all([
      toOriginalFormat(resize(1920), 85),
      toWebp(resize(1600), 80),
      toWebp(resize(1000), 80),
      toWebp(resize(400), 75),
    ]);

  const [originalUrl, largeUrl, previewUrl, mediumUrl, thumbnailUrl] =
    await Promise.all([
      uploadToR2(`${basePath}/original.${ext}`, fileBuffer, mime), // হুবহু অরিজিনাল, কোনো রি-এনকোড নয়
      uploadToR2(`${basePath}/large.${ext}`, largeBuffer, mime),
      uploadToR2(`${basePath}/preview.webp`, previewBuffer, "image/webp"),
      uploadToR2(`${basePath}/medium.webp`, mediumBuffer, "image/webp"),
      uploadToR2(`${basePath}/thumbnail.webp`, thumbnailBuffer, "image/webp"),
    ]);

  return {
    originalUrl,
    largeUrl,
    mediumUrl,
    thumbnailUrl,
    previewUrl,
    width,
    height,
    size: fileBuffer.length,
    format: ext,
  };
}

export async function deleteImageVersions(urls: {
  originalUrl: string;
  largeUrl: string;
  mediumUrl: string;
  thumbnailUrl: string;
  previewUrl?: string;
}) {
  const all = [
    urls.originalUrl,
    urls.largeUrl,
    urls.mediumUrl,
    urls.thumbnailUrl,
    urls.previewUrl,
  ];
  await Promise.all(
    all
      .filter((u): u is string => !!u)
      .map((u) => deleteFromR2(getKeyFromUrl(u))),
  );
}
