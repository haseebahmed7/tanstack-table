"use client";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { FiEye } from "react-icons/fi";
import { PiSquaresFour } from "react-icons/pi";
import { RxDividerVertical } from "react-icons/rx";

type Shift = {
  id: string;
  shiftType: string;
  location: {
    title: string;
  } | null;
  date: string;
  startDatetime: string;
  endDatetime: string;
  level: string;
  status: string;
  isAutomated: boolean;
  candidate: {
    fullName: string;
  } | null;
};

export default function TanstackTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const data = useMemo<Shift[]>(
    () => [
      {
        id: "REQ-001",
        shiftType: "Morning Shift",
        location: {
          title: "Lahore",
        },
        date: "2024-01-15",
        startDatetime: "08:00:00",
        endDatetime: "16:00:00",
        level: "MRI",
        status: "PENDING",
        isAutomated: true,
        candidate: {
          fullName: "Ali Khan",
        },
      },
      {
        id: "REQ-002",
        shiftType: "Night Shift",
        location: {
          title: "Karachi",
        },
        date: "2024-01-16",
        startDatetime: "20:00:00",
        endDatetime: "04:00:00",
        level: "CT",
        status: "BOOKED",
        isAutomated: false,
        candidate: {
          fullName: "Ahmed Raza",
        },
      },
      {
        id: "REQ-003",
        shiftType: "Evening Shift",
        location: {
          title: "Lahore",
        },
        date: "2024-01-17",
        startDatetime: "14:00:00",
        endDatetime: "22:00:00",
        level: "General",
        status: "CANCELLED",
        isAutomated: false,
        candidate: {
          fullName: "Michael",
        },
      },
    ],
    [],
  );

  const columnHelper = createColumnHelper<Shift>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "Request Id",
        cell: ({ getValue }) => getValue(),
      }),

      columnHelper.accessor("shiftType", {
        header: "Shift Type",
        cell: ({ getValue }) => getValue(),
      }),

      columnHelper.accessor((row) => row.location?.title ?? "", {
        id: "location",
        header: "Location",
        cell: ({ getValue }) => getValue(),
        filterFn: "includesString",
      }),

      columnHelper.accessor("date", {
        header: "Date & Time",
        cell: ({ row }) => {
          const date = row.original.date;
          const start = row.original.startDatetime;
          const end = row.original.endDatetime;

          return (
            <div>
              <div>{date}</div>
              <div>
                {start} - {end}
              </div>
            </div>
          );
        },
      }),

      columnHelper.accessor("level", {
        header: "Level",
        cell: ({ getValue }) => getValue(),
        filterFn: "includesString",
      }),

      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ getValue }) => getValue(),
        filterFn: "includesString",
      }),

      columnHelper.accessor("isAutomated", {
        header: "Process",
        cell: ({ getValue }) =>
          getValue() ? (
            <img src="/automation.png" alt="automation icon" />
          ) : (
            <img src="/candidate-selection.png" alt="select candidate icon" />
          ),
      }),

      columnHelper.accessor((row) => row.candidate?.fullName, {
        header: "Candidate",
        cell: ({ getValue }) => getValue(),
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          return (
            <button
              onClick={() => {
                console.log("View clicked:", row.original);
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              <FiEye size={17} />
            </button>
          );
        },
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const locations = Array.from(new Set(data.map((d) => d.location?.title)));

  const statuses = Array.from(new Set(data.map((d) => d.status)));

  const levels = Array.from(new Set(data.map((d) => d.level)));

  return (
    <div className="m-8 rounded-md shadow-md overflow-hidden space-y-3 border-t border-gray-200">
      <div className="flex mt-4">
        <div className="flex items-center ml-4">
          <PiSquaresFour size={25} />
          <RxDividerVertical size={25} className="text-gray-300" />
        </div>
        <div className="ml-1 flex gap-3 text-gray-500">
          <input
            type="text"
            placeholder="Type to search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="shadow-sm shadow-green-300 rounded-md px-3 py-1.5 w-64 
             focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Location */}
          <select
            value={
              (table.getColumn("location")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table.getColumn("location")?.setFilterValue(e.target.value)
            }
            className="border border-gray-300 rounded-md px-2 py-1.5 
             focus:outline-none"
          >
            <option value="">Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table.getColumn("status")?.setFilterValue(e.target.value)
            }
            className="border border-gray-300 rounded-md px-2 py-1.5 
             focus:outline-none"
          >
            <option value="">Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* Level */}
          <select
            value={(table.getColumn("level")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("level")?.setFilterValue(e.target.value)
            }
            className="border border-gray-300 rounded-md px-2 py-1.5 
             focus:outline-none"
          >
            <option value="">Levels</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              table.resetColumnFilters();
              table.resetGlobalFilter();
              setGlobalFilter("");
            }}
            disabled={
              !table.getState().columnFilters.length &&
              !table.getState().globalFilter
            }
            className="border px-2 py-1 rounded bg-gray-50 disabled:opacity-30"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="h-12 bg-[#F4F6F8] shadow-sm">
            {table.getHeaderGroups().map((headergroup) => (
              <tr key={headergroup.id}>
                {headergroup.headers.map((header) => (
                  <th key={header.id} className="text-left px-4">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-300">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
