"use client";

import { useMemo, useState } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useGetShifts } from "@/lib/requests/shift-management/api";
import { Shift } from "@/lib/requests/shift-management/types";
import { columns } from "./components/column";
import { ShiftsTable } from "./components/shifs-table";
import { CustomBreadcrumbs } from "../common/custom-breadcrums";
import { useTableState } from "../hooks/use-table-state";
import { TablePagination } from "./components/table-pagination";

export default function ShiftsManagement() {
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const tableState = useTableState();
  const { data: ShiftsData, isLoading } = useGetShifts(
    tableState.tableState.pageIndex + 1,
    tableState.tableState.pageSize,
  );

  const tableData = ShiftsData?.data?.results ?? [];
  const tableColumns = useMemo(
    () =>
      columns((shift: Shift) => {
        setSelectedShift(shift);
        setIsViewOpen(true);
      }),
    [],
  );

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,

    state: {
      pagination: {
        pageIndex: tableState.tableState.pageIndex,
        pageSize: tableState.tableState.pageSize,
      },
    },

    manualPagination: true,

    pageCount: Math.ceil(
      (ShiftsData?.data?.count ?? 0) / tableState.tableState.pageSize,
    ),

    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id.toString(),
  });

  return (
    <div className="pb-8">
      <div className="mb-4">
        <CustomBreadcrumbs
          heading="Shift Management"
          links={[
            { name: "Dashboard", href: "/dashboard" },
            { name: "Shifts Management" },
          ]}
          // action={
          //   <CreateShiftDialog
          //     onCreate={(newShift) => {
          //       const updatedShifts = [newShift, ...shifts];

          //       // Direct string comparison (Ascending: 2026-05-20 pehle, 2026-05-24 baad mein)
          //       updatedShifts.sort((a, b) => a.date.localeCompare(b.date));

          //       setShifts(updatedShifts);
          //       localStorage.setItem("shifts", JSON.stringify(updatedShifts));
          //     }}
          //   />
          // }
        />
      </div>
      <ShiftsTable
        table={table}
        isLoading={isLoading}
        skeletonRows={tableState.tableState.pageSize}
        pagination={
          <TablePagination
            table={table}
            tableState={tableState}
            totalCount={ShiftsData?.data?.count ?? 0}
          />
        }
      />
      {/* 
      <ViewShiftDialog
        open={isViewOpen}
        shift={selectedShift}
        onOpenChange={setIsViewOpen}
      /> */}
    </div>
  );
}
