import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  ShoppingCart,
  User,
  LogOut,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useUpdateCartCounter } from "../hooks/useUpdateCartCounter";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Get auth state and user data
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { cartCount, setCartCounter, allProducts, setAllProducts } =
    useAppContext(); // Get products from context
  const { isLoaded: userLoaded, user } = useUser();

  // Local state for products if not available in context
  const [localProducts, setLocalProducts] = useState([]);

  const updateCartCounter = useUpdateCartCounter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    updateCartCounter();
  }, []);

  // Fetch products if not available in context
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/get-all`
        );
        const data = await res.json();
        console.log("DEBUG PRODUCT API RESPONSE", data);
        if (data.products) {
          setLocalProducts(data.products);
          // Update context if setter is available
          if (setAllProducts) {
            setAllProducts(data.products);
          }
        }
      } catch (error) {
        console.log(`Error fetching all products: ${error}`);
      }
    };

    // Only fetch if we don't have products in context
    if (!allProducts || allProducts.length === 0) {
      getAllProducts();
    }
  }, [allProducts, setAllProducts]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search functionality
  const performSearch = (query) => {
    const productsToSearch = allProducts || localProducts; // Use context products or local products

    console.log("Performing search for:", query);
    console.log("Products to search:", productsToSearch?.length || 0);

    if (!query.trim() || !productsToSearch || productsToSearch.length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);

    // Filter products based on search query
    const filteredProducts = productsToSearch.filter((product) => {
      const searchQuery = query.toLowerCase();
      return (
        product.title.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery) ||
        product.subcategory.toLowerCase().includes(searchQuery) ||
        (product.KeyIngredients &&
          product.KeyIngredients.toLowerCase().includes(searchQuery))
      );
    });

    console.log("Filtered products:", filteredProducts.length);

    // Limit to top 6 results for better UX
    setSearchResults(filteredProducts.slice(0, 6));
    setShowSearchResults(true);
    setIsSearching(false);
  };

  // Handle search input change with debouncing
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchText.trim()) {
        performSearch(searchText);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayedSearch);
  }, [searchText, allProducts, localProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      // Navigate to products page with search query
      // navigate(`/view-products?search=${encodeURIComponent(searchText)}`);
      setShowSearchResults(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleProductClick = (productId) => {
    navigate(`/view-product/${productId}`);
    setShowSearchResults(false);
    setSearchText("");
  };

  const SearchResults = ({ isMobile = false }) => {
    if (!showSearchResults) return null;

    return (
      <div
        className={`absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto ${
          isMobile ? "mx-0" : "mx-0"
        }`}
      >
        {isSearching ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin inline-block w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full mr-2"></div>
            Searching...
          </div>
        ) : searchResults.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Search size={24} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No products found for "{searchText}"</p>
          </div>
        ) : (
          <>
            <div className="p-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">
                Search Results ({searchResults.length})
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product._id)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-md bg-gray-100"
                      onError={(e) => {
                        e.target.src = "/images/placeholder-product.png"; // Fallback image
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {product.title}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-semibold text-primary-600">
                          ₹{product.price}
                        </span>
                        <span className="text-xs text-gray-400 capitalize">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {searchResults.length > 0 && (
              <div className="p-3 border-t border-gray-100">
                {/* <button
                  onClick={() => {
                    navigate(
                      `/view-products?search=${encodeURIComponent(searchText)}`
                    );
                    setShowSearchResults(false);
                  }}
                  className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all results for "{searchText}"
                </button> */}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // Auth component that handles loading states properly
  const AuthComponent = ({ isMobile = false }) => {
    // Show loading placeholder while auth is loading
    if (!authLoaded) {
      return (
        <div
          className={`group flex flex-col items-center transition ${
            isMobile ? "" : "hover:scale-105"
          }`}
        >
          <div
            className={`${
              isMobile ? "p-1" : "p-2.5"
            } rounded-full bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse`}
          >
            <User
              size={isMobile ? 20 : 20}
              className="text-primary-700 opacity-50"
            />
          </div>
          {!isMobile && <span className="text-xs text-gray-400">Account</span>}
        </div>
      );
    }

    return (
      <>
        <SignedOut>
          <SignInButton mode="modal">
            <button
              className={`group flex flex-col items-center transition ${
                isMobile ? "" : "hover:scale-105"
              }`}
            >
              <div
                className={`${
                  isMobile ? "p-1" : "p-2.5"
                } rounded-full bg-gradient-to-br from-primary-50 to-primary-100 group-hover:shadow-lg transition`}
              >
                <User size={isMobile ? 20 : 20} className="text-primary-700" />
              </div>
              {!isMobile && (
                <span className="text-xs text-gray-600 group-hover:text-primary-700">
                  Sign In
                </span>
              )}
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div
            className={`flex flex-col items-center ${
              isMobile ? "" : "group transition hover:scale-105"
            }`}
          >
            <div
              onClick={() => navigate("/my-account")}
              className={`${
                isMobile ? "p-1" : "p-2.5"
              } rounded-full bg-gradient-to-br from-primary-50 to-primary-100 ${
                isMobile ? "" : "group-hover:shadow-lg"
              } transition flex items-center justify-center`}
            >
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: isMobile ? "w-5 h-5" : "w-5 h-5",
                    userButtonPopoverCard: "shadow-xl border border-gray-200",
                    userButtonPopoverActionButton: "hover:bg-primary-50",
                  },
                }}
              />
            </div>
            {!isMobile && (
              <span className="text-xs text-gray-600 group-hover:text-primary-700">
                Account
              </span>
            )}
          </div>
        </SignedIn>
      </>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white backdrop-blur-lg transition-all duration-300 ${
        isScrolled ? "shadow-md py-1" : "py-2 border-b border-primary-100/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3">
          {/* Logo, Mobile Icons, and Menu Toggle */}
          <div className="w-full flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3">
              <div className="p-1 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg">
                <div className="bg-white p-1 border border-primary-100/30 rounded-md">
                  <img
                    src="/images/LOGO.png"
                    alt="SVAH Logo"
                    className="h-7 w-7 object-contain"
                  />
                </div>
              </div>
              {/* DESKTOP DEVICE LEFT-TOP NAVBAR LOGO TEXT */}
              <div className="hidden md:block">
                <h1 className="text-lg font-bold text-primary-900 leading-tight">
                  <span className="font-serif tracking-wide">
                    SRI VENKATESWARA
                  </span>
                  <br />
                  <span className="font-serif tracking-wide">
                    AGROS AND HERBS
                  </span>
                  <br />
                  <span className="text-primary-700 text-sm sm:text-base">
                    SINCE 2021
                  </span>
                </h1>
              </div>
              {/* MOBILE DEVICE LEFT-TOP NAVBAR LOGO TEXT */}
              <div className="block md:hidden">
                <h1 className="text-sm font-bold text-primary-900 leading-tight">
                  <span className="font-serif tracking-wide">
                    SRI VENKATESWARA
                  </span>
                  <br />
                  <span className="font-serif tracking-wide">
                    AGROS AND HERBS
                  </span>
                  <br />
                  <span className="text-primary-700 text-xs">SINCE 2021</span>
                </h1>
              </div>
            </a>

            {/* Mobile Icons - Right Side */}
            <div className="flex items-center space-x-3 sm:hidden">
              {/* Mobile Cart */}
              <Link
                to="/my-account/cart"
                className="relative text-gray-600 hover:text-primary-700 transition-colors"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Auth */}
              <div className="text-gray-600 hover:text-primary-700">
                <AuthComponent isMobile={true} />
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors"
                aria-label="Toggle Menu"
              >
                {menuOpen ? (
                  <X size={20} className="text-primary-700" />
                ) : (
                  <Menu size={20} className="text-primary-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search - Always visible with results */}
          <div className="sm:hidden w-full relative" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchText}
                  onChange={handleSearchInputChange}
                  placeholder="Search products..."
                  className="w-full py-2.5 pl-4 pr-10 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary-300 bg-gray-50 focus:bg-white text-gray-700 transition duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-700 transition-colors"
                >
                  <Search size={18} strokeWidth={2.5} />
                </button>
              </div>
            </form>
            <SearchResults isMobile={true} />
          </div>

          {/* Desktop Search with results */}
          <div
            className="hidden sm:block w-full max-w-md relative"
            ref={searchRef}
          >
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchText}
                onChange={handleSearchInputChange}
                placeholder="Search products..."
                className="w-full py-2.5 pl-5 pr-12 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary-300 bg-gray-50 focus:bg-white text-gray-700 transition duration-200"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-primary-700 transition-colors"
              >
                <Search size={20} strokeWidth={2.5} />
              </button>
            </form>
            <SearchResults isMobile={false} />
          </div>

          {/* Icons - Desktop */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Desktop Cart */}
            <Link
              to="/my-account/cart"
              className="relative group flex flex-col items-center transition hover:scale-105"
            >
              <div className="p-2.5 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 group-hover:shadow-lg transition">
                <ShoppingCart size={20} className="text-primary-700" />
              </div>
              <span className="text-xs text-gray-600 group-hover:text-primary-700">
                Cart
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Desktop Auth */}
            <AuthComponent isMobile={false} />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center justify-between py-2.5 border-t border-primary-100/50">
          <div className="flex items-center space-x-1">
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault(); // Prevent default routing if you want full reload
                window.location.href = "/"; // Reloads from server
              }}
              className="px-4 py-2 font-medium text-gray-700 hover:text-primary-700 hover:bg-primary-50/60 rounded-md transition"
            >
              Home
            </Link>
            <Link
              to="/view-products"
              className="px-4 py-2 font-medium text-gray-700 hover:text-primary-700 hover:bg-primary-50/60 rounded-md transition"
            >
              Products
            </Link>
            <Link
              to="/About"
              className="px-4 py-2 font-medium text-gray-700 hover:text-primary-700 hover:bg-primary-50/60 rounded-md transition"
            >
              About Us
            </Link>
            <Link
              to="/Contact"
              className="px-4 py-2 font-medium text-gray-700 hover:text-primary-700 hover:bg-primary-50/60 rounded-md transition"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Logout Button - Better positioned */}
          <SignedIn>
            <Link
              to="/logout"
              className="group flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
            >
              <LogOut
                size={16}
                className="group-hover:rotate-12 transition-transform"
              />
              <span className="text-sm font-medium">Logout</span>
            </Link>
          </SignedIn>
        </nav>

        {/* Mobile Navigation - Improved */}
        {menuOpen && (
          <div className="sm:hidden mt-2 bg-white border-t border-primary-100/50 rounded-b-lg shadow-lg py-4 space-y-3">
            <nav className="flex flex-col space-y-1 px-4">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="py-3 px-4 text-gray-700 hover:bg-primary-50 rounded-md font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/view-products"
                onClick={() => setMenuOpen(false)}
                className="py-3 px-4 text-gray-700 hover:bg-primary-50 rounded-md font-medium transition-colors"
              >
                Products
              </Link>
              <Link
                to="/About"
                onClick={() => setMenuOpen(false)}
                className="py-3 px-4 text-gray-700 hover:bg-primary-50 rounded-md font-medium transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/Contact"
                onClick={() => setMenuOpen(false)}
                className="py-3 px-4 text-gray-700 hover:bg-primary-50 rounded-md font-medium transition-colors"
              >
                Contact
              </Link>

              {/* Mobile Logout - Only shown when signed in */}
              <SignedIn>
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <Link
                    to="/logout"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center space-x-3 py-3 px-4 text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </Link>
                </div>
              </SignedIn>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
