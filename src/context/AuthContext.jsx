import { createContext, useState } from "react";
import { toast } from "sonner";
import { edlas_api } from "..";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokens, setTokens] = useState(null);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const toastId = toast.loading("Logging in...");

    try {
      const data = await edlas_api.login(email, password);
      setIsAuthenticated(true);
      setTokens(data.tokens);
      setUser(data.user);
      setTimeout(() => {
        toast.success(`Welcome Back, ${data.user.full_name}`, { id: toastId });
      }, 300);
      return data;
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
