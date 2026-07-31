import { createColumnHelper } from "@tanstack/react-table";
import { FiEye } from "react-icons/fi";
import { Shift } from "@/lib/requests/shift-management/types";
import {
  getStatusLabel,
  statusBadgeClasses,
  ShiftStatus,
} from "@/lib/requests/shift-management/utils";
import { fDate, formatStr, fTime } from "@/lib/format-date";

const columnHelper = createColumnHelper<Shift>();

export const columns = (onView: (shift: Shift) => void) => [
  columnHelper.accessor("no", {
    header: "Request ID",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("shiftTypeTitle", {
    header: "Shift Type",
  }),

  columnHelper.accessor((row) => row.location?.title ?? "-", {
    id: "location",
    header: "Location",
  }),

  columnHelper.accessor("date", {
    header: "Date & Time",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{fDate(row.original.date)}</div>

        <div className="text-xs text-gray-500">
          {fTime(row.original.startDatetime, formatStr.time12h)} -{" "}
          {fTime(row.original.endDatetime, formatStr.time12h)}
        </div>
      </div>
    ),
  }),

  columnHelper.accessor("level", {
    header: () => <div className="text-center">Level</div>,
    cell: (info) => (
      <div className="flex justify-center">
        <span className="rounded bg-gray-100 px-2 py-1">{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor("status", {
    header: () => <div className="text-center">Status</div>,
    cell: ({ getValue }) => {
      const status = getValue() as ShiftStatus;

      return (
        <div className="flex justify-center">
          <span
            className={`rounded-sm px-2 py-1 font-medium ${
              statusBadgeClasses[status]
            }`}
          >
            {getStatusLabel(status)}
          </span>
        </div>
      );
    },
  }),

  columnHelper.accessor("isAutomated", {
    header: () => <div className="text-center">Process</div>,
    cell: (info) => (
      <div className="flex justify-center">
        {info.getValue() ? (
          <img src="/automation.svg" alt="Automation" className="h-5 w-5" />
        ) : (
          <img
            src="/candidate_selection.svg"
            alt="Manual"
            className="h-5 w-5"
          />
        )}
      </div>
    ),
  }),

  columnHelper.accessor((row) => row.candidate?.fullName ?? "N/A", {
    id: "candidate",
    header: "Candidate",
  }),

  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <button
        onClick={() => onView(row.original)}
        className="text-blue-600 hover:text-blue-800"
      >
        <FiEye size={18} />
      </button>
    ),
  }),
];
