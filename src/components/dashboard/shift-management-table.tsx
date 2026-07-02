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
import { useState, useMemo, useEffect } from "react";
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
} from "../ui/select";
import { statuses, levels, locations } from "@/dataBase/shift-management/shift";
import { statusColors } from "@/dataBase/statusColors/status-colors";
import { Shift } from "../types/table-types";
import CreateShiftDialog from "./create-shift-dialog";
import ViewShiftDialog from "./view-shift-dialog";
import { CustomBreadcrumbs } from "../common/custom-breadcrums";
import {
  Ban,
  Calendar,
  CheckCircle,
  Clock,
  Timer,
  UserCheck,
  UserCog,
  UserX,
  X,
} from "lucide-react";
import GenericTabs from "../common/generic-tabs";

export default function ShiftManagement() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // initialized with empty array ---
  const [shifts, setShifts] = useState<Shift[]>([]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [activeTab, setActiveTab] = useState("all");
  const tabs = [
    { value: "all", label: "All Shifts", icon: <Calendar size={16} /> },
    { value: "pending", label: "Pending", icon: <Clock size={16} /> },
    { value: "booked", label: "Booked", icon: <CheckCircle size={16} /> },
    { value: "worked", label: "Worked", icon: <UserCheck size={16} /> },
    { value: "cancelled", label: "Cancelled", icon: <X size={16} /> },
    { value: "declined", label: "Declined", icon: <Ban size={16} /> },
    {
      value: "not_assigned",
      label: "Not Assigned",
      icon: <UserCog size={16} />,
    },
    { value: "time_out", label: "Time Out", icon: <Timer size={16} /> },
    { value: "not_attended", label: "Not Attended", icon: <UserX size={16} /> },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    table.getColumn("status")?.setFilterValue(value === "all" ? "" : value);
  };

  useEffect(() => {
    const savedShifts = localStorage.getItem("shifts");
    if (savedShifts) {
      const parsed = JSON.parse(savedShifts);
      parsed.sort((a: Shift, b: Shift) => a.date.localeCompare(b.date));
      setShifts(parsed);
    }
  }, []);

  // useEffect(() => {
  //   const alreadyReset = localStorage.getItem("reset_done");

  //   if (!alreadyReset) {
  //     localStorage.removeItem("shifts");
  //     localStorage.setItem("reset_done", "true");
  //   }
  // }, []);

  const data: Shift[] = shifts;
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
        cell: ({ row }) => (
          <div>
            {/* Agar aapne format badalna hai (DD/MM/YYYY) */}
            <div className="font-medium">
              {row.original.date.split("-").reverse().join("/")}
            </div>
            <div className="text-xs text-gray-500">
              {row.original.startDatetime} - {row.original.endDatetime}
            </div>
          </div>
        ),
        // Filter function for YYYY-MM-DD
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          return row.original.date === filterValue; // Exact match for date
        },
      }),
      columnHelper.accessor("level", {
        header: () => <div className="text-center">Level</div>,
        cell: ({ getValue }) => (
          <div className="flex justify-center">
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-sm">
              {getValue()}
            </span>
          </div>
        ),
        filterFn: "includesString",
      }),
      columnHelper.accessor("status", {
        header: () => <div className="text-center">Status</div>,
        cell: ({ getValue }) => {
          const value = (getValue() || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "_");
          const color = statusColors[value] || {
            bg: "bg-gray-100",
            text: "text-gray-600",
          };

          return (
            <div className="flex justify-center">
              <span
                className={`px-2 py-1 rounded-sm font-semibold ${color.bg} ${color.text} capitalize`}
              >
                {value}
              </span>
            </div>
          );
        },
        filterFn: "includesString",
      }),
      columnHelper.accessor("isAutomated", {
        header: () => <div className="text-center">Process</div>,
        cell: ({ getValue }) => (
          <div className="flex justify-center">
            {getValue() ? (
              <img src="/automation.svg" alt="automation icon" />
            ) : (
              <img src="/candidate_selection.svg" alt="candidate icon" />
            )}
          </div>
        ),
      }),
      columnHelper.accessor((row) => row.candidate?.fullName, {
        header: "Candidate",
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => {
              setSelectedShift(row.original);
              setIsOpen(true);
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <FiEye size={17} />
          </button>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnFilters, pagination },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const hasFilters =
    table.getState().columnFilters.length > 0 ||
    !!table.getState().globalFilter;
  const start = pagination.pageIndex * pagination.pageSize + 1;
  const end = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    table.getFilteredRowModel().rows.length,
  );
  const total = table.getFilteredRowModel().rows.length;

  return (
    <>
      <div className="mb-4">
        <CustomBreadcrumbs
          heading="Shift Management"
          links={[
            { name: "Dashboard", href: "/dashboard" },
            { name: "Shifts Management" },
          ]}
          action={
            <CreateShiftDialog
              onCreate={(newShift) => {
                const updatedShifts = [newShift, ...shifts];

                // Direct string comparison (Ascending: 2026-05-20 pehle, 2026-05-24 baad mein)
                updatedShifts.sort((a, b) => a.date.localeCompare(b.date));

                setShifts(updatedShifts);
                localStorage.setItem("shifts", JSON.stringify(updatedShifts));
              }}
            />
          }
        />
      </div>

      <GenericTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={handleTabChange}
        statusColors={statusColors}
      />

      <div className="rounded-md shadow-md overflow-hidden space-y-3 border-t border-gray-200">
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
              value={
                (table.getColumn("date")?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn("date")?.setFilterValue(e.target.value)
              }
              className="w-40"
            />
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
            <Select
              value={
                (table.getColumn("status")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value) =>
                table.getColumn("status")?.setFilterValue(value)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent position="popper">
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={
                (table.getColumn("level")?.getFilterValue() as string) ?? ""
              }
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
                variant={"secondary"}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-hidden">
          <Table className="w-full table-fixed">
            <TableHeader className="h-12 font-bold bg-[#F4F6F8]">
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
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-10 text-gray-500"
                  >
                    No Shift Data
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between m-3">
            <div className="text-gray-500">
              Showing {start} to {end} of {total}
            </div>
            <div className="flex">
              <Field orientation="horizontal" className="w-fit">
                <FieldLabel htmlFor="rows">Rows per page</FieldLabel>
                <Select
                  value={pagination.pageSize.toString()}
                  onValueChange={(value) => table.setPageSize(Number(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {[10, 20, 30].map((s) => (
                        <SelectItem key={s} value={s.toString()}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
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
                  <PaginationItem>
                    <span className="px-3">
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
      <ViewShiftDialog
        open={isOpen}
        shift={selectedShift}
        onOpenChange={setIsOpen}
      />
    </>
  );
}
