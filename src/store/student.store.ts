import { create } from 'zustand';
import { studentService } from '../service/studentService';
import { showErrorToast, showSuccessToast } from '../util/toast.util';
import type { Student, CreateStudentInput } from '../api/types';

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
  selectedStudent: Student | null;
  activeStudent: CreateStudentInput | Student | null;
  formMode: 'ADD' | 'EDIT' | null;
  deletingStudent: Student | null;

  // Actions
  fetchStudents: (page?: number) => Promise<void>;
  
  // View Actions
  handleView: (student: Student) => void;
  closeView: () => void;
  
  // Add Actions
  handleAdd: () => void;
  closeAdd: () => void;
  saveAdd: (data: CreateStudentInput) => Promise<void>;

  // Edit Actions
  handleEdit: (student: Student) => void;
  closeEdit: () => void;
  saveEdit: (data: CreateStudentInput) => Promise<void>;

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
  selectedStudent: null,
  activeStudent: null,
  formMode: null,
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

  handleView: (student) => set({ selectedStudent: student }),
  closeView: () => set({ selectedStudent: null }),

  handleAdd: () => set({
    formMode: 'ADD',
    activeStudent: {
      name: "",
      admissionNo: "",
      dob: "",
      gender: "",
      phone: "",
    }
  }),
  closeAdd: () => set({ formMode: null, activeStudent: null }),
  saveAdd: async (data) => {
    set({ isLoading: true });
    try {
      const response = await studentService.createStudent(data);
      if (response.success) {
        await get().fetchStudents(); 
        set({ formMode: null, activeStudent: null }); 
        showSuccessToast("Success", "Student added successfully");
      }
    } catch (err) {
      showErrorToast("Error", "Failed to add student");
    } finally {
      set({ isLoading: false });
    }
  },

  handleEdit: (student) => set({ formMode: 'EDIT', activeStudent: student }),
  closeEdit: () => set({ formMode: null, activeStudent: null }),
  saveEdit: async (data) => {
    const { activeStudent, formMode, fetchStudents } = get();
    if (formMode === 'EDIT' && activeStudent && 'id' in activeStudent) {
      set({ isLoading: true });
      try {
        const response = await studentService.updateStudent(activeStudent.id, data);
        if (response.success) {
          await fetchStudents();
          set({ formMode: null, activeStudent: null });
          showSuccessToast("Success", "Student updated successfully");
        }
      } catch (err) {
        showErrorToast("Error", "Failed to update student");
      } finally {
        set({ isLoading: false });
      }
    }
  },

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
