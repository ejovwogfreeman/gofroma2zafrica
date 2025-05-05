import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: "Benefits", href: "#benefits" },
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Success Stories", href: "#success-stories" },
  { name: "Stores", href: "stores" },
  { name: "Track Order", href: "track" },
];

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.scrollTo({ top: 0, behavior: "smooth" });

      const timeout = setTimeout(() => {
        setShowNav(true);
      }, 800); // wait for scroll to finish before showing nav

      return () => clearTimeout(timeout);
    } else {
      document.body.style.overflow = "";
      setShowNav(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && showNav && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 99999 }}
          />

          {/* Menu panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 top-0 h-full w-[300px] bg-dark-primary border-l border-white/10"
            style={{ zIndex: 99999 }}
          >
            <div className="p-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-dark/60 hover:text-dark"
              >
                <CloseIcon />
              </button>

              <nav className="space-y-2 mt-12">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="block p-4 text-dark/70 hover:text-dark hover:bg-gold-primary/10 rounded-lg transition-all duration-300"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-3 space-y-4">
                <Link href="/login" onClick={onClose}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 text-sm font-medium bg-gradient-to-r 
                      from-gold-primary to-gold-secondary text-light-primary rounded-lg mb-3"
                  >
                    Log In
                  </motion.button>
                </Link>

                <Link href="/register" onClick={onClose}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 text-sm font-medium bg-gradient-to-r 
                      from-gold-primary to-gold-secondary text-light-primary rounded-lg"
                  >
                    Register Now
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const CloseIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
