"use client";

import * as React from "react";
import { X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectFieldProps {
  name: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  options: MultiSelectOption[];
  className?: string;
  containerClassName?: string;
  formMessageClassName?: string;
  layout?: "row" | "column";
  labelWidth?: string;
  required?: boolean;
  disabled?: boolean;
}

export function MultiSelectField({
  name,
  label,
  description,
  placeholder = "Select options...",
  options,
  className,
  containerClassName,
  formMessageClassName,
  layout = "column",
  labelWidth = "w-32",
  required,
  disabled,
}: MultiSelectFieldProps) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    //closing dropdoown on outside click as it wasnt working
    function handleOutsideClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        const selectedValues: string[] = field.value || [];

        const handleUnselect = (value: string) => {
          const updated = selectedValues.filter((v) => v !== value);
          field.onChange(updated);
        };

        const filteredOptions = options.filter(
          (opt) =>
            !selectedValues.includes(opt.value) &&
            String(opt.label).toLowerCase().includes(search.toLowerCase()),
        );

        return (
          <FormItem
            className={cn(
              {
                "flex flex-col space-y-0.5": layout === "column",
                "flex flex-row items-start gap-3": layout === "row",
              },
              containerClassName,
            )}
          >
            {label && (
              <FormLabel
                className={cn({ [labelWidth]: layout === "row" }, "shrink-0")}
              >
                {label}
                {required && <span className="text-destructive">*</span>}
              </FormLabel>
            )}

            <FormControl>
              <div ref={wrapperRef} className="relative">
                <div
                  className={cn(
                    "group border-input ring-offset-background focus-within:ring-ring flex min-h-[22px] flex-wrap items-center gap-1.5 rounded-md border px-1 py-2 text-base transition-all focus-within:ring-2 focus-within:ring-offset-2",
                    className,
                  )}
                  onClick={() => !disabled && setOpen((v) => !v)}
                >
                  {selectedValues.length > 0 ? (
                    selectedValues.map((value) => {
                      const option = options.find((o) => o.value === value);
                      return (
                        <Badge key={value} variant="secondary">
                          {option?.label ?? value}
                          <button
                            type="button"
                            disabled={disabled}
                            className="focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={() => handleUnselect(value)}
                          >
                            <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })
                  ) : (
                    <span className="text-muted-foreground px-1 text-sm">
                      {placeholder}
                    </span>
                  )}
                </div>

                {open && !disabled && (
                  <div className="bg-popover text-popover-foreground animate-in absolute z-10 mt-1 w-full rounded-md border shadow-md outline-none">
                    <Command>
                      <CommandInput
                        ref={inputRef as any}
                        placeholder="Type to search..."
                        value={search}
                        onValueChange={setSearch}
                        className="h-8 px-2 text-sm"
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup className="max-h-44 overflow-auto">
                          {filteredOptions.map((opt) => (
                            <CommandItem
                              key={opt.value}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onSelect={() => {
                                field.onChange([...selectedValues, opt.value]);
                                setSearch("");
                              }}
                              className="cursor-pointer text-sm"
                            >
                              {opt.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>
                )}
              </div>
            </FormControl>

            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage className={cn(formMessageClassName)} />
          </FormItem>
        );
      }}
    />
  );
}
