import { useState } from 'react';
import { pb } from '../services/pocketbase';

export interface UseImageUploadOptions {
  bucket?: string;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      setProgress(0);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // 1. Read file for preview/progress simulation
      await new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve();
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress((event.loaded / event.total) * 30);
          }
        };
        reader.readAsArrayBuffer(file);
      });

      setProgress(50);

      // 2. Upload to PocketBase
      // Assumes a collection named 'media_uploads' exists with a 'file' field.
      // You can also use other collections like 'blog_posts' if the file is attached directly, 
      // but this hook seems generic.
      const formData = new FormData();
      formData.append('file', file);
      
      // Optional: Add metadata if needed, e.g. base64Data or fileName, 
      // but PB handles fileName automatically from the File object.

      const record = await pb.collection('media_uploads').create(formData);
      
      setProgress(100);
      
      // 3. Get URL
      // pb.files.getUrl(record, filename)
      const imageUrl = pb.files.getUrl(record, record.file);
      
      options.onSuccess?.(imageUrl);
      
      return imageUrl;
    } catch (error) {
      console.error(error); // Debugging
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      options.onError?.(errorMessage);
      throw error;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000); // Reset progress after delay
    }
  };

  return {
    uploadImage,
    uploading,
    progress
  };
}