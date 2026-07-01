// ============================================================
// src/components/chat/useUploadImages.ts
// Custom hook: Upload ảnh lên Firebase Storage
// ============================================================

import { useState, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

export interface UploadProgress {
  file: File;
  progress: number;
  url?: string;
  error?: string;
}

export function useUploadImages() {
  const [uploading, setUploading] = useState(false);

  /**
   * Upload nhiều file ảnh lên Firebase Storage bucket
   * Path: chat-attachments/{roomId}/{timestamp}_{filename}
   */
  const uploadImages = useCallback(async (
    files: File[],
    roomId: string
  ): Promise<string[]> => {
    if (!files.length) return [];

    // Kiểm tra storage có khả dụng không
    if (!storage) {
      console.warn('[useUploadImages] Firebase Storage không khả dụng. Bỏ qua upload ảnh.');
      return [];
    }

    setUploading(true);
    const urls: string[] = [];

    try {
      const uploadPromises = files.map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} không phải ảnh.`);
        }
        // Validate size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File ${file.name} quá lớn (tối đa 10MB).`);
        }

        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-z0-9._-]/gi, '_');
        const path = `chat-attachments/${roomId}/${timestamp}_${safeName}`;
        const storageRef = ref(storage, path);

        return new Promise<string>((resolve, reject) => {
          const task = uploadBytesResumable(storageRef, file, {
            contentType: file.type,
          });

          task.on(
            'state_changed',
            null,
            (error) => reject(error),
            async () => {
              try {
                const url = await getDownloadURL(task.snapshot.ref);
                resolve(url);
              } catch (e) {
                reject(e);
              }
            }
          );
        });
      });

      const results = await Promise.allSettled(uploadPromises);
      results.forEach((r) => {
        if (r.status === 'fulfilled') urls.push(r.value);
        else console.error('[useUploadImages] Upload lỗi:', r.reason);
      });
    } finally {
      setUploading(false);
    }

    return urls;
  }, []);

  /**
   * Chuyển File thành base64 Data URL để preview trong UI
   */
  const createPreviewUrl = useCallback((file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }, []);

  return { uploadImages, uploading, createPreviewUrl };
}
