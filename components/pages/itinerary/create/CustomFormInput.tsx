'use client'
import React from 'react'
import { AnimatePresence, motion } from "motion/react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { AlertCircle } from 'lucide-react';

type CustomFormInputProps = {
  label: string;
  type?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  required?: boolean;
}

const CustomFormInput = ({
  label, 
  type = 'text', 
  register, 
  error, 
  placeholder,
  required = false
} : CustomFormInputProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <label className="text-base font-medium text-gray-700">
          {label}
        </label>
        {required && (
          <span className="text-red-500 text-sm">*</span>
        )}
      </div>
      
      <div className="relative">
        <input
          type={type}
          {...register}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          className={`
            w-full px-4 py-3 rounded-lg border-2 
            bg-white text-gray-800 placeholder-gray-400
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-0
            hover:border-gray-400
            ${error 
              ? 'border-red-300 focus:border-red-500 bg-red-50' 
              : 'border-gray-300 focus:border-blue-500 focus:bg-blue-50/30'
            }
          `}
        />
        
        {/* Error icon */}
        {error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
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
            className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-red-600 text-sm font-medium">
              {error.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CustomFormInput