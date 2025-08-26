"use client";

import { Camera, Upload, X } from "lucide-react";
import React, { useState } from "react";
import ImageDisplay from "./ImageDisplay";
import { useFormContext } from "react-hook-form";

type UploadedImage = {
  file?: File;
  preview?: string;
};

const ImageUploader = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  // Watch for form images
  const formImages: UploadedImage[] = watch("images") || [];

  // Merge preview and file into a uniform format
  const displayImages = formImages.map((img) => ({
    file: img.file,
    preview: img.preview ?? (img.file ? URL.createObjectURL(img.file) : undefined),
  }));

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const currentImages = formImages || [];

    const newImages: UploadedImage[] = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        file,
      }));

    const updatedImages = [...currentImages, ...newImages];
    setValue("images", updatedImages);
  };

  const removeImage = (imageIndex: number) => {
    const updatedImages = formImages.filter((_, index) => index !== imageIndex);
    setValue("images", updatedImages);
  };

  const clearAllImages = () => {
    setValue("images", []);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files);
    e.target.value = ""; // Reset input for same file re-selection
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <Camera className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Trip Images</h2>
          <p className="text-sm text-gray-600">Upload images to showcase your itinerary</p>
        </div>
      </div>

      <div className="space-y-6">
        <input
          id="image-uploader"
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleClick}
        />

        <label htmlFor="image-uploader">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-gray-600 transition-all duration-200 cursor-pointer ${
              isDragOver
                ? "border-blue-400 bg-blue-50 text-blue-600"
                : errors.images
                ? "border-red-300 bg-red-50 hover:border-red-400"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                isDragOver ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <Upload className={`w-6 h-6 ${isDragOver ? "text-blue-600" : "text-gray-500"}`} />
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-900 mb-1">
                {!isDragOver ? "Click to upload or drag images here" : "Drop the images to upload"}
              </p>
              <p className="text-sm text-gray-500">Support for PNG, JPG, and WebP files</p>
            </div>
          </div>
        </label>

        {errors.images && (
          <p className="text-red-500 text-sm flex items-center gap-2">
            <X className="w-4 h-4" />
            {typeof errors.images.message === "string"
              ? errors.images.message
              : "Invalid image(s)"}
          </p>
        )}

        {displayImages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">
                Uploaded Images ({displayImages.length})
              </h3>
              <button
                type="button"
                onClick={clearAllImages}
                className="text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayImages.map((img, index) => (
                <ImageDisplay
                  key={`${img.preview ?? img.file?.name}-${index}`}
                  file={img.file}
                  preview={img.preview}
                  showRemoveButton
                  onRemove={() => removeImage(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageUploader;
