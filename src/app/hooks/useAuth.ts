"use client";
import { useEffect, useState } from "react";
import { LocalStorageType } from "../constants/pages";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null indicates loading
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem(LocalStorageType.ACCESS_TOKEN);
    setIsAuthenticated(!!token);
    setIsLoading(false);
    const handleStorageUpdate = () => {
      const updatedToken = localStorage.getItem(LocalStorageType.ACCESS_TOKEN);
      setIsAuthenticated(!!updatedToken);
    };

    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === LocalStorageType.ACCESS_TOKEN) {
        handleStorageUpdate();
      }
    };

    window.addEventListener("storage", handleStorageEvent);

   
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, [key, value]);
      if (key === LocalStorageType.ACCESS_TOKEN) {
        handleStorageUpdate();
      }
    };

   
    return () => {
      window.removeEventListener("storage", handleStorageEvent);
      localStorage.setItem = originalSetItem; // Restore the original method
    };
  }, []);

  return { isAuthenticated, isLoading };
};
