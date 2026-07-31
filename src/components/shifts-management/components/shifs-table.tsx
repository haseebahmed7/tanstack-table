"use client";

import { flexRender, Table as TanstackTable } from "@tanstack/react-table";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type ShiftsTableProps<TData> = {
  table: TanstackTable<TData>;
  isLoading?: boolean;
  toolbar?: React.ReactNode;
  pagination?: React.ReactNode;
  className?: string;
  emptyMessage?: string;
  skeletonRows?: number;
};

export function ShiftsTable<TData>({
  table,
  isLoading = false,
  toolbar,
  pagination,
  className,
  emptyMessage = "No shifts found.",
  skeletonRows,
}: ShiftsTableProps<TData>) {
  const TableRowSkeleton = ({
    columns,
    rows = 5,
  }: {
    columns: number;
    rows?: number;
  }) => {
    return (
      <>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={`skeleton-${rowIndex}`} className="animate-pulse">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={`skeleton-${rowIndex}-${colIndex}`}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    );
  };

  return (
    <Card
      className={`rounded-md shadow-md overflow-hidden border-t gap-0 border-gray-200 ${className ?? ""}`}
    >
      {/* Toolbar */}
      {toolbar && <div className="border-b bg-white px-4 py-3">{toolbar}</div>}
      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#F4F6F8]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-3 font-semibold text-gray-900"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRowSkeleton
                columns={table.getVisibleLeafColumns().length}
                rows={skeletonRows}
              />
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-32 text-center text-gray-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      {pagination && <div className="bg-white px-4 py-3">{pagination}</div>}
    </Card>
  );
}
