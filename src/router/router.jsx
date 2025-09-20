import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/layout/MainLayout";
import { lazy } from "react";

const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AiChat = lazy(() => import("@/pages/AiChat"));
const Login = lazy(() => import("@/pages/Login"));
const StudentsList = lazy(() =>
  import("@/pages/shared/studentList/StudentsListPage")
);
const Classes = lazy(() => import("@/pages/admin/Classes"));
const Subjects = lazy(() => import("@/pages/admin/Subjects"));
const StudentPlacement = lazy(() => import("@/pages/admin/StudentPlacement"));
const StudentDetailForm = lazy(() =>
  import("@/pages/shared/studentList/components/StudentDetailForm")
);
const MarksPage = lazy(() => import("@/pages/shared/MarksPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const StudentDetailsPage = lazy(() =>
  import("@/pages/shared/StudentDetailsPage")
);
const Unauthorized = lazy(() => import("@/pages/Unauthorized"));

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: (
      <ProtectedRoute allowedRoles={["staff", "superadmin", "student"]} />
    ),
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "/students", element: <StudentsList /> },
          { path: "/students/newEnrollment", element: <StudentDetailForm /> },
          { path: "/students/Placement", element: <StudentPlacement /> },

          {
            element: <ProtectedRoute allowedRoles={["staff"]} />,
            children: [
              {
                path: "/students/StudentDetail",
                element: <StudentDetailsPage />,
              },
              { path: "/classes", element: <Classes /> },
              { path: "/subjects", element: <Subjects /> },
            ],
          },

          { path: "/marks", element: <MarksPage /> },
          { path: "/ai", element: <AiChat /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);
