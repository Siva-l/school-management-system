import { useState, useEffect, useCallback } from "react"
import { subjectService } from "../service/subjectService" 
import type { Subject, CreateSubjectInput } from "../api/types" 
import { showErrorToast, showSuccessToast } from "../util/toast.util"

export type { Subject } from "../api/types"

export const useSubjectListing = () => {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize] = useState(3)
  
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [formData, setFormData] = useState<Subject | CreateSubjectInput | null>(null)
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null)

  const fetchSubjects = useCallback(async (page: number = currentPage) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await subjectService.getAllSubjects(page, pageSize)
      if (response.success) {
        setSubjects(response.data.results)
        setTotalPages(response.data.totalPages)
        setTotalCount(response.data.totalCount)
        setCurrentPage(page)
      }
    } catch (err) {
      setError("An error occurred while fetching subjects")
      showErrorToast("Error", "An error occurred while fetching subjects")
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize])

  useEffect(() => {
    fetchSubjects()
  }, [])

  const handleView = (subject: Subject) => setSelectedSubject(subject)
  const handleEdit = (subject: Subject) => setFormData(subject)
  const handleDelete = (subject: Subject) => setDeletingSubject(subject)
  const handleAdd = () => setFormData({
    name: "",
    code: "",
  })

  const closeView = () => setSelectedSubject(null)
  const closeForm = () => setFormData(null)
  const closeDelete = () => setDeletingSubject(null)



  const saveEdit = async (data: CreateSubjectInput) => {
    if (formData && 'id' in formData) {
      setIsLoading(true)
      try {
        const response = await subjectService.updateSubject(formData.id, data)
        if (response.success) {
          await fetchSubjects()
          closeForm()
          showSuccessToast("Success", "Subject updated successfully")
        }
      } catch (err) {
        showErrorToast("Error", "Failed to update subject")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const confirmDelete = async () => {
    if (deletingSubject && deletingSubject.id) {
      setIsLoading(true)
      try {
        const response = await subjectService.deleteSubject(deletingSubject.id)
        if (response.success) {
          const isLastItemOnPage = subjects.length === 1;
          const newPage = (isLastItemOnPage && currentPage > 1) ? currentPage - 1 : currentPage;
          await fetchSubjects(newPage)
          closeDelete()
          showSuccessToast("Success", "Subject deleted successfully")
        }
      } catch (err) {
        showErrorToast("Error", "Failed to delete subject")
      } finally {
        setIsLoading(false)
      }
    }
  }



  const saveAdd = async (data: CreateSubjectInput) => {
    if (formData && !('id' in formData)) {
      setIsLoading(true)
      try {
        const response = await subjectService.createSubject(data)
        if (response.success) {
          await fetchSubjects()
          closeForm()
          showSuccessToast("Success", "Subject added successfully")
        } else {
          showErrorToast("Error", "Failed to add subject")
        }
      } catch (err) {
        showErrorToast("Error", "Failed to add subject")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePageChange = (page?: number) => {
    if (page) {
      fetchSubjects(page)
    }
  }

  return {
    subjects,
    isLoading,
    error,
    selectedSubject,
    formData,
    deletingSubject,
    handleView,
    handleEdit,
    handleDelete,
    closeView,
    closeForm,
    closeDelete,
    saveEdit,
    confirmDelete,

    handleAdd,
    saveAdd,
    refreshSubjects: fetchSubjects,

    // Pagination
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    handlePageChange,
  }
}
