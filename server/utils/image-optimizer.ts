import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

interface ImageOptimizationOptions {
  quality?: number;
  maxWidth?: number;
  format?: "webp" | "jpeg" | "png";
}

export async function optimizeImage(
  inputPath: string,
  outputPath: string,
  options: ImageOptimizationOptions = {}
): Promise<void> {
  const { quality = 80, maxWidth = 1920, format = "webp" } = options;

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    let pipeline = image;

    // Resize if image is larger than maxWidth
    if (metadata.width && metadata.width > maxWidth) {
      pipeline = pipeline.resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: "inside",
      });
    }

    // Convert to specified format
    if (format === "webp") {
      pipeline = pipeline.webp({ quality });
    } else if (format === "jpeg") {
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
    } else if (format === "png") {
      pipeline = pipeline.png({ quality, compressionLevel: 9 });
    }

    await pipeline.toFile(outputPath);
  } catch (error) {
    console.error(`Error optimizing image ${inputPath}:`, error);
    throw error;
  }
}

export async function generateBlurDataURL(imagePath: string): Promise<string> {
  try {
    const buffer = await sharp(imagePath)
      .resize(10, 10, { fit: "inside" })
      .blur()
      .webp({ quality: 20 })
      .toBuffer();

    return `data:image/webp;base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.error(`Error generating blur data URL for ${imagePath}:`, error);
    return "";
  }
}

export async function generateResponsiveImages(
  inputPath: string,
  outputDir: string,
  sizes: number[] = [640, 750, 828, 1080, 1200, 1920]
): Promise<{ [key: number]: string }> {
  const results: { [key: number]: string } = {};
  const ext = path.extname(inputPath);
  const basename = path.basename(inputPath, ext);

  await fs.mkdir(outputDir, { recursive: true });

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `${basename}-${size}w.webp`);
    await optimizeImage(inputPath, outputPath, {
      maxWidth: size,
      format: "webp",
      quality: 80,
    });
    results[size] = outputPath;
  }

  return results;
}
