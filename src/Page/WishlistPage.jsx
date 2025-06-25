import { useEffect, useState } from "react";
import { LocationUI, UseTitle } from "../components/compIndex";
import axios from "axios";
import toast from "react-hot-toast";
import { useUpdateCartCounter } from "../hooks/useUpdateCartCounter";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Wishlist Product Component
const WishlistProduct = ({ product, onDelete, onAddToCart }) => {
  // Check if product exists and has quantity property
  if (!product) return null;

  // Check if product is in stock based on quantity
  const isInStock = product.quantity > 0;

  return (
    <div className="bg-white border-b border-gray-200 p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={product.images?.[0] || "/api/placeholder/150/150"}
            alt={product.title || "Product image"}
            className="w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = "/api/placeholder/150/150";
            }}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
            {product.title || "Untitled Product"}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="mb-3">
            <span className="text-xl font-bold text-gray-900">
              <sup>₹</sup>
              {product.price || "0.00"}
            </span>
          </div>

          {/* Availability */}
          <div className="mb-3">
            <span
              className={`text-sm ${
                isInStock ? "text-green-600" : "text-red-600"
              }`}
            >
              {isInStock
                ? `In Stock`
                : "Out of Stock"}
            </span>
          </div>

          {/* Category/Subcategory */}
          <div className="mb-3 flex flex-wrap gap-2">
            {product.category && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {product.category}
              </span>
            )}
            {product.subcategory && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                {product.subcategory}
              </span>
            )}
          </div>

          {/* Key Ingredients (if available) */}
          {product.KeyIngredients && (
            <div className="mb-3">
              <span className="text-sm text-gray-600">
                Key Ingredients: {product.KeyIngredients}
              </span>
            </div>
          )}

          {/* Rating */}
          {product.rating > 0 && (
            <div className="mb-3 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.ratingCount || 0} reviews)
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              onClick={() => product._id && onAddToCart(product._id)}
              disabled={!isInStock}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                isInStock
                  ? "bg-green text-white hover:bg-green"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Add to Cart
            </button>

            <button
              onClick={() => product._id && onDelete(product._id)}
              className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Remove from Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WishlistPage = () => {
  UseTitle("Your Wishlist");
  const updateCounter = useUpdateCartCounter();
  const [userWishlistItems, setUserWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get userId from localStorage
  const userId = localStorage.getItem("uid");

  // Fetch user wishlist from API endpoint
  const getWishlist = async () => {
    if (!userId) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/wishlist/getwhishlistItem/${userId}`
      );

      // Handle response structure based on your API response format
      if (res.data && res.data.success && res.data.wishlist) {
        // Filter out any null or undefined items from the wishlist
        const filteredWishlist = res.data.wishlist.filter(
          (item) => item !== null && item !== undefined
        );
        setUserWishlistItems(filteredWishlist);
      } else {
        setUserWishlistItems([]);
      }
    } catch (error) {
      console.error(`Error fetching user's wishlist:`, error);
      setError("Failed to load wishlist");

      // Handle different error scenarios
      if (error.response?.status === 404) {
        setUserWishlistItems([]); // Empty wishlist
        setError(null);
      } else if (error.response?.status === 401) {
        setError("Please login to view your wishlist");
      } else {
        toast.error("Failed to load wishlist");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getWishlist();
    } else {
      setError("Please login to view your wishlist");
      setLoading(false);
    }
  }, [userId]);

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    if (!userId || !productId) {
      toast.error("Please login to modify wishlist");
      return;
    }

    try {
      const res = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/wishlist/delete-to-wishlist/${userId}/${productId}`
      );

      if (res.status === 200 || res.data.success) {
        setUserWishlistItems((prev) =>
          prev.filter((item) => item?._id !== productId)
        );
        toast("Removed from wishlist!");
      } else {
        throw new Error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);

      if (error.response?.status === 404) {
        toast.error("Item not found in wishlist");
      } else if (error.response?.status === 401) {
        toast.error("Please login to modify wishlist");
      } else {
        toast.error("Failed to remove item from wishlist");
      }
    }
  };

  // Add item to cart
  const addToCart = async (productId) => {
    if (!userId || !productId) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/movetocart`,

        {
          userId: userId,
          productId,
        }
      );

      if (res.status === 200 || res.data.success) {
        updateCounter();
        toast("Added to cart!");
        setUserWishlistItems((prev) =>
          prev.filter((item) => item?._id !== productId)
        );
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);

      if (error.response?.status === 404) {
        toast.error("Product not found");
      } else if (error.response?.status === 401) {
        toast.error("Please login to add items to cart");
      } else if (error.response?.status === 400) {
        toast.error("Product out of stock or invalid quantity");
      } else {
        toast.error("Failed to add to cart");
      }
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    if (!userId) {
      toast.error("Please login to modify wishlist");
      return;
    }

    // Show confirmation dialog
    if (
      !window.confirm("Are you sure you want to clear your entire wishlist?")
    ) {
      return;
    }

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/clear/${userId}`
      );

      if (res.status === 200 || res.data.success) {
        setUserWishlistItems([]);
        toast.success("Wishlist cleared!");
      } else {
        throw new Error("Failed to clear wishlist");
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);

      if (error.response?.status === 401) {
        toast.error("Please login to modify wishlist");
      } else {
        toast.error("Failed to clear wishlist");
      }
    }
  };

  // Handle authentication error
  if (error === "Please login to view your wishlist") {
    return (
      <>
        <LocationUI />
        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Login Required
          </h3>
          <p className="text-gray-600 mb-6">
            Please login to view and manage your wishlist
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
          >
            Login
          </button>
        </div>
      </>
    );
  }

  return (
    <>
    <Header />
      <LocationUI />

      {/* Wishlist Navigation Links */}
      <div className="bg-gray-100 lg:bg-white h-9 font-medium text-black lg:max-w-7xl lg:mx-auto lg:px-4 sm:px-6">
        <ul className="flex content-center">
          <li className="mx-2 lg:underline lg:text-blue-500 mt-1">Cart</li>
          <li className="mx-2 lg:underline lg:text-blue-500 mt-1 font-bold">
            Wishlist
          </li>
          <li className="mx-2 lg:underline lg:text-blue-500 mt-1">Buy Again</li>
        </ul>
      </div>

      {/* Desktop Layout Container */}
      <div className="lg:max-w-7xl lg:mx-auto lg:px-4 sm:px-6">
        <div className="lg:flex lg:gap-6 lg:mt-4">
          {/* Main Content - Wishlist Items (Left Column on Desktop) */}
          <div className="lg:flex-1">
            {/* Mobile Summary - Hidden on Desktop */}
            <div className="flex lg:hidden justify-between items-center px-4 py-3">
              <h5 className="font-medium text-xl">
                Wishlist ({userWishlistItems.length} items)
              </h5>
            </div>

            {/* Thematic Break */}
            <div className="mt-5">
              <hr />
            </div>

            {/* Wishlist Header - Desktop Only */}
            <div className="hidden lg:block">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-normal">Your Wishlist</h1>
                <span className="text-gray-600">
                  {userWishlistItems.length} item
                  {userWishlistItems.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Clear All Items */}
            {userWishlistItems.length > 0 && (
              <div className="clear-all-div mt-2 mb-4">
                <span
                  onClick={clearWishlist}
                  className="ml-4 lg:ml-0 text-blue-600 text-sm cursor-pointer hover:underline"
                >
                  Clear all items
                </span>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading your wishlist...</p>
              </div>
            )}

            {/* Error State */}
            {error && error !== "Please login to view your wishlist" && (
              <div className="text-center py-8">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Error Loading Wishlist
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={getWishlist}
                  className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty Wishlist */}
            {!loading && !error && userWishlistItems.length === 0 && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Save items you love for later by adding them to your wishlist
                </p>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}

            {/* Wishlist Items */}
            {!loading &&
              !error &&
              userWishlistItems
                .filter((item) => item !== null && item !== undefined)
                .map((item, index) => (
                  <WishlistProduct
                    key={item._id || index}
                    product={item}
                    onDelete={removeFromWishlist}
                    onAddToCart={addToCart}
                  />
                ))}
          </div>

          {/* Sidebar - Actions Section (Right Column on Desktop) */}
          {!loading && !error && userWishlistItems.length > 0 && (
            <div className="hidden lg:block lg:w-80">
              <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-4">
                {/* Wishlist Summary */}
                <div className="mb-4">
                  <h3 className="text-lg font-normal mb-2">Wishlist Summary</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {userWishlistItems.length} item
                    {userWishlistItems.length !== 1 ? "s" : ""} saved for later
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      const inStockItems = userWishlistItems.filter(
                        (item) => item?.quantity > 0
                      );
                      inStockItems.forEach((item) => {
                        if (item?._id) {
                          addToCart(item._id);
                        }
                      });
                    }}
                    disabled={
                      userWishlistItems.filter((item) => item?.quantity > 0)
                        .length === 0
                    }
                    className={`w-full font-medium py-2 px-4 rounded-full transition-colors ${
                      userWishlistItems.filter((item) => item?.quantity > 0)
                        .length > 0
                        ? "bg-green text-white hover:bg-green"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Add All Available to Cart
                  </button>

                  <button
                    onClick={clearWishlist}
                    className="w-full border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Clear Wishlist
                  </button>
                </div>

                {/* Share Wishlist */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center cursor-pointer">
                    <span className="text-sm font-medium">Share Wishlist</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Recommendations Section */}
              <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-4">You Might Also Like</h3>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Discover similar products based on your wishlist
                    preferences.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WishlistPage;
