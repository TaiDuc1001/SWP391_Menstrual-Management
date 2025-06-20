import axios from '../axios';

export interface ApprovalRequest {
    id: number;
    patientName: string;
    doctorName: string;
    requestType: string;
    description: string;
    status: string;
    submittedAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
    comments?: string;
    attachments?: string[];
}

export interface ApprovalFilters {
    status?: string;
    requestType?: string;
    doctorId?: number;
    patientId?: number;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export const approvalService = {
    async getApprovalRequests(filters?: ApprovalFilters): Promise<{ data: ApprovalRequest[]; total: number }> {
        const response = await axios.get('/approval-requests', {params: filters});
        return response.data;
    },

    async getApprovalRequest(id: number): Promise<ApprovalRequest> {
        const response = await axios.get(`/approval-requests/${id}`);
        return response.data;
    },

    async createApprovalRequest(requestData: Partial<ApprovalRequest>): Promise<ApprovalRequest> {
        const response = await axios.post('/approval-requests', requestData);
        return response.data;
    },

    async updateApprovalRequest(id: number, requestData: Partial<ApprovalRequest>): Promise<ApprovalRequest> {
        const response = await axios.put(`/approval-requests/${id}`, requestData);
        return response.data;
    },

    async approveRequest(id: number, comments?: string): Promise<ApprovalRequest> {
        const response = await axios.post(`/approval-requests/${id}/approve`, {comments});
        return response.data;
    },

    async rejectRequest(id: number, comments: string): Promise<ApprovalRequest> {
        const response = await axios.post(`/approval-requests/${id}/reject`, {comments});
        return response.data;
    },

    async bulkApprove(ids: number[], comments?: string): Promise<void> {
        await axios.post('/approval-requests/bulk-approve', {ids, comments});
    },

    async bulkReject(ids: number[], comments: string): Promise<void> {
        await axios.post('/approval-requests/bulk-reject', {ids, comments});
    },

    async exportApprovalRequests(ids?: number[]): Promise<Blob> {
        const response = await axios.post('/approval-requests/export', {ids}, {
            responseType: 'blob'
        });
        return response.data;
    }
};
