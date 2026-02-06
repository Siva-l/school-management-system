import { createBrowserRouter, Navigate } from "react-router-dom"
import { Layout } from "./components/Layout"
import StudentListingPage from "./pages/students/studentListingPage"
import TeacherListingPage from "./pages/teachers/teacherListingPage"
import SubjectListingPage from "./pages/subjects/subjectListingPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/students" replace />,
      },
      {
        path: "students",
        element: <StudentListingPage />,
      },
      {
        path: "teachers",
        element: <TeacherListingPage />,
      },
      {
        path: "subjects",
        element: <SubjectListingPage />,
      },
    ],
  },
])
