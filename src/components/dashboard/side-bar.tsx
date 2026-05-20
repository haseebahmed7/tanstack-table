"use client";

import {
  Inbox,
  LayoutDashboard,
  Settings,
  Users,
  Shuffle,
  Download,
  UserPlus,
  ClipboardList,
} from "lucide-react";
import {
  CalendarDays,
  ClockIcon,
  LayoutDashboardIcon,
  UsersIcon,
  ChartNoAxesCombined,
  Lock,
} from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
  { title: "Candidate", url: "/candidates", icon: UsersIcon },
  { title: "Rota Planner", url: "/calender", icon: CalendarDays },
  { title: "Shift Management", url: "/shift-management", icon: ClockIcon },
  { title: "Analytics", url: "/analytics", icon: ChartNoAxesCombined },
  { title: "Accounts", url: "/accounts", icon: Lock },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen flex flex-col">
      {/* Logo */}
      <div className="m-10">
        <Image
          src="/fillo-logo-single.png"
          alt="Brand Logo"
          width={100}
          height={80}
          className="mx-auto h-22 w-auto"
        />
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col gap-1 ml-2 mr-2">
        {items.map((item) => {
          const isActive = pathname === item.url; // ✅ Active check
          return (
            <Link
              key={item.title}
              href={item.url}
              className={`flex items-center gap-3 px-3 py-2 rounded-md  font-serif transition-colors
                ${
                  isActive
                    ? "bg-[#F66C84] text-white"
                    : "hover:bg-[#F66C84] hover:text-white"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
    </aside>
  );
}
