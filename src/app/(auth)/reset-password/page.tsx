import React, { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
