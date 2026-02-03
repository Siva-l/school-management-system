import apiClient from './apiClient';
import type { ApiResponse, Student } from './types';

const sanitizeStudentPayload = (studentData: Partial<Student>) => {
  const { 
    id, 
    createdAt, 
    updatedAt, 
    studentEnrollments, 
    enrollmentDate, 
    grade, 
    ...sanitized 
  } = studentData;
  return sanitized;
};

export const studentService = {
  getAllStudents: async (): Promise<ApiResponse<Student[]>> => {
    const response = await apiClient.get<ApiResponse<Student[]>>('/students');
    return response.data;
  },

  
  getStudentById: async (id: string): Promise<ApiResponse<Student>> => {
    const response = await apiClient.get<ApiResponse<Student>>(`/students/${id}`);
    return response.data;
  },

 
  createStudent: async (studentData: Partial<Student>): Promise<ApiResponse<Student>> => {
    const payload = sanitizeStudentPayload(studentData);
    const response = await apiClient.post<ApiResponse<Student>>('/students/create', payload);
    return response.data;
  },

 
  updateStudent: async (id: string, studentData: Partial<Student>): Promise<ApiResponse<Student>> => {
    const payload = sanitizeStudentPayload(studentData);
    const response = await apiClient.put<ApiResponse<Student>>(`/students/${id}`, payload);
    return response.data;
  },

  
  deleteStudent: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/students/${id}`);
    return response.data;
  },
};

export default studentService;
