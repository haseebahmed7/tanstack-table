import { Button } from "../ui/button";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex justify-between mb-10">
      <h2 className="text-xl font-semibold">Logo</h2>
      <h2 className="text-xl font-semibold">Navbar</h2>
      <div>
        <Link href="/login">
          <Button className=" hover:bg-red-500">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </Link>
      </div>
    </div>
  );
}
