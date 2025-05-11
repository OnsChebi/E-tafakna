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
} from "lucide-react";

interface MenuItem {
  icon: ReactElement;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const menuItems: MenuGroup[] = [
  {
    title: "Menu",
    items: [
      {
        icon: <Video className="min-w-[24px]" />,
        label: "Meetings",
        href: "/meetings",
      },
      {
        icon: <ChartColumnIncreasing className="min-w-[24px]" />,
        label: "Statistics",
        href: "/statistics",
      },
      {
        icon: <UserRoundPen className="min-w-[24px]" />,
        label: "Profile",
        href: "/profile",
      },
      {
        icon: <NotebookPen className="min-w-[24px]" />,
        label: "Notepad",
        href: "/notepad",
      },
      {
        icon: <CalendarDays className="min-w-[24px]" />,
        label: "Calendar",
        href: "/calendar",
      },
      {
        icon: <LogOut className="text-black" />,
        label: "Logout",
        onClick: () => {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        },
      },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, isMobile, onClose }: SidebarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = isMobile ? isOpen : isHovered;

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    if (isMobile) {
      onClose();
    }
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-900 border-r shadow-md",
        "transition-all duration-300 ease-in-out",
        isMobile && [
          "w-[250px]",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ],
        !isMobile && [
          "w-[60px]",
          isHovered && "w-[250px]",
          "lg:hover:w-[250px]",
        ]
      )}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      aria-label="Sidebar"
    >
      {/* Logo container */}
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

      {/* Navigation menu */}
      <nav className="flex flex-col p-4 space-y-2">
        {menuItems.map((group) => (
          <div key={group.title} className="space-y-2">
            {group.items.map((item) => (
              <div key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 text-gray-700 dark:text-gray-300",
                      "py-3 rounded-lg transition-all duration-200",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      "active:scale-95 group"
                    )}
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
                    className=  {isExpanded ? "flex items-center gap-3 w-full" : ""}
               
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
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
