"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const accountType = searchParams.get("accountType") || "consumer";

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const endpoint = `${baseUrl}/api/${
      accountType === "merchant" ? "users" : "consumer"
    }/reset-password`;

    console.log(endpoint);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: formData.otp,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(
          data.message || "Password reset successful. You can now log in."
        );
        setFormData({ email: "", otp: "", password: "", confirmPassword: "" });
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to reset password.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-display-small font-bold hero-gradient-text mb-4">
          Reset Your Password
        </h1>
        <p className="text-text-secondary text-lg">
          Enter your email, OTP, and new password
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="space-y-6 bg-dark-primary/50 backdrop-blur-sm p-8 rounded-lg border border-white/10"
      >
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-dark mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent hover:border-gold-primary/50 transition-all duration-300"
            required
          />
        </div>

        {/* OTP */}
        <div>
          <label htmlFor="otp" className="block text-dark mb-2">
            OTP
          </label>
          <input
            id="otp"
            type="text"
            value={formData.otp}
            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
            className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent hover:border-gold-primary/50 transition-all duration-300"
            required
          />
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="password" className="block text-dark mb-2">
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent hover:border-gold-primary/50 transition-all duration-300"
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-dark mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent hover:border-gold-primary/50 transition-all duration-300"
            required
          />
        </div>

        {/* Submit Button */}
        <SubmitButton status={status} text="Reset Password" />

        {/* Status Message */}
        <StatusMessage status={status} message={message} />
      </motion.form>
    </motion.div>
  );
}

// Submit Button Component
const SubmitButton = ({ status, text }: { status: string; text: string }) => (
  <motion.button
    type="submit"
    disabled={status === "loading"}
    className={`relative w-full px-6 py-4 bg-gradient-to-r from-gold-primary to-gold-secondary 
      rounded-lg text-dark-primary font-medium overflow-hidden
      ${
        status === "loading"
          ? "opacity-75 cursor-not-allowed"
          : "hover:shadow-lg hover:shadow-gold-primary/20"
      }
      transition-all duration-300`}
    whileHover={{ scale: status === "loading" ? 1 : 1.02 }}
    whileTap={{ scale: status === "loading" ? 1 : 0.98 }}
  >
    <span className="relative z-10">
      {status === "loading" ? <LoadingDots /> : text}
    </span>
  </motion.button>
);

// Loading Dots Component
const LoadingDots = () => (
  <div className="flex items-center justify-center space-x-2">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-2 h-2 bg-dark-primary rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
      />
    ))}
  </div>
);

// Status Message Component
const StatusMessage = ({
  status,
  message,
}: {
  status: string;
  message: string;
}) =>
  message ? (
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-sm ${
        status === "success" ? "text-green-400" : "text-red-400"
      }`}
    >
      {message}
      {status === "success" && (
        <a
          href="/login"
          className="ms-2 mt-2 inline-block text-gold-primary underline hover:text-gold-secondary transition"
        >
          Click here to log in
        </a>
      )}
    </motion.p>
  ) : null;
