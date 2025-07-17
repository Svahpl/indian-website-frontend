import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUpdateCartCounter } from "../hooks/useUpdateCartCounter";

const ProductCategoryCard = ({ product }) => {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  const {
    title,
    description,
    price,
    images,
    category,
    quantity,
    rating,
    ratingCount,
  } = product;

  const roundedRating = Math.round(rating);
  const navigate = useNavigate();
  const updateCartCounter = useUpdateCartCounter();

  const addToCart = async (req, res) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add-to-cart`,
        {
          userId: localStorage.getItem("uid"),
          productId: product._id,
          quantity: 1,
          weight: 1,
        }
      );
      res.status === 200 ? toast("Added to cart") : null;
      updateCartCounter();
    } catch (error) {
      console.log("Add to cart error", error);
    }
  };

  return (
    <div
      data-aos="fade-up"
      data-aos-duration="600"
      data-aos-anchor-placement="top-bottom"
      className="max-w-sm w-full bg-white rounded-xl shadow-md overflow-hidden mx-auto flex flex-col border border-gray-100 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative overflow-hidden">
        <img
          onClick={() => navigate(`/view-product/${product._id}`)}
          src={images[0]}
          alt={title}
          className="w-full h-64 object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-green-800 text-white text-xs font-medium px-2 py-1 rounded-full">
          {category}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="space-y-3 flex-grow">
          <h2
            onClick={() => navigate(`/view-product/${product._id}`)}
            className="text-xl cursor-pointer font-semibold text-gray-800 hover:text-green-800 transition-colors"
          >
            {title}
          </h2>

          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < roundedRating
                    ? "text-yellow-500 fill-current"
                    : "text-gray-300"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09L5.822 12 1 7.91l6.06-.88L10 2l2.94 5.03L19 7.91 14.178 12l1.7 6.09z" />
              </svg>
            ))}
            <span className="ml-1 text-xs text-gray-500">
              ({ratingCount} reviews)
            </span>
          </div>

          <div className="text-xl font-bold text-green-800">
            {Number(price)?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              style: "currency",
              currency: "INR",
            })}
          </div>
        </div>

        {quantity > 0 ? (
          <button
            onClick={() => addToCart()}
            className="w-full mt-4 bg-green-800 hover:bg-green-900 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium"
          >
            Add to Cart
          </button>
        ) : (
          <button
            disabled
            className="w-full mt-4 bg-gray-100 text-gray-500 py-3 px-4 rounded-lg font-medium cursor-not-allowed"
          >
            Currently Unavailable
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCategoryCard;
