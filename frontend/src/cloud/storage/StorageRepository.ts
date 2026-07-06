/**
 * Cloud Storage repository placeholder (Phase 6B+).
 */

export interface StorageUploadResult {
  path: string;
  downloadUrl: string;
}

export interface StorageRepository {
  uploadFile(path: string, blob: Blob | Uint8Array, contentType: string): Promise<StorageUploadResult>;
  getDownloadUrl(path: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
}
