import { useEffect, useState } from "react";
import {
  CartPaymentModal,
  CartProduct,
  LocationUI,
  UseTitle,
} from "../components/compIndex";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { formatCurrency } from "../utils/formatCurrency";

const CartPage = () => {
  UseTitle("Your Cart");

  const [userCartItems, setUserCartItems] = useState([]);
  const [products, setProducts] = useState(null);
  const [subtotalItems, setSubtotalItems] = useState(null);
  const [subtotalPrice, setSubtotalPrice] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { setCartCounter } = useAppContext();

  const userId = localStorage.getItem("uid");
  // fetch user cart from API endpoint
  const getCart = async () => {
    console.log(userId);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/getcart/${userId}`
      );
      setUserCartItems(res.data.items);
    } catch (error) {
      console.error(`Error fetching user's cart`, error);
    }
  };

  const refreshComponent = () => {
    setRefresh((prev) => prev + 1);
  };

  useEffect(() => {
    getCart();
  }, [refresh]);

  const deleteCartItem = async (id, qty, action, cartItemId) => {
    console.log("id", id);
    try {
      if (action === "delete") {
        const res = await axios.delete(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/cart/delete-cart-item?userId=${userId}&cartItemId=${id}`
        );
        toast("Deleted");
        refreshComponent();
        return res.status;
      }
    } catch (error) {
      console.log("Cart Item Deletion error", error);
    }
  };

  const addToWishList = async (productId) => {
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/wishlist/add-to-wishlist/${userId}/${productId}`
      );
      const res2 = await deleteCartItem(productId, 0, "delete", null);
      if (res.status === 200 && res2 === 200) toast("Added to wishlist!");
    } catch (error) {
      if (error.status === 409) {
        toast(`Already Added in wishlist`);
        return;
      }
      console.log("Error adding item to wishlist", error);
      toast("Internal Error");
    }
  };

  const handleQuantity = async (cartItemId, value) => {
    try {
      const res = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/cart/update-cart/${userId}/${cartItemId}`,
        {
          newQuantity: 1,
          action: value,
        }
      );
      if (res.status === 200)
        toast.success(value === "increase" ? "Added" : "Deleted");
      refreshComponent();
    } catch (error) {
      console.error(`ERROR From handle Quantity API: ${error}`);
      toast.error("Internal Error");
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    // Restore body scroll
    document.body.style.overflow = "unset";
    window.location.reload();
  };

  const handleCheckout = () => {
    setShowPaymentModal(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
  };

  const HandlePaymentModal = () => {
    if (!showPaymentModal) return null;
    return (
      <>
        <CartPaymentModal
          showPaymentModal={true} // boolean to control modal visibility
          closePaymentModal={() => setShowPaymentModal(false)} // function to close modal
          cartItems={userCartItems}
        />
      </>
    );
  };

  const calculateTotalItems = () => {
    const totalItems = userCartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    setSubtotalItems(totalItems);
    setCartCounter(totalItems);
  };

  const calculateTotalPrice = () => {
    const totalPrice = userCartItems.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      const weight = Number(item.weight) || 1; // default to 1 if weight is undefined or 0

      if (isNaN(quantity) || isNaN(price) || isNaN(weight)) {
        return sum; // skip invalid items
      }

      return sum + quantity * price * weight;
    }, 0);

    setSubtotalPrice(totalPrice.toFixed(2));
  };

  useEffect(() => {
    calculateTotalItems();
    calculateTotalPrice();
    console.log(userCartItems);
  }, [userCartItems]);

  return (
    <>
      <Header />
      <LocationUI />
      {/* Cart Links */}
      <div className="bg-gray-100 dark:bg-gray-800 lg:bg-white lg:dark:bg-gray-900 h-9 font-medium text-black dark:text-white lg:max-w-7xl lg:mx-auto lg:px-4 sm:px-6">
        <ul className="flex content-center">
          <li className="mx-2 cursor-pointer lg:underline lg:text-blue-500 lg:dark:text-blue-400 mt-1">
            <Link to="/my-account/orders"> Orders </Link>
          </li>
          <li className="mx-2 cursor-pointer lg:underline lg:text-blue-500 lg:dark:text-blue-400 mt-1">
            <Link to="/my-account/wishlist"> Wishlist </Link>
          </li>
          <li className="mx-2 cursor-pointer lg:underline lg:text-blue-500 lg:dark:text-blue-400 mt-1">
            <Link to="/my-account/addresses"> Addresses </Link>
          </li>
        </ul>
      </div>

      {/* Desktop Layout Container */}
      <div className="lg:max-w-7xl lg:mx-auto lg:px-4 sm:px-6 bg-white dark:bg-gray-900 min-h-screen">
        <div className="lg:flex lg:gap-6 lg:mt-4">
          {/* Main Content - Cart Items (Left Column on Desktop) */}
          <div className="lg:flex-1">
            {/* Mobile Subtotal - Hidden on Desktop */}
            <div className="flex lg:hidden justify-between items-center px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h5 className="font-medium text-lg text-black dark:text-white">
                  Subtotal ({subtotalItems} items):
                </h5>
              </div>
              <div>
                <span className="font-bold text-lg text-black dark:text-white">
                  {formatCurrency(subtotalPrice)}
                </span>
              </div>
            </div>

            {/* Mobile Proceed To Buy Button - Hidden on Desktop */}
            <div className="lg:hidden px-4 py-3 bg-white dark:bg-gray-800 sticky bottom-0 z-10 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleCheckout()}
                className="w-full rounded-lg bg-green-800 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={userCartItems.length === 0}
              >
                Proceed To Buy ({subtotalItems} items)
              </button>
            </div>

            {/* Thematic Break */}
            <div className="mt-5">
              <hr className="border-gray-200 dark:border-gray-700" />
            </div>

            {/* Shopping Cart Header - Desktop Only */}
            <div className="hidden lg:block">
              <h1 className="text-3xl font-normal mb-4 text-black dark:text-white">
                Shopping Cart
              </h1>
            </div>

            {/* Deselect All Items */}
            {/* <div className="deselect-div mt-2 mb-4">
              <span className="ml-4 lg:ml-0 text-blue-600 dark:text-blue-400 text-sm cursor-pointer hover:underline">
                Deselect all items
              </span>
            </div> */}

            {/* Cart Product Items */}
            {userCartItems?.length > 0 ? (
              userCartItems.map((item, index) => {
                console.log("Parent Comp ID", item);
                return (
                  <CartProduct
                    key={index}
                    product={item}
                    onQuantityChange={handleQuantity}
                    onDelete={deleteCartItem}
                    onAddToWishlist={addToWishList}
                    cartItemId={item.cartId}
                    totalItemsArray={userCartItems}
                  />
                );
              })
            ) : (
              <div className="text-center py-10">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Your cart is empty
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Checkout Section (Right Column on Desktop) */}
          <div className="hidden lg:block lg:w-80">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sticky top-4">
              {/* Subtotal Section */}
              <div className="mb-4">
                <h3 className="text-lg font-normal mb-2 text-black dark:text-white">
                  Subtotal ({subtotalItems} items) :{" "}
                  <span className="font-bold">
                    {formatCurrency(subtotalPrice)}
                  </span>
                </h3>
              </div>

              {/* Proceed to Buy Button */}
              <button
                onClick={() => handleCheckout()}
                className="w-full bg-green-800 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-lg text-white font-medium py-2 px-4 rounded-lg mb-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={userCartItems.length === 0}
              >
                Proceed to Buy
              </button>

              {/* EMI Available */}
              <div className="border-t dark:border-gray-700 hidden pt-4">
                <div className="flex justify-between items-center cursor-pointer">
                  <span className="text-sm font-medium text-black dark:text-white">
                    EMI Available
                  </span>
                  <svg
                    className="w-4 h-4 text-black dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Beauty Bestsellers Section */}
            <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-medium mb-4 text-black dark:text-white">
                Natural Wellness Favorites You'll Love
              </h3>
              <div className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Product recommendations handpicked for your health and
                  lifestyle.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        <HandlePaymentModal />
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
