"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";

interface ImageUploadProps {
  onFilesSelected: (files: File[]) => void;
  onExistingImagesChange?: (images: string[]) => void; // For reordering existing images
  multiple?: boolean;
  maxImages?: number;
  existingImages?: string[]; // For editing mode - existing images from R2
  onRemoveExisting?: (imageUrl: string, index: number) => void;
}

export default function ImageUpload({
  onFilesSelected,
  onExistingImagesChange,
  multiple = false,
  maxImages = 4,
  existingImages = [],
  onRemoveExisting,
}: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [optimizing, setOptimizing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedType, setDraggedType] = useState<'existing' | 'new' | null>(null);
  const [localExistingImages, setLocalExistingImages] = useState<string[]>(existingImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync local existing images with prop changes
  useEffect(() => {
    setLocalExistingImages(existingImages);
  }, [existingImages]);

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  const handleImageOptimization = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: file.type,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      return file;
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setOptimizing(true);
    const fileArray = Array.from(files).slice(0, maxImages - selectedFiles.length - localExistingImages.length);

    try {
      const optimizedFiles = await Promise.all(
        fileArray.map((file) => handleImageOptimization(file))
      );

      const newPreviewUrls = optimizedFiles.map((file) => URL.createObjectURL(file));

      const updatedFiles = [...selectedFiles, ...optimizedFiles];
      const updatedPreviews = [...previewUrls, ...newPreviewUrls];

      setSelectedFiles(updatedFiles);
      setPreviewUrls(updatedPreviews);
      onFilesSelected(updatedFiles);
    } catch (error) {
      console.error("Error processing images:", error);
      alert("Failed to process images. Please try again.");
    } finally {
      setOptimizing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    if (previewUrls[index] && previewUrls[index].startsWith('blob:')) {
      URL.revokeObjectURL(previewUrls[index]);
    }

    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);

    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
    onFilesSelected(newFiles);
  };

  // Drag handlers for reordering
  const handleDragStart = (index: number, type: 'existing' | 'new') => {
    setDraggedIndex(index);
    setDraggedType(type);
  };

  const handleDragOver = (e: React.DragEvent, index: number, type: 'existing' | 'new') => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDropReorder = (e: React.DragEvent, dropIndex: number, dropType: 'existing' | 'new') => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedIndex === null || draggedType === null) return;

    // Reorder existing images
    if (draggedType === 'existing' && dropType === 'existing') {
      const newImages = [...localExistingImages];
      const [removed] = newImages.splice(draggedIndex, 1);
      newImages.splice(dropIndex, 0, removed);
      setLocalExistingImages(newImages);
      if (onExistingImagesChange) {
        onExistingImagesChange(newImages);
      }
    }
    // Reorder new files
    else if (draggedType === 'new' && dropType === 'new') {
      // Ensure we have matching arrays
      if (selectedFiles.length !== previewUrls.length) {
        console.error('Mismatch between files and preview URLs');
        return;
      }
      
      const newFiles = [...selectedFiles];
      const newPreviews = [...previewUrls];
      
      // Remove from original position
      const [removedFile] = newFiles.splice(draggedIndex, 1);
      const [removedPreview] = newPreviews.splice(draggedIndex, 1);
      
      // Insert at new position
      newFiles.splice(dropIndex, 0, removedFile);
      newPreviews.splice(dropIndex, 0, removedPreview);
      
      // Update state together to prevent desync
      setSelectedFiles(newFiles);
      setPreviewUrls(newPreviews);
      onFilesSelected(newFiles);
    }
    // Move existing to new position (convert to new)
    else if (draggedType === 'existing' && dropType === 'new') {
      // This would require converting URL to File, which is complex
      // For now, just reorder within same type
    }
    // Move new to existing position
    else if (draggedType === 'new' && dropType === 'existing') {
      // This would require uploading first, which defeats the purpose
      // For now, just reorder within same type
    }

    setDraggedIndex(null);
    setDraggedType(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDraggedType(null);
  };

  const setAsMain = (index: number, type: 'existing' | 'new') => {
    if (type === 'existing') {
      const newImages = [...localExistingImages];
      const [removed] = newImages.splice(index, 1);
      newImages.unshift(removed);
      setLocalExistingImages(newImages);
      if (onExistingImagesChange) {
        onExistingImagesChange(newImages);
      }
    } else {
      const newFiles = [...selectedFiles];
      const newPreviews = [...previewUrls];
      const [removedFile] = newFiles.splice(index, 1);
      const [removedPreview] = newPreviews.splice(index, 1);
      newFiles.unshift(removedFile);
      newPreviews.unshift(removedPreview);
      setSelectedFiles(newFiles);
      setPreviewUrls(newPreviews);
      onFilesSelected(newFiles);
    }
  };

  const totalImages = localExistingImages.length + selectedFiles.length;

  return (
    <div className="space-y-4">
      {/* All Images Combined (for reordering) */}
      {(localExistingImages.length > 0 || selectedFiles.length > 0) && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Images (drag to reorder, first image is main):
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Existing Images */}
            {localExistingImages.map((imgUrl, index) => (
              <div
                key={`existing-${index}`}
                draggable
                onDragStart={() => handleDragStart(index, 'existing')}
                onDragOver={(e) => handleDragOver(e, index, 'existing')}
                onDrop={(e) => handleDropReorder(e, index, 'existing')}
                onDragEnd={handleDragEnd}
                className={`relative group cursor-move ${
                  draggedIndex === index && draggedType === 'existing' ? 'opacity-50' : ''
                }`}
              >
                <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-300">
                  <Image
                    src={imgUrl}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                    loading={index < 4 ? "eager" : "lazy"}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-primary-red text-white text-xs px-2 py-1 rounded font-bold">
                      MAIN
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => setAsMain(index, 'existing')}
                        className="bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
                        title="Set as main image"
                      >
                        ⭐ Main
                      </button>
                    )}
                    {onRemoveExisting && (
                      <button
                        type="button"
                        onClick={() => onRemoveExisting(imgUrl, index)}
                        className="bg-primary-red text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-red-dark"
                        title="Delete image"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Drag to reorder
                  </div>
                </div>
              </div>
            ))}

            {/* New Files */}
            {selectedFiles.map((file, index) => {
              const displayIndex = localExistingImages.length + index;
              const previewUrl = previewUrls[index];
              // Use file name + index as stable key to prevent remounting on reorder
              const fileKey = file.name + '-' + file.size + '-' + file.lastModified;
              return (
                <div
                  key={`new-${fileKey}`}
                  draggable
                  onDragStart={() => handleDragStart(index, 'new')}
                  onDragOver={(e) => handleDragOver(e, displayIndex, 'new')}
                  onDrop={(e) => handleDropReorder(e, index, 'new')}
                  onDragEnd={handleDragEnd}
                  className={`relative group cursor-move ${
                    draggedIndex === index && draggedType === 'new' ? 'opacity-50' : ''
                  }`}
                >
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-blue-300 bg-gray-100">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt={`Selected ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized={previewUrl.startsWith('blob:')}
                        loading={index < 4 ? "eager" : "lazy"}
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {displayIndex === 0 && localExistingImages.length === 0 && (
                      <div className="absolute top-2 left-2 bg-primary-red text-white text-xs px-2 py-1 rounded font-bold">
                        MAIN
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {displayIndex !== 0 && (
                        <button
                          type="button"
                          onClick={() => setAsMain(index, 'new')}
                          className="bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
                          title="Set as main image"
                        >
                          ⭐ Main
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="bg-primary-red text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-red-dark"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Drag to reorder
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Drag and Drop Area */}
      {totalImages < maxImages && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${
              dragActive
                ? "border-primary-red bg-red-50"
                : "border-gray-300 hover:border-primary-red"
            }
            ${optimizing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
          onClick={() => !optimizing && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileInput}
            className="hidden"
            disabled={optimizing}
          />
          {optimizing ? (
            <div className="text-gray-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-red mx-auto mb-2"></div>
              Optimizing images...
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag and drop images here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Images will be optimized (max {maxImages} images, {totalImages} selected)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
