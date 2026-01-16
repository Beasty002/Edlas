import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { mockUsers } from "@/data/mockData";
import {
  getAccessToken,
  setAccessToken,
  getUser as getStoredUser,
  setUser as storeUser,
  clearAuth,
  hasValidAuth,
} from "@/utils/tokenStorage";

export const AuthContext = createContext();

const getUserType = (userData) => {
  if (userData.is_superuser) {
    return "superadmin";
  }
  return userData.user_type || "staff";
};

const getFullName = (userData) => {
  const parts = [userData.first_name, userData.middle_name, userData.last_name].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : userData.email?.split("@")[0] || "User";
};

const saveToStorage = (accessToken, user) => {
  setAccessToken(accessToken);
  storeUser(user);
};

// Generate a mock token
const generateMockToken = () => {
  return "mock_token_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessTokenState] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const performLogout = useCallback(() => {
    clearAuth();
    setIsAuthenticated(false);
    setAccessTokenState(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const initAuth = () => {
      if (hasValidAuth()) {
        const storedToken = getAccessToken();
        const storedUser = getStoredUser();

        setAccessTokenState(storedToken);
        setUser(storedUser);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const toastId = toast.loading("Logging in...");

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check credentials against mock users
    const mockUser = mockUsers[email];

    if (!mockUser || mockUser.password !== password) {
      toast.error("Invalid email or password", { id: toastId });
      throw new Error("Invalid credentials");
    }

    const userType = getUserType(mockUser);
    const fullName = getFullName(mockUser);

    const processedUser = {
      ...mockUser,
      user_type: userType,
      full_name: fullName,
    };

    // Remove password from stored user
    delete processedUser.password;

    const token = generateMockToken();

    saveToStorage(token, processedUser);
    setIsAuthenticated(true);
    setAccessTokenState(token);
    setUser(processedUser);

    setTimeout(() => {
      toast.success(`Welcome Back, ${fullName}`, { id: toastId });
    }, 300);

    return { user: processedUser, tokens: { access: token } };
  };

  const logout = () => {
    performLogout();
    toast.success("Logged out successfully!");
  };

  const refreshUser = async () => {
    // For mock, just return the stored user
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, accessToken, user, login, logout, refreshUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
