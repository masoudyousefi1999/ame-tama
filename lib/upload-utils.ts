import { customFetch } from "./utils";

export interface UploadedMedia {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  fileExtension: string;
  mediaType: number;
  fileSize: number;
  url: string;
}

export enum MediaType {
  PRODUCT = 'product',
  BLOG = 'blog',
  TOPIC = 'topic',
  CATEGORY = 'category',
  TAG = 'tag',
  USER = 'user',
  ART_WORK = 'artwork',
}


export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Upload a single file to the server
 * @param file - The file to upload
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with uploaded media info
 */
export async function uploadFile(
  file: File,
  type: MediaType 
): Promise<UploadedMedia> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  try {
    const response = await customFetch("/upload", {
      method: "POST",
      body: formData,
      // Don't set Content-Type header, let browser set it with boundary
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to upload file");
    }

    const data: UploadedMedia = await response.json();
    return data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

/**
 * Upload multiple files to the server
 * @param files - Array of files to upload
 * @param onProgress - Optional callback for overall progress
 * @returns Promise with array of uploaded media info
 */
export async function uploadFiles(
  files: File[],
  type: MediaType,
  onProgress?: (current: number, total: number) => void
): Promise<UploadedMedia[]> {
  const results: UploadedMedia[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.(i + 1, files.length);

    try {
      const result = await uploadFile(file,type);
      results.push(result);
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
      throw error;
    }
  }

  return results;
}

/**
 * Attach media to a product
 * @param productId - UUID of the product
 * @param mediaId - UUID of the uploaded media
 * @param order - Display order of the media
 * @param isDefault - Whether this is the default/primary image
 * @returns Promise with boolean indicating success
 */
export async function attachMediaToProduct(
  productId: string,
  mediaId: string,
  order: number = 0,
  isDefault: boolean = false
): Promise<boolean> {
  try {
    const response = await customFetch("/product/media", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        infos: {
          mediaId,
          order,
          isDefault,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to attach media to product");
    }

    const result = await response.json();
    return result === true || result.success === true;
  } catch (error) {
    console.error("Attach media error:", error);
    throw error;
  }
}

/**
 * Validate file before upload
 * @param file - File to validate
 * @param options - Validation options
 * @returns Object with isValid and error message
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[]; // MIME types
  } = {}
): { isValid: boolean; error?: string } {
  const maxSize = options.maxSize || 5 * 1024 * 1024; // Default 5MB
  const allowedTypes = options.allowedTypes || [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `فرمت فایل مجاز نیست. فرمت‌های مجاز: ${allowedTypes.join(", ")}`,
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `حجم فایل نباید بیشتر از ${(maxSize / 1024 / 1024).toFixed(
        0
      )} مگابایت باشد`,
    };
  }

  return { isValid: true };
}
