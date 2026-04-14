"use client";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  ColumnFiltersState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { FiEye } from "react-icons/fi";
import { PiSquaresFour } from "react-icons/pi";
import { RxDividerVertical } from "react-icons/rx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { shiftData } from "@/dataBase/shift-management/shift";
import { statusColors } from "@/dataBase/constants/status-colors";

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

export default function ShadeCnTanstackTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // Global filter → text input
  // Column filters → Select inputs

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const data: Shift[] = shiftData;

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
        filterFn: (row, columnId, value) => {
          if (!value) return true;

          const rowDate = row.original.date;

          const [day, month, year] = rowDate.split("-");
          const formatted = `${year}-${month}-${day}`;

          return formatted === value;
        },
      }),

      columnHelper.accessor("level", {
        header: "Level",
        cell: ({ getValue }) => (
          <span className="px-2 py-1 bg-gray-100 text-gray-800  rounded-sm">
            {getValue()}
          </span>
        ),
        filterFn: "includesString",
      }),

      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ getValue }) => {
          const value = getValue();
          const color = statusColors[value];
          return (
            <span
              className={`px-2 py-1 rounded-sm font-semibold ${color.bg} ${color.text}`}
            >
              {value}
            </span>
          );
        },
        filterFn: "includesString",
      }),

      columnHelper.accessor("isAutomated", {
        header: "Process",
        cell: ({ getValue }) =>
          getValue() ? (
            <img src="/automation.svg" alt="automation icon" />
          ) : (
            <img src="/candidate_selection.svg" alt="Select candidate icon" />
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
      pagination,
    },

    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const locations = Array.from(new Set(data.map((d) => d.location?.title)));

  const statuses = Array.from(new Set(data.map((d) => d.status)));

  const levels = Array.from(new Set(data.map((d) => d.level)));

  const hasFilters =
    table.getState().columnFilters.length > 0 ||
    !!table.getState().globalFilter;

  // Pagination code Block
  const start = pagination.pageIndex * pagination.pageSize + 1;
  const end = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    table.getFilteredRowModel().rows.length,
  );
  const total = table.getFilteredRowModel().rows.length;

  return (
    <div className="m-8 rounded-md shadow-md overflow-hidden space-y-3 border-t border-gray-200">
      <div className="flex mt-4">
        <div className="flex items-center ml-4">
          <PiSquaresFour size={20} className="text-gray-600" />
          <RxDividerVertical size={25} className="text-gray-300" />
        </div>
        <div className="ml-1 flex gap-3 text-gray-500">
          <Input
            placeholder="Type to search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-64 border border-green-300 focus-visible:ring-2 focus-visible:ring-green-300"
          />

          <Input
            type="date"
            placeholder="Shift Date"
            value={(table.getColumn("date")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("date")?.setFilterValue(e.target.value)
            }
            className="w-40"
          />

          {/* Location */}
          <Select
            value={
              (table.getColumn("location")?.getFilterValue() as string) ?? ""
            }
            onValueChange={(value) =>
              table.getColumn("location")?.setFilterValue(value)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Locations" />
            </SelectTrigger>
            <SelectContent position="popper">
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc ?? ""}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status */}
          <Select
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? ""
            }
            onValueChange={(value) =>
              table.getColumn("status")?.setFilterValue(value)
            }
          >
            <SelectTrigger className="w-40">
              {(() => {
                const selected = table
                  .getColumn("status")
                  ?.getFilterValue() as string;

                if (!selected) {
                  return <span>Status</span>;
                }

                const color = statusColors[selected];

                return (
                  <span
                    className={`px-2 py-1 rounded-sm font-semibold ${color.bg} ${color.text}`}
                  >
                    {selected}
                  </span>
                );
              })()}
            </SelectTrigger>

            <SelectContent position="popper">
              {statuses.map((status) => {
                const color = statusColors[status];
                return (
                  <SelectItem
                    key={status}
                    value={status}
                    className={`rounded-none ${color.bg} ${color.text}`}
                  >
                    {status}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Level */}
          <Select
            value={(table.getColumn("level")?.getFilterValue() as string) ?? ""}
            onValueChange={(value) =>
              table.getColumn("level")?.setFilterValue(value)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Levels" />
            </SelectTrigger>
            <SelectContent position="popper">
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button
              onClick={() => {
                table.resetColumnFilters();
                table.resetGlobalFilter();
                setGlobalFilter("");
              }}
              disabled={
                !table.getState().columnFilters.length &&
                !table.getState().globalFilter
              }
              variant={"outline"}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden">
        <Table className="w-full table-fixed">
          <TableHeader className="h-12 font-bold bg-[#F4F6F8] shadow-sm">
            {table.getHeaderGroups().map((headergroup) => (
              <TableRow key={headergroup.id}>
                {headergroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4 font-semibold">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="">
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between m-3">
          {/* Current page info */}
          {/* <div className="text-gray-500">
            Showing Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </div> */}

          <div className="text-gray-500">
            Showing Page {start} to {end} of {total}
          </div>

          <div className="flex">
            {/* Rows per page selector */}
            <Field orientation="horizontal" className="w-fit">
              <FieldLabel htmlFor="select-rows-per-page">
                Rows per page
              </FieldLabel>
              <Select
                value={pagination.pageSize.toString()}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    {[10, 20, 30, 40, 50].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            {/* Pagination buttons */}
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => table.previousPage()}
                    className={
                      !table.getCanPreviousPage()
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }
                  />
                </PaginationItem>

                {/* Page numbers */}
                <PaginationItem>
                  <span className="px-3 py-1">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                  </span>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    onClick={() => table.nextPage()}
                    className={
                      !table.getCanNextPage()
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
