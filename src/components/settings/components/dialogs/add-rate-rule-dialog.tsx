"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";

import { Field } from "@/components/hook-form/fields";
import {
  useGetRateRules,
  useUpdateRateRule,
  useDeleteRateRule,
} from "@/lib/requests/core-setup/levels/api";
import { AppTable } from "../app-table";
import {
  RateRule,
  RateRulePayload,
} from "@/lib/requests/core-setup/levels/types";
import { Location } from "@/lib/requests/core-setup/locations/types";
import CustomButton from "@/components/ui/custom/custom-button";
import { useGetShiftTypes } from "@/lib/requests/shift-management/api";
import { useGetGrades } from "@/lib/requests/core-setup/salary-band/api";
import { useGetLocations } from "@/lib/requests/core-setup/locations/api";
import { RateRuleInlineStack } from "./RateRuleInlineStack";
import { Plus } from "lucide-react";
import { useConfirmDelete } from "../hook/confimation-dialog-hook";
import { DeleteConfirmationDialog } from "./confirmation-dialog";

const rateRuleSchema = z.object({
  rate: z.number().min(0, "Rate must be a positive number"),
  days: z
    .array(
      z.object({
        day: z.string(),
        isAvailable: z.boolean(),
      }),
    )
    .min(1, "At least one day must be selected"),
  priority: z.number().min(0, "Priority must be a positive number"),
  grade: z.string().optional().nullable(),
  shiftTypes: z
    .array(z.string())
    .min(1, "At least one shift type must be selected"),
  locations: z
    .array(z.string())
    .min(1, "At least one location must be selected"),
});

type RateRuleFormValues = z.infer<typeof rateRuleSchema>;

const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const getDays = (selected: string[] = []) =>
  DAY_ORDER.map((day) => ({
    day,
    isAvailable: selected.includes(day),
  }));

interface RateRuleDialogProps {
  open: boolean;
  onClose: () => void;
  levelId: number;
  levelTitle: string;
  isGradeRequired: boolean;
}

const defaultValues: RateRuleFormValues = {
  rate: 0,
  priority: 0,
  grade: null,
  shiftTypes: [],
  locations: [],
  days: getDays(),
};

export default function RateRuleDialog({
  open,
  onClose,
  levelId,
  levelTitle,
  isGradeRequired,
}: RateRuleDialogProps) {
  const [editingRule, setEditingRule] = useState<RateRule | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [rateRules, setRateRules] = useState<RateRuleFormValues[]>([
    { ...defaultValues, days: getDays() },
  ]);

  const { data: rateRulesData, isLoading: isRulesLoading } = useGetRateRules({
    level: levelId,
  });

  const deleteDialog = useConfirmDelete();

  const { mutateAsync: updateRateRule, isPending: isUpdating } =
    useUpdateRateRule();
  const { mutateAsync: deleteRateRule, isPending: isDeleting } =
    useDeleteRateRule();

  const handleAdd = () => {
    setEditingRule(null);
    setShowForm(true);
  };

  const handleEdit = (rule: RateRule) => {
    setEditingRule(rule);

    setShowForm(true);
  };

  const handleDeleteRule = (index: number) => {
    setRateRules((prev) => prev.filter((_, i) => i !== index));
  };

  const existingRulesCount = rateRulesData?.results?.length ?? 0;

  const rateRulesHeader = [
    {
      accessor: "rate",
      header: "Rate / Hour",
      className: "text-black font-semibold",
    },
    {
      accessor: "days",
      header: "Days",
      cell: (row: RateRule) => row.days.join(", "),
    },
    {
      accessor: "shiftTypes",
      header: "Shift Types",
      cell: (row: RateRule) =>
        (row.shiftTypes as { id: number; title: string }[])
          .map((s) => s.title)
          .join(", "),
    },
    ...(isGradeRequired
      ? [
          {
            accessor: "grade",
            header: "Salary Band",
            cell: (row: RateRule) => row.grade?.title ?? "Any",
          },
        ]
      : []),

    {
      accessor: "locations",
      header: "Locations",
      cell: (row: RateRule) =>
        (row.locations as Location[]).map((l) => l.title).join(", "),
    },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
        <DialogContent className="max-w-none sm:max-w-300 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rate Rules for {levelTitle}</DialogTitle>
          </DialogHeader>

          {showForm && (
            <RateRuleInlineStack
              levelId={levelId}
              levelTitle={levelTitle}
              isGradeRequired={isGradeRequired}
              existingRulesCount={existingRulesCount}
              editingRule={editingRule}
              onClose={() => {
                setShowForm(false);
                setEditingRule(null);
              }}
            />
          )}

          <AppTable
            data={rateRulesData?.data?.results ?? []}
            columns={rateRulesHeader}
            button={{
              title: "Add rate rules",
              icon: <Plus className="h-4 w-4" />,
              onClick: handleAdd,
            }}
            action={true}
            onEdit={handleEdit}
            onDelete={(row) =>
              deleteDialog.askDelete({
                message: `Are you sure you want to delete this rate rule?`,
                action: () => deleteRateRule(row.id),
              })
            }
            rowClassName="text-gray-500"
            isLoading={isRulesLoading}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onClose={deleteDialog.close}
        onConfirm={deleteDialog.confirm}
        loading={deleteDialog.loading}
        message={deleteDialog.message}
      />
    </>
  );
}
