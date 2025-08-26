"use client";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import { AlertCircle, FileText } from "lucide-react";

type CustomTextAreaProp = {
  label: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
};

const CustomTextArea = ({ 
  label, 
  register, 
  error, 
  placeholder,
  required = false,
  rows = 6,
  maxLength
}: CustomTextAreaProp) => {
  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <label className="text-base font-medium text-gray-700">
              {label}
            </label>
            {required && (
              <span className="text-red-500 text-sm">*</span>
            )}
          </div>
          {maxLength && (
            <span className="text-xs text-gray-500">
              Max {maxLength} characters
            </span>
          )}
        </div>
        
        {/* Helper text */}
        <p className="text-sm text-gray-500 ml-7">
          Provide detailed information. You can resize this field vertically if needed.
        </p>
      </div>
      
      <div className="relative">
        <textarea
          {...register}
          rows={rows}
          maxLength={maxLength}
          placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
          className={`
            w-full px-4 py-3 rounded-lg border-2 
            bg-white text-gray-800 placeholder-gray-400
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-0
            hover:border-gray-400
            resize-vertical min-h-[120px]
            ${error 
              ? 'border-red-300 focus:border-red-500 bg-red-50' 
              : 'border-gray-300 focus:border-blue-500 focus:bg-blue-50/30'
            }
          `}
        />
        
        {/* Error icon */}
        {error && (
          <div className="absolute top-3 right-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm font-medium">
              {error.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomTextArea;