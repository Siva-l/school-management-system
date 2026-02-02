import { useState } from "react"

export interface Teacher {
  id: number
  name: string
  email: string
  subject: string
  experience: number
  joinDate: string
}

const initialTeachers: Teacher[] = [
  {
    id: 1,
    name: "Dr. Sarah Williams",
    email: "sarah.w@school.com",
    subject: "Mathematics",
    experience: 12,
    joinDate: "2015-08-15",
  },
  {
    id: 2,
    name: "Mr. James Anderson",
    email: "james.a@school.com",
    subject: "Physics",
    experience: 8,
    joinDate: "2018-07-01",
  },
  {
    id: 3,
    name: "Ms. Emily Davis",
    email: "emily.d@school.com",
    subject: "English Literature",
    experience: 15,
    joinDate: "2012-09-01",
  },
]

export const useTeacherListing = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null)

  const handleView = (teacher: Teacher) => setSelectedTeacher(teacher)
  const handleEdit = (teacher: Teacher) => setEditingTeacher(teacher)
  const handleDelete = (teacher: Teacher) => setDeletingTeacher(teacher)

  const closeView = () => setSelectedTeacher(null)
  const closeEdit = () => setEditingTeacher(null)
  const closeDelete = () => setDeletingTeacher(null)

  const updateEditingTeacher = (updates: Partial<Teacher>) => {
    if (editingTeacher) {
      setEditingTeacher({ ...editingTeacher, ...updates })
    }
  }

  const saveEdit = () => {
    if (editingTeacher) {
      setTeachers((prev) =>
        prev.map((t) => (t.id === editingTeacher.id ? editingTeacher : t))
      )
      closeEdit()
    }
  }

  const confirmDelete = () => {
    if (deletingTeacher) {
      setTeachers((prev) => prev.filter((t) => t.id !== deletingTeacher.id))
      closeDelete()
    }
  }

  return {
    teachers,
    selectedTeacher,
    editingTeacher,
    deletingTeacher,
    handleView,
    handleEdit,
    handleDelete,
    closeView,
    closeEdit,
    closeDelete,
    updateEditingTeacher,
    saveEdit,
    confirmDelete,
  }
}
