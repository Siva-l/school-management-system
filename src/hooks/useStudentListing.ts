import { useState, useEffect, useCallback } from "react"
import { studentService } from "../service/studentService"
import type { Student, CreateStudentInput } from "../api/types"
import { showErrorToast, showSuccessToast } from "../util/toast.util"

export type { Student } from "../api/types"

export const useStudentListing = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize] = useState(3)
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null)
  const [addingStudent, setAddingStudent] = useState<CreateStudentInput | null>(null)

  const fetchStudents = useCallback(async (page: number = currentPage) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await studentService.getAllStudents(page, pageSize)
      if (response.success) {
        const mappedStudents = response?.data && response.data.results.map(student => ({
          ...student,
        }))
        setStudents(mappedStudents)
        setTotalPages(response.data.totalPages)
        setTotalCount(response.data.totalCount)
        setCurrentPage(page)
      } else {
        setError("Failed to fetch students")
      }
    } catch (err) {
      setError("An error occurred while fetching students")
      showErrorToast("Error", "An error occurred while fetching students")
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize])

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleView = (student: Student) => setSelectedStudent(student)
  const handleEdit = (student: Student) => setEditingStudent(student)
  const handleDelete = (student: Student) => setDeletingStudent(student)
  const handleAdd = () => setAddingStudent({
    name: "",
    admissionNo: "",
    dob: "",
    gender: "",
    phone: "",
  })

  const closeView = () => setSelectedStudent(null)
  const closeEdit = () => setEditingStudent(null)
  const closeDelete = () => setDeletingStudent(null)
  const closeAdd = () => setAddingStudent(null)



  const saveEdit = async (data: CreateStudentInput) => {
    if (editingStudent && editingStudent.id) {
      setIsLoading(true)
      try {
        const response = await studentService.updateStudent(editingStudent.id, data)
        if (response.success) {

          await fetchStudents()
          closeEdit()
          showSuccessToast("Success", "Student updated successfully")
        }
      } catch (err) {
        showErrorToast("Error", "Failed to update student")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const confirmDelete = async () => {
    if (deletingStudent && deletingStudent.id) {
      setIsLoading(true)
      try {
        const response = await studentService.deleteStudent(deletingStudent.id)
        if (response.success) {
          const isLastItemOnPage = students.length === 1;
          const newPage = (isLastItemOnPage && currentPage > 1) ? currentPage - 1 : currentPage;

          await fetchStudents(newPage)
          closeDelete()
          showSuccessToast("Success", "Student deleted successfully")
        }
      } catch (err) {
        showErrorToast("Error", "Failed to delete student")
      } finally {
        setIsLoading(false)
      }
    }
  }



  const saveAdd = async (data: CreateStudentInput) => {
    if (addingStudent) {
      setIsLoading(true)
      try {
        const response = await studentService.createStudent(data)
        if (response.success) {
          await fetchStudents()
          closeAdd()
          showSuccessToast("Success", "Student added successfully")
        }
      } catch (err) {
        showErrorToast("Error", "Failed to add student")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePageChange = (page?: number) => {
    if (page) {
      fetchStudents(page)
    }
  }

  return {
    students,
    isLoading,
    error,
    selectedStudent,
    editingStudent,
    deletingStudent,
    handleView,
    handleEdit,
    handleDelete,
    closeView,
    closeEdit,
    closeDelete,
    saveEdit,
    confirmDelete,

    addingStudent,
    handleAdd,
    closeAdd,
    saveAdd,
    refreshStudents: fetchStudents,
    
    // Pagination
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    handlePageChange,
  }
}
