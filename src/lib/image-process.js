import sharp from "sharp";

const SIZES = { large: 1920, medium: 1000, thumbnail: 400 };
const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

// original + large + medium + thumbnail (WebP) — মোট ৪টা ভার্সন
export async function processImage(input, mime) {
  const { info } = await sharp(input).rotate().toBuffer({ resolveWithObject: true });

  const variants = await Promise.all(
    Object.entries(SIZES).map(async ([name, max]) => ({
      name,
      ext: "webp",
      type: "image/webp",
      buffer: await sharp(input)
        .rotate()
        .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
        .webp({ quality: name === "thumbnail" ? 75 : 82 })
        .toBuffer(),
    }))
  );
  variants.unshift({ name: "original", ext: EXT[mime] || "jpg", type: mime, buffer: input });

  return { width: info.width, height: info.height, size: input.length, variants };
}
