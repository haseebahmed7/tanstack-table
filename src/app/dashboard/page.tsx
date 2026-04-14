import LoginForm from "@/components/uth/login-form";
import Navbar from "@/components/navbar";
import ShadeCnTanstackTable from "@/components/shadeCn-tanstack-table";
import TanstackTable from "@/components/tanstack-table";

export default function Page() {
  return (
    <div>
      {/* <TanstackTable /> */}

      <Navbar />
      <ShadeCnTanstackTable />
    </div>
  );
}
