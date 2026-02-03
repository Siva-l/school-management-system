import { useState, useEffect, useCallback } from "react"
import { studentService } from "../api/studentService"
import type { Student } from "../api/types"

export type { Student } from "../api/types"

export const useStudentListing = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null)
  const [addingStudent, setAddingStudent] = useState<Partial<Student> | null>(null)

  const fetchStudents = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await studentService.getAllStudents()
      if (response.success) {
        const mappedStudents = response.data.map(student => ({
          ...student,
          enrollmentDate: student.createdAt ? student.createdAt.split('T')[0] : "",
          grade: student.studentEnrollments?.[0]?.division?.class?.grade || "N/A"
        }))
        setStudents(mappedStudents)
      } else {
        setError("Failed to fetch students")
      }
    } catch (err) {
      setError("An error occurred while fetching students")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleView = (student: Student) => setSelectedStudent(student)
  const handleEdit = (student: Student) => setEditingStudent(student)
  const handleDelete = (student: Student) => setDeletingStudent(student)
  const handleAdd = () => setAddingStudent({
    name: "",
    admissionNo: "",
    grade: "",
    dob: "",
    enrollmentDate:""
  })

  const closeView = () => setSelectedStudent(null)
  const closeEdit = () => setEditingStudent(null)
  const closeDelete = () => setDeletingStudent(null)
  const closeAdd = () => setAddingStudent(null)

  const updateEditingStudent = (updates: Partial<Student>) => {
    if (editingStudent) {
      setEditingStudent({ ...editingStudent, ...updates })
    }
  }

  const saveEdit = async () => {
    if (editingStudent && editingStudent.id) {
      setIsLoading(true)
      try {
        console.log("Editing student:", editingStudent)
        const response = await studentService.updateStudent(editingStudent.id, editingStudent)
        if (response.success) {
          await fetchStudents()
          closeEdit()
        }
      } catch (err) {
        console.error("Failed to update student", err)
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
          await fetchStudents()
          closeDelete()
        }
      } catch (err) {
        console.error("Failed to delete student", err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const updateAddingStudent = (updates: Partial<Student>) => {
    if (addingStudent) {
      setAddingStudent({ ...addingStudent, ...updates })
    }
  }

  const saveAdd = async () => {
    if (addingStudent && addingStudent.name) {
      setIsLoading(true)
      try {
        const response = await studentService.createStudent(addingStudent)
        if (response.success) {
          await fetchStudents()
          closeAdd()
        }
      } catch (err) {
        console.error("Failed to add student", err)
      } finally {
        setIsLoading(false)
      }
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
    updateEditingStudent,
    saveEdit,
    confirmDelete,

    addingStudent,
    handleAdd,
    closeAdd,
    updateAddingStudent,
    saveAdd,
    refreshStudents: fetchStudents,
  }
}
