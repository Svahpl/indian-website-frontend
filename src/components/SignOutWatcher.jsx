import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";

const SignOutWatcher = ({ children, onSignOut }) => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { userId } = useAuth();
  const wasSignedIn = useRef(false);
  const previousUserId = useRef(null);

  useEffect(() => {
    // Only track changes after Clerk is loaded
    if (!isLoaded) return;

    // Method 1: Track sign-in state changes
    if (wasSignedIn.current && !isSignedIn) {
      console.log("Sign out detected via isSignedIn change");
      handleSignOut();
    }

    // Method 2: Track userId changes (more reliable)
    if (previousUserId.current && !userId && wasSignedIn.current) {
      console.log("Sign out detected via userId change");
      handleSignOut();
    }

    // Update refs
    wasSignedIn.current = isSignedIn;
    previousUserId.current = userId;
  }, [isSignedIn, userId, isLoaded]);

  // Method 3: Listen for Clerk-specific localStorage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Clerk stores JWT tokens with keys like '__clerk_db_jwt'
      if (e.key && e.key.includes("__clerk") && e.newValue === null) {
        console.log("Sign out detected via localStorage change");
        handleSignOut();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Method 4: Periodically check if Clerk tokens exist
  useEffect(() => {
    let intervalId;

    if (isLoaded && isSignedIn) {
      intervalId = setInterval(() => {
        // Check if Clerk's internal tokens still exist
        const hasClerkTokens = Object.keys(localStorage).some(
          (key) => key.includes("__clerk") || key.includes("clerk-db")
        );

        if (!hasClerkTokens && wasSignedIn.current) {
          console.log("Sign out detected via token check");
          handleSignOut();
        }
      }, 1000); // Check every second
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLoaded, isSignedIn]);

  const handleSignOut = () => {
    // Prevent multiple calls
    if (!wasSignedIn.current) return;

    console.log("Executing sign out cleanup...");

    // Clear your application's localStorage
    try {
      // Method 1: Clear specific keys (recommended)
      const keysToKeep = ["theme", "language"]; // Add keys you want to keep
      const allKeys = Object.keys(localStorage);

      allKeys.forEach((key) => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      // Method 2: Clear all localStorage (use with caution)
      // localStorage.clear();

      // Clear sessionStorage
      sessionStorage.clear();

      console.log("Storage cleared successfully");
    } catch (error) {
      console.error("Error clearing storage:", error);
    }

    // Execute custom cleanup function
    if (onSignOut) {
      try {
        onSignOut();
      } catch (error) {
        console.error("Error in custom onSignOut function:", error);
      }
    }

    // Reset tracking
    wasSignedIn.current = false;
    previousUserId.current = null;
  };

  return children;
};

export default SignOutWatcher;
