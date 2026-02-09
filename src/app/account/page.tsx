import { Metadata } from "next";
import AccountOverview from "@/components/account/AccountOverview";

export const metadata: Metadata = {
  title: "Account Overview | Africgo",
  description: "Manage your Africgo account, orders, and preferences",
};

export default function AccountPage() {
  return <AccountOverview />;
}
