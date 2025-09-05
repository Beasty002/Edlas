import { createBrowserRouter } from "react-router-dom";
import Dashboard from "@/pages/admin/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/layout/MainLayout";
import AiChat from "@/pages/AiChat";
import Login from "@/pages/Login";
import StudentsList from "@/pages/shared/studentList/StudentsListPage";
import Classes from "@/pages/admin/Classes";
import Subjects from "@/pages/admin/Subjects";
import StudentPlacement from "@/pages/admin/StudentPlacement";
import StudentDetailForm from "@/pages/shared/studentList/components/StudentDetailForm";
import MarksPage from "@/pages/shared/MarksPage";
import NotFoundPage from "@/components/NotFoundPage";
import StudentDetailsPage from "@/pages/shared/StudentDetailsPage";

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
          { path: "/students/newEnrollment", element: <StudentDetailForm /> },
          { path: "/students/Placement", element: <StudentPlacement /> },
          { path: "/students/StudentDetail", element: <StudentDetailsPage /> },

          { path: "/classes", element: <Classes /> },
          { path: "/subjects", element: <Subjects /> },
          { path: "/marks", element: <MarksPage /> },

          { path: "/ai", element: <AiChat /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
