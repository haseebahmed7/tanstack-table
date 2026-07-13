"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Clock, MapPin, User, X } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string | ReactNode;
  disabled?: boolean;
  [key: string]: string | boolean | ReactNode;
}

export interface SelectFieldProps {
  name: string;
  label?: ReactNode;
  placeholder?: string;
  description?: ReactNode;
  options: SelectOption[];
  className?: string;
  containerClassName?: string;
  formMessageClassName?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  layout?: "row" | "column";
  labelWidth?: string;
  required?: boolean;
  getOptionClassName?: (option: SelectOption) => string;
  allowClear?: boolean;
}

export function SelectField({
  name,
  label,
  placeholder,
  description,
  options,
  className,
  containerClassName,
  formMessageClassName,
  disabled,
  onValueChange,
  getOptionClassName,
  layout = "column",
  labelWidth = "w-32",
  required,
  allowClear = false,
}: SelectFieldProps) {
  const { control } = useFormContext();
  const [selectKey, setSelectKey] = useState(0);

  const lowerName = name.toLowerCase();
  const lowerLabel = typeof label === "string" ? label.toLowerCase() : "";
  const isLevelSelect = lowerName.includes("level") || lowerLabel === "level";
  const isLocationSelect =
    lowerName.includes("location") || lowerLabel === "location";
  const isStatusSelect =
    lowerName.includes("status") || lowerLabel === "status";

  const presetLabel = isLevelSelect
    ? "Level"
    : isLocationSelect
      ? "Location"
      : isStatusSelect
        ? "Status"
        : undefined;

  const LeadingIcon = isLevelSelect
    ? User
    : isLocationSelect
      ? MapPin
      : isStatusSelect
        ? Clock
        : undefined;

  const effectivePlaceholder = presetLabel ?? placeholder;

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem
          className={cn(
            {
              "flex flex-col space-y-0.5": layout === "column",
              "flex flex-row items-center gap-3": layout === "row",
            },
            containerClassName,
          )}
        >
          {label && (
            <FormLabel
              className={cn(
                {
                  [labelWidth]: layout === "row",
                },
                "shrink-0",
              )}
            >
              {label}
              {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <div className="relative w-full">
            <Select
              key={selectKey}
              onValueChange={(value) => {
                field.onChange(value);
                onValueChange?.(value);
              }}
              value={
                field.value && field.value !== ""
                  ? String(field.value)
                  : undefined
              }
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    "w-full",
                    LeadingIcon &&
                      "font-semibold data-placeholder:font-semibold",
                    {
                      "cursor-not-allowed border-gray-300": disabled,
                    },
                    className,
                  )}
                >
                  <div className="flex items-center gap-2">
                    {LeadingIcon && (
                      <LeadingIcon
                        className="h-4 w-4 text-muted-foreground"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                    )}
                    <SelectValue placeholder={effectivePlaceholder} />
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={String(option.value)}
                    value={String(option.value)}
                    disabled={option.disabled}
                    className={cn(getOptionClassName?.(option))}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {allowClear && field.value && field.value !== "" && !disabled && (
              <button
                type="button"
                className="absolute right-7 top-1/2 -translate-y-1/2 flex items-center justify-center h-4 w-4 rounded-sm opacity-70 hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity z-10"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const newValue = "";
                  field.onChange(newValue);
                  field.onBlur();
                  onValueChange?.(newValue);
                  // Increment key to force Select remount, ensuring clean state for next selection
                  setSelectKey((prev) => prev + 1);
                }}
                tabIndex={-1}
                aria-label="Clear selection"
              >
                <X className="h-3.5 w-3.5 cursor-pointer hover:text-foreground" />
              </button>
            )}
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className={cn(formMessageClassName)} />
        </FormItem>
      )}
    />
  );
}
