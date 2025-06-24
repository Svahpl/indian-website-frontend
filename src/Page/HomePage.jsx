import {
  Slideshow,
  CategorySection,
  Certificates,
  ContactSection,
} from "../components/compIndex";
import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { UseTitle } from "../components/compIndex";
import { useAuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HomePage = () => {
  UseTitle("SVAH | Agros & Herbs");
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const [token, setToken] = useState("");
  const [userDataSent, setUserDataSent] = useState(false);

  const { storeTokenInLocalStorage, storeUser } = useAuthContext();

  // Get token once auth is loaded and user is signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      getToken()
        .then((t) => {
          if (t) {
            setToken(t);
            storeTokenInLocalStorage(t);
          }
        })
        .catch((err) => {
          console.error("Failed to get token:", err);
        });
    }
  }, [isLoaded, isSignedIn, getToken, storeTokenInLocalStorage]);

  const getMongoUserId = async () => {
    // Add comprehensive safety checks
    if (!user?.id) {
      console.log("User or user.id is not available yet");
      return null;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/map/clerk/${user.id}`,
        {
          timeout: 10000, // 10 second timeout
        }
      );

      console.log("MongoDB user mapping response:", res?.data);

      // Check if we actually got a user ID before storing
      const mongoUserId = res?.data?.user?.[0]?._id;
      if (mongoUserId) {
        console.log("MongoDB user ID found:", mongoUserId);
        storeUser(mongoUserId);
        return mongoUserId;
      } else {
        console.warn("No MongoDB user ID found in response:", res?.data);
        return null;
      }
    } catch (error) {
      console.error(
        `Error getting MongoDB User ID:`,
        error.response?.data || error.message
      );
      return null;
    }
  };

  useEffect(() => {
    const sendUserData = async () => {
      // Add comprehensive checks and prevent duplicate calls
      if (!token || !user?.id || !userLoaded || !isSignedIn || userDataSent) {
        console.log("Missing required data or already processed:", {
          token: !!token,
          userId: !!user?.id,
          userLoaded,
          isSignedIn,
          userDataSent,
        });
        return;
      }

      try {
        setUserDataSent(true); // Prevent duplicate calls

        console.log("Starting user data sync...");

        // Signup API call with better error handling
        const signupResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
          {
            clerkUserId: user.id,
            FirstName: user.firstName || "",
            lastName: user.lastName || "",
            Email: user.primaryEmailAddress?.emailAddress || "",
            ProfileImage: user.imageUrl || "",
          },
          {
            timeout: 10000, // 10 second timeout
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Signup response:", signupResponse.data);

        // Protected API call with the same backend URL
        try {
          const protectedResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/protected`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              timeout: 10000,
            }
          );
          console.log("Protected response:", protectedResponse.data);
        } catch (protectedError) {
          console.warn(
            "Protected endpoint failed (non-critical):",
            protectedError.message
          );
          // Don't throw here as this might not be critical for the app flow
        }

        // Call getMongoUserId after successful signup
        await getMongoUserId();
      } catch (error) {
        console.error(
          "User data sync failed:",
          error.response?.data || error.message
        );
        setUserDataSent(false); // Allow retry on error
      }
    };

    // Only run when all required data is available and not already processed
    if (
      isLoaded &&
      userLoaded &&
      isSignedIn &&
      token &&
      user?.id &&
      !userDataSent
    ) {
      // Add a small delay to ensure all auth data is fully loaded
      const timer = setTimeout(() => {
        sendUserData();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [token, user, isLoaded, userLoaded, isSignedIn, userDataSent, storeUser]);

  // Reset userDataSent when user changes (logout/login)
  useEffect(() => {
    if (!isSignedIn) {
      setUserDataSent(false);
      setToken("");
    }
  }, [isSignedIn]);

  return (
    <>
      <Header />
      <Slideshow />
      <CategorySection />
      <Certificates />
      <ContactSection />
      <Footer />
    </>
  );
};

export default HomePage;
