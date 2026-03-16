import { useEffect } from "react"
import { useStudentStore } from "../store/student.store"

export type { Student } from "../api/types"

export const useStudentListing = () => {
  const { fetchStudents, ...store } = useStudentStore()

  useEffect(() => {
    fetchStudents()
  }, [])

  return {
    ...store,
    refreshStudents: fetchStudents,
  }
}
