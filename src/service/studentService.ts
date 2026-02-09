import apiClient from '../api/apiClient';
import type { ApiResponse, Student, CreateStudentInput } from '../api/types';


export const studentService = {
  getAllStudents: async (page: number, size: number): Promise<ApiResponse<Student[]>> => {
    const response = await apiClient.get<ApiResponse<Student[]>>(`/students?page=${page}&size=${size}`);
    return response.data;
  },

  
  getStudentById: async (id: string): Promise<ApiResponse<Student>> => {
    const response = await apiClient.get<ApiResponse<Student>>(`/students/${id}`);
    return response.data;
  },

 
  createStudent: async (studentData: CreateStudentInput): Promise<ApiResponse<Student>> => {
    const response = await apiClient.post<ApiResponse<Student>>('/students/create', studentData);
    return response.data;
  },

 
  updateStudent: async (id: string, studentData: Partial<CreateStudentInput>): Promise<ApiResponse<Student>> => {
    const { name, admissionNo, dob, gender, phone } = studentData;
    const cleanData = { name, admissionNo, dob, gender, phone };
    const response = await apiClient.put<ApiResponse<Student>>(`/students/${id}`, cleanData);
    return response.data;
  },

  
  deleteStudent: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/students/${id}`);
    return response.data;
  },
};

export default studentService;
