import { useState } from "react"

export interface Subject {
  id: number
  name: string
  code: string
  description: string
  credits: number
  department: string
}

const initialSubjects: Subject[] = [
  {
    id: 1,
    name: "Advanced Mathematics",
    code: "MATH301",
    description:"Calculus and Advanced Algebra",
    credits: 4,
    department: "Mathematics",
 
  },
  {
    id: 2,
    name: "Classical Physics",
    code: "PHYS201",
    description:"Mechanics and Thermodynamics",
    credits: 4,
    department: "Science",
    
  },
  {
    id: 3,
    name: "World Literature",
    code: "ENG401",
    description:"Classic and Contemporary Literature",
    credits: 3,
    department: "English",
    
  },
]

export const useSubjectListing = () => {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null)

  const handleView = (subject: Subject) => setSelectedSubject(subject)
  const handleEdit = (subject: Subject) => setEditingSubject(subject)
  const handleDelete = (subject: Subject) => setDeletingSubject(subject)

  const closeView = () => setSelectedSubject(null)
  const closeEdit = () => setEditingSubject(null)
  const closeDelete = () => setDeletingSubject(null)

  const updateEditingSubject = (updates: Partial<Subject>) => {
    if (editingSubject) {
      setEditingSubject({ ...editingSubject, ...updates })
    }
  }

  const saveEdit = () => {
    if (editingSubject) {
      setSubjects((prev) =>
        prev.map((s) => (s.id === editingSubject.id ? editingSubject : s))
      )
      closeEdit()
    }
  }

  const confirmDelete = () => {
    if (deletingSubject) {
      setSubjects((prev) => prev.filter((s) => s.id !== deletingSubject.id))
      closeDelete()
    }
  }

  return {
    subjects,
    selectedSubject,
    editingSubject,
    deletingSubject,
    handleView,
    handleEdit,
    handleDelete,
    closeView,
    closeEdit,
    closeDelete,
    updateEditingSubject,
    saveEdit,
    confirmDelete,
  }
}
