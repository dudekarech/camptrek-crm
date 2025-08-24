"use client";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { useFormContext } from "react-hook-form";

type FormInputProp = {
  label: string;
  type?: "text" | "password" | "email";
  name: string;
  disabled?: boolean
};

const FormInput = ({ label, type = "text", name, disabled }: FormInputProp) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <div className="flex flex-row gap-4 items-center">
        <p className="text-md font-semibold capitalize">{label}</p>
        <input
          {...register(name)}
          type={type}
          className="border border-gray-500"
          disabled={disabled}
        />
      </div>

      <AnimatePresence mode="wait">
        {errors[name] && (
          <motion.p
            key={`error-${name}`}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="text-red-400 text-sm"
          >
            {errors[name]?.message as string}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormInput;