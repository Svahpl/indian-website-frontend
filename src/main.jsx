import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import SignOutWatcher from "./components/SignOutWatcher.jsx";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

const handleSignOut = () => {
  localStorage.clear();
  console.log("LocalStorage cleared after sign out");
};

const rootElement = document.getElementById("root");
createRoot(rootElement).render(
  <StrictMode>
    <AppProvider>
      <AuthProvider>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <SignOutWatcher onSignOut={handleSignOut}>
            <App />
          </SignOutWatcher>
        </ClerkProvider>
      </AuthProvider>
    </AppProvider>
  </StrictMode>
);
