import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TabItem {
  value: string;
  label: string;
  icon: ReactNode;
  content?: ReactNode;
}

interface GenericTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (value: string) => void;
  statusColors?: Record<string, any>;
  showContent?: boolean;
}

export default function GenericTabs({
  tabs,
  activeTab,
  onChange,
  statusColors,
  showContent = true,
}: GenericTabsProps) {
  const activeTabData = tabs.find((tab) => tab.value === activeTab);

  return (
    <div>
      {/* 🔥 Tabs Header */}
      <div className="flex shrink-0 bg-gray-100 rounded-lg mb-2 justify-between">
        {tabs.map((tab) => {
          const color = statusColors?.[tab.value];
          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-medium transition-all border-b-2 border-transparent",
                isActive
                  ? color
                    ? `${color.bg} ${color.text} font-bold border-b-current`
                    : "bg-primary-100/70 text-primary-600 font-bold border-b-current"
                  : "hover:text-primary-600 hover:bg-primary-50",
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 🔥 Tabs Content (OPTIONAL) */}
      {showContent && activeTabData?.content && (
        <div className="mt-4">{activeTabData.content}</div>
      )}
    </div>
  );
}
