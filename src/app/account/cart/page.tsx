// "use client";

// import CartClient from "@/components/account/cart/CartClient";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function CartPage() {
//   const router = useRouter();

//   useEffect(() => {
//     // Check if user is authenticated
//     // const token = localStorage.getItem("token");

//     const token =
//       typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     if (!token) {
//       router.push("/login");
//     }
//   }, [router]);

//   return <CartClient />;
// }
