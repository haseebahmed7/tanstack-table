"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  shiftTypes,
  locations,
  levels,
  names,
  shiftTimings,
} from "@/dataBase/shift-management/shift";
import { useState } from "react";
import { Shift } from "../types/shift";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "../ui/custom/formField";

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  shiftType: z.string().min(1, "Shift type is required"),
  level: z.string().min(1, "Level is required"),
  location: z.string().min(1, "Location is required"),
  candidate: z.string().min(1, "Candidate is required"),
  shiftReason: z.string().min(1, "Shift Reason is required"),
  details: z.string().min(1, "Write Shift details"),
  reporting: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  onCreate: (shift: Shift) => void;
};

type ShiftType = "Morning Shift" | "Evening Shift" | "Night Shift";

export default function CreateShiftDialog({ onCreate }: Props) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: "",
      shiftType: "",
      level: "",
      location: "",
      candidate: "",
      shiftReason: "",
      details: "",
    },
  });

  const reason = [
    "Increase Workload",
    "New Project",
    "Other Operational Need",
    "Seasonal Demand",
    "Staff Absence Cover",
  ];

  const onSubmit = (data: FormData) => {
    const { start, end } =
      shiftTimings[data.shiftType as keyof typeof shiftTimings];

    const newShift: Shift = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      shiftType: data.shiftType,
      location: { title: data.location },
      date: data.date,
      level: data.level,
      candidate: { fullName: data.candidate },
      reason: data.shiftReason,
      details: data.details,
      reporting: data.reporting || "",
      startDatetime: start,
      endDatetime: end,
      status: "Pending",
      isAutomated: false,
    };

    onCreate(newShift);
    reset();
    setOpen(false);
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) reset();
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger className="w-full flex justify-end mb-2 outline-none">
          <Button>Create Shift</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl sm:max-w-3xl w-full p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Create Shift(s)
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            {/* DATE */}
            <FormField label="Date" error={errors.date}>
              <Input type="date" {...register("date")} />
            </FormField>

            {/* SHIFT TYPE */}
            <FormField label="Shift Type" error={errors.shiftType}>
              <Select onValueChange={(v) => setValue("shiftType", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select shift type" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {shiftTypes.map((item, i) => (
                    <SelectItem key={i} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* LEVEL */}
            <FormField label="Level" error={errors.level}>
              <Select onValueChange={(v) => setValue("level", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {levels.map((item, i) => (
                    <SelectItem key={i} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* LOCATION */}
            <FormField label="Location" error={errors.location}>
              <Select onValueChange={(v) => setValue("location", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {locations.map((item, i) => (
                    <SelectItem key={i} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* CANDIDATE */}
            <FormField label="Candidate" error={errors.candidate}>
              <Select onValueChange={(v) => setValue("candidate", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {names.map((item, i) => (
                    <SelectItem key={i} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* SHIFT REASON */}
            <FormField label="Shift Reason" error={errors.shiftReason}>
              <Select onValueChange={(v) => setValue("shiftReason", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {reason.map((item, i) => (
                    <SelectItem key={i} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* DETAILS */}
            <div className="col-span-2">
              <FormField label="Shift Details" error={errors.details}>
                <textarea
                  className="border rounded-md p-2 w-full"
                  {...register("details")}
                />
              </FormField>

              {/* REPORTING */}
              <FormField label="Reporting" error={errors.reporting}>
                <textarea
                  className="border rounded-md p-2 w-full"
                  {...register("reporting")}
                />
              </FormField>
            </div>

            {/* BUTTONS */}
            <div className="col-span-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit">Create Shift</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
