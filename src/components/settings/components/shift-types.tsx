import { formatTimeRange12h, getShiftTotalHours } from "@/lib/format-date";
import { useGetShiftTypes } from "@/lib/requests/core-setup/shift-preferences/api";
import { AppTable, Column } from "./app-table";
import { Plus } from "lucide-react";
import AddShiftTypeDialog from "./dialogs/add-shift-types";
import { useState } from "react";
import { ShiftType } from "@/lib/requests/core-setup/shift-preferences/types";

interface ShiftTypesProps {
  onDelete: (row: ShiftType) => void;
}

export default function ShiftTypes({ onDelete }: ShiftTypesProps) {
  const [shiftType, setShiftType] = useState<ShiftType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: shiftTypes, isLoading: IsShiftTypesLoading } =
    useGetShiftTypes();

  const shiftHeaders: Column[] = [
    {
      header: "Shift Title",
      accessor: "title",
    },
    {
      header: "Shift Time",
      accessor: "startTime",
      cell: (row) => formatTimeRange12h(row.startTime, row.endTime),
    },
    {
      header: "Break Duration",
      accessor: "breakDuration",
      cell: (row) => `${row.breakDuration} minutes`,
    },
    {
      header: "Break In Cost",
      accessor: "isBreakDurationIncludedInCost",
      cell: (row) => (row.isBreakDurationIncludedInCost ? "Yes" : "No"),
    },
    {
      header: "Total Hours",
      accessor: "startTime",
      cell: (row) => {
        const hrs = getShiftTotalHours(
          row.startTime,
          row.endTime,
          row.breakDuration,
          row.isBreakDurationIncludedInCost,
        );
        return `${hrs % 1 === 0 ? hrs : hrs.toFixed(1)} hrs`;
      },
    },
  ];

  return (
    <div>
      <AppTable
        title="Shift Types"
        data={shiftTypes?.data?.results || []}
        isLoading={IsShiftTypesLoading}
        button={{
          icon: <Plus className="size-5" />,
          iconOnly: true,
          onClick: () => {
            setIsDialogOpen(true);
            setShiftType(null);
          },
        }}
        columns={shiftHeaders}
        action={true}
        onEdit={(row) => {
          setIsDialogOpen(true);
          setShiftType(row);
        }}
        onDelete={onDelete}
      />

      <AddShiftTypeDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setShiftType(null);
        }}
        shiftType={shiftType}
      />
    </div>
  );
}
