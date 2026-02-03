import apiClient from "./apiClient";
import type { ApiResponse, Teacher } from "./types";

export const teacherService = {
    getAllTeachers: async (): Promise<ApiResponse<Teacher[]>> => {
        const response = await apiClient.get<ApiResponse<Teacher[]>>('/teachers');
        return response.data;
    },
    getTeacherById: async (id: string): Promise<ApiResponse<Teacher>> => {
        const response = await apiClient.get<ApiResponse<Teacher>>(`/teachers/${id}`);
        return response.data;
    },
    createTeacher: async (teacherData: Partial<Teacher>): Promise<ApiResponse<Teacher>> => {
        const response = await apiClient.post<ApiResponse<Teacher>>('/teachers/create', teacherData);
        return response.data;
    },
    updateTeacher: async (id: string, teacherData: Partial<Teacher>): Promise<ApiResponse<Teacher>> => {
        const response = await apiClient.put<ApiResponse<Teacher>>(`/teachers/${id}`, teacherData);
        return response.data;
    },
    deleteTeacher: async (id: string): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<ApiResponse<void>>(`/teachers/${id}`);
        return response.data;
    },
};