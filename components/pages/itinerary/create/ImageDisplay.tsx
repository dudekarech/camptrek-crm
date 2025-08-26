"use client";
import React, { useState, useEffect } from "react";
import { FileImage, X } from "lucide-react";

interface ImageDisplayProps {
  file?: File;
  preview?: string;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

const ImageDisplay = ({ file, preview, onRemove, showRemoveButton = false }: ImageDisplayProps) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (preview) {
      setImageUrl(preview);
    }
  }, [file, preview]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  if (!imageUrl) return null;

  return (
    <div className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      {/* Loading State */}
      {isLoading && (
        <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {hasError && !isLoading && (
        <div className="w-full aspect-[4/3] bg-gray-100 flex flex-col items-center justify-center text-gray-500">
          <FileImage className="w-8 h-8 mb-2" />
          <span className="text-xs">Failed to load</span>
        </div>
      )}

      {/* Image */}
      {!hasError && (
        <img
          src={imageUrl}
          alt={file?.name ?? "Uploaded image"}
          className={`w-full aspect-[4/3] object-cover transition-opacity duration-200 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}

      {/* Remove Button */}
      {showRemoveButton && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Image Info Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <p className="text-xs font-medium truncate mb-1">
            {file?.name ?? "Remote Image"}
          </p>
          <p className="text-xs text-gray-300">
            {file ? formatFileSize(file.size) : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageDisplay;
