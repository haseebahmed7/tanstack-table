import React from "react";
import { CustomBreadcrumbs } from "../common/custom-breadcrums";

export default function RotaPlanner() {
  return (
    <div>
      <div className="mb-4">
        <CustomBreadcrumbs
          heading="ROTA Planner"
          links={[
            { name: "Dashboard", href: "/dashboard" },
            { name: "ROTA Planner" },
          ]}
        />
      </div>
    </div>
  );
}
