import { createContext, useState } from "react";
import { toast } from "sonner";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    toast.success("Login successful!");
    setIsAuthenticated(true);
  };

  const logout = () => {
    toast.error("Logged out successfully!");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
