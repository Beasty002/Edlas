import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { authAPI } from "@/api/api";
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

    try {
      const response = await authAPI.login(email, password);

      if (!response.ok) {
        throw { response: { data: response.data } };
      }

      const data = response.data;
      const userType = getUserType(data.user);
      const fullName = getFullName(data.user);

      const processedUser = {
        ...data.user,
        user_type: userType,
        full_name: fullName,
      };

      saveToStorage(data.tokens.access, processedUser);
      setIsAuthenticated(true);
      setAccessTokenState(data.tokens.access);
      setUser(processedUser);

      setTimeout(() => {
        toast.success(`Welcome Back, ${fullName}`, { id: toastId });
      }, 300);

      return { ...data, user: processedUser };
    } catch (error) {
      toast.error(
        error?.response?.data?.detail || "Login failed. Please try again.",
        { id: toastId }
      );
      throw error;
    }
  };

  const logout = () => {
    performLogout();
    toast.success("Logged out successfully!");
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.whoami();
      if (response.ok) {
        const userType = getUserType(response.data);
        const fullName = getFullName(response.data);
        const processedUser = {
          ...response.data,
          user_type: userType,
          full_name: fullName,
        };
        setUser(processedUser);
        storeUser(processedUser);
      }
    } catch {
      logout();
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

