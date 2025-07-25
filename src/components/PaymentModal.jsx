/* eslint-disable no-irregular-whitespace */
import {
  ChevronLeft,
  Heart,
  ShoppingBag,
  ChevronRight,
  Star,
  Loader2,
  X,
  CreditCard,
  Shield,
  Plus,
  Minus,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import PaypalPayment from "./PaypalPayment";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PaymentModal = ({
  showPaymentModal,
  closePaymentModal,
  product,
  selectedWeight,
}) => {
  const [user, setUser] = useState();
  const [finalPrice, setFinalPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [finalWeight, setFinalWeight] = useState();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [step, setStep] = useState("address");
  const [loading, setLoading] = useState(true);
  const [deliveryCharge, setDeliveryCharge] = useState(200); // Default fallback

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      const newTotalWeight = selectedWeight * newQuantity;
      setFinalWeight(newTotalWeight);
    }
  };

  const calculateShippingAndTotal = (qty = 1, productWeight) => {
    const totalWeight = productWeight * qty;
    const shippingPrice = totalWeight * deliveryCharge;
    
    setShippingCost(shippingPrice);
    setFinalPrice(selectedWeight * product.price * quantity + shippingPrice);
  };

  const fetchIndianDeliveryCharge = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/indcharge/getingcharge`);
      if (res.data.charge && res.data.charge.length > 0) {
        const charge = res.data.charge[0].charge;
        setDeliveryCharge(charge);
        return charge;
      }
    } catch (error) {
      console.error("Error fetching Indian delivery charges:", error);
      toast.error("Failed to load shipping rates. Using default values.");
      return deliveryCharge; // Return default value
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);

        // Fetch delivery charges first
        const charge = await fetchIndianDeliveryCharge();

        const userRes = await axios.get(
          `${backendUrl}/api/auth/user/${localStorage.getItem("uid")}`
        );
        setUser(userRes.data.user);

        if (userRes.data.user.address.length === 0) {
          toast(
            "Please add your address/phone in your profile before making a purchase"
          );
          navigate("/my-account/addresses");
        } else {
          setSelectedAddress(userRes.data.user.address[0]);
        }

        const totalWeight = selectedWeight * quantity;
        setFinalWeight(totalWeight);

        if (product && selectedWeight) {
          calculateShippingAndTotal(quantity, selectedWeight);
        }
      } catch (error) {
        console.error("Initialization error:", error);
        toast.error("Failed to initialize payment data");
      } finally {
        setLoading(false);
      }
    };

    if (showPaymentModal) {
      initializeData();
    }
  }, [showPaymentModal, product, selectedWeight]);

  useEffect(() => {
    if (!loading) {
      const totalWeight = selectedWeight * quantity;
      setFinalWeight(totalWeight);

      if (product && selectedWeight) {
        calculateShippingAndTotal(quantity, selectedWeight);
      }
    }
  }, [quantity, loading, deliveryCharge]);

  const formatPrice = (price) => {
    return typeof price === "number" ? price.toFixed(2) : "0.00";
  };

  const productTotalPrice = selectedWeight * product.price * quantity;

  const formatAddress = (address) => {
    return `${address.addressLine1}, ${address.addressLine2}, ${address.city}, ${address.state}, ${address.country} - ${address.pinCode}`;
  };

  const handleContinueToPayment = () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }
    setStep("payment");
  };

  const AddressSelectionStep = () => (
    <div className="px-6 py-6 space-y-6">
      <div className="bg-gray-50 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Select Shipping Address
          </h3>
          <button
            onClick={() => navigate("/my-account/addresses")}
            className="text-green-800 text-sm font-medium flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" /> Add New
          </button>
        </div>

        {user?.address?.map((address) => (
          <div
            key={address._id}
            className={`border rounded-lg p-4 mb-3 cursor-pointer transition-all ${
              selectedAddress?._id === address._id
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedAddress(address)}
          >
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-green-800 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">{user.FullName}</p>
                <p className="text-gray-600">{address.addressLine1}</p>
                {address.addressLine2 && (
                  <p className="text-gray-600">{address.addressLine2}</p>
                )}
                <p className="text-gray-600">
                  {address.city}, {address.state}, {address.country} -{" "}
                  {address.pinCode}
                </p>
                <p className="text-gray-600 mt-1">
                  Phone: {address.phone || user.phoneNumber}
                </p>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={handleContinueToPayment}
          className="w-full bg-green-800 text-white rounded-xl py-3 font-medium mt-4 hover:bg-green-700 transition"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-green-800 animate-spin mb-4" />
          <p className="text-gray-700">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          showPaymentModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closePaymentModal}
      />

      {/* Modal */}
      <div
        className={`fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50 transition-all duration-500 ease-out ${
          showPaymentModal
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        {/* Mobile Modal */}
        <div data-lenis-prevent className="md:hidden bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto no-visible-scrollbar">
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === "address" ? "bg-green-800" : "bg-gray-100"
                }`}
              >
                {step === "address" ? (
                  <MapPin className="w-5 h-5 text-white" />
                ) : (
                  <CreditCard className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {step === "address" ? "Address" : "Payment"}
                </h3>
                <p className="text-sm text-gray-500">
                  {step === "address"
                    ? "Select shipping address"
                    : "Secure checkout"}
                </p>
              </div>
            </div>
            <button
              onClick={closePaymentModal}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          {step === "address" ? (
            <AddressSelectionStep />
          ) : (
            <div className="px-6 py-6 space-y-6">
              {/* Address Summary */}
              {selectedAddress && (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Shipping To</h4>
                    <button
                      onClick={() => setStep("address")}
                      className="text-green-800 text-sm"
                    >
                      Change
                    </button>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-green-800 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {user?.FullName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedAddress.addressLine1}
                      </p>
                      {selectedAddress.addressLine2 && (
                        <p className="text-sm text-gray-600">
                          {selectedAddress.addressLine2}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        {selectedAddress.city}, {selectedAddress.state},{" "}
                        {selectedAddress.country} - {selectedAddress.pinCode}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Phone: {selectedAddress.phone || user?.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {product.title}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Weight: {selectedWeight}kg × {quantity} = {finalWeight}kg
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{formatPrice(product.price)}/kg
                    </p>
                  </div>
                </div>

                {/* Quantity Selector for Mobile */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Quantity
                    </span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Shipping Method
                    </span>
                    <span className="text-sm text-green-800 font-medium">
                      Standard Delivery
                    </span>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Express Shipping
                        </p>
                        <p className="text-xs text-gray-600">
                          ₹{deliveryCharge}/kg • 5-7 business days
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{formatPrice(shippingCost)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown for Mobile */}
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Product Price (₹{formatPrice(product.price)}/kg ×{" "}
                      {selectedWeight}kg × {quantity})
                    </span>
                    <span className="text-gray-900">
                      ₹{formatPrice(productTotalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      ₹{formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-green-800">
                      ₹{formatPrice(finalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-800" />
                <span>256-bit SSL encrypted payment</span>
              </div>

              {/* PayPal Buttons */}
              <div className="space-y-3">
                {selectedAddress && (
                  <PaypalPayment
                    productPrice={finalPrice}
                    uid={localStorage.getItem("uid")}
                    num={selectedAddress.phone || user?.phoneNumber}
                    sha={formatAddress(selectedAddress)}
                    products={[product]}
                    weight={finalWeight}
                    userSelectedWeight={selectedWeight}
                    quantity={quantity}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Modal */}
        <div data-lenis-prevent className="hidden md:block bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto no-visible-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  step === "address" ? "bg-green-800" : "bg-gray-100"
                }`}
              >
                {step === "address" ? (
                  <MapPin className="w-6 h-6 text-white" />
                ) : (
                  <CreditCard className="w-6 h-6 text-gray-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {step === "address"
                    ? "Select Shipping Address"
                    : "Secure Payment"}
                </h3>
                <p className="text-gray-500">
                  {step === "address"
                    ? "Choose delivery address"
                    : "Complete your purchase"}
                </p>
              </div>
            </div>
            <button
              onClick={closePaymentModal}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {step === "address" ? (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-lg text-gray-900">
                      Your Addresses
                    </h4>
                    <button
                      onClick={() => navigate("/my-account/addresses")}
                      className="text-green-800 font-medium flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add New Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user?.address?.map((address) => (
                      <div
                        key={address._id}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          selectedAddress?._id === address._id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <div className="flex items-start">
                          <MapPin className="w-5 h-5 text-green-800 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.FullName}
                            </p>
                            <p className="text-gray-600">
                              {address.addressLine1}
                            </p>
                            {address.addressLine2 && (
                              <p className="text-gray-600">
                                {address.addressLine2}
                              </p>
                            )}
                            <p className="text-gray-600">
                              {address.city}, {address.state}, {address.country}{" "}
                              - {address.pinCode}
                            </p>
                            <p className="text-gray-600 mt-1">
                              Phone: {address.phone || user.phoneNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleContinueToPayment}
                    className="w-full bg-green-800 text-white rounded-xl py-3 font-medium mt-6 hover:bg-green-700 transition"
                    disabled={!selectedAddress}
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left - Order Summary */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Order Summary
                  </h4>

                  {/* Selected Address */}
                  {selectedAddress && (
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium text-gray-900">
                          Shipping Address
                        </h5>
                        <button
                          onClick={() => setStep("address")}
                          className="text-green-800 text-sm"
                        >
                          Change
                        </button>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-green-800 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {user?.FullName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedAddress.addressLine1}
                          </p>
                          {selectedAddress.addressLine2 && (
                            <p className="text-sm text-gray-600">
                              {selectedAddress.addressLine2}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            {selectedAddress.city}, {selectedAddress.state},{" "}
                            {selectedAddress.country} -{" "}
                            {selectedAddress.pinCode}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Phone: {selectedAddress.phone || user?.phoneNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">
                          {product.title}
                        </h5>
                        <p className="text-sm text-gray-500">
                          Weight: {selectedWeight}kg × {quantity} ={" "}
                          {finalWeight}kg
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          ₹{formatPrice(product.price)}/kg
                        </p>
                      </div>
                    </div>

                    {/* Quantity Selector for Desktop */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Quantity
                        </span>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                            disabled={quantity <= 1}
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="text-lg font-semibold text-gray-900 min-w-[3rem] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Shipping Method
                        </span>
                        <span className="text-sm text-green-800 font-medium">
                          Standard Delivery
                        </span>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-green-800">
                              Express Shipping
                            </p>
                            <p className="text-sm text-gray-600">
                              ₹{deliveryCharge}/kg • 5-7 business days
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Total weight: {finalWeight}kg
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-semibold text-gray-900">
                              ₹{formatPrice(shippingCost)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Product Price (₹{formatPrice(product.price)}/kg ×{" "}
                          {selectedWeight}kg × {quantity})
                        </span>
                        <span className="text-gray-900">
                          ₹{formatPrice(productTotalPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-gray-900">
                          ₹{formatPrice(shippingCost)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="text-gray-900">₹0.00</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-200">
                        <span>Total</span>
                        <span className="text-green-800">
                          ₹{formatPrice(finalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-5 h-5 text-green-800" />
                    <span>
                      Your payment information is secure and encrypted
                    </span>
                  </div>
                </div>

                {/* Right - Payment Methods */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Payment Method
                  </h4>

                  <div className="space-y-4">
                    {selectedAddress && (
                      <PaypalPayment
                        productPrice={finalPrice}
                        uid={localStorage.getItem("uid")}
                        num={selectedAddress.phone || user?.phoneNumber}
                        sha={formatAddress(selectedAddress)}
                        products={[product]}
                        weight={finalWeight}
                        userSelectedWeight={selectedWeight}
                        quantity={quantity}
                      />
                    )}
                    <div className="text-xs text-gray-500 text-center mt-4">
                      By completing your purchase, you agree to our Terms of
                      Service and Privacy Policy.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .no-visible-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .no-visible-scrollbar::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
          background: transparent;
        }
      `}</style>
    </>
  );
};

export default PaymentModal;