"use client";

import { Field } from "@/components/hook-form/fields";
import Button from "@/components/ui/custom/custom-button";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ShiftType,
  UpdateShiftTypePayload,
} from "@/lib/requests/core-setup/shift-preferences/types";
import {
  useCreateShiftType,
  useUpdateShiftType,
} from "@/lib/requests/core-setup/shift-preferences/api";
import { useEffect } from "react";

export const formSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(1, { message: "Shift name is required" })
    .max(50, { message: "Shift name must be less than 50 characters" }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  breakDuration: z
    .number()
    .min(0, { message: "Break duration must be a positive number" }),
  isBreakDurationIncludedInCost: z.boolean(),
});

const defaultValues = {
  title: "",
  startTime: "",
  endTime: "",
  breakDuration: 0,
  isBreakDurationIncludedInCost: true,
};

interface AddShiftTypeDialogProps {
  open: boolean;
  onClose: () => void;
  shiftType?: ShiftType | null;
}

export default function AddShiftTypeDialog({
  open,
  onClose,
  shiftType,
}: AddShiftTypeDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { mutateAsync: createShiftType, isPending: IsCreateShiftTypeLoading } =
    useCreateShiftType();
  const { mutateAsync: updateShiftType, isPending: IsUpdateShiftTypeLoading } =
    useUpdateShiftType();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (values.id) {
        await updateShiftType(values as UpdateShiftTypePayload);
      } else {
        await createShiftType(values);
      }
      form.reset(defaultValues);
      onClose();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (open) {
      if (shiftType) {
        form.reset({ ...defaultValues, ...shiftType });
      } else {
        form.reset(defaultValues);
      }
    }
  }, [open, shiftType, form]);

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {shiftType ? "Edit Shift Type" : "Add Shift Type"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Field.Text name="title" label="Shift Name" />
            <Field.Text type="time" name="startTime" label="Start Time" />
            <Field.Text type="time" name="endTime" label="End Time" />
            <Field.Text
              type="number"
              name="breakDuration"
              label="Break Duration (minutes)"
            />
            <Field.Switch
              name="isBreakDurationIncludedInCost"
              label="Include break in cost"
              description="Include break duration in shift cost calculation."
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={IsCreateShiftTypeLoading || IsUpdateShiftTypeLoading}
              >
                {shiftType ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
