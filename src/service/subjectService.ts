import apiClient from "../api/apiClient";
import type { ApiResponse, CreateSubjectInput, Subject } from "../api/types";



export const subjectService = {
    getAllSubjects: async (page: number, size: number): Promise<ApiResponse<Subject[]>> => {
        const response = await apiClient.get<ApiResponse<Subject[]>>(`/subjects?page=${page}&size=${size}`);
        return response.data;
    },
    getSubjectById: async (id: string): Promise<ApiResponse<Subject>> => {
        const response = await apiClient.get<ApiResponse<Subject>>(`/subjects/${id}`);
        return response.data;
    },
    createSubject: async (subjectData: CreateSubjectInput): Promise<ApiResponse<Subject>> => {
        const response = await apiClient.post<ApiResponse<Subject>>("/subjects/create", subjectData);
        return response.data;
    },
    updateSubject: async (id: string, subjectData: Partial<CreateSubjectInput>): Promise<ApiResponse<Subject>> => {
        const { name, code } = subjectData;
        const cleanData = { name, code };
        const response = await apiClient.put<ApiResponse<Subject>>(`/subjects/${id}`, cleanData);
        return response.data;
    },
    deleteSubject: async (id: string): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<ApiResponse<void>>(`/subjects/${id}`);
        return response.data;
    },
}