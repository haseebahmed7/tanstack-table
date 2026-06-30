"use client";
import {
  useCreateLocation,
  useDeleteLocation,
  useGetLocations,
  useUpdateLocation,
} from "@/lib/requests/company/api";
import { AppTable } from "./components/app-table";
import { PhoneNumberDisplay } from "./components/phone-number-display";
import { useConfirmDelete } from "./components/hook/confimation-dialog-hook";
import { ConfirmationDialog } from "./components/confirmation-dialog";
import AddLocationDialog from "./components/add-location-dialog";
import { useState } from "react";
import { Location } from "@/lib/requests/company/types";

export default function CoreSetup() {
  const [editRow, setEditRow] = useState<Location | null>(null);
  const [addLocationOpen, setAddLocationOpen] = useState(false);

  const { data: locationList, isLoading: isLocationListLoading } =
    useGetLocations();
  const { mutateAsync: deleteLocationMut, isPending: isDeleteLocationLoading } =
    useDeleteLocation();

  const { open, askDelete, close, confirm, selected } =
    useConfirmDelete(deleteLocationMut);

  const locationHeaders = [
    { accessor: "title", header: "Location" },
    { accessor: "address", header: "Address" },
    {
      accessor: "zipCode",
      header: "Post Code",
      className: "text-center w-[20%]",
    },
    {
      accessor: "phoneNumber",
      header: "Phone",
      cell: (row: any) => <PhoneNumberDisplay value={row.phoneNumber} />,
    },
  ];

  return (
    <div>
      <AppTable
        title="Locations"
        data={locationList?.data?.results || []}
        isLoading={isLocationListLoading}
        button={{
          title: "Add Locations",
          onClick: () => setAddLocationOpen(true),
        }}
        columns={locationHeaders}
        action={true}
        onEdit={(row) => {
          setEditRow(row);
          setAddLocationOpen(true);
        }}
        onDelete={askDelete}
      />

      <ConfirmationDialog
        open={open}
        onClose={close}
        onConfirm={confirm}
        loading={isDeleteLocationLoading}
        message={
          selected
            ? `Are you sure you want to delete location ${selected.title}?`
            : undefined
        }
      />

      <AddLocationDialog
        open={addLocationOpen}
        onClose={() => {
          setAddLocationOpen(false);
          setEditRow(null);
        }}
        locationDetail={editRow}
        setLocationDetail={setEditRow}
      />
    </div>
  );
}
