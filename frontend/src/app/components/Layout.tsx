"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./SideBar";
import { expertApi } from "../service/api";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const isLoginPage = pathname === "/login";

  // Set mount state and mobile check
  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch role only if not on login page
  useEffect(() => {
    if (pathname !== "/login") {
      const fetchRole = async () => {
        try {
          const res = await expertApi.getProfile();
          setRole(res.data.role);
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      };
      fetchRole();
    }
  }, [pathname]);

  if (!isMounted || isLoginPage) {
    return <div>{children}</div>;
  }

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen`}>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 z-30 bg-black/50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="flex flex-col lg:flex-row">
        <Sidebar
          isOpen={isOpen}
          isMobile={isMobile}
          onClose={() => setIsOpen(false)}
          role={role}
        />

        <div
          className={`flex-1 transition-all duration-300 min-h-screen ${
            !isMobile ? (isOpen ? "ml-[250px]" : "ml-[60px]") : ""
          } ${isOpen && isMobile ? "opacity-60" : ""}`}
        >
          <Navbar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
          <main className="p-2 dark:bg-gray-900">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
