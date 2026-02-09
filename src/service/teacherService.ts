import apiClient from "../api/apiClient";
import type { ApiResponse, Teacher, CreateTeacherInput } from "../api/types";


export const teacherService = {
    getAllTeachers: async (page: number, size: number): Promise<ApiResponse<Teacher[]>> => {
        const response = await apiClient.get<ApiResponse<Teacher[]>>(`/teachers?page=${page}&size=${size}`);
        return response.data;
    },
    getTeacherById: async (id: string): Promise<ApiResponse<Teacher>> => {
        const response = await apiClient.get<ApiResponse<Teacher>>(`/teachers/${id}`);
        return response.data;
    },
    createTeacher: async (teacherData: CreateTeacherInput): Promise<ApiResponse<Teacher>> => {
        const response = await apiClient.post<ApiResponse<Teacher>>('/teachers/create', teacherData);
        return response.data;
    },
    updateTeacher: async (id: string, teacherData: Partial<CreateTeacherInput>): Promise<ApiResponse<Teacher>> => {
        const { name, email, phone, password } = teacherData;
        const cleanData = { name, email, phone, password };
        const response = await apiClient.put<ApiResponse<Teacher>>(`/teachers/${id}`, cleanData);
        return response.data;
    },
    deleteTeacher: async (id: string): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<ApiResponse<void>>(`/teachers/${id}`);
        return response.data;
    },
};