/**
 * Firebase utilities export
 */

export { storage, default as app } from "./config";
export {
  uploadImage,
  uploadBase64Image,
  deleteImage,
  isFirebaseStorageUrl,
  validateImageFile,
} from "./storage";
