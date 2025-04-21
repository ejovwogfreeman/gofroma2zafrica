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
    </footer>
  );
}
