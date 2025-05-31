"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AccountNav from "./AccountNav";
import AccountHeader from "./AccountHeader";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [tokenAvailable, setTokenAvailable] = useState(false);

  useEffect(() => {
    // If we're on /account/stores/:slug, skip authentication
    if (pathname?.startsWith("/account/stores")) {
      return;
    }

    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    if (!token || userType !== "consumer") {
      router.replace("/login");
    } else {
      setTokenAvailable(true);
    }
  }, [pathname, router]);

  const toggleNav = () => setIsNavOpen((prev) => !prev);

  const token = localStorage.getItem("token");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <AccountHeader toggleNav={toggleNav} />

      <div className="flex flex-1">
        {/* Sidebar */}
        {token && (
          <aside
            className={`w-64 bg-white border-r border-gray-200 fixed h-[calc(100vh-64px)] top-16 left-0 z-30 transform transition-transform duration-300 ease-in-out
            ${isNavOpen ? "translate-x-0" : "-translate-x-64"}`}
          >
            <AccountNav />
          </aside>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 p-8 transition-all duration-300 ease-in-out ${
            isNavOpen ? "ml-64" : "ml-0"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
