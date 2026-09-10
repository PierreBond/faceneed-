import React, { useState, useCallback } from 'react';
import { ApiService } from '../services/api';

interface ImageUploaderProps {
  onImagesChange: (images: string[]) => void;
  initialImages?: string[];
  maxImages?: number;
  accept?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesChange,
  initialImages = [],
  maxImages = 10,
  accept = 'image/*',
}) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const remainingSlots = maxImages - images.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (filesToUpload.length !== files.length) {
      alert(`Maximum ${maxImages} images allowed. ${files.length - remainingSlots} files were ignored.`);
    }

    setUploading(true);
    setProgress({});

    try {
      // Get presigned URLs from backend
      const fileInfos = filesToUpload.map(f => ({
        filename: f.name,
        content_type: f.type,
      }));

      const { upload_urls } = await ApiService.admin.products.getUploadUrls('temp', fileInfos);
      
      const uploadedUrls: string[] = [];

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        const { upload_url, file_url } = upload_urls[i];
        
        setProgress(prev => ({ ...prev, [file.name]: 0 }));

        // Upload directly to storage
        await fetch(upload_url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(prev => ({ ...prev, [file.name]: percent }));
            }
          },
        } as any);

        uploadedUrls.push(file_url);
        setProgress(prev => ({ ...prev, [file.name]: 100 }));
      }

      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      onImagesChange(newImages);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      setProgress({});
    }
  }, [images, maxImages, onImagesChange]);

  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const reorderImages = useCallback((fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    setImages(newImages);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Product Images ({images.length}/{maxImages})
      </label>

      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          uploading ? 'border-primary/50 bg-primary/5' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
        }`}
      >
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          disabled={uploading || images.length >= maxImages}
          className="hidden"
          id="image-uploader"
        />
        <label 
          htmlFor="image-uploader"
          className="cursor-pointer"
        >
          <div className="flex flex-col items-center gap-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {uploading ? 'Uploading...' : 'Drag & drop images here'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {uploading 
                  ? 'Please wait...' 
                  : `Click to select up to ${maxImages - images.length} images (PNG, JPG, WebP)`}
              </p>
            </div>
          </div>
        </label>

        {uploading && (
          <div className="mt-4 space-y-2">
            {Object.entries(progress).map(([filename, percent]) => (
              <div key={filename} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 dark:text-gray-300 truncate max-w-xs">{filename}</span>
                  <span className="font-medium">{percent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="relative aspect-square group"
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <img 
                  src={image} 
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 w-7 h-7 bg-red-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  aria-label="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                  {index + 1}
                </span>
              </div>
              {/* Drag handle for reordering */}
              <div className="absolute top-1 left-1 w-7 h-7 bg-gray-900/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-grab active:cursor-grabbing">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length >= maxImages && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Maximum number of images reached
        </p>
      )}
    </div>
  );
};