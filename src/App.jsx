import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CyberCrimeWarning from "./components/CyberCrimeWarning";
import Header from "./components/Header";
import Slideshow from "./components/Slideshow";
import CategorySection from "./components/CategorySection";
import Certificates from "./components/Certificates";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ShippingPolicy from "./components/ShippingPolicy";
import TermsOfService from "./components/TermsOfService";

import {
  HomePage,
  CartPage,
  AccountPage,
  ProductPage,
  CategoryProducts,
  WishlistPage,
  MyOrdersPage,
  Invoice,
  Logout,
} from "./Page/pageIndex";
import ProductScreen from "./Page/ProductScreen";
import { AddressManager } from "./components/compIndex";
import PaypalPayment from "./components/PaypalPayment";
import PaymentSuccess from "./components/PaymentSuccess";
import { Toaster } from "react-hot-toast";

function App() {
  useEffect(() => {
    const titleElement = document.querySelector("title[data-default]");
    if (titleElement) {
      titleElement.removeAttribute("data-default");
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white font-sans">
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontSize: "17px", background: "#166434", color: "white" },
          }}
        />
        <CyberCrimeWarning />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/my-account/cart" element={<CartPage />} />
          <Route path="/my-account/wishlist" element={<WishlistPage />} />
          <Route path="/view-product/:id" element={<ProductScreen />} />
          <Route path="/view-products" element={<CategoryProducts />} />
          <Route path="/my-account/orders" element={<MyOrdersPage />} />
          <Route
            path="/my-account/orders/view-invoice/:id"
            element={<Invoice />}
          />
          <Route path="/my-account" element={<AccountPage />} />
          <Route path="/my-account/addresses" element={<AddressManager />} />
          {/* -------- IMPORTANT PAYMENT ROUTES DO NOT TOUCH ---------- */}
          <Route path="/paypal-test" element={<PaypalPayment />} />
          <Route path="/complete-payment" element={<PaymentSuccess />} />
          {/* ----------------- END OF PAYMENT ROUTES ------------ */}

          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          {/* <Route path="/privacy-policy" element={<PrivacyPolicy />} /> */}
          <Route path="/about" element={<About />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/blog" element={<></>} />
          <Route
            path="*"
            element={
              <>
                <div>404 Not Found</div>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
