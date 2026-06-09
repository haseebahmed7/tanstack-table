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
import { Candidate, Shift } from "../types/shift";
import CreateShiftDialog from "./create-shift-dialog";
import ViewShiftDialog from "./view-shift-dialog";
import { CustomBreadcrumbs } from "../custom-breadcrums";
import { Eye, Mail, Users } from "lucide-react";
import GenericTabs from "../common/generic-tabs";
import { IoLocationOutline } from "react-icons/io5";

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
    { value: "all", label: "All Candidates", icon: <Users size={16} /> },
    { value: "invitation", label: "Invitation", icon: <Mail size={16} /> },
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

  const data: Shift[] = shifts;
  const columnHelper = createColumnHelper<Candidate>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "Candidate Id",
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("name", {
        header: "Candidate Name",
        cell: ({ getValue }) => getValue(),
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
      columnHelper.accessor((row) => row.location?.title ?? "", {
        id: "location",
        header: "Location",
        cell: ({ getValue }) => getValue(),
        filterFn: "includesString",
      }),
      columnHelper.accessor("rankTitle", {
        header: "Rank Title",
        cell: ({ getValue }) => (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-sm">
            {getValue()}
          </span>
        ),
        filterFn: "includesString",
      }),
      columnHelper.accessor("rankScore", {
        header: "Rank Score",
        cell: ({ getValue }) => (
          <div className="ml-6">
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-sm">
              {getValue()}
            </span>
          </div>
        ),
        filterFn: "includesString",
      }),
      columnHelper.accessor("availability", {
        header: "Availability",
        cell: ({ getValue }) => (
          <div className="ml-6">
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-sm">
              {getValue()}
            </span>
          </div>
        ),
        filterFn: "includesString",
      }),
      columnHelper.accessor("documents", {
        header: "Documents",
        cell: ({ getValue }) => (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-sm">
            {getValue()}
          </span>
        ),
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
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            title="View candidate details"
            className=" hover:bg-blue-50 hover:text-blue-700"
            onClick={() => {
              setSelectedShift(row.original);
              setIsOpen(true);
            }}
          >
            <Eye className="h-4 w-4 text-sky-400" />
            <span className="sr-only">View</span>
          </Button>
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
          heading="Candidates"
          links={[
            { name: "Dashboard", href: "/dashboard" },
            { name: "Candidates" },
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
            <Select
              value={
                (table.getColumn("level")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value) =>
                table.getColumn("level")?.setFilterValue(value)
              }
            >
              <SelectTrigger className="w-40">
                <div className="flex items-center gap-2">
                  <IoLocationOutline className="text-gray-500 text-lg" />

                  <SelectValue placeholder="Levels" />
                </div>
              </SelectTrigger>
              <SelectContent position="popper">
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
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
                (table.getColumn("location")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value) =>
                table.getColumn("location")?.setFilterValue(value)
              }
            >
              <SelectTrigger className="w-26">
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
