import {
  useDeleteShiftType,
  useDeleteTimeoutRules,
} from "@/lib/requests/core-setup/shift-preferences/api";
import { useConfirmDelete } from "./components/hook/confimation-dialog-hook";
import { DeleteConfirmationDialog } from "./components/dialogs/confirmation-dialog";
import ShiftTypes from "./components/shift-types";
import ShiftTimeoutRule from "./components/shift-timeout-rule";

export default function ShiftPreferences() {
  const deleteDialog = useConfirmDelete();
  const { mutateAsync: deleteShiftType } = useDeleteShiftType();
  const { mutateAsync: deleteTimeoutRule } = useDeleteTimeoutRules();

  return (
    <div>
      {/* Shift Type Table */}
      <ShiftTypes
        onDelete={(row) =>
          deleteDialog.askDelete({
            message: `Are you sure you want to delete "Shift Type ${row.title}" ?`,
            action: () => deleteShiftType(row.id),
          })
        }
      />

      {/* Shift TimeoutRule Table */}
      <ShiftTimeoutRule
        onDelete={(row) =>
          deleteDialog.askDelete({
            message: "Are you sure you want to delete this item?",
            action: () => deleteTimeoutRule(row.id),
          })
        }
      />

      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onClose={deleteDialog.close}
        onConfirm={deleteDialog.confirm}
        loading={deleteDialog.loading}
        message={deleteDialog.message}
      />
    </div>
  );
}
