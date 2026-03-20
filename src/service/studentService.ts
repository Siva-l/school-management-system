import apiClient from '../api/apiClient';
import type { ApiResponse, Student } from '../api/types';


export const studentService = {
  getAllStudents: async (
    page: number, 
    size: number,
    sortBy?: string | null,
    sortOrder?: 'asc' | 'desc',
    gender?: string | null
  ): Promise<ApiResponse<Student[]>> => {
    let url = `/students?page=${page}&size=${size}`;
    if (sortBy && sortOrder) {
      url += `&sortBy=${sortBy}&sortOrder=${sortOrder.toUpperCase()}`;
    }
    if (gender) {
      url += `&gender=${gender}`;
    }
    const response = await apiClient.get<ApiResponse<Student[]>>(url);
    return response.data;
  },

  
  getStudentById: async (id: string): Promise<ApiResponse<Student>> => {
    const response = await apiClient.get<ApiResponse<Student>>(`/students/${id}`);
    return response.data;
  },

 
  createStudent: async (studentData: FormData): Promise<ApiResponse<Student>> => {
    const response = await apiClient.post<ApiResponse<Student>>('/students/create', studentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

 
  updateStudent: async (id: string, studentData: FormData): Promise<ApiResponse<Student>> => {
    const response = await apiClient.put<ApiResponse<Student>>(`/students/${id}`, studentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  
  deleteStudent: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/students/${id}`);
    return response.data;
  },
};

export default studentService;
