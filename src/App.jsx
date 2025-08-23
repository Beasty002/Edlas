import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "./components/ui/sidebar";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
