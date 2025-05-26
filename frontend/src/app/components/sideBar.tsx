"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactElement, useState } from "react";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  ChartColumnIncreasing,
  LogOut,
  NotebookPen,
  UserRoundPen,
  Video,
  LayoutDashboard,
  Users,
} from "lucide-react";

interface MenuItem {
  icon: ReactElement;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
  role: string | null;
}

const iconClasses =
  "min-w-[24px] text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white";

const Sidebar = ({ isOpen, isMobile, onClose, role }: SidebarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = isMobile ? isOpen : isHovered;

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) item.onClick();
    if (isMobile) onClose();
  };

  // Role-based menu items
  let menuItems: MenuItem[] = [];

  if (role === "expert") {
    menuItems = [
      { icon: <Video className={iconClasses} />, label: "Meetings", href: "/meetings" },
      { icon: <ChartColumnIncreasing className={iconClasses} />, label: "Statistics", href: "/statistics" },
      { icon: <UserRoundPen className={iconClasses} />, label: "Profile", href: "/profile" },
      { icon: <NotebookPen className={iconClasses} />, label: "Notepad", href: "/notepad" },
      { icon: <CalendarDays className={iconClasses} />, label: "Calendar", href: "/calendar" },
    ];
  } else if (role === "admin") {
    menuItems = [
      { icon: <LayoutDashboard className={iconClasses} />, label: "Dashboard", href: "/dashboard" },
      { icon: <Users className={iconClasses} />, label: "Users", href: "/users" },
      { icon: <UserRoundPen className={iconClasses} />, label: "Profile", href: "/profile" },
    ];
  }

  
  menuItems.push({
    icon: <LogOut className={iconClasses} />,
    label: "Logout",
    onClick: () => {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    },
  });

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-900 border-r shadow-md transition-all duration-300 ease-in-out",
        isMobile
          ? isOpen
            ? "translate-x-0 w-[250px]"
            : "-translate-x-full w-[250px]"
          : isHovered
          ? "w-[250px]"
          : "w-[60px]"
      )}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <div className="p-4 flex items-center justify-center border-b dark:border-gray-700">
        <Image
          src={isExpanded ? "/logo.png" : "/e_tafakna_logo_mini.jpg"}
          alt="Logo"
          width={isExpanded ? 120 : 40}
          height={30}
          className="transition-all duration-300"
          priority
        />
      </div>

      <nav className="flex flex-col p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center gap-3 text-gray-900 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
                onClick={() => handleItemClick(item)}
              >
                {item.icon}
                <span
                  className={cn(
                    "text-sm font-medium transition-opacity",
                    isExpanded ? "opacity-100" : "opacity-0"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            ) : (
              <button
                onClick={() => handleItemClick(item)}
                className="flex items-center gap-3 w-full py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 group"
              >
                {item.icon}
                <span
                  className={cn(
                    "text-sm font-medium dark:text-gray-300 transition-opacity",
                    isExpanded ? "opacity-100" : "opacity-0"
                  )}
                >
                  {item.label}
                </span>
              </button>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
