import React, { useState, useEffect } from "react";
import {
  Download,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  User,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  ExternalLink,
  Filter,
  SortDesc,
  Search,
  AlertTriangle,
  X,
  Headset,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import Header from "../components/Header";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Cancel order states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  // Rating states
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [orders, orderStatusFilter, paymentStatusFilter, sortBy, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const uid = localStorage.getItem("uid");
      if (!uid) {
        throw new Error("User ID not found in localStorage");
      }

      const response = await fetch(`${backendUrl}/api/order/get-order/${uid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.OrdersFound || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }

    try {
      setCancelLoading(true);
      const uid = localStorage.getItem("uid");

      if (!uid) {
        throw new Error("User ID not found");
      }

      const response = await axios.delete(
        `${backendUrl}/api/order/cancel-order`,
        {
          data: {
            orderId: selectedOrderId,
            userId: uid,
            reason: cancelReason.trim(),
          },
        }
      );

      if (response.status === 200) {
        await fetchOrders();
        setShowCancelModal(false);
        setCancelReason("");
        setSelectedOrderId("");
        alert("Order cancelled successfully!");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(
        error.response?.data?.message ||
          "Failed to cancel order. Please try again."
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancelReason("");
    setSelectedOrderId("");
  };

  const canCancelOrder = (orderStatus, paymentStatus) => {
    const cancelableStatuses = ["pending", "confirmed", "processing"];
    return (
      cancelableStatuses.includes(orderStatus.toLowerCase()) &&
      paymentStatus.toLowerCase() === "success"
    );
  };

  const openRatingModal = (product) => {
    setCurrentProduct(product);
    setNewRating(0);
    setHoverRating(0);
    setRatingError("");
    setShowRatingModal(true);
  };

  const submitRating = async () => {
    if (!currentProduct || newRating === 0) {
      setRatingError("Please select a rating");
      return;
    }

    try {
      setRatingLoading(true);
      setRatingError("");
      const uid = localStorage.getItem("uid");

      if (!uid) {
        throw new Error("User ID not found");
      }

      const response = await axios.put(
        `${backendUrl}/api/product/rate/${currentProduct.product}`,
        {
          userId: uid,
          newRating: newRating,
        }
      );

      if (response.status === 200) {
        // Success - close modal and reset
        setShowRatingModal(false);
        setCurrentProduct(null);
        setNewRating(0);
        alert("Rating submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      setRatingError(
        error.response?.data?.message ||
          "Failed to submit rating. Please try again."
      );
    } finally {
      setRatingLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...orders];

    if (orderStatusFilter !== "all") {
      filtered = filtered.filter(
        (order) =>
          order.orderStatus.toLowerCase() === orderStatusFilter.toLowerCase()
      );
    }

    if (paymentStatusFilter !== "all") {
      filtered = filtered.filter(
        (order) =>
          order.paymentStatus.toLowerCase() ===
          paymentStatusFilter.toLowerCase()
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.placedAt) - new Date(a.placedAt);
        case "oldest":
          return new Date(a.placedAt) - new Date(b.placedAt);
        case "amount-high":
          return b.totalAmount - a.totalAmount;
        case "amount-low":
          return a.totalAmount - b.totalAmount;
        default:
          return new Date(b.placedAt) - new Date(a.placedAt);
      }
    });

    setFilteredOrders(filtered);
  };

  const resetFilters = () => {
    setOrderStatusFilter("all");
    setPaymentStatusFilter("all");
    setSortBy("recent");
    setSearchTerm("");
  };

  const getUniqueOrderStatuses = () => {
    const statuses = [...new Set(orders.map((order) => order.orderStatus))];
    return statuses;
  };

  const getUniquePaymentStatuses = () => {
    const statuses = [...new Set(orders.map((order) => order.paymentStatus))];
    return statuses;
  };

  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-emerald-700 bg-emerald-100";
      case "shipped":
        return "text-blue-700 bg-blue-100";
      case "pending":
        return "text-amber-700 bg-amber-100";
      case "cancelled":
        return "text-red-700 bg-red-100";
      case "confirmed":
        return "text-green-700 bg-green-100";
      case "processing":
        return "text-purple-700 bg-purple-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "success":
      case "paid":
        return "text-green-600";
      case "pending":
        return "text-amber-600";
      case "failed":
      case "refunded":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const orderData = orders.find((order) => order._id === orderId);
      if (!orderData) return;

      if (orderData.orderStatus.toLowerCase() === "cancelled") {
        alert("Cannot download invoice for cancelled orders");
        return;
      }

      const invoiceContent = `
NATURAL STORE INVOICE
=====================

Order ID: ${orderData._id}
Customer: ${orderData.userName}
Email: ${orderData.userEmail}
Phone: ${orderData.phoneNumber}

Shipping Address:
${orderData.shippingAddress}

Order Date: ${new Date(orderData.placedAt).toLocaleDateString()}
Payment Status: ${orderData.paymentStatus}
Order Status: ${orderData.orderStatus}

Items:
${orderData.items
  .map(
    (item) => `- ${item.title} (Qty: ${item.quantity}) - $${item.price} each`
  )
  .join("\n")}

Total Amount: $${orderData.totalAmount.toFixed(2)}

Thank you for shopping with Natural Store!
      `;

      const blob = new Blob([invoiceContent], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${orderId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-green-700 text-lg font-medium">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error Loading Orders
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="bg-white shadow-sm border-b border-green-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                My Orders
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Track and manage your natural store orders
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8">
          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 mb-6">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm md:text-base bg-green-100 text-green-700 rounded-lg md:rounded-xl hover:bg-green-200 transition-colors"
                >
                  <Filter className="w-4 h-4 md:w-5 md:h-5" />
                  Filters
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 text-sm md:text-base border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="recent">Recent First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount-high">Amount: High to Low</option>
                  <option value="amount-low">Amount: Low to High</option>
                </select>
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      Order Status
                    </label>
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Statuses</option>
                      {getUniqueOrderStatuses().map((status) => (
                        <option key={status} value={status.toLowerCase()}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      Payment Status
                    </label>
                    <select
                      value={paymentStatusFilter}
                      onChange={(e) => setPaymentStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Payment Status</option>
                      {getUniquePaymentStatuses().map((status) => (
                        <option key={status} value={status.toLowerCase()}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={resetFilters}
                      className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between text-xs md:text-sm text-gray-600">
              <span>
                Showing {filteredOrders.length} of {orders.length} orders
              </span>
              {(orderStatusFilter !== "all" ||
                paymentStatusFilter !== "all" ||
                searchTerm) && (
                <span className="text-green-600 font-medium">
                  Filters applied
                </span>
              )}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center bg-white rounded-xl md:rounded-2xl shadow-lg p-6 md:p-12">
              <Package className="w-16 h-16 md:w-24 md:h-24 text-green-300 mx-auto mb-4" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                {orders.length === 0 ? "No Orders Found" : "No Matching Orders"}
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-5">
                {orders.length === 0
                  ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                  : "No orders match your current filters. Try adjusting your search criteria."}
              </p>
              {orders.length === 0 ? (
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 text-sm md:text-base rounded-full font-medium transition-colors">
                  Start Shopping
                </button>
              ) : (
                <button
                  onClick={resetFilters}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 text-sm md:text-base rounded-full font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  {/* Order Header - Responsive Stack */}
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 md:p-6">
                    <div className="flex flex-col gap-3 md:gap-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 rounded-full p-2">
                          <Package className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                          <h3 className="text-base md:text-xl font-bold">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-green-100 text-xs md:text-sm">
                            Placed on {formatDate(order.placedAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <div
                          className={`px-3 py-1.5 text-xs md:text-sm rounded-full flex items-center gap-1.5 ${getStatusColor(
                            order.orderStatus
                          )} bg-white/20 text-white`}
                        >
                          {getStatusIcon(order.orderStatus)}
                          <span>{order.orderStatus}</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {order.orderStatus.toLowerCase() !== "cancelled" ? (
                            <button
                              onClick={() =>
                                navigate(
                                  `/my-account/orders/view-invoice/${order._id}`
                                )
                              }
                              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 text-xs md:text-sm rounded-full flex items-center gap-1.5 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              <span>Invoice</span>
                            </button>
                          ) : (
                            <button
                              disabled
                              className="bg-gray-300 text-gray-500 px-3 py-1.5 text-xs md:text-sm rounded-full flex items-center gap-1.5 cursor-not-allowed"
                              title="Cannot view invoice for cancelled orders"
                            >
                              <XCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              <span>Unavailable</span>
                            </button>
                          )}

                          {canCancelOrder(
                            order.orderStatus,
                            order.paymentStatus
                          ) ? (
                            <button
                              onClick={() => openCancelModal(order._id)}
                              className="bg-red-500/20 hover:bg-red-500/30 text-white px-3 py-1.5 text-xs md:text-sm rounded-full flex items-center gap-1.5 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              <span>Cancel</span>
                            </button>
                          ) : (
                            order.orderStatus.toLowerCase() !== "cancelled" && (
                              <button
                                disabled
                                className="bg-gray-300 text-gray-500 px-3 py-1.5 text-xs md:text-sm rounded-full flex items-center gap-1.5 cursor-not-allowed"
                                title={
                                  order.paymentStatus.toLowerCase() !==
                                  "success"
                                    ? "Only successful payments can be cancelled"
                                    : "This order cannot be cancelled"
                                }
                              >
                                <XCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                <span>Unavailable</span>
                              </button>
                            )
                          )}
                        </div>
                        <div
                          onClick={() => navigate("/Contact")}
                          className={`cursor-pointer px-3 py-1.5 text-xs md:text-sm rounded-full flex items-center gap-1.5 bg-white/20 text-white`}
                        >
                          <Headset className="w-3.5 h-3.5 md:w-4 md:h-4" />{" "}
                          Contact Support
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-4 md:p-6">
                    {/* Customer Info - Responsive Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                        <User className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Customer</p>
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {order.userName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <Phone className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {order.phoneNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                        <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-500">Payment</p>
                          <p
                            className={`text-sm font-semibold ${getPaymentStatusColor(
                              order.paymentStatus
                            )}`}
                          >
                            {order.paymentStatus}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                        <div>
                          <p className="text-xs text-gray-500">Delivery</p>
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {order.expectedDelivery
                              ? formatDate(order.expectedDelivery)
                              : "TBD"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                        <h4 className="text-sm md:text-base font-semibold text-gray-800">
                          Shipping Address
                        </h4>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                        {order.shippingAddress}
                      </div>
                    </div>

                    {/* Order Items - Responsive Stack */}
                    <div className="mb-5">
                      <h4 className="text-sm md:text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                        Order Items ({order.items.length})
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item._id}
                            className="flex flex-col sm:flex-row items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg"
                          >
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-full sm:w-16 h-16 object-cover rounded-lg shadow"
                            />
                            <div className="flex-1 w-full">
                              <h5 className="text-sm md:text-base font-semibold text-gray-800">
                                {item.title}
                              </h5>
                              <p className="text-xs md:text-sm text-gray-600">
                                Weight: {item.weight}kg
                              </p>
                              <div className="flex flex-wrap gap-2 mt-1.5 text-xs md:text-sm">
                                <span className="text-green-600 font-semibold">
                                  ${item.price?.toFixed(2)}
                                </span>
                                <span className="text-gray-500">
                                  Qty: {item.quantity}
                                </span>
                                <span className="text-gray-800 font-semibold">
                                  Total: $
                                  {(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>

                              {/* Add rating button for delivered orders */}
                              {order.orderStatus.toLowerCase() ===
                                "delivered" && (
                                <div className="mt-2 flex justify-end">
                                  <button
                                    onClick={() => openRatingModal(item)}
                                    className="text-xs md:text-sm bg-amber-500 text-white px-2 py-1 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-1"
                                  >
                                    <Star className="w-3 h-3" />
                                    Rate Product
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Total */}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-base md:text-xl font-bold text-gray-800">
                          Total Amount:
                        </span>
                        <span className="text-lg md:text-2xl font-bold text-green-600">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cancel Order Modal - Responsive */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-5 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-red-100 rounded-full p-1.5">
                      <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800">
                      Cancel Order
                    </h3>
                  </div>
                  <button
                    onClick={closeCancelModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>

                <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                  Are you sure you want to cancel this order? Please provide a
                  reason for cancellation.
                </p>

                <div className="mb-4 md:mb-5">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                    Cancellation Reason *
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Reason for cancellation..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    rows="3"
                    required
                  />
                </div>

                <div className="flex gap-2 md:gap-3">
                  <button
                    onClick={closeCancelModal}
                    disabled={cancelLoading}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelLoading || !cancelReason.trim()}
                    className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    {cancelLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        Cancel Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rating Modal */}
        {showRatingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-5 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-100 rounded-full p-1.5">
                      <Star className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800">
                      Rate Product
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowRatingModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>

                <p className="text-gray-600 text-sm md:text-base mb-1">
                  How would you rate:
                </p>
                <p className="text-gray-800 font-medium mb-3 md:mb-4">
                  {currentProduct?.title}
                </p>

                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-3xl mx-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      {star <= (hoverRating || newRating) ? (
                        <Star className="text-amber-500 fill-current" />
                      ) : (
                        <Star className="text-amber-500" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="text-center mb-2">
                  <span className="text-amber-600 font-bold">
                    {hoverRating > 0
                      ? hoverRating
                      : newRating > 0
                      ? newRating
                      : "0"}
                    /5
                  </span>
                </div>

                {ratingError && (
                  <p className="text-red-500 text-sm text-center mb-3">
                    {ratingError}
                  </p>
                )}

                <div className="flex gap-2 md:gap-3">
                  <button
                    onClick={() => setShowRatingModal(false)}
                    disabled={ratingLoading}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitRating}
                    disabled={ratingLoading || newRating === 0}
                    className="flex-1 px-3 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    {ratingLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4" />
                        Submit Rating
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrdersPage;
