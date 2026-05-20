import React from "react";
import { CustomBreadcrumbs } from "../custom-breadcrums";

export default function CalenderView() {
  return (
    <div>
      <div className="mb-4">
        <CustomBreadcrumbs
          heading="Candidates"
          links={[
            { name: "Dashboard", href: "/dashboard" },
            { name: "Candidates" },
          ]}
        />
      </div>
    </div>
  );
}
