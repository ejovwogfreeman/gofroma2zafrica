import {
  Store,
  StoreFilters,
  PaginatedStores,
  ProductFilters,
  PaginatedProducts,
  StoreRating,
  CreateStoreRatingData,
  PaginatedStoreOrders,
  StoreOrder,
  StoreDashboardData,
  PaginatedStoreCustomers,
  StoreAddress,
  CreateStoreAddressData,
  UpdateStoreAddressData,
  Address,
  CreateAddressData,
  UpdateAddressData,
  StoreImageUploadResponse,
  UpdateStoreData,
  StorePaymentDetails,
  UpdatePaymentDetailsData,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://logistics-backend-1-s91j.onrender.com";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    console.error("API Error:", {
      status: response.status,
      data,
    });
    throw new Error(data.message || "API request failed");
  }

  return data.data;
}

// Add a delay helper function
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Add a retry wrapper function
export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = MAX_RETRIES
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying request... (${retries} attempts left)`);
      await delay(RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

// Get all stores with optional filters
export async function getStores(
  filters: StoreFilters = {}
): Promise<PaginatedStores> {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(
    `${API_URL}/api/stores/list?${queryParams.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse<PaginatedStores>(response);
}

// Get single store by slug
export async function getStoreBySlug(slug: string): Promise<Store> {
  if (!slug) {
    throw new Error("Store slug is required");
  }

  console.log("Making API request to:", `${API_URL}/api/stores/${slug}`);

  const response = await fetch(`${API_URL}/api/stores/${slug}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  console.log("API Response:", data);

  if (!response.ok || !data.success) {
    console.error("API Error:", {
      status: response.status,
      data,
    });
    throw new Error(data.message || "API request failed");
  }

  // Handle both response formats (direct store or nested store object)
  const storeData = data.data.store || data.data;
  if (!storeData) {
    throw new Error("Invalid store data received");
  }

  return storeData;
}

// Get store products
export async function getStoreProducts(
  storeSlug: string,
  filters: ProductFilters = {}
): Promise<PaginatedProducts> {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(
    `${API_URL}/api/stores/${storeSlug}/products?${queryParams.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch products");
  }

  return {
    products: data.data.products.map((product: any) => ({
      ...product,
      price: Number(product.price),
      stock: Number(product.stock),
    })),
    pagination: {
      total: data.data.total,
      page: data.data.page,
      totalPages: data.data.totalPages,
      hasMore: data.data.page < data.data.totalPages,
    },
  };
}

export async function rateStore(
  ratingData: CreateStoreRatingData
): Promise<StoreRating> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/consumers/rate-store`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ratingData),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to rate store");
  }
  return data.data;
}

export async function getStoreOrders(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedStoreOrders> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(
      `${API_URL}/api/stores/orders?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch store orders");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching store orders:", error);
    throw error;
  }
}

