"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./SideBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Manage darkMode state here
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Check if the current route is the login page
  const isLoginPage = pathname === "/login";

  // Handle mobile responsiveness
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

  if (!isMounted) return null;

  if (isLoginPage) {
    return <div>{children}</div>; 
  }

  
  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen relative`}>
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
        />

        <div
          className={`flex-1 transition-all duration-300 ${
            !isMobile && (isOpen ? "ml-[250px]" : "ml-[60px]")
          } ${isOpen && isMobile ? "opacity-60" : ""}`}
        >
          <Navbar 
            isOpen={isOpen} 
            setIsOpen={setIsOpen} 
            darkMode={darkMode}
            setDarkMode={setDarkMode} 
          />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;