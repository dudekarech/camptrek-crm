'use client';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Trash2, Plus, Calendar, Image, X } from 'lucide-react';

const DaysInput = () => {
  const { register, control, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'days',
  });

  const watchedDays = watch('days');

  const handleAppend = () => {
    append({
      day_number: fields.length + 1,
      day_name: '',
      details: '',
      images: [],
    });
  };

  const handleImageUpload = (dayIndex: number, files: FileList | null) => {
    if (!files) return;

    const currentImages = watchedDays[dayIndex]?.images || [];
    const newImages = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    const updatedImages = [...currentImages, ...newImages];
    setValue(`days.${dayIndex}.images`, updatedImages);
  };

  const removeImage = (dayIndex: number, imageIndex: number) => {
    const currentImages = watchedDays[dayIndex]?.images || [];
    const updatedImages = currentImages.filter((_: any, index: number) => index !== imageIndex);
    setValue(`days.${dayIndex}.images`, updatedImages);
  };

  return (
    <div className="flex flex-col gap-6 my-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Calendar className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Day Plan</h2>
      </div>

      {fields.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 px-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
        >
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No days added yet</p>
          <p className="text-gray-400 text-sm mt-1">Click "Add Day" to begin planning your itinerary</p>
        </motion.div>
      )}

      <AnimatePresence mode="sync">
        {fields.map((field, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative border border-gray-200 rounded-xl p-6 shadow-sm bg-white hover:shadow-md transition-all duration-300 group"
          >
            {/* Day number badge */}
            <div className="absolute -top-3 -left-3 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
              Day {index + 1}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                  Day Title
                </label>
                <input
                  {...register(`days.${index}.day_name`)}
                  type="text"
                  placeholder="Enter day title (e.g., 'Arrival & Welcome Dinner')"
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                  Day Details
                </label>
                <textarea
                  {...register(`days.${index}.details`)}
                  rows={4}
                  placeholder="Describe the activities, meals, accommodations, and highlights for this day..."
                  className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
                />
              </div>

              {/* Day Images Section */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                  Day Images (Optional)
                </label>

                {/* Image Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e.target.files)}
                    className="hidden"
                    id={`day-images-${index}`}
                  />
                  <label
                    htmlFor={`day-images-${index}`}
                    className="flex flex-col items-center justify-center cursor-pointer py-4"
                  >
                    <Image className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload images for this day</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 10MB each</span>
                  </label>
                </div>

                {/* Image Previews */}
                {watchedDays[index]?.images && watchedDays[index].images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
                    {watchedDays[index].images.map((image: any, imageIndex: number) => {
                      const imageUrl = image.preview
                        ? image.preview
                        : image.file
                        ? URL.createObjectURL(image.file)
                        : '';

                      return (
                        <div key={imageIndex} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={imageUrl}
                              alt={`Day ${index + 1} image ${imageIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index, imageIndex)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#dc2626' }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => remove(index)}
                className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Trash2 className="w-4 h-4" />
                Remove Day
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.95 }}
        className="flex bg-primary text-white px-4 py-2 rounded-md cursor-pointer items-center justify-center gap-2"
        onClick={handleAppend}
      >
        <Plus className="w-5 h-5" />
        Add Day
      </motion.button>
    </div>
  );
};

export default DaysInput;
