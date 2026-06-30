"use client";

import { Shift } from "../types/table-types";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

type ViewShiftProps = {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  shift: Shift | null;
};

export default function ViewShiftDialog({
  open,
  onOpenChange,
  shift,
}: ViewShiftProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-3xl w-full p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Shift Information
          </DialogTitle>
        </DialogHeader>

        {!shift ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-4 text-sm">
            {/* TOP INFO */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                Request ID: <b>{shift.id}</b>
              </div>
              <div>
                Booking Status: <b>{shift.status}</b>
              </div>
              <div>
                Candidate: <b>{shift.candidate?.fullName}</b>
              </div>
              <div>
                <b>Location:</b> {shift.location?.title}
              </div>
              <div>
                Created By: <b>Admin Client</b>
              </div>
            </div>

            <hr />

            {/* MAIN DETAILS GRID */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                Shift Type: <b>{shift.shiftType}</b>
              </div>
              <div>
                Start Time: <b>{shift.startDatetime}</b>
              </div>

              <div>
                Level: <b>{shift.level}</b>
              </div>
              <div>
                End Time: <b>{shift.endDatetime}</b>
              </div>

              <div>
                Salary Band: <b>Band 7</b>
              </div>
              <div>
                Break Duration: <b>45 mins</b>
              </div>

              <div>
                Gender: <b>N/A</b>
              </div>
              <div>
                Cost: <b>N/A</b>
              </div>

              <div>
                Date: <b>{shift.date}</b>
              </div>

              <div>
                Shift Reason: <b>Staff Absence Cover</b>
              </div>
            </div>

            {/* Additional Section */}
            <div>
              Additional Job Details:
              <div className="bg-gray-100 p-3 rounded mt-1">
                {shift.details ?? "N/A"}
              </div>
            </div>

            <div>
              Reporting Details:
              <div className="bg-gray-100 p-3 rounded mt-1">
                {shift.reporting ?? "N/A"}
              </div>
            </div>

            {/* Button section */}
            <div className="flex justify-end mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
