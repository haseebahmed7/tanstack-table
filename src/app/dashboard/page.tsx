import LoginForm from "@/components/uth/login-form";
import Navbar from "@/components/dashboard/navbar";
import ShadeCnTanstackTable from "@/components/dashboard/shadeCn-tanstack-table";
import TanstackTable from "@/components/dashboard/tanstack-table";
import CreateShift from "@/components/dashboard/create-shift-dialog";

export default function Page() {
  return (
    <div className="px-8 py-3">
      {/* <TanstackTable /> */}

      <Navbar />
      {/* <CreateShift /> */}
      <ShadeCnTanstackTable />
    </div>
  );
}
