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
  const [addingSubject, setAddingSubject] = useState<Partial<Subject> | null>(null)

  const handleView = (subject: Subject) => setSelectedSubject(subject)
  const handleEdit = (subject: Subject) => setEditingSubject(subject)
  const handleDelete = (subject: Subject) => setDeletingSubject(subject)
  const handleAdd = () => setAddingSubject({
    name: "",
    code: "",
    description: "",
    credits: 0,
    department: ""
  })

  const closeView = () => setSelectedSubject(null)
  const closeEdit = () => setEditingSubject(null)
  const closeDelete = () => setDeletingSubject(null)
  const closeAdd = () => setAddingSubject(null)

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

  const updateAddingSubject = (updates: Partial<Subject>) => {
    if (addingSubject) {
      setAddingSubject({ ...addingSubject, ...updates })
    }
  }

  const saveAdd = () => {
    if (addingSubject && addingSubject.name) {
      const newSubject: Subject = {
        id: Math.max(...subjects.map(s => s.id), 0) + 1,
        name: addingSubject.name || "",
        code: addingSubject.code || "",
        description: addingSubject.description || "",
        credits: addingSubject.credits || 0,
        department: addingSubject.department || "",
      }
      setSubjects([...subjects, newSubject])
      closeAdd()
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

    addingSubject,
    handleAdd,
    closeAdd,
    updateAddingSubject,
    saveAdd,
  }
}