export async function getStoreOrderById(orderId: string): Promise<StoreOrder> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetchWithRetry(
      `${API_URL}/api/stores/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    // Check if response exists before trying to parse JSON
    if (!response) {
      throw new Error("No response received from server");
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      // Log more details about the error
      console.error("API Error Details:", {
        status: response.status,
        statusText: response.statusText,
        data,
      });
      throw new Error(
        data.message ||
          `Failed to fetch order details (Status: ${response.status})`
      );
    }

    // Validate the data structure
    if (!data.data) {
      throw new Error("Invalid response format: missing data property");
    }

    return data.data;
  } catch (error) {
    // Enhanced error logging
    console.error("Error fetching order details:", {
      orderId,
      error,
      apiUrl: API_URL,
      timestamp: new Date().toISOString(),
    });

    // Provide more specific error messages
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "Network error: Unable to connect to the server. Please check your internet connection."
      );
    }

    throw error;
  }
}

export async function markOrderAsReady(orderId: string): Promise<StoreOrder> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetchWithRetry(
      `${API_URL}/api/stores/orders/${orderId}/ready`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response) {
      throw new Error("No response received from server");
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("API Error Details:", {
        status: response.status,
        statusText: response.statusText,
        data,
      });
      throw new Error(
        data.message ||
          `Failed to mark order as ready (Status: ${response.status})`
      );
    }

    return data.data;
  } catch (error) {
    console.error("Error marking order as ready:", {
      orderId,
      error,
      apiUrl: API_URL,
      timestamp: new Date().toISOString(),
    });

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "Network error: Unable to connect to the server. Please check your internet connection."
      );
    }

    throw error;
  }
}

export async function getStoreDashboard(): Promise<StoreDashboardData> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(`${API_URL}/api/stores/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch dashboard data");
    }

    // Format numbers to ensure they're all numeric
    const formattedData = {
      ...data.data,
      stats: {
        ...data.data.stats,
        revenue: {
          ...data.data.stats.revenue,
          // total: Number(data.data.stats.revenue.total),
          // today: Number(data.data.stats.revenue.daily.current.amount),
          // yesterday: Number(data.data.stats.revenue.daily.previous.amount),
          // thisWeek: Number(data.data.stats.revenue.thisWeek),
          // thisMonth: Number(data.data.stats.revenue.monthly.current.amount),
          // previousMonth: Number(
          //   data.data.stats.revenue.monthly.previous.amount
          // ),
          dailyAverage: Number(data.data.stats.revenue.dailyAverage),
          totalRevenue: Number(
            data.data.stats.revenue.breakdown.daily.reduce(
              (sum: number, d: { amount: number }) => sum + d.amount,
              0
            )
          ),
          // updated
          today: Number(
            data.data.stats.revenue.breakdown.daily
              .filter(
                (d: { date: string; amount: number }) =>
                  d.date === new Date().toISOString().split("T")[0]
              )
              .reduce(
                (sum: number, d: { date: string; amount: number }) =>
                  sum + d.amount,
                0
              )
          ),
          yesterday: Number(
            data.data.stats.revenue.breakdown.daily
              .filter(
                (d: { date: string; amount: number }) =>
                  d.date ===
                  new Date(Date.now() - 86400000).toISOString().split("T")[0]
              )
              .reduce(
                (sum: number, d: { date: string; amount: number }) =>
                  sum + d.amount,
                0
              )
          ),
          // thisWeek: Number(
          //   data.data.stats.revenue.breakdown.daily
          //     .filter((d: { date: string; amount: number }) => {
          //       const entryDate = new Date(d.date);
          //       const today = new Date();
          //       const startOfWeek = new Date(today);
          //       startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday (assuming week starts on Monday)

          //       return entryDate >= startOfWeek && entryDate <= today;
          //     })
          //     .reduce(
          //       (sum: number, d: { date: string; amount: number }) =>
          //         sum + d.amount,
          //       0
          //     )
          // ),
          thisMonth: Number(
            data.data.stats.revenue.breakdown.daily
              .filter((d: { date: string; amount: number }) => {
                const entryDate = new Date(d.date);
                const today = new Date();
                return (
                  entryDate.getFullYear() === today.getFullYear() &&
                  entryDate.getMonth() === today.getMonth()
                );
              })
              .reduce(
                (sum: number, d: { date: string; amount: number }) =>
                  sum + d.amount,
                0
              )
          ),
          previousMonth: Number(
            data.data.stats.revenue.breakdown.daily
              .filter((d: { date: string; amount: number }) => {
                const entryDate = new Date(d.date);
                const today = new Date();

                // Get previous month and year (handle January correctly)
                const prevMonth =
                  today.getMonth() === 0 ? 11 : today.getMonth() - 1;
                const prevMonthYear =
                  today.getMonth() === 0
                    ? today.getFullYear() - 1
                    : today.getFullYear();

                return (
                  entryDate.getFullYear() === prevMonthYear &&
                  entryDate.getMonth() === prevMonth
                );
              })
              .reduce(
                (sum: number, d: { date: string; amount: number }) =>
                  sum + d.amount,
                0
              )
          ),
        },
      },
    };

    return formattedData;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

