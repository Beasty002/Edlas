import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-right" richColors />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
