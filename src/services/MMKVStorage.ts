import { Platform } from "react-native";

// Storage interface that works on both mobile and web
let storage: any;

if (Platform.OS === "web") {
  // Web implementation using localStorage
  storage = {
    getString: (key: string) => {
      try {
        return localStorage.getItem(key);
      } catch {
        return undefined;
      }
    },
    set: (key: string, value: string) => {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },
    remove: (key: string) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error("Error removing from localStorage:", error);
      }
    },
    clearAll: () => {
      try {
        localStorage.clear();
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    },
  };
} else {
  // Mobile implementation using MMKV
  const { MMKV } = require("react-native-mmkv");
  storage = new MMKV({
    id: "supabase-storage",
    encryptionKey: "liveregister-encryption-key",
  });
}

export const MMKVStorage = {
  getItem: async (key: string) => {
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: async (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: async (key: string) => {
    storage.remove(key);
  },
  clear: async () => {
    storage.clearAll();
  },
};
