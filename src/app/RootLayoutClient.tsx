// src/app/RootLayoutClient.tsx
"use client";

import { usePathname } from "next/navigation";
import ClientLayout from "@/components/layout/ClientLayout";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuth =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/reset-password") ||
    pathname?.startsWith("/forget-password");
  const isAccount = pathname?.startsWith("/account");

  // Always wrap with GoogleOAuthProvider
  const content = (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      {children}
    </GoogleOAuthProvider>
  );

  // Return raw children for dashboard, auth, and account routes
  if (isDashboard || isAuth || isAccount) {
    return content;
  }

  // Use ClientLayout for marketing and stores pages
  return <ClientLayout>{content}</ClientLayout>;
}