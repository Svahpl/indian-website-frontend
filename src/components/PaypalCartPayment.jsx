/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RazorpayCartPayment = ({
  productPrice = 0,
  uid,
  num,
  sha,
  dmode,
  products,
  userSelectedWeight,
  totalWeight,
  totalItemsArray,
  quantity = 1,
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [razorpayOrderId, setRazorpayOrderId] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log("---- TOTAL ITEMS ARRAY ---", totalItemsArray);
  console.log("---- PRODUCT PRICE ---", productPrice);
  console.log("---- SHIPPING MODE ---", sha);
  console.log("---- PRODUCT PRICE ---", products[0]?.price);
  console.log("--- QUANTITY---", quantity);
  console.log("--- USER SELECTED WEIGHT ---", userSelectedWeight);

  const getUserDetails = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/auth/user/${uid}`);
      setUser(res.data.user);
      return res.data.user;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  };

  const createCartOrder = async (rzpOrderId) => {
    try {
      console.log("CREATING CART ORDER FOR THE FOLLOWING:", uid);
      console.log("CREATING CART ORDER FOR THE FOLLOWING:", num);
      console.log("CREATING CART ORDER FOR THE FOLLOWING:", sha);
      console.log("CREATING CART ORDER FOR THE FOLLOWING:", productPrice);
      console.log("CREATING CART ORDER FOR THE FOLLOWING:", dmode);
      console.log("CREATING CART ORDER FOR THE FOLLOWING:", totalItemsArray);
      console.log("CREATING CART ORDER FOR THE FOLLOWING:", rzpOrderId);

      const expectedDeliveryDate = new Date();
      expectedDeliveryDate.setDate(
        expectedDeliveryDate.getDate() + (dmode === "air" ? 50 : 100)
      );

      // Transform totalItemsArray to match the expected format
      const formattedItems = totalItemsArray.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
        weight: item.weight,
      }));

      const totalAmount = productPrice.toFixed(1);

      const res = await axios.post(`${backendUrl}/api/order/cart-india-order`, {
        user: uid,
        phoneNumber: num,
        shippingAddress: sha,
        expectedDelivery: expectedDeliveryDate,
        razorpayOrderId: rzpOrderId,
        rzpId: rzpOrderId, // Add this field for verification lookup
        items: formattedItems,
        totalAmount: totalAmount,
        paymentStatus: "Pending", // Set initial status
      });

      console.log("Cart Order Creation Response", res);
      return res.data;
    } catch (error) {
      console.log(`Error creating cart order: ${error}`);
      throw error;
    }
  };

  const initiateRazorpayCheckout = async () => {
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    console.log("key", key);

    console.log("Sending total amount", productPrice.toFixed(1));
    console.log("products", products);

    try {
      setIsLoading(true);

      // Get user details first
      const userData = await getUserDetails();

      // Create Razorpay order
      const checkoutResponse = await axios.post(
        `${backendUrl}/api/razorpay/checkout`,
        {
          amount: productPrice.toFixed(1),
        }
      );

      if (checkoutResponse.status === 200) {
        const rzpOrderId = checkoutResponse.data.order.id;
        setRazorpayOrderId(rzpOrderId);
        localStorage.setItem("rzp_order_id", rzpOrderId);

        // CREATE CART ORDER IN DATABASE BEFORE PAYMENT
        await createCartOrder(rzpOrderId);

        setIsLoading(false); // Hide loader before opening Razorpay

        // Create product description from cart items
        const productDesc =
          totalItemsArray.length > 1
            ? `Cart Order - ${totalItemsArray.length} items`
            : `${totalItemsArray[0]?.title?.slice(0, 200) || "Product Order"}`;

        var options = {
          key: key,
          amount: checkoutResponse.data.order.amount / 100,
          currency: "INR",
          name: "SVAH Agros & Herbs",
          description: productDesc,
          image: "https://www.svahpl.com/images/LOGO.png",
          order_id: checkoutResponse.data.order.id,
          callback_url: `${backendUrl}/api/razorpay/payment-verification`,
          prefill: {
            name: userData.FullName || "",
            email: userData.Email || "",
            contact: num,
          },
          notes: {
            address: sha,
            city: userData.address[0]?.city || "",
            state: userData.address[0]?.state || "",
            pincode: userData.address[0]?.pinCode || "",
            totalItems: totalItemsArray.length,
            orderType: "cart",
          },
          theme: {
            color: "#166535",
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();

        razor.on("payment.success", async function (response) {
          toast.success("Payment successful! Cart order placed.");
          navigate("/complete-payment");
        });

        razor.on("payment.failed", function (response) {
          toast.error(
            `Payment failed: ${response.error.reason || "Unknown error"}`
          );
          console.log("Payment Failed!");
          console.log("Error Code:", response.error.code);
          console.log("Description:", response.error.description);
          console.log("Source:", response.error.source);
          console.log("Step:", response.error.step);
          console.log("Reason:", response.error.reason);
          console.log("Order ID:", response.error.metadata.order_id);
          console.log("Payment ID:", response.error.metadata.payment_id);
          window.location.reload();
        });
      }
    } catch (error) {
      setIsLoading(false); // Hide loader on error
      console.log(error);
      console.error("Error during cart checkout:", error);
      toast.error("Payment initialization failed. Please try again.");
    }
  };

  const pay = async () => {
    await initiateRazorpayCheckout();
  };

  return (
    <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
      <button
        onClick={() => pay()}
        disabled={isLoading}
        style={{
          width: "100%",
          backgroundColor: isLoading ? "#8fbc8f" : "#166535",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "14px 20px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: isLoading ? "not-allowed" : "pointer",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          transition: "all 0.3s ease-in-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow = "0 6px 18px rgba(0, 0, 0, 0.2)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
          }
        }}
      >
        {isLoading && (
          <div
            style={{
              width: "20px",
              height: "20px",
              border: "2px solid #ffffff40",
              borderTop: "2px solid #ffffff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        )}
        {isLoading ? "Processing Cart..." : "Pay with Razorpay"}
      </button>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default RazorpayCartPayment;
