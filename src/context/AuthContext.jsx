import { createContext, useState } from "react";
import { toast } from "sonner";
import { edlas_api } from "..";

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

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokens, setTokens] = useState(null);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const toastId = toast.loading("Logging in...");

    try {
      const data = await edlas_api.login(email, password);
      
      const userType = getUserType(data.user);
      const fullName = getFullName(data.user);
      
      const processedUser = {
        ...data.user,
        user_type: userType,
        full_name: fullName,
      };

      setIsAuthenticated(true);
      setTokens(data.tokens);
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
    setIsAuthenticated(false);
    setTokens(null);
    setUser(null);
    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, tokens, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
