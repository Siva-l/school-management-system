import { useState } from "react"

export interface Student {
  id: number
  name: string
  email: string
  grade: string
  age: number
  enrollmentDate: string
}

const initialStudents: Student[] = [
  {
    id: 1,
    name: "Emma Johnson",
    email: "emma.j@email.com",
    grade: "10th Grade",
    age: 15,
    enrollmentDate: "2024-09-01",
  },
  {
    id: 2,
    name: "Liam Smith",
    email: "liam.s@email.com",
    grade: "9th Grade",
    age: 14,
    enrollmentDate: "2024-09-01",
  },
  {
    id: 3,
    name: "Olivia Brown",
    email: "olivia.b@email.com",
    grade: "11th Grade",
    age: 16,
    enrollmentDate: "2023-09-01",
  },
]

export const useStudentListing = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null)

  const handleView = (student: Student) => setSelectedStudent(student)
  const handleEdit = (student: Student) => setEditingStudent(student)
  const handleDelete = (student: Student) => setDeletingStudent(student)

  const closeView = () => setSelectedStudent(null)
  const closeEdit = () => setEditingStudent(null)
  const closeDelete = () => setDeletingStudent(null)

  const updateEditingStudent = (updates: Partial<Student>) => {
    if (editingStudent) {
      setEditingStudent({ ...editingStudent, ...updates })
    }
  }

  const saveEdit = () => {
    if (editingStudent) {
      setStudents((prev) =>
        prev.map((s) => (s.id === editingStudent.id ? editingStudent : s))
      )
      closeEdit()
    }
  }

  const confirmDelete = () => {
    if (deletingStudent) {
      setStudents((prev) => prev.filter((s) => s.id !== deletingStudent.id))
      closeDelete()
    }
  }

  return {
    students,
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
  }
}
