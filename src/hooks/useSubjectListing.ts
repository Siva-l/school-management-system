import { useState, useEffect, useCallback } from "react"
import { subjectService } from "../service/subjectService"
import type { Subject } from "../api/types"
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
  const [pageSize] = useState(5)
  
  const [viewingSubjectId, setViewingSubjectId] = useState<string | null>(null)
  const [formSubjectId, setFormSubjectId] = useState<string | null>(null) // null for add, string for edit
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

  const handleView = (subject: Subject) => {
    setViewingSubjectId(subject.id)
  }
  const handleEdit = (subject: Subject) => setFormSubjectId(subject.id)
  const handleDelete = (subject: Subject) => setDeletingSubject(subject)
  const handleAdd = () => setFormSubjectId('new')

  const closeView = () => setViewingSubjectId(null)
  const closeForm = () => setFormSubjectId(null)
  const closeDelete = () => setDeletingSubject(null)

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

  const handlePageChange = (page?: number) => {
    if (page) {
      fetchSubjects(page)
    }
  }

  return {
    subjects,
    isLoading,
    error,
    viewingSubjectId,
    formSubjectId,
    deletingSubject,
    fetchSubjects,
    handleView,
    handleEdit,
    handleDelete,
    handleAdd,
    closeView,
    closeForm,
    closeDelete,
    confirmDelete,

    // Pagination
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    handlePageChange,
  }
}
