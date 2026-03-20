import { createBrowserRouter } from "react-router-dom"
import { Layout } from "./components/Layout"
import StudentListingPage from "./pages/students/studentListingPage"
import TeacherListingPage from "./pages/teachers/teacherListingPage"
import SubjectListingPage from "./pages/subjects/subjectListingPage"
import DashboardPage from "./pages/dashboard/DashboardPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
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
