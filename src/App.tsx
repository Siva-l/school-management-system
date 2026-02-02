import { useState } from 'react'
import { Layout } from './components/Layout'
import StudentListingPage from './components/studentListingPage'
import TeacherListingPage from './components/teacherListingPage'
import SubjectListingPage from './components/subjectListingPage'

function App() {
  const [currentPage, setCurrentPage] = useState('students')

  const renderPage = () => {
    switch (currentPage) {
      case 'students':
        return <StudentListingPage />
      case 'teachers':
        return <TeacherListingPage />
      case 'subjects':
        return <SubjectListingPage />
      default:
        return <StudentListingPage />
    }
  }

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  )
}

export default App
