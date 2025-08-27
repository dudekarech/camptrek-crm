"use client";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";

type DayForm = {
    days: {
      day: number;
      title: string;
      details: string;
      images: File[];
    }[];
  }

const ItineraryDaysInput = () => {
  const { register, control, formState: { errors }, setValue, watch } = useFormContext<DayForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "days"
  });

  const handleAppend = () => {
    append({
      day: fields.length + 1,
      title: "",
      details: "",
      images: []
    });
  };

  // Image handling for a specific day
  const handleImageUpload = (files: FileList | null, dayIndex: number) => {
    if (!files) return;
    
    const currentDayImages = watch(`days.${dayIndex}.images`) || [];
    const newFiles = Array.from(files);
    const updatedImages = [...currentDayImages, ...newFiles];
    setValue(`days.${dayIndex}.images`, updatedImages);
  };

  const handleRemoval = (imageIndex: number, dayIndex: number) => {
    const currentDayImages = watch(`days.${dayIndex}.images`) || [];
    const updatedImages = currentDayImages.filter((_, index) => index !== imageIndex);
    setValue(`days.${dayIndex}.images`, updatedImages);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, dayIndex: number) => {
    handleImageUpload(e.target.files, dayIndex);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-medium">Itinerary Days</h3>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {fields.map((field, dayIndex) => {
          const dayImages = watch(`days.${dayIndex}.images`) || [];
          
          return (
            <motion.div 
              key={field.id} 
              className="border p-4 rounded space-y-4 bg-white shadow-sm"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ 
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              layout
            >
              <motion.div 
                className="flex justify-between items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="font-medium">Day {dayIndex + 1}</h4>
                <motion.button
                  type="button"
                  onClick={() => remove(dayIndex)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Remove
                </motion.button>
              </motion.div>

              {/* Title Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <label className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  {...register(`days.${dayIndex}.title`)}
                  type="text"
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Day title"
                />
                <AnimatePresence>
                  {errors.days?.[dayIndex]?.title && (
                    <motion.p
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.days[dayIndex].title.message as string}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Details Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium mb-1">
                  Details
                </label>
                <textarea
                  {...register(`days.${dayIndex}.details`)}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows={3}
                  placeholder="Day details and activities"
                />
                <AnimatePresence>
                  {errors.days?.[dayIndex]?.details && (
                    <motion.p
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.days[dayIndex].details.message as string}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Image Upload */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <label className="block text-sm font-medium mb-2">
                  Images for Day {dayIndex + 1}
                </label>
                
                <input
                  type="file"
                  id={`day-images-${dayIndex}`}
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => handleImageChange(e, dayIndex)}
                />
                <motion.label
                  htmlFor={`day-images-${dayIndex}`}
                  className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Upload Images for Day {dayIndex + 1}
                </motion.label>

                {/* Image Previews */}
                <AnimatePresence mode="popLayout">
                  {dayImages.length > 0 && (
                    <motion.div 
                      className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      layout
                    >
                      {dayImages.map((file: File, imageIndex: number) => (
                        <motion.div 
                          key={`${file.name}-${imageIndex}`} 
                          className="relative"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ 
                            duration: 0.3,
                            type: "spring",
                            stiffness: 300,
                            damping: 25
                          }}
                          layout
                          whileHover={{ scale: 1.02 }}
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Day ${dayIndex + 1} - Image ${imageIndex + 1}`}
                            className="w-full h-24 object-cover rounded border shadow-sm"
                          />
                          <motion.button
                            type="button"
                            onClick={() => handleRemoval(imageIndex, dayIndex)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            ×
                          </motion.button>
                          <motion.p 
                            className="text-xs text-gray-500 mt-1 truncate"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            {file.name}
                          </motion.p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {errors.days?.[dayIndex]?.images && (
                    <motion.p
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.days[dayIndex].images.message as string}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        {fields.length === 0 && (
          <motion.p 
            className="text-gray-500 text-center py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            No days added yet. Click "Add Day" to start building your itinerary.
          </motion.p>
        )}
      </AnimatePresence>
      <motion.button
          type="button"
          onClick={handleAppend}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          Add Day
        </motion.button>
    </div>
  );
};

export default ItineraryDaysInput;