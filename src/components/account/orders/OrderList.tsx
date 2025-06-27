"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getOrders } from "@/lib/orders/api";
import { Order } from "@/lib/orders/types";

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const queryParams = {
          page: currentPage,
          limit: ordersPerPage,
          ...(selectedStatus && { status: selectedStatus as any }),
          ...(dateRange.startDate && { startDate: dateRange.startDate }),
          ...(dateRange.endDate && { endDate: dateRange.endDate }),
        };

        const response = await getOrders(queryParams);
        setOrders(response.data.orders);
        setTotalPages(
          response.data.totalPages ||
            Math.ceil(response.data.total / ordersPerPage)
        );
        setTotalOrders(response.data.total);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch orders"
        );
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, selectedStatus, dateRange]);

  // Add filter handlers
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleDateChange = (type: "startDate" | "endDate", value: string) => {
    setDateRange((prev) => ({
      ...prev,
      [type]: value,
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage: number) => {
    console.log("Changing to page:", newPage);
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <div className="text-base sm:text-xl text-gray-600">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <div className="text-base sm:text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="w-full sm:w-auto sm:flex-1">
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>

        <div className="w-full sm:w-auto sm:flex-1">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => handleDateChange("startDate", e.target.value)}
            className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
            placeholder="Start Date"
          />
        </div>

        <div className="w-full sm:w-auto sm:flex-1">
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => handleDateChange("endDate", e.target.value)}
            className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
            placeholder="End Date"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Showing {(currentPage - 1) * ordersPerPage + 1}-
          {Math.min(currentPage * ordersPerPage, totalOrders)} of {totalOrders}{" "}
          orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-base sm:text-lg text-gray-600 text-center py-6 sm:py-8">No orders found</div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-3 sm:gap-4"
          >
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/account/orders/${order._id}`}
                className="block bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm
                  hover:border-gold-primary transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="space-y-1">
                    <p className="text-base sm:text-lg text-gray-900 font-medium">
                      Order #{order.trackingNumber}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium
                      ${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-800"
                          : order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "IN_TRANSIT"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      Delivery Address
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {order.deliveryAddress.manualAddress?.street ||
                        order.deliveryAddress.street}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {order.deliveryAddress.manualAddress?.city ||
                        order.deliveryAddress.city}
                      ,{" "}
                      {order.deliveryAddress.manualAddress?.state ||
                        order.deliveryAddress.state}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-medium text-gray-900 mb-1">Total Amount</p>
                    <p className="text-base sm:text-lg text-gold-primary font-medium">
                      ₦{order.price.toLocaleString()}
                    </p>
                    {order.zonePrice && (
                      <p className="text-xs sm:text-sm text-gray-600">
                        (Includes ₦{order.zonePrice.toLocaleString()} delivery
                        fee)
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalOrders > ordersPerPage && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-6 sm:mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium
                  ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium
                    ${
                      currentPage === page
                        ? "bg-gold-primary text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium
                  ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
