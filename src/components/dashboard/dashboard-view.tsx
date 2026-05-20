import React from "react";
import { Button } from "../ui/button";
import { CandidateTopCards } from "./candidate-top-card";

export default function DashboardView() {
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Hi, Admin Client 👋</h1>
          <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-lg font-semibold">
            Current Week Stats
          </span>
        </div>
        <Button className="px-3 py-6 text-lg">Create Shift(s)</Button>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <CandidateTopCards
          lightColor="#fff6e5"
          solidColor="#a47016"
          chartTitle="Pending Shifts"
          chartValue="0"
        />
        <CandidateTopCards
          lightColor="#dbeafe"
          solidColor="#193cb8"
          chartTitle="Booked Shifts"
          chartValue="0"
        />
        <CandidateTopCards
          lightColor="#dbfce7"
          solidColor="#016630"
          chartTitle="Worked Shifts"
          chartValue="0"
        />
        <CandidateTopCards
          lightColor="#fde2e3"
          solidColor="#d32f2f"
          chartTitle="Hours Completed"
          chartValue="0"
        />
      </div>
    </div>
  );
}
