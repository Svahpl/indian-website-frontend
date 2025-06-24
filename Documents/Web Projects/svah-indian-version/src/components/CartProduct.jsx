import { Package, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const CartProduct = ({
  product,
  onQuantityChange,
  onDelete,
  onAddToWishlist,
  totalItemsArray,
  cartItemId,
}) => {
  const [isQuantityLoading, setIsQuantityLoading] = useState(false);

  const handleDelete = () => {
    // id, qty, action, cartItemId
    onDelete?.(product._id, null, "delete", "");
    // onDelete?.(product.id);
  };

  const handleQuantityDecrease = async () => {
    if (product.quantity > 1) {
      setIsQuantityLoading(true);
      try {
        await onQuantityChange?.(cartItemId, "decrease");
      } finally {
        setIsQuantityLoading(false);
      }
    } else if (product.quantity === 1) {
      handleDelete();
    }
  };

  const handleQuantityIncrease = async () => {
    setIsQuantityLoading(true);
    try {
      await onQuantityChange?.(cartItemId, "increase");
    } finally {
      setIsQuantityLoading(false);
    }
  };

  const handleAddToWishlist = () => {
    onAddToWishlist?.(product._id);
  };

  // Spinner component for loading animation
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  useEffect(() => {
    console.log("totalItemsArray", totalItemsArray);
  }, []);

  return (
    <>
      <div className="mt-2 bg-gray-50 py-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="product-image block">
          <div className="p-img flex ml-4">
            <img
              className="h-32 w-32 object-cover rounded-md shadow-sm"
              src={product.images[0]}
              alt={product.title}
            />
            <div className="productTitle flex-1">
              {/* Product Title */}
              <p className="text-sm ml-4 leading-relaxed text-gray-800 font-medium">
                {product.title}
              </p>

              {/* Pricing */}
              <div className="ml-4 text-xl mt-3">
                <h5 className="text-gray-900">
                  <sup className="text-sm">$</sup>
                  <span className="font-bold">
                    {product.price.toLocaleString()}
                  </span>
                  <sup className="text-sm">00</sup>
                </h5>
              </div>

              {/* Weight */}
              <div className="ml-4 mt-2">
                <span className="text-sm text-gray-700 font-semibold">
                  Weight:
                </span>
                <span className="ml-1 text-sm text-gray-600">
                  {product.weight}
                  <b> kg</b>
                </span>
              </div>

              {/* Delivery Details */}
              {/* <div className="mt-3 ml-4">
                <span className="ml-3 text-sm font-semibold text-gray-700">
                  {product.deliveryDate}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  for SVAH Members
                </span>
              </div> */}

              {/* Stock Check
                    <div
                      className={`text-sm ml-4 mt-2 font-semibold ${
                        product.inStock ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </div> */}

              {/* Sold By */}
              <div className="flex text-sm ml-4 mt-2 text-gray-600">
                Sold By
                <span className="mx-1 text-blue-500 underline hover:text-blue-600 cursor-pointer transition-colors">
                  {`SVAH Agros & Herbs`}
                </span>
              </div>

              {/* Delivered By */}
              <div className="flex items-center ml-4 mt-2">
                <Package className="text-gray-600" size={18} />
                <span className="text-sm ml-2 text-gray-600">
                  SVAH Delivered
                </span>
              </div>
            </div>
          </div>

          {/* Cart Action Buttons */}
          <div className="flex mt-2 h-20 ml-2 gap-4 items-center">
            <div className="relative w-32 ml-1 border-none bg-green-800 rounded-lg py-2 px-2 text-center">
              <button
                className="absolute text-white left-2 text-2xl px-2 top-1/2 -translate-y-1/2 cursor-pointer transition-colors duration-200 hover:bg-green-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleQuantityDecrease}
                disabled={product.quantity <= 1 || isQuantityLoading}
              >
                -
              </button>

              {/* Quantity display with loader */}
              <div className="flex items-center justify-center h-6">
                {isQuantityLoading ? (
                  <LoadingSpinner />
                ) : (
                  <span className="block text-white text-sm font-medium">
                    {product.quantity}
                  </span>
                )}
              </div>

              <button
                className="absolute text-white right-2 top-1/2 -translate-y-1/2 font-bold text-lg cursor-pointer transition-colors duration-200 hover:bg-green-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleQuantityIncrease}
                disabled={isQuantityLoading}
              >
                +
              </button>
            </div>

            <div
              className="relative ml-2 w-20 border-none bg-green-800 text-white rounded-lg py-2 px-2 text-center flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-green-700"
              onClick={handleDelete}
            >
              <span className="block text-sm font-medium">Delete</span>
            </div>

            <div
              className="ml-2 bg-green-800 text-white w-32 mx-2 border-none rounded-lg py-2 px-2 text-center flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-green-700"
              onClick={handleAddToWishlist}
            >
              <span className="capitalize text-sm font-medium">
                add to wishlist
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartProduct;
