"use client";
import GenericTabs from "@/components/common/generic-tabs";
import { CustomBreadcrumbs } from "@/components/custom-breadcrums";
import CoreSetup from "@/components/settings/core-setup";
import ProfileForm from "@/components/settings/profile-form";
import { Bell } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("profile");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const tabs = [
    {
      value: "profile",
      label: "Profile",
      icon: <img src="/settings-profile-icon.png" alt="profile-icon" />,
      content: <ProfileForm />,
    },
    {
      value: "config-setup",
      label: "Core Setup",
      icon: <img src="/settings-complance-icon.png" alt="complance-icon" />,
      content: <CoreSetup />,
    },
    {
      value: "shift-preferences",
      label: "Shift Preferences",
      icon: <img src="/settings-shift-icon.png" alt="shift-icon" />,
      // content: <ShiftPreferences />,
    },
    {
      value: "compliance",
      label: "Documents",
      icon: <img src="/settings-complance-icon.png" alt="complance-icon" />,
      // content: <Compliance />,
    },
    {
      value: "users",
      label: "Users",
      icon: <img src="/settings-user-icon.png" alt="user-icon" />,
      // content: <UserTable />,
    },
    {
      value: "notifications",
      label: "Notifications",
      icon: <Bell className="h-4 w-4" />,
      // content: <NotificationsSettings />,
    },
    {
      value: "security",
      label: "Security",
      icon: <img src="/settings-security-icon.png" alt="security-icon" />,
      // content: <SecuritySettings />,
    },
  ];

  return (
    <div className="mb-8">
      <div className="mb-4">
        <CustomBreadcrumbs
          heading="Settings"
          links={[
            { name: "Dashboard", href: "/dashboard" },
            { name: "Settings" },
          ]}
        />
      </div>

      <GenericTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={handleTabChange}
      />

      {/* <ProfileForm /> */}
    </div>
  );
}
