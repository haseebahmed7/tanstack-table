"use client";

import { Field } from "@/components/hook-form/fields";
import Button from "@/components/ui/custom/custom-button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  useCreateTimeoutRules,
  useUpdateTimeoutRules,
} from "@/lib/requests/core-setup/shift-preferences/api";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TimeoutRule } from "@/lib/requests/core-setup/shift-preferences/types";

export interface ShiftTimeoutRule {
  id?: number;
  startValue: number;
  expireValue: number;
  expireUnit: "minutes" | "hours" | "days";
}

interface AddShiftTimeoutDialogProps {
  open: boolean;
  onClose: () => void;
  rule?: TimeoutRule | null;
}

const defaultValues: ShiftTimeoutRule = {
  startValue: 1,
  expireValue: 1,
  expireUnit: "hours",
};

export default function AddShiftTimeoutDialog({
  open,
  onClose,
  rule,
}: AddShiftTimeoutDialogProps) {
  const { mutateAsync: createTimeOutRules, isPending: isCreating } =
    useCreateTimeoutRules();
  const { mutateAsync: updateTimeOutRules, isPending: isUpdating } =
    useUpdateTimeoutRules();

  const methods = useForm<ShiftTimeoutRule>({
    defaultValues,
  });

  const handleClose = () => {
    methods.reset(defaultValues);
    onClose();
  };

  const handleSubmit = async (values: ShiftTimeoutRule) => {
    try {
      const payload = {
        shiftStartsWithin: formatToHHMMSS(values.startValue, "hours"),
        timeoutAfterShiftCreate: formatToHHMMSS(
          values.expireValue,
          values.expireUnit,
        ),
      };

      if (rule?.id) {
        await updateTimeOutRules({
          id: rule.id,
          ...payload,
        });
      } else {
        await createTimeOutRules(payload);
      }

      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!open) return;

    if (rule) {
      const expire = parseTimeToValueAndUnit(rule.timeoutAfterShiftCreate);

      methods.reset({
        startValue: parseHours(rule.shiftStartsWithin) ?? 1,
        expireValue: expire.value,
        expireUnit: expire.unit,
      });
    } else {
      methods.reset(defaultValues);
    }
  }, [open, rule, methods]);

  const startValue = methods.watch("startValue");
  const expireValue = methods.watch("expireValue");

  function formatText(value: number, unit: string) {
    return `${value === 1 ? unit : `${unit}s`}`;
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{rule ? "Edit" : "Add"} Shift Timeout Rule</DialogTitle>
        </DialogHeader>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <div className="grid gap-4 py-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Shift Starts Within
                </label>
                <div className="flex items-center gap-2">
                  <Field.Text
                    name="startValue"
                    type="number"
                    min={1}
                    required
                    className="w-28"
                  />
                  <span>{formatText(startValue, "hour")}</span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Expires After
                </label>
                <div className="flex items-center gap-3">
                  <Field.Text
                    name="expireValue"
                    type="number"
                    placeholder="Enter value"
                    className="w-28 rounded-lg"
                    min={1}
                  />
                  <Field.Select
                    name="expireUnit"
                    className="w-32 rounded-lg"
                    options={[
                      {
                        value: "minutes",
                        label: formatText(expireValue, "minute"),
                      },
                      {
                        value: "hours",
                        label: formatText(expireValue, "hour"),
                      },
                      {
                        value: "days",
                        label: formatText(expireValue, "day"),
                      },
                    ]}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" loading={isCreating || isUpdating}>
                {rule ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function formatToHHMMSS(value: number, unit: "minutes" | "hours" | "days") {
  let totalMinutes = 0;

  if (unit === "minutes") {
    totalMinutes = value;
  } else if (unit === "hours") {
    totalMinutes = value * 60;
  } else {
    totalMinutes = value * 24 * 60;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}

function parseHours(timeString: string | null): number | null {
  if (timeString === null) return null;
  if (!timeString) return 0;
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours + minutes / 60;
}

// Helper: parse time and decide if it's minutes, hours, or days
function parseTimeToValueAndUnit(timeString: string): {
  value: number;
  unit: "minutes" | "hours" | "days";
} {
  if (!timeString) return { value: 0, unit: "hours" };
  const [hoursStr, minutesStr, secondsStr] = timeString.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  const seconds = parseInt(secondsStr, 10);

  if (seconds !== 0) {
    // If seconds are present, fallback to minutes total
    const totalMinutes = hours * 60 + minutes + seconds / 60;
    return { value: totalMinutes, unit: "minutes" };
  }

  if (hours >= 24 && hours % 24 === 0 && minutes === 0) {
    return { value: hours / 24, unit: "days" };
  }

  if (hours === 0 && minutes > 0) {
    return { value: minutes, unit: "minutes" };
  }

  if (hours > 0 && minutes === 0) {
    return { value: hours, unit: "hours" };
  }

  // Fallback for mixed hours and minutes
  const totalHours = hours + minutes / 60;
  return { value: totalHours, unit: "hours" };
}
