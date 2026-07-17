"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetRateRules,
  useDeleteRateRule,
} from "@/lib/requests/core-setup/levels/api";
import { AppTable } from "../app-table";
import { RateRule } from "@/lib/requests/core-setup/levels/types";
import { Location } from "@/lib/requests/core-setup/locations/types";
import { RateRuleInlineStack } from "./RateRuleInlineStack";
import { Plus } from "lucide-react";
import { useConfirmDelete } from "../hook/confimation-dialog-hook";
import { DeleteConfirmationDialog } from "./confirmation-dialog";

interface RateRuleDialogProps {
  open: boolean;
  onClose: () => void;
  levelId: number;
  levelTitle: string;
  isGradeRequired: boolean;
}

export default function RateRuleDialog({
  open,
  onClose,
  levelId,
  levelTitle,
  isGradeRequired,
}: RateRuleDialogProps) {
  const [editingRule, setEditingRule] = useState<RateRule | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: rateRulesData, isLoading: isRulesLoading } = useGetRateRules({
    level: levelId,
  });
  const { mutateAsync: deleteRateRule } = useDeleteRateRule();

  const deleteDialog = useConfirmDelete();

  const handleAdd = () => {
    setEditingRule(null);
    setShowForm(true);
  };

  const handleEdit = (rule: RateRule) => {
    setEditingRule(rule);
    setShowForm(true);
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
