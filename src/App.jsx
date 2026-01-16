import { RouterProvider } from "react-router-dom";
import { useContext } from "react";
import { router } from "./router/router";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { Toaster } from "sonner";

function AppRoutes() {
  const { isLoading } = useContext(AuthContext);

  if (isLoading) {
    return null;
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-right" richColors />
      <AppRoutes />
    </AuthProvider>
  );
}
