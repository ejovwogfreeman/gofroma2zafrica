import { Metadata } from "next";
import StorePageClient from "./StorePageClient";

export const metadata: Metadata = {
  title: "Store Products | Africgo",
  description: "Browse store products and place orders",
};

export default function ConsumerStoreProductsPage() {
  return <StorePageClient />;
}
