"use client";

import { useEffect, useState } from "react";
import { Menu, Sun, Moon, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { expertApi } from "../service/expert";
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isOpen,
  setIsOpen,
  darkMode,
  setDarkMode,
}) => {
  const [name, setName] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await expertApi.getProfile();
        setName(data.name || "");
        setPreviewImage(data.profileImage);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load profile." });
      }
    };
    fetchProfile();
  }, []);

  const fullImageUrl = previewImage || "/user.svg";

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-md px-4 py-2 flex justify-between items-center z-20 h-14">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 dark:text-white" />}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Image
          src={fullImageUrl}
          alt="User Profile"
          width={32}
          height={32}
          className="rounded-full border border-gray-300 dark:border-gray-600 object-cover object-center size-8"
        />
        <span className="dark:text-gray-50 hidden sm:block">{name}</span>

        <Button variant="ghost" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
          {darkMode ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default Navbar;