/**
 * Firebase Storage Utilities
 * Handle image uploads to Firebase Storage
 */

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./config";

/**
 * Upload an image file to Firebase Storage
 * @param file - The image file to upload
 * @param path - Optional path within storage (default: 'blog-images')
 * @returns Promise with the download URL
 */
export async function uploadImage(
  file: File,
  path: string = "blog-images"
): Promise<string> {
  try {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const storageRef = ref(storage, `${path}/${fileName}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
}

/**
 * Upload an image from base64 string
 * @param base64String - Base64 encoded image string
 * @param path - Optional path within storage (default: 'blog-images')
 * @returns Promise with the download URL
 */
export async function uploadBase64Image(
  base64String: string,
  path: string = "blog-images"
): Promise<string> {
  try {
    // Extract the base64 data
    const matches = base64String.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      throw new Error("Invalid base64 string");
    }

    const contentType = matches[1];
    const base64Data = matches[2];

    // Convert base64 to blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: contentType });

    // Generate unique filename
    const timestamp = Date.now();
    const extension = contentType.split("/")[1] || "jpg";
    const fileName = `${timestamp}-upload.${extension}`;
    const storageRef = ref(storage, `${path}/${fileName}`);

    // Upload blob
    const snapshot = await uploadBytes(storageRef, blob, {
      contentType: contentType,
    });

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading base64 image:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
}

/**
 * Delete an image from Firebase Storage using its URL
 * @param imageUrl - The full Firebase Storage URL
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract the path from the URL
    const urlParts = imageUrl.split("/o/")[1]?.split("?")[0];
    if (!urlParts) {
      throw new Error("Invalid Firebase Storage URL");
    }

    const imagePath = decodeURIComponent(urlParts);
    const imageRef = ref(storage, imagePath);

    // Delete the file
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    // Don't throw error for delete failures - it's not critical
  }
}

/**
 * Check if a URL is a Firebase Storage URL
 * @param url - The URL to check
 * @returns boolean
 */
export function isFirebaseStorageUrl(url: string): boolean {
  return (
    url.includes("firebasestorage.googleapis.com") ||
    url.includes("storage.googleapis.com")
  );
}

/**
 * Validate image file type and size
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5)
 * @returns Error message if invalid, null if valid
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 5
): string | null {
  // Check file type
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return "Please upload a valid image file (JPG, PNG, GIF, or WebP)";
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `Image size must be less than ${maxSizeMB}MB`;
  }

  return null;
}
