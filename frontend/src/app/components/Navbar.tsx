"use client";

import { Menu, Sun, Moon, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen, darkMode, setDarkMode }) => {
  return (
    <header className="sticky top-0 bg-white dark:bg-gray-900 shadow-md px-4 py-2 flex justify-between items-center z-20 h-14">
      {/* Left Side: Sidebar Toggle Button and Title */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle Button - Visible only on mobile */}
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
        {/* Dashboard Title */}
        <span className="text-lg font-semibold dark:text-white">Dashboard</span>
      </div>

      {/* Right Side: User Info and Theme Toggle */}
      <div className="flex items-center gap-4">
        {/* User Profile Image */}
        <Image
          src="/user.svg"
          alt="User Profile"
          width={32}
          height={32}
          className="rounded-full border border-gray-300 dark:border-gray-600"
        />
        <span className="dark:text-gray-50 hidden sm:block">UserName</span>

        {/* Dark Mode Toggle */}
        <Button variant="ghost" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
          {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
