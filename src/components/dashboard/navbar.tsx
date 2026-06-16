"use client";
import { Settings, LogOut, Bell, Headset, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CurrentTime from "../current-time";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const iconClass =
    "flex size-10 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-200";

  return (
    <div className="flex items-center justify-between px-6 h-16 bg-white">
      {/* Left: Title */}
      <div>
        <div className="flex items-center gap-2 mt-6">
          <Building2 className="text-red-600 h-5 w-5" />
          <span className="relative text-2xl font-bold text-gray-900">
            Internal Company
          </span>
        </div>
        <div className="mt-1 mb-6 text-lg text-[#919EAB]">
          <CurrentTime />
        </div>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center space-x-2 z-50 ">
        <div className={iconClass}>
          <Bell className="w-6 h-6" />
        </div>

        <div className={iconClass}>
          <Link href="/support">
            <Headset className="w-6 h-6" />
          </Link>
        </div>

        <div className={iconClass}>
          <Link href="/settings">
            <Settings className="w-6 h-6" />
          </Link>
        </div>

        {/* Profile Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className={`flex items-center cursor-pointer ${iconClass}`}
          >
            <Image
              src="/avatar.jpg"
              alt="Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div
              className="absolute right-0 px-4 py-2 bg-white rounded-md shadow-lg border border-gray-200 z-50"
              onClick={() => setOpen(false)}
            >
              <Link
                href="/login"
                className="flex items-center gap-2 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
