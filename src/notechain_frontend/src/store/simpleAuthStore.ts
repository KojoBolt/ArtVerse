import { create } from "zustand";
import { persist } from "zustand/middleware";

// Simple user interface for local storage
interface User {
  id: string;
  name: string;
  createdAt: number;
}

interface AuthState {
  // User state
  user: User | null;
  isInitialized: boolean;
  isAuthenticated: boolean; // Always true for open access

  // Actions
  initializeUser: () => void;
  updateUserName: (name: string) => void;
  clearUser: () => void;
}

// Generate a simple user ID
const generateUserId = () =>
  `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isInitialized: false,
      isAuthenticated: true, // Always authenticated for open access

      initializeUser: () => {
        const { user } = get();

        if (!user) {
          // Create a new user if none exists
          const newUser: User = {
            id: generateUserId(),
            name: "ArtVerse User",
            createdAt: Date.now(),
          };

          set({
            user: newUser,
            isInitialized: true,
          });

          console.log("✅ New user created:", newUser.id);
        } else {
          set({ isInitialized: true });
          console.log("✅ Existing user loaded:", user.id);
        }
      },

      updateUserName: (name: string) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              name: name.trim() || "ArtVerse User",
            },
          });
          console.log("✅ User name updated to:", name);
        }
      },

      clearUser: () => {
        set({
          user: null,
          isInitialized: false,
          isAuthenticated: true, // Keep authenticated for open access
        });
        console.log("✅ User data cleared");
      },
    }),
    {
      name: "artverse-user", // localStorage key
      partialize: (state) => ({ user: state.user }), // Only persist user data
    }
  )
);
