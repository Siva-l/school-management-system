import { useState, useEffect, useCallback } from "react"
import { teacherService } from "../service/teacherService"
import type { Teacher, CreateTeacherInput } from "../api/types"
import { showErrorToast, showSuccessToast } from "../util/toast.util"

export type { Teacher } from "../api/types"

export const useTeacherListing = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize] = useState(3)
  
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null)
  const [addingTeacher, setAddingTeacher] = useState<CreateTeacherInput | null>(null)

  const fetchTeachers = useCallback(async (page: number = currentPage) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await teacherService.getAllTeachers(page, pageSize)
      if (response.success) {
        setTeachers(response.data.results)
        setTotalPages(response.data.totalPages)
        setTotalCount(response.data.totalCount)
        setCurrentPage(page)
      } else {
        setError("Failed to fetch teachers")
      }
    } catch (err) {
      setError("An error occurred while fetching teachers")
      showErrorToast("Error", "An error occurred while fetching teachers")
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize])

  useEffect(() => {
    fetchTeachers()
  }, [])

  const handleView = (teacher: Teacher) => setSelectedTeacher(teacher)
  const handleEdit = (teacher: Teacher) => setEditingTeacher(teacher)
  const handleDelete = (teacher: Teacher) => setDeletingTeacher(teacher)
  const handleAdd = () => setAddingTeacher({
    name: "",
    email: "",
    phone: "",
    password: "",
  })

  const closeView = () => setSelectedTeacher(null)
  const closeEdit = () => setEditingTeacher(null)
  const closeDelete = () => setDeletingTeacher(null)
  const closeAdd = () => setAddingTeacher(null)



  const saveEdit = async (data: Teacher) => {
    if (editingTeacher && editingTeacher.id) {
      setIsLoading(true)
      try {
        const response = await teacherService.updateTeacher(editingTeacher.id, data)
        if (response.success) {
          await fetchTeachers()
          closeEdit()
          showSuccessToast("Success", "Teacher updated successfully")
        } else {
          showErrorToast("Error", "Failed to update teacher")
        }
      } catch (err) {
        showErrorToast("Error", "Failed to update teacher")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const confirmDelete = async () => {
    if (deletingTeacher && deletingTeacher.id) {
      setIsLoading(true)
      try {
        const response = await teacherService.deleteTeacher(deletingTeacher.id)
        if (response.success) {
          const isLastItemOnPage = teachers.length === 1;
          const newPage = (isLastItemOnPage && currentPage > 1) ? currentPage - 1 : currentPage;
          await fetchTeachers(newPage)
          closeDelete()
          showSuccessToast("Success", "Teacher deleted successfully")
        } else {
          showErrorToast("Error", "Failed to delete teacher")
        }
      } catch (err) {
        showErrorToast("Error", "Failed to delete teacher")
      } finally {
        setIsLoading(false)
      }
    }
  }



  const saveAdd = async (data: CreateTeacherInput) => {
    if (addingTeacher) {
      setIsLoading(true)
      try {
        const response = await teacherService.createTeacher(data)
        if (response.success) {
          await fetchTeachers()
          closeAdd()
          showSuccessToast("Success", "Teacher added successfully")
        } else {
          showErrorToast("Error", "Failed to add teacher")
        }
      } catch (err) {
        showErrorToast("Error", "Failed to add teacher")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePageChange = (page?: number) => {
    if (page) {
      fetchTeachers(page)
    }
  }

  return {
    teachers,
    isLoading,
    error,
    selectedTeacher,
    editingTeacher,
    deletingTeacher,
    handleView,
    handleEdit,
    handleDelete,
    closeView,
    closeEdit,
    closeDelete,
    saveEdit,
    confirmDelete,

    addingTeacher,
    handleAdd,
    closeAdd,
    saveAdd,
    refreshTeachers: fetchTeachers,

    // Pagination
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    handlePageChange,
  }
}
