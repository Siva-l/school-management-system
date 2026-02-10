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
  editingStudent: Student | null;
  deletingStudent: Student | null;
  addingStudent: CreateStudentInput | null;

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
  editingStudent: null,
  deletingStudent: null,
  addingStudent: null,

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
    addingStudent: {
      name: "",
      admissionNo: "",
      dob: "",
      gender: "",
      phone: "",
    }
  }),
  closeAdd: () => set({ addingStudent: null }),
  saveAdd: async (data) => {
    set({ isLoading: true });
    try {
      const response = await studentService.createStudent(data);
      if (response.success) {
        await get().fetchStudents(); 
        set({ addingStudent: null }); 
        showSuccessToast("Success", "Student added successfully");
      }
    } catch (err) {
      showErrorToast("Error", "Failed to add student");
    } finally {
      set({ isLoading: false });
    }
  },

  handleEdit: (student) => set({ editingStudent: student }),
  closeEdit: () => set({ editingStudent: null }),
  saveEdit: async (data) => {
    const { editingStudent, fetchStudents } = get();
    if (editingStudent && editingStudent.id) {
      set({ isLoading: true });
      try {
        const response = await studentService.updateStudent(editingStudent.id, data);
        if (response.success) {
          await fetchStudents();
          set({ editingStudent: null });
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
