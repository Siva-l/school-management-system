import { create } from 'zustand';
import { studentService } from '../service/studentService';
import { showErrorToast, showSuccessToast } from '../util/toast.util';
import type { Student } from '../api/types';

interface StudentState {
  // Data
  students: Student[];
  isLoading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;

  // Selected Items for Modals
  viewingStudentId: string | null;
  formStudentId: string | null; // null for add, string for edit
  deletingStudent: Student | null;

  // Actions
  fetchStudents: (page?: number) => Promise<void>;
  
  // View Actions
  handleView: (student: Student) => void;
  closeView: () => void;
  
  // Form Actions (Add/Edit)
  handleAdd: () => void;
  handleEdit: (student: Student) => void;
  closeForm: () => void;

  // Delete Actions
  handleDelete: (student: Student) => void;
  closeDelete: () => void;
  confirmDelete: () => Promise<void>;

  // Pagination Actions
  handlePageChange: (page?: number) => void;
}

export const useStudentStore = create<StudentState>((set, get) => ({
  // Annual State
  students: [],
  isLoading: false,
  error: null,
  
  // Pagination State
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  pageSize: 3,

  // Selected Items State
  viewingStudentId: null,
  formStudentId: null,
  deletingStudent: null,

  fetchStudents: async (page = get().currentPage) => {
    set({ isLoading: true, error: null });
    try {
      const { pageSize } = get();
      const response = await studentService.getAllStudents(page, pageSize);
      if (response.success && response.data) {
        set({
          students: response.data.results || [],
          totalPages: response.data.totalPages,
          totalCount: response.data.totalCount,
          currentPage: page,
        });
      } else {
        set({ error: "Failed to fetch students" });
      }
    } catch (err) {
      set({ error: "An error occurred while fetching students" });
      showErrorToast("Error", "An error occurred while fetching students");
    } finally {
      set({ isLoading: false });
    }
  },

  handleAdd: () => set({ formStudentId: 'new' }), // 'new' means add mode
  handleEdit: (student) => set({ formStudentId: student.id }),
  closeForm: () => set({ formStudentId: null }),

  handleView: (student) => set({ viewingStudentId: student.id }),
  closeView: () => set({ viewingStudentId: null }),

  handleDelete: (student) => set({ deletingStudent: student }),
  closeDelete: () => set({ deletingStudent: null }),
  confirmDelete: async () => {
    const { deletingStudent, students, currentPage, fetchStudents } = get();
    if (deletingStudent && deletingStudent.id) {
      set({ isLoading: true });
      try {
        const response = await studentService.deleteStudent(deletingStudent.id);
        if (response.success) {
          const isLastItemOnPage = students.length === 1;
          const newPage = (isLastItemOnPage && currentPage > 1) ? currentPage - 1 : currentPage;
          
          await fetchStudents(newPage);
          set({ deletingStudent: null });
          showSuccessToast("Success", "Student deleted successfully");
        }
      } catch (err) {
        showErrorToast("Error", "Failed to delete student");
      } finally {
        set({ isLoading: false });
      }
    }
  },

  handlePageChange: (page) => {
    get().fetchStudents(page);
  }
}));
