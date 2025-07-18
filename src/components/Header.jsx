import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  ShoppingCart,
  User,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useUpdateCartCounter } from "../hooks/useUpdateCartCounter";

// Helper function to get initial dark mode state
const getInitialDarkMode = () => {
  // Check localStorage first
  const savedDarkMode = localStorage.getItem("darkMode");
  if (savedDarkMode !== null) {
    return savedDarkMode === "true";
  }

  // If no saved preference, check system preference
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  // Default to false if no preference found
  return false;
};

// Helper function to apply dark mode to document
const applyDarkMode = (isDark) => {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const Header = () => {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Initialize dark mode state immediately with the correct value
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const initialDarkMode = getInitialDarkMode();
    // Apply immediately to avoid flash
    applyDarkMode(initialDarkMode);
    return initialDarkMode;
  });

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

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e) => {
      // Only apply system theme if user hasn't explicitly set a preference
      const savedDarkMode = localStorage.getItem("darkMode");
      if (savedDarkMode === null) {
        setIsDarkMode(e.matches);
        applyDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  // Update localStorage and apply theme when isDarkMode changes
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode.toString());
    applyDarkMode(isDarkMode);
  }, [isDarkMode]);

  // Fetch products if not available in context
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/get-all`
        );
        const data = await res.json();
        // DEBUG CONSOLE LOG BELOW : -
        // console.log("DEBUG PRODUCT API RESPONSE", data);
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

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Dark Mode Toggle Component
  const DarkModeToggle = ({ isMobile = false }) => {
    return (
      <button
        onClick={toggleDarkMode}
        className={`group flex flex-col items-center transition ${
          isMobile ? "" : "hover:scale-105"
        }`}
        aria-label="Toggle dark mode"
      >
        <div
          className={`${
            isMobile ? "p-1" : "p-2.5"
          } rounded-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-600 group-hover:shadow-lg transition`}
        >
          {isDarkMode ? (
            <Sun
              size={isMobile ? 20 : 20}
              className="text-primary-700 dark:text-yellow-400"
            />
          ) : (
            <Moon
              size={isMobile ? 20 : 20}
              className="text-primary-700 dark:text-blue-400"
            />
          )}
        </div>
        {!isMobile && (
          <span className="text-xs text-gray-600 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-400">
            {isDarkMode ? "Light" : "Dark"}
          </span>
        )}
      </button>
    );
  };

  const SearchResults = ({ isMobile = false }) => {
    if (!showSearchResults) return null;

    return (
      <div
        className={`absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto ${
          isMobile ? "mx-0" : "mx-0"
        }`}
      >
        {isSearching ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <div className="animate-spin inline-block w-4 h-4 border-2 border-primary-500 dark:border-primary-400 border-t-transparent rounded-full mr-2"></div>
            Searching...
          </div>
        ) : searchResults.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <Search
              size={24}
              className="mx-auto mb-2 text-gray-300 dark:text-gray-600"
            />
            <p className="text-sm">No products found for "{searchText}"</p>
          </div>
        ) : (
          <>
            <div className="p-3 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Search Results ({searchResults.length})
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-50 dark:border-gray-700 last:border-b-0 transition-colors"
                >
                  <div
                    onClick={() => handleProductClick(product._id)}
                    className="flex items-center space-x-3"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-md bg-gray-100 dark:bg-gray-700"
                      onError={(e) => {
                        e.target.src = "/images/placeholder-product.png"; // Fallback image
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {product.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                          ${product.price}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {searchResults.length > 0 && (
              <div className="p-3 border-t border-gray-100 dark:border-gray-700">
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
            } rounded-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-600 animate-pulse`}
          >
            <User
              size={isMobile ? 20 : 20}
              className="text-primary-700 dark:text-gray-300 opacity-50"
            />
          </div>
          {!isMobile && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Account
            </span>
          )}
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
                } rounded-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-600 group-hover:shadow-lg transition`}
              >
                <User
                  size={isMobile ? 20 : 20}
                  className="text-primary-700 dark:text-gray-300"
                />
              </div>
              {!isMobile && (
                <span className="text-xs text-gray-600 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-400">
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
              } rounded-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-600 ${
                isMobile ? "" : "group-hover:shadow-lg"
              } transition flex items-center justify-center`}
            >
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: isMobile ? "w-5 h-5" : "w-5 h-5",
                    userButtonPopoverCard:
                      "shadow-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-800",
                    userButtonPopoverActionButton:
                      "hover:bg-primary-50 dark:hover:bg-gray-700",
                  },
                }}
              />
            </div>
            {!isMobile && (
              <span className="text-xs text-gray-600 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-400">
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
      className={`sticky top-0 z-50 w-full bg-white dark:bg-gray-900 backdrop-blur-lg transition-all duration-300 ${
        isScrolled
          ? "shadow-md py-1"
          : "py-2 border-b border-primary-100/50 dark:border-gray-700/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3">
          {/* Logo, Mobile Icons, and Menu Toggle */}
          <div className="w-full flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3">
              <div className="p-1 bg-gradient-to-br from-primary-100 to-primary-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                <div className="bg-white dark:bg-gray-800 p-1 border border-primary-100/30 dark:border-gray-600/30 rounded-md">
                  <img
                    src="/images/LOGO.png"
                    alt="SVAH Logo"
                    className="h-7 w-7 object-contain"
                  />
                </div>
              </div>
              {/* DESKTOP DEVICE LEFT-TOP NAVBAR LOGO TEXT */}
              <div className="hidden md:block">
                <h1 className="text-lg font-bold text-primary-900 dark:text-white leading-tight">
                  <span className="font-serif tracking-wide">
                    SRI VENKATESWARA
                  </span>
                  <br />
                  <span className="font-serif tracking-wide">
                    AGROS AND HERBS
                  </span>
                  <br />
                  <span className="text-primary-700 dark:text-primary-400 text-sm sm:text-base">
                    SINCE 2021
                  </span>
                </h1>
              </div>
              {/* MOBILE DEVICE LEFT-TOP NAVBAR LOGO TEXT */}
              <div className="block md:hidden">
                <h1 className="text-sm font-bold text-primary-900 dark:text-white leading-tight">
                  <span className="font-serif tracking-wide">
                    SRI VENKATESWARA
                  </span>
                  <br />
                  <span className="font-serif tracking-wide">
                    AGROS AND HERBS
                  </span>
                  <br />
                  <span className="text-primary-700 dark:text-primary-400 text-xs">
                    SINCE 2021
                  </span>
                </h1>
              </div>
            </a>

            {/* Mobile Icons - Right Side */}
            <div className="flex items-center space-x-3 sm:hidden">
              {/* Mobile Cart */}
              <Link
                to="/my-account/cart"
                className="relative text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-primary-600 dark:bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Dark Mode Toggle */}
              <DarkModeToggle isMobile={true} />

              {/* Mobile Auth */}
              <div className="text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400">
                <AuthComponent isMobile={true} />
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-full bg-primary-50 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle Menu"
              >
                {menuOpen ? (
                  <X
                    size={20}
                    className="text-primary-700 dark:text-gray-300"
                  />
                ) : (
                  <Menu
                    size={20}
                    className="text-primary-700 dark:text-gray-300"
                  />
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
                  className="w-full py-2.5 pl-4 pr-10 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-500 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
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
                className="w-full py-2.5 pl-5 pr-12 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-500 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition duration-200"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
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
              <div className="p-2.5 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-600 group-hover:shadow-lg transition">
                <ShoppingCart
                  size={20}
                  className="text-primary-700 dark:text-gray-300"
                />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-400">
                Cart
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-600 dark:bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Desktop Dark Mode Toggle */}
            <DarkModeToggle isMobile={false} />

            {/* Desktop Auth */}
            <AuthComponent isMobile={false} />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center justify-between py-2.5 border-t border-primary-100/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-1">
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault(); // Prevent default routing if you want full reload
                window.location.href = "/"; // Reloads from server
              }}
              className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-primary-50/60 dark:hover:bg-gray-700/60 rounded-md transition"
            >
              Home
            </Link>

            <Link
              to="/view-products"
              className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-primary-50/60 dark:hover:bg-gray-700/60 rounded-md transition"
            >
              Products
            </Link>
            <Link
              to="/About"
              className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-primary-50/60 dark:hover:bg-gray-700/60 rounded-md transition"
            >
              About Us
            </Link>
            <Link
              to="/Contact"
              className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-primary-50/60 dark:hover:bg-gray-700/60 rounded-md transition"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Logout Button - Better positioned */}
          <SignedIn>
            <Link
              to="/logout"
              className="group flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-200"
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
          <div
            data-aos="slide-right"
            className="sm:hidden mt-2 bg-white dark:bg-gray-800 border-t border-primary-100/50 dark:border-gray-700/50 rounded-b-lg shadow-lg py-4 space-y-3"
          >
            <nav className="flex flex-col space-y-1 px-4">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-md font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/view-products"
                onClick={() => setMenuOpen(false)}
                className="py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-md font-medium transition-colors"
              >
                Products
              </Link>
              <Link
                to="/About"
                onClick={() => setMenuOpen(false)}
                className="py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-md font-medium transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/Contact"
                onClick={() => setMenuOpen(false)}
                className="py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-md font-medium transition-colors"
              >
                Contact
              </Link>

              {/* Mobile Logout - Only shown when signed in */}
              <SignedIn>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-3">
                  <Link
                    to="/logout"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center space-x-3 py-3 px-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md font-medium transition-colors"
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
