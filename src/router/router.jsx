import { createBrowserRouter } from "react-router-dom";
import Dashboard from "@/pages/admin/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/layout/MainLayout";
import AiChat from "@/pages/AiChat";
import Login from "@/pages/Login";
import StudentsList from "@/pages/shared/studentList/StudentsListPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "/students", element: <StudentsList /> },
          { path: "/ai", element: <AiChat /> },
        ],
      },
    ],
  },
]);
