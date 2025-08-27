import { createBrowserRouter } from "react-router-dom";
import Dashboard from "@/pages/admin/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/layout/MainLayout";
import AiChat from "@/pages/AiChat";
import Login from "@/pages/Login";
import StudentsList from "@/pages/shared/studentList/StudentsListPage";
import NewEnrollment from "@/pages/shared/studentList/components/NewEnrollment";
import Classes from "@/pages/admin/Classes";
import Subjects from "@/pages/admin/Subjects";
import StudentPlacement from "@/pages/admin/StudentPlacement";

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
          { path: "/students/newEnrollment", element: <NewEnrollment /> },
          { path: "/students/Placement", element: <StudentPlacement /> },
          { path: "/classes", element: <Classes /> },
          { path: "/subjects", element: <Subjects /> },
          { path: "/ai", element: <AiChat /> },
        ],
      },
    ],
  },
]);
