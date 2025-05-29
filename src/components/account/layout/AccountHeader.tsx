"use client";

import { useRouter } from "next/navigation";
import Logo from "@/components/ui/logo";
import Link from "next/link";

export default function AccountHeader({
  toggleNav,
}: {
  toggleNav: () => void;
}) {
  const router = useRouter();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    router.replace("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 h-16 flex items-center justify-between">
        {/* Left: Hamburger Menu & Logo */}
        <div className="flex items-center space-x-4">
          {/* Menu Button */}
          {token ? (
            <button onClick={toggleNav} className="p-2 focus:outline-none">
              <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-800"></span>
            </button>
          ) : (
            <Link
              href="/stores"
              className="inline-flex items-center gap-2 p-2 hover:text-black"
              style={{ color: "#D4AF37" }}
            >
              <span aria-hidden="true">&#8592; Go back</span>
            </Link>
          )}
          {/* <span className="text-gray-900 font-medium">Account Dashboard</span> */}
          <span
            className="text-gray-900 font-medium"
            style={{ marginLeft: "-5px" }}
          >
            <Logo />
          </span>
        </div>

        {/* Right: Navigation Links */}
        <div className="flex items-center space-x-4">
          {token && (
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gold-primary transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
