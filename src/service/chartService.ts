import apiClient from "../api/apiClient";

export const chartService = {
    listGenderByGrade: async () =>{
        const response = await apiClient.get("/marks/gender");
        return response.data;
    },

    calculateAverageMarks: async (payload: { grade: number; division: string }) =>{
        const response = await apiClient.put("/marks/average-marks", payload);
        return response.data;
    }
}