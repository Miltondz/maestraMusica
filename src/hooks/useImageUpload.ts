import { useState } from 'react';
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export interface UseImageUploadOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
  bucket?: string;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateUploadUrl = useMutation(api.mediaUploads.generateUploadUrl);
  const saveImage = useMutation(api.mediaUploads.saveImage);

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      setProgress(10);

      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      // Step 1: Get a short-lived upload URL from Convex
      const postUrl = await generateUploadUrl();
      setProgress(30);

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`);
      }

      const { storageId } = await result.json();
      setProgress(70);

      // Step 3: Save the storageId in our database (optional metadata)
      const url = await saveImage({ storageId });
      if (!url) {
        throw new Error('Failed to generate image URL');
      }
      setProgress(90);

      // Step 4: For immediate use in the UI, we might need a public URL
      const imageUrl = url;

      setProgress(100);
      options.onSuccess?.(imageUrl);
      return imageUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      options.onError?.(errorMessage);
      throw error;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return {
    uploadImage,
    uploading,
    progress
  };
}
