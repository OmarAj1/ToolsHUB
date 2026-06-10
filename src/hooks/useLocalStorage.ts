import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    setStoredValue((prevValue) => {
      try {
        const valueToStore = value instanceof Function ? value(prevValue) : value;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          queueMicrotask(() => {
            window.dispatchEvent(new CustomEvent("local-storage", { detail: { key } }));
          });
        }
        return valueToStore;
      } catch (error: any) {
        if (
          error.name === 'QuotaExceededError' ||
          error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
        ) {
          console.warn(`[Storage Quota Exceeded] Unable to save to localStorage for key: "${key}". The 5MB browser limit may have been reached.`);
        } else {
          console.warn(`Error setting localStorage key "${key}":`, error);
        }
        const valueToStore = value instanceof Function ? value(prevValue) : value;
        return valueToStore;
      }
    });
  };

  useEffect(() => {
    const handleStorageChange = (e: Event | StorageEvent | CustomEvent) => {
      if (e.type === "storage") {
        const storageEvent = e as StorageEvent;
        if (storageEvent.key && storageEvent.key !== key) return;
      }
      if (e.type === "local-storage") {
        const customEvent = e as CustomEvent;
        if (customEvent.detail && customEvent.detail.key !== key) {
           return;
        }
      }
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          const parsedItem = JSON.parse(item);
          setStoredValue((prev) => {
            if (JSON.stringify(prev) !== item) {
              return parsedItem;
            }
            return prev;
          });
        }
      } catch (error) {}
    };
    window.addEventListener("local-storage", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("local-storage", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue] as const;
}
