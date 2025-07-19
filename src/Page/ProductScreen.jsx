import {
  ChevronLeft,
  ShoppingBag,
  ChevronRight,
  Star,
  Loader2,
  X,
  CreditCard,
  Shield,
  MessageSquare,
  Bell,
  User,
  Heart,
} from "lucide-react";
import { useEffect, useState } from "react";
import PaymentModal from "../components/PaymentModal";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { formatCurrency } from "../utils/formatCurrency";

const ProductScreen = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(5);
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Default weights - could also come from API
  const weights = [1, 5, 10, 20, 25, 50, 100];
  const { id } = useParams();

  const navigate = useNavigate();

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/get-product/${id}`
        );
        setProduct(res.data.product);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const isItemInWishlist = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/wishlist/verify-product/${localStorage.getItem("uid")}/${id}`
      );
      if (res.status === 200) {
        if (res.data.isPresent) {
          setIsLiked(!isLiked);
        }
      }
    } catch (error) {
      console.error("isItemInWishlist error", error);
    }
  };

  // Fetch comments for the product
  useEffect(() => {
    isItemInWishlist();
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/comment/getcomment/${id}`
        );
        console.log(res);
        setComments(res.data.Comments);
      } catch (err) {
        toast.error("Failed to load comments");
        console.error(err);
      } finally {
        setLoadingComments(false);
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id]);

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  const goToImage = (index) => setCurrentImageIndex(index);

  const goBack = () => {
    navigate(-1);
  };

  const handleBuyNow = () => {
    setShowPaymentModal(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    // Restore body scroll
    document.body.style.overflow = "unset";
    window.location.reload();
  };

  // Function to render star rating
  const renderStarRating = (rating, size = "w-4 h-4") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className={`${size} fill-yellow-400 text-yellow-400`} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className={`${size} text-gray-300 dark:text-gray-600`} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={`${size} fill-yellow-400 text-yellow-400`} />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className={`${size} text-gray-300 dark:text-gray-600`} />
      );
    }

    return stars;
  };

  // Payment Modal Component
  const HandlePaymentModal = () => {
    if (!showPaymentModal) return null;

    return (
      <>
        <PaymentModal
          showPaymentModal={showPaymentModal}
          closePaymentModal={closePaymentModal}
          product={product}
          selectedWeight={selectedWeight}
        />
      </>
    );
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const userId = localStorage.getItem("uid");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/comment/addcomment`,
        {
          userId,
          productId: id,
          text: newComment,
        }
      );

      toast.success("Comment added successfully");
      setNewComment("");

      // Refresh comments
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/comment/getcomment/${id}`
      );
      setComments(res.data.Comments);
    } catch (error) {
      toast.error("Failed to add comment");
      console.error("Add comment error", error);
    } finally {
      setCommentLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-950 dark:text-green-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Error loading product: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-950 dark:bg-green-600 text-white rounded-full hover:bg-green-800 dark:hover:bg-green-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No product found
  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Product not found</p>
        </div>
      </div>
    );
  }

  const addToCart = async (req, res) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add-to-cart`,
        {
          userId: localStorage.getItem("uid"),
          productId: id,
          quantity: 1,
          weight: selectedWeight,
        }
      );
      res.status === 200 ? toast("Added to cart") : null;
    } catch (error) {
      console.log("Add to cart error", error);
    }
  };

  const addToWishlist = async () => {
    const newIsLiked = !isLiked; // Calculate the intended state
    setIsLiked(newIsLiked);

    try {
      if (!newIsLiked) {
        // User is unliking the item
        const res = await axios.delete(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/wishlist/delete-to-wishlist/${localStorage.getItem(
            "uid"
          )}/${id}`
        );
        if (res.status === 200) toast.success("Removed from Wishlist");
      } else {
        // User is liking the item
        const res = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/wishlist/add-to-wishlist/${localStorage.getItem("uid")}/${id}`
        );
        if (res.status === 200) {
          toast("Saved!", { icon: "❤️" });
        }
      }
    } catch (error) {
      if (error?.response?.status === 409) toast.success("Already Present");
      console.error("addToWishlist error", error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 px-4 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <ChevronLeft
              onClick={goBack}
              size={16}
              className="w-6 h-6 text-gray-700 dark:text-gray-300"
            />
            <h1 className="text-lg font-medium text-gray-900 dark:text-white">
              {product.category}
            </h1>
            <div className="w-6" />
          </div>

          {/* Product Images */}
          <div className="px-8 py-12 relative bg-white dark:bg-gray-800">
            <button
              onClick={() => addToWishlist()}
              className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition z-20"
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "fill-red-500 text-red-500" : "text-gray-400 dark:text-gray-500"
                }`}
              />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-800 transition z-20"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-800 transition z-20"
            >
              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-300"
                style={{
                  transform: `translateX(-${currentImageIndex * 100}%)`,
                }}
              >
                {product.images.map((img, i) => (
                  <div key={i} className="w-full flex-shrink-0">
                    <img
                      src={img}
                      alt={`${product.title} ${i}`}
                      className="w-full h-64 object-contain drop-shadow-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToImage(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentImageIndex === i
                      ? "bg-green-950 dark:bg-green-400"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="bg-white dark:bg-gray-800 px-4 py-6">
            <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-2">
              {product.category} • {product.subcategory}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {product.title}
            </h2>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {renderStarRating(product.rating)}
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {product.rating} ({product.ratingCount} reviews)
              </span>
            </div>

            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(product.price)}
                <span className="text-xs">/kg</span>
              </span>
              <span className="ml-3 text-green-600 dark:text-green-400 text-sm font-medium">
                {product.quantity > 0 ? "In Stock" : "Out of stock"}
              </span>
            </div>

            {/* Key Ingredients */}
            {product.keyIngredients && product.keyIngredients.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Key Features
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.keyIngredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-full font-medium"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Select Weight
              </h4>
              <div className="flex flex-wrap gap-2">
                {weights.map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      selectedWeight === w
                        ? "bg-green-950 dark:bg-green-600 text-white shadow scale-105"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {`${w}kg`}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-3">
              {product.quantity <= 0 ? (
                <>
                  <button
                    onClick={() => addToCart()}
                    className="w-full bg-green-800 dark:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition shadow hover:shadow-lg transform hover:scale-105"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="text-sm">Notify</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => addToCart()}
                    className="w-full bg-green-800 dark:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition shadow hover:shadow-lg transform hover:scale-105"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-sm">Add To Bag</span>
                  </button>
                </>
              )}
              {product.quantity <= 0 ? (
                <>
                  <button
                    disabled
                    onClick={() => toast("Out of stock")}
                    className="w-full bg-gray-900 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-full transition shadow hover:shadow-lg transform hover:scale-105"
                  >
                    <span className="text-sm">Out of stock</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleBuyNow}
                    className="w-full mt-4 bg-green-800 dark:bg-green-700 hover:bg-green-900 dark:hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium"
                  >
                    <span className="text-sm">Buy Now</span>
                  </button>
                </>
              )}
            </div>

            {/* Comments Section */}
            <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-green-800 dark:text-green-400" />
                  Customer Reviews
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {comments?.length} comments
                </span>
              </div>

              {/* Add Comment Form */}
              <div className="mb-8">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts about this product..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-800 dark:focus:ring-green-400 focus:border-green-800 dark:focus:border-green-400 outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleAddComment}
                        disabled={commentLoading || !newComment.trim()}
                        className="px-4 py-2 bg-green-800 dark:bg-green-700 text-white rounded-lg hover:bg-green-900 dark:hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {commentLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              {loadingComments ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-green-800 dark:text-green-400" />
                </div>
              ) : (
                <div className="space-y-6">
                  {comments?.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment._id} className="flex space-x-4">
                        <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {comment.userName || "Anonymous"}
                            </h4>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">{comment.text}</p>
                          {/* <div className="text-xs text-gray-500 mt-2"> */}
                          {/* {new Date(comment.createdAt).toLocaleDateString()} */}
                          {/* </div> */}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-10 h-10 mx-auto text-gray-400 dark:text-gray-600" />
                      <p className="mt-2 text-gray-500 dark:text-gray-400">
                        No reviews yet. Be the first to share your thoughts!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Images */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <ChevronLeft
                  className="w-6 h-6 text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                  onClick={goBack}
                />
                <h1 className="text-xl font-medium text-gray-900 dark:text-white">
                  {product.category}
                </h1>
              </div>

              <div className="rounded-3xl p-12 relative overflow-hidden bg-gray-50 dark:bg-gray-800">
                <button
                  onClick={() => addToWishlist()}
                  className="absolute top-6 right-6 p-3 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition shadow-lg hover:shadow-xl transform hover:scale-110 z-20"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isLiked
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                    }`}
                  />
                </button>

                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition shadow-lg z-20"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition shadow-lg z-20"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>

                <div className="relative z-10 overflow-hidden">
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{
                      transform: `translateX(-${currentImageIndex * 100}%)`,
                    }}
                  >
                    {product.images.map((img, i) => (
                      <div key={i} className="w-full flex-shrink-0">
                        <img
                          src={img}
                          alt={`${product.title} ${i + 1}`}
                          className="w-full h-96 object-contain drop-shadow-2xl"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center mt-8 space-x-3">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToImage(i)}
                      className={`w-3 h-3 rounded-full ${
                        i === currentImageIndex
                          ? "bg-green-950 dark:bg-green-400"
                          : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Details */}
            <div className="space-y-8">
              <div>
                <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-3">
                  {product.category} • {product.subcategory}
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  {product.title}
                </h2>

                {/* Rating */}
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    {renderStarRating(product.rating, "w-5 h-5")}
                  </div>
                  <span className="ml-3 text-gray-600 dark:text-gray-400">
                    {product.rating.toFixed(1)} ({product.ratingCount} reviews)
                  </span>
                </div>

                <div className="flex items-center mb-8">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(product.price)}
                    <span className="text-xs">/kg</span>
                  </span>
                  <span className="ml-4 text-green-600 dark:text-green-400 font-medium text-lg">
                    {product.quantity > 0 ? "In Stock" : "Out of stock"}
                  </span>
                </div>
              </div>

               {/* Key Ingredients */}
              {product.keyIngredients && product.keyIngredients.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Key Features
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.keyIngredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm rounded-full font-medium"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Weight Options
                </h3>
                <div className="flex flex-wrap gap-3">
                  {weights.map((w) => (
                    <button
                      key={w}
                      onClick={() => setSelectedWeight(w)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        selectedWeight === w
                          ? "bg-green-950 dark:bg-green-700 text-white shadow-lg scale-105"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {`${w} kg`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              <div className="space-y-4">
                {product.quantity <= 0 ? (
                  <>
                    <button
                      onClick={() => addToCart()}
                      className="w-full bg-green-800 dark:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center space-x-3 transition shadow hover:shadow-xl transform hover:scale-105 dark:hover:bg-green-600"
                    >
                      <Bell className="w-5 h-5" />
                      <span>Notify</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => addToCart()}
                      className="w-full bg-green-800 dark:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center space-x-3 transition shadow hover:shadow-xl transform hover:scale-105 dark:hover:bg-green-600"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add To Bag</span>
                    </button>
                  </>
                )}
                {product.quantity <= 0 ? (
                  <>
                    <button
                      disabled
                      onClick={() => toast("Out of stock")}
                      className="w-full bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition shadow hover:shadow-lg transform hover:scale-105"
                    >
                      <span className="text-sm">Out of stock</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleBuyNow}
                      className="w-full bg-green-800 dark:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition shadow hover:shadow-lg transform hover:scale-105 dark:hover:bg-green-600"
                    >
                      <span className="text-sm">Buy Now</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Comments Section - Desktop */}
          <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
                <MessageSquare className="w-6 h-6 mr-3 text-green-800 dark:text-green-400" />
                Customer Reviews
              </h3>
              <span className="text-gray-500 dark:text-gray-400">
                {comments?.length} comments
              </span>
            </div>

            {/* Add Comment Form */}
            <div className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Share your thoughts
              </h4>
              <div className="flex items-start space-x-4">
                <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />

                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="What do you think about this product?"
                    className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-green-800 dark:focus:ring-green-400 focus:border-green-800 dark:focus:border-green-400 outline-none resize-none text-lg placeholder-gray-500 dark:placeholder-gray-400"
                    rows={4}
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleAddComment}
                      disabled={commentLoading || !newComment.trim()}
                      className="px-6 py-2 bg-green-800 dark:bg-green-700 text-white rounded-lg hover:bg-green-900 dark:hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {commentLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Post Review
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            {loadingComments ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-10 h-10 animate-spin text-green-800 dark:text-green-400" />
              </div>
            ) : (
              <div className="space-y-8">
                {comments?.length > 0 ? (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="flex space-x-5 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md dark:shadow-gray-900/10 transition"
                    >
                      <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white text-lg">
                            {comment.userName || "Anonymous"}
                          </h4>
                          {/* <span className="text-sm text-gray-500 dark:text-gray-400"> */}
                          {/* {new Date(comment.createdAt).toLocaleDateString()} */}
                          {/* </span> */}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <MessageSquare className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
                    <h4 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                      No reviews yet
                    </h4>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      Be the first to share your thoughts about this product.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Payment Modal */}
        <HandlePaymentModal />
      </div>
      <Footer />
    </>
  );
};

export default ProductScreen;
