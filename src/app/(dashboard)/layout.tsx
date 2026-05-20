import Navbar from "@/components/dashboard/navbar";
import { Sidebar } from "@/components/dashboard/side-bar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar on the left */}
      <div className="w-65 bg-[#FAFAFA] border border-gray-200 fixed top-0 left-0 h-full">
        <Sidebar />
      </div>

      {/* Right side: Navbar on top, content below */}
      <div className="flex flex-col flex-1 ml-68">
        <div className="fixed top-0 left-65 right-0 z-40 bg-white shadow-sm">
          {/* Navbar */}
          <Navbar />
        </div>

        {/* Main content */}
        <main className="flex-1 pt-22 px-7 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
