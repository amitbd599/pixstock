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

export async function processAndUploadImage(
  fileBuffer: Buffer,
): Promise<ProcessedImage> {
  const uniqueId = randomBytes(16).toString("hex");
  const basePath = `images/${uniqueId}`;

  const metadata = await sharp(fileBuffer).metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;
  const size = fileBuffer.length;

  // ১. আসল ফরম্যাটটি বের করে নিন (jpeg, png, webp, etc.)
  const originalFormat = metadata.format || "jpeg";

  // ২. ফরম্যাট অনুযায়ী এক্সটেনশন এবং MIME টাইপ সেট করুন
  let extension = originalFormat;
  let mimeType = `image/${originalFormat}`;

  if (originalFormat === "jpeg") {
    extension = "jpg";
    mimeType = "image/jpeg";
  } else if (originalFormat === "png") {
    extension = "png";
    mimeType = "image/png";
  } else if (originalFormat === "webp") {
    extension = "webp";
    mimeType = "image/webp";
  }

  // ৩. একটি হেল্পার ফাংশন তৈরি করুন যা ডায়নামিকভাবে বাফার তৈরি করবে
  const processBuffer = async (
    resizeOptions?: sharp.ResizeOptions,
    quality: number = 85,
  ) => {
    let pipeline = sharp(fileBuffer);

    if (resizeOptions) {
      pipeline = pipeline.resize(resizeOptions);
    }

    // ফরম্যাট অনুযায়ী কনভার্ট করুন
    if (originalFormat === "jpeg") {
      return await pipeline.jpeg({ quality }).toBuffer();
    } else if (originalFormat === "png") {
      // PNG এর জন্য quality কাজ করে না, এটি lossless কম্প্রেশন ব্যবহার করে
      return await pipeline.png({ compressionLevel: 9 }).toBuffer();
    } else if (originalFormat === "webp") {
      return await pipeline.webp({ quality }).toBuffer();
    } else {
      // অন্য কোনো ফরম্যাট হলে (যেমন gif, tiff) সেটি জেপিজিতে কনভার্ট করে ফেলুন
      return await pipeline.jpeg({ quality }).toBuffer();
    }
  };

  // ৪. ডায়নামিক ফরম্যাটে বাফার তৈরি করুন
  const originalBuffer = await processBuffer(undefined, 90);

  const largeBuffer = await processBuffer(
    { width: 1920, height: 1920, fit: "inside", withoutEnlargement: true },
    85,
  );

  const mediumBuffer = await processBuffer(
    { width: 1000, height: 1000, fit: "inside", withoutEnlargement: true },
    80,
  );

  const thumbnailBuffer = await processBuffer(
    { width: 400, height: 400, fit: "inside", withoutEnlargement: true },
    75,
  );

  // ৫. R2 তে আপলোড করার সময় ডায়নামিক এক্সটেনশন এবং MIME টাইপ ব্যবহার করুন
  const [originalUrl, largeUrl, mediumUrl, thumbnailUrl] = await Promise.all([
    uploadToR2(`${basePath}/original.${extension}`, originalBuffer, mimeType),
    uploadToR2(`${basePath}/large.${extension}`, largeBuffer, mimeType),
    uploadToR2(`${basePath}/medium.${extension}`, mediumBuffer, mimeType),
    uploadToR2(`${basePath}/thumbnail.${extension}`, thumbnailBuffer, mimeType),
  ]);

  return {
    originalUrl,
    largeUrl,
    mediumUrl,
    thumbnailUrl,
    width,
    height,
    size,
    format: extension, // ডেটাবেজে সেভ করার জন্য আসল ফরম্যাট
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
