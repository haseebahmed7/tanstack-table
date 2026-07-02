"use client";
import {
  useDeleteLocation,
  useGetLocations,
} from "@/lib/requests/core-setup/locations/api";
import { AppTable } from "./components/app-table";
import { PhoneNumberDisplay } from "./components/phone-number-display";
import { useConfirmDelete } from "./components/hook/confimation-dialog-hook";
import { DeleteConfirmationDialog } from "./components/confirmation-dialog";
import AddLocationDialog from "./components/add-location-dialog";
import { useState } from "react";
import { Location } from "@/lib/requests/core-setup/locations/types";
import { AddGradeDialog } from "./components/salary-band-dialog";
import { Grade } from "@/lib/requests/core-setup/salary-band/types";
import {
  useDeleteGrade,
  useGetGrades,
} from "@/lib/requests/core-setup/salary-band/api";
import { Ban, Clock, FileText, Flag, HelpCircle, UserX, X } from "lucide-react";
import {
  useDeleteRanks,
  useGetRanks,
} from "@/lib/requests/core-setup/ranks/api";
import { Rank } from "@/lib/requests/core-setup/ranks/type";
import { Avatar } from "./components/user-avatar";
import { AddRankDialog } from "./components/rank-dialog";
import { HowRanksWorkDialog } from "./components/howRankWorkDialog";
import { Reason } from "@/lib/requests/core-setup/reasons/type";
import GenericTabs from "../common/generic-tabs";
import {
  useDeleteReason,
  useGetReasons,
} from "@/lib/requests/core-setup/reasons/api";

