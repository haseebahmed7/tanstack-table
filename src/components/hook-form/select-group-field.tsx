import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  MapPin,
  User,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { SelectFieldProps, SelectOption } from "./select-field";
import { ReactNode } from "react";

export interface NestedOption {
  value: string;
  label: string;
  children?: NestedOption[];
  isGradeRequired?: boolean;
  is_grade_required?: boolean;
}

interface NestedSelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: ReactNode | string;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  options: NestedOption[];
  required?: boolean;
}
export const findSelectedOptionObject = (
  value: string,
  items: NestedOption[],
): NestedOption | undefined => {
  for (const item of items) {
    if (item.value === value) {
      return item;
    }
    if (item.children) {
      const found = findSelectedOptionObject(value, item.children);
      if (found) return found;
    }
  }
  return undefined;
};

export function NestedSelectField({
  name,
  label,
  placeholder,
  description,
  options,
  className,
  containerClassName,
  disabled,
  required,
  onValueChange,
}: NestedSelectFieldProps) {
  const { control } = useFormContext();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const lowerName = name.toLowerCase();
  const lowerLabel = label?.toLowerCase?.() ?? "";
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

  // Function to find the selected option label
  const findSelectedOptionLabel = (
    value: string,
    items: NestedOption[],
  ): string | undefined => {
    for (const item of items) {
      if (item.value === value) {
        return item.label;
      }
      if (item.children) {
        const found = findSelectedOptionLabel(value, item.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  const findSelectedOptionValue = (
    value: string,
    items: NestedOption[],
  ): string | undefined => {
    for (const item of items) {
      if (item.value === value) {
        return item.value;
      }
      if (item.children) {
        const found = findSelectedOptionValue(value, item.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  const isValidOption = (value: string, items: NestedOption[]): boolean => {
    for (const item of items) {
      if (item.value === value) {
        return true;
      }
      if (item.children) {
        const found = isValidOption(value, item.children);
        if (found) return true;
      }
    }
    return false;
  };

  const toggleItem = (value: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  const renderOptions = (items: NestedOption[], level = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = openItems[item.value];

      return (
        <div key={item.value} className="w-full">
          {hasChildren ? (
            <>
              <div
                className={`flex cursor-pointer items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${level > 0 ? "pl-8" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.value);
                }}
              >
                <span className="mr-2">
                  {isOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </span>
                {item.label}
              </div>
              {isOpen && (
                <div className="w-full">
                  {renderOptions(item.children || [], level + 1)}
                </div>
              )}
            </>
          ) : (
            <SelectItem
              value={String(item.value)}
              className={`${level > 0 ? "pl-8" : ""}`}
            >
              {item.label}
            </SelectItem>
          )}
        </div>
      );
    });
  };

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        const selectedLabel = field.value
          ? findSelectedOptionLabel(field.value, options)
          : undefined;

        const isValid = field.value
          ? isValidOption(field.value, options)
          : false;
        return (
          <FormItem className={cn("space-y-0.5", containerClassName)}>
            {label && (
              <FormLabel>
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </FormLabel>
            )}

            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onValueChange?.(value);
              }}
              value={isValid ? field.value : undefined}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    "w-full",
                    LeadingIcon &&
                      "font-semibold data-placeholder:font-semibold",
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
                    <SelectValue placeholder={effectivePlaceholder}>
                      {selectedLabel || effectivePlaceholder}
                    </SelectValue>
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-60 overflow-y-auto">
                {renderOptions(options)}
              </SelectContent>
            </Select>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

interface SelectGroupOption {
  label: string;
  options: SelectOption[];
}

interface SelectGroupFieldProps extends Omit<SelectFieldProps, "options"> {
  groups: SelectGroupOption[];
}

export function SelectGroupField({
  name,
  label,
  placeholder,
  description,
  groups,
  className,
  containerClassName,
  disabled,
  onValueChange,
}: SelectGroupFieldProps) {
  const { control } = useFormContext();
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={cn("space-y-0.5", containerClassName)}>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onValueChange?.(value);
            }}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className={cn("w-full", className)}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {groups.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface NestedMultiSelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: ReactNode | string;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  onValueChange?: (value: string[]) => void;
  options: NestedOption[];
  required?: boolean;
}

// Helper function to find all selected option labels
const findSelectedOptionLabels = (
  values: string[],
  items: NestedOption[],
): Array<{ value: string; label: string }> => {
  const result: Array<{ value: string; label: string }> = [];

  const traverse = (options: NestedOption[]) => {
    for (const item of options) {
      if (values.includes(item.value)) {
        result.push({ value: item.value, label: item.label });
      }
      if (item.children) {
        traverse(item.children);
      }
    }
  };

  traverse(items);
  return result;
};

export function NestedMultiSelectField({
  name,
  label,
  placeholder,
  description,
  options,
  className,
  containerClassName,
  disabled,
  required,
  onValueChange,
}: NestedMultiSelectFieldProps) {
  const { control } = useFormContext();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    if (triggerRef.current && isOpen) {
      setPopoverWidth(triggerRef.current.offsetWidth);
    }
  }, [isOpen]);

  const toggleItem = (value: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  // Get all descendant values of an item (children, grandchildren, etc.)
  const getAllDescendants = (item: NestedOption): string[] => {
    const descendants: string[] = [];
    if (item.children && item.children.length > 0) {
      item.children.forEach((child) => {
        descendants.push(child.value);
        descendants.push(...getAllDescendants(child));
      });
    }
    return descendants;
  };

  // Find an item by value in the options tree
  const findItemByValue = (
    value: string,
    items: NestedOption[],
  ): NestedOption | null => {
    for (const item of items) {
      if (item.value === value) return item;
      if (item.children && item.children.length > 0) {
        const found = findItemByValue(value, item.children);
        if (found) return found;
      }
    }
    return null;
  };

  // Check if an item is a descendant of any selected parent
  const isDescendantOfSelectedParent = (
    itemValue: string,
    selectedValues: string[],
    items: NestedOption[],
  ): boolean => {
    for (const selectedValue of selectedValues) {
      const selectedItem = findItemByValue(selectedValue, items);
      if (selectedItem) {
        const descendants = getAllDescendants(selectedItem);
        if (descendants.includes(itemValue)) {
          return true;
        }
      }
    }
    return false;
  };

  // Check if an item is a parent of any selected child
  const isParentOfSelectedChild = (
    itemValue: string,
    selectedValues: string[],
    items: NestedOption[],
  ): boolean => {
    const item = findItemByValue(itemValue, items);
    if (!item) return false;
    const descendants = getAllDescendants(item);
    return descendants.some((descendantValue) =>
      selectedValues.includes(descendantValue),
    );
  };

  const handleToggleSelection = (
    value: string,
    currentValues: string[],
    onChange: (values: string[]) => void,
    items: NestedOption[],
  ) => {
    const item = findItemByValue(value, items);
    if (!item) return;

    const hasChildren = item.children && item.children.length > 0;
    const isCurrentlySelected = currentValues.includes(value);

    let newValues: string[];

    if (isCurrentlySelected) {
      // Deselecting
      if (hasChildren) {
        // If deselecting a parent, also deselect all descendants
        const descendants = getAllDescendants(item);
        newValues = currentValues.filter(
          (v) => v !== value && !descendants.includes(v),
        );
      } else {
        // If deselecting a child, check if we need to handle parent
        newValues = currentValues.filter((v) => v !== value);
      }
    } else {
      // Selecting
      if (hasChildren) {
        // If selecting a parent, select all descendants too
        const descendants = getAllDescendants(item);
        // Remove any descendants that are currently selected (to avoid duplicates)
        newValues = [
          ...currentValues.filter((v) => !descendants.includes(v)),
          value,
          ...descendants,
        ];
      } else {
        // If selecting a child, check if its parent is selected
        // If parent is selected, remove parent and its other children, keep only this child
        const parentSelected = items.some((parent) => {
          if (
            parent.children &&
            parent.children.some((child) => child.value === value)
          ) {
            return currentValues.includes(parent.value);
          }
          return false;
        });

        if (parentSelected) {
          // Find and remove the parent
          const parentItem = items.find(
            (p) =>
              p.children && p.children.some((child) => child.value === value),
          );
          if (parentItem) {
            const parentDescendants = getAllDescendants(parentItem);
            newValues = [
              ...currentValues.filter(
                (v) => v !== parentItem.value && !parentDescendants.includes(v),
              ),
              value,
            ];
          } else {
            newValues = [...currentValues, value];
          }
        } else {
          newValues = [...currentValues, value];
        }
      }
    }

    onChange(newValues);
    onValueChange?.(newValues);
  };

  const renderOptions = (
    items: NestedOption[],
    selectedValues: string[],
    onChange: (values: string[]) => void,
    allOptions: NestedOption[],
    level = 0,
  ) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = openItems[item.value];
      const isSelected = selectedValues.includes(item.value);
      const isDescendant = isDescendantOfSelectedParent(
        item.value,
        selectedValues,
        allOptions,
      );
      const isDisabled = isDescendant;

      return (
        <div key={item.value} className="w-full">
          <div
            className={cn(
              "flex cursor-pointer items-center px-4 py-2 text-sm",
              isDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100 dark:hover:bg-gray-800",
              level > 0 && "pl-8",
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (isDisabled) return;
            }}
          >
            {hasChildren && (
              <span
                className="mr-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.value);
                }}
              >
                {isOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </span>
            )}
            {!hasChildren && <span className="mr-2 w-4" />}
            <Checkbox
              checked={isSelected}
              disabled={isDisabled}
              onCheckedChange={() => {
                if (!isDisabled) {
                  handleToggleSelection(
                    item.value,
                    selectedValues,
                    onChange,
                    allOptions,
                  );
                }
              }}
              className="mr-2"
              onClick={(e) => {
                e.stopPropagation();
                if (isDisabled) e.preventDefault();
              }}
            />
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (!isDisabled) {
                  handleToggleSelection(
                    item.value,
                    selectedValues,
                    onChange,
                    allOptions,
                  );
                }
              }}
              className={cn("flex-1", isDisabled && "cursor-not-allowed")}
            >
              {item.label}
            </span>
          </div>
          {hasChildren && isOpen && (
            <div className="w-full">
              {renderOptions(
                item.children || [],
                selectedValues,
                onChange,
                allOptions,
                level + 1,
              )}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        const selectedValues = Array.isArray(field.value) ? field.value : [];

        // Filter out children if their parent is selected
        const filteredSelectedValues = selectedValues.filter((value) => {
          const item = findItemByValue(value, options);
          if (!item) return true;

          // Check if this item is a descendant of any selected parent
          return !isDescendantOfSelectedParent(value, selectedValues, options);
        });

        const selectedLabels = findSelectedOptionLabels(
          filteredSelectedValues,
          options,
        );

        return (
          <FormItem className={cn("space-y-0.5", containerClassName)}>
            {label && (
              <FormLabel>
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </FormLabel>
            )}

            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    ref={triggerRef}
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between text-left font-normal min-h-10 h-auto py-2",
                      !selectedLabels.length && "text-muted-foreground",
                      className,
                    )}
                    disabled={disabled}
                    type="button"
                  >
                    <div className="flex flex-1 flex-wrap gap-1 items-center min-h-6">
                      {selectedLabels.length > 0 ? (
                        selectedLabels.map(({ value, label: itemLabel }) => (
                          <span
                            key={value}
                            className="bg-primary/10 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs"
                          >
                            {itemLabel}
                            <span
                              role="button"
                              tabIndex={-1}
                              aria-label="Remove selection"
                              className="hover:text-destructive cursor-pointer shrink-0 ml-0.5 flex items-center justify-center rounded-sm outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                const item = findItemByValue(value, options);
                                let newValues: string[];

                                if (
                                  item &&
                                  item.children &&
                                  item.children.length > 0
                                ) {
                                  // If removing a parent, also remove all descendants
                                  const descendants = getAllDescendants(item);
                                  newValues = selectedValues.filter(
                                    (v) =>
                                      v !== value && !descendants.includes(v),
                                  );
                                } else {
                                  newValues = selectedValues.filter(
                                    (v) => v !== value,
                                  );
                                }

                                field.onChange(newValues);
                                onValueChange?.(newValues);
                              }}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                            >
                              <X size={12} />
                            </span>
                          </span>
                        ))
                      ) : (
                        <span>{placeholder || "Select items..."}</span>
                      )}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50 self-start mt-0.5" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="p-0"
                align="start"
                style={{
                  width: popoverWidth ? `${popoverWidth}px` : undefined,
                }}
              >
                <div
                  className="max-h-60 overflow-y-auto overflow-x-hidden overscroll-contain"
                  style={{
                    scrollBehavior: "smooth",
                    WebkitOverflowScrolling: "touch",
                    maxHeight: "15rem",
                  }}
                  onWheel={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {renderOptions(
                    options,
                    selectedValues,
                    field.onChange,
                    options,
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
