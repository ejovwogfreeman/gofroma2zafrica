import { Metadata } from "next";
import ProfileForm from "@/components/account/profile/ProfileForm";

export const metadata: Metadata = {
  title: "Edit Profile | Africgo",
  description: "Update your profile information",
};

export default function ProfilePage() {
  return <ProfileForm />;
}
