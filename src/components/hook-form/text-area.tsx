"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

export interface InputFieldProps {
  name: string;
  label?: ReactNode;
  className?: string;
  description?: ReactNode;
  containerClassName?: string;
  placeholder: string;
  required?: boolean;
  maxlength?: number;
  rows?: number;
}

export function TextareaField({
  name,
  label,
  description,
  className,
  containerClassName,
  placeholder,
  required,
  rows,
  ...props
}: InputFieldProps) {
  const { control } = useFormContext();
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={cn("space-y-0.5", containerClassName)}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}

          <FormControl>
            <Textarea
              placeholder={placeholder}
              className={cn("resize-none", !rows && "h-[80px]", className)}
              rows={rows}
              {...field}
              {...props}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
