"use client";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const ItineraryImageUploader = () => {
  const {
    setValue,
    formState: { errors },
    watch,
    register,
  } = useFormContext();

  // ✅ Ensure `images` field is registered
  useEffect(() => {
    register("images", {
      required: "Please upload at least one image",
    });
  }, [register]);

  // ✅ Schema expects [{ file: File }]
  const watchedImages: { file: File }[] = watch("images") || [];

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).map((file) => ({ file }));
    const updatedImages = [...watchedImages, ...newFiles];
    setValue("images", updatedImages, { shouldValidate: true });
  };

  const handleRemoval = (imageIndex: number) => {
    const updatedImages = watchedImages.filter((_, index) => index !== imageIndex);
    setValue("images", updatedImages, { shouldValidate: true });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files);
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="file"
          id="image-uploader"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={handleChange}
        />
        <label
          htmlFor="image-uploader"
          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
        >
          Upload your images here
        </label>
      </div>

      {/* Image Previews */}
      {watchedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {watchedImages.map((img, index) => (
            <div key={`${img.file.name}-${index}`} className="relative">
              <img
                src={URL.createObjectURL(img.file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => handleRemoval(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                x
              </button>
              <p className="text-xs text-gray-500 mt-1 truncate">{img.file.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      <AnimatePresence>
        {errors.images && (
          <motion.p
            initial={{ scale: 0.7, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: -10 }}
            className="text-red-500 font-light text-sm"
          >
            {errors.images.message as string}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ItineraryImageUploader;
