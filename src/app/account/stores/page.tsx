import { Metadata } from "next";
import AccountStoreList from "@/components/account/stores/StoreList";

export const metadata: Metadata = {
  title: "Browse Stores | Africgo",
  description: "Browse and discover stores on Africgo",
};

export default function AccountStoresPage() {
  return <AccountStoreList />;
}
