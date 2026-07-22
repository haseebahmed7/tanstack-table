import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useGetTimeoutRules } from "@/lib/requests/core-setup/shift-preferences/api";
import { TimeoutRule } from "@/lib/requests/core-setup/shift-preferences/types";
import AddShiftTimeoutDialog from "./dialogs/add-shiftTimeout-rules";
import { AppTable, Column } from "./app-table";

interface ShiftTimeoutRuleProps {
  onDelete: (row: TimeoutRule) => void;
}

export default function ShiftTimeoutRule({ onDelete }: ShiftTimeoutRuleProps) {
  const [selectedRule, setSelectedRule] = useState<TimeoutRule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: timeOutRules, isLoading: isTimeOutRuleLaoding } =
    useGetTimeoutRules();

  const timeoutTableData = useMemo(() => {
    if (!timeOutRules?.data?.results) return [];

    return [...timeOutRules.data.results].sort((a, b) => {
      if (a.shiftStartsWithin === null) return 1;
      if (b.shiftStartsWithin === null) return -1;

      return a.shiftStartsWithin.localeCompare(b.shiftStartsWithin);
    });
  }, [timeOutRules]);

  const getCondition = (row: TimeoutRule) => {
    const index = timeoutTableData.findIndex((item) => item.id === row.id);

    if (row.shiftStartsWithin === null) return "ELSE";

    return index === 0 ? "IF" : "ELSE IF";
  };

  const timeoutRuleHeaders: Column[] = [
    {
      header: "Condition",
      accessor: "id",
      cell: (row) => getCondition(row),
      className: "text-black",
    },
    {
      header: "Shift Starts Within",
      accessor: "shiftStartsWithin",
      cell: (row) => formatShiftStartsWithin(row.shiftStartsWithin),
    },
    {
      header: "Expires After",
      accessor: "timeoutAfterShiftCreate",
      cell: (row) => formatExpiresAfter(row.timeoutAfterShiftCreate),
    },
  ];

  return (
    <div>
      <AppTable
        title="Shift Timeout Settings"
        data={timeoutTableData}
        isLoading={isTimeOutRuleLaoding}
        button={{
          icon: <Plus className="size-5" />,
          iconOnly: true,
          onClick: () => {
            setSelectedRule(null);
            setIsDialogOpen(true);
          },
        }}
        columns={timeoutRuleHeaders}
        rowClassName="text-gray-500"
        action={true}
        onEdit={(rule) => {
          setSelectedRule(rule);
          setIsDialogOpen(true);
        }}
        onDelete={onDelete}
      />

      <AddShiftTimeoutDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedRule(null);
        }}
        rule={selectedRule}
      />
    </div>
  );
}

function formatUnit(value: number, unit: string) {
  return `${value} ${value === 1 ? unit : `${unit}s`}`;
}

function formatTime(hours: number, minutes: number) {
  if (hours === 0) {
    return formatUnit(minutes, "minute");
  }

  if (minutes === 0) {
    return formatUnit(hours, "hour");
  }

  return `${formatUnit(hours, "hour")} ${formatUnit(minutes, "minute")}`;
}

function formatShiftStartsWithin(time: string | null) {
  if (time === null) return "Otherwise";

  const [hours, minutes] = time.split(":").map(Number);

  return formatTime(hours, minutes);
}

function formatExpiresAfter(duration: string) {
  if (!duration) return "";

  if (duration.includes(" ")) {
    const [days] = duration.split(" ");
    return formatUnit(Number(days), "day");
  }

  const [hours, minutes] = duration.split(":").map(Number);

  return formatTime(hours, minutes);
}
