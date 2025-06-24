import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaypalCartPayment = ({
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
  const [paypalOid, setPaypalOid] = useState("");
  const navigate = useNavigate();
  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  };
  const styles = {
    shapes: "rect",
    layout: "vertical",
  };
  console.log("---- TOTAL ITEMS ARRAY ---", totalItemsArray);
  console.log("---- PRODUCT PRICE ---", productPrice);
  console.log("---- SHIPPINH MODE  ---", sha);
  console.log("---- PRODUCT PRICE ---", products[0]?.price);
  console.log("--- QUANTITY---", quantity);
  console.log("--- USER SELECTED WEIGHT ---", userSelectedWeight);

  const onCreateOrder = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/paypal/create-order`,
        { price: productPrice.toFixed(2) }
      );
      console.log(response);
      setPaypalOid(response.data.orderId);
      return response.data.orderId;
    } catch (error) {
      console.log(`Error creating order: ${error}`);
    }
  };
  const onApprove = async () => {
    console.log("CREATING ORDER FOR THE FOLLOWING:", uid);
    console.log("CREATING ORDER FOR THE FOLLOWING:", num);
    console.log("CREATING ORDER FOR THE FOLLOWING:", sha);
    console.log("CREATING ORDER FOR THE FOLLOWING:", productPrice);
    console.log("CREATING ORDER FOR THE FOLLOWING:", dmode);
    console.log("CREATING ORDER FOR THE FOLLOWING:", products[0]?._id);
    console.log("CREATING ORDER FOR THE FOLLOWING:", products[0]?.price);
    console.log("CREATING ORDER FOR THE FOLLOWING:", userSelectedWeight);
    console.log("CREATING ORDER FOR THE FOLLOWING:", quantity);
    console.log("CREATING ORDER FOR THE FOLLOWING:", paypalOid);

    try {
      const expectedDeliveryDate = new Date();
      expectedDeliveryDate.setDate(
        expectedDeliveryDate.getDate() + dmode === "air" ? 50 : 100
      );
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/create-cart-order`,
        {
          user: uid,
          phoneNumber: num,
          shippingAddress: sha,
          totalAmount: productPrice,
          shipThrough: dmode,
          items: totalItemsArray,
          expectedDelivery: expectedDeliveryDate,
          paypalOid: paypalOid,
        }
      );

      console.log(response.data);
      navigate("/complete-payment");
    } catch (error) {
      console.log("On approve error", error.response?.data || error.message);
    }
  };

  const onError = () => {
    console.error(`Payment Error`);
    // window.location.href = "/payment-cancel";
  };
  console.log("products", products);
  return (
    <>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={styles}
          createOrder={onCreateOrder}
          onApprove={onApprove}
          onError={onError}
          //   fundingSource="paypal"
        ></PayPalButtons>
      </PayPalScriptProvider>
    </>
  );
};

export default PaypalCartPayment;
