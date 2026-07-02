import { CustomBreadcrumbs } from "../common/custom-breadcrums";

export default function Analytics() {
  return (
    <div>
      <div className="mb-4">
        <CustomBreadcrumbs
          heading="Analytics"
          links={[
            { name: "Dashboard", href: "/dashboard" },
            { name: "Analytics" },
          ]}
        />
      </div>
    </div>
  );
}