export async function getStoreCustomers(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedStoreCustomers> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetchWithRetry(
      `${API_URL}/api/stores/customers?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response) {
      throw new Error("No response received from server");
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("API Error Details:", {
        status: response.status,
        statusText: response.statusText,
        data,
      });
      throw new Error(data.message || "Failed to fetch customers");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching store customers:", error);
    throw error;
  }
}

export async function createStoreAddress(
  addressData: CreateStoreAddressData
): Promise<StoreAddress> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetchWithRetry(`${API_URL}/api/stores/address`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addressData),
    });

    if (!response) {
      throw new Error("No response received from server");
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("API Error Details:", {
        status: response.status,
        statusText: response.statusText,
        data,
      });
      throw new Error(data.message || "Failed to create store address");
    }

    return data.data.address;
  } catch (error) {
    console.error("Error creating store address:", error);
    throw error;
  }
}

export async function updateStoreAddress(
  addressData: UpdateStoreAddressData
): Promise<StoreAddress> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetchWithRetry(
      `${API_URL}/api/stores/address/${addressData.addressId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      }
    );

    if (!response) {
      throw new Error("No response received from server");
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("API Error Details:", {
        status: response.status,
        statusText: response.statusText,
        data,
      });
      throw new Error(data.message || "Failed to update store address");
    }

    return data.data.address;
  } catch (error) {
    console.error("Error updating store address:", error);
    throw error;
  }
}

export async function getAddresses(): Promise<Address[]> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetchWithRetry(`${API_URL}/api/addresses`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch addresses");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw error;
  }
}

export async function getAddressById(addressId: string): Promise<Address> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetchWithRetry(
      `${API_URL}/api/addresses/${addressId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch address");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching address:", error);
    throw error;
  }
}

export async function createAddress(
  addressData: CreateAddressData
): Promise<Address> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetchWithRetry(`${API_URL}/api/addresses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addressData),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to create address");
    }

    return data.data;
  } catch (error) {
    console.error("Error creating address:", error);
    throw error;
  }
}

export async function updateAddress(
  addressData: UpdateAddressData
): Promise<Address> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetchWithRetry(
      `${API_URL}/api/addresses/${addressData.addressId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update address");
    }

    return data.data;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
}

export async function deleteAddress(addressId: string): Promise<void> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetchWithRetry(
      `${API_URL}/api/addresses/${addressId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to delete address");
    }
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
}

export async function uploadStoreImage(
  imageFile: File
): Promise<StoreImageUploadResponse> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(`${API_URL}/api/stores/upload-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to upload image");
    }

    return data;
  } catch (error) {
    console.error("Error uploading store image:", error);
    throw error;
  }
}

export async function updateStore(
  storeId: string,
  updateData: UpdateStoreData
): Promise<Store> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(`${API_URL}/api/stores/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update store");
    }

    return data.data;
  } catch (error) {
    console.error("Error updating store:", error);
    throw error;
  }
}

export async function getMyStore(): Promise<Store> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetchWithRetry(`${API_URL}/api/stores/my-store`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch store");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching store:", error);
    throw error;
  }
}

export async function getPaymentDetails(): Promise<StorePaymentDetails> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetchWithRetry(
      `${API_URL}/api/stores/payment-details`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch payment details");
    }

    return data.data.paymentDetails;
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw error;
  }
}

export async function createPaymentDetails(
  paymentDetails: StorePaymentDetails
): Promise<StorePaymentDetails> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(`${API_URL}/api/stores/payment-details`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentDetails),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to create payment details");
    }

    return data.data.paymentDetails;
  } catch (error) {
    console.error("Error creating payment details:", error);
    throw error;
  }
}

export async function updatePaymentDetails(
  updateData: UpdatePaymentDetailsData
): Promise<StorePaymentDetails> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(`${API_URL}/api/stores/payment-details`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update payment details");
    }

    return data.data.paymentDetails;
  } catch (error) {
    console.error("Error updating payment details:", error);
    throw error;
  }
}

export async function openMyStore(): Promise<Store> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetchWithRetry(
      `${API_URL}/api/stores/my-store/open`,
      {
        method: "PATCH", // <-- This is essential
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch store");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching store:", error);
    throw error;
  }
}
export async function closeMyStore(): Promise<Store> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetchWithRetry(
      `${API_URL}/api/stores/my-store/close`,
      {
        method: "PATCH", // <-- This is essential
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch store");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching store:", error);
    throw error;
  }
}
