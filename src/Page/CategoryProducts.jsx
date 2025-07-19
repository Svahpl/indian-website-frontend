import React, { useEffect, useState } from "react";
import { productCategories } from "../data/categories";
import { ProductCategoryCard, ScreenLoaders } from "../components/compIndex";
import { dummyProducts as products } from "../data/dummyProduct.js";
import { X } from "lucide-react";
import axios from "axios";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency.js";

const CategoryProducts = () => {
  const [price, setPrice] = useState(100000);
  const [dummyProducts, setDummyProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // ✅ All products from API
  const [ratingFilter, setRatingFilter] = useState([4, 3, 2, 1]);
  const [selectedRating, setSelectedRating] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const navigate = useNavigate();

  const getAllProducts = async () => {
    try {
      setIsApiLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/get-all`
      );
      // console.log("DEBUG PRODUCT API RESPONSE", res.data);
      setAllProducts(res.data.products); // ✅ save all products
      setDummyProducts(res.data.products);
    } catch (error) {
      console.log(`Error fetching all products: ${error}`);
      navigate("/server-error");
      // setAllProducts(products); // fallback
      // setDummyProducts(products);
    } finally {
      setIsApiLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const executeWithLoading = (filterFunction) => {
    setIsLoading(true);
    setTimeout(() => {
      filterFunction();
      setIsLoading(false);
    }, 800);
  };

  const handleCategoryChange = (category) => {
    executeWithLoading(() => {
      const filteredProducts = allProducts.filter(
        (pd) =>
          pd.category?.toLowerCase().trim() === category.toLowerCase().trim()
      );
      setDummyProducts(filteredProducts);
    });
  };

  const handleSubCategoryChange = (subcategory) => {
    executeWithLoading(() => {
      const filteredProducts = allProducts.filter(
        (pd) => pd.subcategory === subcategory
      );
      setDummyProducts(filteredProducts);
    });
  };

  const handleRatingChange = (n) => {
    setSelectedRating(n);
    executeWithLoading(() => {
      if (n === "") {
        setDummyProducts(allProducts);
        return;
      }
      const stringNum = parseFloat(n);
      const filteredProducts = allProducts.filter(
        (pd) => pd.rating >= stringNum
      );
      setDummyProducts(filteredProducts);
    });
  };

  const handlePriceFilter = (price) => {
    const priceFiltered = allProducts.filter(
      (product) => product.price <= price
    );
    setDummyProducts(priceFiltered);
    setPrice(price);
    setSelectedRating("");
    setRatingFilter([4, 3, 2, 1]);
  };

  const clearFilter = () => {
    executeWithLoading(() => {
      setDummyProducts(allProducts);
      setSelectedRating("");
      setPrice(1000);
    });
  };

  const LoadingOverlay = () => (
    <ScreenLoaders text={" Filtering products... "} />
  );

  const ApiLoadingOverlay = () => (
    <ScreenLoaders text={" Loading products... "} />
  );

  if (isApiLoading) {
    return <ApiLoadingOverlay />;
  }

  return (
    <>
      <Header />
      {isLoading && <LoadingOverlay />}
      {/* {dummyProducts.length == 0 ? navigate("/server-error") : null} */}
      <div className="categorySearchContainer mb-16 px-4 lg:px-24 bg-white dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Filters
            </h1>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Category
              </label>
              <select
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={isLoading}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {[
                  ...new Set(
                    allProducts
                      .map((product) => product.category?.toLowerCase().trim())
                      .filter(Boolean) // Remove any null/undefined values
                  ),
                ]
                  .sort() // Optional: sort categories alphabetically
                  .map((category, index) => (
                    <option key={index} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                      {/* Capitalize first letter for display */}
                    </option>
                  ))}
              </select>
            </div>

            {/* Key Ingredients Filter */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                Key Ingredients
              </label>
              <select
                onChange={(e) => handleSubCategoryChange(e.target.value)}
                disabled={isLoading}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {[
                  ...new Set(allProducts.map((product) => product.subcategory)),
                ].map((subcategory, index) => (
                  <option key={index}>{subcategory}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price Range
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                value={price}
                disabled={isLoading}
                onChange={(e) => {
                  setPrice(e.target.value);
                  handlePriceFilter(e.target.value);
                }}
                className="w-full h-1 bg-gray-700 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200"
              />
              <p className="text-sm mt-1 text-gray-400 dark:text-gray-500">
                Up to {formatCurrency(price)}
              </p>
            </div>

            {/* Customer Rating Filter */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customer Rating
              </label>
              <select
                id="ratingValue"
                value={selectedRating}
                onChange={(e) => handleRatingChange(e.target.value)}
                disabled={isLoading}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">All Ratings</option>
                {ratingFilter.map((n) => (
                  <option key={n} value={n}>
                    {`${n} ★`} & up
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="mb-4">
              <button
                onClick={clearFilter}
                disabled={isLoading}
                className="flex items-center gap-2 bg-green-800 dark:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-green-900 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-950 dark:disabled:hover:bg-green-900"
              >
                <X size={18} />
                Clear Filters
              </button>
            </div>
          </div>
          {/* Product Listing */}
          <div
            className={`w-full mt-5 lg:w-2/3 xl:w-3/4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-300 ${
              isLoading ? "opacity-50" : "opacity-100"
            }`}
          >
            {/* PREVIOUS MAPPING CODE DON'T TOUCH */}
            {/* {dummyProducts?.map((product, index) => (
              <ProductCategoryCard key={index} product={product} />
            ))} */}
            {dummyProducts.length !== 0 &&
              dummyProducts?.map((prod, index) => (
                <ProductCategoryCard key={index} product={prod} />
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoryProducts;
