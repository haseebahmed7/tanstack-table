import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

type Column = {
  header: string;
  accessor: string;
  cell?: (row: any) => React.ReactNode;
  className?: string;
};

type AppTableProps = {
  title?: string;
  placeholder?: string;
  button?: {
    title: string;
    onClick: () => void;
  };
  secondaryButton?: {
    title: React.ReactNode;
    onClick: () => void;
  };
  columns: Column[];
  data?: any[];
  isLoading?: boolean;
  action?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  className?: string;
};

export function AppTable({
  title,
  placeholder,
  button,
  secondaryButton,
  columns,
  data,
  isLoading = false,
  action = false,
  onEdit,
  onDelete,
  className,
}: AppTableProps) {
  return (
    <Card
      className={cn(
        "rounded-md shadow-lg overflow-hidden border-t border-gray-200 pt-6 pb-3 mb-4",
        className,
      )}
    >
      <div className="flex justify-between items-center px-4">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{placeholder}</p>
        </div>
        <div className="flex">
          {secondaryButton && (
            <Button
              variant={"outline"}
              className="h-10 py-2 px-4 text-md mr-2"
              onClick={secondaryButton.onClick}
            >
              {secondaryButton.title}
            </Button>
          )}

          {button && (
            <Button className="h-10 py-2 px-4 text-md" onClick={button.onClick}>
              {button.title}
            </Button>
          )}
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <Table>
          {/* HEADER */}
          <TableHeader className="h-12 font-bold bg-[#F4F6F8] w-full">
            <TableRow>
              {columns.map((col, i) => (
                <TableHead
                  key={i}
                  className={cn(
                    "font-semibold text-gray-900 text-[14px]",
                    col.className,
                  )}
                >
                  {col.header}
                </TableHead>
              ))}

              {action && (
                <TableHead className="text-right text-[16px] font-semibold text-gray-900 pr-6">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (action ? 1 : 0)}
                  className="text-center text-lg py-15 text-gray-500"
                >
                  Loading Data...
                </TableCell>
              </TableRow>
            ) : data?.length ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex} className={col.className}>
                      {col.cell ? col.cell(row) : row[col.accessor]}
                    </TableCell>
                  ))}

                  {action && (
                    <TableCell className="text-right space-x-2">
                      {onEdit && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(row)}
                        >
                          <Pencil />
                        </Button>
                      )}

                      {onDelete && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDelete(row)}
                        >
                          <Trash2 />
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (action ? 1 : 0)}
                  className="text-center text-lg py-15 text-gray-500"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
