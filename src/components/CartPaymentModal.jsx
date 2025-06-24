import {
  MapPin,
  CreditCard,
  Shield,
  Plus,
  Minus,
  X,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PaypalCartPayment from "./PaypalCartPayment";

const CartPaymentModal = ({
  showPaymentModal,
  closePaymentModal,
  cartItems,
}) => {
  const [shippingMethod, setShippingMethod] = useState("air");
  const [user, setUser] = useState();
  const [finalPrice, setFinalPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [dollar, setDollar] = useState(null);
  const [finalWeight, setFinalWeight] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [step, setStep] = useState("address");
  const [reloadPaypal, setReloadPaypal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [deliveryCharges, setDeliveryCharges] = useState({
    air: 1000, // Default values
    ship: 700,
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // Memoize cart totals to prevent unnecessary recalculations
  const { totalWeight, totalPrice } = useMemo(() => {
    let weight = 0;
    let price = 0;

    cartItems.forEach((item) => {
      weight += item.weight * item.quantity;
      price += item.price * item.weight * item.quantity;
    });

    return { totalWeight: weight, totalPrice: price };
  }, [cartItems]);

  const handleShippingChange = useCallback((method) => {
    setShippingMethod(method);
  }, []);

  const handleShippingCharges = useCallback(
    (method) => {
      if (!dollar) return;

      let shippingPrice = 0;
      const { air, ship } = deliveryCharges;

      if (method === "ship") {
        shippingPrice = totalWeight * (ship / dollar);
      } else if (method === "air") {
        shippingPrice = totalWeight * (air / dollar);
      }

      setShippingCost(shippingPrice);
      setFinalPrice(totalPrice + shippingPrice);
    },
    [totalWeight, totalPrice, dollar, deliveryCharges]
  );

  const getCurrentDollarinInr = useCallback(async () => {
    try {
      const res = await axios.get(`https://open.er-api.com/v6/latest/USD`);
      const inr = res.data.rates.INR;
      setDollar(inr);
      console.log("Current dollar rate in INR:", inr);
    } catch (error) {
      console.error(`Error fetching current dollar price in INR: ${error}`);
      setDollar(83.5);
    }
  }, []);

  // Fetch delivery charges from API
  const fetchDeliveryCharges = useCallback(async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/charge/getcharge`);
      if (res.data.delcharge && res.data.delcharge.length > 0) {
        const { aircharge, shipcharge } = res.data.delcharge[0];
        setDeliveryCharges({
          air: aircharge,
          ship: shipcharge,
        });
        console.log("Fetched delivery charges:", aircharge, shipcharge);
      }
    } catch (error) {
      console.error("Error fetching delivery charges:", error);
      toast.error("Failed to load delivery charges. Using default values.");
    }
  }, [backendUrl]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    getCurrentDollarinInr().finally(() => {
      setReloadPaypal((prev) => !prev);
      setIsRefreshing(false);
    });
  }, [getCurrentDollarinInr]);

  // Initialize with dollar rate and delivery charges
  useEffect(() => {
    if (showPaymentModal) {
      setIsInitializing(true);

      Promise.all([getCurrentDollarinInr(), fetchDeliveryCharges()]).finally(
        () => {
          setIsInitializing(false);
        }
      );
    }
  }, [showPaymentModal, getCurrentDollarinInr, fetchDeliveryCharges]);

  // Calculate shipping and final price when dependencies change
  useEffect(() => {
    if (!dollar) return;

    setFinalWeight(totalWeight);

    if (shippingMethod === "ship" && totalWeight < 100) {
      setShippingMethod("air");
    }

    handleShippingCharges(shippingMethod);
  }, [
    totalWeight,
    shippingMethod,
    handleShippingCharges,
    dollar,
    deliveryCharges,
  ]);

  // Fetch user data after initialization
  useEffect(() => {
    if (!showPaymentModal || isInitializing) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/auth/user/${localStorage.getItem("uid")}`
        );
        setUser(res.data.user);

        if (res.data.user.address.length === 0) {
          toast(
            "Please add your address/phone in your profile before making a purchase"
          );
          navigate("/my-account/addresses");
        } else {
          setSelectedAddress(res.data.user.address[0]);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [backendUrl, navigate, showPaymentModal, isInitializing]);

  const formatPrice = (price) => {
    return typeof price === "number" ? price.toFixed(2) : "0.00";
  };

  const isShipShippingAvailable = totalWeight >= 100;

  const formatAddress = (address) => {
    return `${address.addressLine1}, ${address.addressLine2}, ${address.city}, ${address.state}, ${address.country} - ${address.pinCode}`;
  };

  const handleContinueToPayment = useCallback(() => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }
    setStep("payment");
  }, [selectedAddress]);

  const handleQuantityChange = useCallback((itemId, newQuantity) => {
    if (newQuantity >= 1) {
      console.log(`Updating item ${itemId} quantity to ${newQuantity}`);
    }
  }, []);

  const AddressSelectionStep = useCallback(
    () => (
      <div className="px-6 py-6 space-y-6">
        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Select Shipping Address
            </h3>
            <button
              onClick={() => navigate("/my-account/addresses")}
              className="text-green-700 hover:text-green-800 text-sm font-medium flex items-center transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" /> Add New
            </button>
          </div>

          {user?.address?.map((address) => (
            <div
              key={address._id}
              className={`border-2 rounded-lg p-4 mb-4 cursor-pointer transition-all ${
                selectedAddress?._id === address._id
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedAddress(address)}
            >
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-green-700 mr-3 mt-0.5 flex-shrink-0" />
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
            className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-3 font-medium mt-6 transition-colors duration-200 shadow-sm hover:shadow-md"
            disabled={!selectedAddress}
          >
            Continue to Payment
          </button>
        </div>
      </div>
    ),
    [user, selectedAddress, handleContinueToPayment, navigate]
  );

  if (!showPaymentModal) return null;

  if (isInitializing) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Loading Current Rates
          </h3>
          <p className="text-gray-600">
            Please wait while we fetch the latest rates and charges...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={closePaymentModal}
      />

      <div className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50 transition-all duration-500 ease-out">
        {/* Mobile Modal */}
        <div className="md:hidden bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto no-visible-scrollbar">
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === "address" ? "bg-green-700" : "bg-gray-100"
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

          {step === "address" ? (
            <AddressSelectionStep />
          ) : (
            <div className="px-6 py-6 space-y-6">
              {selectedAddress && (
                <div className="bg-gray-50 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Shipping To</h4>
                    <button
                      onClick={() => setStep("address")}
                      className="text-green-700 hover:text-green-800 text-sm transition-colors"
                    >
                      Change
                    </button>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-green-700 mr-3 mt-0.5 flex-shrink-0" />
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

              <div className="bg-gray-50 rounded-2xl p-5">
                <h4 className="font-medium text-gray-900 mb-4">
                  Your Items ({cartItems.length})
                </h4>

                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-start space-x-4 mb-4 pb-4 border-b border-gray-200 last:border-0"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Weight: {item.weight}kg × {item.quantity} ={" "}
                        {item.weight * item.quantity}kg
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        ${formatPrice(item.price)}/kg
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Quantity
                        </span>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Product Price</span>
                    <span className="text-gray-900">
                      ${formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Shipping ({shippingMethod === "air" ? "Air" : "Ship"})
                    </span>
                    <span className="text-gray-900">
                      ${formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-green-700">
                      ${formatPrice(finalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-sm font-medium text-gray-700">
                  Choose Shipping Method:
                </h5>
                <div
                  className={`grid ${
                    isShipShippingAvailable ? "grid-cols-2" : "grid-cols-1"
                  } gap-3`}
                >
                  <label
                    className={`flex flex-col items-center space-y-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      shippingMethod === "air"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value="air"
                      checked={shippingMethod === "air"}
                      onChange={() => handleShippingChange("air")}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="font-medium text-sm">Air Shipping</div>
                      <div className="text-xs text-gray-500">
                        $
                        {formatPrice(
                          totalWeight * (deliveryCharges.air / dollar)
                        )}
                      </div>
                      <div className="text-xs text-gray-500">5-7 days</div>
                    </div>
                  </label>

                  {isShipShippingAvailable && (
                    <label
                      className={`flex flex-col items-center space-y-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        shippingMethod === "ship"
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value="ship"
                        checked={shippingMethod === "ship"}
                        onChange={() => handleShippingChange("ship")}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="font-medium text-sm">Sea Shipping</div>
                        <div className="text-xs text-gray-500">
                          $
                          {formatPrice(
                            totalWeight * (deliveryCharges.ship / dollar)
                          )}
                        </div>
                        <div className="text-xs text-gray-500">15-25 days</div>
                      </div>
                    </label>
                  )}
                </div>

                {!isShipShippingAvailable && (
                  <div className="text-xs text-gray-500 text-center bg-gray-100 p-3 rounded-lg">
                    Sea shipping is available for orders of 100kg or more.
                    Current weight: {totalWeight}kg
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-700" />
                <span>256-bit SSL encrypted payment</span>
              </div>

              <div className="space-y-4">
                {selectedAddress && (
                  <div className="relative bg-gray-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">
                        Payment Method
                      </h4>
                      <button
                        onClick={handleRefresh}
                        className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                        aria-label="Refresh payment options"
                        data-tooltip="Refresh payment"
                        disabled={isRefreshing}
                      >
                        <RefreshCw
                          className={`w-5 h-5 text-gray-600 ${
                            isRefreshing ? "animate-spin" : ""
                          }`}
                        />
                      </button>
                    </div>
                    <PaypalCartPayment
                      key={reloadPaypal}
                      productPrice={finalPrice}
                      uid={localStorage.getItem("uid")}
                      num={selectedAddress.phone || user?.phoneNumber}
                      sha={formatAddress(selectedAddress)}
                      totalItemsArray={cartItems}
                      dmode={shippingMethod}
                      products={cartItems}
                      weight={totalWeight}
                      userSelectedWeight={cartItems.reduce(
                        (acc, item) => acc + item.weight,
                        0
                      )}
                      quantity={cartItems.reduce(
                        (acc, item) => acc + item.quantity,
                        0
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Modal */}
        <div className="hidden md:block bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto no-visible-scrollbar">
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  step === "address" ? "bg-green-700" : "bg-gray-100"
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

          <div className="px-8 py-8">
            {step === "address" ? (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-medium text-lg text-gray-900">
                      Your Addresses
                    </h4>
                    <button
                      onClick={() => navigate("/my-account/addresses")}
                      className="text-green-700 hover:text-green-800 font-medium flex items-center transition-colors"
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
                            ? "border-green-600 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <div className="flex items-start">
                          <MapPin className="w-5 h-5 text-green-700 mr-3 mt-0.5 flex-shrink-0" />
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
                    className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-3 font-medium mt-6 transition-colors duration-200 shadow-sm hover:shadow-md"
                    disabled={!selectedAddress}
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Order Summary ({cartItems.length} items)
                  </h4>

                  {selectedAddress && (
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium text-gray-900">
                          Shipping Address
                        </h5>
                        <button
                          onClick={() => setStep("address")}
                          className="text-green-700 hover:text-green-800 text-sm transition-colors"
                        >
                          Change
                        </button>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-green-700 mr-3 mt-0.5 flex-shrink-0" />
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
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-0"
                        >
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-xl"
                          />
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">
                              {item.title}
                            </h5>
                            <p className="text-sm text-gray-500">
                              Weight: {item.weight}kg × {item.quantity} ={" "}
                              {item.weight * item.quantity}kg
                            </p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">
                              ${formatPrice(item.price)}/kg
                            </p>
                            <p className="text-sm text-gray-500">
                              $
                              {formatPrice(
                                item.price * item.weight * item.quantity
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 space-y-4">
                      <h5 className="text-sm font-medium text-gray-700">
                        Choose Shipping Method:
                      </h5>
                      <div
                        className={`grid ${
                          isShipShippingAvailable
                            ? "grid-cols-2"
                            : "grid-cols-1"
                        } gap-4`}
                      >
                        <label
                          className={`flex flex-col space-y-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            shippingMethod === "air"
                              ? "border-green-600 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="shipping-desktop"
                              value="air"
                              checked={shippingMethod === "air"}
                              onChange={() => handleShippingChange("air")}
                              className="w-4 h-4 text-green-700"
                            />
                            <div>
                              <div className="font-medium text-sm">
                                Air Shipping
                              </div>
                              <div className="text-xs text-gray-500">
                                5-7 business days
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-gray-900">
                              $
                              {formatPrice(
                                totalWeight * (deliveryCharges.air / dollar)
                              )}
                            </span>
                          </div>
                        </label>

                        {isShipShippingAvailable && (
                          <label
                            className={`flex flex-col space-y-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              shippingMethod === "ship"
                                ? "border-green-600 bg-green-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="shipping-desktop"
                                value="ship"
                                checked={shippingMethod === "ship"}
                                onChange={() => handleShippingChange("ship")}
                                className="w-4 h-4 text-green-700"
                              />
                              <div>
                                <div className="font-medium text-sm">
                                  Sea Shipping
                                </div>
                                <div className="text-xs text-gray-500">
                                  15-25 business days
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-semibold text-gray-900">
                                $
                                {formatPrice(
                                  totalWeight * (deliveryCharges.ship / dollar)
                                )}
                              </span>
                            </div>
                          </label>
                        )}
                      </div>

                      {!isShipShippingAvailable && (
                        <div className="text-xs text-gray-500 text-center bg-gray-100 p-3 rounded-lg">
                          Sea shipping is available for orders of 100kg or more.
                          Current weight: {totalWeight}kg
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Product Price</span>
                        <span className="text-gray-900">
                          ${formatPrice(totalPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Shipping ({shippingMethod === "air" ? "Air" : "Sea"})
                        </span>
                        <span className="text-gray-900">
                          ${formatPrice(shippingCost)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="text-gray-900">$0.00</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-200">
                        <span>Total</span>
                        <span className="text-green-700">
                          ${formatPrice(finalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-5 h-5 text-green-700" />
                    <span>
                      Your payment information is secure and encrypted
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Payment Method
                  </h4>

                  <div className="space-y-4">
                    {selectedAddress && (
                      <div className="relative bg-gray-50 p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="font-medium text-gray-900">
                            Complete Payment
                          </h5>
                          <button
                            onClick={handleRefresh}
                            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors group"
                            aria-label="Refresh payment options"
                            disabled={isRefreshing}
                          >
                            <RefreshCw
                              className={`w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors ${
                                isRefreshing ? "animate-spin" : ""
                              }`}
                            />
                            <span className="sr-only">Refresh payment</span>
                          </button>
                        </div>
                        <PaypalCartPayment
                          key={reloadPaypal}
                          productPrice={finalPrice}
                          uid={localStorage.getItem("uid")}
                          num={selectedAddress.phone || user?.phoneNumber}
                          sha={formatAddress(selectedAddress)}
                          dmode={shippingMethod}
                          totalItemsArray={cartItems}
                          products={cartItems}
                          weight={totalWeight}
                          userSelectedWeight={cartItems.reduce(
                            (acc, item) => acc + item.weight,
                            0
                          )}
                          quantity={cartItems.reduce(
                            (acc, item) => acc + item.quantity,
                            0
                          )}
                        />
                      </div>
                    )}
                    <div className="text-xs text-gray-500 text-center mt-2">
                      By completing your purchase, you agree to our Terms of
                      Service and Privacy Policy. Having issues with payment?
                      Click the refresh button to reload the PayPal checkout and
                      ensure your order details are up to date.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* For WebKit browsers (Chrome, Safari, Edge) */
        ::-webkit-scrollbar {
          width: 1px;
          height: 1px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
        }

        /* For Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        }
        [data-tooltip] {
          position: relative;
        }

        [data-tooltip]:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          margin-bottom: 5px;
        }

        [data-tooltip]:hover::before {
          content: "";
          position: absolute;
          bottom: calc(100% - 5px);
          left: 50%;
          transform: translateX(-50%);
          border-width: 5px;
          border-style: solid;
          border-color: #333 transparent transparent transparent;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
};

export default CartPaymentModal;
