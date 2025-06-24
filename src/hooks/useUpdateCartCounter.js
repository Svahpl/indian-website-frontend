// src/hooks/useUpdateCartCounter.js
import { useAppContext } from "../context/AppContext";
import axios from "axios";

export const useUpdateCartCounter = () => {
  const { setCartCounter } = useAppContext();

  const updateCartCount = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/cart/getcart/${localStorage.getItem("uid")}`
      );
      const totalItems = res?.data?.items?.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCounter(totalItems);
    } catch (error) {
      console.log("Error getting cart", error);
    }
  };

  return updateCartCount;
};
