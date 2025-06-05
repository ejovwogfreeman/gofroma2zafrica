// "use client";

// import { useEffect, useState, memo } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import Sidebar from "@/components/dashboard/layout/Sidebar";
// import TopNav from "@/components/dashboard/layout/TopNav";
// import { motion } from "framer-motion"; // Import Framer Motion
// import { getMyStore } from "@/lib/stores/api";
// import { Store } from "@/lib/stores/types";
// import { io, Socket } from "socket.io-client";

// const DashboardLayout = memo(function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state
//   const [store, setStore] = useState<Store | null>(null);

//   useEffect(() => {
//     const checkAuthAndFetchStore = async () => {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         router.replace("/login");
//         return;
//       }

//       try {
//         const storeData = await getMyStore();
//         setStore(storeData);
//       } catch (error) {
//         console.error("Error fetching store:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuthAndFetchStore();
//   }, [router]); // Removed pathname dependency

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50 overflow-hidden">
//       {/* Sidebar with Slide-In Animation */}
//       <motion.div
//         initial={{ x: -260 }} // Sidebar starts off-screen
//         animate={{ x: isSidebarOpen ? 0 : -260 }} // Slides in/out
//         transition={{ duration: 0.3, ease: "easeInOut" }} // Smooth animation
//         className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 ${
//           isSidebarOpen ? "w-64" : "w-0"
//         }`}
//       >
//         <Sidebar />
//       </motion.div>

//       {/* Main Content Area */}
//       <div
//         className={`flex-1 transition-all duration-300 ${
//           isSidebarOpen ? "ml-64" : "ml-0"
//         }`}
//       >
//         <TopNav
//           toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
//           storeName={store?.storeName}
//         />
//         <main className="p-4 sm:p-8 bg-gray-50">{children}</main>
//       </div>
//     </div>
//   );
// });

// export default DashboardLayout;

// "use client";

// import { useEffect, useState, memo } from "react";
// import { useRouter } from "next/navigation";
// import Sidebar from "@/components/dashboard/layout/Sidebar";
// import TopNav from "@/components/dashboard/layout/TopNav";
// import { motion } from "framer-motion";
// import { getMyStore } from "@/lib/stores/api";
// import { Store } from "@/lib/stores/types";
// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// const connectToSocket = (
//   token: string,
//   storeId: string,
//   setNewOrderNotification: React.Dispatch<React.SetStateAction<boolean>>
// ) => {
//   if (!socket) {
//     socket = io(process.env.NEXT_PUBLIC_API_URL!, {
//       auth: { token },
//     });

//     socket.on("connect", () => {
//       console.log("✅ Connected to socket:", socket?.id);
//       socket?.emit("join", `store-${storeId}`);
//     });

//     socket.on("disconnect", () => {
//       console.log("❌ Socket disconnected");
//     });

//     socket.on("connect_error", (err) => {
//       console.error("⚠️ Socket connection error:", err.message);
//     });

//     socket.on("new-store-order", (payload) => {
//       console.log("🛒 New order for your store:", payload);
//       setNewOrderNotification(true);
//     });
//   }
// };

// const disconnectSocket = (
//   setNewOrderNotification: React.Dispatch<React.SetStateAction<boolean>>
// ) => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//     setNewOrderNotification(false); // ✅ Now this works
//     console.log("👋 Socket disconnected on unmount");
//   }
// };

// const DashboardLayout = memo(function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [store, setStore] = useState<Store | null>(null);
//   const [newOrderNotification, setNewOrderNotification] = useState(false);

//   // useEffect(() => {
//   //   const checkAuthAndFetchStore = async () => {
//   //     const token = localStorage.getItem("token");

//   //     if (!token) {
//   //       router.replace("/login");
//   //       return;
//   //     }

//   //     try {
//   //       const storeData = await getMyStore();
//   //       setStore(storeData);

//   //       if (storeData?._id && token) {
//   //         connectToSocket(token, storeData._id, setNewOrderNotification);
//   //       }

//   //       return () => {
//   //         disconnectSocket();
//   //       };
//   //     } catch (error) {
//   //       console.error("Error fetching store:", error);
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   };

//   //   checkAuthAndFetchStore();

//   //   return () => {
//   //     disconnectSocket();
//   //   };
//   // }, [router]);

//   useEffect(() => {
//     let isMounted = true;

//     const checkAuthAndFetchStore = async () => {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         router.replace("/login");
//         return;
//       }

//       try {
//         const storeData = await getMyStore();
//         if (isMounted) setStore(storeData);

//         if (storeData?._id && token) {
//           connectToSocket(token, storeData._id, setNewOrderNotification);
//         }
//       } catch (error) {
//         console.error("Error fetching store:", error);
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     };

//     checkAuthAndFetchStore();

//     return () => {
//       isMounted = false;
//       disconnectSocket(setNewOrderNotification);
//     };
//   }, [router]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50 overflow-hidden">
//       <motion.div
//         initial={{ x: -260 }}
//         animate={{ x: isSidebarOpen ? 0 : -260 }}
//         transition={{ duration: 0.3, ease: "easeInOut" }}
//         className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 ${
//           isSidebarOpen ? "w-64" : "w-0"
//         }`}
//       >
//         <Sidebar />
//       </motion.div>

//       <div
//         className={`flex-1 transition-all duration-300 ${
//           isSidebarOpen ? "ml-64" : "ml-0"
//         }`}
//       >
//         <TopNav
//           toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
//           storeName={store?.storeName}
//           newOrderNotification={newOrderNotification}
//         />
//         <main className="p-4 sm:p-8 bg-gray-50">{children}</main>
//       </div>
//     </div>
//   );
// });

// export default DashboardLayout;

"use client";

import { useEffect, useState, memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import TopNav from "@/components/dashboard/layout/TopNav";
import { motion } from "framer-motion";
import { getMyStore } from "@/lib/stores/api";
import { Store } from "@/lib/stores/types";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const connectToSocket = (
  token: string,
  storeId: string,
  setNewOrderNotification: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket?.id);
      socket?.emit("join", `store-${storeId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("⚠️ Socket connection error:", err.message);
    });

    socket.on("new-store-order", (payload) => {
      console.log("🛒 New order for your store:", payload);
      setNewOrderNotification(true);
    });
  }
};

const disconnectSocket = (
  setNewOrderNotification: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (socket) {
    socket.disconnect();
    socket = null;
    setNewOrderNotification(false);
    console.log("👋 Socket disconnected on unmount");
  }
};

const DashboardLayout = memo(function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [store, setStore] = useState<Store | null>(null);
  const [newOrderNotification, setNewOrderNotification] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuthAndFetchStore = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const storeData = await getMyStore();
        if (isMounted) setStore(storeData);

        if (storeData?._id && token) {
          connectToSocket(token, storeData._id, setNewOrderNotification);
        }
      } catch (error) {
        console.error("Error fetching store:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkAuthAndFetchStore();

    return () => {
      isMounted = false;
      disconnectSocket(setNewOrderNotification);
    };
  }, [router]);

  // Reset newOrderNotification on every route change
  useEffect(() => {
    setNewOrderNotification(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      <motion.div
        initial={{ x: -260 }}
        animate={{ x: isSidebarOpen ? 0 : -260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 ${
          isSidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <Sidebar />
      </motion.div>

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <TopNav
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          storeName={store?.storeName}
          newOrderNotification={newOrderNotification}
        />
        <main className="p-4 sm:p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
});

export default DashboardLayout;
