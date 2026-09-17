import imageCompression from "browser-image-compression";

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
  initialQuality?: number;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxSizeMB: 0.4, // Target ~300-400KB max
  maxWidthOrHeight: 1600, // Max 1600px width/height for responsive luxury fidelity
  useWebWorker: true,
  fileType: "image/webp",
  initialQuality: 0.8,
};

/**
 * Compresses an image client-side before uploading to Supabase Storage.
 * Converts raster images (JPEG, PNG, WebP) to optimized WebP.
 * Bypasses SVGs and GIFs to preserve vector scalability and frame animation.
 */
export async function compressImage(
  file: File,
  customOptions?: Partial<CompressionOptions>
): Promise<File> {
  // If not in browser, return original file
  if (typeof window === "undefined") {
    return file;
  }

  // Preserve vector and animated formats
  const fileType = file.type.toLowerCase();
  if (fileType.includes("svg") || fileType.includes("gif")) {
    return file;
  }

  try {
    const options = {
      ...DEFAULT_OPTIONS,
      ...customOptions,
    };

    const compressedBlob = await imageCompression(file, options);

    // Format new filename with .webp extension if converted
    const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const newFileName = `${originalNameWithoutExt}.webp`;

    return new File([compressedBlob], newFileName, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } catch (error) {
    console.warn("Client-side image compression bypassed or failed, using original file:", error);
    return file;
  }
}
