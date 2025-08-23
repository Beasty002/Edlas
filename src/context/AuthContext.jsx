import { createContext, useState } from "react";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    toast.success("Login successful!");
    setIsAuthenticated(true);
  };

  const logout = () => {
    toast.success("Logged out successfully!");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
