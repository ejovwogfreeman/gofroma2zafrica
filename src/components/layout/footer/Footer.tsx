"use client";

import { motion } from "framer-motion";
import FooterNav from "./FooterNav";
import FooterNewsletter from "./FooterNewsletter";
import FooterSocial from "./FooterSocial";
import Logo from "@/components/ui/logo";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  return (
    <footer className="relative mt-20 border-t border-white/10">
      {/* Ambient light effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-primary/0 via-gold-primary/[0.02] to-dark-primary/0" />
        <div className="absolute inset-0 bg-gradient-to-r from-gold-primary/[0.02] via-transparent to-gold-primary/[0.02]" />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Logo />
            <p className="text-text-secondary text-sm max-w-xs">
              Empowering African businesses with cutting-edge solutions and
              global connectivity.
            </p>
            <p className="text-text-secondary text-sm max-w-xs">
              📞+234 706 609 6155 <br />
            </p>
            <p className="text-text-secondary text-sm max-w-xs">
              📍edo Street junction ekosodin. Beside GT laundry
            </p>
            <FooterSocial />
          </div>

          {/* Navigation Sections */}
          <div>
            <span className="font-bold text-2xl tracking-tight">
              Useful Links
            </span>
            <FooterNav
              title="Company"
              links={[
                {
                  name: "About Us",
                  href: pathname === "/" ? "#about-us" : "/#about-us",
                },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                // { name: "Careers", href: "/careers" },
                // { name: "Press", href: "/press" },
                // { name: "Blog", href: "/blog" },
              ]}
            />
          </div>

          {/* <FooterNav
            title="Resources"
            links={[
              { name: "Documentation", href: "/docs" },
              { name: "Help Center", href: "/help" },
              { name: "Privacy", href: "/privacy" },
              { name: "Terms", href: "/terms" },
            ]}
          /> */}

          {/* Newsletter Section */}
          <FooterNewsletter />
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-text-secondary text-sm">
              © {new Date().getFullYear()} Alpha Interactive Tech Hub Nigeria.
              All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <motion.a
                href="/privacy"
                className="text-text-secondary hover:text-gold-primary text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="/terms"
                className="text-text-secondary hover:text-gold-primary text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Terms of Service
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent animate-pulse" />
      </div>
      <a
        href="https://wa.me/+2347066096155"
        style={{
          position: "fixed",
          zIndex: "100000000000",
          bottom: "10px",
          right: "3%",
          backgroundColor: "#25D366",
          borderRadius: "50%",
          padding: "5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"
          />
        </svg>
      </a>
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/iconify/3.1.1/iconify.min.js"
      ></script>
    </footer>
  );
}
