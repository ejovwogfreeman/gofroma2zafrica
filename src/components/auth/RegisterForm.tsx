// src/components/auth/RegisterForm.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google"; // JWT (credential) flow

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");

  const getBackendApiUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) {
      console.error("NEXT_PUBLIC_API_URL is not defined in environment variables.");
      return "";
    }
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const backendApiUrl = getBackendApiUrl();
      if (!backendApiUrl) {
        setStatus("error");
        setMessage("Configuration error: Backend URL is missing.");
        return;
      }
      const response = await fetch(`${backendApiUrl}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Registration successful! We've sent a verification code to your email.");
        setUserId(data.userId || data.data?.user?._id || "");
        setShowOtpForm(true);
      } else {
        setStatus("error");
        setMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const backendApiUrl = getBackendApiUrl();
      if (!backendApiUrl) {
        setStatus("error");
        setMessage("Configuration error: Backend URL is missing.");
        return;
      }
      const response = await fetch(`${backendApiUrl}/api/users/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Email verified successfully! You can now login.");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setStatus("error");
        setMessage(data.message || "Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

  /* ----------------------------------------------------------
   Google login – credential flow returns a JWT id_token
   After success we treat the user exactly like a merchant
   that just logged in with e-mail / password.
  ---------------------------------------------------------- */
  const handleGoogleSuccess = async (credential: string) => {
    setStatus("loading");
    setMessage("Signing in with Google...");

    try {
      const backendApiUrl = getBackendApiUrl();
      if (!backendApiUrl) {
        setStatus("error");
        setMessage("Configuration error: Backend URL is missing.");
        return;
      }

      const res = await fetch(`${backendApiUrl}/api/users/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        /* ---- store auth data exactly like the login form does ---- */
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("userType", "merchant"); // default to merchant

        setStatus("success");
        setMessage("Google sign-in successful! Redirecting...");
        router.replace("/dashboard");          // <-- merchant dashboard
      } else {
        console.error("Backend Google login failed:", data);
        setStatus("error");
        setMessage(data.message || "Google login failed on the server.");
      }
    } catch (err) {
      console.error("Network/parsing error during Google login:", err);
      setStatus("error");
      setMessage("An unexpected error occurred during Google login.");
    }
  };

  const handleGoogleError = () => {
    setStatus("error");
    setMessage("Google login was cancelled or failed. Please try again.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold hero-gradient-text mb-4">Join GoFromA2zAfrica</h1>
        <p className="text-text-secondary text-lg">Start your digital transformation journey today</p>
      </div>

      {!showOtpForm ? (
        /* ---------------- Registration Form --------------- */
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6 bg-dark-primary/50 backdrop-blur-sm p-8 rounded-lg border border-white/10"
        >
          <StatusMessage status={status} message={message} />

          <div>
            <label htmlFor="name" className="block text-dark mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent hover:border-gold-primary/50 transition-all duration-300"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-dark mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent hover:border-gold-primary/50 transition-all duration-300"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-dark mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent hover:border-gold-primary/50 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-dark mb-2">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent hover:border-gold-primary/50 transition-all duration-300"
              required
            />
          </div>

          <SubmitButton status={status} text="Register Now" />

          {/* OR Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-primary text-gray-400">OR</span>
            </div>
          </div>

          {/* Google Sign-In */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(res) => res?.credential && handleGoogleSuccess(res.credential)}
              onError={handleGoogleError}
              useOneTap
            />
          </div>
        </motion.form>
      ) : (
        /* ---------------- OTP Verification --------------- */
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleVerifyOtp}
          className="space-y-6 bg-dark-primary/50 backdrop-blur-sm p-8 rounded-lg border border-white/10"
        >
          <StatusMessage status={status} message={message} />
          <div>
            <label htmlFor="otp" className="block text-dark mb-2">Enter Verification Code</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 bg-dark-secondary border border-white/10 rounded-lg text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent hover:border-gold-primary/50 transition-all duration-300"
              required
            />
          </div>
          <SubmitButton status={status} text="Verify Email" />
        </motion.form>
      )}

      {/* Back Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-8 text-center"
      >
        <Link href="/" className="text-text-secondary hover:text-dark transition-colors">
          ← Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Helper components                                                  */
/* ------------------------------------------------------------------ */
const SubmitButton = ({ status, text }: { status: string; text: string }) => (
  <motion.button
    type="submit"
    disabled={status === "loading"}
    className={`relative w-full px-6 py-4 bg-gradient-to-r from-gold-primary to-gold-secondary rounded-lg text-dark-primary font-medium overflow-hidden ${
      status === "loading" ? "opacity-75 cursor-not-allowed" : "hover:shadow-lg hover:shadow-gold-primary/20"
    } transition-all duration-300`}
    whileHover={{ scale: status === "loading" ? 1 : 1.02 }}
    whileTap={{ scale: status === "loading" ? 1 : 0.98 }}
  >
    <span className="relative z-10">{status === "loading" ? <LoadingDots /> : text}</span>
  </motion.button>
);

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

const StatusMessage = ({
  status,
  message,
}: {
  status: "idle" | "loading" | "success" | "error";
  message: string;
}) =>
  message && (
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-2 rounded ${status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
    >
      {message}
    </motion.p>
  );