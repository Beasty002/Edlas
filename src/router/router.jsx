import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/layout/MainLayout";
import { lazy } from "react";

const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AiChat = lazy(() => import("@/pages/AiChat"));
const Login = lazy(() => import("@/pages/Login"));
const StudentsList = lazy(() => import("@/pages/shared/studentList/StudentsListPage"));
const Classes = lazy(() => import("@/pages/admin/Classes"));
const Subjects = lazy(() => import("@/pages/admin/Subjects"));
const SubjectMaster = lazy(() => import("@/pages/admin/SubjectMaster"));
const TeacherAssignments = lazy(() => import("@/pages/admin/TeacherAssignments"));
const StudentPlacement = lazy(() => import("@/pages/admin/StudentPlacement"));
const StudentDetailForm = lazy(() => import("@/pages/shared/studentList/components/StudentDetailForm"));
const MarksPage = lazy(() => import("@/pages/shared/MarksPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const StudentDetailsPage = lazy(() => import("@/pages/shared/StudentDetailsPage"));
const Unauthorized = lazy(() => import("@/pages/UnAuthorized"));
const AllStaffs = lazy(() => import("@/pages/admin/AllStaffs"));
const StaffDetailForm = lazy(() => import("@/pages/admin/StaffDetailForm"));
const MyResults = lazy(() => import("@/pages/student/MyResults"));
const Notifications = lazy(() => import("@/pages/admin/Notifications"));
const TeacherClassroom = lazy(() => import("@/pages/Teacher/TeacherClassroom"));
const TeacherAssignmentList = lazy(() => import("@/pages/Teacher/TeacherAssignmentList"));
const StudentClassroom = lazy(() => import("@/pages/student/StudentClassroom"));
const StudentAssignmentList = lazy(() => import("@/pages/student/StudentAssignmentList"));

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute allowedRoles={["staff", "superadmin", "student"]} />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "/ai", element: <AiChat /> },

          {
            element: <ProtectedRoute allowedRoles={["student"]} />,
            children: [
              { path: "/my-results", element: <MyResults /> },
              { path: "/my-classroom", element: <StudentClassroom /> },
              { path: "/my-classroom/:subjectId", element: <StudentAssignmentList /> },
            ],
          },

          {
            element: <ProtectedRoute allowedRoles={["staff", "superadmin"]} />,
            children: [
              { path: "/students", element: <StudentsList /> },
              { path: "/marks", element: <MarksPage /> },
              { path: "/classroom", element: <TeacherClassroom /> },
              { path: "/classroom/:classSubjectId", element: <TeacherAssignmentList /> },
            ],
          },

          {
            element: <ProtectedRoute allowedRoles={["superadmin"]} />,
            children: [
              { path: "/students/newEnrollment", element: <StudentDetailForm /> },
              { path: "/students/placement", element: <StudentPlacement /> },
              { path: "/students/StudentDetail", element: <StudentDetailsPage /> },
              { path: "/staffs", element: <AllStaffs /> },
              { path: "/staffs/add", element: <StaffDetailForm /> },
              { path: "/classes", element: <Classes /> },
              { path: "/subjects", element: <Subjects /> },
              { path: "/subject-master", element: <SubjectMaster /> },
              { path: "/teacher-assignments", element: <TeacherAssignments /> },
              { path: "/notifications", element: <Notifications /> },
            ],
          },

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