export default function CoreSetup() {
  const [editLocation, setEditLocation] = useState<Location | null>(null);
  const [editGrade, setEditGrade] = useState<Grade | null>(null);
  // const [editLevel, setEditLevel] = useState<Level | null>(null);
  const [editRank, setEditRank] = useState<Rank | null>(null);
  const [editReason, setEditReason] = useState<Reason | null>(null);

  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [levelDialogOpen, setLevelDialogOpen] = useState(false);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [rankDialogOpen, setRankDialogOpen] = useState(false);
  const [howRankWorkDialog, setHowRankWorkDialog] = useState(false);
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("document_rejected");
  const deleteDialog = useConfirmDelete();

  const { data: locationList, isLoading: isLocationListLoading } =
    useGetLocations();
  const { mutateAsync: deleteLocation } = useDeleteLocation();

  const { data: gradeList, isLoading: isGradeListLoading } = useGetGrades();
  const { mutateAsync: deleteGrade } = useDeleteGrade();

  const { data: rankList, isLoading: isRankListLoading } = useGetRanks();
  const { mutateAsync: deleteRank } = useDeleteRanks();

  const { data: reasonList, isLoading: isReasonkListLoading } = useGetReasons();
  console.log("Reason Data:", reasonList);
  const { mutateAsync: deleteReason } = useDeleteReason();

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
  const levelHeaders = [
    { accessor: "title", header: "Level" },
    { accessor: "salaryBand", header: "Salary Band Required" },
    {
      accessor: "rateRule",
      header: "Rate Rule",
      // className: "text-center w-[20%]",
    },
  ];
  const salaryBand = [{ accessor: "title", header: "Salary Band" }];
  const ranks = [
    {
      accessor: "title",
      header: "Rank",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Avatar src={row.iconUrl} name={row.title} />
          <span>{row.title}</span>
        </div>
      ),
    },
    { accessor: "minScore", header: "Score", className: "text-center w-[50%]" },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const reasonsHeader = [{ accessor: "message", header: "Message" }];

  const reasonTabs = [
    {
      value: "document_rejected",
      label: "Company - Document Rejected",
      icon: <X className="h-4 w-4" />,
    },
    {
      value: "shift_cancelled_client",
      label: "Company - Shift Cancelled",
      icon: <Ban className="h-4 w-4" />,
    },
    {
      value: "shift_reason",
      label: "Company - Shift Reason",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      value: "shift_cancelled_candidate",
      label: "Candidate - Shift Cancelled",
      icon: <UserX className="h-4 w-4" />,
    },
    {
      value: "shift_declined",
      label: "Candidate - Shift Declined",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      value: "shift_report_reason",
      label: "Candidate - Shift Report Reason",
      icon: <Flag className="h-4 w-4" />,
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
          onClick: () => setLocationDialogOpen(true),
        }}
        columns={locationHeaders}
        action={true}
        onEdit={(row) => {
          setEditLocation(row);
          setLocationDialogOpen(true);
        }}
        onDelete={(row) =>
          deleteDialog.askDelete({
            message: `Are you sure you want to delete location "${row.title}"?`,
            action: () => deleteLocation(row.id),
          })
        }
      />

      <AppTable
        title="Levels"
        placeholder="Use levels to mirror your organisation's real structure – from site to team to role.
        This ensures shifts are booked correctly and candidates are matched accurately."
        // data={locationList?.data?.results || []}
        isLoading={isLocationListLoading}
        button={{
          title: "Add Top Level",
          onClick: () => setLevelDialogOpen(true),
        }}
        columns={levelHeaders}
        action={true}
        onEdit={(row) => {
          // setEditLevel(row);
          setLevelDialogOpen(true);
        }}
        // onDelete={(row) =>
        //   deleteDialog.askDelete({
        //     message: `Are you sure you want to delete level "${row.title}"?`,
        //     action: () => deleteLevelMut(row.id),
        //   })
        // }
      />

      <AppTable
        title="Salary Band"
        data={gradeList?.data?.results || []}
        isLoading={isGradeListLoading}
        button={{
          title: "Add Salary Band",
          onClick: () => setGradeDialogOpen(true),
        }}
        columns={salaryBand}
        action={true}
        onEdit={(row) => {
          setEditGrade(row);
          setGradeDialogOpen(true);
        }}
        onDelete={(row) =>
          deleteDialog.askDelete({
            message: `Are you sure you want to delete salary band "${row.title}"?`,
            action: () => deleteGrade(row.id),
          })
        }
      />

      <AppTable
        title="Ranks"
        data={rankList?.data?.results || []}
        isLoading={isRankListLoading}
        button={{
          title: "Add Rank",
          onClick: () => setRankDialogOpen(true),
        }}
        secondaryButton={{
          title: (
            <span className="flex items-center gap-3">
              <HelpCircle className="h-4 w-4" />
              How Ranks Work?
            </span>
          ),
          onClick: () => setHowRankWorkDialog(true),
        }}
        columns={ranks}
        action={true}
        onEdit={(row) => {
          setEditRank(row);
          setRankDialogOpen(true);
        }}
        onDelete={(row) =>
          deleteDialog.askDelete({
            message: `Are you sure you want to delete Rank "${row.title}"?`,
            action: () => deleteRank(row.id),
          })
        }
      />

      <GenericTabs
        tabs={reasonTabs}
        activeTab={activeTab}
        onChange={handleTabChange}
        // isScrollable={true}
      />

      <AppTable
        title="Reasons"
        data={
          reasonList?.data?.results?.filter(
            (reason: Reason) => reason.type === activeTab,
          ) || []
        }
        isLoading={isReasonkListLoading}
        button={{
          title: "Add Reason",
          onClick: () => setReasonDialogOpen(true),
        }}
        columns={reasonsHeader}
        action={true}
        onEdit={(row) => {
          setEditReason(row);
          setReasonDialogOpen(true);
        }}
        onDelete={(row) =>
          deleteDialog.askDelete({
            message: `Are you sure you want to delete Reason "${row.title}"?`,
            action: () => deleteReason(row.id),
          })
        }
      />

      <AddLocationDialog
        open={locationDialogOpen}
        onClose={() => {
          setLocationDialogOpen(false);
          setEditLocation(null);
        }}
        locationDetail={editLocation}
        setLocationDetail={setEditLocation}
      />
      <AddGradeDialog
        open={gradeDialogOpen}
        onClose={() => {
          setGradeDialogOpen(false);
          setEditGrade(null);
        }}
        gradeDetail={editGrade}
        setGradeDetail={setEditGrade}
      />

      <AddRankDialog
        open={rankDialogOpen}
        onClose={() => {
          setRankDialogOpen(false);
          setEditRank(null);
        }}
        rankDetails={editRank}
        setRankDetail={setEditRank}
      />

      <HowRanksWorkDialog
        open={howRankWorkDialog}
        onClose={() => {
          setHowRankWorkDialog(false);
        }}
      />

      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onClose={deleteDialog.close}
        onConfirm={deleteDialog.confirm}
        loading={deleteDialog.loading}
        message={deleteDialog.message}
      />
    </div>
  );
}
