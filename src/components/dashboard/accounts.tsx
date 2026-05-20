import { CustomBreadcrumbs } from "../custom-breadcrums";

export default function Accounts() {
  return (
    <div>
      <div className="mb-4">
        <CustomBreadcrumbs
          heading="Accounts & Payroll"
          links={[
            { name: "Dashboard", href: "/dashboard" },
            { name: "Accounts & Payroll" },
          ]}
        />
      </div>
    </div>
  );
}
